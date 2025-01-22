import { TableService } from "../../../api/xano/services/table/table.service";
import { CreateTableInput } from "../../types/tools";
import { tableCreateParams } from "../../../api/xano/models/table/table";

/**
 * MCP tool for creating a new table in a workspace
 */
export class CreateTableTool {
  constructor(private tableService: TableService) {}

  /**
   * Execute the table creation
   * @param input CreateTableInput containing the table details
   * @returns Promise<number> The created table's ID
   */
  public async execute(input: CreateTableInput): Promise<number> {
    try {
      const params: tableCreateParams = {
        name: input.name,
        description: input.description,
        docs: input.docs,
      };
      const response = await this.tableService.post(params);
      return response.data.id;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create table: ${error.message}`);
      }
      throw new Error("Failed to create table: Unknown error");
    }
  }

  /**
   * Get the JSON Schema for tool input validation
   * @returns object The JSON Schema for input validation
   */
  public static getInputSchema(): object {
    return {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the table to create",
        },
        workspaceId: {
          type: "number",
          description: "ID of the workspace to create the table in",
        },
        description: {
          type: "string",
          description: "Optional description for the table",
        },
        docs: {
          type: "string",
          description: "Optional documentation for the table",
        },
      },
      required: ["name", "workspaceId"],
      additionalProperties: false,
    };
  }

  /**
   * Get the tool's metadata for MCP registration
   */
  public static getMetadata(): {
    name: string;
    description: string;
    version: string;
  } {
    return {
      name: "create_table",
      description: "Create a new table in a workspace",
      version: "1.0.0",
    };
  }
}
