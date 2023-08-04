import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
// { useEffect }

import styles from "./TextInput.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";

const cx = classNames.bind(styles);

const TextInput = forwardRef(({ children, type, onKeyDown }, ref) => {
  const input = useRef();
  useImperativeHandle(ref, () => input.current, [input.current]);
  return (
    <div className={cx("wrapper")}>
      <input
        type="text"
        id="nickname"
        placeholder={children}
        className={cx("frame-input")}
        ref={input}
        onKeyDown={() => {
          onKeyDown(input.current.value);
        }}
      />
      <div
        className={cx("frame-button")}
        onClick={() => {
          input.current.value = "";
        }}
      >
        <Icon type="close button" fill />
      </div>
    </div>
  );
});

TextInput.defaultProps = {
  children: "샘플",
  type: "normal",
};

export default TextInput;

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
