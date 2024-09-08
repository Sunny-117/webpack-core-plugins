(self["webpackChunkteama"] = self["webpackChunkteama"] || []).push([["src_bootstrap_js"], {
  "./src/HomePage.js":
    ((module, exports, require) => {
      "use strict";
      module.exports = (async () => {
        require.r(exports);
        require.d(exports, {
          "default": () => DEFAULT_EXPORT
        });
        var is_array_0__ = require("webpack/sharing/consume/default/is-array/is-array");
        var is_array_0___default = /*#__PURE__*/require.n(is_array_0__);
        let Dropdown = await require.e("webpack_container_remote_teamb_Dropdown").then(require.t.bind(require, "webpack/container/remote/teamb/Dropdown", 23));
        let LoginModal = await require.e("src_LoginModal_js").then(require.bind(require, "./src/LoginModal.js"));
        const DEFAULT_EXPORT = (`(HomePage[${Dropdown.default}][${LoginModal.default}][${(is_array_0___default().name)}])`);
        return exports;
      })();
    }),
  "./src/bootstrap.js":
    ((module, exports, require) => {
      "use strict";
      module.exports = (async () => {
        require.r(exports);
        var _HomePage_0__ = require("./src/HomePage.js");
        _HomePage_0__ = await Promise.resolve(_HomePage_0__);
        console.log(_HomePage_0__.default);
        return exports;
      })();
    })
}]);