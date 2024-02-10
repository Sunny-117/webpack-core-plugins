// const title = require('./title.js')
// console.log(title)

require('./sync')

import(/* jspackChunkName: "title" */ './title').then((result) => {
  console.log(result)
})

import(/* jspackChunkName: "sum" */ './sum').then((result) => {
  console.log(result)
})

const isArray = require('isarray')

console.log(isArray([1, 2, 3]))
