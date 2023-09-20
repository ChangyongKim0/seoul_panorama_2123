import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./DesignPage.module.scss";
import {
  _API_URL,
  _getDevelopedPiljiNumber,
  _getReducedScore,
  _getThousandSepStrFromNumber,
  _transformScroll,
  getGuid,
} from "../util/alias";
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
import CustomImage from "../component/CustomImage";
import axios from "axios";
import { useEffectAfterFirst } from "../hooks/useEffectAfterSecond";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const DesignPage = ({ match }) => {
  const image_card_list = [
    { title: "A", subtitle: "분지를 점령한 데이터 센터", image_url: "" },
    { title: "B", subtitle: "나무를 대체한 태양광 패널", image_url: "" },
    { title: "C", subtitle: "산의 지하를 파고드는 데이터 센터", image_url: "" },
    {
      title: "D",
      subtitle: "기후조절이 가능한 대규모 온실도시",
      image_url: "",
    },
    { title: "I", subtitle: "깊은 산 속의 대규모 변전시설", image_url: "" },
  ];
  const [scrollable, setScrollable] = useState(false);
  const [show_map, setShowMap] = useState(false);

  const next_section = useRef();
  const [map_clicked, setMapClicked] = useState(false);

  const overlay = useRef();
  const [open_nav_overlay, setOpenNavOverlay] = useState(false);
  const [open_nav_sheet, setOpenNavSheet] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const [global_data, setGlobalData] = useGlobalData();
  const [global_var, setGlobalVar] = useGlobalVar();

  useLayoutEffect(() => {
    if (!global_var.refreshed) {
      console.log("good");
      if (
        global_var.need_to_change_design_data
        // global_data.bldg_state === undefined
      ) {
        setGlobalData({ bldg_state: {} });
        // setGlobalVar({ bldg_state_loaded: false });
      }
      setGlobalVar({ SCORE_FACTOR: 0.4 });
      axios.get(_API_URL + "score").then((res) => {
        setGlobalData({ score_graph_data: res.data });
      });
    }
  }, [global_var.refreshed]);

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
    if (!global_var.refreshed) {
      if (!global_var.user_name) {
        setGlobalData({ error: "no_registered_name" });
      } else if (!global_var.region_no) {
        setGlobalData({ error: "no_selected_region" });
      } else if (!global_var.visited_design_page) {
        setGlobalVar({ popup_type: "illust_0" });
        setTimeout(() => {
          setGlobalVar({ open_overlay: true });
        }, 600);
      } else {
        setGlobalData({ error: "welcome_to_revisit" });
      }
    }
  }, [global_var.refreshed, global_var.user_name, global_var.region_no]);

  useEffectAfterFirst(() => {
    console.log("checked");
    if (global_data.error) {
      setTimeout(
        () => setGlobalVar({ open_overlay: true, popup_type: "error" }),
        0
      );
    }
  }, [global_data.error]);

  useEffectAfterFirst(() => {
    if (global_var.found_easter_egg) {
      axios
        .put(_API_URL + "easter_egg", { name: global_var.user_name })
        .then((res) => {
          console.log(res);
          if (res.data?.state === "success") {
            setTimeout(() => {
              setGlobalVar({ open_overlay: true });
            }, 0);
            setGlobalVar({ popup_type: "illust_easter_egg" });
          }
        });
    }
  }, [global_var.found_easter_egg]);

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
    } else if (global_data.curr_action?.type) {
      if (
        global_data.curr_action.type === "develop" &&
        _getDevelopedPiljiNumber(global_data.bldg_state) >= 20
      ) {
        setGlobalData({ error: "maximum_developing_number_exceeded" });
      } else {
        setGlobalData(reduceBackgroundAndBldgState);
      }
      setTimeout(() => {
        setGlobalData({ curr_action: {} });
      }, 0);
    }
  }, [global_data.curr_action]);

  const [perf, setPerf] = useState("");

  // useEffect(() => {
  //   const interval_id = setInterval(() => {
  //     setPerf(
  //       JSON.stringify({
  //         Limit:
  //           Math.round(window.performance.memory?.jsHeapSizeLimit / 1000000) +
  //           "MB",
  //         total:
  //           Math.round(window.performance.memory?.totalJSHeapSize / 1000000) +
  //           "MB",
  //         used:
  //           Math.round(window.performance.memory?.usedJSHeapSize / 1000000) +
  //           "MB",
  //         "usd/tot":
  //           Math.round(
  //             (window.performance.memory?.usedJSHeapSize /
  //               window.performance.memory?.totalJSHeapSize) *
  //               1000
  //           ) /
  //             10 +
  //           "%",
  //       })
  //     );
  //   }, 100);
  //   return () => {
  //     clearInterval(interval_id);
  //   };
  // }, []);

  useEffect(() => {
    // console.log(show_map, global_data, global_var);
    if (!show_map && global_data.grids && global_var.region_no) {
      setShowMap(true);
    }
  }, [show_map, global_data.grids, global_var.region_no]);

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
          {show_map && <DesignMap />}
        </div>
        <div className={cx("frame-content")}>
          <AutoLayout type="column" attach="space" padding={0} fill>
            <AutoLayout
              type="row"
              padding={1}
              gap={2}
              attach="space"
              align="left"
              fillX
            >
              <AutoLayout gap={1} align="left">
                {global_var.found_easter_egg && (
                  <Button
                    type="default"
                    hug
                    onClick={() => {
                      setTimeout(() => {
                        setGlobalVar({ open_overlay: true });
                      }, 0);
                      setGlobalVar({ popup_type: "illust_easter_egg" });
                    }}
                  >
                    <TextBox align="left" type="sentence" white>
                      {global_var.use_eng
                        ? [">>Animal Protector!<<"]
                        : [">>당신은 명예 동물보호사!<<"]}
                    </TextBox>
                  </Button>
                )}
                <Button
                  type="default"
                  hug
                  onClick={() => {
                    setTimeout(() => {
                      setGlobalVar({ open_overlay: true });
                    }, 0);
                    setGlobalVar({ popup_type: "illust_region" });
                  }}
                >
                  <TextBox align="left" type="sentence" white>
                    {global_var.use_eng
                      ? [
                          `[REGION. NO. ${global_data.this_region_data?.name}]`,
                          `${global_data.this_region_data?.elevation.eng} + ${global_data.this_region_data?.direction.eng}`,
                          global_data.this_region_data?.factor.eng,
                        ]
                      : [
                          `[제 ${global_data.this_region_data?.name}구역]`,
                          `${global_data.this_region_data?.elevation.kor} + ${global_data.this_region_data?.direction.kor}`,
                          global_data.this_region_data?.factor.kor,
                        ]}
                  </TextBox>
                </Button>
              </AutoLayout>
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
              <AutoLayout gap={0} fillX>
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
                        type={
                          _getReducedScore(
                            global_data.masterplan_score?.tot_converted || 0,
                            global_data.bldg_state
                          ) > global_var.SCORE_FACTOR
                            ? "emph"
                            : "normal"
                        }
                        title_left={
                          _getReducedScore(
                            global_data.masterplan_score?.tot_converted || 0,
                            global_data.bldg_state
                          ) > global_var.SCORE_FACTOR
                            ? global_var.use_eng
                              ? "High score! Upload!"
                              : "최소점수 달성! 업로드!"
                            : global_var.use_eng
                            ? "Total Design Score"
                            : "종합 디자인점수"
                        }
                        title_right={
                          _getThousandSepStrFromNumber(
                            Math.round(
                              _getReducedScore(
                                global_data.masterplan_score?.tot_converted *
                                  10000 || 0,
                                global_data.bldg_state
                              )
                            )
                          ) + [global_var.use_eng ? "pts" : "점"]
                        }
                        percent={_getReducedScore(
                          global_data.masterplan_score?.tot_converted || 0.001,
                          global_data.bldg_state
                        )}
                        border
                        fill_window
                      />
                    </Button>
                  </div>
                </AutoLayout>
                {global_var.design_finished && (
                  <div className={cx("frame-button-last")}>
                    <Button
                      onClick={() => {
                        const timeout_id = setTimeout(() => {
                          setGlobalVar({
                            open_overlay: true,
                            popup_type:
                              "link_copied_so_visit_linktree_noclipboard",
                          });
                        }, 500);
                        window.navigator.clipboard
                          .writeText("https://seoulpanorama2123.com")
                          .then(() => {
                            clearTimeout(timeout_id);
                            setTimeout(() => {
                              setGlobalVar({
                                open_overlay: true,
                                popup_type: "link_copied_so_visit_linktree",
                              });
                            }, 1000);
                          });
                      }}
                    >
                      {global_var.use_eng
                        ? "To The Final Page.."
                        : "마지막 단계로.."}
                    </Button>
                  </div>
                )}
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </div>
      </AutoLayout>
      <AnimatePresence>
        {(global_var.loading_state || global_var.data_state) && (
          <Animation type="fade" useExit absolute>
            <div className={cx("frame-overlay")}>
              <TextBox align="center" type="sentence" white>
                {[
                  global_var.loading_state === "use_svgNest"
                    ? global_var.use_eng
                      ? "placing facilities..."
                      : "배치하는 중..."
                    : global_var.loading_state === "building"
                    ? global_var.use_eng
                      ? "loading 3D Models..."
                      : "모델링 불러오는 중..."
                    : global_var.loading_state === "upload_info"
                    ? global_var.use_eng
                      ? "loading region data..."
                      : "구역 정보 업로드 중..."
                    : global_var.loading_state === "upload_data"
                    ? global_var.use_eng
                      ? "uploading design data..."
                      : "디자인 정보 업로드 중..."
                    : global_var.loading_state === "upload_silhouette"
                    ? global_var.use_eng
                      ? "uploading designed areas..."
                      : "디자인 영역 경계 업로드 중..."
                    : global_var.loading_state === "upload_modeling"
                    ? global_var.use_eng
                      ? "uploading 3D Models..."
                      : "모델링 업로드 중..."
                    : global_var.loading_state === "upload_score"
                    ? global_var.use_eng
                      ? "uploading Scores...."
                      : "디자인 점수 업로드 중..."
                    : global_var.data_state === "background_relation"
                    ? global_var.use_eng
                      ? "downloading data...."
                      : "데이터 다운로드 중..."
                    : "",
                ]}
              </TextBox>
            </div>
          </Animation>
        )}
      </AnimatePresence>
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
                  {global_var.use_eng
                    ? ["SBAU 2023", "<Seoul Panorama 2123>"]
                    : ["서울도시건축비엔날레 2023", "<서라벌전경 2123>"]}
                </TextBox>
                <div className={cx("frame-image")}>
                  <CustomImage
                    srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/design/01.png"
                    width={2480}
                    height={1966}
                  />
                </div>
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
                  {global_var.use_eng
                    ? ["Reselect a Region!"]
                    : ["위치 재선정!"]}
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
                  {global_var.use_eng
                    ? ["Program User Guide!"]
                    : ["프로그램 사용설명서"]}
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
                  {global_var.use_eng
                    ? ["Design Principles"]
                    : ["디자인 원리가 궁금해요!"]}
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
                  {global_var.use_eng
                    ? ["Scoring System"]
                    : ["점수 체계가 궁금해요!"]}
                </Button>

                <Button
                  onClick={() => {
                    window.open(
                      "https://seoulpanorama2123.com/masterplan",
                      "https://seoulpanorama2123.com/masterplan"
                    );
                  }}
                >
                  {global_var.use_eng
                    ? ["Mater Plan Page"]
                    : ["마스터플랜 보러가기"]}
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      "https://www.linktr.ee/sbau2023",
                      "https://www.linktr.ee/sbau2023"
                    );
                  }}
                >
                  {global_var.use_eng
                    ? ["Linktree Page"]
                    : ["링크트리 페이지 가기"]}
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
                  {global_var.use_eng ? ["Credits"] : ["크레딧"]}
                </Button>
                <Button
                  type="emph-secondary"
                  onClick={() => {
                    setGlobalData({ error: "warning_to_go_startpage" });
                    setOpenNavSheet(false);
                    setOpenNavOverlay(false);
                  }}
                >
                  {global_var.use_eng
                    ? ["Return to First Page"]
                    : ["처음 화면으로"]}
                </Button>
              </NavSheet>
            </div>
          </Animation>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignPage;
