
const path    = require("path")
const webpack = require("webpack")

module.exports = {
    devtool: "source-map",

    entry: [
        "./src/style.scss",
        "./src/main.js"
    ],

    output: {
        filename:   "[name].bundle.js",
        path:       path.join(__dirname, "dist"),
        publicPath: "/assets/"
    },

    module: {
        rules: [

            // JavaScript
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                use:     "babel-loader"
            },

            // Scss
            {
                test:    /\.scss$/,
                exclude: /node_modules/,
                use:     [
                    "style-loader",
                    "css-loader?importLoaders=1",
                    "postcss-loader"
                ]
            }
        ]
    },

    devServer: {
        host:   "0.0.0.0",
        port:   3000,
        hot:    true,
        inline: true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

