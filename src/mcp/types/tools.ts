import { paginationParams } from "../../api/xano/models/common/pagination";

// Table Tool Input Types
export interface CreateTableInput {
  name: string;
  workspaceId: number;
  description?: string;
  docs?: string;
}

export interface GetTableContentInput {
  workspaceId: string;
  tableId: string;
  pagination?: paginationParams;
  filter?: Record<string, any>;
}

export interface AddTableContentInput {
  tableId: string;
  content: Record<string, any>;
}

export interface UpdateTableContentInput {
  tableId: string;
  contentId: string;
  content: Record<string, any>;
}

export interface DeleteTableContentInput {
  tableId: string;
  contentId: string;
}

// Workspace Tool Input Types
export interface ListWorkspacesInput {
  pagination?: paginationParams;
}

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
}
