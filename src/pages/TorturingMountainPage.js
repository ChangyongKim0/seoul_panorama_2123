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
import useGlobalVar from "../hooks/useGlobalVar";
import CustomImage from "../component/CustomImage";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const TorturingMountainPage = ({ match }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
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

      <AutoLayout type="column" gap={0} attach="center" align="center" fill>
        <div className={cx("frame-blank")}></div>
        <div className={cx("frame-image")}>
          <div className={cx("image")}>
            <CustomImage
              srcset={
                page_idx === 5
                  ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/torturing_mountain/06.gif"
                  : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/torturing_mountain/0" +
                    (page_idx + 1) +
                    ".png"
              }
              width={567}
              height={528}
            />
          </div>
          {
            <div
              className={cx(
                "frame-image-overlay",
                page_idx === 5 ? "visible" : ""
              )}
            >
              <AutoLayout fill attach="center">
                <TextBox type="narration" align="center">
                  {global_var.use_eng
                    ? [
                        "<Daemosan-Guryongsan>, located at the edge of Seoul, is the mountain that has experienced the most destruction due to concealment and development.",
                        "",
                        "We must acknowledge that new desires could be projected onto this mountain over the next 100 years!",
                      ]
                    : [
                        "서울의 경계를 이루는 <대모산-구룡산>은 은폐와 무관심 속에서 가장 많은 침식을 당한 산입니다.",
                        "",
                        "우리는 향후 100년 동안 산에 새로운 욕망이 투사될 수 있다는 사실을 인지해야 합니다!",
                      ]}
                </TextBox>
              </AutoLayout>
            </div>
          }
        </div>
        <div className={cx("frame-blank")}>
          <AutoLayout padding={1} gap={1} fillX>
            <Link to={page_idx < 5 ? undefined : "/nicknaming"}>
              <TextBox
                type={page_idx === 5 ? "subtitle" : "narration"}
                align="center"
              >
                {global_var.use_eng
                  ? page_idx === 0
                    ? [".....", "(please touch the screen)"]
                    : page_idx === 1
                    ? ["Ugh...", "(please touch the screen)"]
                    : page_idx === 2
                    ? ["Ugh.....", "(please touch the screen)"]
                    : page_idx === 3
                    ? ["Ugh....", "(please touch the screen)"]
                    : page_idx === 4
                    ? ["Ugh....!", "(please touch the screen)"]
                    : page_idx === 5
                    ? [">>> NEXT >>>"]
                    : []
                  : page_idx === 0
                  ? [".....", "(화면을 클릭해주세요.)"]
                  : page_idx === 1
                  ? ["윽...", "(화면을 클릭해주세요.)"]
                  : page_idx === 2
                  ? ["으윽.....", "(화면을 클릭해주세요.)"]
                  : page_idx === 3
                  ? ["으으으....", "(화면을 클릭해주세요.)"]
                  : page_idx === 4
                  ? ["으으윽....!", "(화면을 클릭해주세요.)"]
                  : page_idx === 5
                  ? [">>> 다음 >>>"]
                  : []}
              </TextBox>
            </Link>
          </AutoLayout>
        </div>
      </AutoLayout>
    </div>
  );
};

export default TorturingMountainPage;
