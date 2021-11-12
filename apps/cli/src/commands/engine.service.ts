import { Command, Console } from 'nestjs-console';

@Console({
  command: 'engine',
  alias: 'eng',
})
export class EngineService {
  constructor() {
    console.log('init');
  }

  @Command({ command: 'test' })
  async test() {
    console.log(11111);
    console.log(11111);
    console.log(11111);
    console.log(11111);
    console.log(11111);
    return null;
  }
}
