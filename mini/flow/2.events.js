let {EventEmitter} = require('events');
let eventEmitter = new EventEmitter();
eventEmitter.on('a',()=>console.log('a'));
eventEmitter.on('b',()=>console.log('b'));
eventEmitter.emit('a')
eventEmitter.emit('b')