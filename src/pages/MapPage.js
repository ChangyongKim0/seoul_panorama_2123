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
import styles from "./MapPage.module.scss";
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
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import PopupCardScenario from "../component/PopupCardScenario";
import { useEffectAfterFirst } from "../hooks/useEffectAfterSecond";
import { Loader } from "@react-three/drei";
import Loading from "../component/Loading";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const MapPage = ({ match }) => {
  // unclicked, region, position
  const [clicked_state, setClickedState] = useState("unclicked");
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const navigate = useNavigate();
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

  useEffectAfterFirst(() => {
    if (global_data.error) {
      setTimeout(
        () => setGlobalVar({ open_overlay: true, popup_type: "error" }),
        0
      );
    }
  }, [global_data.error]);

  useLayoutEffect(() => {
    setGlobalVar({ open_overlay: false, popup_type: "" });
  }, []);

  useEffect(() => {
    setTimeout(() => setGlobalData({ error: "possible_crash_warning" }), 300);
  }, []);

  return (
    <>
      <Header grey />

      <div className={cx("wrapper")}>
        <AutoLayout type="column" padding={1} gap={1} fill>
          <div className={cx("frame-top")}></div>
          <TextBox type="section" black>
            {clicked_state === "unclicked"
              ? global_var.use_eng
                ? ["Tap on a region to design"]
                : ["디자인하고 싶은 구역을 터치해보세요."]
              : clicked_state === "region"
              ? global_var.use_eng
                ? ["Tap on a starting location!"]
                : ["구역 내에서 시작점을 터치해보세요."]
              : global_var.use_eng
              ? ["Perfect!"]
              : ["탁월합니다!"]}
          </TextBox>
          <div className={cx("frame-map")}>
            <EntireMap
              clicked_state={clicked_state}
              setClickedState={setClickedState}
            />
          </div>
          {clicked_state === "position" ? (
            <AutoLayout type="row" gap={1} fillX>
              <AutoLayout type="row" gap={1} fillX recoverClick>
                <Button
                  type="normal"
                  onClick={() => {
                    setClickedState("unclicked");
                  }}
                >
                  {global_var.use_eng ? "Reselect" : "다시 선택"}
                </Button>
                <Button
                  type="emph"
                  onClick={() => {
                    // console.log(global_var.region_no);
                    // console.log(global_data.region_data);
                    // console.log(global_data.grid_selection_data);
                    const data = global_data.grid_selection_data.filter(
                      (e) => e.region_no === global_var.region_no
                    );
                    if (
                      data.length > 0 &&
                      data[0].selection_data[
                        `{${global_var.x_grid};${global_var.y_grid}}`
                      ]
                    ) {
                      const { grids, default_position } =
                        data[0].selection_data[
                          `{${global_var.x_grid};${global_var.y_grid}}`
                        ];
                      setGlobalData({
                        grids,
                        default_position,
                        clicked_meshs: [],
                      });
                      setGlobalVar({ need_to_change_design_data: true });
                      setTimeout(() => navigate("/design"), 100);
                    }
                  }}
                >
                  {global_var.use_eng ? "Start here!" : "여기서 시작!"}
                </Button>
              </AutoLayout>
            </AutoLayout>
          ) : clicked_state === "region" ? (
            <div className={cx("frame-tip")}>
              <AutoLayout fill attach="center">
                <TextBox type="section" grey align="center">
                  {global_var.use_eng
                    ? // ? [
                      //     `[REGION. NO. ${global_data.this_region_data?.name}]`,
                      //     `${global_data.this_region_data?.elevation.eng} + ${global_data.this_region_data?.direction.eng}`,
                      //     `${global_data.this_region_data?.factor.eng}`,
                      //   ]
                      [
                        `[REGION. NO. ${global_data.this_region_data?.name}] : ${global_data.this_region_data?.elevation.eng} + ${global_data.this_region_data?.direction.eng}`,
                        ...(global_data.this_region_data?.factor.illust_eng
                          ? global_data.this_region_data?.factor.illust_eng.split(
                              "\n"
                            )
                          : [global_data.this_region_data?.factor.eng]),
                      ]
                    : [
                        `[제 ${global_data.this_region_data?.name}구역] : ${global_data.this_region_data?.elevation.kor} + ${global_data.this_region_data?.direction.kor}`,
                        ...(global_data.this_region_data?.factor.illust_kor
                          ? global_data.this_region_data?.factor.illust_kor.split(
                              "\n"
                            )
                          : [global_data.this_region_data?.factor.kor]),
                      ]}
                </TextBox>
              </AutoLayout>
            </div>
          ) : (
            <div className={cx("frame-tip")}>
              <AutoLayout fill attach="center">
                <TextBox type="section" grey align="center">
                  {global_var.use_eng
                    ? ["Select a region, and", "check out the properties!"]
                    : ["구역을 선택하고", "구역별 속성을 확인해 보세요!"]}
                </TextBox>
              </AutoLayout>
            </div>
          )}
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
                      setTimeout(() => {
                        setGlobalVar({ open_overlay: false });
                      }, 0);
                    },
                  }}
                />
              </div>
            </Animation>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MapPage;
