import {
  getRepositoryToken,
  InjectRepository,
  TypeOrmModule,
} from "@nestjs/typeorm";
import { NestFactory } from "@nestjs/core";
import { Repository } from "typeorm";
import { DynamicModule, Module } from "@nestjs/common";
import { AppModule } from "../../app.module.js";

/**
 * this will return a repository from nest DI/IoC container
 * original syntax
 * await NestFactory.createApplicationContext(AppModule);
 * const repository = module.get<Repository<Lookup>>(getRepositoryToken(Lookup));
 * const service = module.get<ApiUserService>(ApiUserService)
 * await app.close();
 * @export
 * @template R
 * @param {*} expectedRepository
 * @return {*}
 */
export async function getRepository<R>(expectedRepository: any) {
  /**
   * get nest app
   */
  const app = await NestFactory.createApplicationContext(AppModule);
  /**
   * this sets the type of service and gets the instance
   */
  const repository = app.get<Repository<R>>(
    getRepositoryToken(expectedRepository)
  );
  return { repository, app };
}

/**
 * this will return a repository from nest DI/IoC container
 * original syntax
 * await NestFactory.createApplicationContext(AppModule);
 * const repository = module.get<Repository<Lookup>>(getRepositoryToken(Lookup));
 * const service = module.get<ApiUserService>(ApiUserService)
 * await app.close();
 * @export
 * @template S
 * @param {*} expectedRepository
 * @return {*}
 */
export async function getService<S>(expectedService: any) {
  /**
   * get nest app
   */
  const app = await NestFactory.createApplicationContext(AppModule);
  /**
   * this sets the type of service and gets the instance
   */
  const service = app.get<S>(expectedService);
  return { service, app };
}

/**
 * this will return a repository from nest DI/IoC container
 * original syntax
 * await NestFactory.createApplicationContext(AppModule);
 * const repository = module.get<Repository<Lookup>>(getRepositoryToken(Lookup));
 * const service = module.get<ApiUserService>(ApiUserService)
 * await app.close();
 * @export
 * @template M
 * @template S
 * @param {M} expectedModule
 * @param {*} expectedService
 * @return {*}
 */
export async function getServiceModuleBased<M, S>(
  expectedModule: M,
  expectedService: any
) {
  /**
   * get nest app
   */
  const app = await NestFactory.createApplicationContext(expectedModule);
  /**
   * this sets the type of service and gets the instance
   */
  const service = app.get<S>(expectedService);
  return { service, app };
}

/**
 * this will return a repository from nest DI/IoC container
 * original syntax
 * await NestFactory.createApplicationContext(AppModule);
 * const repository = module.get<Repository<Lookup>>(getRepositoryToken(Lookup));
 * const service = module.get<ApiUserService>(ApiUserService)
 * await app.close();
 * @export
 * @template M
 * @template S
 * @param {M} expectedModule
 * @param {*} expectedService
 * @return {*}
 */
export async function getRepositoryModuleBased<M, R>(
  expectedModule: M,
  ExpectedRepository: any
) {
  /**
   * get nest app
   */
  const app = await NestFactory.createApplicationContext(expectedModule);
  /**
   * this sets the type of service and gets the instance
   */
  const repository = app.get<Repository<R>>(
    getRepositoryToken(ExpectedRepository)
  );
  return { repository, app };
}

//#region dynamic module, test basis

/**
 * this will return a generic service which can be injected into module
 * @param {*} entity
 * @return {*}
 */
function GetGenericService(entity: any) {
  class GenericService {
    constructor(
      @InjectRepository(entity)
      public organizationRepository: Repository<typeof entity>
    ) {}
  }
  return GenericService;
}

/**
 * this is dynamic module
 * docs [dynamic module] : https://docs.nestjs.com/fundamentals/dynamic-modules
 * docs [custom provider] : https://docs.nestjs.com/fundamentals/custom-providers
 * youtube tutorial : https://www.youtube.com/watch?v=A2i9Xt-PZJU&ab_channel=ComputerBaba
 * @export
 * @class GenericDynamicModule
 */
@Module({})
export class GenericDynamicModule {
  static register(Entity: any): DynamicModule {
    /**
     * get a dynamic service
     */
    const service = GetGenericService(Entity);

    return {
      module: GenericDynamicModule,
      imports: [TypeOrmModule.forFeature([Entity])],
      providers: [service],
    };
  }
}

/**
 * Get a repository without sending a module
 * @export
 * @template M
 * @param {*} expectedEntity
 * @return {*}
 */
export async function getRepositoryWithoutModule<M>(expectedEntity: any) {
  /**
   * get nest app
   */
  const app = await NestFactory.createApplicationContext(
    GenericDynamicModule.register(expectedEntity)
  );
  /**
   * get a dynamic service
   */
  const repository = app.get<Repository<typeof expectedEntity>>(
    getRepositoryToken(expectedEntity)
  );

  return { repository, app };
}

//#endregion dynamic module
