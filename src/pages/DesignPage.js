import React, { useEffect, useReducer, useState, useRef } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./DesignPage.module.scss";
import { _transformScroll, getGuid } from "../util/alias";
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
import useGlobalVar from "../hooks/useGlobalVar";
import reduceBackgroundAndBldgState from "../util/reduceBackgroundAndBldgState";
import { isConstructorDeclaration } from "typescript";
import { locateBldgsInPilji } from "../util/locateBldgsInPilji";
import { setGlobalDataOnClickBuild } from "../util/setGlobalDataOnClickBuild";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const DesignPage = ({ match }) => {
  const image_card_list = [
    { title: "A", subtitle: "분지를 점령한 데이터 센터", image_url: "" },
    { title: "B", subtitle: "나무를 대체한 태양광 패널", image_url: "" },
    { title: "C", subtitle: "산의 지하를 파고드는 데이터 센터", image_url: "" },
    { title: "D", subtitle: "기후조절이 가능한 대규모 온실도시", image_url: "" },
    { title: "I", subtitle: "깊은 산 속의 대규모 변전시설", image_url: "" },
  ];
  const [scrollable, setScrollable] = useState(false);

  const next_section = useRef();
  const [map_clicked, setMapClicked] = useState(false);

  const overlay = useRef();
  const [open_nav_overlay, setOpenNavOverlay] = useState(false);
  const [open_nav_sheet, setOpenNavSheet] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const [global_data, setGlobalData] = useGlobalData();
  const [global_var, setGlobalVar] = useGlobalVar();

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
    const blockTouchStart = (e) => {
      if (e.touches[0].pageX > 20) return;
      console.log(e.touches[0].pageX);
      e.preventDefault();
    };
    window.addEventListener("touchstart", blockTouchStart);
    return () => {
      window.removeEventListener("touchstart", blockTouchStart);
    };
  }, []);

  useEffect(() => {
    if (scrollable) {
      next_section.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollable]);

  useEffect(() => {
    setGlobalVar({ popup_type: "illust_0" });
    setTimeout(() => {
      setGlobalVar({ open_overlay: true });
    }, 600);
  }, []);

  useEffect(() => {
    if (global_data.error) {
      setTimeout(
        () => setGlobalVar({ open_overlay: true, popup_type: "error" }),
        0
      );
    }
  }, [global_data.error]);

  useEffect(() => {
    if (global_data.curr_action?.require_svgNest) {
      console.log(global_data.curr_action?.bldg_name);
      setGlobalVar({ loading_state: "use_svgNest" });
      const pilji_data_list = global_data.background_relation.terrain[
        global_data.curr_action.guid
      ].map((e) => global_data.background_relation.pilji[e]);
      locateBldgsInPilji(
        pilji_data_list[0]?.pilji_polygon,
        pilji_data_list[0]?.pilji_height,
        pilji_data_list[0]?.pilji_rotation,
        global_data.curr_action.bldg_name,
        (output) => {
          setGlobalVar({ loading_state: false });
          setGlobalData({
            curr_action: {
              ...global_data.curr_action,
              require_svgNest: false,
              svgNest_completed: true,
              output,
            },
          });
        }
      );
    } else {
      setGlobalData(reduceBackgroundAndBldgState);
    }
  }, [global_data.curr_action]);

  const [perf, setPerf] = useState("");

  useEffect(() => {
    const interval_id = setInterval(() => {
      setPerf(
        JSON.stringify({
          Limit:
            Math.round(window.performance.memory?.jsHeapSizeLimit / 1000000) +
            "MB",
          total:
            Math.round(window.performance.memory?.totalJSHeapSize / 1000000) +
            "MB",
          used:
            Math.round(window.performance.memory?.usedJSHeapSize / 1000000) +
            "MB",
          "usd/tot":
            Math.round(
              (window.performance.memory?.usedJSHeapSize /
                window.performance.memory?.totalJSHeapSize) *
                1000
            ) /
              10 +
            "%",
        })
      );
    }, 100);
    return () => {
      clearInterval(interval_id);
    };
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div style={{ fontSize: 8, fontStretch: "condensed" }}>{perf}</div>
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
            </AutoLayout>
            <AutoLayout type="column" gap={1} fillX>
              <AutoLayout
                type="column"
                gap={1.5}
                padding={1}
                align="right"
                fillX
              >
                <Button
                  type="default"
                  hug
                  onClick={() => {
                    setGlobalData({
                      curr_action: {
                        guid: global_data.clicked_guid,
                        type:
                          global_data.bldg_state?.[
                            global_data.clicked_guid
                          ]?.bldg_configuration?.filter(
                            (e) => e.overlapped?.length === 0
                          )?.length > 0
                            ? "unbuild"
                            : "undevelop",
                        bldg_type: "",
                        bldg_name: "",
                        bldg_model_type: "",
                        require_svgNest: false,
                      },
                    });
                  }}
                  disable={
                    global_data.loading_state
                      ? true
                      : (global_data.clicked_meshs?.length > 0 &&
                          global_data.bldg_state?.[global_data.clicked_guid]
                            ?.developed) ||
                        global_data.clicked_bldg_guids?.length > 0
                      ? false
                      : true
                  }
                >
                  <div
                    className={cx(
                      "frame-icon",
                      (global_data.clicked_meshs?.length > 0 &&
                        global_data.bldg_state?.[global_data.clicked_guid]
                          ?.developed) ||
                        global_data.clicked_bldg_guids?.length > 0
                        ? "show"
                        : "hide"
                    )}
                  >
                    <Icon
                      type={
                        global_data.bldg_state?.[
                          global_data.clicked_guid
                        ]?.bldg_configuration?.filter(
                          (e) => e.overlapped?.length === 0
                        )?.length > 0
                          ? "unbuild"
                          : "undevelop"
                      }
                      fill
                      size={3}
                    />
                  </div>
                </Button>
                <Button
                  type="default"
                  hug
                  onClick={() => {
                    if (
                      global_data.bldg_state?.[global_data.clicked_guid]
                        ?.developed
                    ) {
                      setTimeout(() => {
                        setGlobalVar({
                          popup_type: "build",
                          open_overlay: true,
                        });
                      }, 0);
                    } else if (global_data.clicked_guid) {
                      setGlobalData({
                        curr_action: {
                          guid: global_data.clicked_guid,
                          type: "develop",
                          bldg_type: "",
                          bldg_name: "",
                          bldg_model_type: "",
                          require_svgNest: false,
                        },
                      });
                    }
                    //
                    // else {
                    //   setTimeout(() => {
                    //     setGlobalVar({
                    //       popup_type: "build_only_big",
                    //       open_overlay: true,
                    //     });
                    //   }, 0);
                    // }
                  }}
                  disable={global_data.loading_state}
                >
                  <div
                    className={cx(
                      "frame-icon",
                      global_data.bldg_state?.[global_data.clicked_guid]
                        ?.developed
                        ? "emph"
                        : "",
                      global_data.clicked_guid === undefined ? "hide" : "show"
                    )}
                  >
                    <Icon
                      type={
                        global_data.bldg_state?.[global_data.clicked_guid]
                          ?.developed
                          ? "build"
                          : global_data.clicked_guid
                          ? "develop"
                          : "build"
                      }
                      fill
                      size={3}
                    />
                  </div>
                </Button>
              </AutoLayout>
              <AutoLayout
                type="column"
                gap={1}
                fillX
                onClick={(e) => {
                  setTimeout(() => {
                    setGlobalVar({ open_overlay: true });
                  }, 0);
                  setGlobalVar({ popup_type: "score" });
                }}
                recoverClick
                // absolute
              >
                <div className={cx("frame-chart-button")}>
                  <Button type="default" hug>
                    <ChartBar
                      type="normal"
                      title_left="디자인 점수"
                      title_right={
                        Math.round(
                          (global_data.masterplan_score?.tot_converted || 0.1) *
                            100
                        ) + "/100"
                      }
                      percent={
                        global_data.masterplan_score?.tot_converted || 0.1
                      }
                      border
                    />
                  </Button>
                </div>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </div>
      </AutoLayout>
      <AnimatePresence>
        {global_var.open_overlay && (
          <Animation type="fade" useExit absolute>
            <div className={cx("frame-overlay")}>
              <PopupCardScenario
                type={global_var.popup_type}
                setType={(type) => {
                  setGlobalVar({ popup_type: type });
                }}
                onClick={{
                  Close: () => {
                    setTimeout(() => setGlobalVar({ open_overlay: false }), 0);
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
                  {["서울도시건축비엔날레 2023", "<서라벌전경 2123>"]}
                </TextBox>

                <img src="/img/design/01.png" className={cx("frame-image")} />

                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setGlobalVar({ popup_type: "caution_exit" });
                    }, 0);
                    setTimeout(() => {
                      setGlobalVar({ open_overlay: true });
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
                      setGlobalVar({ popup_type: "illust_0" });
                    }, 0);
                    setTimeout(() => {
                      setGlobalVar({ open_overlay: true });
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
                      setGlobalVar({ popup_type: "logic" });
                    }, 0);
                    setTimeout(() => {
                      setGlobalVar({ open_overlay: true });
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
                      setGlobalVar({ popup_type: "score" });
                    }, 0);
                    setTimeout(() => {
                      setGlobalVar({ open_overlay: true });
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
                      setGlobalVar({ popup_type: "credit" });
                    }, 0);
                    setTimeout(() => {
                      setGlobalVar({ open_overlay: true });
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
