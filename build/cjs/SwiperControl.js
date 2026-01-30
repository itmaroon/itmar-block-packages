'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');

//Swiper初期化関数
// jQueryの $.data() 相当をざっくり再現（文字列→boolean/number/JSON を変換）
function coerceDataValue(val) {
  if (val == null) return null;
  if (typeof val !== "string") return val;
  var t = val.trim();
  if (t === "") return "";
  if (t === "true") return true;
  if (t === "false") return false;
  if (t === "null") return null;

  // JSONっぽければJSONとして読む（swiper-info など）
  var looksJson = t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
  if (looksJson) {
    try {
      return JSON.parse(t);
    } catch (_unused) {
      // JSONとして壊れてたら文字列のまま
      return val;
    }
  }

  // 数値
  var n = Number(t);
  if (!Number.isNaN(n) && t !== "") return n;
  return val;
}
function toDatasetKey(key) {
  // "swiper-id" -> "swiperId" のように変換
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
function getData(el, key) {
  var _el$getAttribute;
  var dsKey = toDatasetKey(key);

  // dataset優先
  if (el !== null && el !== void 0 && el.dataset && Object.prototype.hasOwnProperty.call(el.dataset, dsKey)) {
    return coerceDataValue(el.dataset[dsKey]);
  }

  // 念のため attribute も見ておく
  var attr = (_el$getAttribute = el.getAttribute) === null || _el$getAttribute === void 0 ? void 0 : _el$getAttribute.call(el, "data-".concat(key));
  if (attr != null) return coerceDataValue(attr);
  return null;
}

// （任意）複数回呼ばれても関連付けできるように、モジュール内で保持
var swiperRegistry = new Map();
// 二重にイベントを張らないための印
var linkedPairs = new Set();
function linkSwipers(a, b) {
  if (!a || !b) return;
  var pairKey = "".concat(a.swiper_id, "__").concat(b.swiper_id);
  if (linkedPairs.has(pairKey)) return;
  linkedPairs.add(pairKey);

  // bがサムネならthumbs連携
  if (b.is_thumbnail) {
    a.instance.thumbs.swiper = b.instance;
    a.instance.thumbs.init();
    a.instance.thumbs.update(true);
    return;
  }

  // どちらもサムネじゃなければ相互同期
  if (!a.is_thumbnail) {
    a.instance.on("slideChangeTransitionStart", slider => {
      b.instance.slideToLoop(slider.realIndex, undefined, false);
    });
    b.instance.on("slideChangeTransitionStart", slider => {
      a.instance.slideToLoop(slider.realIndex, undefined, false);
    });
  }
}
function tryLink(swiperObj) {
  // 自分が relate_id を持っていて、相手が既にいればリンク
  if (swiperObj.relate_id && swiperRegistry.has(swiperObj.relate_id)) {
    linkSwipers(swiperObj, swiperRegistry.get(swiperObj.relate_id));
  }

  // 逆に「相手が自分を relate_id に指定していた」ケースも拾う
  for (var other of swiperRegistry.values()) {
    if (other.relate_id === swiperObj.swiper_id) {
      linkSwipers(other, swiperObj);
    }
  }
}
function slideBlockSwiperInit(swiperElement) {
  var _swiper_info$navigati, _swiper_info$paginati, _swiper_info$scrollba;
  // 文字列セレクタでも渡せるようにしておく（好みで削除OK）
  var el = typeof swiperElement === "string" ? document.querySelector(swiperElement) : swiperElement;
  if (!el) return null;
  var swiper_id = getData(el, "swiper-id");
  var relate_id = getData(el, "relate-id");
  var is_thumbnail = !!getData(el, "thumb-flg");
  var swiper_info = getData(el, "swiper-info");
  var parallax_obj = getData(el, "parallax-option");
  if (!swiper_info || typeof swiper_info !== "object") {
    throw new Error("data-swiper-info が見つからないか、JSONとして解釈できません。");
  }
  var parallax_option = parallax_obj != null ? {
    parallax: true
  } : {};
  var autoplayOption = swiper_info.is_autoplay ? {
    freeMode: {
      enabled: true,
      momentum: false
    },
    autoplay: {
      delay: swiper_info.autoplay,
      stopOnLastSlide: false,
      disableOnInteraction: false
    }
  } : {};
  var effectOption = {
    none: {
      centeredSlides: swiper_info.isActiveCenter,
      direction: swiper_info.singleDirection,
      speed: swiper_info.slideSpeed,
      slidesPerView: swiper_info.mobilePerView,
      spaceBetween: swiper_info.mobileBetween,
      breakpoints: {
        768: {
          slidesPerView: swiper_info.defaultPerView,
          spaceBetween: swiper_info.defaultBetween
        }
      }
    },
    slide_single_view: _rollupPluginBabelHelpers.objectSpread2({
      direction: swiper_info.singleDirection,
      loopAdditionalSlides: 1,
      speed: swiper_info.slideSpeed,
      allowTouchMove: false
    }, parallax_option),
    fade_single_view: _rollupPluginBabelHelpers.objectSpread2({
      speed: swiper_info.slideSpeed,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      }
    }, parallax_option),
    coverflow: {
      centeredSlides: true,
      slidesPerView: 3,
      spaceBetween: swiper_info.mobileBetween,
      effect: "coverflow",
      coverflowEffect: {
        rotate: 50,
        depth: 100,
        stretch: 0,
        modifier: 1,
        scale: 0.9,
        slideShadows: true
      },
      breakpoints: {
        768: {
          spaceBetween: swiper_info.defaultBetween,
          coverflowEffect: {
            stretch: 0
          }
        }
      }
    },
    coverflow_2: {
      centeredSlides: true,
      slidesPerView: "auto",
      effect: "coverflow",
      coverflowEffect: {
        rotate: 0,
        slideShadows: false,
        stretch: 100
      },
      breakpoints: {
        768: {
          coverflowEffect: {
            stretch: 100
          }
        }
      }
    },
    cube: {
      speed: 800,
      effect: "cube",
      cubeEffect: {
        slideShadows: true,
        shadow: true,
        shadowOffset: 40,
        shadowScale: 0.94
      },
      on: {
        slideChangeTransitionStart: function slideChangeTransitionStart() {
          this.el.classList.remove("scale-in");
          this.el.classList.add("scale-out");
        },
        slideChangeTransitionEnd: function slideChangeTransitionEnd() {
          this.el.classList.remove("scale-out");
          this.el.classList.add("scale-in");
        }
      }
    },
    flip: {
      effect: "flip",
      flipEffect: {
        limitRotation: true,
        slideShadows: true
      }
    },
    cards: {
      effect: "cards",
      cardsEffect: {
        perSlideOffset: 8,
        perSlideRotate: 2,
        rotate: true,
        slideShadows: true
      }
    }
  };
  var swiperOptions = _rollupPluginBabelHelpers.objectSpread2({
    loop: swiper_info.loop
  }, autoplayOption);
  if (is_thumbnail) {
    swiperOptions = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, swiperOptions), {}, {
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      freeMode: true,
      slideToClickedSlide: true
    });
  }
  if ((_swiper_info$navigati = swiper_info.navigation) !== null && _swiper_info$navigati !== void 0 && _swiper_info$navigati.disp) {
    swiperOptions.navigation = {
      nextEl: ".".concat(swiper_id, "-next"),
      prevEl: ".".concat(swiper_id, "-prev")
    };
  }
  if ((_swiper_info$paginati = swiper_info.pagination) !== null && _swiper_info$paginati !== void 0 && _swiper_info$paginati.disp) {
    swiperOptions.pagination = {
      el: ".".concat(swiper_id, "-pagination")
    };
  }
  if ((_swiper_info$scrollba = swiper_info.scrollbar) !== null && _swiper_info$scrollba !== void 0 && _swiper_info$scrollba.disp) {
    swiperOptions.scrollbar = {
      el: ".".concat(swiper_id, "-scrollbar")
    };
  }
  if (swiper_info.effect && effectOption[swiper_info.effect]) {
    swiperOptions = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, swiperOptions), effectOption[swiper_info.effect]);
  }

  // ここが $swiperElement[0] -> el に変わる
  var instance = new Swiper(el, swiperOptions);
  var swiperObj = {
    instance,
    swiper_id,
    relate_id,
    is_thumbnail
  };
  if (swiper_id) swiperRegistry.set(swiper_id, swiperObj);
  tryLink(swiperObj);
  return swiperObj;
}

exports.slideBlockSwiperInit = slideBlockSwiperInit;
//# sourceMappingURL=SwiperControl.js.map
