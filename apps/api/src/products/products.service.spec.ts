import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';

describe('Products', () => {
  let provider: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigElasticsearchModule],
      providers: [ProductsService],
    }).compile();

    provider = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('findOneHistory', async () => {
    const history = await provider.findOneHistory('671194750660');
    console.log(history);
  });
});
