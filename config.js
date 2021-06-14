import rc from 'rc'

export const config = rc('linkping', {
  mqtt: {
    port: 1883,
    dbPath: './db',
    username: 'linkping-mqtt-user',
    password: 'fakepass'
  }
})
