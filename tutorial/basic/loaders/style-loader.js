
function loader(cssSource){
    return `
        let style=document.createElement('style');
        style.innerHTML = ${cssSource};
        document.head.appendChild(style);
    `;
}
module.exports = loader;