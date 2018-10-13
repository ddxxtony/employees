//this is a must, otherwise for some reason webpack would include both prod and dev
//code in the production build.
module.exports = process.env.NODE_ENV === 'production'
  ? require('react-hot-loader/lib/AppContainer.prod')
  : require('react-hot-loader/lib/AppContainer.dev');