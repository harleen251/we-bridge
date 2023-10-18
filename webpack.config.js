const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        index: './src/index.js',
        login_vol: './src/login_vol.js',
        login_org:'./src/login_org.js',
        signup_vol: './src/signup_vol.js',
        signup_org:'./src/signup_org.js',
        profile_build_org: './src/profile_build_org.js',
        profile_build_vol: './src/profile_build_vol.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    watch: true
}