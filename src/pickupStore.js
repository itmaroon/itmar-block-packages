const GLOBAL_KEY = "__itmar_pickup_store__";

function getGlobalStore() {
	if (!window[GLOBAL_KEY]) {
		window[GLOBAL_KEY] = { contexts: new Map() };
	}
	return window[GLOBAL_KEY];
}

const contexts = getGlobalStore().contexts;

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
			total: 0,
		},
		listeners: new Set(),
		cache: {
			taxonomies: null,
		},
		inflight: {
			abort: null,
		},
	};
}

export function ensureCtx(id) {
	if (!id) return null;
	if (!contexts.has(id)) contexts.set(id, createCtx(id));
	return contexts.get(id);
}

export function registerPickup(pickupEl) {
	const id = pickupEl?.dataset?.pickup_id;
	if (!id) return null;

	const ctx = ensureCtx(id);
	ctx.pickupEl = pickupEl;
	ctx.dataset = { ...pickupEl.dataset };
	return ctx;
}

export function getCtx(id) {
	return contexts.get(id) || null;
}

export function subscribe(id, fn) {
	const ctx = ensureCtx(id);
	if (!ctx) return () => {};
	ctx.listeners.add(fn);
	fn(ctx); // 初回通知
	return () => ctx.listeners.delete(fn);
}

export function setState(id, partial) {
	const ctx = ensureCtx(id);
	if (!ctx) return;
	ctx.state = { ...ctx.state, ...partial };
	ctx.listeners.forEach((l) => l(ctx));
}
