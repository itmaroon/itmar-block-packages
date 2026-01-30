'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var element = require('@wordpress/element');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var blocks = require('@wordpress/blocks');
var apiFetch = require('@wordpress/api-fetch');

//特定の投稿タイプの投稿に含まれる本ブロックの属性を書き換える

function UpdateAllPostsBlockAttributes(_ref) {
  var {
    postType,
    blockName,
    newAttributes,
    onProcessStart,
    onProcessEnd,
    onProcessCancel
  } = _ref;
  var [progress, setProgress] = element.useState(0);
  // stateではなくrefを使用してキャンセル状態を管理する
  var cancelRef = element.useRef(false);
  var updatePostBlockAttributes = /*#__PURE__*/function () {
    var _ref2 = _rollupPluginBabelHelpers.asyncToGenerator(function* () {
      try {
        var allPosts = [];
        var page = 1;
        var hasMore = true;
        while (hasMore) {
          // REST APIを使ってすべての投稿を取得（投稿タイプを指定）
          var path = "/wp/v2/".concat(postType, "?per_page=100&page=").concat(page, "&context=edit");
          var posts = yield apiFetch({
            path
          });
          allPosts.push(...posts);
          // 投稿が100件未満の場合、次のページは存在しない
          if (posts.length < 100) {
            hasMore = false;
          } else {
            page += 1; // 次のページに進む
          }
        }
        var allCount = allPosts.length;
        var processCount = 0;
        // キャンセルフラグをリセット
        cancelRef.current = false;
        for (var post of allPosts) {
          if (!post.content || !post.content.raw) {
            console.warn("Post ID ".concat(post.id, " does not contain raw content."));
            continue;
          }
          // ループの各回でキャンセルがリクエストされているかチェック
          if (cancelRef.current) {
            console.log("処理がキャンセルされました。");
            return;
          }
          var content = post.content.raw;
          var blocks$1 = blocks.parse(content);
          // 特定のブロックの属性を更新
          var updatedBlocks = blocks$1.map(block => {
            if (block.name === blockName) {
              // 属性をマージして更新
              block.attributes = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, block.attributes), newAttributes);
            }
            return block;
          });

          // 更新後のブロックをシリアライズ
          var updatedContent = blocks.serialize(updatedBlocks);

          // REST APIを使って投稿を更新
          try {
            yield apiFetch({
              path: "/wp/v2/".concat(postType, "/").concat(post.id),
              method: "POST",
              data: {
                content: updatedContent
              }
            });
          } catch (error) {
            console.error("Failed to update post ID ".concat(post.id, ":"), error.message);
            if (error.data) {
              console.error("Error details:", error.data);
            }
          }
          //カウンターセットとプログレスバーの処理
          processCount++;
          setProgress(Math.round(processCount / allCount * 100));
        }

        //終了処理
        onProcessEnd();
      } catch (error) {
        console.error("Error updating block attributes:", error);
      }
    });
    return function updatePostBlockAttributes() {
      return _ref2.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(components.ProgressBar, {
    value: progress,
    className: "markdown_copy_progress"
  }), /*#__PURE__*/React.createElement("p", null, progress, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "fit-content",
      margin: "20px auto 0"
    }
  }, /*#__PURE__*/React.createElement(components.Button, {
    variant: "primary",
    onClick: () => {
      onProcessStart(); //親コンポーネントでスタート処理
      updatePostBlockAttributes();
    },
    disabled: progress > 0 && progress < 100
  }, i18n.__("Start Process", "markdown-block")), /*#__PURE__*/React.createElement(components.Button, {
    variant: "secondary",
    onClick: () => {
      if (progress === 0 || cancelRef.current) {
        onProcessEnd(); // 処理が始まる前ならすぐに終了処理を実行
      } else {
        // キャンセルフラグを更新（refならすぐに反映される）
        cancelRef.current = true;
        onProcessCancel(); //親コンポーネントでキャンセル処理
      }
    },
    style: {
      marginLeft: "10px"
    }
  }, i18n.__("Cancel", "markdown-block"))));
}

exports.default = UpdateAllPostsBlockAttributes;
//# sourceMappingURL=UpdateAllPostsBlockAttributes.js.map
