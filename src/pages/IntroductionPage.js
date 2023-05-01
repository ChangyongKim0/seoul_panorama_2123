import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./IntroductionPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import TitleBox from "../component/TitleBox";
import Button from "../component/Button";
import Divider from "../component/Divider";
import Icon from "../component/Icon";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const IntroductionPage = ({ match }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      document.body.style.backgroundColor = "#000000";
      document.body.style.position = "fixed";
    }, 10);
    return () => {
      document.body.style.position = null;
      document.body.style.backgroundColor = null;
    };
  }, []);
  return (
    <div className={cx("wrapper")}>
      <AutoLayout type="column" gap={0.75} align="center" fill padding={1}>
        <TitleBox title="[POST-ANTHROPOCENE] " subtitle="후기인류세 🤖" top />
        <div className={cx("frame-scroll")}>
          <AutoLayout gap={0.75} fillX>
            <img className={cx("frame-image")} src="/img/introduction/01.png" />
            <TextBox align={"center"}>
              {[
                "때는 2123년 서울...",
                "",
                "[후기-인류세] 라고 불리는 이 시대는 기술과 인공지능을 통해 세계를 자동화하는 건축유형들이 범람하는 시대이다.",
                " ",
                "서울의 산과 강, 바람의 흐름... 자연이 무분별하게 파괴된 지금은 더 이상 찾아볼 수 없게 되었다.",
                " ",
                "지금부터 100년전,",
                " ",
                "2023년의 서울의 자연을 연결하는 그린 네트워크 마스터플랜이 실현됐더라면...",
                " ",
                "만약 도시계획 과정에 시민 모두가 참여할 수 있었더라면 진정으로 우리가 원하는 도시를 만들 수 있었을 것이다...",
              ]}
            </TextBox>
            <Divider opaque /> <Divider opaque /> <Divider opaque />
          </AutoLayout>
        </div>
      </AutoLayout>
      <div className={cx("frame-button")}>
        <AutoLayout type="row" fillX attach={"space"} padding={1} preventClick>
          <Button
            type="default"
            hug
            onClick={() => {
              navigate(-1);
            }}
          >
            <div className={cx("frame-btn")}>
              <Icon type="back" fill stroke="#ffffff" />
            </div>
          </Button>
          <Button type="default" hug link_to={"/introduction/2"}>
            <div className={cx("frame-btn", "flip")}>
              <Icon type="back" fill stroke="#ffffff" />
            </div>
          </Button>
        </AutoLayout>
      </div>
    </div>
  );
};

export default IntroductionPage;
