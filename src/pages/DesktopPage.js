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
import { _transformScroll } from "../util/alias";
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

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const DesktopPage = ({ match }) => {
  // unclicked, region, position
  const [clicked_state, setClickedState] = useState("unclicked");
  const [open_nav_sheet, setOpenNavSheet] = useState(false);
  const [open_nav_overlay, setOpenNavOverlay] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const search_field = useRef();
  const [is_small_window, setIsSmallWindow] = useState(true);

  useEffect(() => {
    if (global_data.error) {
      setTimeout(
        () => setGlobalVar({ open_overlay: true, popup_type: "error" }),
        0
      );
    }
  }, [global_data.error]);

  useLayoutEffect(() => {
    if (window.innerWidth > 640) {
      setIsSmallWindow(false);
    } else {
      setGlobalData({ error: "too_small_window" });
    }
  }, []);

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

  return (
    <>
      <div className={cx("wrapper")}>{!is_small_window && <DesktopMap />}</div>
      <div className={cx("header")}>
        <AutoLayout type="row" padding={0.5} fillX>
          <TextBox type={"title"} black>
            {["Seoul Biennale of Architecture and Urbanism 2023"]}
          </TextBox>
          <AutoLayout type="row">
            <AutoLayout type="row" gap={0} attach={"center"}>
              <Button type="default" hug>
                <div className={cx("frame-btn", "left")}>KR</div>
              </Button>
              <div className={cx("text-center")}>|</div>
              <Button type="default" hug>
                <div className={cx("frame-btn", "right")}>EN</div>
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
        </AutoLayout>
      </div>
      <div className={cx("footer")}>
        <AutoLayout type="row" fill>
          <div className={cx("frame-type")}>
            <TextBox type={"title"} black align="center">
              {["TYPE C"]}
            </TextBox>
          </div>
          <div className={cx("divider")}></div>
          <TextBox type={"title"} black align="center">
            {["< SEOUL PANORAMA 2123 >"]}
          </TextBox>
          <div className={cx("divider")}></div>
          <div className={cx("frame-search")}>
            <AutoLayout type="row" fill>
              <Search ref={search_field}></Search>
              <Button
                type="emph"
                onClick={() => {
                  search_field.current?.onForceSearch();
                }}
              >
                검색하기
              </Button>
            </AutoLayout>
          </div>
        </AutoLayout>
      </div>
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
              >
                <TextBox type="sentence" align="center" black>
                  {[
                    "서울도시건축비엔날레 2023",
                    "서울 100년 마스터플랜전",
                    "",
                    "< 서라벌전경 2123  (徐羅伐全景 二千百二十三) >",
                  ]}
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
                  {"<서라벌전경 2123> 작품 설명서"}
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
                  웹 프로그램 설명서
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
                  TYPE C: 다층화 녹화 언덕 도시 / 건축
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
                  웹 프로그램 링크
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
                  오픈소스 다운로드
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
                  TYPE C 대표팀 참여작가 소개
                </Button>
              </NavSheet>
            </div>
          </Animation>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesktopPage;
