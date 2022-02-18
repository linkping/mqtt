'use strict'

import Aedes from 'aedes'
import aedesPersistencelevel from 'aedes-persistence-level'
import net from 'net'
import { config } from './config.js'
import db from './db.js'
import log from './log.js'

const aedes = Aedes({
  id: 'linkping-mqtt-broker',
  persistence: aedesPersistencelevel(db)
})

aedes.authenticate = (client, username, password, callback) => {
  process.nextTick(() => {
    if (username && password) {
      callback(null, username === config.mqtt.username && password.toString() === config.mqtt.password)
    } else {
      callback(null, false)
    }
  })
}

const server = net.createServer(aedes.handle)

server.listen(config.mqtt.port, config.mqtt.host, () => {
  log.info(`broker listening on ${config.mqtt.host}:${config.mqtt.port}`)
})

aedes.on('subscribe', (subscriptions, client) => {
  const subs = subscriptions.map(s => s.topic).join('\n')
  log.info(`client ${client && client.id} subscribed to topics ${subs}`)
})

aedes.on('unsubscribe', (subscriptions, client) => {
  const subs = subscriptions.map(s => s.topic).join('\n')
  log.info(`client ${client && client.id} unsubscribed to topics ${subs}`)
})

aedes.on('client', (client) => {
  log.info(`client ${client && client.id} connected`)
})

aedes.on('clientDisconnect', (client) => {
  log.info(`client ${client && client.id} disconnected`)
})

aedes.on('clientError', (client, err) => {
  log.error('client error', client.id, err.message, err.stack)
})

aedes.on('publish', (packet, client) => {
  if (client) {
    log.info(`client ${client.id} published topic: ${packet.topic} qos:${packet.qos} retain:${packet.retain}`)
  }
})
