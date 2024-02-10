const { render } = require('less')

module.exports = function (source) {
  render(source, (err, output) => {
    this.callback(err, output.css)
  })
}
