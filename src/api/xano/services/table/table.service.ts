import { AxiosInstance, AxiosResponse } from "axios";
import { table, tableCreateParams } from "../../models/table/table";
import {
  paginatedResponse,
  paginationParams,
} from "../../models/common/pagination";
import { idResponse } from "../../models/common/types";
import { SchemaService } from "./schema.service";
import { ContentService } from "./content.service";

export class TableService {
  private schemaServices: Map<number, SchemaService> = new Map();
  private contentServices: Map<number, ContentService> = new Map();

  constructor(
    private readonly client: AxiosInstance,
    private readonly workspaceId: number,
  ) {}

  private get basePath(): string {
    return `/workspace/${this.workspaceId}/table`;
  }

  async post(data: tableCreateParams): Promise<AxiosResponse<idResponse>> {
    return this.client.post<idResponse>(this.basePath, data);
  }

  async delete(id: number): Promise<AxiosResponse<null>> {
    return this.client.delete(this.basePath + `/${id}`);
  }

  async get(
    params?: paginationParams,
  ): Promise<AxiosResponse<paginatedResponse<table>>> {
    return this.client.get<paginatedResponse<table>>(this.basePath, { params });
  }

  getContentService(tableId: number): ContentService {
    let contentService = this.contentServices.get(tableId);

    if (!contentService) {
      contentService = new ContentService(
        this.client,
        this.workspaceId,
        tableId,
      );
      this.contentServices.set(tableId, contentService);
    }

    return contentService;
  }

  getSchemaService(tableId: number): SchemaService {
    let schemaService = this.schemaServices.get(tableId);

    if (!schemaService) {
      schemaService = new SchemaService(this.client, this.workspaceId, tableId);
      this.schemaServices.set(tableId, schemaService);
    }

    return schemaService;
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
