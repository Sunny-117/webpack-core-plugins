module.exports = class MyPlugin {
    apply(compiler) {
        compiler.hooks.done.tap("MyPlugin-done", function (compilation) {
            console.log("编译完成");
        })
    }
}