import React, { Children, useState } from "react";
// { useEffect }

import styles from "./Icon.module.scss";
import classNames from "classnames/bind";
// 아래에 개별 아이콘 추가
import { ReactComponent as Add } from "../svgs/Add.svg";
import { ReactComponent as User } from "../svgs/User.svg";
import { ReactComponent as Back } from "../svgs/Back.svg";
import { ReactComponent as CloseButton } from "../svgs/CloseButton.svg";
import { ReactComponent as Menu } from "../svgs/Menu.svg";
import { ReactComponent as Develop } from "../svgs/Develop.svg";
import { ReactComponent as UnDevelop } from "../svgs/UnDevelop.svg";
import { ReactComponent as Build } from "../svgs/Build.svg";
import { ReactComponent as UnBuild } from "../svgs/UnBuild.svg";

const cx = classNames.bind(styles);

const Icon = ({
  type,
  onClick,
  size,
  disable,
  tooltip_align,
  fill,
  stroke,
  fillColor,
}) => {
  // 아래에 개별 아이콘 호출어 추가
  const getIcon = (type) => {
    const default_style = {
      width: "1000px",
      height: "1000px",
      stroke: stroke ? stroke : "none",
      fill: fillColor ? fillColor : "none",
    };
    switch (type) {
      case "add":
        return <Add {...default_style} />;
      case "back":
        return <Back {...default_style} />;
      case "close button":
        return <CloseButton {...default_style} />;
      case "menu":
        return <Menu {...default_style} />;
      case "develop":
        return <Develop {...default_style} />;
      case "undevelop":
        return <UnDevelop {...default_style} />;
      case "build":
        return <Build {...default_style} />;
      case "unbuild":
        return <UnBuild {...default_style} />;
      default:
        return <User {...default_style} />;
    }
  };

  return (
    <div
      className={cx("wrapper", disable ? "disable" : "")}
      style={{
        height: size + "rem",
        width: size + "rem",
        padding: fill ? 0 : size / 6 + "rem",
      }}
      onClick={onClick}
    >
      {getIcon(type)}
    </div>
  );
};

Icon.defaultProps = {
  type: "default",
  clickable: true,
  onClick: () => {
    console.log("clicked default Icon");
  },
  use_tooltip: false,
  size: 1.5,
  disable: false,
  tooltip_align: "default",
};

export default Icon;

// ### Icon

// - type : default / add / analysis / ...
// - color : outlined / default / white / primary / black
// - clickable : boolean
// - onClick : ()=>any
// - use_tooltip : boolean
// - tooltip : [any]
// - size : number
