import { execSync } from 'child_process';
import { Console, Command, createSpinner } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as commander from 'commander';

const RAKUTEN = {
  SITE_ID: process.env.RAKUTEN_SITE_ID || '',
  FTP_USERNAME: process.env.RAKUTEN_FTP_USERNAME || '',
  FTP_PASSWORD: process.env.RAKUTEN_FTP_PASSWORD || '',
};

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

    const advertiser = { mid: '' };

    execSync(`wget ftp://aftp.linksynergy.com/${advertiser.mid}_${RAKUTEN.SITE_ID}_mp.txt.gz \
        --ftp-user ${RAKUTEN.FTP_USERNAME} \
        --ftp-password ${RAKUTEN.FTP_PASSWORD} \
        -P ${catalogPath}`);

    // const lines = await this.readFile(`${catalogPath}/${mid}_${RAKUTEN_SITE_ID}_mp.txt`);
    // lines.shift();
    // lines.pop();
    // spin.info(`${lines?.length}`);

    //   const loopLength = Math.ceil(lines.length / QUEUE_BULK_SIZE);
    //   for (let i = 0; i < loopLength; i++) {
    //     const bulkLines = lines.splice(i * QUEUE_BULK_SIZE, (i + 1) * QUEUE_BULK_SIZE);
    //     // todo 큐에 jobId 지정
    //     const bulkEntities = bulkLines.map((line) => this.rakutenCatalogRepo.rowToEntity(line, shopCode));
    //     try {
    //       await this.backendCatalogService.addBulk(bulkEntities);
    //     } catch (e) {
    //       spin.warn(e);
    //     }
    //   }
    // }
  }
}
