module.exports = {
    root: true,
    parser: "babel-eslint", // 需要一个parser解析器帮我们把源代码转成抽象语法树
    extends: 'airbnb',
    // 指定解析器选项
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015,
    },
    // 指定脚本的运行环境
    env: {
        browser: true,
    },
    // 启用的规则及其各自的错误级别
    rules: {
        "linebreak-style": "off",
        "no-undef": "off",
        "no-debugger": "off",
        "no-alert": "off",
        indent: ["error", 4], // 缩进风格
        quotes: "off", // 引号类型
        "no-console": "off", // 禁止使用console
    },
    exclude: ['src'],
};
