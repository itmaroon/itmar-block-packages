import { createElement, Fragment } from "@wordpress/element";
import { useState, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar, Button } from "@wordpress/components";
import { parse, serialize, BlockInstance } from "@wordpress/blocks";
import apiFetch from "@wordpress/api-fetch";

//特定の投稿タイプの投稿に含まれる本ブロックの属性を書き換える

// 1. Propsの型定義
interface UpdateAllPostsProps {
  postType: string;
  blockName: string;
  newAttributes: Record<string, any>;
  onProcessStart: () => void;
  onProcessEnd: () => void;
  onProcessCancel: () => void;
}

// 2. WP REST API から返ってくる投稿の型定義
interface WPPost {
  id: number;
  content: {
    raw: string;
    rendered?: string;
  };
  [key: string]: any;
}

export default function UpdateAllPostsBlockAttributes({
  postType,
  blockName,
  newAttributes,
  onProcessStart,
  onProcessEnd,
  onProcessCancel,
}: UpdateAllPostsProps) {
  const [progress, setProgress] = useState<number>(0);
  // stateではなくrefを使用してキャンセル状態を管理する
  const cancelRef = useRef<boolean>(false);
  const updatePostBlockAttributes = async () => {
    try {
      const allPosts: WPPost[] = [];
      let page = 1;
      let hasMore = true;

      // --- 投稿の全件取得 ---
      while (hasMore) {
        if (cancelRef.current) return;

        // REST APIを使ってすべての投稿を取得（投稿タイプを指定）
        const posts = await apiFetch<WPPost[]>({
          path: `/wp/v2/${postType}?per_page=100&page=${page}&context=edit`,
        });
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
        const blocks = parse(content) as BlockInstance[];

        // 特定のブロックの属性を更新
        const updatedBlocks = blocks.map((block) => {
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
        const updatedContent = serialize(updatedBlocks);

        // REST APIを使って投稿を更新
        try {
          await apiFetch({
            path: `/wp/v2/${postType}/${post.id}`,
            method: "POST",
            data: { content: updatedContent },
          });
        } catch (error: any) {
          // error.message にアクセスできるように (error as any) または 型を指定
          const err = error as { message: string; data?: any };
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
