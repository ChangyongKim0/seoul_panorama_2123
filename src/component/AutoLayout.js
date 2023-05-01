import React, { useLayoutEffect } from "react";
// { useEffect }

import styles from "./AutoLayout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const AutoLayout = ({
  children,
  type,
  align,
  attach,
  multiple_line,
  gap,
  width,
  height,
  onMouseOver,
  onMouseEnter,
  onMouseLeave,
  onClick,
  relative,
  padding,
  // paddingTop,
  // paddingBottom,
  showContent,
  fill,
  fillX,
  fillY,
  zIndex,
  preventClick,
  recoverClick,
  absolute,
}) => {
  const getStyle = () => {
    const new_padding = padding ? { padding: padding + "rem" } : {};
    // const new_paddingTop = paddingTop ? { paddingTop: paddingTop + "rem" } : {};
    // const new_paddingBottom = paddingBottom
    //   ? { paddingBottom: paddingBottom + "rem" }
    //   : {};
    const new_fillX =
      fill || fillX ? { width: "calc(100% - " + padding * 2 + "rem)" } : {};
    const new_fillY =
      fill || fillY ? { height: "calc(100% - " + padding * 2 + "rem)" } : {};
    const new_gap = gap ? { gap: gap + "rem" } : {};
    const new_zIndex =
      zIndex !== undefined ? { zIndex, position: "absolute" } : {};
    const new_preventClick = preventClick
      ? { pointerEvents: "none" }
      : recoverClick
      ? { pointerEvents: "auto" }
      : {};
    // console.log({ new_padding, new_fillX, new_fillY, new_gap });
    return {
      ...new_padding,
      ...new_fillX,
      ...new_fillY,
      ...new_gap,
      ...new_zIndex,
      ...new_preventClick,
    };
  };
  return (
    <div
      className={cx(
        "wrapper",
        relative ? "relative" : "",
        "type-" + type,
        "align-" + align,
        "attach-" + attach,
        multiple_line ? "multiple-line" : "",
        absolute ? "absolute" : ""
      )}
      style={getStyle()}
      onMouseOver={onMouseOver}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

AutoLayout.defaultProps = {
  children: (
    <>
      <div>children.first</div>
      <div>children.last</div>
    </>
  ),
  type: "column",
  align: "center",
  attach: "default",
  multiple_line: false,
  gap: 0.5,
  height: "auto",
  tight: true,
  padding: 0,
};

export default AutoLayout;

// ### AutoLayout

// - type : column / row / grid
// - align : left / center / right
// - attach : start / default / end / space
// - multiple_line : boolean
// - gap : int
