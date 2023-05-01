import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import styles from "./TorturingMountainPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import TextBox from "../component/TextBox";
import TitleBox from "../component/TitleBox";
import Button from "../component/Button";
import Header from "../component/Header";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const TorturingMountainPage = ({ match }) => {
  const [page_idx, setPageIdx] = useState(0);
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
  return (
    <div
      className={cx("wrapper")}
      onClick={() => {
        if (page_idx < 5) {
          setPageIdx((idx) => idx + 1);
        }
      }}
    >
      <Header black />
      <Link to={page_idx < 5 ? undefined : "/nicknaming"}>
        <AutoLayout type="column" gap={0} attach="center" align="center" fill>
          <div className={cx("frame-blank")}></div>
          <img
            className={cx("frame-image")}
            src={"./img/torturing_mountain/0" + (page_idx + 1) + ".png"}
          />
          <div className={cx("frame-blank")}>
            <AutoLayout padding={1} gap={1} fillX>
              <TextBox type="narration" align="center">
                {page_idx === 0
                  ? ["....."]
                  : page_idx === 1
                  ? ["윽..."]
                  : page_idx === 2
                  ? ["으윽....."]
                  : page_idx === 3
                  ? ["아얏...."]
                  : page_idx === 4
                  ? ["으으윽....!"]
                  : page_idx === 5
                  ? [
                      "서울의 경계를 이루는 <대모산-구룡산>은 은폐와 무관심 속에서 가장 많은 침식을 당한 산입니다.",
                      "",
                      "우리는 향후 100년동안 산에 새로운 욕망이 투사될 수 있다는 사실을 인지해야 합니다! ",
                    ]
                  : []}
              </TextBox>
              {page_idx === 5 && (
                <TextBox type="subtitle" align="center">
                  {[">>> 다음 >>>"]}
                </TextBox>
              )}
            </AutoLayout>
          </div>
        </AutoLayout>
      </Link>
    </div>
  );
};

export default TorturingMountainPage;
