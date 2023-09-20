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
import useGlobalVar from "../hooks/useGlobalVar";
import CustomImage from "../component/CustomImage";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const IntroductionPage = ({ match }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
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
    <>
      <div className={cx("frame-header")}>
        <TitleBox title="[POST-ANTHROPOCENE] " subtitle="후기인류세 🤖" top />
      </div>
      <div className={cx("wrapper")}>
        <AutoLayout type="column" gap={0.75} align="center" fillX padding={1}>
          <div className={cx("frame-top")}></div>
          <div className={cx("frame-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/introduction/01.gif"
                  width={500}
                  height={373}
                />
              </div>
          <TextBox align={"center"}>
            {global_var.use_eng
              ? [
                  "Seoul, in the year of 2123…",
                  "",
                  "This era, known as the [Post-Anthropocenel], is dominated by architectural types automated by technology, and artificial intelligence.",
                  " ",
                  "Mountains, rivers, and gentle winds of Seoul... Due to reckless destruction of nature, these elements have become nearly extinct.",
                  " ",
                  "What if, back in 2023,",
                  "the master plan for a green network had been initiated...?",
                  " ",
                  "If all citizens had been able to participate in master planning process, perhaps we could have created the city that we truly desire…",
                ]
              : [
                  "때는 2123년 서울...",
                  "",
                  "[후기-인류세]라고 불리는 이 시대는 기술과 인공지능에 의해 자동화된 건축유형들이 범람하는 시대다.",
                  " ",
                  "서울의 푸른 산과 강, 바람의 흐름... 자연이 무분별하게 파괴된 지금은 더 이상 찾아볼 수 없는 개념들이다.",
                  " ",
                  "지금으로부터 100년 전...",
                  " ",
                  "2023년에 서울의 자연을 연결하는 그린 네트워크 마스터플랜이 실현됐더라면...?",
                  " ",
                  "만약 도시계획에 시민 모두가 참여할 수 있었더라면 진정 우리가 원하는 도시를 만들 수 있었을지도…",
                ]}
          </TextBox>
          <div className={cx("frame-bottom")}></div>
        </AutoLayout>
      </div>
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
    </>
  );
};

export default IntroductionPage;
