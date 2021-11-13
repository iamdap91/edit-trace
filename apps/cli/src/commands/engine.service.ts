import { execSync } from 'child_process';
import { Console, Command, createSpinner } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as commander from 'commander';
import * as fs from 'fs';
import { ArrayToObject } from '@edit-trace/utils';

import * as readline from 'readline';

import { ADVERTISERS, RAKUTEN_CATALOG_COLUMNS } from './constants';
import { RedisService } from 'nestjs-redis';

@Console({ name: 'engine', alias: 'eng' })
export class EngineService {
  private redisClient;
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
    // const spin = createSpinner();
    // const { catalogPath } = command.opts();
    // const { RAKUTEN_SITE_ID } = process.env;
    //
    // spin.info('Downloading Catalog');
    // await EngineService.downloadCatalog(catalogPath);
    //
    // for (const advertiser of ADVERTISERS) {
    //   spin.info(`${advertiser.name} 업데이트`);
    //   const lines = await this.readFile(`${catalogPath}/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt`);
    //   spin.info(`${advertiser.name} 상품 수 : ${lines?.length}`);
    //
    //   // todo 천개씩 루프돌면서 redis에 값 있으면 single update, 아니면 bulk
    //   for (const line of lines) {
    //     const parsed = {
    //       '@timestamp': new Date(),
    //       ...ArrayToObject(
    //         line.split('|').map((el) => el.trim()),
    //         RAKUTEN_CATALOG_COLUMNS
    //       ),
    //     };
    //   }
    //
    //   // await EngineService.batchAction(lines, async (lineFragments) => {
    //   //   const bulkData = [];
    //   //   for (const line of lineFragments) {
    //   //     bulkData.push(
    //   //       { index: { _index: 'product' } },
    //   //       {
    //   //         '@timestamp': new Date(),
    //   //         ...ArrayToObject(
    //   //           line.split('|').map((el) => el.trim()),
    //   //           RAKUTEN_CATALOG_COLUMNS
    //   //         ),
    //   //       }
    //   //     );
    //   //   }
    //   //
    //   //   // await this.elasticsearchService.bulk({ body: bulkData });
    //   //
    //   //   // await this.elasticsearchService.bulk()
    //   //   // for (const line of lineFragments) {
    //   //   //   const parsedObject = ArrayToObject(
    //   //   //     line.split('|').map((el) => el.trim()),
    //   //   //     RAKUTEN_CATALOG_COLUMNS
    //   //   //   );
    //   //   //
    //   //   //   // await this.elasticsearchService.index({
    //   //   //   //   index: process.env.ELASTICSEARCH_PRODUCT_INDEX || 'products',
    //   //   //   //   body: {
    //   //   //   //     '@timestamp': new Date(),
    //   //   //   //     ...parsedObject,
    //   //   //   //   },
    //   //   //   // });
    //   //   // }
    //   // });
    // }
  }

  private static async downloadCatalog(catalogPath: string) {
    const { RAKUTEN_SITE_ID, RAKUTEN_FTP_USERNAME, RAKUTEN_FTP_PASSWORD } = process.env;
    for (const advertiser of ADVERTISERS) {
      execSync(`wget ftp://aftp.linksynergy.com/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt.gz \
        --ftp-user ${RAKUTEN_FTP_USERNAME} \
        --ftp-password ${RAKUTEN_FTP_PASSWORD} \
        -P ${catalogPath}`);
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
        'ids',
        products.map((product) => product._source.productId)
      );
    });
  }
}
