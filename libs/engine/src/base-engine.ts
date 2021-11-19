import { EngineInterface } from './interfaces';

export class BaseEngine implements EngineInterface {
  async product();
  async product() {
    throw new Error('product 기능 개발중');
  }
}
