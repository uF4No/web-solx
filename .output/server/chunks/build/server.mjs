import { shallowReactive, reactive, effectScope, getCurrentScope, hasInjectionContext, getCurrentInstance, inject, toRef, computed, defineComponent, h, isReadonly, isRef, isShallow, isReactive, toRaw, ref, mergeProps, useSSRContext, defineAsyncComponent, unref, provide, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, createApp } from 'vue';
import { h as createHooks, i as getContext, k as hasProtocol, l as joinURL, w as withQuery, s as sanitizeStatusCode, m as isScriptProtocol, c as createError$1, t as toRouteMatcher, n as createRouter, o as defu, p as isEqual, q as stringifyParsedURL, r as stringifyQuery, v as parseQuery } from '../nitro/nitro.mjs';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';

const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";

function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.16.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide && typeof provide === "object") {
      for (const key in provide) {
        nuxtApp.provide(key, provide[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins) {
  var _a, _b, _c, _d;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin.dependsOn) == null ? void 0 : _a2.filter((name) => plugins.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.push(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance || (nuxtAppInstance = getNuxtAppCtx(id).tryUse());
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}

const PageRouteSymbol = Symbol("route");

const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to || (to = "/");
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}

const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value || (error2.value = nuxtError);
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};

const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});

async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: useRuntimeConfig().nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}

const manifest_45route_45rule = defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});

const globalMiddleware = [
  manifest_45route_45rule
];

function getRouteFromPath(fullPath) {
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: {},
    name: void 0,
    matched: [],
    redirectedFrom: void 0,
    meta: {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    useRuntimeConfig().app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          var _a;
          const route2 = router.resolve(props.to);
          return props.custom ? (_a = slots.default) == null ? void 0 : _a.call(slots, { href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware || (nuxtApp._middleware = {
      global: [],
      named: {}
    });
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        var _a;
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext)) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});

function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}

const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});

const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = defineNuxtPlugin({
  name: "nuxt:global-components"
});

const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$9 = {
  __name: "TerminalDemo",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const showLine1 = ref(false);
    const showLine2 = ref(false);
    const showLine3 = ref(false);
    const showLine4 = ref(false);
    const showLine5 = ref(false);
    const showLine6 = ref(false);
    const showLine7 = ref(false);
    const showLine8 = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl" }, _attrs))} data-v-ff428144><div class="px-4 py-2 bg-gray-900 flex items-center" data-v-ff428144><div class="flex space-x-2" data-v-ff428144><div class="w-3 h-3 rounded-full bg-red-500" data-v-ff428144></div><div class="w-3 h-3 rounded-full bg-yellow-500" data-v-ff428144></div><div class="w-3 h-3 rounded-full bg-green-500" data-v-ff428144></div></div><div class="ml-4 text-gray-400 text-sm" data-v-ff428144>Terminal</div></div><div class="p-4 font-mono text-sm text-white text-left h-[350px] overflow-y-auto" data-v-ff428144><div class="flex items-start" data-v-ff428144><span class="text-green-400 shrink-0" data-v-ff428144>$</span><span class="ml-2 flex-1 text-left" data-v-ff428144><span class="text-left" data-v-ff428144></span></span></div><div class="space-y-1 text-left" data-v-ff428144><div style="${ssrRenderStyle(showLine1.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine1.value, "opacity-0": !showLine1.value }, "text-green-400 mt-2 transition-opacity duration-200"])}" data-v-ff428144>[+] Compiling...</div><div style="${ssrRenderStyle(showLine2.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine2.value, "opacity-0": !showLine2.value }, "text-green-400 transition-opacity duration-200"])}" data-v-ff428144>[+] Compiling 49 files with <span class="text-blue-400" data-v-ff428144>solx 0.8.29</span></div><div style="${ssrRenderStyle(showLine3.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine3.value, "opacity-0": !showLine3.value }, "text-green-400 transition-opacity duration-200"])}" data-v-ff428144>[+] solx finished in <span class="text-blue-400" data-v-ff428144>1.32s</span></div><div style="${ssrRenderStyle(showLine4.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine4.value, "opacity-0": !showLine4.value }, "text-green-500 transition-opacity duration-200"])}" data-v-ff428144>Compiler run successful</div><div style="${ssrRenderStyle(showLine5.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine5.value, "opacity-0": !showLine5.value }, "text-white transition-opacity duration-200"])}" data-v-ff428144>Ran 13 tests for test/ERC20.t.sol:<span class="text-yellow-400" data-v-ff428144>ERC20Test</span></div><div style="${ssrRenderStyle(showLine6.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine6.value, "opacity-0": !showLine6.value }, "text-white transition-opacity duration-200"])}" data-v-ff428144>Suite result: <span class="text-green-500" data-v-ff428144>ok. 13 passed;</span> <span class="text-red-500" data-v-ff428144>0 failed;</span> <span class="text-yellow-500" data-v-ff428144>0 skipped;</span> finished in <span class="text-blue-400" data-v-ff428144>1.98ms</span> (<span class="text-blue-400" data-v-ff428144>7.81ms</span> CPU time)</div><div style="${ssrRenderStyle(showLine7.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine7.value, "opacity-0": !showLine7.value }, "text-white mt-4 transition-opacity duration-200"])}" data-v-ff428144>==== Summary of Gas Test Results vs solc ====</div><pre style="${ssrRenderStyle(showLine8.value ? null : { display: "none" })}" class="${ssrRenderClass([{ "opacity-100": showLine8.value, "opacity-0": !showLine8.value }, "transition-opacity duration-200"])}" data-v-ff428144><span class="text-gray-500" data-v-ff428144>+----------------+------------+-----------------+---------------+--------------+</span>
<span class="text-gray-500" data-v-ff428144>|</span> <span class="text-blue-400" data-v-ff428144>Project</span>        <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-blue-400" data-v-ff428144># of Tests</span> <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-blue-400" data-v-ff428144>Avg Gas Savings</span> <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-blue-400" data-v-ff428144>Least Savings</span> <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-blue-400" data-v-ff428144>Most Savings</span> <span class="text-gray-500" data-v-ff428144>|</span>
<span class="text-gray-500" data-v-ff428144>+----------------+------------+-----------------+---------------+--------------+</span>
<span class="text-gray-500" data-v-ff428144>|</span> <span class="text-yellow-400" data-v-ff428144>ERC20</span>          <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-white" data-v-ff428144>12</span>         <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-green-400" data-v-ff428144>-2.02%</span>          <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-green-400" data-v-ff428144>-0.79%</span>        <span class="text-gray-500" data-v-ff428144>|</span> <span class="text-green-400" data-v-ff428144>-5.20%</span>       <span class="text-gray-500" data-v-ff428144>|</span>
<span class="text-gray-500" data-v-ff428144>+----------------+------------+-----------------+---------------+--------------+</span></pre></div></div></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TerminalDemo.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-ff428144"]]);

const _imports_0 = "" + __buildAssetsURL("logo.B2zJ9tz7.png");

const _sfc_main$8 = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  const _component_TerminalDemo = __nuxt_component_0$1;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 bg-secondary text-center" }, _attrs))}><div class="container mx-auto px-4"><div class="flex justify-center mb-8"><img${ssrRenderAttr("src", _imports_0)} alt="solx Cube" class="h-32 w-32"></div><h1 class="text-3xl md:text-5xl font-mono mb-6 text-primary"> { solx } </h1><h2 class="text-2xl md:text-4xl font-mono mb-8 text-secondary"> A gas-efficient Solidity compiler for Ethereum </h2><p class="text-xl md:text-2xl text-tertiary max-w-3xl mx-auto mb-12"> Powered by LLVM, the most mature compiler infrastructure in the world. </p>`);
  _push(ssrRenderComponent(_component_TerminalDemo, null, null, _parent));
  _push(`<div class="flex justify-center space-x-4 mt-8"><a href="https://github.com/solx" target="_blank" class="inline-flex items-center px-8 py-3 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30"><svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clip-rule="evenodd"></path></svg> View on GitHub </a><a href="/demo" class="inline-flex items-center px-8 py-3 bg-[#4ECCA3] text-gray-900 dark:text-white rounded-lg hover:bg-[#3DBB92] transition-colors text-base font-mono border border-transparent"> Run the benchmark </a></div></div></section>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$5]]);

const _sfc_main$7 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "py-16 bg-tertiary",
    id: "features"
  }, _attrs))} data-v-ca59622a><div class="container mx-auto px-4" data-v-ca59622a><h2 class="text-4xl font-mono text-center mb-16 text-primary" data-v-ca59622a>Features</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" data-v-ca59622a><div class="relative" data-v-ca59622a><div class="p-6 bg-secondary rounded-lg border border-primary h-full flex flex-col" data-v-ca59622a><div class="mb-6" data-v-ca59622a><svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-ca59622a><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" data-v-ca59622a></path></svg></div><h3 class="text-2xl font-mono mb-4 text-primary" data-v-ca59622a>Gas Optimization</h3><p class="mb-6 text-tertiary text-lg flex-grow" data-v-ca59622a> Advanced bytecode optimization techniques reduce gas costs compared to solc generated bytecode, with the same exact functionality. </p></div></div><div class="relative" data-v-ca59622a><div class="p-6 bg-secondary rounded-lg border border-primary h-full flex flex-col" data-v-ca59622a><div class="mb-6" data-v-ca59622a><svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-ca59622a><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" data-v-ca59622a></path><polyline points="7.5 4.21 12 6.81 16.5 4.21" data-v-ca59622a></polyline><polyline points="7.5 19.79 7.5 14.6 3 12" data-v-ca59622a></polyline><polyline points="21 12 16.5 14.6 16.5 19.79" data-v-ca59622a></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96" data-v-ca59622a></polyline><line x1="12" y1="22.08" x2="12" y2="12" data-v-ca59622a></line></svg></div><h3 class="text-2xl font-mono mb-4 text-primary" data-v-ca59622a>Drop-in Ready</h3><p class="mb-6 text-tertiary text-lg flex-grow" data-v-ca59622a> Compatible with existing solc flags and configurations. Works with Foundry, Hardhat, and other development tools out of the box. </p></div></div><div class="relative" data-v-ca59622a><div class="p-6 bg-secondary rounded-lg border border-primary h-full flex flex-col" data-v-ca59622a><div class="mb-6" data-v-ca59622a><svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-ca59622a><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" data-v-ca59622a></path></svg></div><h3 class="text-2xl font-mono mb-4 text-primary" data-v-ca59622a>LLVM Framework</h3><p class="mb-6 text-tertiary text-lg flex-grow" data-v-ca59622a> Built on LLVM&#39;s world-class compiler infrastructure, enabling robust optimizations and reliable code generation. </p></div></div></div></div></section>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeaturesSection.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-ca59622a"]]);

const _sfc_main$6 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    id: "quickstart",
    class: "py-16 bg-secondary"
  }, _attrs))} data-v-86c6143c><div class="container mx-auto px-4" data-v-86c6143c><h2 class="text-4xl font-mono mb-12 text-center text-primary" data-v-86c6143c>Use solx with Foundry</h2><div class="max-w-3xl mx-auto space-y-12" data-v-86c6143c><div class="relative pl-10" data-v-86c6143c><div class="absolute left-0 top-2 flex items-center" data-v-86c6143c><div class="w-7 h-7 rounded-full bg-[#4ECCA3] flex items-center justify-center text-sm font-mono text-white" data-v-86c6143c> 1 </div></div><div class="space-y-3" data-v-86c6143c><h3 class="text-2xl font-mono text-primary" data-v-86c6143c>Download the solx binary</h3><p class="text-lg text-tertiary" data-v-86c6143c> Get the latest version of solx from the <a href="https://github.com/matter-labs/solx/releases" target="_blank" class="text-[#4ECCA3] hover:text-[#3DBB92] hover:underline" data-v-86c6143c>GitHub releases page</a>. </p></div></div><div class="relative pl-10" data-v-86c6143c><div class="absolute left-0 top-2 flex items-center" data-v-86c6143c><div class="w-7 h-7 rounded-full bg-[#4ECCA3] flex items-center justify-center text-sm font-mono text-white" data-v-86c6143c> 2 </div></div><div class="space-y-4" data-v-86c6143c><h3 class="text-2xl font-mono text-primary" data-v-86c6143c>Create a solx profile in your <span class="font-mono text-[#4ECCA3]" data-v-86c6143c>foundry.toml</span></h3><div class="bg-tertiary rounded-lg overflow-hidden shadow-xl" data-v-86c6143c><div class="px-4 py-2 bg-tertiary flex items-center border-b border-primary" data-v-86c6143c><div class="flex space-x-2" data-v-86c6143c><div class="w-3 h-3 rounded-full bg-red-500" data-v-86c6143c></div><div class="w-3 h-3 rounded-full bg-yellow-500" data-v-86c6143c></div><div class="w-3 h-3 rounded-full bg-green-500" data-v-86c6143c></div></div><div class="ml-4 text-tertiary text-base font-mono" data-v-86c6143c>foundry.toml</div></div><div class="p-4 font-mono text-base text-primary text-left bg-tertiary/50" data-v-86c6143c><div class="text-[#4ECCA3]" data-v-86c6143c>[profile.solx]</div><div class="ml-4" data-v-86c6143c><span class="text-blue-400" data-v-86c6143c>solc_version</span><span class="text-primary" data-v-86c6143c> = </span><span class="text-yellow-400" data-v-86c6143c>&quot;/path/to/solx&quot;</span></div></div></div></div></div><div class="relative pl-10" data-v-86c6143c><div class="absolute left-0 top-2 flex items-center" data-v-86c6143c><div class="w-7 h-7 rounded-full bg-[#4ECCA3] flex items-center justify-center text-sm font-mono text-white" data-v-86c6143c> 3 </div></div><div class="space-y-4" data-v-86c6143c><h3 class="text-2xl font-mono text-primary" data-v-86c6143c>Build your project with solx</h3><p class="text-lg text-tertiary" data-v-86c6143c> Use the solx profile to compile your project with enhanced optimizations. </p><div class="bg-tertiary rounded-lg overflow-hidden shadow-xl" data-v-86c6143c><div class="px-4 py-2 bg-tertiary flex items-center border-b border-primary" data-v-86c6143c><div class="flex space-x-2" data-v-86c6143c><div class="w-3 h-3 rounded-full bg-red-500" data-v-86c6143c></div><div class="w-3 h-3 rounded-full bg-yellow-500" data-v-86c6143c></div><div class="w-3 h-3 rounded-full bg-green-500" data-v-86c6143c></div></div><div class="ml-4 text-tertiary text-base font-mono" data-v-86c6143c>Terminal</div></div><div class="p-4 font-mono text-base text-primary text-left bg-tertiary/50" data-v-86c6143c><div class="flex items-start" data-v-86c6143c><span class="text-green-400 shrink-0" data-v-86c6143c>$</span><span class="ml-2 flex-1 text-primary" data-v-86c6143c>FOUNDRY_PROFILE=solx forge build</span></div></div></div></div></div><div class="mt-8 p-6 bg-tertiary rounded-lg" data-v-86c6143c><p class="text-base text-tertiary" data-v-86c6143c> 💡 <span class="font-mono font-semibold text-[#4ECCA3]" data-v-86c6143c>Pro tip:</span> You can also use the solx profile for testing and getting gas reports. </p></div></div></div></section>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FoundrySection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-86c6143c"]]);

const _sfc_main$5 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 bg-secondary" }, _attrs))} data-v-1f678cb2><div class="container mx-auto px-4" data-v-1f678cb2><div class="text-center mb-16" data-v-1f678cb2><h2 class="text-4xl font-mono mb-6 text-primary" data-v-1f678cb2>Get involved</h2><p class="text-2xl text-tertiary max-w-3xl mx-auto" data-v-1f678cb2> Help us build the future of Solidity compilation </p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" data-v-1f678cb2><div class="relative" data-v-1f678cb2><div class="p-6 bg-tertiary rounded-lg border border-primary h-full flex flex-col" data-v-1f678cb2><div class="mb-6" data-v-1f678cb2><svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-1f678cb2><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" data-v-1f678cb2></path></svg></div><h3 class="text-2xl font-mono mb-4 text-primary" data-v-1f678cb2>Learn solx</h3><p class="mb-6 text-tertiary text-lg flex-grow" data-v-1f678cb2> Take some time to explore our documentation to help you better understand how solx works. </p><a href="https://github.com/matter-labs/solx/tree/main/docs" class="inline-block w-full py-3 px-6 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30" target="_blank" rel="noopener" data-v-1f678cb2> READ THE DOCS </a></div></div><div class="relative" data-v-1f678cb2><div class="p-6 bg-tertiary rounded-lg border border-primary h-full flex flex-col" data-v-1f678cb2><div class="mb-6" data-v-1f678cb2><svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-1f678cb2><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" data-v-1f678cb2></path><polyline points="7.5 4.21 12 6.81 16.5 4.21" data-v-1f678cb2></polyline><polyline points="7.5 19.79 7.5 14.6 3 12" data-v-1f678cb2></polyline><polyline points="21 12 16.5 14.6 16.5 19.79" data-v-1f678cb2></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96" data-v-1f678cb2></polyline><line x1="12" y1="22.08" x2="12" y2="12" data-v-1f678cb2></line></svg></div><h3 class="text-2xl font-mono mb-4 text-primary" data-v-1f678cb2>Try solx</h3><p class="mb-6 text-tertiary text-lg flex-grow" data-v-1f678cb2> The solx team has compiled demos and examples to help you get started with the compiler quickly. </p><a href="https://github.com/popzxc/solx_demo" class="inline-block w-full py-3 px-6 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30" target="_blank" rel="noopener" data-v-1f678cb2> TRY THE DEMO </a></div></div><div class="relative" data-v-1f678cb2><div class="p-6 bg-tertiary rounded-lg border border-primary h-full flex flex-col" data-v-1f678cb2><div class="mb-6" data-v-1f678cb2><svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-1f678cb2><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" data-v-1f678cb2></path></svg></div><h3 class="text-2xl font-mono mb-4 text-primary" data-v-1f678cb2>Contribute code</h3><p class="mb-6 text-tertiary text-lg flex-grow" data-v-1f678cb2> solx is truly a community effort, and we welcome contribution from hobbyists and production users alike! </p><a href="https://github.com/matter-labs/solx/blob/main/CONTRIBUTING.md" class="inline-block w-full py-3 px-6 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30" target="_blank" rel="noopener" data-v-1f678cb2> CONTRIBUTION GUIDE </a></div></div></div></div></section>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContributeSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-1f678cb2"]]);

const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 bg-secondary" }, _attrs))} data-v-ecf5fc5c><div class="container mx-auto px-4 text-center" data-v-ecf5fc5c><h2 class="text-3xl font-mono mb-8 text-primary" data-v-ecf5fc5c>solx vs solc</h2><p class="text-xl text-tertiary max-w-3xl mx-auto mb-12" data-v-ecf5fc5c> Want to see how solx performs compared to solc? Check out our demo project to benchmark and test. </p><div class="max-w-3xl mx-auto mb-12" data-v-ecf5fc5c><div class="bg-tertiary rounded-lg p-6 shadow-lg" data-v-ecf5fc5c><h3 class="text-lg font-mono mb-6 text-primary" data-v-ecf5fc5c>Gas Consumption Across Different Projects</h3><div class="relative" data-v-ecf5fc5c><div class="absolute -left-4 top-1/2 -rotate-90 transform -translate-y-1/2 text-xs text-tertiary" data-v-ecf5fc5c> Gas Usage (%) </div><div class="pl-6" data-v-ecf5fc5c><div class="grid grid-cols-4 gap-3" data-v-ecf5fc5c><div class="space-y-2" data-v-ecf5fc5c><div class="h-32 flex items-end space-x-1 justify-center" data-v-ecf5fc5c><div class="w-8 bg-gray-400 rounded-t-lg" style="${ssrRenderStyle({ "height": "100%" })}" data-v-ecf5fc5c></div><div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="${ssrRenderStyle({ "height": "97%" })}" data-v-ecf5fc5c></div></div><div class="text-xs font-mono text-primary" data-v-ecf5fc5c>ERC20</div><div class="text-xs text-[#4ECCA3]" data-v-ecf5fc5c>-3%</div></div><div class="space-y-2" data-v-ecf5fc5c><div class="h-32 flex items-end space-x-1 justify-center" data-v-ecf5fc5c><div class="w-8 bg-gray-400 rounded-t-lg" style="${ssrRenderStyle({ "height": "100%" })}" data-v-ecf5fc5c></div><div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="${ssrRenderStyle({ "height": "98%" })}" data-v-ecf5fc5c></div></div><div class="text-xs font-mono text-primary" data-v-ecf5fc5c>ERC721</div><div class="text-xs text-[#4ECCA3]" data-v-ecf5fc5c>-2%</div></div><div class="space-y-2" data-v-ecf5fc5c><div class="h-32 flex items-end space-x-1 justify-center" data-v-ecf5fc5c><div class="w-8 bg-gray-400 rounded-t-lg" style="${ssrRenderStyle({ "height": "100%" })}" data-v-ecf5fc5c></div><div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="${ssrRenderStyle({ "height": "97%" })}" data-v-ecf5fc5c></div></div><div class="text-xs font-mono text-primary" data-v-ecf5fc5c>ERC1155</div><div class="text-xs text-[#4ECCA3]" data-v-ecf5fc5c>-3%</div></div><div class="space-y-2" data-v-ecf5fc5c><div class="h-32 flex items-end space-x-1 justify-center" data-v-ecf5fc5c><div class="w-8 bg-gray-400 rounded-t-lg" style="${ssrRenderStyle({ "height": "100%" })}" data-v-ecf5fc5c></div><div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="${ssrRenderStyle({ "height": "83%" })}" data-v-ecf5fc5c></div></div><div class="text-xs font-mono text-primary" data-v-ecf5fc5c>solmate</div><div class="text-xs text-[#4ECCA3]" data-v-ecf5fc5c>-17%</div></div></div><div class="h-px bg-primary mt-2" data-v-ecf5fc5c></div></div></div><div class="flex justify-center items-center space-x-6 mt-6" data-v-ecf5fc5c><div class="flex items-center" data-v-ecf5fc5c><div class="w-3 h-3 bg-gray-400 rounded mr-2" data-v-ecf5fc5c></div><span class="text-xs font-mono text-tertiary" data-v-ecf5fc5c>solc</span></div><div class="flex items-center" data-v-ecf5fc5c><div class="w-3 h-3 bg-[#4ECCA3] rounded mr-2" data-v-ecf5fc5c></div><span class="text-xs font-mono text-[#4ECCA3]" data-v-ecf5fc5c>solx</span></div></div><p class="mt-4 text-xs text-tertiary" data-v-ecf5fc5c> * Based on Foundry tests gas reports. </p></div></div><a href="https://github.com/popzxc/solx_demo" target="_blank" class="inline-flex items-center px-4 py-2 bg-tertiary text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-white transition-colors text-sm font-mono border border-primary" data-v-ecf5fc5c> Run the benchmarks </a></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SolxSolcSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-ecf5fc5c"]]);

const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-secondary border-t border-primary" }, _attrs))}><div class="container mx-auto px-4 py-12"><div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto"><div class="col-span-1 md:col-span-2"><div class="flex items-center mb-4"><img${ssrRenderAttr("src", _imports_0)} alt="solx Logo" class="h-8 w-8 mr-2"><span class="text-xl font-mono text-primary">{ solx }</span></div><p class="text-tertiary text-sm"> A highly-efficient Solidity compiler for the EVM, powered by LLVM. </p></div><div><h4 class="text-sm font-mono text-primary mb-4">Resources</h4><ul class="space-y-2"><li><a href="/docs" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Documentation</a></li><li><a href="https://github.com/matter-labs/solx/blob/main/CONTRIBUTING.md" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Contributing</a></li><li><a href="https://github.com/matter-labs/solx/releases" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Releases</a></li></ul></div><div><h4 class="text-sm font-mono text-primary mb-4">Community</h4><ul class="space-y-2"><li><a href="https://github.com/matter-labs/solx" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">GitHub</a></li><li><a href="https://twitter.com/zksync" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Twitter</a></li><li><a href="https://join.zksync.dev/" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Discord</a></li></ul></div></div><div class="border-t border-primary mt-12 pt-8 text-center"><p class="text-tertiary text-sm font-mono"> 2025 Built with ❤️ by the solx team </p></div></div></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FooterSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const FooterSection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);

/* empty css          */
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const isMenuOpen = ref(false);
    const isDark = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HeroSection = __nuxt_component_0;
      const _component_FeaturesSection = __nuxt_component_1;
      const _component_FoundrySection = __nuxt_component_2;
      const _component_ContributeSection = __nuxt_component_3;
      const _component_SolxSolcSection = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-screen", isDark.value ? "dark" : "light"]
      }, _attrs))}><div class="bg-primary min-h-screen"><div class="bg-indigo-500 text-white py-2 md:py-3 px-4 text-center"><span class="inline-flex items-center font-mono text-sm md:text-base"> ⚠️ Warning: solx is in pre-alpha state and not suitable for production use yet. </span></div><header class="border-b border-primary"><div class="container mx-auto px-4 py-3 md:py-4"><div class="flex flex-col md:flex-row md:items-center md:justify-between"><div class="flex items-center justify-between"><div class="flex items-center"><a href="/" class="p-0 mr-2"><img${ssrRenderAttr("src", _imports_0)} alt="solx Logo" class="h-8 w-8 md:h-10 md:w-10"></a><h3 class="text-lg md:text-2xl lg:text-3xl font-mono text-primary">{ solx }</h3></div><div class="flex items-center md:hidden"><button class="p-2 text-tertiary hover:text-primary transition-colors mr-2" aria-label="Toggle theme">`);
      if (isDark.value) {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`);
      }
      _push(`</button><button class="p-2 text-tertiary hover:text-primary transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
      if (!isMenuOpen.value) {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`);
      } else {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`);
      }
      _push(`</svg></button></div></div><div class="flex items-center"><nav class="${ssrRenderClass([{ "hidden": !isMenuOpen.value }, "md:flex md:items-center mt-4 md:mt-0 pb-4 md:pb-0"])}"><div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-8"><a href="#quickstart" class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"> Quickstart </a><a href="#features" class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"> Features </a><a href="https://github.com/matter-labs/solx/blob/main/docs/src/SUMMARY.md" target="_blank" class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"> Docs </a><a href="https://github.com/matter-labs/solx/" target="_blank" class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"> GitHub </a></div></nav><button class="hidden md:block p-2 text-tertiary hover:text-primary transition-colors ml-4" aria-label="Toggle theme">`);
      if (isDark.value) {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`);
      }
      _push(`</button></div></div></div></header><main>`);
      _push(ssrRenderComponent(_component_HeroSection, null, null, _parent));
      _push(ssrRenderComponent(_component_FeaturesSection, null, null, _parent));
      _push(ssrRenderComponent(_component_FoundrySection, null, null, _parent));
      _push(ssrRenderComponent(_component_ContributeSection, null, null, _parent));
      _push(ssrRenderComponent(_component_SolxSolcSection, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(FooterSection, null, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};

const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404.vue.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500.vue.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

const server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: entry$1
});

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, navigateTo as n, resolveRouteObject as r, server as s, tryUseNuxtApp as t, useRouter as u };
//# sourceMappingURL=server.mjs.map
