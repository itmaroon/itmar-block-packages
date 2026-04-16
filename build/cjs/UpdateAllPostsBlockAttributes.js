'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var element = require('@wordpress/element');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var blocks = require('@wordpress/blocks');
var apiFetch = require('@wordpress/api-fetch');

function UpdateAllPostsBlockAttributes({ postType, blockName, newAttributes, onProcessStart, onProcessEnd, onProcessCancel, }) {
    const [progress, setProgress] = element.useState(0);
    // stateではなくrefを使用してキャンセル状態を管理する
    const cancelRef = element.useRef(false);
    const updatePostBlockAttributes = async () => {
        try {
            const allPosts = [];
            let page = 1;
            let hasMore = true;
            // --- 投稿の全件取得 ---
            while (hasMore) {
                if (cancelRef.current)
                    return;
                // REST APIを使ってすべての投稿を取得（投稿タイプを指定）
                const posts = await apiFetch({
                    path: `/wp/v2/${postType}?per_page=100&page=${page}&context=edit`,
                });
                allPosts.push(...posts);
                // 投稿が100件未満の場合、次のページは存在しない
                if (posts.length < 100) {
                    hasMore = false;
                }
                else {
                    page += 1; // 次のページに進む
                }
            }
            let allCount = allPosts.length;
            let processCount = 0;
            // キャンセルフラグをリセット
            cancelRef.current = false;
            // --- ブロックの解析・更新・シリアライズ ---
            for (const post of allPosts) {
                // ループの各回でキャンセルがリクエストされているかチェック
                if (cancelRef.current) {
                    console.log("処理がキャンセルされました。");
                    return;
                }
                if (!post.content || !post.content.raw) {
                    console.warn(`Post ID ${post.id} does not contain raw content.`);
                    continue;
                }
                const content = post.content.raw;
                const blocks$1 = blocks.parse(content);
                // 特定のブロックの属性を更新
                const updatedBlocks = blocks$1.map((block) => {
                    if (block.name === blockName) {
                        // ブロックオブジェクト自体を新しく生成して、attributesを上書きします
                        return {
                            ...block,
                            attributes: {
                                ...block.attributes,
                                ...newAttributes,
                            },
                        };
                    }
                    return block;
                });
                // 更新後のブロックをシリアライズ
                const updatedContent = blocks.serialize(updatedBlocks);
                // REST APIを使って投稿を更新
                try {
                    await apiFetch({
                        path: `/wp/v2/${postType}/${post.id}`,
                        method: "POST",
                        data: { content: updatedContent },
                    });
                }
                catch (error) {
                    // error.message にアクセスできるように (error as any) または 型を指定
                    const err = error;
                    console.error(`Failed to update post ID ${post.id}:`, err.message);
                    if (err.data) {
                        console.error("Error details:", err.data);
                    }
                }
                //カウンターセットとプログレスバーの処理
                processCount++;
                setProgress(Math.round((processCount / allCount) * 100));
            }
            //終了処理
            onProcessEnd();
        }
        catch (error) {
            console.error("Error updating block attributes:", error);
        }
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(components.ProgressBar, { value: progress, className: "markdown_copy_progress" }), jsxRuntime.jsxs("p", { children: [progress, "%"] }), jsxRuntime.jsxs("div", { style: { width: "fit-content", margin: "20px auto 0" }, children: [jsxRuntime.jsx(components.Button, { variant: "primary", onClick: () => {
                            onProcessStart(); //親コンポーネントでスタート処理
                            updatePostBlockAttributes();
                        }, disabled: progress > 0 && progress < 100, children: i18n.__("Start Process", "markdown-block") }), jsxRuntime.jsx(components.Button, { variant: "secondary", onClick: () => {
                            if (progress === 0 || cancelRef.current) {
                                onProcessEnd(); // 処理が始まる前ならすぐに終了処理を実行
                            }
                            else {
                                // キャンセルフラグを更新（refならすぐに反映される）
                                cancelRef.current = true;
                                onProcessCancel(); //親コンポーネントでキャンセル処理
                            }
                        }, style: { marginLeft: "10px" }, children: i18n.__("Cancel", "markdown-block") })] })] }));
}

exports.default = UpdateAllPostsBlockAttributes;
//# sourceMappingURL=UpdateAllPostsBlockAttributes.js.map
