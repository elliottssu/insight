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
    // ！！！！！请注意：请修改为自己的数据库配置，当前配置只是测试，随时有可能删除！！！！！！
    host: '121.36.206.51',   // mysql数据库地址
    port: 3306,             // mysql数据库端口
    username: 'insight_demo_user',    // 用户名
    password: 'insight2021_user', // 密码
    database: 'insight_demo',    // 数据库
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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 一周
    renew: true,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
