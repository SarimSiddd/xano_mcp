import { WorkspaceService } from "../../../api/xano/services/workspace/workspace.service.js";

export class GetWorkspacesTool {
  constructor(private readonly workspaceService: WorkspaceService) {}

  static getMetadata() {
    return {
      name: "get_workspaces",
      description: "Get all available workspaces",
    };
  }

  static getInputSchema() {
    return {
      type: "object",
      properties: {},
      additionalProperties: false,
    };
  }

  async execute() {
    const response = await this.workspaceService.get();
    return response.data;
  }
}
