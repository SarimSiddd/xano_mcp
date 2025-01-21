type DataValue = string | number | boolean | null | Date | Array<any> | object;

export interface content {
  [key: string]: DataValue;
}
