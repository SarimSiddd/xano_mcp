export interface schema {
  name: string;
  type: any;
  description: string;
  nullable: boolean;
  default: string;
  required: boolean;
  access: string;
  style: string;
  tableref_id?: number;
  //TODO: Add support for validators
}
