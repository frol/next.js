const { app, protocol } = require('electron')
const { createServer } = require('http')
const path = require('path')

const dev = require('electron-is-dev')

module.exports = async () => {
  // if it's development, then start a HTTP server with Next as handler
  // using the renderer directory in the port 8000
  if (dev) {
    const { resolve } = require('app-root-path')
    const dir = resolve('./renderer')

    const next = require('next')
    const nextApp = next({ dev, dir })
    const nextHandler = nextApp.getRequestHandler()

    await nextApp.prepare()

    const server = createServer(nextHandler)

    server.listen(8000, () => {
      app.on('before-quit', () => server.close())
    })

    return server
  }


  // in production we register custom next:// protocol to serve static
  return protocol.registerFileProtocol('next', (request, callback) => {
    // request.url contains a full URL, so we remove the `next:///` prefix
    const localPath = request.url.substr(8)
    callback({path: path.join(__dirname, '..', 'build', localPath)})
  }, (error) => {
    if (error) console.error('Failed to register next:// protocol')
  })
}
