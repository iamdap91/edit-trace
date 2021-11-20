import { EngineInterface } from './interfaces';

export class BaseEngine implements EngineInterface {
  async product(targetUrl, browser);
  async product() {
    throw new Error('product 기능 개발중');
  }
}
