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
### useElementBackgroundColor
### useElementWidth
### useIsMobile
### useDeepCompareEffect
### useFontawesomeIframe
## styled-componet用のcssプロパティ生成関数
### radius_prm
### space_prm
### max_width_prm
### width_prm
### align_prm
### convertToScss
### borderProperty
### radiusProperty
### marginProperty
### paddingProperty
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
