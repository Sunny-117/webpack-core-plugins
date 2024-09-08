 (() => {
 	var modules = ({});
 	var cache = {};
 	function require(moduleId) {
 		if(cache[moduleId]) {
 			return cache[moduleId].exports;
 		}
 		var module = cache[moduleId] = {
 			exports: {}
 		};
 		modules[moduleId](module, module.exports, require);
 		return module.exports;
 	}
 	require.m = modules;
 	(() => {
 		var getProto = Object.getPrototypeOf ? (obj) => Object.getPrototypeOf(obj) : (obj) => obj.__proto__;
 		var leafPrototypes;
 		require.t = function(value, mode) {
 			if(mode & 1) value = this(value);
 			if(mode & 8) return value;
 			if(typeof value === 'object' && value) {
 				if((mode & 4) && value.__esModule) return value;
 				if((mode & 16) && typeof value.then === 'function') return value;
 			}
 			var ns = Object.create(null);
 			require.r(ns);
 			var def = {};
 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
 				Object.getOwnPropertyNames(current).forEach(key => def[key] = () => value[key]);
 			}
 			def['default'] = () => value;
 			require.d(ns, def);
 			return ns;
 		};
 	})();
 	(() => {
 		require.d = (exports, definition) => {
 			for(var key in definition) {
 				if(require.o(definition, key) && !require.o(exports, key)) {
 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
 				}
 			}
 		};
 	})();
 	(() => {
 		require.f = {};
 		require.e = (chunkId) => {
 			return Promise.all(Object.keys(require.f).reduce((promises, key) => {
 				require.f[key](chunkId, promises);
 				return promises;
 			}, []));
 		};
 	})();
 	(() => {
 		require.u = (chunkId) => {
 			return "" + chunkId + ".js";
 		};
 	})();
 	(() => {
 		require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
 	})();
 	(() => {
 		var inProgress = {};
 		var dataWebpackPrefix = "teamb:";
 		require.l = (url, done, key) => {
 			if(inProgress[url]) { inProgress[url].push(done); return; }
 			var script, needAttach;
 			if(key !== undefined) {
 				var scripts = document.getElementsByTagName("script");
 				for(var i = 0; i < scripts.length; i++) {
 					var s = scripts[i];
 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
 				}
 			}
 			if(!script) {
 				needAttach = true;
 				script = document.createElement('script');
 				script.charset = 'utf-8';
 				script.timeout = 120;
 				if (require.nc) {
 					script.setAttribute("nonce", require.nc);
 				}
 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
 				script.src = url;
 			}
 			inProgress[url] = [done];
 			var onScriptComplete = (prev, event) => {
 				script.onerror = script.onload = null;
 				clearTimeout(timeout);
 				var doneFns = inProgress[url];
 				delete inProgress[url];
 				script.parentNode && script.parentNode.removeChild(script);
 				doneFns && doneFns.forEach((fn) => fn(event));
 				if(prev) return prev(event);
 			}
 			;
 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
 			script.onerror = onScriptComplete.bind(null, script.onerror);
 			script.onload = onScriptComplete.bind(null, script.onload);
 			needAttach && document.head.appendChild(script);
 		};
 	})();
 	(() => {
 		require.r = (exports) => {
 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 			}
 			Object.defineProperty(exports, '__esModule', { value: true });
 		};
 	})();
 	(() => {
 		require.S = {};
 		var initPromises = {};
 		var initTokens = {};
 		require.I = (name, initScope) => {
 			if(!initScope) initScope = [];
 			var initToken = initTokens[name];
 			if(!initToken) initToken = initTokens[name] = {};
 			if(initScope.indexOf(initToken) >= 0) return;
 			initScope.push(initToken);
 			if(initPromises[name]) return initPromises[name];
 			if(!require.o(require.S, name)) require.S[name] = {};
 			var scope = require.S[name];
 			var warn = (msg) => typeof console !== "undefined" && console.warn && console.warn(msg);;
 			var uniqueName = "teamb";
 			var register = (name, version, factory) => {
 				var versions = scope[name] = scope[name] || {};
 				var activeVersion = versions[version];
 				if(!activeVersion || !activeVersion.loaded && uniqueName > activeVersion.from) versions[version] = { get: factory, from: uniqueName };
 			};
 			var initExternal = (id) => {
 				var handleError = (err) => warn("Initialization of sharing external failed: " + err);
 				try {
 					var module = require(id);
 					if(!module) return;
 					var initFn = (module) => module && module.init && module.init(require.S[name], initScope)
 					if(module.then) return promises.push(module.then(initFn, handleError));
 					var initResult = initFn(module);
 					if(initResult && initResult.then) return promises.push(initResult.catch(handleError));
 				} catch(err) { handleError(err); }
 			}
 			var promises = [];
 			switch(name) {
 				case "default": {
 					register("is-array", "1.0.1", () => require.e("node_modules_is-array_index_js").then(() => () => require( "./node_modules/is-array/index.js")));
 				}
 				break;
 			}
 			if(!promises.length) return initPromises[name] = 1;
 			return initPromises[name] = Promise.all(promises).then(() => initPromises[name] = 1);
 		};
 	})();
 	(() => {
 		require.p = "http://localhost:8080/";
 	})();
 	(() => {
 		var installedChunks = {
 			"main": 0
 		};
 		require.f.j = (chunkId, promises) => {
 				var installedChunkData = require.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
 				if(installedChunkData !== 0) {
 					if(installedChunkData) {
 						promises.push(installedChunkData[2]);
 					} else {
 						if(true) {
 							var promise = new Promise((resolve, reject) => {
 								installedChunkData = installedChunks[chunkId] = [resolve, reject];
 							});
 							promises.push(installedChunkData[2] = promise);
 							var url = require.p + require.u(chunkId);
 							var error = new Error();
 							var loadingEnded = (event) => {
 								if(require.o(installedChunks, chunkId)) {
 									installedChunkData = installedChunks[chunkId];
 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
 									if(installedChunkData) {
 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
 										var realSrc = event && event.target && event.target.src;
 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
 										error.name = 'ChunkLoadError';
 										error.type = errorType;
 										error.request = realSrc;
 										installedChunkData[1](error);
 									}
 								}
 							};
 							require.l(url, loadingEnded, "chunk-" + chunkId);
 						} else installedChunks[chunkId] = 0;
 					}
 				}
 		};
 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
 			var [chunkIds, moreModules, runtime] = data;
 			var moduleId, chunkId, i = 0, resolves = [];
 			for(;i < chunkIds.length; i++) {
 				chunkId = chunkIds[i];
 				if(require.o(installedChunks, chunkId) && installedChunks[chunkId]) {
 					resolves.push(installedChunks[chunkId][0]);
 				}
 				installedChunks[chunkId] = 0;
 			}
 			for(moduleId in moreModules) {
 				if(require.o(moreModules, moduleId)) {
 					require.m[moduleId] = moreModules[moduleId];
 				}
 			}
 			if(runtime) runtime(require);
 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
 			while(resolves.length) {
 				resolves.shift()();
 			}
 		}
 		var chunkLoadingGlobal = self["webpackChunkteamb"] = self["webpackChunkteamb"] || [];
 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
 	})();
require.e( "src_bootstrap_js").then(require.t.bind(require,  "./src/bootstrap.js", 23));
 })()
;