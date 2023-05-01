import React, { Children, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./Button.module.scss";
import classNames from "classnames/bind";
import useButtonGesture from "../hooks/useButtonGesture.js";
import useGlobalVar from "../hooks/useGlobalVar";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Button = ({ type, children, color, onClick, link_to, hug, fillX }) => {
  const [global_var, setGlobalVar] = useGlobalVar();

  const [
    button_state,
    onMouseDown,
    onMouseUp,
    useEffectContent,
    style_content,
  ] = useButtonGesture(
    { opacity: 1, scale: "1" },
    { opacity: 0.75, scale: "0.975" },
    300
  );

  useEffect(useEffectContent, [button_state]);

  return link_to ? (
    <Link
      to={link_to}
      className={cx(
        "wrapper",
        "color-" + (type == "default" ? color : type),
        "type-" + type,
        hug ? "hug" : "not-hug",
        fillX ? "fill-x" : ""
      )}
      onClick={onClick}
      onTouchStart={global_var.touchable ? onMouseDown : () => {}}
      onMouseDown={global_var.touchable ? () => {} : onMouseDown}
      onTouchEnd={global_var.touchable ? onMouseUp : () => {}}
      onMouseUp={global_var.touchable ? () => {} : onMouseUp}
      style={style_content}
    >
      <div className={cx("frame")}>{children}</div>
    </Link>
  ) : (
    <div
      className={cx(
        "wrapper",
        "color-" + (type == "default" ? color : type),
        "type-" + type,
        hug ? "hug" : "not-hug",
        fillX ? "fill-x" : ""
      )}
      onClick={onClick}
      onTouchStart={global_var.touchable ? onMouseDown : () => {}}
      onMouseDown={global_var.touchable ? () => {} : onMouseDown}
      onTouchEnd={global_var.touchable ? onMouseUp : () => {}}
      onMouseUp={global_var.touchable ? () => {} : onMouseUp}
      style={style_content}
    >
      <div className={cx("frame")}>{children}</div>
    </div>
  );
};

Button.defaultProps = {
  type: "normal",
  children: "children",
  color: "default",
  onClick: () => {
    console.log("clicked default button");
  },
  tight: true,
};

export default Button;

// ### Button

// - type: default / excel / cad
// - shape: default / rectangle
// - children: any
// - color: default / transparent / primary
// - padding: int
// - onClick: ()=>any
// - tight: boolean
