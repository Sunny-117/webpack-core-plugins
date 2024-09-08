var FileListPlugin = require("./plugins/FileListPlugin")
module.exports = {
    mode: "development",
    devtool: "source-map",
    plugins: [
        new FileListPlugin("文件列表.md")
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["./loaders/style-loader"]
            },
            {
                test: /\.(png)|(jpg)|(gif)$/,
                use: [
                    {
                        loader: "./loaders/img-loader.js",
                        options: {
                            limit: 3000, //3000字节以上使用图片，3000字节以内使用base64
                            filename: "img-[contenthash:5].[ext]"
                        }
                    }
                ]
            }
        ]
    }
}