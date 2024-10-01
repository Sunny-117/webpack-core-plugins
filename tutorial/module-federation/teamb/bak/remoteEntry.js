var teamb; teamb =
	(() => {
		"use strict";
		var modules = ({
			"webpack/container/entry/teamb":
				((module, exports, require) => {
					var moduleMap = {
						"./Dropdown": () => {
							return Promise.all([require.e("webpack_sharing_consume_default_is-array_is-array"), require.e("src_Dropdown_js")]).then(() => () => (require("./src/Dropdown.js")));
						},
						"./Button": () => {
							return Promise.all([require.e("webpack_sharing_consume_default_is-array_is-array"), require.e("src_Button_js")]).then(() => () => (require("./src/Button.js")));
						}
					};
					var get = (module, getScope) => {
						require.R = getScope;
						getScope = (
							require.o(moduleMap, module)
								? moduleMap[module]()
								: Promise.resolve().then(() => {
									throw new Error('Module "' + module + '" does not exist in container.');
								})
						);
						require.R = undefined;
						return getScope;
					};
					var init = (shareScope, initScope) => {
						if (!require.S) return;
						var oldScope = require.S["default"];
						var name = "default"
						if (oldScope && oldScope !== shareScope) throw new Error("Container initialization failed as it has already been initialized with a different share scope");
						require.S[name] = shareScope;
						return require.I(name, initScope);
					};
					require.d(exports, {
						get: () => get,
						init: () => init
					});
				})
		});
		var cache = {};
		function require(moduleId) {
			if (cache[moduleId]) {
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
			require.n = (module) => {
				var getter = module && module.__esModule ?
					() => module['default'] :
					() => module;
				require.d(getter, { a: getter });
				return getter;
			};
		})();
		(() => {
			require.d = (exports, definition) => {
				for (var key in definition) {
					if (require.o(definition, key) && !require.o(exports, key)) {
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
				if (inProgress[url]) { inProgress[url].push(done); return; }
				var script, needAttach;
				if (key !== undefined) {
					var scripts = document.getElementsByTagName("script");
					for (var i = 0; i < scripts.length; i++) {
						var s = scripts[i];
						if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
					}
				}
				if (!script) {
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
					if (prev) return prev(event);
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
				if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
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
				if (!initScope) initScope = [];
				var initToken = initTokens[name];
				if (!initToken) initToken = initTokens[name] = {};
				if (initScope.indexOf(initToken) >= 0) return;
				initScope.push(initToken);
				if (initPromises[name]) return initPromises[name];
				if (!require.o(require.S, name)) require.S[name] = {};
				var scope = require.S[name];
				var warn = (msg) => typeof console !== "undefined" && console.warn && console.warn(msg);;
				var uniqueName = "teamb";
				var register = (name, version, factory) => {
					var versions = scope[name] = scope[name] || {};
					var activeVersion = versions[version];
					if (!activeVersion || !activeVersion.loaded && uniqueName > activeVersion.from) versions[version] = { get: factory, from: uniqueName };
				};
				var initExternal = (id) => {
					var handleError = (err) => warn("Initialization of sharing external failed: " + err);
					try {
						var module = require(id);
						if (!module) return;
						var initFn = (module) => module && module.init && module.init(require.S[name], initScope)
						if (module.then) return promises.push(module.then(initFn, handleError));
						var initResult = initFn(module);
						if (initResult && initResult.then) return promises.push(initResult.catch(handleError));
					} catch (err) { handleError(err); }
				}
				var promises = [];
				switch (name) {
					case "default": {
						register("is-array", "1.0.1", () => require.e("node_modules_is-array_index_js").then(() => () => require("./node_modules/is-array/index.js")));
					}
						break;
				}
				if (!promises.length) return initPromises[name] = 1;
				return initPromises[name] = Promise.all(promises).then(() => initPromises[name] = 1);
			};
		})();
		(() => {
			require.p = "http://localhost:8080/";
		})();
		(() => {
			var parseVersion = (str) => {
				var p = p => { return p.split(".").map((p => { return +p == p ? +p : p })) }, n = /^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(str), r = n[1] ? p(n[1]) : []; return n[2] && (r.length++, r.push.apply(r, p(n[2]))), n[3] && (r.push([]), r.push.apply(r, p(n[3]))), r;
			}
			var versionLt = (a, b) => {
				a = parseVersion(a), b = parseVersion(b); for (var r = 0; ;) { if (r >= a.length) return r < b.length && "u" != (typeof b[r])[0]; var e = a[r], n = (typeof e)[0]; if (r >= b.length) return "u" == n; var t = b[r], f = (typeof t)[0]; if (n != f) return "o" == n && "n" == f || ("s" == f || "u" == n); if ("o" != n && "u" != n && e != t) return e < t; r++ }
			}
			var rangeToString = (range) => {
				if (1 === range.length) return "*"; if (0 in range) { var r = "", n = range[0]; r += 0 == n ? ">=" : -1 == n ? "<" : 1 == n ? "^" : 2 == n ? "~" : n > 0 ? "=" : "!="; for (var e = 1, a = 1; a < range.length; a++) { e--, r += "u" == (typeof (t = range[a]))[0] ? "-" : (e > 0 ? "." : "") + (e = 2, t) } return r } var g = []; for (a = 1; a < range.length; a++) { var t = range[a]; g.push(0 === t ? "not(" + o() + ")" : 1 === t ? "(" + o() + " || " + o() + ")" : 2 === t ? g.pop() + " " + g.pop() : rangeToString(t)) } return o(); function o() { return g.pop().replace(/^\((.+)\)$/, "$1") }
			}
			var satisfy = (range, version) => {
				if (0 in range) { version = parseVersion(version); var e = range[0], r = e < 0; r && (e = -e - 1); for (var n = 0, i = 1, a = !0; ; i++, n++) { var f, s, g = i < range.length ? (typeof range[i])[0] : ""; if (n >= version.length || "o" == (s = (typeof (f = version[n]))[0])) return !a || ("u" == g ? i > e && !r : "" == g != r); if ("u" == s) { if (!a || "u" != g) return !1 } else if (a) if (g == s) if (i <= e) { if (f != range[i]) return !1 } else { if (r ? f > range[i] : f < range[i]) return !1; f != range[i] && (a = !1) } else if ("s" != g && "n" != g) { if (r || i <= e) return !1; a = !1, i-- } else { if (i <= e || s < g != r) return !1; a = !1 } else "s" != g && "n" != g && (a = !1, i--) } } var t = [], o = t.pop.bind(t); for (n = 1; n < range.length; n++) { var u = range[n]; t.push(1 == u ? o() | o() : 2 == u ? o() & o() : u ? satisfy(u, version) : !o()) } return !!o();
			}
			var ensureExistence = (scopeName, key) => {
				var scope = require.S[scopeName];
				if (!scope || !require.o(scope, key)) throw new Error("Shared module " + key + " doesn't exist in shared scope " + scopeName);
				return scope;
			};
			var findVersion = (scope, key) => {
				var versions = scope[key];
				var key = Object.keys(versions).reduce((a, b) => {
					return !a || versionLt(a, b) ? b : a;
				}, 0);
				return key && versions[key]
			};
			var findSingletonVersionKey = (scope, key) => {
				var versions = scope[key];
				return Object.keys(versions).reduce((a, b) => {
					return !a || (!versions[a].loaded && versionLt(a, b)) ? b : a;
				}, 0);
			};
			var getInvalidSingletonVersionMessage = (key, version, requiredVersion) => {
				return "Unsatisfied version " + version + " of shared singleton module " + key + " (required " + rangeToString(requiredVersion) + ")"
			};
			var getSingletonVersion = (scope, scopeName, key, requiredVersion) => {
				var version = findSingletonVersionKey(scope, key);
				if (!satisfy(requiredVersion, version)) typeof console !== "undefined" && console.warn && console.warn(getInvalidSingletonVersionMessage(key, version, requiredVersion));
				return get(scope[key][version]);
			};
			var getStrictSingletonVersion = (scope, scopeName, key, requiredVersion) => {
				var version = findSingletonVersionKey(scope, key);
				if (!satisfy(requiredVersion, version)) throw new Error(getInvalidSingletonVersionMessage(key, version, requiredVersion));
				return get(scope[key][version]);
			};
			var findValidVersion = (scope, key, requiredVersion) => {
				var versions = scope[key];
				var key = Object.keys(versions).reduce((a, b) => {
					if (!satisfy(requiredVersion, b)) return a;
					return !a || versionLt(a, b) ? b : a;
				}, 0);
				return key && versions[key]
			};
			var getInvalidVersionMessage = (scope, scopeName, key, requiredVersion) => {
				var versions = scope[key];
				return "No satisfying version (" + rangeToString(requiredVersion) + ") of shared module " + key + " found in shared scope " + scopeName + ".\n" +
					"Available versions: " + Object.keys(versions).map((key) => {
						return key + " from " + versions[key].from;
					}).join(", ");
			};
			var getValidVersion = (scope, scopeName, key, requiredVersion) => {
				var entry = findValidVersion(scope, key, requiredVersion);
				if (entry) return get(entry);
				throw new Error(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
			};
			var warnInvalidVersion = (scope, scopeName, key, requiredVersion) => {
				typeof console !== "undefined" && console.warn && console.warn(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
			};
			var get = (entry) => {
				entry.loaded = 1;
				return entry.get()
			};
			var init = (fn) => function (scopeName, a, b, c) {
				var promise = require.I(scopeName);
				if (promise && promise.then) return promise.then(fn.bind(fn, scopeName, require.S[scopeName], a, b, c));
				return fn(scopeName, require.S[scopeName], a, b, c);
			};
			var load = /*#__PURE__*/ init((scopeName, scope, key) => {
				ensureExistence(scopeName, key);
				return get(findVersion(scope, key));
			});
			var loadFallback = /*#__PURE__*/ init((scopeName, scope, key, fallback) => {
				return scope && require.o(scope, key) ? get(findVersion(scope, key)) : fallback();
			});
			var loadVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
				ensureExistence(scopeName, key);
				return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
			});
			var loadSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
				ensureExistence(scopeName, key);
				return getSingletonVersion(scope, scopeName, key, version);
			});
			var loadStrictVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
				ensureExistence(scopeName, key);
				return getValidVersion(scope, scopeName, key, version);
			});
			var loadStrictSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
				ensureExistence(scopeName, key);
				return getStrictSingletonVersion(scope, scopeName, key, version);
			});
			var loadVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
				if (!scope || !require.o(scope, key)) return fallback();
				return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
			});
			var loadSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
				if (!scope || !require.o(scope, key)) return fallback();
				return getSingletonVersion(scope, scopeName, key, version);
			});
			var loadStrictVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
				var entry = scope && require.o(scope, key) && findValidVersion(scope, key, version);
				return entry ? get(entry) : fallback();
			});
			var loadStrictSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
				if (!scope || !require.o(scope, key)) return fallback();
				return getStrictSingletonVersion(scope, scopeName, key, version);
			});
			var installedModules = {};
			var moduleToHandlerMapping = {
				"webpack/sharing/consume/default/is-array/is-array": () => loadStrictVersionCheckFallback("default", "is-array", [1, 1, 0, 1], () => require.e("node_modules_is-array_index_js").then(() => () => require("./node_modules/is-array/index.js")))
			};
			var chunkMapping = {
				"webpack_sharing_consume_default_is-array_is-array": [
					"webpack/sharing/consume/default/is-array/is-array"
				]
			};
			require.f.consumes = (chunkId, promises) => {
				if (require.o(chunkMapping, chunkId)) {
					chunkMapping[chunkId].forEach((id) => {
						if (require.o(installedModules, id)) return promises.push(installedModules[id]);
						var onFactory = (factory) => {
							installedModules[id] = 0;
							modules[id] = (module) => {
								delete cache[id];
								module.exports = factory();
							}
						};
						var onError = (error) => {
							delete installedModules[id];
							modules[id] = (module) => {
								delete cache[id];
								throw error;
							}
						};
						try {
							var promise = moduleToHandlerMapping[id]();
							if (promise.then) {
								promises.push(installedModules[id] = promise.then(onFactory).catch(onError));
							} else onFactory(promise);
						} catch (e) { onError(e); }
					});
				}
			}
		})();
		(() => {
			var installedChunks = {
				"teamb": 0
			};
			require.f.j = (chunkId, promises) => {
				var installedChunkData = require.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
				if (installedChunkData !== 0) {
					if (installedChunkData) {
						promises.push(installedChunkData[2]);
					} else {
						if ("webpack_sharing_consume_default_is-array_is-array" != chunkId) {
							var promise = new Promise((resolve, reject) => {
								installedChunkData = installedChunks[chunkId] = [resolve, reject];
							});
							promises.push(installedChunkData[2] = promise);
							var url = require.p + require.u(chunkId);
							var error = new Error();
							var loadingEnded = (event) => {
								if (require.o(installedChunks, chunkId)) {
									installedChunkData = installedChunks[chunkId];
									if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
									if (installedChunkData) {
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
				for (; i < chunkIds.length; i++) {
					chunkId = chunkIds[i];
					if (require.o(installedChunks, chunkId) && installedChunks[chunkId]) {
						resolves.push(installedChunks[chunkId][0]);
					}
					installedChunks[chunkId] = 0;
				}
				for (moduleId in moreModules) {
					if (require.o(moreModules, moduleId)) {
						require.m[moduleId] = moreModules[moduleId];
					}
				}
				if (runtime) runtime(require);
				if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
				while (resolves.length) {
					resolves.shift()();
				}
			}
			var chunkLoadingGlobal = self["webpackChunkteamb"] = self["webpackChunkteamb"] || [];
			chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
			chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
		})();
		return require("webpack/container/entry/teamb");
	})()
	;