import { workspace } from "../../models/workspace/workspace";
import { AxiosInstance, AxiosResponse } from "axios";

export class WorkspaceService {
  private readonly basePath = "/workspace";

  constructor(private readonly client: AxiosInstance) {}

  async get(): Promise<AxiosResponse<workspace>> {
    let response = this.client.get<workspace>(this.basePath);
    return response;
  }
}
