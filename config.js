import rc from 'rc'

export const config = rc('linkping', {
  mqtt: {
    host: 'localhost',
    port: 1883,
    db: './db',
    username: 'linkping-mqtt-user',
    password: 'fakepass'
  }
})
