const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'dialog': './components/dialog',
        'radio': './components/radio'
    },
    output: {
        umdNamedDefine: false, // boolean
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        sourceMapFilename: "[name].map", // string
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "components")
                ],
                enforce: "post",
                loader: 'es3ify-loader'
            }
        ]
    },
    externals: {
        san: "san"
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};