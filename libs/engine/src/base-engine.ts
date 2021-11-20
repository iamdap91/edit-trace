import { EngineInterface, FormattedProductInterface } from './interfaces';

export class BaseEngine implements EngineInterface {
  async product(targetUrl, browser): Promise<FormattedProductInterface>;
  async product(): Promise<FormattedProductInterface> {
    throw new Error('product 기능 개발중');
  }
}
