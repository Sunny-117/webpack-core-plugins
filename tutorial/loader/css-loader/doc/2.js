var postcss = require("postcss");
const cssPlugin = (options) => {
    //CSS AST语法树的根节点 
    return (root) => {
      root.walkDecls((decl) => {
        console.log('decl',decl);
        if(decl.value.endsWith('px')){
            decl.value=parseFloat(decl.value)/75+'rem';
        }
      });
    };
  };
let options = {};
let pipeline = postcss([cssPlugin(options)]);
let inputSource = `
#root{
    width:750px;
}`;

//post内部 pipeline其实先把CSS源代码转成CSS抽象语法树
//2.遍历语法树，让插件进行处理
pipeline.process(inputSource).then((result) => {
    console.log(result.css);
})