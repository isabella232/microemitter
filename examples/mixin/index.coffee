{EventEmitter} = require '../..'

log = console.log.bind console

EventEmitter class DemoEmitter extends Base
  EventEmitter @::

console.log DemoEmitter

ee = new DemoEmitter

DemoEmitter.on 'foo', log
DemoEmitter.emit 'foo', 1, 2, 3

ee.on 'bar', log
ee.emit 'bar', 42, 43, 44, 55