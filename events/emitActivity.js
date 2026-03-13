const eventBus = require('./eventBus')
function emitActivity(eventName, payload) {
  eventBus.emit(eventName, payload)
}
module.exports = emitActivity
