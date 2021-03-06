import { execSync } from 'child_process';
import { Console, Command, createSpinner } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as commander from 'commander';
import * as fs from 'fs';
import * as readline from 'readline';
import { flatMap } from 'lodash';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';

import { ArrayToObject, batchAction, productsIndexName } from '@edit-trace/utils';
import { BrowserFactory, BrowserOptionInterface, EngineFactory } from '@edit-trace/engine';
import { ADVERTISERS, RAKUTEN_CATALOG_COLUMNS } from './constants';

@Console({ name: 'engine', alias: 'eng' })
export class EngineService {
  constructor(private elasticsearchService: ElasticsearchService, private redisService: RedisService) {}

  @Command({
    command: 'run <shopCode>',
    options: [
      {
        flags: '-url, --targetUrl <url>',
        description: 'target url page to scrape',
        defaultValue:
          'https://www.bloomingdales.com/shop/product/salvatore-ferragamo-revival-leather-bifold-wallet?ID=139187&PartnerID=LINKSHARE&cm_mmc=LINKSHARE-_-n-_-n-_-n&m_sc=aff&PartnerID=LINKSHARE&utm_source=rakuten&utm_medium=affiliate&utm_campaign=affiliates&ranMID=13867&ranEAID=hA%2FO%2FiYzeic&ranSiteID=hA_O_iYzeic-wLOokMOLzssgSOrNRTRd1g&LinkshareID=hA_O_iYzeic-wLOokMOLzssgSOrNRTRd1g&ranPublisherID=hA%2FO%2FiYzeic&ranLinkID=8017580194427&ranLinkTypeID=15&pubNAME=Hied',
        required: false,
      },
    ],
  })
  async run(shopCode: string, command: commander.Command) {
    const spin = createSpinner();
    const { targetUrl } = command.opts();

    spin.info('Engine build');
    const shopEngine = await EngineFactory.build(shopCode);
    const browserOptions: BrowserOptionInterface = EngineFactory.scan(shopEngine);

    spin.info('Init browser & start Engine');
    const browser = await BrowserFactory.createBrowser(browserOptions);
    const product = await shopEngine.product(targetUrl, browser);

    spin.info('Save product data in Cache(Redis)');
    const client: Redis = this.redisService.getClient();
    await client.hset('product', product?.id, JSON.stringify(product));

    spin.info('Done');
    spin.clear();
  }

  @Command({
    command: 'update-catalog',
    options: [
      {
        flags: '-cp, --catalogPath <catalogPath>',
        description: 'catalog ??????',
        defaultValue: 'etc/catalogs',
        required: false,
      },
    ],
  })
  async updateCatalog(command: commander.Command) {
    const spin = createSpinner();
    const { catalogPath } = command.opts();
    const { RAKUTEN_SITE_ID } = process.env;
    const indexName = productsIndexName();

    spin.info('????????? ??????');
    const hasIndex = await this.createIndex(indexName);
    if (!hasIndex) return spin.fail('????????? ?????? ??????');

    spin.info('???????????? ??????');
    execSync(`rm ${catalogPath}/*`);

    spin.info('???????????? ????????????');
    await EngineService.downloadCatalog(catalogPath);

    spin.info('?????? ?????? ?????????');
    const timestamp = new Date();
    for (const advertiser of ADVERTISERS) {
      spin.info(`${advertiser.name} ????????????`);
      const lines = await this.readFile(`${catalogPath}/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt`);
      spin.info(`${advertiser.name} ?????? ??? : ${lines?.length}`);

      const productsInShop = lines.map((line) => ({
        timestamp,
        shopCode: advertiser.shopCode,
        ...ArrayToObject(
          line.split('|').map((el) => el.trim()),
          RAKUTEN_CATALOG_COLUMNS
        ),
      }));

      await batchAction(productsInShop, async (productFragments) => {
        await this.elasticsearchService.bulk({
          body: flatMap(productFragments, (product) => [
            { index: { _index: indexName, _id: product.productId } },
            product,
          ]),
        });
      });
    }
  }

  private async createIndex(indexName: string): Promise<boolean> {
    let created = false;
    try {
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
      created = acknowledged;
    } catch (e) {
      console.error(e);
    }

    return created;
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
}
