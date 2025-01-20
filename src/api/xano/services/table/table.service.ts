import { AxiosInstance, AxiosResponse } from "axios";
import {
  table,
  tableCreateParams,
  tableQueryParams,
} from "../../models/table/table";
import { paginatedResponse } from "../../models/common/pagination";

export class TableService {
  constructor(
    private readonly client: AxiosInstance,
    private readonly workspaceId: number,
  ) {}

  private get basePath(): string {
    return `/workspace/${this.workspaceId}/table`;
  }

  async post(data: tableCreateParams): Promise<AxiosResponse<table>> {
    return this.client.post<table>(this.basePath, data);
  }

  async get(
    params?: tableQueryParams,
  ): Promise<AxiosResponse<paginatedResponse<table>>> {
    return this.client.get<paginatedResponse<table>>(this.basePath, { params });
  }

  async listAll(): Promise<table[]> {
    const allTables: table[] = [];
    let currPage = 1;

    while (true) {
      const response = await this.get({ page: currPage });
      allTables.push(...response.data.items);

      if (!response.data.nextPage) {
        break;
      }

      currPage = response.data.nextPage;
    }

    return allTables;
  }
}
