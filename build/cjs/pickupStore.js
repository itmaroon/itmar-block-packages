'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');

var GLOBAL_KEY = "__itmar_pickup_store__";
function getGlobalStore() {
  if (!window[GLOBAL_KEY]) {
    window[GLOBAL_KEY] = {
      contexts: new Map()
    };
  }
  return window[GLOBAL_KEY];
}
var contexts = getGlobalStore().contexts;
function createCtx(id) {
  return {
    id,
    pickupEl: null,
    dataset: {},
    state: {
      page: 0,
      searchKeyWord: "",
      periodDisp: "",
      periodQueryObj: {},
      termParamObj: null,
      termQueryObj: [],
      posts: [],
      rawPosts: null,
      targetIndex: -1,
      total: 0
    },
    listeners: new Set(),
    cache: {
      taxonomies: null
    },
    inflight: {
      abort: null
    }
  };
}
function ensureCtx(id) {
  if (!id) return null;
  if (!contexts.has(id)) contexts.set(id, createCtx(id));
  return contexts.get(id);
}
function registerPickup(pickupEl) {
  var _pickupEl$dataset;
  var id = pickupEl === null || pickupEl === void 0 || (_pickupEl$dataset = pickupEl.dataset) === null || _pickupEl$dataset === void 0 ? void 0 : _pickupEl$dataset.pickup_id;
  if (!id) return null;
  var ctx = ensureCtx(id);
  ctx.pickupEl = pickupEl;
  ctx.dataset = _rollupPluginBabelHelpers.objectSpread2({}, pickupEl.dataset);
  return ctx;
}
function getCtx(id) {
  return contexts.get(id) || null;
}
function subscribe(id, fn) {
  var ctx = ensureCtx(id);
  if (!ctx) return () => {};
  ctx.listeners.add(fn);
  fn(ctx); // 初回通知
  return () => ctx.listeners.delete(fn);
}
function setState(id, partial) {
  var ctx = ensureCtx(id);
  if (!ctx) return;
  ctx.state = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, ctx.state), partial);
  ctx.listeners.forEach(l => l(ctx));
}

exports.ensureCtx = ensureCtx;
exports.getCtx = getCtx;
exports.registerPickup = registerPickup;
exports.setState = setState;
exports.subscribe = subscribe;
//# sourceMappingURL=pickupStore.js.map
