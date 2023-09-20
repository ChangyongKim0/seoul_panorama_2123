import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./IntroductionPage2.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import TitleBox from "../component/TitleBox";
import Button from "../component/Button";
import Divider from "../component/Divider";
import Icon from "../component/Icon";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import PopupCardScenario from "../component/PopupCardScenario";
import useGlobalVar from "../hooks/useGlobalVar";
import CustomImage from "../component/CustomImage";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const IntroductionPage2 = ({ match }) => {
  const [open_overlay, setOpenOverlay] = useState(false);
  const [open_popup, setOpenPopup] = useState(false);
  const [popup_type, setPopupType] = useState("download_0");
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
        <TitleBox
          title="[TOOLS FOR EVERYONE]"
          subtitle="모두를 위한 도구 🔧"
          top
        />
      </div>
      <div className={cx("wrapper")}>
        <AutoLayout type="column" gap={0.75} align="center" fillX padding={1}>
          <div className={cx("frame-top")}></div>
          <div className={cx("frame-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/introduction/02.gif"
                  width={480}
                  height={270}
                />
              </div>
          <TextBox align={"center"}>
            {global_var.use_eng
              ? [
                  "We had the ability to create a city where nature, technology, and urban life could coexist in harmony.",
                  " ",
                  "What did we overlook?",
                  " ",
                  "What if our ancestors had the tools to prevent Seoul from becoming what it is today...? Could things have been different?",
                ]
              : [
                  "분명히 우리는 자연, 기술, 그리고 도시가 조화를 이루는 도시를 만들 수 있는 능력이 있었을 텐데...",
                  " ",
                  "대체 무엇이 부족했던 것일까...",
                  " ",
                  "우리의 선조들에게 서울을 변화시킬 도구가 있었더라면... 상황은 달랐을까?",
                ]}
          </TextBox>
          <Divider />
          <TextBox align={"center"}>
            {global_var.use_eng
              ? [
                  "[Anonymous architect in 2123] sent <Seoul Panorama 2123> to [Citizens of Seoul in 2023]!",
                ]
              : [
                  "2123년의 익명의 건축가]가 [2023년의 서울시민]에게 <서라벌전경 2123>을 전송했습니다!",
                ]}
          </TextBox>
          <Divider />
          <Button
            type="download"
            onClick={() => {
              setOpenOverlay(true);
            }}
          >
            {global_var.use_eng ? "DOWNLOAD" : "DOWNLOAD"}
          </Button>
          <div className={cx("frame-bottom")}></div>
        </AutoLayout>
      </div>

      <div className={cx("frame-button")}>
        <AutoLayout type="row" fillX attach={"space"} padding={1}>
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
        </AutoLayout>
      </div>
      <AnimatePresence>
        {open_overlay && (
          <Animation type="fade" useExit absolute zIndex={1}>
            <div className={cx("frame-overlay")}>
              <PopupCardScenario
                type={popup_type}
                setType={setPopupType}
                onClick={{
                  Close: () => {
                    setTimeout(() => setOpenOverlay(false), 0);
                    setOpenPopup(false);
                  },
                }}
              />
            </div>
          </Animation>
        )}
      </AnimatePresence>
    </>
  );
};

export default IntroductionPage2;
