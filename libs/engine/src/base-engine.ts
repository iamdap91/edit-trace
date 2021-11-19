import { EngineInterface } from './interfaces';

export class BaseEngine implements EngineInterface {
  async product(targetUrl, options);
  async product() {
    throw new Error('product 기능 개발중');
  }
}
