import { TableService } from "../../../api/xano/services/table/table.service.js";
import { AddTableContentInput } from "../../types/tools.js";

export class AddTableContentTool {
  constructor(private readonly tableService: TableService) {}

  static getMetadata() {
    return {
      name: "add_table_content",
      description: "Add content to a table",
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
        content: {
          type: "object",
          description: "Content to add to the table",
          additionalProperties: true,
        },
      },
      required: ["tableId", "content"],
    };
  }

  async execute(input: AddTableContentInput) {
    const contentService = this.tableService.getContentService(
      Number(input.tableId),
    );
    const response = await contentService.post(input.content);
    return response.data;
  }
}
