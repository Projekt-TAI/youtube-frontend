export type PaginatedResponse<T> = {
	pageSize: number;
	pageNumber: number;
	hasMore: boolean;
	result: T[]
}