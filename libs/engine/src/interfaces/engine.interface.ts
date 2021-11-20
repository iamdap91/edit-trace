import { FormattedProductInterface } from './formatted-product.interface';

export class EngineInterface {
  product: (targetUrl, browser) => Promise<FormattedProductInterface>;
}
