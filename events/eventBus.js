// src/events/eventBus.js
const EventEmitter = require('events')
const eventBus = new EventEmitter()
// Allow many listeners (avoid memory leak warnings)
eventBus.setMaxListeners(50)

module.exports = eventBus
