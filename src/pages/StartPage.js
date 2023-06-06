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

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const StartPage = ({ match }) => {
  const [output, setSvgStr] = useSvgNest();
  useEffect(() => {
    setSvgStr(`<svg version="1.1" id="svg2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1147.592px" height="1397.27px" viewBox="0 0 1147.592 1397.27" enable-background="new 0 0 1147.592 1397.27" xml:space="preserve">
<polygon id="h" fill="none" stroke="#010101" stroke-miterlimit="10" points="601.531,174.639 571.451,204.011   584.936,227.87 607.366,234.787 613.463,224.759 639.137,226.573 643.285,185.336 "></polygon><rect id="dh"  width="511.822" height="339.235" fill="none" stroke="#010101" /><polygon fill="none" stroke="#010101" stroke-miterlimit="10" points="684.045,443.734 688.396,447.215 
	666.488,450.935 666.488,432.651 "/>
<polygon id="hd" fill="none" stroke="#010101" stroke-miterlimit="10" points="697.067,404.901 697.067,415.601 
	709.719,415.905 710.293,406.067 "/>



	<path id="hdd" fill="none" stroke="#010101"  d="M746.843,60.679c-2.465,1.232-7.395,2.465-13.711,2.465c-14.635,0-25.65-9.243-25.65-26.266
		c0-16.252,11.016-27.268,27.113-27.268c6.471,0,10.553,1.387,12.324,2.311l-1.617,5.469c-2.542-1.232-6.162-2.157-10.476-2.157
		c-12.17,0-20.258,7.78-20.258,21.414c0,12.709,7.317,20.874,19.95,20.874c4.082,0,8.241-0.848,10.938-2.157L746.843,60.679z"/>

</svg>`);
    setTimeout(() => {
      console.log("good");

      setSvgStr(`<svg version="1.1" id="svg2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1147.592px" height="1397.27px" viewBox="0 0 1147.592 1397.27" enable-background="new 0 0 1147.592 1397.27" xml:space="preserve">
<rect id="dh"  width="511.822" height="339.235" fill="none" stroke="#010101" /><polygon id="hd" fill="none" stroke="#010101" stroke-miterlimit="10" points="697.067,404.901 697.067,415.601 
	709.719,415.905 710.293,406.067 "/><polygon id="h" fill="none" stroke="#010101" stroke-miterlimit="10" points="601.531,174.639 571.451,204.011   584.936,227.87 607.366,234.787 613.463,224.759 639.137,226.573 643.285,185.336 "></polygon><polygon fill="none" stroke="#010101" stroke-miterlimit="10" points="684.045,443.734 688.396,447.215 
	666.488,450.935 666.488,432.651 "/>


	<path id="hdd" fill="none" stroke="#010101"  d="M746.843,60.679c-2.465,1.232-7.395,2.465-13.711,2.465c-14.635,0-25.65-9.243-25.65-26.266
		c0-16.252,11.016-27.268,27.113-27.268c6.471,0,10.553,1.387,12.324,2.311l-1.617,5.469c-2.542-1.232-6.162-2.157-10.476-2.157
		c-12.17,0-20.258,7.78-20.258,21.414c0,12.709,7.317,20.874,19.95,20.874c4.082,0,8.241-0.848,10.938-2.157L746.843,60.679z"/>

</svg>`);
    }, 5000);
  }, []);
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
        <AutoLayout
          type="column"
          gap={0.75}
          attach="center"
          align="center"
          fill
        >
          <img className={cx("frame-image")} src="/img/start/01.png" />
          <TitleBox
            title="<Seoul Panorama 2123>"
            subtitle="서벌전경(徐伐 全景) 2123( 二千百二十三)"
          />
          <TextBox type="wrap" align="center">
            {["Seoul Biennale of", "Architecture and", "Urbanism 2023"]}
          </TextBox>
        </AutoLayout>
      </AutoLayout>
      <div className={cx("frame-button")}>
        <AutoLayout type="row" gap={0} fillX attach={"center"}>
          <Button type="default" hug link_to={"/enter"}>
            <div className={cx("frame-btn", "left")}>KR</div>
          </Button>
          <div className={cx("text-center")}>|</div>
          <Button type="default" hug link_to={"/enter"}>
            <div className={cx("frame-btn", "right")}>EN</div>
          </Button>
        </AutoLayout>
      </div>
    </div>
  );
};

export default StartPage;
