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
import styles from "./DesktopPage.module.scss";
import { _API_URL, _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import Header from "../component/Header";
import TextBox from "../component/TextBox";
import Slider from "../component/Slider";
import ImageCard from "../component/ImageCard";
import Button from "../component/Button";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../component/TextInput";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import EntireMap from "../component/EntireMap";
import Icon from "../component/Icon";
import Divider from "../component/Divider";
import Search from "../component/Search";
import DesignMap from "../component/DesignMap";
import DesktopMap from "../component/DesktopMap";
import NavSheet from "../component/NavSheet";
import useGlobalVar from "../hooks/useGlobalVar";
import PopupCardScenario from "../component/PopupCardScenario";
import useGlobalData from "../hooks/useGlobalData";
import CustomImage from "../component/CustomImage";
import { useEffectAfterFirst } from "../hooks/useEffectAfterSecond";
import axios from "axios";
import DesktopPopupCardScenario from "../component/DesktopPopupCardScenario";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const DesktopPage = ({ match, for_exhibition }) => {
  // unclicked, region, position
  const [clicked_state, setClickedState] = useState("unclicked");
  const [open_nav_sheet, setOpenNavSheet] = useState(false);
  const [open_nav_overlay, setOpenNavOverlay] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const search_field = useRef();
  const [is_small_window, setIsSmallWindow] = useState(true);
  const [nav_popup_type, setNavPopupType] = useState("default");

  useEffect(() => {
    if (global_data.error) {
      setTimeout(
        () => setGlobalVar({ open_overlay: true, popup_type: "error" }),
        0
      );
    }
  }, [global_data.error]);

  useEffect(() => {
    setGlobalVar({
      open_overlay: false,
      popup_type: "",
      clicked_state: "unzoom",
    });
  }, []);

  useEffect(() => {
    console.log(global_data.ranked_user_names);
  }, [global_data.ranked_user_names]);

  useEffect(() => {
    const getData = () => {
      axios.get(_API_URL + "score").then((res) => {
        if (res?.data?.l?.mean) {
          setGlobalData({ score_graph_data: res.data });
        }
      });
      axios.get(_API_URL + "ranked_user_names").then((res) => {
        if (res?.data?.length > 0) {
          setGlobalData({ ranked_user_names: res.data });
        }
      });
    };
    getData();
    const id = setInterval(() => {
      getData();
    }, 15000);
    return () => {
      clearInterval(id);
    };
  }, []);

  useLayoutEffect(() => {
    if (window.innerWidth > 640) {
      setIsSmallWindow(false);
    } else {
      // setGlobalData({ error: "too_small_window" });
    }
  }, [window.innerWidth]);

  useEffect(() => {
    setTimeout(() => {
      document.body.style.backgroundColor = "#EDEDED";
      document.body.style.position = "fixed";
    }, 10);
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.position = null;
    };
  }, []);

  const compass = useRef();
  const ruler = useRef();
  const desktop_popup = useRef();

  return (
    <>
      <div className={cx("wrapper")} style={{ zIndex: 0 }}>
        <DesktopMap
          clicked_state={clicked_state}
          setClickedState={setClickedState}
          is_small_window={is_small_window}
          compass={compass}
          ruler={ruler}
        />
      </div>
      <div className={cx("header")}>
        <AutoLayout
          type="row"
          padding={0.5}
          align={is_small_window ? "left" : "center"}
          attach="space"
          fillX
        >
          <Button
            type="default"
            onClick={
              for_exhibition
                ? () => {}
                : () => {
                    window.open(
                      "https://www.seoulbiennale.org/",
                      "https://www.seoulbiennale.org/"
                    );
                  }
            }
          >
            <TextBox
              type={"title"}
              black={!is_small_window}
              white={is_small_window}
            >
              {is_small_window
                ? [
                    "Seoul",
                    "Biennale of",
                    "Architecture",
                    "and",
                    "Urbanism",
                    "2023",
                    "<<",
                  ]
                : ["Seoul Biennale of Architecture and Urbanism 2023"]}
            </TextBox>
          </Button>
          {!is_small_window && (
            <AutoLayout type="row">
              <AutoLayout type="row" gap={0} attach={"center"}>
                <Button type="default" hug>
                  <div
                    className={cx("frame-btn", "left")}
                    onClick={() => {
                      setGlobalVar({ use_eng: false });
                    }}
                  >
                    KR
                  </div>
                </Button>
                <div className={cx("text-center")}>|</div>
                <Button type="default" hug>
                  <div
                    className={cx("frame-btn", "right")}
                    onClick={() => {
                      setGlobalVar({ use_eng: true });
                    }}
                  >
                    EN
                  </div>
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
          )}
        </AutoLayout>
      </div>
      <div className={cx("footer")}>
        {!is_small_window ? (
          <AutoLayout fill align="right" gap={0}>
            <AutoLayout
              type="row"
              fill
              attach={clicked_state === "zoomed" ? "space" : "end"}
              align="right"
              gap={0}
              padding={0.75}
            >
              {clicked_state === "zoomed" && (
                <Button
                  type="default"
                  onClick={() => {
                    setClickedState("unclicked");
                    setGlobalVar({
                      send_force_click: false,
                      send_force_load: false,
                    });
                  }}
                  hug
                >
                  <TextBox type="section" white>
                    {[global_var.use_eng ? "<< Back" : "<< 뒤로 가기"]}
                  </TextBox>
                </Button>
              )}
              <AutoLayout align="right" gap={0.25}>
                <div className={cx("compass")} ref={compass}>
                  <TextBox type={"title"} white>
                    {["→"]}
                  </TextBox>
                </div>
                <AutoLayout align="right" gap={0.3}>
                  <div className={cx("ruler-text")} ref={ruler}>
                    300m
                  </div>
                  <div className={cx("ruler-bar")}></div>
                </AutoLayout>
              </AutoLayout>
            </AutoLayout>
            <div className={cx("frame-footer")}>
              <AutoLayout type="row" fill>
                <div className={cx("frame-type")}>
                  <TextBox type={"title"} black align="center">
                    {["TYPE C"]}
                  </TextBox>
                </div>
                <div className={cx("divider")}></div>
                <TextBox type={"section"} black align="center">
                  {["< SEOUL PANORAMA 2123 >"]}
                </TextBox>
                <div className={cx("divider")}></div>
                <div className={cx("frame-search")}>
                  <AutoLayout type="row" fill>
                    <Search
                      ref={search_field}
                      onClick={(event) => {
                        console.log(global_data.ranked_user_names);
                        search_field.current.updateValue(event);
                        if (global_data.ranked_user_names.includes(event)) {
                          setGlobalVar({
                            send_force_click: event,
                            send_force_load: false,
                          });
                        } else {
                          setGlobalVar({
                            send_force_load: event,
                            send_force_click: false,
                          });
                        }
                      }}
                    ></Search>
                    <Button
                      type="emph"
                      onClick={() => {
                        search_field.current?.onForceSearch();
                      }}
                    >
                      {global_var.use_eng ? ["Search"] : ["검색하기"]}
                    </Button>
                  </AutoLayout>
                </div>
              </AutoLayout>
            </div>
          </AutoLayout>
        ) : (
          <AutoLayout attach="end" align="right" fill padding={0.5}>
            <AutoLayout type="column" fill attach="end" align="right" gap={1}>
              {clicked_state === "zoomed" && (
                <Button
                  type="default"
                  onClick={() => {
                    setClickedState("unclicked");
                    setGlobalVar({
                      send_force_click: false,
                      send_force_load: false,
                    });
                  }}
                  hug
                >
                  <TextBox type="section" white>
                    {[global_var.use_eng ? "<< Back" : "<< 뒤로가기"]}
                  </TextBox>
                </Button>
              )}
              <AutoLayout align="right" gap={0.25}>
                <div className={cx("compass")} ref={compass}>
                  <TextBox type={"title"} white>
                    {["→"]}
                  </TextBox>
                </div>
                <AutoLayout align="right" gap={0.3}>
                  <div className={cx("ruler-text")} ref={ruler}>
                    300m
                  </div>
                  <div className={cx("ruler-bar")}></div>
                </AutoLayout>
              </AutoLayout>
            </AutoLayout>
            <Button
              type="default"
              onClick={() => {
                window.open(
                  "https://seoulpanorama2123.com/",
                  "https://seoulpanorama2123.com/"
                );
              }}
            >
              <TextBox type={"title"} align="right" white>
                {[">> SEOUL PANORAMA 2123"]}
              </TextBox>
            </Button>
          </AutoLayout>
        )}
      </div>
      <AnimatePresence>
        {global_var.open_overlay && global_var.popup_type === "error" && (
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
            <div
              className={cx("frame-overlay")}
              onClick={() => {
                setTimeout(() => setOpenNavOverlay(false), 0);
                setOpenNavSheet(false);
              }}
            ></div>
          </Animation>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open_nav_sheet && (
          <Animation
            key="nav_sheet"
            type="slide_left_35"
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
                ref={desktop_popup}
                fillX
              >
                <DesktopPopupCardScenario
                  type={nav_popup_type}
                  setType={(type) => {
                    setNavPopupType(type);
                  }}
                  onClick={{
                    Close: () => {
                      setTimeout(() => setOpenNavOverlay(false), 0);
                      setOpenNavSheet(false);
                    },
                    Back: () => {
                      setNavPopupType("default");
                      desktop_popup.current.scrollTop = 0;
                      // console.log(desktop_popup);
                    },
                  }}
                  for_exhibition={for_exhibition}
                />
              </NavSheet>
            </div>
          </Animation>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {global_var.loading_state && (
          <Animation type="fade" useExit absolute>
            <div className={cx("frame-overlay")}>
              <TextBox
                align="center"
                type={is_small_window ? "section" : "title"}
                white
              >
                {[
                  global_var.loading_state === "downloading"
                    ? global_var.use_eng
                      ? "loading 3D Models..."
                      : "모델링 불러오는 중..."
                    : "",
                ]}
              </TextBox>
            </div>
          </Animation>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesktopPage;
