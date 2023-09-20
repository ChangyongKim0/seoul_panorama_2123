import React, { useState, useEffect, useReducer, useRef } from "react";
// { useEffect }

import styles from "./TextBox.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";

const cx = classNames.bind(styles);

const TextBox = ({
  children,
  type,
  right,
  align,
  use_stroke,
  opaque,
  hug,
  white,
  black,
  grey,
  lightgrey,
  zIndex,
}) => {
  return (
    <div
      className={cx("wrapper", opaque ? "opaque" : "", hug ? "hug" : "")}
      style={zIndex ? { zIndex: zIndex } : {}}
    >
      {children.map((e, idx) => (
        <p
          key={idx}
          className={cx(
            "type-" + type,
            right ? "right" : "",
            "align-" + align,
            white ? "white" : "",
            black ? "black" : "",
            grey ? "grey" : "",
            lightgrey ? "lightgrey" : ""
          )}
        >
          {e}
        </p>
      ))}
    </div>
  );
};

TextBox.defaultProps = {
  children: ["샘플", "텍스트", "입니다."],
  type: "narration",
  align: "left",
};

export default TextBox;

// ### Card

// - shape: default / rectangle
// - children: any
// - padding: int
// - clickable: boolean
// - transparent: boolean
// - onClick: ()=>any
// - use_tooltip: boolean
// - tooltip: [any]
// - tight: boolean
