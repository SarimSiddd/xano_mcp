export interface table {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  docs: string;
  guid: string;
  auth: boolean;
}

export interface tableQueryParams {
  page?: number;
  itemsPerPage?: number;
}
