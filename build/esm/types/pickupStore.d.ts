declare const GLOBAL_KEY = "__itmar_pickup_store__";
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
declare global {
    interface Window {
        [GLOBAL_KEY]: {
            contexts: Map<string, PickupContext>;
        };
    }
}
export declare function ensureCtx(id: string | undefined): PickupContext | null;
export declare function registerPickup(pickupEl: HTMLElement | null): PickupContext | null;
export declare function getCtx(id: string): PickupContext | null;
export declare function subscribe(id: string, fn: (ctx: PickupContext) => void): () => void;
export declare function setState(id: string, partial: Partial<PickupState>): void;
export {};
