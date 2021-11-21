import { Console, Command } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as commander from 'commander';

@Console({ name: 'elasticsearch', alias: 'es' })
export class EsCommandService {
  constructor(private elasticsearchService: ElasticsearchService) {}

  @Command({
    command: 'create-index',
    options: [{ required: false, flags: '-n --name <name>', defaultValue: 'products', description: '인덱스 생섣' }],
  })
  async createIndex(command: commander.Command) {
    const index = command.opts().name;
    const {
      body: { acknowledged },
    } = await this.elasticsearchService.indices.create({
      index,
      body: {
        settings: {
          number_of_shards: 5,
          number_of_replicas: process.env.MODE === 'prod' ? 1 : 0,
        },
        mappings: {},
      },
    });

    if (acknowledged) console.log(`${index} 인덱스 생성됨`);
  }

  @Command({
    command: 're-index <source> <dest>',
  })
  async reIndex(source: string, dest: string) {
    await this.elasticsearchService.reindex({
      body: {
        source: { index: source },
        dest: { index: dest },
      },
    });
  }
}
