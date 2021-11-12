import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-console';

@Injectable()
export class EngineService {
  constructor() {
    console.log('init');
  }

  @Command({ command: 'test' })
  async test() {
    console.log(11111);
    console.log(11111);
    console.log(11111);
    return null;
  }
}
