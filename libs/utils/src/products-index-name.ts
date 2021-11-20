import dayjs from 'dayjs';

export function productsIndexName() {
  return `products-${dayjs().format('YYYYMMDD')}`;
}
