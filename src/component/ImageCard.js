import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./ImageCard.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import useButtonGesture from "../hooks/useButtonGesture";
import { ReactComponent as ImageCardSvg } from "../svgs/ImageCard.svg";
import TextBox from "./TextBox";

const cx = classNames.bind(styles);

const ImageCard = ({ title, subtitle, subtitle_eng, image_path, type, onClick }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [new_type, setNewType] = useState(type);

  const [
    button_state,
    onMouseDown,
    onMouseUp,
    useEffectContent,
    style_content,
  ] = useButtonGesture(
    { opacity: 1, scale: "1" },
    { opacity: 0.9, scale: "0.9875" },
    300
  );

  useEffect(useEffectContent, [button_state]);

  return (
    <div
      className={cx("wrapper", "type-" + new_type)}
      onClick={
        new_type !== "disabled"
          ? () => {
              setNewType((type) => {
                if (type === "clicked") {
                  onClick("default");
                  return "default";
                }
                onClick("clicked");
                return "clicked";
              });
            }
          : () => {}
      }
      // onTouchStart={
      //   global_var.touchable && type !== "disabled" ? onMouseDown : () => {}
      // }
      // onMouseDown={
      //   global_var.touchable || type === "disabled" ? () => {} : onMouseDown
      // }
      // onTouchEnd={
      //   global_var.touchable && type !== "disabled" ? onMouseUp : () => {}
      // }
      // onMouseUp={
      //   global_var.touchable || type === "disabled" ? () => {} : onMouseUp
      // }
      style={style_content}
    >
      <div className={cx("frame-image")}>
        <img className={cx("image")} src={image_path}></img>
      </div>
      {new_type === "clicked" ? (
        <AutoLayout gap={0.5} fill zIndex={2} attach="center">
          <div className={cx("frame-back")}></div>
          <TextBox type="wrap" align="center">
            {global_var.use_eng
              ? [subtitle_eng]
              : [subtitle]
            }
          </TextBox>
          <ImageCardSvg />
          <div className={cx("frame-blank")}>
            <TextBox type="wrap" align="center">
              {global_var.use_eng
              ? ["Are you sure?"]
              : ["과연 정답일까요?"]
              }
            </TextBox>
          </div>
        </AutoLayout>
      ) : new_type === "default" ? (
        <AutoLayout align="left" gap={0.5} padding={1}>
          <div className={cx("title")}>{title}</div>
        </AutoLayout>
      ) : (
        <></>
      )}
    </div>
  );
};

ImageCard.defaultProps = {
  title: "title",
  subtitle: "subtitle",
  image_path: "/img/imageSample.jpg",
  onClick: () => console.log("clicked an ImageCard"),
  type: "default",
};

export default ImageCard;

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
