# 概要
WordPressのカスタムブロックを作成するためのプラグインで活用するパッケージです。複数のプラグインで共通に使用する機能をパッケージにまとめました。

# 使用方法
```
import {関数名又はコンポーネント名} from "itmar-block-packages"
```
名前付きインポートでお願いします。

# 各関数の機能
## カスタムフック
### useIsIframeMobile
WordPressのエディタ（ブロックエディタ、サイトエディタ）の大きさを監視し、幅が767ピクセル以下であればtrueを返します。
```
const is_mobile=useIsIframeMobile();
```

### useElementBackgroundColor
ブロックの背景色を返します。ユーザー設定で指定されていれば、その色を返し、指定されていないか、カスタムプロパティ（--wpで始まるプロパティ）であれば、getComputedStyleで実際にレンダリングされた色を取得します。
#### 引数
`blockRef`
ブロックへの参照。useRefで取得
`style`
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
`callback` func
発火させたい関数
`dependencies` array
依存変数にしたい配列
```
useDeepCompareEffect(() => {
・・・
},
[attributes]

```
### useFontawesomeIframe
iframeにfontawesomeを読み込むカスタムフック

## styled-componet用のcssプロパティ生成関数
styled-componetのcssヘルパー関数内で使用するcssのパラメーターやプロパティを返します。
### radius_prm
border-radiusに設定するプロパティを文字列で返します。
#### 引数
`radius` object
topLeft,topRight,bottomRight,bottomLeftをキーとしてもつオブジェクト

### space_prm
marginやpaddingに設定するプロパティを文字列で返します。
#### 引数
`space` object
top,right,bottom,leftをキーとしてもつオブジェクト

### max_width_prm
最大幅を設定するためのCSSを返します。
#### 引数
`width` string
wideSize,contentSize,free,fullの文字列
`free_val` number
px値
#### 戻り値
wideSizeのとき`width: 100%; max-width: var(--wp--style--global--wide-size);`
contentSizeのとき`width: 100%; max-width: var(--wp--style--global--content-size);`
freeのとき`width: 100%; max-width: ${free_val}px;`
fullのとき`width: 100%; max-width: 100%;`
その他の文字列`width: fit-content;`

### width_prm
widthのCSSを返します。
#### 引数
`width` string
wideSize,contentSize,freeの文字列
`free_val` number
px値
#### 戻り値
wideSizeのとき`width: var(--wp--style--global--wide-size);`
contentSizeのとき`width: var(--wp--style--global--content-size);`
freeのとき`width: ${free_val}px;`
その他の文字列`width: fit-content;`

### height_prm
heightのCSSを返します。
#### 引数
`height` string
fitの文字列
#### 戻り値
fitのとき`height: fit-content;`
その他の文字列`height: 100%;`

### align_prm
marginによる横方向の配置のためのCSSを返します。
#### 引数
`align` string
center,rightの文字列
#### 戻り値
centerのとき`margin-left: auto; margin-right: auto;`
rightのとき`margin-left: auto; margin-right: 0`
その他の文字列`margin-right: auto; margin-left: 0`

### convertToScss
キャメルケースで与えられたstyleオブジェクトをscssの文字列に変換します。
#### 引数
`styleObject` object
ブロックに設定されたスタイルオブジェクト

```
const str_scss = convertToScss(styleObject)
```

### borderProperty
WordPressのBorderBoxControlコンポーネントが返すオブジェクトをキャメルケースのCSSに変換して返します。
#### 引数
`borderObj` object
WordPressのBorderBoxControlコンポーネントが返すオブジェクト

```
const css_obj = borderProperty(borderObj)
```

### radiusProperty
WordPressのBorderRadiusControlコンポーネントが返すオブジェクトをキャメルケースのCSSに変換して返します。
#### 引数
`radiusObj` object
WordPressのBorderRadiusControlコンポーネントが返すオブジェクト

```
const css_obj = radiusProperty(radiusObj)
```
### marginProperty
marginのcssを返します。
#### 引数
`marginObj` object
top,right,bottom,leftをキーとしてもつオブジェクト。オブジェクトの値は単位（px,em,%等）付きにしてください。

### paddingProperty
paddingのcssを返します。
#### 引数
`paddingObj` object
top,right,bottom,leftをキーとしてもつオブジェクト。オブジェクトの値は単位（px,em,%等）付きにしてください。

## ボックスシャドーを設定するコントロール
### ShadowStyle
### ShadowElm
## 疑似要素を設定するコントロール
### PseudoElm
### Arrow
## メディアライブラリから複数の画像を選択するコントロール
### MultiImageSelect
## ブロックのドラッガブルを設定するコントロール
### DraggableBox
### useDraggingMove
## ブロックをlazy Loadさせるためのラッパーモジュール
## BlockEditWrapper
