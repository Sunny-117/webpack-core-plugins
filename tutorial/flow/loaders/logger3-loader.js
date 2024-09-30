
function loader(source){
    console.log('logger3-loader');
    return source+'//3';
}
module.exports = loader;