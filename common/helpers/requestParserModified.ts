/* eslint-disable prefer-const */
import { Between, FindManyOptions, FindOneOptions, FindOperator, ILike, In, LessThanOrEqual, Like, MoreThanOrEqual, Raw } from 'typeorm';

interface CustomFindManyOptions extends FindManyOptions {
    /**
     * Specifies what columns should be retrieved.
     */
    select?: any;
    /**
     * Indicates what relations of entity should be loaded (simplified left join form).
     */
    relations?: {
        [index: string]: any;
    };
}

interface CustomFindOneOptions extends FindOneOptions {
    /**
     * Specifies what columns should be retrieved.
     */
    select?: any;
    /**
     * Indicates what relations of entity should be loaded (simplified left join form).
     */
    relations?: {
        [index: string]: any;
    };
    /**
     * Indicates what relations of entity should be loaded (simplified left join form).
     */
    where?: object;
}

class FindOptionManyFactory {
    public static parser(type: string, query: any, search_fields: string[]){
        if(type == 'MANY'){
            return (new FindOptionMany().makeFindOption(query, search_fields));
        } else if (type == 'ONE') {
            return (new FindOptionOne().makeFindOption(query));
        }
    }
}


class FindOption {

// protected query;
// protected search_fields;

// constructor(query: any, search_fields: string[]){
//     this.query = query;
//     this.search_fields = search_fields;

// }

    /**
 * Parse processable operation for TypeOrm from string
 * @date 2022-06-28
 * @param {any} operation:string
 * @param {any} value:string
 * @returns {FindOperator<any> | string | number}
 */
operationParser(operation: string, value: string): FindOperator<any> | string | number {
    //TODO:Implement strategies to parse operation
    if (operation == 'ltei') {
        return LessThanOrEqual(parseInt(value));
    } else if (operation == 'lte') {
        return LessThanOrEqual(value);
    } else if (operation == 'ltet') {
        return LessThanOrEqual(new Date(value));
    } else if (operation == 'mtei') {
        return MoreThanOrEqual(parseInt(value));
    } else if (operation == 'mte') {
        return MoreThanOrEqual(value);
    } else if (operation == 'mtet') {
        return MoreThanOrEqual(new Date(value));
    } else if (operation == 'btt') {
        const dates = JSON.parse(value);

        return Raw((alias) => `Date(${alias}) BETWEEN Date(:dateFrom) AND Date(:dateTo)`, {
            dateFrom: new Date(dates[0]),
            dateTo: new Date(dates[1])
        });
    } else if (operation == 'in') {
        return In(JSON.parse(value));
    } else if (operation == 'like') {
        return Like(value);
    }
    return value;
}

}


class FindOptionMany extends FindOption {

// constructor(query: any, search_fields: string[]) {
//     super(query, search_fields);
// }

/**
 * Takes query as parameters and returns undefined|FindManyOptions based on the query string
 * @param {QueryString} query
 * @param {string[]} search_fields - Array of fields to search
 * @returns {FindManyOptions | undefined}
 */
makeFindOption(query: any, search_fields: string[]): FindManyOptions | undefined {
    if (!query) return undefined;
    //since we will be using filters as a dynamic array so treat as a reserved word
    if (query.filters) throw { message: 'Invalid Query String. filters is a reserved word' };
    const findOption: CustomFindManyOptions = {};
    let { limit, page, sort_by, ids } = query;
    
    // page = JSON.parse(page.toString()) as string || 1;
    // const skip = JSON.parse(limit.toString()) as string || 10;
    // if (Array.isArray(skip)) {
    //     findOption.skip = (parseInt(skip[0] as string) - 1) * parseInt(limit[0] as string);
    // } else {
    //     findOption.skip = (parseInt(skip as string) - 1) * parseInt(limit as string);
    // }

    //if columns to select are specified then return them only

    //sort the result set by a column
    if (sort_by) {
        findOption.order = {};
        try {
            sort_by = JSON.parse(sort_by.toString()) as string;
        } catch (err) { }
        if (sort_by && !Array.isArray(sort_by)) {
            sort_by = [sort_by.toString()];
        }
        const s = sort_by as string[];
        s.map((sort) => {
            const [field, order] = sort.toString().split(':');
            findOption.order = {
                ...findOption.order,
                [field]: order == 'desc' ? 'desc' : 'asc'
            } as any;
        });
    }
    //number of rows to skip from beginning
    if (page && limit) {
        try {
            page = JSON.parse(page.toString()) as string;
            limit = JSON.parse(limit.toString()) as string;
        } catch (err) { }
        const skip = page;
        if (Array.isArray(skip)) {
            findOption.skip = (parseInt(skip[0] as string) - 1) * parseInt(limit[0] as string);
        } else {
            findOption.skip = (parseInt(skip as string) - 1) * parseInt(limit as string);
        }
    }

    if (limit) {
        try {
            limit = JSON.parse(limit.toString()) as string;
        } catch (err) { }
        const take = limit;
        if (Array.isArray(take)) {
            findOption.take = parseInt(take[0] as string);
        } else {
            findOption.take = parseInt(take as string);
        }
    }

    if(ids){
        findOption.where = [] as any[];
        const idsArray = ids.split(',')
        
        let where: any = {};
        
        where = {
            id: In(idsArray)
        };
        findOption.where.push(where)
    }

    return findOption;
};

}

class FindOptionOne extends FindOption {
    makeFindOption(query: any): FindOneOptions | undefined {
        if (!query) return undefined;
        const findOption: CustomFindOneOptions = {};
        let { id } = query;
        
        findOption.where = {
            id
        }
        
        return findOption;
    };
}

export {  FindOptionMany , FindOptionManyFactory, FindOptionOne };