import React, { useLayoutEffect } from "react";
// { useEffect }

import styles from "./Slider.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Slider = ({ children, type, gap, padding }) => {
  const getStyle = () => {};
  return (
    <div
      className={cx("wrapper", "type-" + type)}
      style={{ gap: gap + "rem", padding: padding + "rem" }}
    >
      {children}
    </div>
  );
};

Slider.defaultProps = {
  children: (
    <>
      <div>children.first</div>
      <div>children.last</div>
    </>
  ),
  type: "row",
  gap: 0.5,
  padding: 1,
};

export default Slider;

// ### Slider

// - type : column / row / grid
// - align : left / center / right
// - attach : start / default / end / space
// - multiple_line : boolean
// - gap : int
