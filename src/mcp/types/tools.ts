import { paginationParams } from "../../api/xano/models/common/pagination";

// Table Tool Input Types
export interface CreateTableInput {
  name: string;
  workspaceId: number;
  description?: string;
  docs?: string;
}

export interface GetTableContentInput {
  workspaceId: number;
  tableId: number;
  pagination?: paginationParams;
  filter?: Record<string, any>;
}

export interface AddTableContentInput {
  workspaceId: number;
  tableId: number;
  content: Record<string, any>;
}

export interface UpdateTableContentInput {
  workspaceId: number;
  tableId: number;
  contentId: string;
  content: Record<string, any>;
}

export interface DeleteTableContentInput {
  workspaceId: number;
  tableId: number;
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
