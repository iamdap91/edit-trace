import { Console, Command } from 'nestjs-console';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Console({ name: 'elasticsearch', alias: 'es' })
export class EsCommandService {
  constructor(private elasticsearchService: ElasticsearchService) {}

  @Command({ command: 'create-index <name>' })
  async createIndex(name: string) {
    const res = await this.elasticsearchService.indices.create({
      index: name,
      body: {
        settings: {
          number_of_shards: 5,
          number_of_replicas: process.env.MODE === 'prod' ? 1 : 0,
        },
        mappings: {},
      },
    });

    console.log(res.body);
    console.log('인덱스 생성');
  }
}
