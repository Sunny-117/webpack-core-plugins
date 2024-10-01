let less = require("less");
function loader(source) {
  console.log('source',source);
  let callback = this.async();
  less.render(source, { filename: this.resource }, (err, output) => {
    console.log('output.css',output.css);
    callback(err, output.css);
  });
}
module.exports = loader;