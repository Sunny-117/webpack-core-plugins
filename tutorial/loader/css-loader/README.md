##  1.这个方法this.addDependency是loader吗?
是的
添加依赖的文件或文件夹
如果此loader依赖的文件或文件夹发生改变之后，缓存会失效，就需要重新转换 

## 2.css文件互相引用的骚操作会不会死循环 
- 循环引用在common.js 并不会死循环
- 在这里也没有互相引用

"./src/index.css"=>"css-loader.js!./src/index.css"=>"css-loader.js!./src/global.css"


## 3. loader不是字符串转字符串吗？怎么能够增加modules 
modules模块定义的话，
它不是loader增加的，是webpack通过依赖分析增加的
怎么增加的呢？马上讲


为啥require返回的是个数组？ 
毛子哥
这个属性，用配吗？如果我有的css是less有的不是，那怎么处理呢？ 
21:49
岁月小小
28  => 
坚持
this是上节课那个loadercontext吗 
学习
应该是 
杨康
再走一遍 
青衣
］课件地址在哪，没找到 
青衣
Loader-runner课件谁有发一下 
岁月小小
变成行内loader了 
坚持
https://gitee.com/Sunnypeixun/webpack 
学习
不要前置和普通 
岁月小小
老师，什么样loader用inline，什么情况的loader用post?  
岁月小小
各种场景适合用哪种loader说一下吗？ 
坚持
感觉这些配置工作中都没用过。。 
22:06
岁月小小
老师，loader-runner返回给webpack的代码片段会再被webpack分析？
webpack也用postCss解析这段代码片段吗？webpack怎么知道用哪种解析库来解析？ 

webpack用的jS的语树解析 babel =acorn



1.to-string-loader
2.importLoaders

我感觉 @import 应该也要走所有对应的loader呀，怎么还有情况走部分loader 呢？ 
毛子哥
如果配置了这个，你loader的顺序也得很谨慎了 
黄鹏
是不是如果 @import less 和css 是不是就有问题了。 

source
@import "./global.css";
@import "./global.less";
@color2:red;
body{
    color: @color2;
}
output.css
@import "global.css";
body {
  background-color: orange;
}
body {
  color: red;
}
- 在执行less-loader的时候，编译的less的时候，可以自动处理@import less
把@import less变成导入的代码了

黄鹏
哦哦，对。 less 支持import 语法。 
毛子哥
如果index改成css就不行了吧 
学习
看一下source和out.css的打印地方 
可以的
那是不是可以在css代码中为什么不能使用~@/assets… 这种呢路径了
好像现在项目中是不能这样使用的哇 
要想这样用的话 ~


循环decl，那就是每一个规则，每一饿选项都得循环？能不能直接循环url，就跟import一样呢 
坚持
这个循环，固定是两层吗 


拿得到，但是是数组 
黄鹏
json.stringfity 的时候， 会变成字符串的。 
黄鹏
不是重写了toString 方法么 
坚持
画个图看看，对于在pitch拿到剩下的那里不是很懂 

画个图看看，对于在pitch拿到剩下的那里不是很懂 
毛子哥
不懂，为什么在normal中拿不到处理后的css呢，要在pitch中做 
 
8753
样式没合并 body还是两个 
岁月小小
JSON.stringify(['1', 'a']) =》 "["1","a"]" 
10:52
学习
为啥是最左边两个并行？ 
loader分两种
1.最左侧的，他一定是一个JS模块，可以用require加载得到导出对象
2.非最左侧的 可以是任意内容，只要它下下家loader能处理就可以
如果你想联用两个最左则的loader
岁月小小
老师，loader-runner能走很多轮，style-loader的pitch怎么知道是最后一轮 
黄鹏
style-loader pitch是第一个走的，走了，就拦截住了，转成行内loader在处理，然后直接返回给webpack 了。 
张楠
为什么style-loader 不在loader中做处理要写在pitch中 
岁月小小
第一个模块再看一下？ 

因为写的 style-loader de normal 中， 它是最后一个loader. 且拿到的代码是字符串。 只能用eval 执行。所以不好处理。 
学习
最左侧返回字符串 这个知道 
学习
如果css loader返回字符串  直接写在style loader的normal也行吧 


11:06
坚持
也就是说只走normal也是能实现的
如果没有  import和url是可以的
 require
黄鹏
style-loader 的normal 可能还要处理 require语法。 处理起来太麻烦了。pitch 中的能二次处理. 要方便很多。 

Remainrequest不一定是只有一个吧？为啥是最左边的两个并行？ 感觉还是串行 
肯定是串行的
联用，不是并行
岁月小小
style-loader相当于先把创建style的代码写了，再写style里面内容的代码？ 
可以这么认为




Remainrequest不一定是只有一个吧？为啥是最左边的两个并行？ 感觉还是串行 
岁月小小
style-loader相当于先把创建style的代码写了，再写style里面内容的代码？ 
学习
Style loader最上面注释写的并行 
坚持
第二步流程走完，是直接给wepback了吗 
学习
为啥是最左边的两个？感觉不一定是两个 
坚持
还是给到style的pitch了 
黄鹏
这个是哈呀 
黄鹏
  
