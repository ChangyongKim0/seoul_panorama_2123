import React, { useState, useEffect, useReducer, useRef, useMemo } from "react";
// { useEffect }

import styles from "./PopupCard.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";

const cx = classNames.bind(styles);

const PopupCard = ({ children, onClick }) => {
  const wrapper = useRef();

  return (
    <div className={cx("wrapper")} ref={wrapper}>
      <AutoLayout gap={1} padding={1} fillX>
        {children}
      </AutoLayout>
    </div>
  );
};

PopupCard.defaultProps = {
  children: <div>children</div>,
  onClick: () => {
    console.log("clicked an popupcard.");
  },
};

export default PopupCard;

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
