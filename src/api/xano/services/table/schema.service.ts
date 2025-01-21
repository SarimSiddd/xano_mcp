import { AxiosInstance, AxiosResponse } from "axios";
import { schema } from "../../models/table/schema/schema";

export class SchemaService {
  constructor(
    private readonly client: AxiosInstance,
    private readonly workspaceId: number,
    private readonly tableId: number,
  ) {}

  private get basePath(): string {
    return `/workspace/${this.workspaceId}/table/${this.tableId}/schema`;
  }

  async get(): Promise<AxiosResponse<schema[]>> {
    return this.client.get<schema[]>(this.basePath);
  }
}
