let cssEs=[];
function loader(cssSource){
    cssEs.push(cssSource);
}

class MiniCssExtractPlugin{
    apply(){
        let allCSS = cssEs.join('\n');
        //assets对象上添加一个新的属性 key文件名  值就是内容
        //在写入硬盘的时候，webpack就会读到这个key value并且写入硬盘
        this.emitFile('main.css',allCSS);
    }
}
module.exports = loader;