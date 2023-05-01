import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import styles from "./StartPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import TitleBox from "../component/TitleBox";
import Button from "../component/Button";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const StartPage = ({ match }) => {
  useEffect(() => {
    setTimeout(() => {
      document.body.style.backgroundColor = "#000000";
      document.body.style.position = "fixed";
    }, 10);
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.position = null;
    };
  }, []);
  return (
    <div className={cx("wrapper")}>
      <AutoLayout type="column" gap={2} attach="center" align="center" fill>
        <AutoLayout
          type="column"
          gap={0.75}
          attach="center"
          align="center"
          fill
        >
          <img className={cx("frame-image")} src="/img/start/01.png" />
          <TitleBox
            title="<Seoul Panorama 2123>"
            subtitle="서벌전경(徐伐 全景) 2123( 二千百二十三)"
          />
          <TextBox type="wrap" align="center">
            {["Seoul Biennale of", "Architecture and", "Urbanism 2023"]}
          </TextBox>
        </AutoLayout>
      </AutoLayout>
      <div className={cx("frame-button")}>
        <AutoLayout type="row" gap={0} fillX attach={"center"}>
          <Button type="default" hug link_to={"/enter"}>
            <div className={cx("frame-btn", "left")}>KR</div>
          </Button>
          <div className={cx("text-center")}>|</div>
          <Button type="default" hug link_to={"/enter"}>
            <div className={cx("frame-btn", "right")}>EN</div>
          </Button>
        </AutoLayout>
      </div>
    </div>
  );
};

export default StartPage;
