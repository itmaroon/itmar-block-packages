import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  PanelRow,
  RangeControl,
  TextControl,
  SelectControl,
} from "@wordpress/components";
import { format, getSettings } from "@wordpress/date";

//日付のフォーマット
const dateFormats = [
  { label: "YYYY-MM-DD HH:mm:ss", value: "Y-m-d H:i:s" },
  { label: "MM/DD/YYYY", value: "m/d/Y" },
  { label: "DD/MM/YYYY", value: "d/m/Y" },
  { label: "MMMM D, YYYY", value: "F j, Y" },
  { label: "HH:mm:ss", value: "H:i:s" },
  { label: "YYYY.M.D", value: "Y.n.j" },
  { label: "Day, MMMM D, YYYY", value: "l, F j, Y" },
  { label: "ddd, MMM D, YYYY", value: "D, M j, Y" },
  { label: "YYYY年M月D日 (曜日)", value: "Y年n月j日 (l)" },
];
//プレーンのフォーマット
const plaineFormats = [
  {
    key: "str_free",
    label: __("Free String", "block-collections"),
    value: "%s",
  },
  {
    key: "num_comma",
    label: __("Numbers (comma separated)", "block-collections"),
    value: {
      style: "decimal",
      useGrouping: true, // カンマ区切り
    },
  },
  {
    key: "num_no_comma",
    label: __("Numbers (no commas)", "block-collections"),
    value: {
      style: "decimal",
      useGrouping: false,
    },
  },
  {
    key: "num_amount",
    label: __("Amount", "block-collections"),
    value: {
      style: "currency",
      currency: "JPY",
    },
  },
];

export const FormatSelectControl = ({
  titleType,
  userFormat,
  freeStrFormat,
  decimal,
  onFormatChange,
}) => {
  const isPlaine = titleType === "plaine";
  const isDate = titleType === "date";
  const isUser = titleType === "user";

  //SelectControlのオプションを生成
  const options = isDate
    ? dateFormats
    : plaineFormats.map((f) => ({ label: f.label, value: f.key }));

  return (
    <PanelBody title={__("Display Format Setting", "block-collections")}>
      {(isPlaine || isDate) && (
        <>
          <SelectControl
            label={__("Select Format", "block-collections")}
            value={userFormat}
            options={options}
            onChange={(newFormat) =>
              onFormatChange({
                userFormat: newFormat,
                freeStrFormat,
                decimal,
              })
            }
          />

          {userFormat?.startsWith("str_") && (
            <TextControl
              label={__("String Format", "block-collections")}
              value={freeStrFormat}
              onChange={(newFormat) =>
                onFormatChange({
                  userFormat,
                  freeStrFormat: newFormat,
                  decimal,
                })
              }
            />
          )}
          {userFormat?.startsWith("num_") && (
            <PanelRow className="itmar_post_blocks_pannel">
              <RangeControl
                value={decimal}
                label={__("Decimal Num", "query-blocks")}
                max={5}
                min={0}
                onChange={(val) =>
                  onFormatChange({
                    userFormat,
                    freeStrFormat,
                    decimal: val,
                  })
                }
              />
            </PanelRow>
          )}
        </>
      )}

      {isUser && (
        <TextControl
          label={__("User Format", "block-collections")}
          value={freeStrFormat}
          onChange={(newFormat) =>
            onFormatChange({
              userFormat: "str_free",
              freeStrFormat: newFormat,
              decimal,
            })
          }
        />
      )}
    </PanelBody>
  );
};

export const displayFormated = (
  content,
  userFormat,
  freeStrFormat,
  decimal
) => {
  // 内部で使用するロケール
  const locale = getSettings().l10n?.locale || "en";

  //日付にフォーマットがあれば、それで書式設定してリターン
  const isDateFormat = dateFormats.find((f) => f.value === userFormat);
  if (isDateFormat) {
    const ret_val = format(userFormat, content, getSettings());
    return ret_val;
  }
  //数値や文字列のフォーマット
  const selectedFormat = plaineFormats.find((f) => f.key === userFormat)?.value;
  if (typeof selectedFormat === "object") {
    // Intl.NumberFormat オプション
    try {
      const numeric = parseFloat(content);
      // `selectedFormat` を元に新しいフォーマット設定を生成（mutateしない）
      const options = { ...selectedFormat };

      if (typeof decimal === "number" && decimal > 0) {
        options.minimumFractionDigits = decimal;
        options.maximumFractionDigits = decimal;
      }

      const formatter = new Intl.NumberFormat(locale, options);
      return formatter.format(numeric);
    } catch (e) {
      console.warn("Number format failed:", e);
      return content;
    }
  } else if (typeof selectedFormat === "string") {
    return freeStrFormat.replace("%s", content);
  }
  //フォーマットが見つからないときはそのまま返す
  return content;
};
