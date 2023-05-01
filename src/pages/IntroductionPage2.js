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

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const IntroductionPage2 = ({ match }) => {
  const [open_overlay, setOpenOverlay] = useState(false);
  const [open_popup, setOpenPopup] = useState(false);
  const [popup_type, setPopupType] = useState("download_0");
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
        <TitleBox
          title="[TOOLS FOR EVERYONE]"
          subtitle="모두를 위한 도구 🔧"
          top
        />
        <div className={cx("frame-scroll")}>
          <AutoLayout gap={0.75} fillX>
            <img className={cx("frame-image")} src="/img/introduction/02.png" />
            <TextBox align={"center"}>
              {[
                "우리는 분명히 자연, 기술, 그리고 도시가 조화를 이루는 도시를 만들 수 있는 능력이 있었을텐데...",
                "",
                "대체 무엇이 부족했던 것일까..",
                " ",
                "우리들의 선조들에게 서울의 변화를 불러올 수 있는  도구가 있었더라면... 상황은 달랐을까?",
              ]}
            </TextBox>
            <Divider />
            <TextBox align={"center"}>
              {[
                "[2123년의 익명의 건축가]가 [2023년의 서울시민들]에게 <서벌전경 2123>을 전송했습니다!",
              ]}
            </TextBox>
            <Divider />
            <Button
              type="download"
              onClick={() => {
                setOpenOverlay(true);
              }}
            >
              DOWNLOAD
            </Button>
            <Divider opaque /> <Divider opaque /> <Divider opaque />
          </AutoLayout>
        </div>
      </AutoLayout>
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
          <Animation type="fade" useExit absolute>
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
    </div>
  );
};

export default IntroductionPage2;
