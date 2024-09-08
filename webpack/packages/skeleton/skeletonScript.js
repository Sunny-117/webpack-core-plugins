//增加一个全局变量，名字叫Skeleton
window.skeletonScript = (function () {
  const CLASS_NAME_PREFIX = "sk-"; // class前缀
  const cacheObj = {}; // 存储按钮和图片的class 样式 {class名:css样式}
  function buttonHandler(element, options = {}) {
    const className = CLASS_NAME_PREFIX + "button"; // sk-button
    const rule = `{
            color:${options.color} !important;
            background:${options.color} !important;
            border:none !important;
            box-shadow:none !important;
        }`;
    addStyle(`.${className}`, rule);
    element.classList.add(className);
  }
  function imageHandler(element, options = {}) {
    //宽1px 高1的透明gif图
    const { width, height } = element.getBoundingClientRect();
    const attrs = {
      width,
      height,
      src:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    };
    setAttributes(element, attrs);
    const className = CLASS_NAME_PREFIX + "image"; // sk-image
    const rule = `{
            background:${options.color} !important;
        }`;
    addStyle(`.${className}`, rule);
    element.classList.add(className);
  }
  function setAttributes(element, attrs) {
    Object.keys(attrs).forEach((key) => element.setAttribute(key, attrs[key]));
  }
  function addStyle(selector, rule) {
    if (!cacheObj[selector]) {
      //一个类名sk-button只会在缓存中出现一次
      cacheObj[selector] = rule;
    }
  }
  // 转换原始元素为骨架DOM元素
  function genSkeleton(options) {
    const { button, image } = options;
    const buttons = []; // 所有的按钮
    const images = []; // 所有的图片
    // 递归遍历 找到所有的button和img标签
    (function preTraverse(element) {
      if (element.children && element.children.length > 0) {
        //如果此元素有儿子，则称遍历儿子
        Array.from(element.children).forEach((child) => preTraverse(child));
      }
      if (element.tagName == "BUTTON") {
        buttons.push(element);
      } else if (element.tagName == "IMG") {
        images.push(element);
      }
    })(document.documentElement);
    // 处理所有的button和img
    buttons.forEach((item) => buttonHandler(item, button));
    images.forEach((item) => imageHandler(item, image));

    let rules = "";
    for (const [classStr, rule] of Object.entries(cacheObj)) {
      // .sk-image .sk-button
      rules += `${classStr} ${rule}\n`;
    }
    // 获得骨架DOM元素的HTML字符串和样式style
    return { html: document.body.outerHTML, styles: `<style>\n${rules}</style>` };
  }
  return { genSkeleton };
})();
