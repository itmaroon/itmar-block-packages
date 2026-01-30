import { MediaUploadCheck, MediaUpload } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, Button } from '@wordpress/components';

function SingleImageSelect(props) {
  var {
    attributes
  } = props;
  var {
    mediaID,
    media
  } = attributes;

  //URL の配列から画像を生成
  var getImage = image => {
    //メディアオブジェクトの配列をループ処理
    return /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("img", {
      src: image.url,
      className: "image",
      alt: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u753B\u50CF"
    }));
  };

  //メディアライブラリを開くボタンをレンダリングする関数
  var getImageButton = open => {
    if (media) {
      return /*#__PURE__*/React.createElement("div", {
        onClick: open,
        className: "block-container"
      }, getImage(media));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        className: "button-container"
      }, /*#__PURE__*/React.createElement(Button, {
        onClick: open,
        className: "button button-large"
      }, __("Sel", "itmar_mv_blocks")));
    }
  };
  return /*#__PURE__*/React.createElement(MediaUploadCheck, null, /*#__PURE__*/React.createElement(MediaUpload, {
    onSelect: media => props.onSelectChange(media),
    allowedTypes: ["image"],
    value: mediaID,
    render: _ref => {
      var {
        open
      } = _ref;
      return getImageButton(open);
    }
  }));
}
function MultiImageSelect(props) {
  var {
    attributes,
    label
  } = props;
  var {
    mediaID,
    media
  } = attributes;

  //URL の配列から画像を生成
  var getImages = media => {
    //メディアオブジェクトの配列をループ処理
    var imagesArray = media.map((image, index) => {
      return /*#__PURE__*/React.createElement("figure", {
        key: index
      }, /*#__PURE__*/React.createElement("img", {
        src: image.url,
        className: "image",
        alt: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u753B\u50CF"
      }), /*#__PURE__*/React.createElement("figcaption", {
        className: "block-image-caption"
      }, image.caption ? image.caption : ""));
    });
    return imagesArray;
  };

  //メディアライブラリを開くボタンをレンダリングする関数
  var getImageButton = open => {
    if (media.length > 0) {
      return /*#__PURE__*/React.createElement("div", {
        key: "media-container",
        onClick: open,
        className: "block-container"
      }, getImages(media));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        key: "media-container",
        className: "button-container"
      }, /*#__PURE__*/React.createElement(Button, {
        onClick: open,
        className: "button button-large"
      }, __("Image Upload", "slide-blocks")));
    }
  };
  return /*#__PURE__*/React.createElement(PanelBody, {
    title: label,
    initialOpen: true,
    className: "itmar_image_display"
  }, /*#__PURE__*/React.createElement(MediaUploadCheck, null, /*#__PURE__*/React.createElement(MediaUpload, {
    multiple: true,
    gallery: true //追加
    ,
    onSelect: media => props.onSelectChange(media),
    allowedTypes: ["image"],
    value: mediaID,
    render: _ref2 => {
      var {
        open
      } = _ref2;
      return getImageButton(open);
    }
  })), media.length != 0 &&
  /*#__PURE__*/
  //メディアオブジェクト（配列の長さ）で判定
  React.createElement(MediaUploadCheck, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => props.onAllDelete(),
    variant: "secondary",
    isDestructive: true,
    className: "removeImage"
  }, __("Delete All", "slide-blocks"))));
}

//静止画か動画かを判定する関数
function getMediaType(url) {
  var imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
  var videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

  // クエリストリング（?以降）を除去
  var cleanUrl = url.split("?")[0].toLowerCase();
  var isImage = imageExtensions.some(ext => cleanUrl.endsWith(ext));
  var isVideo = videoExtensions.some(ext => cleanUrl.endsWith(ext));
  if (isImage) {
    return "image";
  } else if (isVideo) {
    return "video";
  } else {
    // 拡張子で判別できない → HEADリクエストでContent-Type判定 or fallback
    return undefined;
  }
}
//静止画のアスペクト比を返す関数
function getImageAspectRatio(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      var aspectRatio = img.naturalWidth / img.naturalHeight;
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
    var video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.muted = true; // 一部のブラウザで安全に動作させるため
    video.playsInline = true;
    video.onloadedmetadata = function () {
      var aspectRatio = video.videoWidth / video.videoHeight;
      resolve(aspectRatio);
    };
    video.onerror = function () {
      reject(new Error("動画の読み込みに失敗しました: " + url));
    };
  });
}

export { MultiImageSelect, SingleImageSelect, getImageAspectRatio, getMediaType, getVideoAspectRatio };
//# sourceMappingURL=mediaUpload.js.map
