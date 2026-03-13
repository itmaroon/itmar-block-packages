const GLOBAL_KEY = "__itmar_pickup_store__";

// 1. 各種データの型定義
interface PickupState {
  page: number;
  searchKeyWord: string;
  periodDisp: string;
  periodQueryObj: Record<string, any>;
  termParamObj: Record<string, any> | null;
  termQueryObj: any[];
  posts: any[];
  rawPosts: any[] | null;
  targetIndex: number;
  total: number;
}

interface PickupContext {
  id: string;
  pickupEl: HTMLElement | null;
  dataset: Record<string, string | undefined>;
  state: PickupState;
  listeners: Set<(ctx: PickupContext) => void>;
  cache: {
    taxonomies: any | null;
  };
  inflight: {
    abort: AbortController | null;
  };
}

// 2. Window オブジェクトの拡張
declare global {
  interface Window {
    [GLOBAL_KEY]: {
      contexts: Map<string, PickupContext>;
    };
  }
}

function getGlobalStore() {
  if (!window[GLOBAL_KEY]) {
    window[GLOBAL_KEY] = { contexts: new Map() };
  }
  return window[GLOBAL_KEY];
}

const contexts = getGlobalStore().contexts;

function createCtx(id: string): PickupContext {
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

export function ensureCtx(id: string | undefined): PickupContext | null {
  if (!id) return null;
  if (!contexts.has(id)) contexts.set(id, createCtx(id));
  return contexts.get(id) || null;
}

export function registerPickup(
  pickupEl: HTMLElement | null,
): PickupContext | null {
  const id = pickupEl?.dataset?.pickup_id;
  if (!id) return null;

  const ctx = ensureCtx(id);
  if (!ctx) return null;

  ctx.pickupEl = pickupEl;
  ctx.dataset = { ...pickupEl.dataset };
  return ctx;
}

export function getCtx(id: string): PickupContext | null {
  return contexts.get(id) || null;
}

export function subscribe(
  id: string,
  fn: (ctx: PickupContext) => void,
): () => void {
  const ctx = ensureCtx(id);
  if (!ctx) return () => {};
  ctx.listeners.add(fn);
  fn(ctx); // 初回通知
  return () => ctx.listeners.delete(fn);
}

export function setState(id: string, partial: Partial<PickupState>): void {
  const ctx = ensureCtx(id);
  if (!ctx) return;
  ctx.state = { ...ctx.state, ...partial };
  ctx.listeners.forEach((l) => l(ctx));
}
