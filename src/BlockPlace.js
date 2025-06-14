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
  const { attributes, clientId, blockRef, isMobile, isSubmenu, isParallax } =
    props;
  const { positionType, isPosCenter, default_val, mobile_val } = attributes;

  //モバイルかデスクトップか
  const sel_pos = isMobile ? mobile_val : default_val;

  //配置アイコンの選択

  const start_icon = sel_pos.direction === "vertical" ? upper : justifyLeft;
  const center_icon = sel_pos.direction === "vertical" ? middle : justifyCenter;
  const end_icon = sel_pos.direction === "vertical" ? lower : justifyRight;
  const start_cross = sel_pos.direction === "vertical" ? justifyLeft : upper;
  const center_cross =
    sel_pos.direction === "vertical" ? justifyCenter : middle;
  const end_cross = sel_pos.direction === "vertical" ? justifyRight : lower;
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
  const cross_start_tip =
    sel_pos.direction === "vertical"
      ? __("left alignment", "block-collections")
      : __("upper alignment", "block-collections");
  const cross_end_tip =
    sel_pos.direction === "vertical"
      ? __("right alignment", "block-collections")
      : __("lower alignment", "block-collections");

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
        if (
          computedStyle.flexDirection === "row" ||
          computedStyle.flexDirection === "row-reverse"
        ) {
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
          {(sel_pos.direction === "horizen" ||
            sel_pos.direction === "vertical") && (
            <PanelRow className="position_row">
              <ToggleControl
                label={__("reverse", "block-collections")}
                checked={sel_pos.reverse}
                onChange={(checked) => props.onReverseChange(checked)}
              />
              <ToggleControl
                label={__("wrap", "block-collections")}
                checked={sel_pos.wrap}
                onChange={(checked) => props.onWrapChange(checked)}
              />
            </PanelRow>
          )}
        </ToolbarGroup>

        {sel_pos.direction !== "block" && sel_pos.direction !== "grid" && (
          <>
            {isMobile ? (
              <p>{__("InnerBlock Main Axis(Mobile)", "block-collections")}</p>
            ) : (
              <p>{__("InnerBlock Main Axis(DeskTop)", "block-collections")}</p>
            )}
            <ToolbarGroup>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={sel_pos.inner_align === "flex-start"}
                    onClick={() =>
                      props.onFlexChange("flex-start", "inner_align")
                    } //親コンポーネントに通知
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
                    onClick={() => props.onFlexChange("center", "inner_align")} //親コンポーネントに通知
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
                    onClick={() =>
                      props.onFlexChange("flex-end", "inner_align")
                    } //親コンポーネントに通知
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
                    onClick={() =>
                      props.onFlexChange("space-between", "inner_align")
                    } //親コンポーネントに通知
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
                    onClick={() =>
                      props.onFlexChange("space-around", "inner_align")
                    } //親コンポーネントに通知
                    icon={around_icon}
                    label={__("around stretch", "block-collections")}
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </>
        )}

        {!isSubmenu &&
          (isMobile ? (
            <p>{__("InnerBlock Cross Axis(Mobile)", "block-collections")}</p>
          ) : (
            <p>{__("InnerBlock Cross Axis(DeskTop)", "block-collections")}</p>
          ))}

        {!isSubmenu && (
          <ToolbarGroup>
            <ToolbarItem>
              {(itemProps) => (
                <Button
                  {...itemProps}
                  isPressed={sel_pos.inner_items === "flex-start"}
                  onClick={() =>
                    props.onFlexChange("flex-start", "inner_items")
                  } //親コンポーネントに通知
                  icon={start_cross}
                  label={cross_start_tip}
                />
              )}
            </ToolbarItem>
            <ToolbarItem>
              {(itemProps) => (
                <Button
                  {...itemProps}
                  isPressed={sel_pos.inner_items === "center"}
                  onClick={() => props.onFlexChange("center", "inner_items")} //親コンポーネントに通知
                  icon={center_cross}
                  label={__("center alignment", "block-collections")}
                />
              )}
            </ToolbarItem>
            <ToolbarItem>
              {(itemProps) => (
                <Button
                  {...itemProps}
                  isPressed={sel_pos.inner_items === "flex-end"}
                  onClick={() => props.onFlexChange("flex-end", "inner_items")} //親コンポーネントに通知
                  icon={end_cross}
                  label={cross_end_tip}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        )}
        {isContainer && (
          <>
            {isMobile ? (
              <p>{__("Alignment in container(Mobile)", "block-collections")}</p>
            ) : (
              <p>
                {__("Alignment in container(DeskTop)", "block-collections")}
              </p>
            )}

            <ToolbarGroup>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={
                      direction === "row"
                        ? sel_pos.outer_vertical === "self-start"
                        : sel_pos.outer_align === "left"
                    }
                    onClick={
                      direction === "row"
                        ? () => props.onVerticalChange("self-start")
                        : () => props.onAlignChange("left")
                    }
                    icon={direction === "row" ? upper : justifyLeft}
                    label={
                      direction === "row"
                        ? __("upper alignment", "block-collections")
                        : __("left alignment", "block-collections")
                    }
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={
                      direction === "row"
                        ? sel_pos.outer_vertical === "center"
                        : sel_pos.outer_align === "center"
                    }
                    onClick={
                      direction === "row"
                        ? () => props.onVerticalChange("center")
                        : () => props.onAlignChange("center")
                    }
                    icon={direction === "row" ? middle : justifyCenter}
                    label={__("center alignment", "block-collections")}
                  />
                )}
              </ToolbarItem>
              <ToolbarItem>
                {(itemProps) => (
                  <Button
                    {...itemProps}
                    isPressed={
                      direction === "row"
                        ? sel_pos.outer_vertical === "self-end"
                        : sel_pos.outer_align === "right"
                    }
                    onClick={
                      direction === "row"
                        ? () => props.onVerticalChange("self-end")
                        : () => props.onAlignChange("right")
                    }
                    icon={direction === "row" ? lower : justifyRight}
                    label={
                      direction === "row"
                        ? __("lower alignment", "block-collections")
                        : __("right alignment", "block-collections")
                    }
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </>
        )}

        <BlockWidth
          attributes={attributes}
          isMobile={isMobile}
          isSubmenu={isSubmenu}
          onWidthChange={(key, widthVal) => props.onWidthChange(key, widthVal)}
          onFreeWidthChange={(key, freeVal) =>
            props.onFreeWidthChange(key, freeVal)
          }
        />

        <BlockHeight
          attributes={attributes}
          isMobile={isMobile}
          onHeightChange={(heightVal) => props.onHeightChange(heightVal)}
          onFreeHeightChange={(freeVal) => props.onFreeHeightChange(freeVal)}
        />

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
              {
                label: __("Relative", "block-collections"),
                value: "relative",
              },
              {
                label: __("Absolute", "block-collections"),
                value: "absolute",
              },
              { label: __("Fix", "block-collections"), value: "fixed" },
              { label: __("Sticky", "block-collections"), value: "sticky" },
            ]}
            onChange={(newVal) => {
              props.onPositionChange(newVal);
            }}
          />
        </div>
        {positionType === "absolute" && !isParallax && (
          <ToggleControl
            label={__(
              "Center Vertically and Horizontally",
              "block-collections"
            )}
            checked={isPosCenter}
            onChange={(newVal) => {
              props.onIsPosCenterChange(newVal);
            }}
          />
        )}
        {((positionType === "absolute" && !isPosCenter) ||
          positionType === "fixed" ||
          positionType === "sticky") && (
          <>
            {isMobile ? (
              <p>{__("Block Position(Mobile)", "block-collections")}</p>
            ) : (
              <p>{__("Block Position(DeskTop)", "block-collections")}</p>
            )}
            <PanelBody
              title={__("Vertical", "block-collections")}
              initialOpen={true}
            >
              {!sel_pos.posValue?.isVertCenter && (
                <PanelRow className="position_row">
                  <ComboboxControl
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
              )}
              {!isParallax && (
                <ToggleControl
                  label={__("Is Center", "block-collections")}
                  checked={sel_pos.posValue?.isVertCenter}
                  onChange={(newValue) => {
                    const newValObj = {
                      ...(sel_pos.posValue || {}),
                      isVertCenter: newValue,
                    };
                    props.onPosValueChange(newValObj);
                  }}
                />
              )}
            </PanelBody>

            <PanelBody
              title={__("Horizon", "block-collections")}
              initialOpen={true}
            >
              {!sel_pos.posValue?.isHorCenter && (
                <PanelRow className="position_row">
                  <ComboboxControl
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
              )}
              {!isParallax && (
                <ToggleControl
                  label={__("Is Center", "block-collections")}
                  checked={sel_pos.posValue?.isHorCenter}
                  onChange={(newValue) => {
                    const newValObj = {
                      ...(sel_pos.posValue || {}),
                      isHorCenter: newValue,
                    };
                    props.onPosValueChange(newValObj);
                  }}
                />
              )}
            </PanelBody>
          </>
        )}
      </PanelBody>
    </>
  );
}

export function BlockWidth(props) {
  const { attributes, isMobile, isSubmenu } = props;
  const { default_val, mobile_val } = attributes;

  //モバイルかデスクトップか
  const sel_pos = isMobile ? mobile_val : default_val;

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

  // ラベル
  const widthLabel = isMobile ? blockWidthMobile : blockWidthDesktop;
  const maxWidthLabel = isMobile ? blockMaxWidthMobile : blockMaxWidthDesktop;
  return (
    <>
      <p>{widthLabel}</p>
      <ToolbarGroup>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.width_val === "full"}
              onClick={() => props.onWidthChange("width_val", "full")}
              text="full"
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.width_val === "fit"}
              onClick={() => props.onWidthChange("width_val", "fit")}
              text="fit"
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.width_val === "wideSize"}
              onClick={() => props.onWidthChange("width_val", "wideSize")}
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
              onClick={() => props.onWidthChange("width_val", "contentSize")}
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
              onClick={() => props.onWidthChange("width_val", "free")}
              text="free"
            />
          )}
        </ToolbarItem>
      </ToolbarGroup>

      {sel_pos.width_val === "free" && (
        <UnitControl
          dragDirection="e"
          onChange={(newValue) =>
            props.onFreeWidthChange("free_width", newValue)
          }
          value={sel_pos.free_width}
        />
      )}
      <p>{maxWidthLabel}</p>
      <ToolbarGroup>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.max_width === "full"}
              onClick={() => props.onWidthChange("max_width", "full")}
              text="full"
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.max_width === "fit"}
              onClick={() => props.onWidthChange("max_width", "fit")}
              text="fit"
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.max_width === "wideSize"}
              onClick={() => props.onWidthChange("max_width", "wideSize")}
              icon={stretchWide}
              label={__("Wide Size", "block-collections")}
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.max_width === "contentSize"}
              onClick={() => props.onWidthChange("max_width", "contentSize")}
              icon={positionCenter}
              label={__("Content Size", "block-collections")}
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.max_width === "free"}
              onClick={() => props.onWidthChange("max_width", "free")}
              text="free"
            />
          )}
        </ToolbarItem>
      </ToolbarGroup>

      {sel_pos.max_width === "free" && (
        <UnitControl
          dragDirection="e"
          onChange={(newValue) =>
            props.onFreeWidthChange("max_free_width", newValue)
          }
          value={sel_pos.max_free_width}
        />
      )}
    </>
  );
}

export function BlockHeight(props) {
  const { attributes, isMobile } = props;
  const { default_val, mobile_val } = attributes;

  //モバイルかデスクトップか
  const sel_pos = isMobile ? mobile_val : default_val;

  return (
    <>
      {isMobile ? (
        <p>{__("Block Height(Mobile)", "block-collections")}</p>
      ) : (
        <p>{__("Block Height(DeskTop)", "block-collections")}</p>
      )}
      <ToolbarGroup>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.height_val === "full"}
              onClick={() => props.onHeightChange("full")}
              text="full"
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.height_val === "fit"}
              onClick={() => props.onHeightChange("fit")}
              text="fit"
            />
          )}
        </ToolbarItem>
        <ToolbarItem>
          {(itemProps) => (
            <Button
              {...itemProps}
              isPressed={sel_pos.height_val === "free"}
              onClick={() => props.onHeightChange("free")}
              text="free"
            />
          )}
        </ToolbarItem>
      </ToolbarGroup>
      {sel_pos.height_val === "free" && (
        <UnitControl
          dragDirection="e"
          onChange={(newValue) => props.onFreeHeightChange(newValue)}
          value={sel_pos.free_height}
        />
      )}
    </>
  );
}
