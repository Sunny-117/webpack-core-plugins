var postcss = require("postcss");
let Tokenizer = require('css-selector-tokenizer');
const cssPlugin = (options) => {
    //CSS AST语法树的根节点 
    return (root) => {
      root.walkDecls((decl) => {
        let values = Tokenizer.parseValues(decl.value);
        values.nodes.forEach(node=>{
          node.nodes.forEach(item=>{
            if(item.type === 'url'){
              console.log(item.url);
            }
          });
        });
      });
    };
  };
let options = {};
let pipeline = postcss([cssPlugin(options)]);
let inputSource = `
#root{
  background-image: url(./images/kf.jpg);
  border:1px solid red;
}
`;

//post内部 pipeline其实先把CSS源代码转成CSS抽象语法树
//2.遍历语法树，让插件进行处理
pipeline.process(inputSource).then((result) => {
    console.log(result.css);
})