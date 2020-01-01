import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  healthy: {
    enable: true,
    package: 'egg-healthy',
    env: [ 'prod', 'local' ],
  },
  typeorm: {
    enable: true,
    package: '@forsigner/egg-typeorm',
    env: [ 'prod', 'local' ],
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};

export default plugin;
