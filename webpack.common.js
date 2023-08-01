const path = require('path');
const copyPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        background: path.resolve('src/background/background.ts'),
        contentScript: path.resolve('src/contentScript/contentScript.ts')
    },
    module: {
        rules: [ 
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/i,
            },
            {
                type: 'asset/resource',
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new copyPlugin({
            patterns: [
                {
                    from: path.resolve('src/static'),
                    to: path.resolve('dist')
                }
            ]
        }),
        ...getHtmlPlugins(["background", "contentScript"])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    } 
}
function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new htmlWebpackPlugin({
        title: "chrome extension",
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}