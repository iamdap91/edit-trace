// todo unknown 타입은 업뎃칠것
export interface NativeProductAPIResponse {
  review: {
    hasError: boolean;
    includes: { products: unknown[] };
    totalResult: number;
    locale: string;
    review: unknown[];
  };
}
