
function loader(source){
    console.log('logger1-loader');
    return source+'//1';
}
module.exports = loader;