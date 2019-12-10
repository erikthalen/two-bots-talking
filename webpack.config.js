const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path');

const SRC = path.resolve(__dirname, 'assets');

module.exports = {
    entry: './src/index.js',

    devServer: {
        contentBase: __dirname
    },

    module: {
        rules: [{
                test: /\.s[ac]ss$/i,
                use: [
                    'vue-style-loader',
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.mp3$/,
                include: SRC,
                loader: 'file-loader'
            }
        ],
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },

    node: {
        fs: "empty" // avoids error messages
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            title: 'Iphone Conversation',
            favicon: './icon.png',
						meta: {
							viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
						}
        }),
        new VueLoaderPlugin()
    ]
};
