import { Console, Command } from 'nestjs-console';

@Console({ name: 'engine', alias: 'eng' })
export class EngineService {
  @Command({ command: 'getFile' })
  async getFile() {
    console.log('getFile');
  }

  @Command({ command: 'insert' })
  async insert() {
    console.log('insert');
  }
}
