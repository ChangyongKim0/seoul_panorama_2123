import React, { useEffect, useReducer, useState, useRef } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./DesignPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import Button from "../component/Button";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import ChartBar from "../component/ChartBar";
import PopupCardScenario from "../component/PopupCardScenario";
import NavSheet from "../component/NavSheet";
import Icon from "../component/Icon";
import DesignMap from "../component/DesignMap";
import useGlobalData from "../hooks/useGlobalData";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const DesignPage = ({ match }) => {
  const image_card_list = [
    { title: "A", subtitle: "어떤 데이터센터", image_url: "" },
    { title: "B", subtitle: "또 다른 데이터센터", image_url: "" },
    { title: "C", subtitle: "설명", image_url: "" },
    { title: "D", subtitle: "설명", image_url: "" },
    { title: "I", subtitle: "설명", image_url: "" },
  ];
  const [scrollable, setScrollable] = useState(false);

  const next_section = useRef();
  const [map_clicked, setMapClicked] = useState(false);

  const overlay = useRef();
  const [open_overlay, setOpenOverlay] = useState(false);
  const [open_nav_overlay, setOpenNavOverlay] = useState(false);
  const [open_nav_sheet, setOpenNavSheet] = useState(false);
  const [popup_type, setPopupType] = useState("illust_0");
  const [developed, setDeveloped] = useState(false);
  const [global_data, setGlobalData] = useGlobalData();

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

  useEffect(() => {
    alert("message");
    const blockTouchStart = (e) => {
      if (e.touches[0].pageX > 20) return;
      console.log(e.touches[0].pageX);
      e.preventDefault();
    };
    const onGoBackward = () => {
      alert("message");
    };
    window.addEventListener("popstate", onGoBackward);
    window.addEventListener("touchstart", blockTouchStart);
    return () => {
      window.removeEventListener("popstate", onGoBackward);
      window.removeEventListener("touchstart", blockTouchStart);
    };
  }, []);

  useEffect(() => {
    if (scrollable) {
      next_section.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollable]);

  useEffect(() => {
    setTimeout(() => {
      setOpenOverlay(true);
    }, 600);
  }, []);

  return (
    <div className={cx("wrapper")}>
      <AutoLayout type="column" gap={0} fill>
        <div
          className={cx("frame-map")}
          onClick={() => {
            setMapClicked(true);
          }}
        >
          <DesignMap />
        </div>
        <div className={cx("frame-content")}>
          <AutoLayout type="column" attach="space" padding={0} fill>
            <AutoLayout type="column" padding={1} gap={2} align="right" fillX>
              <Button
                type="default"
                hug
                onClick={() => {
                  setOpenNavSheet(true);
                  setOpenNavOverlay(true);
                }}
              >
                <Icon type="menu" fill size={3} />
              </Button>

              <AutoLayout type="column" gap={1} align="right" fillX>
                <Button
                  type="default"
                  hug
                  onClick={() => {
                    setDeveloped((e) => !e);
                  }}
                >
                  <div
                    className={cx(
                      "frame-icon",
                      developed ? "emph" : "",
                      global_data.clicked_meshs?.length > 0 ? "show" : "hide"
                    )}
                  >
                    <Icon
                      type={developed ? "undevelop" : "develop"}
                      fill
                      size={3}
                    />
                  </div>
                </Button>
                <Button
                  type="default"
                  hug
                  onClick={() => {
                    setTimeout(() => {
                      setOpenOverlay(true);
                    }, 0);
                    setPopupType("build");
                  }}
                >
                  <div
                    className={cx(
                      "frame-icon",
                      global_data.clicked_meshs?.length > 0 ? "show" : "hide"
                    )}
                  >
                    <Icon type="build" fill size={3} />
                  </div>
                </Button>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
              type="row"
              gap={1}
              fillX
              onClick={(e) => {
                setTimeout(() => {
                  setOpenOverlay(true);
                }, 0);
                setPopupType("score");
              }}
              recoverClick
              // absolute
            >
              <div className={cx("frame-chart-button")}>
                <Button type="default" hug>
                  <ChartBar
                    type="normal"
                    title_left="디자인 점수"
                    title_right="10%"
                    percent={0.1}
                    border
                  />
                </Button>
              </div>
            </AutoLayout>
          </AutoLayout>
        </div>
      </AutoLayout>
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
                  },
                }}
              />
            </div>
          </Animation>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open_nav_overlay && (
          <Animation type="fade" useExit absolute>
            <div className={cx("frame-overlay")}></div>
          </Animation>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open_nav_sheet && (
          <Animation
            key="nav_sheet"
            type="slide_left"
            delay={0}
            useExit
            absolute
          >
            <div className={cx("frame-nav-sheet")}>
              <NavSheet
                onClick={{
                  Fold: () => {
                    setTimeout(() => setOpenNavOverlay(false), 0);
                    setOpenNavSheet(false);
                  },
                }}
              >
                <TextBox type="sentence" align="center" black>
                  {["서울도시건축비엔날레 2023", "<서벌전경 2123>"]}
                </TextBox>

                <img src="/img/design/01.png" className={cx("frame-image")} />

                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setPopupType("caution_exit");
                    }, 0);
                    setTimeout(() => {
                      setOpenOverlay(true);
                    }, 600);
                    setOpenNavSheet(false);
                    setOpenNavOverlay(false);
                  }}
                  type="emph"
                >
                  위치 재선정!
                </Button>
                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setPopupType("illust_0");
                    }, 0);
                    setTimeout(() => {
                      setOpenOverlay(true);
                    }, 600);
                    setOpenNavSheet(false);
                    setOpenNavOverlay(false);
                  }}
                >
                  프로그램 사용 설명서
                </Button>
                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setPopupType("logic");
                    }, 0);
                    setTimeout(() => {
                      setOpenOverlay(true);
                    }, 600);
                    setOpenNavSheet(false);
                    setOpenNavOverlay(false);
                  }}
                >
                  디자인 원리가 궁금해요!
                </Button>
                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setPopupType("score");
                    }, 0);
                    setTimeout(() => {
                      setOpenOverlay(true);
                    }, 600);
                    setOpenNavSheet(false);
                    setOpenNavOverlay(false);
                  }}
                >
                  디자인 점수란?
                </Button>
                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setPopupType("credit");
                    }, 0);
                    setTimeout(() => {
                      setOpenOverlay(true);
                    }, 600);
                    setOpenNavSheet(false);
                    setOpenNavOverlay(false);
                  }}
                >
                  크레딧
                </Button>
                <Button link_to="/">처음 화면으로</Button>
              </NavSheet>
            </div>
          </Animation>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignPage;
