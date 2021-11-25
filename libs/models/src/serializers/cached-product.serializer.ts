import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SyncedProductSerializer } from '@edit-trace/models';

export class CachedProductSerializer {
  constructor(attributes: Partial<CachedProductSerializer>) {
    Object.assign(this, attributes);
  }

  @ApiProperty() @Expose() cached: boolean;

  @ApiProperty() @Expose() product: SyncedProductSerializer;
}
