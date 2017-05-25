module.exports = {
  webpack (config, { dev }) {
    // config the webpack target to be electron-renderer
    // this allow us to import electron renderer modules in your next.js pages
    config.target = 'electron-renderer'

    if (!dev) {
      // UglifyJs doesn't support some ES6 syntax, so we switch to Babili.
      config.plugins = config.plugins.filter(plugin => {
        return plugin.constructor.name !== 'UglifyJsPlugin'
      })

      const BabiliPlugin = require('babili-webpack-plugin')
      config.plugins.push(new BabiliPlugin())
    }

    return config
  },
  exportPathMap () {
    // export our pages as HTML for production usage
    return {
      '/': { page: '/' }
    }
  },
  // set the prefix as `next:///` instead of `/`, this is because when you export your pages
  // Next.js will try to import the JS files from your system root (file:///_next/...) instead
  // of the exported path
  assetPrefix: 'next:///'
}
