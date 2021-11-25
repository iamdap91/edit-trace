import { SyncedProductSerializer } from '@edit-trace/models';
import { EngineInterface } from './interfaces';

export class BaseEngine implements EngineInterface {
  async product(targetUrl, browser): Promise<SyncedProductSerializer>;
  async product(): Promise<SyncedProductSerializer> {
    throw new Error('product 기능 개발중');
  }
}
