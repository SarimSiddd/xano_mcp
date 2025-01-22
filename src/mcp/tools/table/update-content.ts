import { TableService } from "../../../api/xano/services/table/table.service.js";
import { UpdateTableContentInput } from "../../types/tools.js";

export class UpdateTableContentTool {
  constructor(private readonly tableService: TableService) {}

  static getMetadata() {
    return {
      name: "update_table_content",
      description: "Update content in a table",
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
        contentId: {
          type: "string",
          description: "ID of the content to update",
        },
        content: {
          type: "object",
          description: "Updated content data",
          additionalProperties: true,
        },
      },
      required: ["tableId", "contentId", "content"],
    };
  }

  async execute(input: UpdateTableContentInput) {
    const contentService = this.tableService.getContentService(
      Number(input.tableId),
    );
    const response = await contentService.put(
      Number(input.contentId),
      input.content,
    );
    return response.data;
  }
}
