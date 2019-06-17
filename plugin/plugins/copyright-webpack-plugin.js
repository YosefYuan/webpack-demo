class CopyrightWepbakcPlugin {
    apply(compiler) {
        compiler.hooks.compile.tap('CopyrightWepbakcPlugin', (compilation) => {
            console.log('compiler');
        })
        compiler.hooks.emit.tapAsync('CopyrightWepbakcPlugin', (compilation, cb) => {
            console.log(compilation.assets);
            debugger;
            compilation.assets['copyright.txt'] = {
                source: function () {
                    return 'copyright'
                },
                size: function () {
                    return 9;
                }
            }
            cb();
        })
    }
}

module.exports = CopyrightWepbakcPlugin;