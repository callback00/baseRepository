const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// webpack 配置
module.exports = [
    // 打包 Web Components 代码
    {
        mode: 'production',
        context: path.resolve(__dirname, '..'),
        node: {
            __dirname: true
        },

        entry: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'lodash', 'moment'],
            antd: ['antd'],
            highlighter: ['react-syntax-highlighter'],
            moment: ['moment'],
            css: [
                '../../manage/src/scssAutoLoad.js'
            ],
            components: [
                '../../manage/src/app.js'
            ]
        },

        output: {
            path: path.resolve(__dirname, '../dist/manage'),
            filename: '[name].js',
            publicPath: '../dist',
        },

        // target: "node",

        module: {
            rules: [
                { // js|jsx rules
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader',
                    ]
                }, // end of js|jsx rules

                { // css rules
                    test: /\.(scss|sass)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ]
                }, // end of scss|sass rules

                { // css rules
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                    ]
                }, // end of css rules

                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }]
                }
            ]
        }, // end of module

        // 用于拆分entry里的内容，如果写成development的配置，vendor的代码均会写进components.js内，引不引用vendor都行
        optimization: {
            splitChunks: {
                chunks: 'all',
                // minSize: 100000,
                maxInitialRequests: 20, // for HTTP2
                maxAsyncRequests: 20, // for HTTP2
                name: false,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: false
                }
            }
        },

        resolve: {
            extensions: ['.js', '.jsx']
        },

        plugins: [

            new webpack.ContextReplacementPlugin(
                /moment\/locale$/,
                /zh-cn/
            ),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                'API_SERVER_ROOT': JSON.stringify('http://localhost:8081/api'),
                __DEVELOPMENT__: false
            }),

            new BundleAnalyzerPlugin()
        ]
    },
]
