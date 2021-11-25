import { SyncedProductSerializer } from '@edit-trace/models';

export class EngineInterface {
  product: (targetUrl, browser) => Promise<SyncedProductSerializer>;
}
