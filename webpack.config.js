const path = require('path');
module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        index: './src/index.js',
        profile_build_vol: './src/profile_build_vol.js',
        profile_build_org: './src/profile_build_org.js',
        signup_vol: './src/signup_vol.js',
        signup_org:'./src/signup_org.js',
        account_org:'./src/account_org.js',
        org_applicant_detail:'./src/org_applicant_detail.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    watch: true
}