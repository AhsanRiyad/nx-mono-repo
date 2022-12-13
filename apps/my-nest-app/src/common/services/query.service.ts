import { paginateResponse } from "../helpers/paginatedResponse.helpers.js";
import { Transactional } from "typeorm-transactional";
import { setupType } from "../decorators/determinType.decorator.js";
import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../exceptions/custom.exception.js";
import { HttpExceptionWithLog } from "../exceptions/HttpExceptionWithLog.exceptions.js";
import { IReturnType } from "../interfaces/return-type.interface.js";
import { Repository } from "typeorm";

/**
 * common query support abstract class
 * @export
 * @abstract
 * @class QuerySupport
 * @template RepositoryType
 */
export abstract class QuerySupport<RepositoryType> {
  /**
   * Creates an instance of QuerySupport.
   * @param {Repository<RepositoryType>} repository
   * @memberof QuerySupport
   */
  constructor(private repository: Repository<RepositoryType>) {}
  /**
   * @description get all organization
   * @param {*} organizationRepository
   * @param {*} { findOptions, page, limit, user }
   * @return {*}
   */
  abstract getAll(
    organizationRepository,
    { findOptions, page, limit, user }
  ): Promise<IReturnType>;

  /**
   * @description get all organization
   * @param {*} organizationRepository
   * @param {*} { findOptions, page, limit, user }
   * @return {*}
   */
  @Transactional()
  async getAllData(findOptions, page, limit): Promise<IReturnType> {
    try {
      const result = await this.repository.findAndCount(findOptions);
      const data = this.mapAllData(result);
      return paginateResponse(data, page, limit);
    } catch (error) {
      throw new CustomException(QuerySupport.name, "getAll", error);
    }
  }

  mapAllData(data : any){
    return data;
  }

  mapOneData(data : any){
    return data;
  }

  /**
   * @description get an organization by id
   * @param {*} organizationRepository
   * @param {*} { findOptions, user = null, id = null }
   * @return {*}
   */
  abstract getOneById(
    organizationRepository,
    { findOptions, user = null, id = null }
  );

  /**
   * @description get an organization by id
   * @param {*} organizationRepository
   * @param {*} { findOptions, user = null, id = null }
   * @return {*}
   */
  @Transactional()
  async getOneDataById(findOptions) {
    try {
      const result = await this.repository.findOne(findOptions);
      if (!result)
        throw new HttpExceptionWithLog(
          "No data is found.",
          HttpStatus.NOT_FOUND,
          QuerySupport.name,
          "getOneById"
        );
      const data = this.mapOneData(result);
      return data;
    } catch (error) {
      throw new CustomException(QuerySupport.name, "getOneById", error);
    }
  }
}
