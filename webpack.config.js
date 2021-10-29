const currentTask = process.env.npm_lifecycle_event
const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra')

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"),
    require("postcss-nested"),
    require("autoprefixer"),
];

class RunAfterCompile{
    apply(compiler){
        compiler.hooks.done.tap('Copy images', function(){
            fse.copySync('./app/assets/images', './docs/assets/images')
            fse.copySync('./app/assets/fonts', './docs/assets/fonts')
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: [{ loader: "css-loader", options: { url: false } },
        {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: postCSSPlugins } },
        },
    ],
}

let pages = fse.readdirSync('./app').filter(function(file) {
return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`,
        favicon: "./app/assets/images/favicon.ico"
    })
})

let config = {
    entry: "./app/assets/scripts/App.js",
    plugins: pages,
    module: {
        rules: [
            cssConfig,
            {
                test: /\.(frag|vert|glsl)$/,
                use: [{
                    loader: "glsl-shader-loader",
                    options: {},
                }, ],
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [{ loader: "url-loader?limit=100000" }, { loader: "img-loader" }],
            },
            { test: /\.svg$/, use: { loader: 'url?limit=65000&mimetype=image/svg+xml&name=font/[name].[ext]' }, },
            { test: /\.woff$/, use: { loader: 'url?limit=65000&mimetype=application/font-woff&name=font/[name].[ext]' }, },
            { test: /\.woff2$/, use: { loader: 'url?limit=65000&mimetype=application/font-woff2&name=font/[name].[ext]' }, },
            { test: /\.[ot]tf$/, use: { loader: 'url?limit=65000&mimetype=application/octet-stream&name=font/[name].[ext]' }, },
            { test: /\.eot$/, use: { loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=font/[name].[ext]' }, }
        ]
    }
}

if (currentTask == 'dev') {
    cssConfig.use.unshift('style-loader')
config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
}
config.devServer = {
    // update changes also in html files
        watchFiles: ["./app/**/*.html"],
        static: path.join(__dirname, "app"),
        hot: true,
        port: 3000,
        host: "0.0.0.0"
    },
    config.mode = "development"
}

if (currentTask == 'build') {
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [/node_modules\/three/],
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    })
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "docs")
    },
    config.mode = "production",
    config.optimization = {
        splitChunks: {chunks: 'all'},
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    config.plugins.push(
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new RunAfterCompile()
        )
}

module.exports = config