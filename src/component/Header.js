import React, { useState, useEffect, useReducer, useRef } from "react";
// { useEffect }

import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import useButtonGesture from "../hooks/useButtonGesture";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";
import { Link, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Header = ({ type, onClick, grey, black }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();

  const navigate = useNavigate();
  return (
    <div className={cx("wrapper", grey ? "grey" : "", black ? "black" : "")}>
      <AutoLayout type="row" attach="space" align="center" fillY>
        {type === "back" ? (
          <Icon
            type="back"
            onClick={() => {
              onClick?.Back?.();
              navigate(-1);

              // console.log("f");
            }}
            fill
            stroke={black ? "#fff" : "#000"}
          />
        ) : (
          <div></div>
        )}
        <AutoLayout type="row" gap={1} fillY>
          {/* <div className={cx("frame-menu")}>
            <Icon
              type="menu"
              onClick={() => {
                onClick?.Menu?.();
                // console.log("f");
              }}
            />
          </div> */}
          {type === "menu" ? (
            <div className={cx("frame-menu")}>
              <Icon
                type="menu"
                onClick={() => {
                  onClick?.Menu?.();
                  // console.log("f");
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
        </AutoLayout>
      </AutoLayout>
    </div>
  );
};

Header.defaultProps = { type: "back" };

export default Header;

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
