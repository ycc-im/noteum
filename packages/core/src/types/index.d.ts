export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message?: string;
}
export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface PaginatedData<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}
//# sourceMappingURL=index.d.ts.map