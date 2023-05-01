import React, { useEffect, useReducer, useState, useRef } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./OverlayPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import Header from "../component/Header";
import TextBox from "../component/TextBox";
import Slider from "../component/Slider";
import ImageCard from "../component/ImageCard";
import Button from "../component/Button";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { IntroductionPage, NicknamingPage, DesignPage, MapPage } from "./index";
import { AnimatePresence } from "framer-motion/dist/framer-motion";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const Overlay = ({ match }) => {
  const location = useLocation();
  return (
    <Animation type="slide_left" useExit absolute zIndex={1}>
      <div className={cx("wrapper")}>
        <AutoLayout type="column" gap={0} fill>
          <Header />{" "}
          <div className={cx("frame-content")}>
            <AnimatePresence>
              <Routes location={location} key={location.pathname}>
                <Route
                  key="/introduction"
                  exact
                  path="/introduction"
                  element={<IntroductionPage />}
                />
                <Route
                  key="/nicknaming"
                  exact
                  path="/nicknaming"
                  element={<NicknamingPage />}
                />
                <Route key="/map" exact path="/map" element={<MapPage />} />
              </Routes>
            </AnimatePresence>
          </div>
        </AutoLayout>
      </div>
    </Animation>
  );
};

export default Overlay;
