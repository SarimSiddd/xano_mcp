import { TableService } from "../../../api/xano/services/table/table.service.js";
import { GetTableContentInput } from "../../types/tools.js";

export class GetTableContentTool {
  constructor(private readonly tableService: TableService) {}

  static getMetadata() {
    return {
      name: "get_table_content",
      description: "Get content from a table",
    };
  }

  static getInputSchema() {
    return {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "ID of the table",
        },
        pagination: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description: "Page number",
            },
            items: {
              type: "number",
              description: "Items per page",
            },
          },
        },
      },
      required: ["tableId"],
    };
  }

  async execute(input: GetTableContentInput) {
    const contentService = this.tableService.getContentService(
      Number(input.tableId),
    );
    const response = await contentService.get(input.pagination);
    return response.data;
  }
}
