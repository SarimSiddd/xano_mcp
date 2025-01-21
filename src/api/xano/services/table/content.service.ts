import { content } from "../../models/table/content/content";
import {
  paginationParams,
  paginatedResponse,
} from "../../models/common/pagination";
import { AxiosInstance, AxiosResponse } from "axios";

export class ContentService {
  constructor(
    private readonly client: AxiosInstance,
    private readonly workspaceId: number,
    private readonly tableId: number,
  ) {}

  private get basePath(): string {
    return `/workspace/${this.workspaceId}/table/${this.tableId}/content`;
  }

  async get(
    params?: paginationParams,
  ): Promise<AxiosResponse<paginatedResponse<content>>> {
    return this.client.get<paginatedResponse<content>>(this.basePath, {
      params,
    });
  }

  async listAll(): Promise<content[]> {
    const allContent: content[] = [];
    let currPage = 1;

    while (true) {
      const response = await this.get({ page: currPage });
      allContent.push(...response.data.items);

      if (!response.data.nextPage) {
        break;
      }

      currPage = response.data.nextPage;
    }

    return allContent;
  }
}
