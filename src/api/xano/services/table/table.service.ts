import { AxiosInstance, AxiosResponse } from "axios";
import { table } from "../../models/table/table";

export class TableService {
  constructor(
    private readonly client: AxiosInstance,
    private readonly workspaceId: number,
  ) {}

  private get basePath(): string {
    return `/workspace/${this.workspaceId}/table`;
  }

  async get(): Promise<AxiosResponse<table[]>> {
    return this.client.get(this.basePath);
  }
}
