const darkTheme = require("@ant-design/dark-theme").default;
const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy, removeModuleScopePlugin } = require('customize-cra');

module.exports = override(
    // antd组件按需引用
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    // antd组件全局less控制
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            ...darkTheme,
            '@primary-color': '#5783d3'
        },
    }),
    // 支持@装饰器
    addDecoratorsLegacy(),
    // 支持node_nodules包引入
    removeModuleScopePlugin()
)