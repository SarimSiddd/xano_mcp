import { workspace } from "../../models/workspace/workspace";
import { AxiosInstance, AxiosResponse } from "axios";
import { TableService } from "../table/table.service";

export class WorkspaceService {
  private readonly basePath = "/workspace";
  private tableServices: Map<number, TableService> = new Map();

  constructor(private readonly client: AxiosInstance) {}

  async get(): Promise<AxiosResponse<workspace[]>> {
    let response = this.client.get<workspace[]>(this.basePath);
    return response;
  }

  getTableService(workspaceId: number): TableService {
    let tableService = this.tableServices.get(workspaceId);

    if (!tableService) {
      tableService = new TableService(this.client, workspaceId);
      this.tableServices.set(workspaceId, tableService);
    }

    return tableService;
  }
}
