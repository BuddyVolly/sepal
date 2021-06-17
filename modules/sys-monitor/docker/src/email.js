const {Subject} = require('rxjs')
const {notifyEmailAddress} = require('./config')

const email$ = new Subject()

const notify = ({subject, content}) => email$.next({to: notifyEmailAddress, subject, content})

module.exports = {email$, notify}
