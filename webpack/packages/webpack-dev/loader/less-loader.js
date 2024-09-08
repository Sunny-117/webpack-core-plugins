const less = require('less')

function loader(source) {
  let css = ''
  less.render(source, (_err, c) => {
    css = c.css
  })
  css = css.replace(/\n/g, '\\n')
  return css
}
module.exports = loader
