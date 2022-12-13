import { relations as orgRelations } from "../../modules/organization/entities/organization.entity.js";
import { relations as buidlingRelations } from "../../modules/building/entities/building.entity.js";
import { relations as epRelations } from "../../modules/ep/entities/ep.entity.js";
import { relations as walletRelations } from "../../modules/wallet/entities/wallet.entity.js";
import { relations as creditRelations } from "../../modules/credit/entities/credit.entity.js";
import { relations as apiUserRelations } from "../../modules/api-user/entities/api-user.entity.js";
import { isEmpty } from "ramda";
import { Logger } from "../infrastructure/logger.js";
/**
 * determine type decorator
 * return childFunction.bind(this)();
 * @export
 * @class DetermineTypeCommon
 */
export class DetermineTypeCommon {
  main(entity_name?: any) {
    return function (
      target: any,
      memberName: string, //method name
      descriptor: PropertyDescriptor
    ) {
      const classInstance = new DetermineTypeCommon();
      const childFunction = descriptor.value;
      descriptor.value = function (this: any, ...args: any[]) {
        try {
          args[1].findOptions = classInstance.configureFindOptions(
            args,
            entity_name
          );
        } catch (error) {
          Logger.error(
            `ClassName: ${DetermineTypeCommon.name} - main`,
            "Error",
            {
              errorMsg: error?.message,
              location: "error in DetermineType decorator",
            }
          );
        }

        return childFunction.apply(this, args);
      };
      return descriptor;
    };
  }

  /**
   * @description
   * @param {*} args
   * @param {*} entity_name
   * @returns {*}
   */
  configureFindOptions(args, entity_name) {
    const findOptions = args[1]?.findOptions;
    let where = findOptions?.where ?? {};
    const user = args[1]?.user;
    const id = args[1]?.id;
    const userTypeChecking =
      user?.type == "Ecological" ||
      user?.type == "Building" ||
      user?.type == "Ep";

    const userTypeAdmin = user?.type == "Admin";

    const { relations, whereModified } = this.setupRelations(
      entity_name,
      where,
      user,
      id
    );

    if (userTypeChecking && where) {
      where = whereModified;
    } else if (userTypeAdmin && isEmpty(where)) {
      where = { ...where, id };
    }

    return {
      ...findOptions,
      where,
      relations,
    };
  }

  /**
   * this will setup the relation for the entity
   * @param {string} entity_name
   * @param {object} where
   * @param {*} user
   * @param {string} id
   * @return {*}
   * @memberof DetermineTypeCommon
   */
  setupRelations(entity_name: string, where: object, user: any, id: string) {
    /**
     * get conditional where
     */
    const { whereForOrg, whereForOther, whereForCredit, whereForApiUser } = getWhere(
      where,
      user,
      id
    );

    /**
     * lower case the string
     */
    entity_name = entity_name.toLowerCase();

    /**
     * return value according to conditions
     */
    if (entity_name == "organization") {
      return { relations: orgRelations, whereModified: whereForOrg };
    } else if (entity_name == "building") {
      return { relations: buidlingRelations, whereModified : whereForOther };
    } else if (entity_name == "ep") {
      return { relations: epRelations, whereModified : whereForOther };
    } else if (entity_name == "wallet") {
      return { relations: walletRelations, whereModified: whereForOther };
    } else if (entity_name == "credit") {
      return { relations: creditRelations, whereModified: whereForCredit };
    } else if (entity_name == "api-user") {
      return { relations: apiUserRelations, whereModified: whereForApiUser };
    }
  }
}

/**
 * get custom where depending on the type of entity
 * @param {object} where
 * @param {*} user
 * @param {string} id
 * @return {*}
 */
function getWhere(where: object, user: any, id: string) {
  /**
   * for organizations,building,ep where owner_id exists
   */
  const whereForOrg = {
    ...where,
    owner: { id: user.id },
    id,
  };

  /**
   * for credit where there is no owner_id
   */
  const whereForCredit = {
    ...where,
    ep: { owner_id: user.id },
    id,
  };

  /**
   * for api-user where there is no owner_id
   */
  const whereForApiUser = {
    ...where,
    id,
  };

  /**
   * for wallet where there is no owner_id
   */
  const whereForOther = {
    ...where,
    organization: { owner_id: user.id },
    id,
  };

  return { whereForOrg, whereForCredit, whereForOther, whereForApiUser };
}

export const setupType = new DetermineTypeCommon().main;
