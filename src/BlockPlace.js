import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";

import {
  Button,
  PanelBody,
  PanelRow,
  __experimentalUnitControl as UnitControl,
  ComboboxControl,
  Icon,
  ToolbarGroup,
  ToolbarItem,
  RangeControl,
  RadioControl,
  ToggleControl,
  Modal,
} from "@wordpress/components";
import {
  group,
  stack,
  layout,
  justifyCenter,
  justifyLeft,
  justifyRight,
  justifySpaceBetween,
  justifyStretch,
  stretchWide,
  positionCenter,
} from "@wordpress/icons";
import GridControls from "./GridControls";

//横並びのアイコン
const flex = <Icon icon={stack} className="rotate-icon" />;
//上よせアイコン
const upper = <Icon icon={justifyLeft} className="rotate-icon" />;
//中央よせのアイコン
const middle = <Icon icon={justifyCenter} className="rotate-icon" />;
//下よせのアイコン
const lower = <Icon icon={justifyRight} className="rotate-icon" />;
//上下一杯に伸ばすアイコン
const vert_between = <Icon icon={justifyStretch} className="rotate-icon" />;
//上下均等に伸ばすアイコン
const vert_around = <Icon icon={justifySpaceBetween} className="rotate-icon" />;

export default function BlockPlace(props) {
  const { attributes, clientId, blockRef, isMobile, isSubmenu } = props;
  const { positionType, heightValue, default_pos, mobile_pos } = attributes;

  //モバイルかデスクトップか
  const sel_pos = isMobile ? mobile_pos : default_pos;

  //配置アイコンの選択
  const start_icon = sel_pos.direction === "vertical" ? upper : justifyLeft;
  const center_icon = sel_pos.direction === "vertical" ? middle : justifyCenter;
  const end_icon = sel_pos.direction === "vertical" ? lower : justifyRight;
  const between_icon =
    sel_pos.direction === "vertical" ? vert_between : justifyStretch;
  const around_icon =
    sel_pos.direction === "vertical" ? vert_around : justifySpaceBetween;
  //ツールチップの選択
  const start_tip =
    sel_pos.direction === "vertical"
      ? __("upper alignment", "block-collections")
      : __("left alignment", "block-collections");
  const end_tip =
    sel_pos.direction === "vertical"
      ? __("lower alignment", "block-collections")
      : __("right alignment", "block-collections");

  const [isContainer, setIsContainer] = useState(false);
  const [direction, setDirection] = useState("row");
  useEffect(() => {
    if (blockRef.current) {
      const element = blockRef.current;
      const parentElement = element.parentElement;
      const grandparentElement = parentElement?.parentElement;
      const computedStyle = getComputedStyle(grandparentElement);
      //親要素がFlex又はGridコンテナか
      if (
        computedStyle.display === "flex" ||
        computedStyle.display === "inline-flex" ||
        computedStyle.display === "grid" ||
        computedStyle.display === "inline-grid"
      ) {
        setIsContainer(true);
      }
      //flexの時その方向
      if (
        computedStyle.display === "flex" ||
        computedStyle.display === "inline-flex"
      ) {
        if (computedStyle.flexDirection === "row") {
          setDirection("row");
        } else {
          setDirection("column");
        }
      }
    }
  }, []);

  //GridModalを開く
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const openGridModal = () => setIsGridModalOpen(true);
  const closeGridModal = () => setIsGridModalOpen(false);

  // 翻訳が必要な文字列を直接指定
  const blockMaxWidthMobile = __(
    "Block Max Width(Mobile)",
    "block-collections"
  );
  const blockWidthMobile = __("Block Width(Mobile)", "block-collections");
  const blockMaxWidthDesktop = __(
    "Block Max Width(DeskTop)",
    "block-collections"
  );
  const blockWidthDesktop = __("Block Width(DeskTop)", "block-collections");

  // 条件に応じて選択
  const blockWidthLabel = isMobile
    ? isSubmenu
      ? blockWidthMobile
      : blockMaxWidthMobile
    : isSubmenu
    ? blockWidthDesktop
    : blockMaxWidthDesktop;

  return (
    <>
      <PanelBody
        title={__("Block placement", "block-collections")}
        initialOpen={false}
        className="itmar_group_direction"
      >
        {isMobile ? (
          <p>{__("InnerBlock direction(Mobile)", "block-collections")}</p>
        ) : (
          <p>{__("InnerBlock direction(DeskTop)", "block-collections")}</p>
        )}

        <ToolbarGroup>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.direction === "block"}
                onClick={() => props.onDirectionChange("block")}
                icon={group}
                label={__("block", "block-collections")}
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.direction === "vertical"}
                onClick={() => props.onDirectionChange("vertical")}
                icon={stack}
                label={__("virtical", "block-collections")}
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.direction === "horizen"}
                onClick={() => props.onDirectionChange("horizen")}
                icon={flex}
                label={__("horizen", "block-collections")}
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.direction === "grid"}
                onClick={() => props.onDirectionChange("grid")}
                icon={layout}
                label={__("grid", "block-collections")}
              />
            )}
          </ToolbarItem>
        </ToolbarGroup>
        {(sel_pos.direction === "horizen" ||
          sel_pos.direction === "vertical") && (
          <ToggleControl
            label={__("reverse", "block-collections")}
            checked={sel_pos.reverse}
            onChange={(checked) => props.onReverseChange(checked)}
          />
        )}
        {sel_pos.direction !== "block" && sel_pos.direction !== "grid" && (
          <>
            {isMobile ? (
              <p>{__("InnerBlock alignment(Mobile)", "block-collections")}</p>
            ) : (
              <p>{__("InnerBlock alignment(DeskTop)", "block-collections")}</p>
            )}
            <ToolbarGroup>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.inner_align === "flex-start"}
                    onClick={() => props.onFlexChange("flex-start")} //親コンポーネントに通知
                    icon={start_icon}
                    label={start_tip}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.inner_align === "center"}
                    onClick={() => props.onFlexChange("center")} //親コンポーネントに通知
                    icon={center_icon}
                    label={__("center alignment", "block-collections")}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.inner_align === "flex-end"}
                    onClick={() => props.onFlexChange("flex-end")} //親コンポーネントに通知
                    icon={end_icon}
                    label={end_tip}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.inner_align === "space-between"}
                    onClick={() => props.onFlexChange("space-between")} //親コンポーネントに通知
                    icon={between_icon}
                    label={__("beteen stretch", "block-collections")}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.inner_align === "space-around"}
                    onClick={() => props.onFlexChange("space-around")} //親コンポーネントに通知
                    icon={around_icon}
                    label={__("around stretch", "block-collections")}
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </>
        )}

        {!isContainer &&
          !isSubmenu &&
          (isMobile ? (
            <p>{__("Block alignment(Mobile)", "block-collections")}</p>
          ) : (
            <p>{__("Block alignment(DeskTop)", "block-collections")}</p>
          ))}

        {!isContainer && !isSubmenu && (
          <ToolbarGroup>
            <ToolbarItem>
              {(itemProps) => (
                <Button
                  {...itemProps}
                  isPressed={sel_pos.outer_align === "left"}
                  onClick={() => props.onAlignChange("left")}
                  icon={justifyLeft}
                  label={__("left alignment", "block-collections")}
                />
              )}
            </ToolbarItem>
            <ToolbarItem>
              {(itemProps) => (
                <Button
                  {...itemProps}
                  isPressed={sel_pos.outer_align === "center"}
                  onClick={() => props.onAlignChange("center")}
                  icon={justifyCenter}
                  label={__("center alignment", "block-collections")}
                />
              )}
            </ToolbarItem>
            <ToolbarItem>
              {(itemProps) => (
                <Button
                  {...itemProps}
                  isPressed={sel_pos.outer_align === "right"}
                  onClick={() => props.onAlignChange("right")}
                  icon={justifyRight}
                  label={__("right alignment", "block-collections")}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        )}
        {isContainer && (
          <>
            {isMobile ? (
              <p>{__("Block alignment(Mobile)", "block-collections")}</p>
            ) : (
              <p>{__("Block alignment(DeskTop)", "block-collections")}</p>
            )}

            <ToolbarGroup>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.outer_vertical === "self-start"}
                    onClick={() => props.onVerticalChange("self-start")}
                    icon={direction === "row" ? upper : justifyLeft}
                    label={__("upper alignment", "block-collections")}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.outer_vertical === "center"}
                    onClick={() => props.onVerticalChange("center")}
                    icon={direction === "row" ? middle : justifyCenter}
                    label={__("center alignment", "block-collections")}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.outer_vertical === "self-end"}
                    onClick={() => props.onVerticalChange("self-end")}
                    icon={direction === "row" ? lower : justifyRight}
                    label={__("lower alignment", "block-collections")}
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </>
        )}

        <p>{blockWidthLabel}</p>
        <ToolbarGroup>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.width_val === "full"}
                onClick={() => props.onWidthChange("full")}
                text="full"
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.width_val === "fit"}
                onClick={() => props.onWidthChange("fit")}
                text="fit"
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.width_val === "wideSize"}
                onClick={() => props.onWidthChange("wideSize")}
                icon={stretchWide}
                label={__("Wide Size", "block-collections")}
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.width_val === "contentSize"}
                onClick={() => props.onWidthChange("contentSize")}
                icon={positionCenter}
                label={__("Content Size", "block-collections")}
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={sel_pos.width_val === "free"}
                onClick={() => props.onWidthChange("free")}
                text="free"
              />
            )}
          </ToolbarItem>
        </ToolbarGroup>

        {sel_pos.width_val === "free" && (
          <RangeControl
            value={sel_pos.free_val}
            label={__("Max width", "block-collections")}
            max={1800}
            min={300}
            step={10}
            onChange={(newValue) => {
              props.onFreevalChange(newValue);
            }}
            withInputField={true}
          />
        )}

        <p>{__("Block Height", "block-collections")}</p>
        <ToolbarGroup>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={heightValue === "full"}
                onClick={() => props.onHeightChange("full")}
                text="full"
              />
            )}
          </ToolbarItem>
          <ToolbarItem>
            {(itemProps) => (
              <Button
                {...itemProps}
                isPressed={heightValue === "fit"}
                onClick={() => props.onHeightChange("fit")}
                text="fit"
              />
            )}
          </ToolbarItem>
        </ToolbarGroup>

        {sel_pos.direction === "grid" && (
          <>
            {isMobile ? (
              <p>{__("Grid Info settings(Mobile)", "block-collections")}</p>
            ) : (
              <p>{__("Grid Info settings(DeskTop)", "block-collections")}</p>
            )}
            <Button variant="primary" onClick={openGridModal}>
              {__("Open Setting Modal", "block-collections")}
            </Button>
            {isGridModalOpen && (
              <Modal title="Grid Info settings" onRequestClose={closeGridModal}>
                <GridControls
                  attributes={sel_pos.grid_info}
                  clientId={clientId}
                  onChange={(newValue) => {
                    props.onGridChange(newValue);
                  }}
                />
              </Modal>
            )}
          </>
        )}
        <div className="itmar_title_type">
          <RadioControl
            label={__("Position Type", "block-collections")}
            selected={positionType}
            options={[
              { label: __("Static", "block-collections"), value: "staic" },
              { label: __("Relative", "block-collections"), value: "relative" },
              { label: __("Absolute", "block-collections"), value: "absolute" },
              { label: __("Fix", "block-collections"), value: "fixed" },
              { label: __("Sticky", "block-collections"), value: "sticky" },
            ]}
            onChange={(newVal) => {
              props.onPositionChange(newVal);
            }}
          />
        </div>
        {(positionType === "absolute" ||
          positionType === "fixed" ||
          positionType === "sticky") && (
          <>
            {isMobile ? (
              <p>{__("Block Position(Mobile)", "block-collections")}</p>
            ) : (
              <p>{__("Block Position(DeskTop)", "block-collections")}</p>
            )}
            <PanelRow className="position_row">
              <ComboboxControl
                label={__("Vertical", "block-collections")}
                options={[
                  { value: "top", label: "Top" },
                  { value: "bottom", label: "Bottom" },
                ]}
                value={sel_pos.posValue?.vertBase || "top"}
                onChange={(newValue) => {
                  const newValObj = {
                    ...(sel_pos.posValue || {}),
                    vertBase: newValue,
                  };
                  props.onPosValueChange(newValObj);
                }}
              />
              <UnitControl
                dragDirection="e"
                onChange={(newValue) => {
                  const newValObj = {
                    ...(sel_pos.posValue || {}),
                    vertValue: newValue,
                  };
                  props.onPosValueChange(newValObj);
                }}
                value={sel_pos.posValue?.vertValue || "3em"}
              />
            </PanelRow>
            <PanelRow className="position_row">
              <ComboboxControl
                label={__("Horizon", "block-collections")}
                options={[
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
                value={sel_pos.posValue?.horBase || "left"}
                onChange={(newValue) => {
                  const newValObj = {
                    ...(sel_pos.posValue || {}),
                    horBase: newValue,
                  };
                  props.onPosValueChange(newValObj);
                }}
              />
              <UnitControl
                dragDirection="e"
                onChange={(newValue) => {
                  const newValObj = {
                    ...(sel_pos.posValue || {}),
                    horValue: newValue,
                  };
                  props.onPosValueChange(newValObj);
                }}
                value={sel_pos.posValue?.horValue || "3em"}
              />
            </PanelRow>
          </>
        )}
      </PanelBody>
    </>
  );
}
