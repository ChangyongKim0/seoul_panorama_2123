import React, { useEffect, useReducer, useState, useRef } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./NicknamingPage.module.scss";
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
import axios from "axios";
import useGlobalData from "../hooks/useGlobalData";
import useGlobalVar from "../hooks/useGlobalVar";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import PopupCardScenario from "../component/PopupCardScenario";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const NicknamingPage = ({ match }) => {
  const navigate = useNavigate();
  const [global_data, setGlobalData] = useGlobalData();
  const [global_var, setGlobalVar] = useGlobalVar();
  const user_name = useRef();
  useEffect(() => {
    setTimeout(() => {
      document.body.style.backgroundColor = "#EDEDED";
    }, 10);
    return () => {
      document.body.style.backgroundColor = null;
    };
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
    if (user_name.current && global_var.user_name) {
      user_name.current.value = global_var.user_name;
    }
  }, [user_name.current, global_var.user_name]);

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
              "당신은 서울 마스터플랜 건축가가 되어 원하는 미래를 만들어낼 자격이 충분합니다!",
              "",
              "여러분의 손으로 <구룡산-대모산>을 구해주세요!",
            ]}
          </TextBox>
          <TextInput
            type="emph"
            onKeyDown={(e) => {
              console.log(e);
            }}
            ref={user_name}
          >
            시민 건축가님, 당신의 이름은?
          </TextInput>
          <Button
            type="emph"
            onClick={() => {
              if (!(user_name.current?.value?.length > 0)) {
                setGlobalData({ error: "blank_name" });
              } else if (global_var.user_name) {
                if (global_var.user_name !== user_name.current?.value) {
                  setGlobalVar({
                    open_overlay: true,
                    popup_type: "already_registered",
                    new_user_name: user_name.current?.value,
                  });
                } else {
                  navigate("/map");
                }
              } else {
                axios
                  .put(`${_API_URL}name`, { name: user_name.current?.value })
                  .then((res) => {
                    console.log(res);
                    switch (res.data?.state) {
                      case "success":
                        setGlobalVar({ user_name: user_name.current?.value });
                        navigate("/map");
                        break;
                      case "duplicated":
                        setGlobalData({ error: "duplicated_name" });
                        break;
                      case "error":
                        setGlobalData({ error: "error_while_register" });
                        break;
                    }
                  })
                  .catch(console.log);
              }
            }}
          >
            PLAY!
          </Button>
          <div className={cx("frame-bottom")}></div>
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
    </>
  );
};

export default NicknamingPage;
