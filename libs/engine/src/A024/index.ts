import { A024Service } from './A024.service';

export default class Engine {
  private service: A024Service;

  constructor() {
    this.service = new A024Service();
  }

  test() {
    console.log(123123123123);
  }
}
