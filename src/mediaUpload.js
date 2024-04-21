import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { Button, PanelBody } from "@wordpress/components";

export function SingleImageSelect(props) {
  const { attributes } = props;
  const { mediaID, media } = attributes;

  //URL の配列から画像を生成
  const getImage = (image) => {
    //メディアオブジェクトの配列をループ処理
    return (
      <figure>
        <img src={image.url} className="image" alt="アップロード画像" />
      </figure>
    );
  };

  //メディアライブラリを開くボタンをレンダリングする関数
  const getImageButton = (open) => {
    if (media) {
      return (
        <div onClick={open} className="block-container">
          {getImage(media)}
        </div>
      );
    } else {
      return (
        <div className="button-container">
          <Button onClick={open} className="button button-large">
            {__("Sel", "itmar_mv_blocks")}
          </Button>
        </div>
      );
    }
  };

  return (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={(media) => props.onSelectChange(media)}
        allowedTypes={["image"]}
        value={mediaID}
        render={({ open }) => getImageButton(open)}
      />
    </MediaUploadCheck>
  );
}

export function MultiImageSelect(props) {
  const { attributes, label } = props;
  const { mediaID, media } = attributes;

  //URL の配列から画像を生成
  const getImages = (media) => {
    //メディアオブジェクトの配列をループ処理
    let imagesArray = media.map((image, index) => {
      return (
        <figure key={index}>
          <img src={image.url} className="image" alt="アップロード画像" />
          <figcaption className="block-image-caption">
            {image.caption ? image.caption : ""}
          </figcaption>
        </figure>
      );
    });
    return imagesArray;
  };

  //メディアライブラリを開くボタンをレンダリングする関数
  const getImageButton = (open) => {
    if (media.length > 0) {
      return (
        <div key="media-container" onClick={open} className="block-container">
          {getImages(media)}
        </div>
      );
    } else {
      return (
        <div key="media-container" className="button-container">
          <Button onClick={open} className="button button-large">
            {__("Image Upload", "slide-blocks")}
          </Button>
        </div>
      );
    }
  };

  return (
    <PanelBody title={label} initialOpen={true} className="itmar_image_display">
      <MediaUploadCheck>
        <MediaUpload
          multiple={true}
          gallery={true} //追加
          onSelect={(media) => props.onSelectChange(media)}
          allowedTypes={["image"]}
          value={mediaID}
          render={({ open }) => getImageButton(open)}
        />
      </MediaUploadCheck>
      {media.length != 0 && ( //メディアオブジェクト（配列の長さ）で判定
        <MediaUploadCheck>
          <Button
            onClick={() => props.onAllDelete()}
            variant="secondary"
            isDestructive
            className="removeImage"
          >
            {__("Delete All", "slide-blocks")}
          </Button>
        </MediaUploadCheck>
      )}
    </PanelBody>
  );
}
