import { A024Service } from './A024.service';
import { BaseEngine } from '../base-engine';

export default class Engine implements BaseEngine {
  private service: A024Service;

  constructor() {
    this.service = new A024Service();
  }

  async product(): Promise<unknown> {
    console.log(11111);
    return Promise.resolve(undefined);
  }
}
