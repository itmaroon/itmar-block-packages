# 概要
WordPressのカスタムブロックを作成するためのプラグインで活用するパッケージです。複数のプラグインで共通に使用する機能をパッケージにまとめました。

# 使用方法
```
import {関数名又はコンポーネント名} from "itmar-block-packages"
```
名前付きインポートでお願いします。

## 必要条件
このパッケージは WordPress ブロック開発のビルド環境（`@wordpress/scripts`）での利用を前提としています。  
このパッケージを使用するには、`@wordpress/scripts`のバージョン^27.6.0以上を推奨します。以下のコマンドを実行して、`@wordpress/scripts`を更新してください：

npm i @wordpress/scripts@^27.6.0 --save-dev

## 更新履歴
= 2.0.3 =  
- IconSelectControlのcreateElementのインポート漏れを修正

= 2.0.0 =
- ビルド方式を Rollup に変更（ESM 出力を優先し、未使用コードがバンドルされにくい構成に改善）
- build 出力を ESM/CJS に分離（tree-shaking の効率と将来互換性を向上）
- package.json の exports を整備（利用側の bundler が最適な形式を選べるよう改善）
- 破壊的変更: 配布物の構成を build/index.js から build/esm・build/cjs に変更（インポート方法は従来通り）

= 1.11.1 =  
- generateMonthCalendarで祝日判定に誤りがあったところを修正

= 1.11.0 =  
- PostSelectControlを新設

= 1.10.1 =  
- PageSelectControlで固定ページの選択肢が１０個しか表示されないという不具合を解消

= 1.10.0 =  
- useRebuildChangeFieldを新設。
- FieldChoiceControlについてacfフィールドの付加情報をフィールド選択項目として表示されていたものを表示しないように修正。また、gallaryについては画像を個別に選択するのではなく全体を選択するように修正
- FieldChoiceControlについて、指定された投稿タイプに紐づかないフィールドが選択項目に含まれる場合、それを除外する機能を備えた。

= 1.9.0 =  
- shopfiApi.jsを新設。

= 1.8.0 =  
- formatCreate.jsを新設。Gutenberg ブロックにおける数値・日付・自由書式の表示形式を選択・制御するための UI コンポーネントおよびフォーマット関数を含みます。
  
= 1.7.1 =  
- serializeBlockTree,createBlockTreeをblockStore.jsに加えた。
- BlockPlace.jsでdesign-groupがフレックス要素の場合は主軸の大きさの設定がflex-grow,flex-shrink,flex-basisとなるよう修正した加えた。

= 1.7.0 =  
- バリデーションチェック用の関数を集めるためのvalidationCheck.jsを新設し、URLの形式をチェックするisValidUrlWithUrlApiを加えた。

= 1.6.3 =  
- IconSelectControlに設定できるアイコンをFontAwesomeに加え、画像、アバターを選択できるようにした

= 1.6.0 =  
- fetchZipToAddressを新設  

= 1.5.0 =  
- useTargetBlocksを新設  

= 1.4.3 =  
- UpdateAllPostsBlockAttributesコンポーネントのRestAPIによる更新の不具合を修正

= 1.4.2 =  
- UpdateAllPostsBlockAttributesコンポーネントにonProcessStartのコールバック関数の処理を付加
- parse, serializeのimport漏れを修正
- 最初の100投稿までの処理しか対応できなかったものをページング処理で上限なしに改良

= 1.4.1 =  
- UpdateAllPostsBlockAttributesコンポーネントの宣言の誤りを修正

= 1.4.0 =  
- 指定した投稿タイプの投稿に含まれる特定のブロックの属性を書き換えるコンポーネントであるUpdateAllPostsBlockAttributesコンポーネントを追加

= 1.3.21 =  
- FieldChoiceControlで先頭の投稿にアイキャッチ画像が設定されていないとき、フィールド選択のトグルボタンが表示されないという不具合を修正

= 1.3.20 =  
- PageSelectControlでhomeUrlをエディタのホームURLに固定しないようにした。  

= 1.3.19 =  
- FieldChoiceControlの選択可能フィールドにlinkを加えて、個別投稿ページへのリンク設定を可能にした。
- BlockPlaceのフレックスボックスの配置に交差軸の配置を加えた。
- TermChoiceControlでタームの表示をするか否かの選択を設定できるようにした。

= 1.3.18 =  
- WordPress RestAPIのエンドポイントを文字列で受けて、その結果を返すrestFetchDataを新設
- TermChoiceControlでonChangeコールバックで返す引数にterm.nameを加えた。
- BlockPlaceコンポーネントのフレックススタイルに折り返しを設定できるように機能追加
- BlockPlaceコンポーネント内のブロック幅とブロック高の設定をBlockWidthとBlockHeightの各コンポーネントを利用するように変更
- BlockWidthに幅と最大幅を別々に設定できるように機能追加
- BlockPlaceコンポーネント内の横方向ブロック配置をフレックス、グリッドスタイルでも設定できるように修正  

= 1.3.17 =  
- restFieldesをインポートするため、エクスポート項目に加えた。

= 1.3.16 =  
- インスペクターの表示の国際化されていない部分を国際化した。

= 1.3.15 =  
- BlockPlaceのプロプスに視差効果のフラグを与え、そのフラグがtrueの時は中央揃えのセットができないように制御するようにした

= 1.3.14 =  
- position_prmの中央揃えがセットされていない場合にnullが出力されるという不具合を修正

= 1.3.13 =  
- BlockWidthのラベル表示が誤っていたのを修正

= 1.3.12 =  
- BlockPlaceの配置タイプが絶対位置の場合に縦横の中央揃えが設定できる機能を追加
- 中央揃えができるようにしたために、position_prmにそれに対応するCSSプロパティを返す機能を追加

= 1.3.11 =  
- BlockPlace、BlockWidth、BlockHeightのfreeサイズにpx以外の単位を設定できるように修正
- freeサイズにpx以外の単位を設定できるようにしたことから、max_width_prm、width_prm、height_prmがそれに対応できるように修正

= 1.3.10 =  
- useDuplicateBlockRemoveの不具合を修正。
- ブロックの幅、高さを設定するためのコンポーネントとしてBlockWidth、BlockHeightを追加

= 1.3.9 =  
- カスタムフックとしてuseDuplicateBlockRemoveを追加。このフックはインナーブロックが挿入されたとき、指定されたブロック名が存在れば、挿入されたブロックを削除する。

= 1.3.8 =  
- WordPressのデータをRest APIを通して取得する関数等のFieldChoiceControlの機能として、choiceFieldsに登録されるフィールド名がmetaによるカスタムフィールドかacfによるカスタムフィールドかを峻別できるようにフィールド名にmeta_又はacf_という接頭辞を付加するようにした。
- カスタムフックとしてuseBlockAttributeChangesを追加。このフックはitmar/design-group内のブロックで、指定のブロック名とクラス名のブロックの属性に変化があったとき、その変化の内容を通知する機能をもつ。同一のブロック名とクラス名をもつブロックに対して、変化した属性を自動的に設定する機能もある。

= 1.3.4 =  
- BlockPlaceコンポーネントの高さにフリーサイズを追加し、デスクトップとモバイルでそれぞれ設定を可能うにした。それに伴ってcssPropertesのheight_prmのシグニチャーを変更。

= 1.3.2 =  
- BlockPlaceコンポーネントのインナーブロックの方向で縦方向又は横方向を選択したとき反転の設定ができるようにした。

= 1.3.1 =  
- edit.scssおよびstyle.scssの共通スタイルについては機能しないことが判明したので削除した。

= 1.3.0 =  
- WordPressのデータをRest APIを通して取得する関数等に、次の関数とReactコンポーネントを追加した
 - restTaxonomies
 - TermChoiceControl
- edit.scssおよびstyle.scssを配置し、これをトランスパイルして、複数のプラグインから共通のスタイルとして使用できるようにした


# 各コンポーネント・関数の機能
## カスタムフック
### useIsIframeMobile
WordPressのエディタ（ブロックエディタ、サイトエディタ）の大きさを監視し、幅が767ピクセル以下であればtrueを返します。
```
const is_mobile=useIsIframeMobile();
```

### useElementBackgroundColor
ブロックの背景色を返します。ユーザー設定で指定されていれば、その色を返し、指定されていないか、カスタムプロパティ（--wpで始まるプロパティ）であれば、getComputedStyleで実際にレンダリングされた色を取得します。
#### 引数
- `blockRef`  
ブロックへの参照。useRefで取得
- `style`  
ブロックに設定されているスタイル。useBlockPropsで取得
```
//ブロックの参照
const blockRef = useRef(null);
//blockPropsの参照
const blockProps = useBlockProps({
	ref: blockRef, // ここで参照を blockProps に渡しています
});

//背景色の取得
const baseColor = useElementBackgroundColor(blockRef, blockProps.style);
```

### useElementWidth

### useIsMobile
ViewPortの大きさの大きさを監視し、幅が767ピクセル以下であればtrueを返します。
```
const is_mobile=useIsMobile();
```
### useDeepCompareEffect
たくさんの要素をもつオブジェクトや配列の内容の変化で発火するuseEffect
#### 引数
- `callback` func  
発火させたい関数
- `dependencies` array  
依存変数にしたい配列
```
useDeepCompareEffect(() => {
・・・
},
[attributes])

```
### useFontawesomeIframe
iframeにfontawesomeを読み込むカスタムフック

### useBlockAttributeChanges
特定のブロックの属性が変更されたとき、その変更内容を返すカスタムフック。引数に指定されたブロック名のブロックで指定されたクラス名をもつブロックの属性の変更内容を返す。第3引数のフラグにtrueを指定すると同じブロック名で同じクラス名をもつブロックの属性を変更されたブロックの属性で自動的に更新する。ただし、変更内容については、指定された属性名の属性を変更及び比較の対象からはずすことができる。  

#### 引数
- `clientId` string  
変更されたことを監視する範囲となるitmar/design-groupブロックのclientId
- `blockName` string  
変更の監視対象となるブロック名
- `className` string  
変更の監視対象となるブロックが有するクラス名
- `modFlg` boolean  
同種ブロックを更新するかどうかのフラグ。デフォルトはfalse
- `excludeAttributes` object  
自動更新の対象から除外する属性をオブジェクトで指定する。オブジェクトは属性名をキーとし、値を適宜のデフォルト値とする。ここで指定された属性は更新チェックの対象からも除外される。使わないときは指定しない。
```
//clientIdで指定されたブロックの属性変更の内容を返す
const changedAttributes = useBlockAttributeChanges(
	clientId,
	"itmar/design-checkbox",
	"itmar_filter_checkbox",	
);

//clientIdで指定されたブロックの属性変更の内容でitmar/design-checkboxという名前のブロックで
//itmar_filter_checkboxというクラス名をもつブロックの属性を自動更新する。
//ただし、labelContentという属性とinputValueという属性については更新対象から除外する
useBlockAttributeChanges(
	clientId,
	"itmar/design-checkbox",
	"itmar_filter_checkbox",
	true,
	{ labelContent: "", inputValue: false },
);

```

### useDuplicateBlockRemove
インナーブロックが挿入されたとき、指定されたブロック名が存在れば、挿入したブロックを削除する。ユーザーに重複したブロックを挿入させたくないときや特定のブロックが存在するとき、ブロックを挿入させないようにするときに活用する。  

#### 引数
- `clientId` string  
インナーブロックの監視する対象となるブロックのclientId
- `blockNames` array  
存在をチェックするブロック名。文字列を配列で指定する。

```
useDuplicateBlockRemove(clientId, ["itmar/pickup-posts"]);

```

## styled-componet用のcssプロパティ生成関数
styled-componetのcssヘルパー関数内で使用するcssのパラメーターやプロパティを返します。
### radius_prm
border-radiusに設定するプロパティを文字列で返します。
#### 引数
- `radius` object  
topLeft,topRight,bottomRight,bottomLeftをキーとしてもつオブジェクト
  

### space_prm
marginやpaddingに設定するプロパティを文字列で返します。
#### 引数
- `space` object  
top,right,bottom,leftをキーとしてもつオブジェクト

### position_prm
絶対位置のポジションに関するCSSを返します。
#### 引数
- `pos` object,boolean  
次の形式のオブジェクト又はboolean
```
"posValue": {
	"vertBase": "top",
	"horBase": "left",
	"vertValue": "3em",
	"horValue": "3em",
	"isVertCenter": false,
	"isHorCenter": false
},
```

- `type` string
staic, relative,absolute,fixed,stickyのいづれか

#### 戻り値
- typeがabsolute,fixed,stickyのときposの値に応じてtop,buttom,left,rightのcssプロパティを返す。  pos内の中央揃えのフラグがオンならtransformのcssプロパティも返す。
- posがtrueのとき`top:50%;left: 50%;transform: translate(-50%, -50%);`を返す。
  

### max_width_prm
最大幅を設定するためのCSSを返します。
#### 引数
- `width` string  
wideSize,contentSize,free,fullの文字列
- `free_val` string  
px値
#### 戻り値
- wideSizeのとき`width: 100%; max-width: var(--wp--style--global--wide-size);`  
- contentSizeのとき`width: 100%; max-width: var(--wp--style--global--content-size);`  
- freeのとき`width: 100%; max-width: ${free_val};`  
- fullのとき`width: 100%; max-width: 100%;`  
- その他の文字列`width: fit-content;`  
  

### width_prm
widthのCSSを返します。
#### 引数
- `width` string  
wideSize,contentSize,freeの文字列
- `free_val` string  
px値
#### 戻り値
- wideSizeのとき`width: var(--wp--style--global--wide-size);`
- contentSizeのとき`width: var(--wp--style--global--content-size);`
- freeのとき`width: ${free_val};`
- その他の文字列`width: fit-content;`
  

### height_prm
heightのCSSを返します。
#### 引数
- `height` string
fit, full, freeの文字列
- `free_val` string  
px値  
#### 戻り値
- fitのとき`height: fit-content;`
- freeのとき`height: ${free_val};`
- その他の文字列`height: 100%;`
  

### align_prm
marginによる横方向の配置のためのCSSを返します。
また、camelFlgを設定することで、インナースタイル用のオブジェクトを返します。
#### 引数
- `align` string
- `camelFLg` boolean  
center,rightの文字列
#### 戻り値
camelFLgがfalse又は設定されていないとき
- centerのとき`margin-left: auto; margin-right: auto;`
- rightのとき`margin-left: auto; margin-right: 0`
- その他の文字列`margin-right: auto; margin-left: 0`
camelFLgがtrueのとき
- centerのとき` { marginLeft: "auto", marginRight: "auto" }`
- rightのとき` { marginLeft: "auto" }`
- その他の文字列`{}`
  

### convertToScss
キャメルケースで与えられたstyleオブジェクトをscssの文字列に変換します。
#### 引数
- `styleObject` object  
ブロックに設定されたスタイルオブジェクト

```
const str_scss = convertToScss(styleObject)
```
  

### borderProperty
WordPressのBorderBoxControlコンポーネントが返すオブジェクトをキャメルケースのCSSに変換して返します。
#### 引数
- `borderObj` object  
WordPressのBorderBoxControlコンポーネントが返すオブジェクト

```
const css_obj = borderProperty(borderObj)
```
  

### radiusProperty
WordPressのBorderRadiusControlコンポーネントが返すオブジェクトをキャメルケースのCSSに変換して返します。
#### 引数
- `radiusObj` object  
WordPressのBorderRadiusControlコンポーネントが返すオブジェクト

```
const css_obj = radiusProperty(radiusObj)
```
   

### marginProperty
marginのcssを返します。
#### 引数
- `marginObj` object  
top,right,bottom,leftをキーとしてもつオブジェクト。オブジェクトの値は単位（px,em,%等）付きにしてください。
  

### paddingProperty
paddingのcssを返します。
#### 引数
- `paddingObj` object  
top,right,bottom,leftをキーとしてもつオブジェクト。オブジェクトの値は単位（px,em,%等）付きにしてください。
  

## ボックスシャドーを設定するコントロール
### ShadowStyle
WordPressのブロックエディタのサイドバーにbox-shadowを設定するためのコントロールを表示させるReactコンポーネント。
```
<ShadowStyle
	shadowStyle={{ ...shadow_element }}
	onChange={(newStyle, newState) => {
		setAttributes({ shadow_result: newStyle.style });
		setAttributes({ shadow_element: newState });
	}}
/>
```

<img src="./img/shadow.png" alt="ShadowStyleのスクリーンショット" width="500" height="500">
  
  
### ShadowElm
設定されたbox-shadowをスタイルオブジェクトとして返します。
#### 引数
- `shadowState` object  
ShadowStyleコンポーネントで生成され、ブロックの属性としてセットされるオブジェクト
  

## 疑似要素を設定するコントロール
### PseudoElm
WordPressのブロックエディタのサイドバーに疑似要素を設定するためのコントロールを表示させるReactコンポーネント。現時点のバージョンでは上下左右の矢印表示の設定のみが可能です。
```
<PseudoElm
	element="Arrow"
	direction={pseudoInfo.option}
	onChange={(direction) => {
		setAttributes({
			pseudoInfo: { ...pseudoInfo, option: direction },
		});
	}}
/>
```
<img src="./img/pseudo.png" alt="PseudoElmのスクリーンショット" width="200" height="100">

### Arrow
矢印を表示させる疑似要素を生成してscssの文字列で返します。
```
const arrow = Arrow(direction);

```
#### 引数
- `direction` object  
キーをdirection、値をupper,left,right,underのいずれかとするオブジェクト
  


## メディアライブラリから画像を選択するコントロール
### SingleImageSelect
メディアライブラリ選択画面を開き、ブロックの属性にmediaとmedia.idをセットします。
```
<SingleImageSelect
	attributes={attributes}
	onSelectChange={(media) => {
		setAttributes({ media: media, mediaID: media.id });
	}}
/>
```
### MultiImageSelect
メディアライブラリ選択画面を開き、複数の画像を選択して、ブロックの属性にmediaとmedia.idをセットします。
```
<MultiImageSelect
	attributes={attributes}
	label=__("Selected Images", "text-domain")
	onSelectChange={(media) => {
		// media から map で id プロパティの配列を生成
		const media_ID = media.map((image) => image.id);
		setAttributes({
			mobile_val: { ...mobile_val, mediaID: media_ID, media: media },
		});
		
	}}
	onAllDelete={() => {
		setAttributes({
			mobile_val: { ...mobile_val, mediaID: [], media: [] },
		});
	}}
/>
```
  
  
## ブロックのドラッガブルを設定するコントロール
### DraggableBox
ブロックを移動させる移動量を設定するコントロールをサイドバーに表示させます。
```
<DraggableBox
	attributes={position}
	onPositionChange={(position) =>
		setAttributes({ position: position })
	}
/>
```
  

### useDraggingMove
参照したブロックを可能とするためのカスタムフックを設定します。
```
useDraggingMove(
  isMovable,
  blockRef,
  position,
  onPositionChange
)
```
#### 引数
- `isMovable` boolean
移動を可とするかどうかのフラグ
- `blockRef` useRef  
移動させるブロックへの参照
- `position` object  
移動量を決定するためのx,yのキーをもつオブジェクト
- `onPositionChange` function
移動量が変化したときに属性値を記録するためのコールバック関数
  

## ブロックをlazy Loadさせるためのラッパーモジュール
## BlockEditWrapper
registerBlockTypeの第２引数内にあるeditオブジェクトに、以下の使用例で生成したBlockEditを渡してやることで、ブロックの読み込みをレンダリングの時まで遅らせます。

```
const LazyEditComponent = React.lazy(() => import("./edit"));
const BlockEdit = (props) => {
	return <BlockEditWrapper lazyComponent={LazyEditComponent} {...props} />;
};
```
## ブロックにアニメーション効果をあたえるためのコントロール
### AnimationBlock
WordPressのブロックエディタのサイドバーにアニメーションを設定するためのコントロールを表示させるReactコンポーネント。現時点のバージョンではflipDown,fadeUp,fadeLeft,fadeRightのアニメーション設定が可能です
```
<AnimationBlock
	attributes={attributes}
	onChange={(newValue) => setAttributes(newValue)}
/>
```
<img src="./img/animation.png" alt="AnimationBlockのスクリーンショット" width="100" height="200">

### anime_comp
設定されたアニメーションのパラメータをオブジェクトとして渡すことで、SCSSの文字列に変換して返します。
#### 引数
- `anime_prm` object  
AnimationBlockコンポーネントで生成され、ブロックの属性としてセットされるオブジェクト
  

## Typographyを設定するコントロール
### TypographyControls
WordPressのブロックエディタのサイドバーにTypographyを設定するためのコントロールを表示させるReactコンポーネント。
```
<TypographyControls
	title={__("Typography", "text-domain")}
	fontStyle=	
	{
		default_fontSize: "16px",
		mobile_fontSize: "12px",
		fontFamily: "Arial, sans-serif",
		fontWeight: "500",
		isItalic: false,
	}
	initialOpen={false}
	isMobile={isMobile}
	onChange={(newStyle) => {
		setAttributes({ font_style_input: newStyle });
	}}
/>
```
<img src="./img/typography.png" alt="Typographyのスクリーンショット" width="100" height="200">

## WordPressのデータをRest APIを通して取得する関数等
### fetchPagesOptions
固定ページの情報を取得して配列で返します。
#### 引数
- `homeUrl` string  
サイトのホームURL  

#### 戻り値
次のようなキーを持つオブジェクトの配列を返します。  
`value` 固定ページのid。ただし、サイトのホームについては-1をかえす。  
`slug` 固定ページのスラッグ  
`link` 固定ページのURL
`label` 固定ページの名称  

### fetchArchiveOptions
カスタム投稿タイプ（ビルトインを含む）の情報を取得して配列で返します。
#### 引数
- `homeUrl` string  
サイトのホームURL  

#### 戻り値
次のようなキーを持つオブジェクトの配列を返します。  
`value` 0から始まる通し番号  
`slug` ポストタイプのスラッグ  
`link` アーカイブページのURL
`label` ポストタイプの名称 

### restFetchData
RestAPIのエンドポイントを文字列で受けて、その結果を返す
#### 引数
- `path` string  
エンドポイント

#### 戻り値
エンドポイントに対応したレスポンスがPromiseで返る 

### restTaxonomies
投稿タイプに登録されているタクソノミー（カテゴリ、タグを含む）の情報およびそのタームの情報をを取得して配列で返します。
#### 引数
- `post_type` string  
投稿タイプのスラッグ  

#### 戻り値
次のようなキーを持つオブジェクトの配列を返します。  
`slug` タクソノミーのスラッグ 
`name` タクソノミーの名称  
`rest_base` タクソノミーのREST_APIの名称
`terms` ターム情報オブジェクトの配列 

### restFields
投稿タイプに登録されているタクソノミー（カテゴリ、タグを含む）の情報およびそのタームの情報をを取得して配列で返します。
#### 引数
- `rest_base` string  
投稿タイプのRestAPI用スラッグ  

#### 戻り値
"title","date","excerpt","featured_media","meta","acf"の各フィールドの値を投稿タイプの最新データ1件分を返す。この結果で投稿タイプがどのフィールドをサポートしているか、また、どのようなカスタムフィールドが設定されているかの情報を取得することができる。 

### PageSelectControl
固定ページを選択できるコンボボックス表示し、固定ページの情報を返します。
#### プロプス  
- `selectedSlug` string  
選択済みの固定ページのスラッグ 
- `label` string
コンボボックスのラベル  
- `homeUrl` string  
サイトのホームURL
- `onChange` func
コンボボックスの内容が変化したとき発生するコールバック関数。引数には`fetchPagesOptions`の戻り値が入る。 

```
<PageSelectControl
	selectedSlug={selectedSlug}
	label={__("Select Post Type", "post-blocks")}
	homeUrl={post_blocks.home_url}
	onChange={(postInfo) => {
		setAttributes({ selectedSlug: postInfo.slug });
	}}
/>
```

### ArchiveSelectControl
投稿タイプ名を選択できるコンボボックス表示し、投稿タイプの情報を返します。
#### プロプス  
- `selectedSlug` string  
選択済みの投稿タイプのスラッグ 
- `label` string
コンボボックスのラベル  
- `homeUrl` string  
サイトのホームURL
- `onChange` func
コンボボックスの内容が変化したとき発生するコールバック関数。引数には`fetchArchiveOptions`の戻り値が入る。 

```
<ArchiveSelectControl
	selectedSlug={selectedSlug}
	label={__("Select Post Type", "post-blocks")}
	homeUrl={post_blocks.home_url}
	onChange={(postInfo) => {
		setAttributes({ selectedSlug: postInfo.slug });
	}}
/>
```

### PostSelectControl
投稿（カスタム投稿タイプを含む）のタイトルを選択できるコンボボックスを表示し、選択した投稿の情報を返します。

#### プロプス
- `selectedSlug` string  
選択済みの投稿スラッグ

- `label` string  
コンボボックスのラベル

- `homeUrl` string  
サイトのホームURL

- `restBase` string  
取得対象の REST Base（例：`posts` / `pages` / `itmar_resource` など）  
※ `/wp/v2/{restBase}` を呼び出して投稿一覧を取得します。

- `status` string (optional)  
取得する投稿ステータス（デフォルト：`publish`）  
例：`any` を指定すると下書き等も含めて取得できます。

- `perPage` number (optional)  
1ページあたりの取得件数（最大100 / デフォルト：100）

- `orderby` string (optional)  
並び順のキー（デフォルト：`title`）

- `order` string (optional)  
並び順（デフォルト：`asc`）

- `search` string (optional)  
検索キーワード（指定した場合、RESTの `search` パラメータで絞り込みます）

- `onChange` func  
コンボボックスの内容が変化したとき発生するコールバック関数。  
引数には `fetchPostOptions` の戻り値（options配列の要素）が入ります。

#### 返却される情報（onChange の引数例）
- `value` number（投稿ID）
- `label` string（投稿タイトル）
- `slug` string（投稿スラッグ）
- `link` string（投稿のパーマリンク）
- `rest_base` string（使用した restBase）
- `post_id` number（投稿ID）

#### 使用例
```
<PostSelectControl
	label={__("Resource Name", "itmaroon-booking-block")}
	homeUrl={itmar_option.home_url}
	restBase={selectedRest || "itmar_resource"}
	selectedSlug={selectedPostSlug || ""}
	onChange={(info) => {
		if (info) {
			setAttributes({
				resourceId: info.post_id,
				resourceSlug: info.slug,
				resourceRest: info.rest_base,
			});
		}
	}}
/>
```

### TermChoiceControl
投稿タイプに紐づけられている全てのタクソノミー（カテゴリ、タグを含む。）に登録されたタームを選択できるチェックボックス表示し、コールバック関数に選択されたタームの情報を返します。
#### プロプス  
- `selectedSlug` string  
選択済みの投稿タイプのスラッグ 
- `choiceTerms` array  
選択済みのタームの情報。配列の要素は次の形式のオブジェクトであること。  
{ taxonomy: タクソノミーのスラッグ, term: タームのスラッグ } 
- `dispTaxonomies` array  
選択済みのタクソノミの情報。配列の要素はタクソノミーのスラッグ     
- `type` string 
選択するデータのタイプ。将来の拡張のためにセットしている。現時点では"taxonomy"とセットすること。
- `label` string  

- `onChange` func
チェックボックスの内容が変化したとき発生するコールバック関数。引数には{ taxonomy: タクソノミーのスラッグ, term:{ id: term.id, slug: term.slug, name: term.name } }という形式のオブジェクトを要素とする配列が入る。
- `onSetDispTax` func
トグルコントロールの内容が変化したとき発生するコールバック関数。引数にはタクソノミーのスラッグを要素とする配列が入る。 

```
<TermChoiceControl
	selectedSlug={selectedSlug}
	choiceTerms={choiceTerms}
	dispTaxonomies={dispTaxonomies}
	type="taxonomy"
	label={__("Choice Taxsonomy", "post-blocks")}
	onChange={(newChoiceTerms) =>
		setAttributes({ choiceTerms: newChoiceTerms })
	}
	onSetDispTax={(newChoiceTerms) => {
		setAttributes({ dispTaxonomies: newChoiceTerms });
	}}
/>
```

### FieldChoiceControl
タイトル、日付、抜粋、アイキャッチ画像、リンクの各フィールドと投稿タイプに紐づけられている全てのカスタムフィールドを選択できるチェックボックス表示し、コールバック関数に選択されたフィールドの情報を返します。
また、各フィールドがどのブロックでレンダリングされるかの設定機能も含みます。
#### プロプス  
- `selectedSlug` string  
選択済みの投稿タイプのスラッグ （Restタイプ）
- `choiceItems` array  
選択済みのフィールドの情報。配列の要素はフィールドのスラッグ（文字列）。  
- `type` string 
選択するデータのタイプ。将来の拡張のためにセットしている。現時点では"field"とセットすること。
- `blockMap` object
フィールド名とブロック名を対にしたオブジェクト
```
{
	"title":"itmar/design-title",
	"date":"itmar/design-title",
	"excerpt":"core/paragraph",
	"featured_media":"core/image",
	"link":"itmar/design-button"
}
```
- `textDomain` string
使用するブロックのテキストドメイン

- `onChange` func
チェックボックスの内容が変化したとき発生するコールバック関数。引数には選択されたフィールドのフィールド名を要素とする配列が入る。 

```

- `onBlockMapChange` func
コンボボックスの内容が変化したとき発生するコールバック関数。引数には設定されたフィールド名とブロック名を対にしたオブジェクトが入る。 

```
<FieldChoiceControl
	type="field"
	selectedSlug={selectedRest}
	choiceItems={choiceFields}
	blockMap={blockMap}
	textDomain="post-blocks"
	onChange={(newChoiceFields) => {
		setAttributes({ choiceFields: newChoiceFields });
	}}
	onBlockMapChange={(newBlockMap) => {
		setAttributes({ blockMap: newBlockMap });
	}}
/>
```

## Font awesom のアイコンを選択するためのコントロール
### IconSelectControl
WordPressのブロックエディタのサイドバーにFont awesomのアイコンを選択するためのコントロールを表示させるReactコンポーネント。
```
<IconSelectControl
	iconStyle={
		icon_type: "awesome",
		icon_url: "",
		icon_name: "f030",
		icon_pos: "left",
		icon_size: "24px",
		icon_color: "var(--wp--preset--color--content)",
		icon_space: "5px",
    	icon_family: "Font Awesome 6 Free",

	}
	setPosition={true}
	onChange={(newValue) => {
		setAttributes({icon_style: newValue})
	}}
/>
```

iconStyleオブジェクトを再設定します。
setPositionプロプスをtrueにするとicon_posとicon_spaceの各オブジェクトを設定するコントロールが表示されます。

<img src="./img/iconControl.png" alt="IconSelectControlのスクリーンショット" width="100" height="200">

## DOM要素をラップしてレンダリングを変化させるReactコンポーネント
### ToggleElement
DOM要素をdiv要素でラップし、flgの値によって、その要素にopenというクラス名を付加します。呼び出し側でflgの値を変更することで、DOM要素の表示・非表示を操作するときに使用します。

```
<ToggleElement
	onToggle={handleHambergerToggle}
	className="itmar_hamberger_btn"
	openFlg={flg}
>
	<span></span>
	<span></span>
	<span></span>
</ToggleElement>
```

## グリッドスタイルの各種設定を行うためのコントロール
### GridControls
CSSでdisplay : grid が設定されたブロックに対し、gridの各種設定を行うため、モーダルウインドウを表示させるReactコンポーネント。
```
<GridControls
	attributes={props.grid_info}
	clientId={clientId}
	onChange={(newValue) => {
		props.onGridChange(newValue)
	}}
/>
```

<img src="./img/grid.png" alt="GridControlsのスクリーンショット" width="200" height="200">

## ブロックの配置に関する各種設定を行うためのコントロール
### BlockPlace
WordPressのブロックエディタのサイドバーにブロックの配置に関する設定のためのコントロールを表示させるReactコンポーネント。
```
<BlockPlace
	attributes={attributes}
	clientId={clientId}
	blockRef={blockRef}
	isMobile={isMobile}
	isSubmenu={is_submenu}
	isParallax={true}
	onDirectionChange={(position) => {
		setAttributes({direction: position });
	}}
	onReverseChange={(checked) => {
		setAttributes({reverse: checked });	
	}}
	onFlexChange={(position,axis) => {
		setAttributes({[axis]: position });
	}}
	onAlignChange={(position) => {
		setAttributes({outer_align: position });
	}}
	onVerticalChange={(position) => {
		setAttributes({outer_vertical: position });
	}}
	onWidthChange={(position) => {
		setAttributes({width_val: position });
	}}
	onHeightChange={(value) => {
		setAttributes({ height_val: value });
	}}
	onFreeWidthChange={(value) => {
		setAttributes({free_width: position });
	}}
	onFreeHeightChange={(value) => {
		setAttributes({free_height: position });
	}}
	onGridChange={(value) => {
		setAttributes({grid_info: position });
	}}
	onPositionChange={(value) => {
		setAttributes({ positionType: value });
	}}
	onPosValueChange={(value) => {
		setAttributes({posValue: position });
	}}
/>
```


<img src="./img/blockplace.png" alt="BlockPlaceのスクリーンショット" width="100" height="300">

### BlockWidth
ブロックコンポーネントの幅を設定する
#### 引数
- `attributes` object  
ブロックの属性オブジェクト
- `isMobile` boolean  
スクリーン幅が767px以下かどうかのフラグ
- `isSubmenu` boolean  
trueの場合はmax-widthを合わせて設定する
- `onWidthChange` function
widthの種別を設定するためのコールバック関数。返ってくる引数はkey,valueの２つでkeyはwidth_valまたはmax_valという文字列でwidthValはfit,full,wideSize,contentSize,freeのいずれか
- `onFreeWidthChange` function
widthの種別がfreeのとき幅を設定するためのコールバック関数。返ってくる引数はkey,valueの２つでkeyはfree_widthまたはmax_free_widthという文字列でvalueは単位付きの文字列

```
<BlockWidth
	attributes={attributes}
	isMobile={isMobile}
	isSubmenu={isFront}
	onWidthChange={(key,value) => {
		setAttributes(
			!isMobile
				? { default_val: { ...default_val, [key]: value } }
				: { mobile_val: { ...mobile_val, [key]: value } },
		);
	}}
	onFreeWidthChange={(key,value) => {
		setAttributes(
			!isMobile
				? { default_val: { ...default_val, [key]: value } }
				: { mobile_val: { ...mobile_val, [key]: value } },
		);
	}}
/>
```

### BlockHeight
ブロックコンポーネントの高さを設定する
#### 引数
- `attributes` object  
ブロックの属性オブジェクト
- `isMobile` boolean  
スクリーン幅が767px以下かどうかのフラグ
- `onHeightChange` function
heightの種別を設定するためのコールバック関数。返ってくる引数はfit,full,free
- `onFreeHeightChange` function
heightの種別がfreeのとき幅を設定するためのコールバック関数。返ってくる引数は単位付きの文字列

```
<BlockHeight
	attributes={attributes}
	isMobile={isMobile}
	onHeightChange={(value) => {
		setAttributes(
			!isMobile
				? { default_val: { ...default_val, height_val: value } }
				: { mobile_val: { ...mobile_val, height_val: value } },
		);
	}}
	onFreeHeightChange={(value) => {
		setAttributes(
			!isMobile
				? { default_val: { ...default_val, free_height: value } }
				: { mobile_val: { ...mobile_val, free_height: value } },
		);
	}}
/>
```

## 色コードを変換する関数
### hslToRgb16
Hslオブジェクトの値を与えると#000000型のRGB表記に変換するためのユーティリティ関数です。
#### 引数
- `hue` number  
Hslオブジェクトのhueの値
- `saturation` number  
Hslオブジェクトのsaturationの値
- `lightness` number  
Hslオブジェクトのlightnessの値

### rgb16ToHsl
16進数のRGB表記を受け取り、それをHslオブジェクトに変換するためのユーティリティ関数です。
#### 引数
- `strRgb16` string  
#000000形式の１６進数の文字列又はrgb(0,0,0) 形式の文字列
　　

### HexToRGB
16進数のRGB表記を受け取り、それを10進数のRGBオブジェクトに変換するためのユーティリティ関数です。
#### 引数
- `strRgb16` string  
#000000形式の１６進数の文字列又はrgb(0,0,0) 形式の文字列  

## 指定した投稿タイプの投稿に含まれる特定のブロックの属性を書き換えるコンポーネント
### UpdateAllPostsBlockAttributes
#### 引数
- `postType` string  
WordPressのRestAPIで使用するrest_baseに相当する文字列
- `blockName` string  
ブロックの名称。投稿本文に含まれるブロックの名前を指定
- `newAttributes` object  
新しいブロックの属性をオブジェクトで指定
- `onProcessStart` function  
処理が完了したときに実行するコールバック関数
- `onProcessEnd` function  
処理が完了したときに実行するコールバック関数
- `onProcessCancel` function  
処理が中断されたときに実行するコールバック関数
```
<UpdateAllPostsBlockAttributes
	postType={rest_base}
	blockName="itmar/markdown-block"
	newAttributes={{
		element_style_obj: element_style_obj,
		backgroundColor: backgroundColor,
		backgroundGradient: backgroundGradient,
		default_val: default_val,
		mobile_val: mobile_val,
		radius_value: radius_value,
		border_value: border_value,
	}}
	onProcessStart={startProgress}
	onProcessEnd={closeProgress}
	onProcessCancel={() => {
		dispatch("core/notices").createNotice(
			"error",
			__("Processing was interrupted.", "markdown-block"),
			{ type: "snackbar" },
		);
	}}
/>
```

## インナーブロックを取得・操作する関数
### `useTargetBlocks`

`useTargetBlocks` は、**Gutenberg ブロックエディタ上で同じ親ブロック内にある特定の名前・属性を持つブロックを取得する React フック**です。  
ネストされたブロックの検索にも対応しています。



#### 🧩 概要

このカスタムフックは、次のような用途に使えます：

- 同じ親ブロックの中から特定のブロックを配列で取得
- 属性値でフィルタして一致する **1件のブロック**を取得
- ネストされたブロックも含めて取得（オプション）

---

#### ✅ 使い方

##### 基本構文

```js
const result = useTargetBlocks(clientId, blockName, attributeFilter?, includeNested?);
```

| 引数 | 型 | 説明 |
|------|----|------|
| `clientId` | `string` | 呼び出し元（自分自身）の `clientId`。`useBlockEditContext()` などで取得 |
| `blockName` | `string` | 対象ブロック名（例: `'itmar/design-text-ctrl'`） |
| `attributeFilter` | `object|null` | オプション：指定した属性に一致するブロックを1件だけ取得（例: `{ inputName: 'address' }`） |
| `includeNested` | `boolean` | オプション：`true` でネストされたブロックも対象に含める（デフォルト: `false`） |

---

#### 🧪 使用例

##### 1. 全ての `itmar/design-text-ctrl` ブロックを取得（自分を除く）

```js
import { useBlockEditContext } from '@wordpress/block-editor';
import { useTargetBlocks } from '@your-scope/use-target-blocks';

const MyComponent = () => {
  const { clientId } = useBlockEditContext();

  const blocks = useTargetBlocks(clientId, 'itmar/design-text-ctrl');

  return <div>対象ブロック数: {blocks.length}</div>;
};
```

---

##### 2. `inputName: 'address'` を持つブロックを1件だけ取得

```js
const targetBlock = useTargetBlocks(clientId, 'itmar/design-text-ctrl', {
  inputName: 'address',
});

if (targetBlock) {
  console.log('Address block found:', targetBlock.clientId);
}
```

---

##### 3. ネストされたブロックも含めて検索

```js
const nestedBlock = useTargetBlocks(
  clientId,
  'itmar/design-text-ctrl',
  { inputName: 'address' },
  true // ネスト含める
);
```

---

#### 📁 内部で使用しているもの

- `@wordpress/data`
- `@wordpress/block-editor`
- `useSelect`, `getBlockRootClientId`, `getBlock`, `getBlocks`

---

#### 🔁 補助関数：`flattenBlocks`

ネストされたブロックを平坦化するためのユーティリティも内蔵：

```js
const flattenBlocks = (blocks) => {
  return blocks.reduce((acc, block) => {
    acc.push(block);
    if (block.innerBlocks?.length > 0) {
      acc.push(...flattenBlocks(block.innerBlocks));
    }
    return acc;
  }, []);
};
```

---

#### 🛡️ 注意事項

- このフックは **Gutenberg ブロックエディタ内でのみ使用可能**です。
- `useTargetBlocks()` は **React フック**です。関数やイベントハンドラ内部では直接呼び出せません。

---

### `serializeBlockTree`

指定された Gutenberg ブロックオブジェクトを、**ネスト構造を保ったままプレーンな JSON 形式に変換（保存用）**します。

#### ✅ 使い方

```js
import { serializeBlockTree } from '@your-scope/block-tree-utils';

const json = serializeBlockTree(block);
```

#### 📥 入力

- `block`: Gutenberg ブロックオブジェクト（`name`, `attributes`, `innerBlocks` を含む）

#### 📤 出力

```json
{
  "blockName": "core/group",
  "attributes": { ... },
  "innerBlocks": [
    {
      "blockName": "core/paragraph",
      "attributes": { ... },
      "innerBlocks": []
    }
  ]
}
```

---

### `createBlockTree`

`serializeBlockTree` によって得られた JSON 構造を、**`createBlock()` に渡せる Gutenberg ブロックオブジェクトに再構築**します。

#### ✅ 使い方

```js
import { createBlockTree } from '@your-scope/block-tree-utils';
import { createBlock } from '@wordpress/blocks';

const wpBlock = createBlockTree(savedJson);
```

#### 📥 入力

- `savedJson`: `serializeBlockTree` で生成されたブロックデータ

#### 📤 出力

- `createBlock(name, attributes, innerBlocks)` の形で再帰的に構成された WP ブロックオブジェクト

---

### `flattenBlocks`

Gutenberg のネストされたブロック配列を、**1階層の配列としてフラットに展開**します。  
ブロック構成内にあるすべてのブロック（ネスト含む）を一括走査する際に便利です。

#### ✅ 使い方

```js
import { flattenBlocks } from '@your-scope/block-tree-utils';

const flat = flattenBlocks(innerBlocks);
```

#### 📥 入力

- `innerBlocks`: Gutenberg のブロック配列（`innerBlocks` を含む構造）

#### 📤 出力

- 平坦化されたブロック配列（元の構造は保持しない）

---

## 🧪 使用例

```js
import {
  serializeBlockTree,
  createBlockTree,
  flattenBlocks,
} from '@your-scope/block-tree-utils';

const savedData = blocks.map(serializeBlockTree);
const restored = savedData.map(createBlockTree);
const flatList = flattenBlocks(restored);
```

---  


## 日本郵便番号から住所を取得するユーティリティ関数
### `fetchZipToAddress`
`fetchZipToAddress` は、[zipcloud](https://zipcloud.ibsnet.co.jp) API を使用して、日本の郵便番号から都道府県・市区町村・町域の住所を非同期で取得する JavaScript 関数です。  
Gutenberg ブロック開発やフロントエンドフォーム処理において、郵便番号による住所補完機能を簡単に実装できます。


#### 使用例（React / jQuery 共通）

```js
const addressObj = await fetchZipToAddress("1600022");
if (addressObj) {
  const fullAddress = addressObj.address1 + addressObj.address2 + addressObj.address3;
  console.log(fullAddress); // 例: 東京都新宿区新宿
}
```

---

#### 🔐 バリデーション仕様

- 郵便番号は「**ハイフンなしの7桁の数字**」形式のみ許可されます（例: `1234567`）。
- 無効な形式や一致しない郵便番号、通信エラー時には `null` を返します。
- エラーはすべて `alert()` によってユーザーに通知されます。

---

#### 🔁 返り値の形式（成功時）

```json
{
  "zipcode": "1600022",
  "prefcode": "13",
  "address1": "東京都",
  "address2": "新宿区",
  "address3": "新宿",
  ...
}
```

---

#### 🌐 使用API

本ライブラリは以下の外部APIを使用しています：

- **zipcloud（日本郵便公式APIラッパー）**
  - URL: [https://zipcloud.ibsnet.co.jp](https://zipcloud.ibsnet.co.jp)
  - ドキュメント: [https://zipcloud.ibsnet.co.jp/doc/api](https://zipcloud.ibsnet.co.jp/doc/api)

#### ⚠️ ご注意

- この API は外部サービス（zipcloud）に依存しており、アクセス過多による制限や仕様変更の可能性があります。
- 本ライブラリを利用する場合は、[zipcloud利用規約](https://zipcloud.ibsnet.co.jp/doc/rule) を必ずご確認・順守してください。

---

#### 🧩 WordPress / Gutenberg との統合例

```js
const handleZipSearch = async () => {
  const result = await fetchZipToAddress(zipValue);
  if (result) {
    setAttributes({ inputValue: result.address1 + result.address2 + result.address3 });
  }
};
```

## バリデーションチェックを行う関数
### `isValidUrlWithUrlApi`
`isValidUrlWithUrlApi` は、引数で与えた文字列がURLの形式であるかどうかのバリデーションチェックをします。


#### 使用例
```
if (isValidUrlWithUrlApi(headingContent)) {
	setAttributes({ selectedPageUrl: headingContent });
} 
```

## データのフォーマットを設定、表示するコンポーネント

Gutenberg ブロックにおける数値・日付・自由書式の表示形式を選択・制御するための UI コンポーネントおよびフォーマット関数です。

---

### 概要

このライブラリは、以下の2つの機能を提供します：

1. **`<FormatSelectControl />`**  
   ブロックエディターの「インスペクター設定」内で、表示形式を選択する UI コンポーネント。

2. **`displayFormated()`**  
   保存された設定に基づき、日付・数値・自由文字列の値を整形する表示用関数。

---

### `FormatSelectControl`

#### 説明

ブロック編集画面で「日付」「数値」「自由文字列」のいずれかの表示形式を選択・設定可能にする `PanelBody` コンポーネントです。

#### 引数

| 名前 | 型 | 必須 | 説明 |
|------|----|------|------|
| `titleType` | `"date"` \| `"plaine"` \| `"user"` | ✅ | フォーマット対象の種類を指定します。 |
| `userFormat` | `string` | ✅ | 現在選択中のフォーマットのキー（例: `"num_comma"`）。 |
| `freeStrFormat` | `string` | ✅ | 自由書式入力時の書式文字列（例: `"¥%s円"`）。 |
| `decimal` | `number` | ✅ | 数値の小数点以下の桁数（0〜5） |
| `onFormatChange` | `(info: FormatSettings) => void` | ✅ | 各設定項目の更新を通知するコールバック |

#### フォーマットオプション例（SelectControlで使用）

- 日付形式：`Y-m-d H:i:s`、`Y年n月j日 (l)` など
- 数値形式：カンマ区切りあり／なし、金額表示など
- 自由書式：`"%s"` を含む文字列で、実際の値が置換されます

---

### `displayFormated(content, userFormat, freeStrFormat, decimal)`

#### 説明

指定されたフォーマットに従って、値を整形して文字列として返します。

#### 引数

| 名前 | 型 | 説明 |
|------|----|------|
| `content` | `string` \| `number` | 整形対象の生の値 |
| `userFormat` | `string` | 日付または数値のフォーマットキー（例: `"num_comma"`、`"Y-m-d"`） |
| `freeStrFormat` | `string` | `"%s"` を含む自由書式文字列 |
| `decimal` | `number` | 小数点以下の桁数指定（`0` なら整数扱い） |

#### 戻り値

整形後の文字列（`string`）

---

### 使用例

#### 1. コンポーネントの設置例

```jsx
<FormatSelectControl
  titleType="plaine"
  userFormat={attributes.userFormat}
  freeStrFormat={attributes.freeStrFormat}
  decimal={attributes.decimal}
  onFormatChange={(newSettings) => setAttributes(newSettings)}
/>
```
#### 2. 表示用フォーマット関数の使用例
```
const display = displayFormated(
  1234567.89,
  attributes.userFormat,
  attributes.freeStrFormat,
  attributes.decimal
);
// → "1,234,567.89"（例: num_comma + decimal: 2 の場合）
```

### 注意事項・ルール
✅ 自由書式（freeStrFormat）について
- %s を含まない文字列は 置換せず、値をそのまま返します
- 例："¥%s" → "¥1234"、"Total: " → "1234"（%s なし）

✅ 日付フォーマットの安全性
- userFormat が dateFormats に存在しない限り format() は呼び出されません（安全）
- Gutenberg 標準の PHP形式に準拠（例：Y-m-d, F j, Y）

✅ 数値フォーマットの条件
- decimal が 1 以上のときは minimumFractionDigits / maximumFractionDigits が指定され、常に小数点以下を表示
- decimal = 0 の場合は整数として表示



