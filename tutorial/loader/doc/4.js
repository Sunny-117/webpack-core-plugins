let loaders = [()=>console.log(1),()=>console.log(2),()=>console.log(3)];
let loaderIndex = 0;
function iteratePitchingLoaders(){
    loaders[loaderIndex]();
    loaderIndex++;
    iteratePitchingLoaders();
}
iteratePitchingLoaders();