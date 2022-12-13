interface IReturnType<> {
    data: any;
    status: boolean,
    message: string,
    meta: {
        total: number;
        from: number;
        to: number;
        currentPage: number;
        nextPage: number;
        prevPage: number;
        lastPage: number;
    }
}

export { IReturnType };
