import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import styles from "./EnterPageOld.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import TitleBox from "../component/TitleBox";
import Button from "../component/Button";
import Divider from "../component/Divider";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const EnterPageOld = ({ match }) => {
  return (
    <div className={cx("wrapper")}>
      <AutoLayout type="column" gap={0.75} align="center" fill padding={1}>
        <TitleBox
          title="<Seoul Panorama 2123>"
          subtitle="서라벌전경 2123 (徐羅伐全景 二千百二十三)"
          top
        />
        <div className={cx("frame-scroll")}>
          <AutoLayout gap={0.75} fillX>
            <img className={cx("frame-image")} src="/img/enter/01.png" />
            <Divider />
            <TextBox align={"center"}>
              {[
                "<서라벌전경 2123>은 건축가, 도시 계획가, 정치가뿐만 아니라 모든 시민들이 서울 100년 마스터플랜에 동참하도록 돕는 오픈소스 프로그램입니다.",
              ]}
            </TextBox>
            <Divider />
            <TextBox align={"center"}>
              {[
                "🌍⛰🌳🌱",
                "당신은 서울의 어떤 미래를 꿈꾸시나요 ?",
                "서울을 친환경 고밀도시로 만들어 보아요!",
              ]}
            </TextBox>
            <Divider opaque />
          </AutoLayout>
        </div>
        <Button type="emph_white" link_to={"/introduction/1"}>
          PLAY
        </Button>
      </AutoLayout>
    </div>
  );
};

export default EnterPageOld;
