import { execSync } from 'child_process';
import { Console, Command, createSpinner } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as commander from 'commander';
import * as fs from 'fs';
import * as readline from 'readline';
import { Redis } from 'ioredis';
import { flatMap } from 'lodash';
import { RedisService } from 'nestjs-redis';
import * as dayjs from 'dayjs';

import { ArrayToObject } from '@edit-trace/utils';

import { ADVERTISERS, RAKUTEN_CATALOG_COLUMNS } from './constants';

@Console({ name: 'engine', alias: 'eng' })
export class EngineService {
  private redisClient: Redis;
  constructor(private elasticsearchService: ElasticsearchService, private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  @Command({
    command: 'update-catalog',
    options: [
      {
        flags: '-cp, --catalogPath <catalogPath>',
        description: 'catalog 경로',
        defaultValue: 'etc/catalogs',
        required: false,
      },
    ],
  })
  async updateCatalog(command: commander.Command) {
    const spin = createSpinner();
    const { catalogPath } = command.opts();
    const { RAKUTEN_SITE_ID } = process.env;
    const indexName = `product-${dayjs().format('YYYYMMDD')}`;

    spin.info('인덱스 생성');
    const hasIndex = await this.createIndex(indexName);
    if (!hasIndex) return spin.fail('인덱스 생성 실패');

    spin.info('카탈로그 다운로드');
    await EngineService.downloadCatalog(catalogPath);

    spin.info('상품 벌크 인서트');
    for (const advertiser of ADVERTISERS) {
      spin.info(`${advertiser.name} 업데이트`);
      const lines = await this.readFile(`${catalogPath}/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt`);
      spin.info(`${advertiser.name} 상품 수 : ${lines?.length}`);

      const productsInShop = lines.map((line) => ({
        '@timestamp': new Date(),
        ...ArrayToObject(
          line.split('|').map((el) => el.trim()),
          RAKUTEN_CATALOG_COLUMNS
        ),
      }));

      await EngineService.batchAction(productsInShop, async (productFragments) => {
        await this.elasticsearchService.bulk({
          body: flatMap(productFragments, (product) => [{ index: { _index: indexName } }, product]),
        });
      });
    }
  }

  private async createIndex(indexName: string): Promise<boolean> {
    const {
      body: { acknowledged },
    } = await this.elasticsearchService.indices.create({
      index: indexName,
      body: {
        settings: {
          number_of_shards: 5,
          number_of_replicas: process.env.MODE === 'prod' ? 1 : 0,
        },
        mappings: {},
      },
    });

    return acknowledged;
  }

  private static async downloadCatalog(catalogPath: string) {
    const { RAKUTEN_SITE_ID, RAKUTEN_FTP_USERNAME, RAKUTEN_FTP_PASSWORD } = process.env;
    for (const advertiser of ADVERTISERS) {
      try {
        execSync(`wget ftp://aftp.linksynergy.com/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt.gz \
        --ftp-user ${RAKUTEN_FTP_USERNAME} \
        --ftp-password ${RAKUTEN_FTP_PASSWORD} \
        -P ${catalogPath}`);
      } catch (e) {
        console.error(e);
      }
    }

    execSync(`gzip -d ${catalogPath}/*.gz`);
  }

  private async readFile(filePath: string): Promise<string[]> {
    const lines = [];
    if (fs.existsSync(filePath)) {
      await new Promise<void>((resolve) => {
        const fileStream = fs.createReadStream(filePath);
        const readLine = readline.createInterface({ input: fileStream });

        readLine.on('line', async (row) => lines.push(row));
        fileStream.on('end', () => resolve());
        fileStream.on('error', (err) => console.error(err));
      });
    }
    lines.shift();
    lines.pop();
    return lines;
  }

  private static async batchAction<T>(data: T[], action: (dataFragments: T[]) => Promise<unknown>, batchSize = 1000) {
    try {
      const loopLength = Math.ceil(data.length / batchSize);
      for (let i = 0; i < loopLength; i++) {
        const dataToProcess = data.splice(0, batchSize);
        await action(dataToProcess);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async cacheExistingProduct() {
    const batchSize = 1000;
    const existingProducts = [];

    const {
      body: { _scroll_id, hits },
    } = await this.elasticsearchService.search({
      index: 'products',
      scroll: '30s',
      size: batchSize,
    });
    existingProducts.push(...hits.hits);

    const totalLength = hits.total.value;
    const loopLength = totalLength / batchSize;
    for (let i = 0; i < loopLength; i++) {
      const {
        body: { hits },
      } = await this.elasticsearchService.scroll({
        scroll_id: _scroll_id,
        scroll: '30s',
      });
      existingProducts.push(...hits.hits);
    }

    await EngineService.batchAction(existingProducts, async (products) => {
      this.redisClient.sadd(
        'existingProductIds',
        products.map((product) => product._source.productId)
      );
    });
  }
}
