import { execSync } from 'child_process';
import { Console, Command, createSpinner } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as commander from 'commander';
import * as fs from 'fs';
import * as readline from 'readline';
import * as parse from 'csv-parse';

const ADVERTISERS = [
  { name: '블루밍데일즈', mid: 13867, deliveryToKorea: true, shopCode: 'A024' },
  // { name: '메이시스', mid: 37978, deliveryToKorea: true, shopCode: 'A025' },
  { name: '매치스패션', mid: 39265, deliveryToKorea: true, shopCode: 'A006' },
  // { name: '스플렌디드', mid: 42623, deliveryToKorea: true, shopCode: 'A035' },
  // { name: '앤 테일러', mid: 43432, deliveryToKorea: true, shopCode: 'B003' },
  // { name: '샵밥', mid: 43802, deliveryToKorea: true, shopCode: 'A017' },
  // { name: '이스트데인', mid: 43804, deliveryToKorea: true, shopCode: 'A027' },
  // { name: '더 더블 에프', mid: 44328, deliveryToKorea: true, shopCode: 'A033' },
  // { name: '하비니콜스', mid: 44787, deliveryToKorea: true, shopCode: 'A011' },
  // { name: '칼토티 부티크', mid: 45516, deliveryToKorea: true, shopCode: 'A044' },
  // { name: '유케이사커샵', mid: 46108, deliveryToKorea: true, shopCode: 'A036' },
];

@Console({ name: 'engine', alias: 'eng' })
export class EngineService {
  constructor(private elasticsearchService: ElasticsearchService) {}

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
    const { RAKUTEN_SITE_ID, RAKUTEN_FTP_USERNAME, RAKUTEN_FTP_PASSWORD } = process.env;

    // spin.info('Downloading Catalog');
    // for (const advertiser of ADVERTISERS) {
    //   execSync(`wget ftp://aftp.linksynergy.com/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt.gz \
    //     --ftp-user ${RAKUTEN_FTP_USERNAME} \
    //     --ftp-password ${RAKUTEN_FTP_PASSWORD} \
    //     -P ${catalogPath}`);
    // }
    //
    // spin.info('Deflating gzip');
    // execSync(`gzip -d ${catalogPath}/*.gz`);

    spin.info('Update Index');
    for (const advertiser of ADVERTISERS) {
      const lines = await this.readFile(`${catalogPath}/${advertiser.mid}_${RAKUTEN_SITE_ID}_mp.txt`);
      lines.shift();
      lines.pop();
      spin.info(`${advertiser.name} 상품 수 : ${lines?.length}`);

      await EngineService.batchAction(lines, async (lineFragments) => {
        for (const line of lineFragments) {
          const t = line.split('|').map((el) => el.trim());
          const [
            productId,
            productName,
            skuNumber,
            primaryCategory,
            secondaryCategory,
            productUrl,
            productImageUrl,
            buyUrl,
            shortProductDescription,
            longProductDescription,
            discount,
            discountType,
            salePrice,
            retailPrice,
            beginDate,
            endDate,
            brand,
            shipping,
            keywords,
            manufacturerPart,
            manufacturerName,
            shippingInformation,
            availability,
            universalProductCode,
            classId,
            currency,
            m1,
            pixel,
          ] = t;

          console.log({
            productId,
            productName,
            skuNumber,
            primaryCategory,
            secondaryCategory,
            productUrl,
            productImageUrl,
            buyUrl,
            shortProductDescription,
            longProductDescription,
            discount,
            discountType,
            salePrice,
            retailPrice,
            beginDate,
            endDate,
            brand,
            shipping,
            keywords,
            manufacturerPart,
            manufacturerName,
            shippingInformation,
            availability,
            universalProductCode,
            classId,
            currency,
            m1,
            pixel,
          });
        }

        // const res = await this.elasticsearchService.index({
        //   index: process.env.ELASTICSEARCH_PRODUCT_INDEX || 'products',
        //   body: {},
        // });
        // return !!res.body;
        return true;
      });
    }
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
    return lines;
  }

  private static async batchAction<T>(data: T[], action: (dataFragments: T[]) => Promise<boolean>, batchSize = 1000) {
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
}
