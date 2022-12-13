import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { FindOptionManyFactory } from '../../common/helpers/requestParserModified.js';
import { makeFindOneOption, makeFindOption } from '../../common/helpers/requestParser.js';

@Injectable()
export class QueryParserPipe implements PipeTransform {
    constructor(
        private readonly findType: 'ONE' | 'MANY', 
        private readonly searchFields: string[] = []
    ){}
    transform(value: any, metadata: ArgumentMetadata) {
        const { type } = metadata;
        // Make sure to only run your logic on queries
        if (type === 'query') return this.transformQuery(value);
        else if (type === 'param') return this.transformParam(value);
        else return value;
    }

    transformQuery(query: any) {
        if (typeof query !== 'object' || !query) return query;

        try{
            query = FindOptionManyFactory.parser(this.findType, query, this.searchFields);
        }catch(err){
            throw new BadRequestException('Bad Query String');
        }

        return query;
    }

    transformParam(param: any) {
        try{
            param = FindOptionManyFactory.parser(this.findType, param, this.searchFields);
        }catch(err){
            throw new BadRequestException('Bad Query String');
        }
        return param;
    }
}