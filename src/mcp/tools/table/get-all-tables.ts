import { TableService } from "../../../api/xano/services/table/table.service.js";
import { GetAllTablesInput } from "../../types/tools.js";

export class GetAllTablesTool {
  constructor(private readonly tableService: TableService) {}

  static getMetadata() {
    return {
      name: "get_all_tables",
      description: "Get all tables in a workspace",
    };
  }

  static getInputSchema() {
    return {
      type: "object",
      properties: {
        workspaceId: {
          type: "number",
          description: "ID of the workspace",
        },
      },
      required: ["workspaceId"],
    };
  }

  async execute(input: GetAllTablesInput) {
    // We don't need to create a new table service since it's injected with the correct workspaceId
    const tables = await this.tableService.listAll();
    return tables.map((table) => ({
      ...table,
      workspaceId: input.workspaceId,
    }));
  }
}
