export interface paginatedResponse<T> {
  items: T[];
  currPage: number;
  nextPage?: number;
  prevPage?: number;
}

export interface paginationParams {
  page?: number;
  itemsPerPage?: number;
}
