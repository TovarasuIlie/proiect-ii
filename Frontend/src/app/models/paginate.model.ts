export interface PaginateConfig {
    currentPageName: string;
    totalItems: number | 0;
    currentPage: number | 1;
    itemsPerPage: number | 10;
}