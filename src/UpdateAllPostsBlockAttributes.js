import { useState, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar, Button } from "@wordpress/components";
import { parse, serialize } from "@wordpress/blocks";
import apiFetch from "@wordpress/api-fetch";

//特定の投稿タイプの投稿に含まれる本ブロックの属性を書き換える

export default function UpdateAllPostsBlockAttributes({
  postType,
  blockName,
  newAttributes,
  onProcessStart,
  onProcessEnd,
  onProcessCancel,
}) {
  const [progress, setProgress] = useState(0);
  // stateではなくrefを使用してキャンセル状態を管理する
  const cancelRef = useRef(false);
  const updatePostBlockAttributes = async () => {
    try {
      const allPosts = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        // REST APIを使ってすべての投稿を取得（投稿タイプを指定）
        const path = `/wp/v2/${postType}?per_page=100&page=${page}&context=edit`;
        const posts = await apiFetch({ path });
        allPosts.push(...posts);
        // 投稿が100件未満の場合、次のページは存在しない
        if (posts.length < 100) {
          hasMore = false;
        } else {
          page += 1; // 次のページに進む
        }
      }
      let allCount = allPosts.length;
      let processCount = 0;
      // キャンセルフラグをリセット
      cancelRef.current = false;

      for (const post of allPosts) {
        if (!post.content || !post.content.raw) {
          console.warn(`Post ID ${post.id} does not contain raw content.`);
          continue;
        }
        // ループの各回でキャンセルがリクエストされているかチェック
        if (cancelRef.current) {
          console.log("処理がキャンセルされました。");
          return;
        }

        const content = post.content.raw;
        const blocks = parse(content);
        // 特定のブロックの属性を更新
        const updatedBlocks = blocks.map((block) => {
          if (block.name === blockName) {
            // 属性をマージして更新
            block.attributes = {
              ...block.attributes,
              ...newAttributes,
            };
          }
          return block;
        });

        // 更新後のブロックをシリアライズ
        const updatedContent = serialize(updatedBlocks);

        // REST APIを使って投稿を更新
        try {
          await apiFetch({
            path: `/wp/v2/${postType}/${post.id}`,
            method: "POST",
            data: { content: updatedContent },
          });
        } catch (error) {
          console.error(`Failed to update post ID ${post.id}:`, error.message);
          if (error.data) {
            console.error("Error details:", error.data);
          }
        }
        //カウンターセットとプログレスバーの処理
        processCount++;
        setProgress(Math.round((processCount / allCount) * 100));
      }

      //終了処理
      onProcessEnd();
    } catch (error) {
      console.error("Error updating block attributes:", error);
    }
  };
  return (
    <>
      <ProgressBar value={progress} className="markdown_copy_progress" />
      <p>{progress}%</p>
      <div style={{ width: "fit-content", margin: "20px auto 0" }}>
        <Button
          variant="primary"
          onClick={() => {
            onProcessStart(); //親コンポーネントでスタート処理
            updatePostBlockAttributes();
          }}
          disabled={progress > 0 && progress < 100}
        >
          {__("Start Process", "markdown-block")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (progress === 0 || cancelRef.current) {
              onProcessEnd(); // 処理が始まる前ならすぐに終了処理を実行
            } else {
              // キャンセルフラグを更新（refならすぐに反映される）
              cancelRef.current = true;
              onProcessCancel(); //親コンポーネントでキャンセル処理
            }
          }}
          style={{ marginLeft: "10px" }}
        >
          {__("Cancel", "markdown-block")}
        </Button>
      </div>
    </>
  );
}
