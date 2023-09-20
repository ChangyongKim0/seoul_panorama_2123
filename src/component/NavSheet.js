import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  forwardRef,
} from "react";
// { useEffect }

import styles from "./NavSheet.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import useButtonGesture from "../hooks/useButtonGesture";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";
import { Link, useNavigate } from "react-router-dom";
import Button from "../component/Button";

const cx = classNames.bind(styles);

const NavSheet = forwardRef(({ type, children, onClick, fillX }, ref) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();

  const navigate = useNavigate();
  return (
    <div className={cx("wrapper", fillX ? "fillX" : "")} ref={ref}>
      <div className={cx("frame-header")}>
        <AutoLayout type="row" attach="space" padding={0.75} fillX>
          <div className={cx("frame-rotate")}>
            <Icon
              type="back"
              onClick={() => {
                onClick?.Fold?.();
              }}
              fill
              stroke="#000"
            />
          </div>
        </AutoLayout>
      </div>
      <AutoLayout gap={1} padding={1} fillX>
        <div className={cx("frame-top")} />
        {children}
        <div className={cx("frame-bottom")} />
      </AutoLayout>
    </div>
  );
});

NavSheet.defaultProps = { type: "back" };

export default NavSheet;

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
