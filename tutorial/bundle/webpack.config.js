const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = (env = {}) => {
    return ({
        mode: 'development',
        devtool: false,
        entry: './src/index.js',
        output: {
            path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径
            filename: '[name].js',
            chunkFilename: '[name].main.js',
        },
        devServer: {
            compress: true, /// 是否启动压缩 gzip
            port: 9999, // 指定HTTP服务器的端口号
            open: true, // 自动打开浏览器
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ["@babel/preset-env",
                                    ],
                                    "@babel/preset-react", // 可以转换JSX语法
                                ],
                                plugins: [
                                    ["@babel/plugin-proposal-decorators", { legacy: true }],
                                    ["@babel/plugin-proposal-class-properties", { loose: true }],
                                ],
                            },
                        },
                    ],
                },
                { test: /\.txt$/, use: 'raw-loader' },
                { test: /\.css$/, use: ['style-loader', 'css-loader'] },
                { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
                { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
                {
                    test: /\.(jpg|png|gif|bmp)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            name: '[hash:10].[ext]',
                            esModule: false,
                            limit: 32 * 1024
                        },
                    }],
                },
                { test: /\.html$/, use: ['html-loader'] },
            ],
        },
        plugins: [
          new CleanWebpackPlugin({
              cleanOnceBeforeBuildPatterns:["**/*"]
          }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
        ],
    });
};
