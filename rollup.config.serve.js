import config from './rollup.config';
import serve from 'rollup-plugin-serve';

let serverConfig = config;
serverConfig.plugins.push(
  serve({
    contentBase: ['test', 'lib']
  })
);

export default serverConfig;
