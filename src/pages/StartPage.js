import React, { useEffect, useLayoutEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import styles from "./StartPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import TitleBox from "../component/TitleBox";
import Button from "../component/Button";
import useSvgNest from "../hooks/useSvgNest";
import useGlobalVar from "../hooks/useGlobalVar";
import CustomImage from "../component/CustomImage";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const StartPage = ({ match }) => {
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
  // useEffect(() => {
  //   if (window.pyodideGlobals) {
  //     console.log(window.pyodideGlobals.get(`pi`));
  //     const compute_pi = window.pyodideGlobals.get(`compute_pi`);
  //     console.log(compute_pi);
  //     console.log(compute_pi(1));
  //   } else {
  //     setTimeout(() => {
  //       console.log(window.pyodideGlobals.get(`pi`));
  //     }, 10000);
  //   }
  // }, [window]);
  return (
    <div className={cx("wrapper")}>
      {/* <py-script>
        {`from js import createObject
from pyodide.ffi import create_proxy

createObject(create_proxy(globals()), "pyodideGlobals")

import datetime as dt
Element("today").write(dt.date.today().strftime('%A %B %d, %Y'))
      
def compute_pi(n):
  pi = 2
  for i in range(1,n):
    pi *= 4 * i ** 2 / (4 * i ** 2 - 1)
  return pi
pi = compute_pi(100000)`}
      </py-script>
      <script></script>
      <div id="pi">{}</div>
      <div id="today"></div> */}
      <AutoLayout type="column" gap={2} attach="center" align="center" fill>
        { global_var.visited_design_page && <div className={cx("frame-fixed")}><Button type="default" link_to="/design">{global_var.use_eng? ">>> Go to Design Page":">>> 디자인페이지 바로가기"}</Button></div>}
        <AutoLayout
          type="column"
          gap={0.75}
          attach="center"
          align="center"
          fill
        >
          <div className={cx("frame-image")}>
            <CustomImage
              srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/start/01.png"
              width={292}
              height={528}
              fillY
            />
          </div>
          <TitleBox
            title="<Seoul Panorama 2123>"
            subtitle="서라벌전경 2123 (徐羅伐全景 二千百二十三)"
          />
          <TextBox type="wrap" align="center">
            {["Seoul Biennale of", "Architecture and", "Urbanism 2023"]}
          </TextBox>
        </AutoLayout>
      </AutoLayout>
      <div className={cx("frame-button")}>
        <AutoLayout type="row" gap={0} fillX attach={"center"}>
          <Button type="default" hug link_to={"/enter"}>
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
          <Button type="default" hug link_to={"/enter"}>
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
      </div>
    </div>
  );
};

export default StartPage;
