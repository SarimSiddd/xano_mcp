import { schema } from "../models/table/schema/schema";

type DataValue = string | number | boolean | null | Date | Array<any> | object;
interface DataResponse {
  [key: string]: DataValue;
}
export class typeValidator {
  //Contains mapping from XanoDB Type to Typescript type
  private static readonly typeMap = new Map<string, string>([
    // Number types
    ["int", "number"],
    ["integer", "number"],
    ["smallint", "number"],
    ["bigint", "number"],
    ["float", "number"],
    ["double", "number"],
    ["decimal", "number"],
    ["numeric", "number"],
    ["real", "number"],
    ["money", "number"],
    ["smallmoney", "number"],

    // String types
    ["varchar", "string"],
    ["nvarchar", "string"],
    ["char", "string"],
    ["nchar", "string"],
    ["text", "string"],
    ["ntext", "string"],
    ["xml", "string"],
    ["uuid", "string"],
    ["guid", "string"],
    ["json", "string"],

    // Boolean types
    ["bool", "boolean"],
    ["boolean", "boolean"],
    ["bit", "boolean"],

    // Date/Time types
    ["date", "date"],
    ["time", "date"],
    ["datetime", "date"],
    ["datetime2", "date"],
    ["datetimeoffset", "date"],
    ["timestamp", "number"],
    ["interval", "date"],

    // Array types
    ["array", "array"],
    ["list", "array"],
    ["set", "array"],

    // Object types
    ["object", "object"],
    ["jsonb", "object"],
    ["struct", "object"],

    // Already matching TypeScript types
    ["string", "string"],
    ["number", "number"],
    ["boolean", "boolean"],
  ]);

  private static readonly validators = new Map<string, (value: any) => boolean>(
    [
      ["string", (value: any): boolean => typeof value === "string"],
      [
        "number",
        (value: any): boolean => typeof value === "number" && !isNaN(value),
      ],
      ["boolean", (value: any): boolean => typeof value === "boolean"],
      [
        "date",
        (value: any): boolean =>
          value instanceof Date && !isNaN(value.getTime()),
      ],
      ["array", (value: any): boolean => Array.isArray(value)],
      [
        "object",
        (value: any): boolean =>
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          !(value instanceof Date),
      ],
    ],
  );

  public static readonly supportedTypes: ReadonlySet<string> = new Set([
    ...this.typeMap.keys(),
  ]);

  public static mapType(type: string): string {
    const mappedType = this.typeMap.get(type);
    if (!mappedType) {
      throw new Error(`Unsupported type ${type}`);
    }

    return mappedType;
  }

  public static validate(value: any, type: string): boolean {
    const mappedType = this.mapType(type);
    const validator = this.validators.get(mappedType);

    if (!validator) {
      throw new Error(
        `No validator found for type: ${type} (mapped to ${mappedType})`,
      );
    }

    return validator(value);
  }

  public static getTypeScriptType(type: string): string {
    return this.mapType(type);
  }
}

export function getValuesUsingSchema(
  tableSchema: schema[],
  data: DataResponse,
): Map<string, DataValue> {
  const values = new Map<string, DataValue>();

  for (const schemaObject of tableSchema) {
    const value = data[schemaObject.name];

    if (value == undefined) {
      throw new Error(`Missing required field: ${schemaObject.name}`);
    }

    try {
      if (!typeValidator.validate(value, schemaObject.type)) {
        throw new Error(
          `Invalid type for ${schemaObject.name}. Expected ${typeValidator.getTypeScriptType(schemaObject.type)}, got ${typeof value}`,
        );
      }
      values.set(schemaObject.name, value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Validation error for field ${schemaObject.name}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  return values;
}
