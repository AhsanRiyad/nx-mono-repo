import { FindManyOptions, FindOptionsRelations, FindOptionsWhere } from "typeorm"

export class EntitySearchModel<T> {
    pageSize?: number
    pageIndex?: number
    orderBy?: keyof T
    orderMode?: "ASC" | "DESC" = "ASC"
    search?: FindOptionsWhere<T> | FindOptionsWhere<T>[]
    addtional?: (options: FindManyOptions) => void
    relations?: FindOptionsRelations<T>;
    select?: (keyof T)[]
}