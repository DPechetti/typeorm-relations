// for those who want to understand: https://github.com/typeorm/typeorm/issues/873

// / ColumnNumericTransformer
export default class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}
