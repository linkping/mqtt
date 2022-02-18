import level from 'level'
import { config } from './config.js'

const db = level(config.mqtt.db)
export default db
