import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1565873739646_2510';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.typeorm = {
    type: 'mysql',
    host: 'localhost',   // mysql数据库地址
    port: 3306,             // mysql数据库端口
    username: 'root',    // 用户名
    password: '1q@W#E$R', // 密码
    database: 'insight',    // 数据库
    synchronize: true,
    logging: true,
    entities: [ 'app/entity/**/*.ts' ],
    migrations: [ 'app/migration/**/*.ts' ],
    subscribers: [ 'app/subscriber/**/*.ts' ],
    cli: {
      entitiesDir: 'app/entity',
      migrationsDir: 'app/migration',
      subscribersDir: 'app/subscriber',
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

  config.cors = { // 允许跨域
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.session = {
    maxAge: 365 * 24 * 60 * 60 * 1000, // one year
    renew: true,
  };

  config.static = {
    prefix:'/'
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
