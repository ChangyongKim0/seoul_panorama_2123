import React, { useEffect, useReducer, useState, useRef } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./NicknamingPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import Header from "../component/Header";
import TextBox from "../component/TextBox";
import Slider from "../component/Slider";
import ImageCard from "../component/ImageCard";
import Button from "../component/Button";
import { Link } from "react-router-dom";
import TextInput from "../component/TextInput";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const NicknamingPage = ({ match }) => {
  useEffect(() => {
    setTimeout(() => {
      document.body.style.backgroundColor = "#EDEDED";
    }, 10);
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);
  return (
    <>
      <Header grey />
      <div className={cx("frame-content")}>
        <AutoLayout type="column" padding={1} gap={1.5}>
          <div className={cx("frame-top")}></div>
          <TextBox type="title-fill" hug>
            {["[SEOUL MASTERPLAN PROGRAM]"]}
          </TextBox>
          <img className={cx("frame-image")} src="/img/nicknaming/01.png"></img>
          <TextBox type="narration" black>
            {[
              "안녕하세요! [시민 건축가]님!",
              "",
              "당신은 서울 마스터플랜 건축가가 되어 직접 원하는 미래를 만들어낼 자격이 충분합니다!",
              "",
              "여러분의 손으로 <구룡산-대모산>을 구해주세요!",
            ]}
          </TextBox>
          <TextInput
            type="emph"
            onKeyDown={(e) => {
              console.log(e);
            }}
          >
            시민 건축가님, 당신의 이름은?
          </TextInput>
          <Button type="emph" link_to="/map">
            PLAY!
          </Button>
          <div className={cx("frame-bottom")}></div>
        </AutoLayout>
      </div>
    </>
  );
};

export default NicknamingPage;
