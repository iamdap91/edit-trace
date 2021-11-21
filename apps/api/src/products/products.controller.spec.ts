import { Test, TestingModule } from '@nestjs/testing';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigElasticsearchModule],
      providers: [ProductsService],
      controllers: [ProductsController],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findOne', async () => {
    const product = await controller.findOne('671194750660');
    expect(product.productId).toEqual('671194750660');
    expect(product['@timestamp']).toBeUndefined();
  });

  it('find', async () => {
    const products = await controller.find({ from: 10, size: 20 });
    expect(typeof products.length).toEqual('number');
    expect(products.length).toEqual(20);
  });
});
