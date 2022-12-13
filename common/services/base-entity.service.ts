import { CommonEntity } from "../../common/entities/common-entity.js";
import { EntitySearchModel } from "../../common/models/entity-search.model.js";
import { FindManyOptions, FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.d.js";

export class BaseEntityService<Entity extends CommonEntity> {
    constructor(private repository: Repository<Entity>) {}

    async searchAsync({ orderBy, orderMode, pageIndex, pageSize, select, search, relations, addtional }: EntitySearchModel<Entity>) {
        const findOptions: FindManyOptions<Entity> = {};

        if (orderBy) {
            findOptions.order = {
                [orderBy]: orderMode
            } as FindOptionsOrder<Entity>
        }
        if (pageSize) {
            findOptions.take = pageSize;
        }
        if (pageIndex) {
            findOptions.skip = pageIndex * pageSize ?? 25;
        }

        if (search) {
            findOptions.where = search;
        }

        if (relations) {
            findOptions.relations = relations
        }

        if (select) {
            findOptions.select = select.reduce((p, c) => ({
                ...p,
                [c]: true
            }), {} as FindOptionsSelect<Entity>)
        }

        if (addtional) {
            addtional(findOptions);
        }

        return await this.repository.findAndCount(findOptions);
    }

    async getByIdAsync(id: string) {
        return await this.repository.findOneBy({ id } as FindOptionsWhere<Entity>);
    }

    async insertAsync(data: QueryDeepPartialEntity<Entity>) {
        const newEntity = await this.repository.insert(data);
        const id = newEntity.identifiers.find(x => x.id);

        // if (id) {
        //     data?.id = id.id;
        // }
        
        return data as unknown as Entity;
    }
}