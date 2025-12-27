/**
 * Masonry グリッドを初期化する共通関数
 *
 * @param {HTMLElement} gridEl - `.itmar-masonry-grid` のコンテナ要素
 * @param {Array<{ url: string, alt?: string }>} images - 描画する画像リスト
 * @param {Object} options
 * @param {number} options.columns - カラム数
 * @param {boolean} [options.renderItems=true]
 *   true: この関数内で gridEl をクリアして <figure><img> を追加する
 *   false: 既にある .itmar-masonry-item をそのまま使い、幅だけ更新する
 *
 * @returns {any|null} Masonry インスタンス（なければ null）
 */

export default function MasonryControl(
  gridEl,
  images = [],
  { columns = 1, renderItems = true } = {}
) {
  if (!gridEl) return null;
  const columnWidthPercent = 100 / (columns || 1);

  // 既存インスタンスがあれば破棄（再初期化に対応）
  if (gridEl.__masonryInstance) {
    try {
      gridEl.__masonryInstance.destroy();
    } catch (e) {
      console.warn("Failed to destroy previous Masonry instance", e);
    }
    gridEl.__masonryInstance = null;
  }

  // ---------------------------
  // 1) アイテムの DOM を構築 or 更新
  // ---------------------------
  if (renderItems) {
    // ★ コンテナ全部は消さない。マソンリー用の要素だけを削除する
    gridEl
      .querySelectorAll(".itmar-masonry-sizer, .itmar-masonry-item")
      .forEach((node) => node.remove());

    // sizer 追加
    const sizer = document.createElement("div");
    sizer.className = "itmar-masonry-sizer";
    sizer.style.width = `${columnWidthPercent}%`;
    gridEl.appendChild(sizer);

    // 画像アイテム追加
    images.forEach((item, index) => {
      const fig = document.createElement("figure");
      fig.className = "itmar-masonry-item";
      fig.style.width = `${columnWidthPercent}%`;

      // クリック検知用の a タグ
      const link = document.createElement("a");
      link.href = "#";
      link.className = "itmar-masonry-link";
      link.dataset.masonryIndex = String(index);
      //img要素
      const img = document.createElement("img");
      img.src = item.url;
      img.alt = item.alt || "";
      img.style.display = "block";
      img.style.width = "100%";
      img.style.height = "auto";

      link.appendChild(img);
      fig.appendChild(link);
      gridEl.appendChild(fig);
    });
  } else {
    // React 側（edit.js）みたいに、すでに <figure> が描画されている場合
    // sizer がなければ作る
    let sizer = gridEl.querySelector(".itmar-masonry-sizer");
    if (!sizer) {
      sizer = document.createElement("div");
      sizer.className = "itmar-masonry-sizer";
      gridEl.insertBefore(sizer, gridEl.firstChild || null);
    }
    sizer.style.width = `${columnWidthPercent}%`;

    // 既存 item の幅だけ更新
    gridEl.querySelectorAll(".itmar-masonry-item").forEach((fig) => {
      fig.style.width = `${columnWidthPercent}%`;
    });
  }

  // ---------------------------
  // 2) Masonry / imagesLoaded を iframe-aware に取得
  // ---------------------------
  let win = null;

  if (gridEl.ownerDocument && gridEl.ownerDocument.defaultView) {
    // サイトエディタ・ブロックエディタの iframe 内ならこっち
    win = gridEl.ownerDocument.defaultView;
  } else if (typeof window !== "undefined") {
    // フロントなら普通に window
    win = window;
  }

  if (!win || !win.Masonry || !win.imagesLoaded) {
    // ライブラリが読み込まれていない場合は、
    // DOM だけ作って終了（レイアウトはブラウザ任せ）
    return null;
  }

  const MasonryCtor = win.Masonry;
  const imagesLoadedFn = win.imagesLoaded;

  const msnry = new MasonryCtor(gridEl, {
    itemSelector: ".itmar-masonry-item",
    columnWidth: ".itmar-masonry-sizer",
    percentPosition: true,
  });

  const imgLoad = imagesLoadedFn(gridEl);
  imgLoad.on("progress", () => {
    msnry.layout();
  });

  // 後から破棄できるように要素に紐付けておく
  gridEl.__masonryInstance = msnry;

  return msnry;
}
