import React, { useState, useEffect, useReducer, useRef } from "react";
// { useEffect }

import styles from "./TitleBox.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";
import TextBox from "./TextBox";

const cx = classNames.bind(styles);

const TitleBox = ({ title, subtitle, top }) => {
  return (
    <div className={cx("wrapper", top ? "top" : "")}>
      <AutoLayout gap={1}>
        <TextBox type={"title"} align="center">
          {[title]}
        </TextBox>
        <TextBox type={"subtitle"} align="center">
          {[subtitle]}
        </TextBox>
      </AutoLayout>
    </div>
  );
};

TitleBox.defaultProps = {
  children: ["샘플", "텍스트", "입니다."],
  type: "title",
  align: "left",
};

export default TitleBox;

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
