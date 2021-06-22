require('sepal/log').configureServer(require('./log.json'))
const log = require('sepal/log').getLogger('main')

const {port} = require('./config')
const routes = require('./routes')
const server = require('sepal/httpServer')
const {monitorApps} = require('./apps')

const main = async () => {
    await server.start({
        port,
        routes
    })

    monitorApps()

    log.info('Initialized')
}

main().catch(error => {
    log.fatal(error)
    process.exit(1)
})
