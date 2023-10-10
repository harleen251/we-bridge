const path = require('path')

module.exports = {
    // development mode
    mode: 'development',
    // where we want out webpack to look inside for the js
    entry: './src/index.js',

    output: {
        // output files will be pointed to the below path
        // __dirname gets the current directory
        path: path.resolve(__dirname, 'dist'),
        // filename of the output file
        filename: 'bundle.js'
    },
    // webpack keeps on updating any changes in thr bundle.js
    watch: true
}