module.exports = function (sourceCode) {
    var code = `var style = document.createElement("style");
    style.innerHTML = \`${sourceCode}\`;
    document.head.appendChild(style);
    module.exports = \`${sourceCode}\``; //为了得到css源码字符串
    return code;
}

// \是转义