const path = require('path');
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/styles/_vars.scss'),
            ],
        })
}
module.exports = {
    baseUrl: '',
    productionSourceMap: false,
    outputDir: path.resolve(__dirname, "../dianwutong_qd", 'www'),
    // lintOnSave: process.env.NODE_ENV !== 'production',
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
    }
}