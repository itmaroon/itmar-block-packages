'use strict';

var jsxRuntime = require('react/jsx-runtime');
var blockEditor = require('@wordpress/block-editor');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');

function SingleImageSelect({ attributes, onSelectChange, }) {
    const { mediaID, media } = attributes;
    //URL の配列から画像を生成
    const getImage = (image) => {
        //メディアオブジェクトの配列をループ処理
        return (jsxRuntime.jsx("figure", { children: jsxRuntime.jsx("img", { src: image.url, className: "image", alt: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u753B\u50CF" }) }));
    };
    //メディアライブラリを開くボタンをレンダリングする関数
    const getImageButton = (open) => {
        if (media) {
            return (jsxRuntime.jsx("div", { onClick: open, className: "block-container", children: getImage(media) }));
        }
        else {
            return (jsxRuntime.jsx("div", { className: "button-container", children: jsxRuntime.jsx(components.Button, { onClick: open, className: "button button-large", children: i18n.__("Sel", "itmar_mv_blocks") }) }));
        }
    };
    return (jsxRuntime.jsx(blockEditor.MediaUploadCheck, { children: jsxRuntime.jsx(blockEditor.MediaUpload, { onSelect: (newMedia) => onSelectChange(newMedia), allowedTypes: ["image"], value: mediaID, render: ({ open }) => getImageButton(open) }) }));
}
function MultiImageSelect({ attributes, label, onSelectChange, onAllDelete, }) {
    const { mediaID, media = [] } = attributes; // media が undefined の場合に備えてデフォルト値を設定
    //URL の配列から画像を生成
    const getImages = (mediaItems) => {
        //メディアオブジェクトの配列をループ処理
        return mediaItems.map((image, index) => (jsxRuntime.jsxs("figure", { children: [jsxRuntime.jsx("img", { src: image.url, className: "image", alt: image.alt || "アップロード画像" }), jsxRuntime.jsx("figcaption", { className: "block-image-caption", children: image.caption ? image.caption : "" })] }, image.id || index)));
    };
    //メディアライブラリを開くボタンをレンダリングする関数
    const getImageButton = (open) => {
        if (media.length > 0) {
            return (jsxRuntime.jsx("div", { onClick: open, className: "block-container", children: getImages(media) }, "media-container"));
        }
        else {
            return (jsxRuntime.jsx("div", { className: "button-container", children: jsxRuntime.jsx(components.Button, { onClick: open, className: "button button-large", children: i18n.__("Image Upload", "slide-blocks") }) }, "media-container"));
        }
    };
    return (jsxRuntime.jsxs(components.PanelBody, { title: label, initialOpen: true, className: "itmar_image_display", children: [jsxRuntime.jsx(blockEditor.MediaUploadCheck, { children: jsxRuntime.jsx(blockEditor.MediaUpload, { multiple: true, gallery: true, onSelect: (newMedia) => onSelectChange(newMedia), allowedTypes: ["image"], value: mediaID, render: ({ open }) => getImageButton(open) }) }), media.length != 0 && ( //メディアオブジェクト（配列の長さ）で判定
            jsxRuntime.jsx(blockEditor.MediaUploadCheck, { children: jsxRuntime.jsx(components.Button, { onClick: onAllDelete, variant: "secondary", isDestructive: true, className: "removeImage", children: i18n.__("Delete All", "slide-blocks") }) }))] }));
}
//静止画か動画かを判定する関数
function getMediaType(url) {
    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
    ];
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
    // クエリストリング（?以降）を除去
    const cleanUrl = url.split("?")[0].toLowerCase();
    const isImage = imageExtensions.some((ext) => cleanUrl.endsWith(ext));
    const isVideo = videoExtensions.some((ext) => cleanUrl.endsWith(ext));
    if (isImage) {
        return "image";
    }
    else if (isVideo) {
        return "video";
    }
    else {
        // 拡張子で判別できない → HEADリクエストでContent-Type判定 or fallback
        return undefined;
    }
}
//静止画のアスペクト比を返す関数
function getImageAspectRatio(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            resolve(aspectRatio);
        };
        img.onerror = function () {
            reject(new Error("画像の読み込みに失敗しました: " + url));
        };
        img.src = url;
    });
}
//動画のアスペクト比を返す関数
function getVideoAspectRatio(url) {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;
        video.muted = true; // 一部のブラウザで安全に動作させるため
        video.playsInline = true;
        video.onloadedmetadata = function () {
            const aspectRatio = video.videoWidth / video.videoHeight;
            resolve(aspectRatio);
        };
        video.onerror = function () {
            reject(new Error("動画の読み込みに失敗しました: " + url));
        };
    });
}

exports.MultiImageSelect = MultiImageSelect;
exports.SingleImageSelect = SingleImageSelect;
exports.getImageAspectRatio = getImageAspectRatio;
exports.getMediaType = getMediaType;
exports.getVideoAspectRatio = getVideoAspectRatio;
//# sourceMappingURL=mediaUpload.js.map
