const {job} = require('root/jobs/job')

const worker$ = () => {

    const ee = require('ee')
    const {map} = require('rxjs/operators')

    return ee.getInfo$(ee.Image(), 'can communicate with EE servers').pipe(
        map(() => ({'status': 'OK'}))
    )
}

module.exports = job({
    jobName: 'EE check',
    jobPath: __filename,
    worker$
})
