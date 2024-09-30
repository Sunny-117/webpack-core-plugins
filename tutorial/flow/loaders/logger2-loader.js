
function loader(source){
    console.log('logger2-loader');
    return source+'//2';
}
module.exports = loader;