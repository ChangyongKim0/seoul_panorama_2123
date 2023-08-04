import React, { useEffect, useReducer, useState, useRef } from "react";
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

  return (
    <>
      <Header grey />
      <div className={cx("wrapper")}>
        <AutoLayout type="column" padding={1} gap={1} fill>
          <div className={cx("frame-top")}></div>
          <TextBox type="section" black>
            {["디자인하고 싶은 구역을 터치해주세요."]}
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
                  다시 선택하기
                </Button>
                <Button
                  type="emph"
                  onClick={() => {
                    console.log(global_var.region_no);
                    console.log(global_data.region_data);
                    console.log(global_data.grid_selection_data);
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
                      setGlobalData({ grids, default_position });
                      setTimeout(() => navigate("/design"), 100);
                    }
                  }}
                >
                  이 위치로 시작하기
                </Button>
              </AutoLayout>
            </AutoLayout>
          ) : clicked_state === "region" ? (
            <div className={cx("frame-tip")}>
              <TextBox type="section" grey align="center">
                {["구역관련 설명이 들어가요!"]}
              </TextBox>
            </div>
          ) : (
            <div className={cx("frame-tip")}>
              <TextBox type="section" grey align="center">
                {["구역을 선택하고 구역별 속성을 확인해 보세요!"]}
              </TextBox>
            </div>
          )}
        </AutoLayout>
      </div>
    </>
  );
};

export default MapPage;
