/**************************************
 * Created by Hertz on 2015年10月20日
 **************************************/
const path = require('path')
const webpack = require('webpack')

// webpack 配置
module.exports = {

    devtool: 'cheap-module-source-map',

    context: path.resolve(__dirname, '..'),

    mode: 'development', // 编译模式

    node: {
        __dirname: true
    },

    entry: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        css: [
            'webpack-hot-middleware/client',
            '../../manage/src/style/main.scss'
        ],
        components: [
            'webpack-hot-middleware/client',
            '../../manage/src/app.js'
        ]
    },

    // 开发环境不用设置path，只有在打包发布时才需要，可以与product下的webpack对比
    output: {
        filename: '[name].js',
        publicPath: '/manage',
        sourceMapFilename: 'map/[file].map'
    },

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
                    'sass-loader'
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

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'API_SERVER_ROOT': JSON.stringify('http://localhost:8081/api'),
            'FILE_SERVER_ROOT': JSON.stringify('http://localhost:8084/files'),
            __DEVELOPMENT__: false
        })
    ]

}
