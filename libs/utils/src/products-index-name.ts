import * as dayjs from 'dayjs';

export function productsIndexName() {
  return `product-${dayjs().format('YYYYMMDD')}`;
}
