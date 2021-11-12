import { Console, Command } from 'nestjs-console';

@Console({ name: 'elasticsearch', alias: 'es' })
export class EsCommandService {
  @Command({ command: 'create-index <name>' })
  async createIndex() {
    console.log('인덱스 생성');
  }
}
