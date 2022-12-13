import { iPagination } from "common/interfaces/pagination.interface.js";
import { In } from "typeorm";

export function  processPagination(query: iPagination){
        
    const perpage = 25;

    const pagination: { 
        ids?: Array<number | string>,
        sort?: string,
        page?: number,
        order?: string,
        take?: number,
        skip?: number
    } = {}
        pagination.ids = query.ids ? query.ids.split(",") : []
        pagination.sort = query?.sort ? query.sort : 'id';
        pagination.order = query.order ? query.order : 'ASC';
        pagination.page = query.page ? query.page : 1;
        pagination.take = (pagination.page * perpage)
        pagination.skip = ( pagination.page - 1 ) * perpage


        const formatted = {
            where: pagination.ids.length ? {
                id: In(pagination.ids) 
            } : null,
            order: {
                [pagination.sort] : pagination.order
                // photos : {
                //     url :'ASC'
                // }
            },
            take: pagination.take,
            skip: pagination.skip,
        }

    return formatted;

}

