import { SortingState } from "@tanstack/react-table";

export interface IGetManyResponse<T> {
    data: T[],
    count: number,
    total: number,
    page: number,
    pageCount: number
}

export interface IFetchOptions {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    searchQuery: string;
}