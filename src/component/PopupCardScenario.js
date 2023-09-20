import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
// { useEffect }

import styles from "./PopupCardScenario.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";
import PopupCard from "./PopupCard";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import Animation from "./Animation";
import TextBox from "./TextBox";
import Button from "../component/Button";
import ChartBar from "./ChartBar";
import Divider from "../component/Divider";
import Histogram from "./Histogram";
import ScoreGraph from "./ScoreGraph";
import {
  building_data,
  setGlobalDataOnClickBuild,
} from "../util/setGlobalDataOnClickBuild";
import {
  _API_URL,
  _fillZeros,
  _getCircledScore,
  _getReducedScore,
  _getStrLenWhenHangeulIs2,
  _getThousandSepStrFromNumber,
} from "../util/alias";
import { getErrorPopupProperties } from "../util/getErrorPopupProperties";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomImage from "./CustomImage";
import { _isValidDevelopment } from "../util/JJ_new/_isValidDevelopment";
import { _getMasterplanScore } from "../util/JJ_new/_getMasterplanScore";
import { doCustomPolygonsIntersect } from "../util/doPolygonIntersect";
import { getAsyncRankability } from "../util/getAsyncRankability";

const cx = classNames.bind(styles);

const PopupCardScenario = ({ type, onClick, setType }) => {
  const wrapper = useRef();
  const [new_type, setNewType] = useState(type);
  const [internal_data, setInternalData] = useState();
  const [timer, setTimer] = useState(0);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const navigate = useNavigate();
  const error_data = useMemo(
    () => getErrorPopupProperties(global_data.error),
    [global_data.error]
  );

  useEffect(() => {
    console.log("update type");
    setNewType(type);
  }, [type]);

  useEffect(() => {
    setInterval(() => {
      setTimer((time) => time + 100);
    }, 100);
  }, []);

  useEffect(() => {
    if (new_type === "download_0")
      setTimeout(() => {
        setNewType("download_1");
      }, 6400);
  }, []);

  useEffect(() => {
    return () => {
      if (new_type === "error") {
        setGlobalData({ error: undefined });
      }
    };
  }, [new_type]);

  return (
    <>
      {new_type === "download_0" && (
        <div className={cx("wrapper-white")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={0.5} fillX>
              <TextBox type="narration-black" align="center">
                {global_var.use_eng
                  ? ["[Seoul Panorama 2123]", "ver 1.0.0"]
                  : ["[서라벌전경 2123]", "ver 1.0.0"]}
              </TextBox>
              <AutoLayout gap={0} fillX>
                <TextBox type="narration-black" align="center">
                  {global_var.use_eng ? ["Downloading..."] : ["다운로드중..."]}
                </TextBox>
                <Divider black />
                {(global_var.use_eng
                  ? [
                      "Saved! [Architectural Turing Test]",
                      "Saved! [Seoul Master Plan Program]",
                      "Saved! [An Architect's Research Note]",
                      "Saved! [Rhino 3D Models]",
                      "Saved! [Grasshopper File]",
                      "Saved! [SBAU 2023 Ticket]",
                    ]
                  : [
                      "[건축적 튜링테스트]를 획득하셨습니다!",
                      "[서울마스터플랜 프로그램]을 획득하셨습니다!",
                      "[어떤 건축가의 연구노트]를 획득하셨습니다!",
                      "[라이노 모델링 파일]를 획득하셨습니다!",
                      "[그래스하퍼 파일]을 획득하셨습니다!",
                      "[SBAU 2023 입장권]를 획득하셨습니다!",
                    ]
                ).map((e, idx) => (
                  <AutoLayout gap={0} fillX key={idx}>
                    <TextBox
                      type="narration-black"
                      align="center"
                      opaque={timer < 800 * (idx + 1)}
                    >
                      {[e]}
                    </TextBox>
                    <Divider black opaque={timer < 800 * (idx + 1)} />
                  </AutoLayout>
                ))}
              </AutoLayout>
              <div className={cx("frame-intro-02")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/download/01.gif"
                  width={238}
                  height={34}
                />
              </div>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "download_1" && (
        <div className={cx("wrapper-white")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={0.5} fillX>
              <TextBox type="narration-black" align="center">
                {global_var.use_eng
                  ? ["[Seoul Panorama 2123]", "ver 1.0.0"]
                  : ["[서라벌전경 2123]", "ver 1.0.0"]}
              </TextBox>
              <AutoLayout gap={0} fillX>
                <Link to="/exhibition">
                  <TextBox type="narration-black" align="center">
                    {global_var.use_eng ? ["Saved File"] : ["다운로드 파일"]}
                  </TextBox>
                </Link>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {global_var.use_eng
                    ? ["Open the [Architectural Turing Test]?"]
                    : ["[건축적 튜링테스트] 확인하시겠습니까?"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {global_var.use_eng
                    ? [
                        "In the Architectural Turing Test, you will be presented with architectural images created by machines...",
                        "",
                        `Can you differentiate the 'images' generated by Al to pictures taken from authentic methods?`,
                      ]
                    : [
                        "건축적 튜링테스트를 통해 여러분은 기계가 만들어낸 인공적인 도시, 건축 이미지를 마주하게 될 것이다...",
                        "",
                        "과연 당신은 인공지능이 모사해낸 '현실적 이미지'와 실제 현실을 구분할 수 있을까?",
                      ]}
                </TextBox>
                <Divider opaque />
              </AutoLayout>
              <Button type="download" link_to="/turingtest">
                ARCHI-TURING TEST
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "download_2" && (
        <div className={cx("wrapper-white")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={0.5} fillX>
              <TextBox type="narration-black" align="center">
                {global_var.use_eng
                  ? ["[Seoul Panorama 2123]", "ver 1.0.0"]
                  : ["[서라벌전경 2123]", "ver 1.0.0"]}
              </TextBox>
              <AutoLayout gap={0} fillX>
                <TextBox type="narration-black" align="center">
                  {global_var.use_eng ? ["Saved File"] : ["다운로드 파일"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {global_var.use_eng
                    ? ["Launch the [Seoul Masterplan Program]?"]
                    : ["[서울마스터플랜 프로그램]을 실행할까요?"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {global_var.use_eng
                    ? [
                        "TYPE C - Multiple Layered Green Hill City / Architecture",
                        "",
                        "Connect Seoul's mountains and urban greenery through a multiple layered Green city / architecture!",
                      ]
                    : [
                        "TYPE C - 다층화 녹화 언덕 도시 / 건축",
                        "",
                        "다층화 녹화 언덕도시 / 건축을 통해 서울의 산과 도시의 녹지를 연결하자!",
                      ]}
                </TextBox>
                <Divider opaque />
              </AutoLayout>
              <Button type="download" link_to="/torturingmountain">
                MASTERPLAN
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_0" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? ["Play with the mountain region and build facilities!"]
                  : [
                      "선택한 구역의 산을 개발하고, 여러 다양한 시설을 선택하여 지어보세요.",
                    ]}
              </TextBox>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? ["Build your own masterplan and upload it to server!"]
                  : [
                      "자신만의 마스터플랜에 점수를 매기고, 서버에도 등록해 모두와 공유해봐요!",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/01.gif"
                  width={630}
                  height={436}
                  // width={623}
                  // height={421}
                />
              </div>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["1 / 6"]}
            </TextBox>
            <Button onClick={() => setNewType("illust_1")}>
              {global_var.use_eng ? ["Next"] : ["다음"]}
            </Button>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_1" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {global_var.use_eng
                    ? ["Tap on a lot to design. Design up to 20 lots!"]
                    : [
                        "개발하려는 필지를 터치해보세요. 최대 20개의 필지까지 개발할 수 있어요.",
                      ]}
                </TextBox>
              </AutoLayout>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {global_var.use_eng
                    ? ["Tap on the selected lot again to deselect."]
                    : [
                        "이미 선택된 필지를 다시 한번 터치하면, 기존 선택에서 제외됩니다!",
                      ]}
                </TextBox>
              </AutoLayout>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/02e.gif"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/02.gif"
                  }
                  width={630}
                  height={436}
                />
              </div>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["2 / 6"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_0")}>
                {global_var.use_eng ? ["Previous"] : ["이전"]}
              </Button>
              <Button onClick={() => setNewType("illust_2")}>
                {global_var.use_eng ? ["Next"] : ["다음"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_2" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {global_var.use_eng
                    ? ["To develop the selected lot, tap the Develop icon"]
                    : ["필지를 개발하고 싶다면, 개발하기 아이콘을 눌러보세요."]}
                </TextBox>
                <div className={cx("frame-icon")}>
                  <Icon type="develop" fill size={2.5} />
                </div>
              </AutoLayout>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {global_var.use_eng
                    ? ["To restore the lot, tap the Undevelop icon"]
                    : ["원래대로 되돌리려면, 개발취소 아이콘을 눌러보세요."]}
                </TextBox>
                <div className={cx("frame-icon", "emph")}>
                  <Icon type="undevelop" fill size={2.5} />
                </div>
              </AutoLayout>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/03e.gif"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/03.gif"
                  }
                  width={630}
                  height={436}
                />
              </div>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["3 / 6"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_1")}>
                {global_var.use_eng ? ["Previous"] : ["이전"]}
              </Button>
              <Button onClick={() => setNewType("illust_3")}>
                {global_var.use_eng ? ["Next"] : ["다음"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_3" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {global_var.use_eng
                    ? ["To install or change a facility, tap the Build icon."]
                    : [
                        "시설 짓기 아이콘을 눌러서 시설을 설치하고 변경해 보세요!",
                      ]}
                </TextBox>
                <div className={cx("frame-icon")}>
                  <Icon type="build" fill size={2.5} />
                </div>
              </AutoLayout>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {global_var.use_eng
                    ? ["To return to an empty lot, tap the Demolish icon."]
                    : [
                        "시설 철거 아이콘을 누르면 다시 개발된 빈 필지로 돌아가요!",
                      ]}
                </TextBox>
                <div className={cx("frame-icon", "emph")}>
                  <Icon type="unbuild" fill size={2.5} />
                </div>
              </AutoLayout>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/04e.gif"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/04.gif"
                  }
                  width={630}
                  height={436}
                />
              </div>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["4 / 6"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_2")}>
                {global_var.use_eng ? ["Previous"] : ["이전"]}
              </Button>
              <Button onClick={() => setNewType("illust_4")}>
                {global_var.use_eng ? ["Next"] : ["다음"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_4" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "You need more than 4,000pts of Total Score and 5 lots to upload!",
                    ]
                  : [
                      "개발 필지가 5개, 종합 디자인점수가 4,000점 이상이면 업로드가 가능해요!",
                    ]}
              </TextBox>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "You will get a high score for the first five developed lots.",
                    ]
                  : [
                      "업로드 최소 기준에 해당되는 첫 5개 필지까지는, 점수가 크게 오를거에요!",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/05e.gif"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/05.gif"
                  }
                  width={630}
                  height={436}
                />
              </div>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["5 / 6"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_3")}>
                {global_var.use_eng ? ["Previous"] : ["이전"]}
              </Button>
              <Button onClick={() => setNewType("illust_5")}>
                {global_var.use_eng ? ["Next"] : ["다음"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_5" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "For uploading, the designed lots must be connected to one another!",
                    ]
                  : [
                      "서버에 업로드시 개발된 모든 필지들은 하나로 연결되어 있어야 해요!",
                    ]}
              </TextBox>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "If there are two or more empty lots, points will be deducted!",
                    ]
                  : [
                      "단, 시설을 꼭 지어주세요! 빈 필지가 2개 이상이면 점수가 차감돼요!",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/06e.gif"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/intro/06.gif"
                  }
                  width={630}
                  height={436}
                />
              </div>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["6 / 6"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_4")}>
                {global_var.use_eng ? ["Previous"] : ["이전"]}
              </Button>
              <Button
                onClick={() => {
                  setGlobalVar({ visited_design_page: true });
                  onClick?.Close?.();
                }}
                type="emph"
              >
                {global_var.use_eng ? ["Start!"] : ["시작해봐요!"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {(new_type === "build" ||
        new_type === "build_and_unbuild" ||
        new_type === "build_only_big") && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng ? ["Build Facility"] : ["시설 설치하기"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              {building_data
                .filter((_, idx) =>
                  new_type === "build_only_big"
                    ? [0, 3, 4, 5].includes(idx)
                    : [1, 2, 3, 4].includes(idx)
                )
                .map((e, idx) => {
                  return (
                    <AutoLayout gap={1} fillX key={idx} align="left">
                      <AutoLayout type="row" attach="space" fillX>
                        <TextBox type="section" black hug>
                          {global_var.use_eng ? [e.section_eng] : [e.section]}
                        </TextBox>
                        <Button
                          type="default"
                          onClick={() => {
                            setNewType("illust_build:" + e.section_idx);
                          }}
                          hug
                        >
                          <div className={cx("text-small")}>
                            {global_var.use_eng
                              ? ">> More Info"
                              : " >> 더 알아보기"}
                          </div>
                          {/* <div style={{ height: "1rem" }}>
                            <CustomImage
                              srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/icon/iconInfo.png"
                              fillY
                            />
                          </div> */}
                        </Button>{" "}
                      </AutoLayout>
                      <AutoLayout
                        type="row"
                        multiple_line
                        gap={1}
                        fillX
                        align="left"
                      >
                        {e.contents.map((e2, idx2) => (
                          <Button type="default" hug key={idx2}>
                            <AutoLayout
                              gap={0.25}
                              onClick={() => {
                                if (
                                  !global_var.once_clicked_big_building &&
                                  ["big", "custom"].includes(
                                    e2.bldg_type?.split("_")?.[0]
                                  )
                                ) {
                                  setNewType("once_clicked_big_building");
                                } else {
                                  setGlobalData(
                                    setGlobalDataOnClickBuild(
                                      e2.bldg_type,
                                      e2.bldg_name,
                                      e2.bldg_model_type,
                                      e2.require_svgNest
                                    )
                                  );
                                  onClick?.Close?.();
                                }

                                // if (e2.name === "공동주택") {
                                //   setNewType("caution_height");
                                // } else if (e.section === "공공 대형 건축") {
                                //   setNewType("caution_largebldg_info");
                                // } else {
                                //   onClick?.Build?.(e2.name);
                                // }
                              }}
                            >
                              <div className={cx("frame-small-image")}>
                                <img src={e2.image_path}></img>
                              </div>
                              <div className={cx("text-small-frame")}>
                                <AutoLayout align="center" fillX>
                                  <div
                                    className={cx(
                                      "text-small",
                                      e2.name?.split("_")?.length > 1
                                        ? ""
                                        : _getStrLenWhenHangeulIs2(e2.name) > 12
                                        ? "condensed"
                                        : _getStrLenWhenHangeulIs2(e2.name) > 10
                                        ? "semi-condensed"
                                        : ""
                                    )}
                                  >
                                    {global_var.use_eng
                                      ? e2.name_eng
                                      : e2.name?.split("_")?.join(" ")}
                                  </div>
                                </AutoLayout>
                              </div>
                            </AutoLayout>
                          </Button>
                        ))}
                      </AutoLayout>
                    </AutoLayout>
                  );
                })}
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button onClick={() => onClick?.Close?.()}>
              {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
            </Button>
          </div>
        </div>
      )}
      {new_type === "caution_height" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {[
                "앗, 고도제한으로 인해 이 위치에는 선택한 건물을 지을 수 없어요.",
              ]}
            </TextBox>
            <Button
              type="emph"
              onClick={() => setNewType("caution_height_info")}
            >
              고도제한이란?
            </Button>
            <Button onClick={() => setNewType("build")}>다시 선택하기</Button>
          </PopupCard>
        </div>
      )}

      {new_type === "caution_height_info" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["고도제한이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {["고도제한이란 ~~~한 것을 말해요."]}
              </TextBox>
              <img
                className={cx("frame-popup-image")}
                src="/img/caution_height_info/01.png" // 없어진 이미지 (재진)
              />
              <TextBox type="sentence">
                {["추가로 쓸 내용이 있다면 이렇게"]}
              </TextBox>
              <img
                className={cx("frame-popup-image")}
                src="/img/caution_height_info/02.png" // 없어진 이미지 (재진)
              />
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button onClick={() => setNewType("build")}>네 알겠어요!</Button>
          </div>
        </div>
      )}
      {new_type === "caution_largebldg_info" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["대형건물은 좀 달라요! 아시나요?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">{["대형 건물은 좀 달라요!"]}</TextBox>
              <img
                className={cx("frame-popup-image")}
                src="/img/caution_largebldg_info/01.png" // 없어진 이미지 (재진)
              />
              <TextBox type="sentence">
                {["추가로 쓸 내용이 있다면 이렇게"]}
              </TextBox>
              <img
                className={cx("frame-popup-image")} // 없어진 이미지(재진)
                src="/img/caution_largebldg_info/02.png"
              />
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button onClick={() => setNewType("build")}>네 지어볼게요!</Button>
          </div>
        </div>
      )}
      {new_type === "score" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["My Design Score"]
                : ["나의 디자인 점수는?"]}
            </TextBox>
            <AutoLayout gap={1} fill>
              <Button
                type="default"
                hug
                fillX
                onClick={() => {
                  setNewType("score_green");
                }}
              >
                <ChartBar
                  title_left={
                    global_var.use_eng ? "Landscape Affinity?" : "경관 친화성?"
                  }
                  title_right={
                    _getThousandSepStrFromNumber(
                      Math.round(
                        global_data.masterplan_score?.l_converted * 10000 || 0
                      )
                    ) + (global_var.use_eng ? " pts" : " 점")
                  }
                  percent={global_data.masterplan_score?.l_converted || 0}
                  border
                />
              </Button>
              <Button
                type="default"
                hug
                fillX
                onClick={() => {
                  setNewType("score_profit");
                }}
              >
                <ChartBar
                  title_left={
                    global_var.use_eng ? "Development Profit?" : "개발 타당성?"
                  }
                  title_right={
                    _getThousandSepStrFromNumber(
                      Math.round(
                        global_data.masterplan_score?.b_converted * 10000 || 0
                      )
                    ) + (global_var.use_eng ? " pts" : " 점")
                  }
                  percent={global_data.masterplan_score?.b_converted || 0}
                  border
                />
              </Button>
              <Button
                type="default"
                hug
                fillX
                onClick={() => {
                  setNewType("score_public");
                }}
              >
                <ChartBar
                  title_left={
                    global_var.use_eng ? "Public Contribution?" : "공공 기여성?"
                  }
                  title_right={
                    _getThousandSepStrFromNumber(
                      Math.round(
                        global_data.masterplan_score?.p_converted * 10000 || 0
                      )
                    ) + (global_var.use_eng ? " pts" : " 점")
                  }
                  percent={global_data.masterplan_score?.p_converted || 0}
                  border
                />
              </Button>
              <Button
                type="default"
                hug
                fillX
                onClick={() => {
                  setNewType("score_total");
                }}
              >
                <ChartBar
                  type={
                    _getReducedScore(
                      global_data.masterplan_score?.tot_converted || 0,
                      global_data.bldg_state
                    ) > global_var.SCORE_FACTOR
                      ? "emph"
                      : "normal"
                  }
                  title_left={
                    global_var.use_eng
                      ? "Total Design Score?"
                      : "종합 디자인점수?"
                  }
                  title_right={
                    _getThousandSepStrFromNumber(
                      Math.round(
                        _getReducedScore(
                          global_data.masterplan_score?.tot_converted * 10000 ||
                            0,
                          global_data.bldg_state
                        )
                      )
                    ) + (global_var.use_eng ? " pts" : " 점")
                  }
                  percent={_getReducedScore(
                    global_data.masterplan_score?.tot_converted || 0,
                    global_data.bldg_state
                  )}
                  border
                />
              </Button>
            </AutoLayout>
            <AutoLayout type="row" fillX>
              <Button onClick={() => onClick?.Close?.()}>
                {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
              </Button>
              {_getReducedScore(
                global_data.masterplan_score?.tot_converted || 0,
                global_data.bldg_state
              ) > global_var.SCORE_FACTOR && (
                <Button
                  onClick={() => {
                    setGlobalData({
                      clicked_meshs: [],
                      clicked_bldg_guids: [],
                      emph_guids: [],
                      clicked_guid: undefined,
                    });
                    if (
                      !_isValidDevelopment(
                        global_data.background_relation,
                        global_data.bldg_state,
                        0.01,
                        4
                      )
                    ) {
                      setInternalData(
                        _isValidDevelopment(
                          global_data.background_relation,
                          global_data.bldg_state,
                          0.01,
                          4,
                          true
                        )
                      );
                      setNewType("illust_upload");
                    } else if (
                      global_data.background_state?.terrain?.length < 5
                    ) {
                      setGlobalData({ error: "too_few_pilji" });
                    } else if (global_var.modeling_uploaded_at_least_once) {
                      setNewType("already_uploaded_before");
                    } else {
                      getAsyncRankability(
                        global_data,
                        setGlobalData,
                        global_var,
                        setGlobalVar
                      )
                        .then((res) => {
                          if (res.rankable) {
                            setGlobalVar({
                              upload_design_info: true,
                              rankable: true,
                            });
                            setGlobalData({
                              overlapping_users: res.overlapping_users,
                              overlapping_users_above_me:
                                res.overlapping_users_above_me,
                            });
                            onClick.Close();
                          } else {
                            setInternalData({
                              min_score_to_be_ranked:
                                res.min_score_to_be_ranked,
                              overlapping_users_above_me:
                                res.overlapping_users_above_me,
                            });
                            setNewType("unrankable_design");
                          }
                        })
                        .catch((e) => {
                          setGlobalData({ error: "get_network_error" });
                        });
                    }
                  }}
                  type="emph-secondary"
                >
                  {global_var.use_eng ? ["Upload!"] : ["서버 업로드!"]}
                </Button>
              )}
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_upload" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["Conditions for Upload?"]
                : ["서버 업로드 조건은?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "For upload, the developed lots must be connected to one another with no holes inside.",
                    ]
                  : [
                      "서버에 업로드하기 위해서는 개발한 필지가 구멍 없이 모두 연결되어 있어야 해요.",
                    ]}
              </TextBox>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `Currently, the designed lots ` +
                        (internal_data?.length > 1
                          ? Math.max(...(internal_data || [])) > 1
                            ? ` is separated into ${
                                internal_data?.length
                              } area(s), and has ${
                                Math.max(...(internal_data || [])) - 1
                              } hole(s) inside the areas.`
                            : `${internal_data?.length} areas.`
                          : `has ${
                              Math.max(...(internal_data || [])) - 1
                            }hole(s) inside the areas.`),
                    ]
                  : [
                      `지금 디자인하신 영역은, ` +
                        (internal_data?.length > 1
                          ? Math.max(...(internal_data || [])) > 1
                            ? `${
                                internal_data?.length
                              }개의 영역으로 분리되어 있고 영역 안에 최대 ${
                                Math.max(...(internal_data || [])) - 1
                              }개의 구멍도 뚫려 있어요.`
                            : `${internal_data?.length}개의 영역으로 분리되어 있어요.`
                          : `${
                              Math.max(...(internal_data || [])) - 1
                            }개의 구멍이 뚫려 있어요.`),
                    ]}
              </TextBox>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      internal_data?.length > 1
                        ? Math.max(...(internal_data || [])) > 1
                          ? `Please upload after making lots connected, and developing all the lots!`
                          : `Please upload after making lots connected to one another!`
                        : `Please upload after developing every lot in the designed area!`,
                    ]
                  : [
                      internal_data?.length > 1
                        ? Math.max(...(internal_data || [])) > 1
                          ? `개발된 필지를 하나의 영역으로 연결되게 만들고, 영역 안의 필지를 모두 개발한 뒤에 서버에 올려주세요!`
                          : `개발된 필지를 하나의 영역으로 연결되게 만든 뒤에 서버에 올려주세요!`
                        : `영역 안의 필지를 모두 개발한 뒤에 서버에 올려주세요!`,
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/upload_condition/01.png"
                  width={628}
                  height={554}
                />
              </div>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/upload_condition/02.png"
                  width={628}
                  height={554}
                />
              </div>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/upload_condition/03.png"
                  width={628}
                  height={554}
                />
              </div>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button
              onClick={() => {
                setTimeout(() => setInternalData(undefined), 350);
                onClick.Close();
              }}
            >
              {global_var.use_eng ? ["OK, Got it!"] : ["네, 알겠어요!"]}
            </Button>
          </div>
        </div>
      )}
      {new_type === "score_green" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["What is Landscape Affinity?"]
                : ["경관 친화성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "Landscape Affinity is a measure related to the preservation of mountain environment, including mountain views and its landscapes. Therefore, it is evaluated based on the factors such as building height, green space area, and open space ratio.",
                      "",
                      "To increase Landscape Affinity, try constructing facilities with high Landscape Levels!",
                    ]
                  : [
                      "경관 친화성은 산의 조망 및 경관 등 산지 환경의 보존과 관련된 척도입니다. 따라서 건물의 층수, 녹지 면적, 공지 비율 등의 요소로 평가해요.",
                      "",
                      "경관 친화성을 올리기 위해 높은 경관 레벨을 가진 시설을 지어보아요!",
                    ]}
              </TextBox>
              <Histogram
                data={global_data?.score_graph_data?.l}
                my={global_data?.masterplan_score?.l}
              />
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `'My Level' shows how much Landscape Levels you've gained per unit area for the lots you've designed up to now. Citizen architects who have uploaded designs so far have obtained an average Landscape Levels of ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.l?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}!`,
                    ]
                  : [
                      `'나의 레벨'은 내가 지금까지 디자인한 필지들이 단위면적당 얼마의 경관 레벨을 획득했는지 보여줘요. 그동안 디자인을 업로드하셨던 시민 건축가분들은 평균 ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.l?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}의 경관 레벨을 획득했네요!`,
                    ]}
              </TextBox>
              <ScoreGraph
                data={global_data?.score_graph_data?.l}
                my={global_data?.masterplan_score?.l}
              />
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `The average level of ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.l?.mean * 10
                        ) / 10,
                        1,
                        true
                      )} is converted into a Landscape Affinity score of 5000pts, and the higher the value you obtain compared to this, the higher your Landscape Affinity will be calculated!`,
                      "",
                      "Let's get back to the Design Page!",
                    ]
                  : [
                      `이 ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.l?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}의 평균 레벨을 경관 친화성 5000점으로 환산하고, 이보다 높은 수치를 획득할수록 여러분의 경관 친화성은 보다 더 높게 산정됩니다!`,
                      "",
                      "그럼 다시 디자인하러 돌아가 볼까요?",
                    ]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>
                {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
              </Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                {global_var.use_eng ? ["Resume"] : ["더 디자인하기"]}
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "score_public" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["What is Public Contribution?"]
                : ["공공 기여성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "Public Contribution measures the public influence on local communities and neighboring cities. Therefore, it is evaluated based on factors such as the public functions of buildings and the type of operating entities.",
                      "",
                      "To increase Public Contribution, try constructing facilities with high Public Levels!",
                    ]
                  : [
                      "공공 기여성은 지역 사회 및 주변 도시에 미치는 공적 영향력에 관련된 척도입니다. 따라서 건물이 수행하는 공적 기능, 운영 주체의 성격 등의 요소로 평가해요.",
                      "",
                      "공공 기여성을 올리기 위해 높은 공공 레벨을 가진 건물을 지어보아요.",
                    ]}
              </TextBox>
              <Histogram
                data={global_data?.score_graph_data?.p}
                my={global_data?.masterplan_score?.p}
              />
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `'My Level' shows how much Public Levels you've gained per unit area for the lots you've designed up to now. Citizen architects who have uploaded designs so far have obtained an average Public Levels of ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.p?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}.`,
                    ]
                  : [
                      `'나의 레벨'은 내가 지금까지 디자인한 필지들이 단위면적당 얼마의 공공 레벨을 획득했는지 보여줘요. 그동안 디자인을 업로드하셨던 시민 건축가분들은 평균 ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.p?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}의 공공 레벨을 획득했네요!`,
                    ]}
              </TextBox>
              <ScoreGraph
                data={global_data?.score_graph_data?.p}
                my={global_data?.masterplan_score?.p}
              />
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `The average level of ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.p?.mean * 10
                        ) / 10,
                        1,
                        true
                      )} is converted into a Public Contribution score of 5000pts, and the higher the value you obtain compared to this, the higher your Public Contribution will be calculated!`,
                      "",
                      "Let's get back to the Design Page!",
                    ]
                  : [
                      `이 ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.p?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}의 평균 레벨을 공공 기여성 5000점으로 환산하고, 이보다 높은 수치를 획득할수록 여러분의 공공 기여성은 보다 더 높게 산정됩니다!`,
                      "",
                      "그럼 다시 디자인하러 돌아가 볼까요?",
                    ]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>
                {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
              </Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                {global_var.use_eng ? ["Resume"] : ["더 디자인하기"]}
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "score_profit" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["What is Development Profitability?"]
                : ["개발 타당성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "Development Profitability is a measure related to the development benefits and the potential for promoting development, among other factors related to business viability. Therefore, it is evaluated based on factors such as the scale of development and the provision of infrastructure environment.",
                      "",
                      "To increase Development Profitability, try constructing facilities with high Development Levels!",
                    ]
                  : [
                      "개발 타당성은 개발 이익 및 개발 촉진성 등의 사업성과 관련된 척도입니다. 따라서 개발 규모, 제반시설 제공여부 등의 요소로 평가해요.",
                      "",
                      "개발 타당성을 올리기 위해 높은 개발레벨을 가진 건물을 지어보아요!",
                    ]}
              </TextBox>
              <Histogram
                data={global_data?.score_graph_data?.b}
                my={global_data?.masterplan_score?.b}
              />
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `'My Level' shows how much Development Levels you've gained per unit area for the lots you've designed up to now. Citizen architects who have uploaded designs so far have obtained an average Development Levels of ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.b?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}.`,
                    ]
                  : [
                      `'나의 레벨'은 내가 지금까지 디자인한 필지들이 단위면적당 얼마의 개발 레벨을 획득했는지 보여줘요. 그동안 디자인을 업로드하셨던 시민 건축가분들은 평균 ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.b?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}의 개발 레벨을 획득했네요!`,
                    ]}
              </TextBox>
              <ScoreGraph
                data={global_data?.score_graph_data?.b}
                my={global_data?.masterplan_score?.b}
              />
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      `The average level of ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.b?.mean * 10
                        ) / 10,
                        1,
                        true
                      )} is converted into a Development Profitability score of 5000pts, and the higher the value you obtain compared to this, the higher your Development Profitability will be calculated!`,
                      "",
                      "Let's get back to the Design Page!",
                    ]
                  : [
                      `이 ${_fillZeros(
                        Math.round(
                          global_data?.score_graph_data?.b?.mean * 10
                        ) / 10,
                        1,
                        true
                      )}의 평균 레벨을 개발 타당성 5000점으로 환산하고, 이보다 높은 수치를 획득할수록 여러분의 개발 타당성은 보다 더 높게 산정됩니다!`,
                      "",
                      "그럼 다시 디자인하러 돌아가 볼까요?",
                    ]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>
                {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
              </Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                {global_var.use_eng ? ["Resume"] : ["더 디자인하기"]}
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "score_total" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["What is a Total Design Score?"]
                : ["종합 디자인점수란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "The Total Design Score is calculated by summing the metric scores of Landscape Affinity, Public Contribution, and Development Profitability based on the properties of the selected Region. Since it is a relative score, the score may fluctuate as more people participate.",
                    ]
                  : [
                      "선택한 구역의 가점 속성에 따라 경관 친화성, 개발 타당성, 공공 기여성의 지표 점수들을 종합해 종합 점수를 계산해요. 상대적인 점수이기 때문에 참여자가 늘어날수록 점수가 변하기도 해요.",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/totalscore/01e.png"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/totalscore/01.png"
                  }
                  width={1282}
                  height={802}
                />
              </div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "The higher your score is compared to the average metric score of other people who have uploaded so far, the higher your Total Design Score will be.",
                      "",
                      "Once your Total Design Score is over 4,000, you can upload your design to the server. After uploading, you can access the linktree and the open-source files. ",
                    ]
                  : [
                      "지금까지 업로드된 다른 사람들의 평균 지표 점수보다 더 높은 수치를 획득할수록 높은 종합 디자인점수를 얻을 수 있어요.",
                      "",
                      "종합 디자인점수가 4,000점을 넘기면 진행한 디자인을 서버에 업로드할 수 있습니다. 업로드 후엔 제공되는 링크트리와 오픈소스 자료를 다운받을 수 있어요.",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/totalscore/02e.png"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/totalscore/02.png"
                  }
                  width={1282}
                  height={802}
                />
              </div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "Uploaded designs can be searched on the Masterplan Page. If your designed area overlaps with someone else's, the design with a higher score is displayed as the main design for the specific area.",
                      "",
                      "Let's get back to the Design Page!",
                    ]
                  : [
                      "업로드된 디자인은 마스터플랜 화면에서 확인할 수 있습니다. 다른 사람과 개발한 영역이 겹친다면, 더 높은 종합 디자인점수를 획득한 디자인이 대표로 표시돼요!",
                      "",
                      "그럼 다시 디자인하러 돌아가 볼까요?",
                    ]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>
                {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
              </Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                {global_var.use_eng ? ["Resume"] : ["더 디자인하기"]}
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "logic" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? ["Design Principles"]
                : ["디자인 원리는 어떻게 되나요?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "The master planning process consists of the steps of creating and analyzing the lots and placing facility types. The masterplan is based on a unique system of facilities and streets, which you can find out in the images below! ",
                    ]
                  : [
                      "마스터플랜 계획 과정은 필지 생성 및 분석, 시설유형 배치의 단계로 구성돼요. 이 계획은 배치되는 시설과 가로 간의 독특한 시스템을 바탕으로 합니다. 자세한 내용은 아래의 이미지에서 확인할 수 있어요!",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/logic/01e.png"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/logic/01.png"
                  }
                  width={2044}
                  height={2792}
                />
              </div>
              <TextBox type="sentence" align="center">
                {global_var.use_eng
                  ? ["[Lot Generation with Analysis and Bldg Placement]"]
                  : ["[필지 자동생성 및 분석과 건물배치]"]}
              </TextBox>{" "}
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/logic/02e.png"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/logic/02.png"
                  }
                  width={2044}
                  height={2815}
                />
              </div>
              <TextBox type="sentence" align="center">
                {global_var.use_eng
                  ? ["[Facility and Street System]"]
                  : ["[시설과 가로 시스템]"]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/logic/03e.png"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/logic/03.png"
                  }
                  width={2044}
                  height={1116}
                />
              </div>
              <TextBox type="sentence" align="center">
                {global_var.use_eng
                  ? ["[Masterplan by Everyone]"]
                  : ["[모두가 참여하는 마스터플랜]"]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button
              onClick={() => {
                onClick?.Close?.();
              }}
            >
              {global_var.use_eng ? ["OK, Got it!"] : ["네, 알겠어요!"]}
            </Button>
          </div>
        </div>
      )}
      {new_type === "credit" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <AutoLayout gap={1} padding={1} fill>
            <TextBox type="section" black align="center">
              {global_var.use_eng
                ? ["SBAU 2023", "TEAM <Seoul Panorama 2123>"]
                : ["서울도시건축비엔날레 2023", "<서라벌전경 2123> 팀"]}
            </TextBox>

            <TextBox type="sentence" align="center">
              {global_var.use_eng
                ? [
                    "Jiyong Jeon: General Director",
                    "",
                    "[Online Exhibits]",
                    "Changyong Kim: Plan / SW Development",
                    "Jaejin Lee: Plan / Production",
                    "",
                    "[On-site Exhibits]",
                    "Meelae Jang: Plan / Production",
                    "Sungjin Park: Diorama Production",
                    "Saem Hong: Production",
                  ]
                : [
                    "전지용: 전시 총괄",
                    "",
                    "[온라인 전시]",
                    "김창용: 전시 기획 / 개발",
                    "이재진: 전시 기획 / 제작",
                    "",
                    "[현장 전시]",
                    "장미래: 전시 기획 / 제작",
                    "박성진: 디오라마 모형 제작",
                    "홍샘: 전시 제작",
                  ]}
            </TextBox>

            <Button
              onClick={() => {
                onClick?.Close?.();
              }}
            >
              {global_var.use_eng ? ["Close"] : ["닫기"]}
            </Button>
          </AutoLayout>
        </div>
      )}
      {new_type === "caution_exit" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {global_var.use_eng
                ? [
                    "You will lose your design history.",
                    "",
                    "Do you want to restart in a new region?",
                  ]
                : [
                    "이전 단계로 돌아가시면 진행중인 디자인이 사라져요! 괜찮으신가요?",
                    "",
                    "새로운 구역에서 다시 시작할까요?",
                  ]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button
                link_to="/map"
                onClick={() => {
                  setGlobalData({
                    clicked_meshs: [],
                    clicked_bldg_guids: [],
                    emph_guids: [],
                    clicked_guid: undefined,
                  });
                }}
              >
                {global_var.use_eng ? ["Restart"] : ["다시 시작"]}
              </Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                {global_var.use_eng ? ["Back"] : ["돌아가기"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "already_registered" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {global_var.use_eng
                ? [
                    `You've already registerd with "${global_var.user_name}". Register again with "${global_var.new_user_name}"?`,
                  ]
                : [
                    `이미 "${global_var.user_name}"이라는 이름으로 등록하셨어요. "${global_var.new_user_name}"로 이름을 다시 등록할까요?`,
                  ]}
            </TextBox>
            <TextBox type="sentence">
              {global_var.use_eng
                ? [
                    "Even if you register under a new name, the previous design data remains.",
                  ]
                : [
                    "새로운 이름으로 등록하더라도, 기존 디자인 정보는 남아있어요.",
                  ]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
              >
                {global_var.use_eng ? ["Back"] : ["돌아가기"]}
              </Button>
              <Button
                onClick={() => {
                  axios
                    .put(`${_API_URL}name`, { name: global_var.new_user_name })
                    .then((res) => {
                      console.log(res);
                      switch (res.data?.state) {
                        case "success":
                          setGlobalVar({ user_name: global_var.new_user_name });
                          navigate("/map");
                          break;
                        case "duplicated":
                          setGlobalData({ error: "duplicated_name" });
                          break;
                        case "error":
                          setGlobalData({ error: "error_while_register" });
                          break;
                      }
                      onClick?.Close?.();
                    })
                    .catch(console.log);
                }}
                type={"emph"}
              >
                {global_var.use_eng ? ["Register"] : ["새로 등록하기"]}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "error" && (
        <div
          className={cx("wrapper-lightgrey")}
          id={`ERROR_${error_data.type}`}
        >
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {global_var.use_eng
                ? error_data?.message_eng?.split("\n") || []
                : error_data?.message?.split("\n") || []}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              {error_data.actions?.map((action, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    action.onClick?.();
                    if (action.click_when_close) {
                      onClick?.Close?.();
                    }
                    if (action.transit_popup) {
                      setGlobalVar({ popup_type: action.transit_popup });
                      setNewType(action.transit_popup);
                    }
                    if (action.send_global_data) {
                      setGlobalData(action.send_global_data);
                    }
                    if (action.send_global_var) {
                      setGlobalVar(action.send_global_var);
                    }
                    if (action.link_to) {
                      onClick?.Close?.();
                      navigate(action.link_to);
                    }
                  }}
                  type={action.emph ? "emph" : undefined}
                >
                  {global_var.use_eng ? action.text_eng : action.text}
                </Button>
              ))}
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_region" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng ? ["Region Properties"] : ["구역 속성"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "The Total Design Score will be calculated differently depending on the Region you selected",
                    ]
                  : [
                      "선택한 구역에 따라 종합 디자인점수의 점수 산정이 달라져요.",
                    ]}
              </TextBox>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "Topography : [ H/L elev + S/N slope ]",
                      "Certain facilities get a point deduction, depending on the Topography properties.",
                    ]
                  : [
                      "지형 속성 : [ 고/저지대 + 남/북사면 ]",
                      "특정 시설의 점수는 지형 속성에 따라 감점되기도 해요!",
                    ]}
              </TextBox>
              <AutoLayout type="row" fillX>
                <div className={cx("frame-popup-image-framed")}>
                  <CustomImage
                    srcset={
                      global_var.use_eng
                        ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/region_info/01.png"
                        : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/region_info/01.png"
                    }
                    width={120}
                    height={120}
                  />
                </div>
                <TextBox type="sentence" align="center">
                  {global_var.use_eng
                    ? [
                        "[Example]",
                        "Topography: 'L.elev+N.slope'",
                        "The 'Solar Panels' score",
                        "is reduced by 1.",
                      ]
                    : [
                        "[ 예시 ]",
                        "지형 속성: '저지대+북사면'",
                        "'태양광 패널'의 점수가",
                        "1점씩 감점됩니다.",
                      ]}
                </TextBox>
              </AutoLayout>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [
                      "Incentive : [Landscape/Public/None]",
                      "When calculating Total Design Score, the certain metric score gets extra weight depending on the Incentive properties.",
                    ]
                  : [
                      "가점 속성 : [ 경관/공공/없음 ]",
                      "종합 디자인 점수 산정 시 구역 가점에 따라 특정 점수에 가산점이 부여됩니다.",
                    ]}
              </TextBox>
              <AutoLayout type="row" fillX>
                <div className={cx("frame-popup-image-framed")}>
                  <CustomImage
                    srcset={
                      global_var.use_eng
                        ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/region_info/02e.png"
                        : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/region_info/02.png"
                    }
                    width={120}
                    height={120}
                  />
                </div>
                <TextBox type="sentence" align="center">
                  {global_var.use_eng
                    ? [
                        "[Example]",
                        "Incentive: 'Public'",
                        "120% incentive for",
                        "Public Contributions!",
                      ]
                    : [
                        "[ 예시 ]",
                        "가점 속성: '공공'",
                        "종합 디자인점수 산정 시",
                        "공공 기여성 가점 부여!",
                      ]}
                </TextBox>
              </AutoLayout>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button
              onClick={() => {
                onClick?.Close?.();
              }}
            >
              {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
            </Button>
          </div>
        </div>
      )}
      {new_type?.split(":")?.includes("illust_build") && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {global_var.use_eng
                ? [building_data[new_type?.split(":")?.[1]].section_eng]
                : [building_data[new_type?.split(":")?.[1]].section]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {global_var.use_eng
                  ? [building_data[new_type?.split(":")?.[1]].illust_eng]
                  : [building_data[new_type?.split(":")?.[1]].illust]}
              </TextBox>
              <AutoLayout gap={1.5} fillX align="left">
                {building_data[new_type?.split(":")?.[1]].contents.map(
                  (e2, idx2) => (
                    <AutoLayout type="row" gap={1} fillX key={idx2}>
                      <AutoLayout gap={0.25}>
                        <div className={cx("frame-small-image")}>
                          <img src={e2.image_path}></img>
                        </div>
                        <div className={cx("text-small-frame")}>
                          <AutoLayout align="center" fillX>
                            <div
                              className={cx(
                                "text-small",
                                e2.name?.split("_")?.length > 1
                                  ? ""
                                  : _getStrLenWhenHangeulIs2(e2.name) > 12
                                  ? "condensed"
                                  : _getStrLenWhenHangeulIs2(e2.name) > 10
                                  ? "semi-condensed"
                                  : ""
                              )}
                            >
                              {global_var.use_eng
                                ? e2.name_eng
                                : e2.name?.split("_")?.join(" ")}
                            </div>
                          </AutoLayout>
                        </div>
                      </AutoLayout>
                      <AutoLayout fillX>
                        <TextBox type="sentence" grey>
                          {[
                            (global_var.use_eng
                              ? "L.level : "
                              : "경관레벨 : ") +
                              _getCircledScore(
                                global_data.this_region_data?.bldg_score_data?.[
                                  e2.bldg_name
                                ]?.l
                              ),
                            (global_var.use_eng
                              ? "D.level : "
                              : "개발레벨 : ") +
                              _getCircledScore(
                                global_data.this_region_data?.bldg_score_data?.[
                                  e2.bldg_name
                                ]?.b
                              ),
                            (global_var.use_eng
                              ? "P.level : "
                              : "공공레벨 : ") +
                              _getCircledScore(
                                global_data.this_region_data?.bldg_score_data?.[
                                  e2.bldg_name
                                ]?.p
                              ),
                            (global_var.use_eng
                              ? "Penalty : "
                              : "감점지형 : ") +
                              (global_data.this_region_data?.bldg_score_data?.[
                                e2.bldg_name
                              ]?.minus?.length === 0
                                ? global_var.use_eng
                                  ? "None"
                                  : "없음"
                                : global_data.this_region_data?.bldg_score_data?.[
                                    e2.bldg_name
                                  ]?.minus
                                    ?.map((e) =>
                                      global_var.use_eng ? e?.eng : e?.kor
                                    )
                                    .join(global_var.use_eng ? " + " : " + ")),
                          ]}
                        </TextBox>
                        <TextBox type="sentence" grey>
                          {[global_var.use_eng ? e2.illust_eng : e2.illust]}
                        </TextBox>
                      </AutoLayout>
                    </AutoLayout>
                  )
                )}
              </AutoLayout>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button
              onClick={() => {
                setNewType("build");
              }}
            >
              {global_var.use_eng ? ["Back"] : ["뒤로 가기"]}
            </Button>
          </div>
        </div>
      )}
      {new_type === "already_uploaded_before" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {[
                global_var.use_eng
                  ? "You've already uploaded a design before. If you upload a new design, the old data will be deleted. Do you want to upload it?"
                  : "이미 이전에 디자인을 업로드 한 적이 있어요. 새롭게 디자인을 업로드하면 이전 데이터는 사라져요. 업로드하시겠어요?",
              ]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button
                onClick={() => {
                  onClick.Close();
                }}
              >
                {global_var.use_eng ? "Return" : "돌아가기."}
              </Button>
              <Button
                onClick={() => {
                  getAsyncRankability(
                    global_data,
                    setGlobalData,
                    global_var,
                    setGlobalVar
                  )
                    .then((res) => {
                      if (res.rankable) {
                        setGlobalVar({
                          upload_design_info: true,
                          rankable: true,
                        });
                        setGlobalData({
                          overlapping_users: res.overlapping_users,
                          overlapping_users_above_me:
                            res.overlapping_users_above_me,
                        });
                        onClick.Close();
                      } else {
                        setInternalData({
                          min_score_to_be_ranked: res.min_score_to_be_ranked,
                          overlapping_users_above_me:
                            res.overlapping_users_above_me,
                        });
                        setNewType("unrankable_design");
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                      setGlobalData({ error: "get_network_error" });
                    });
                }}
                type="emph"
              >
                {global_var.use_eng ? "Upload" : "업로드하기."}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "unrankable_design" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {global_var.use_eng
                ? [
                    "Other designs that overlap your designed area have a higher score.",
                    "",
                    `You need to earn a higher score than ${_getThousandSepStrFromNumber(
                      Math.round(
                        (internal_data?.min_score_to_be_ranked || 0) * 10000
                      )
                    )}pts to get your name on the Masterplan Page.`,
                    "",
                    "Of course, you can find your design data regardless of a score by searching for your name on the Masterplan Page!",
                    "",
                    "Want to upload your data?",
                  ]
                : [
                    `당신의 디자인 영역과 겹치는 다른 디자인이 있어요.`,
                    "",
                    `그 중 ${internal_data.overlapping_users_above_me.length}명의 점수가 더 높아요.`,
                    "",
                    `마스터플랜 페이지에 이름을 올리려면 ${_getThousandSepStrFromNumber(
                      Math.round(
                        (internal_data.min_score_to_be_ranked || 0) * 10000
                      )
                    )}점보다 더 높은 점수를 획득해야 해요.`,
                    "",
                    "물론, 마스터플랜 페이지에서 이름을 검색하면 점수와 상관없이 디자인 정보 확인이 가능해요!",
                    "",
                    "데이터를 업로드하시겠어요?",
                  ]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button
                onClick={() => {
                  onClick.Close();
                }}
              >
                {global_var.use_eng ? "Return" : "더 디자인하기"}
              </Button>
              <Button
                onClick={() => {
                  setGlobalVar({ upload_design_info: true, rankable: false });
                  onClick.Close();
                }}
                type="emph"
              >
                {global_var.use_eng ? "Upload Data" : "데이터 업로드"}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "put_design_data_success" && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {global_var.use_eng
                ? [
                    "Your design have uploaded to the SBAU2023 server!",
                    "",
                    "The design data is uploaded with an updated scoring criteria, so your score has probably changed a bit! ",
                    "",
                    "Now only the final step is left! Would you like to proceed?",
                  ]
                : [
                    "디자인이 SBAU2023 서버에 업로드됐어요!",
                    "",
                    "여러분의 디자인 정보가 새로운 점수 기준으로 반영되었어요. 그래서 점수가 조금 바뀌었을 거예요!",
                    "",
                    "이제 마지막 단계가 남았네요! 계속 진행하시겠어요?",
                  ]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button
                onClick={() => {
                  setGlobalVar({ design_finished: true });
                  onClick.Close();
                }}
              >
                {global_var.use_eng ? "Return" : "돌아가기"}
              </Button>
              <Button
                onClick={() => {
                  setGlobalVar({ design_finished: true });
                  const timeout_id = setTimeout(() => {
                    setNewType("link_copied_so_visit_linktree_noclipboard");
                  }, 500);
                  window.navigator.clipboard
                    .writeText("https://seoulpanorama2123.com")
                    .then(() => {
                      clearTimeout(timeout_id);
                      setTimeout(() => {
                        setNewType("link_copied_so_visit_linktree");
                      }, 100);
                    });
                }}
                type="emph"
              >
                {global_var.use_eng ? "The Final Step!" : "마지막 단계로!"}
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {(new_type === "link_copied_so_visit_linktree" ||
        new_type === "link_copied_so_visit_linktree_noclipboard") && (
        <div className={cx("wrapper-lightgrey")} id={new_type}>
          <PopupCard key={new_type}>
            <TextBox type="sentence" align="center">
              {global_var.use_eng
                ? [
                    ">>>Mission Clear! Congratulations!<<<",
                    "",
                    ...(new_type === "link_copied_so_visit_linktree"
                      ? [
                          "Mobile exhibition link",
                          "is copied to the clipboard.",
                          `I'd be grateful if you could share it widely!`,
                        ]
                      : []),
                    "",
                    "Would you like to visit the Masterplan page to explore other citizens' designs?",
                    "",
                    "Check out research notes and open-source files on our Linktree!",
                    "",
                    "For more detailed information, you can visit The Seoul Hall Of Urbanism & Architecture!",
                  ]
                : [
                    ">>>미션 클리어! 축하드립니다!<<<",
                    "",
                    ...(new_type === "link_copied_so_visit_linktree"
                      ? [
                          "모바일 전시 링크를",
                          "클립보드에 복사해 두었어요.",
                          "널리 공유해주시면 감사하겠습니다!",
                        ]
                      : []),
                    "",
                    "그럼 다른 시민들의 디자인을 구경하러 마스터플랜 페이지로 이동할까요?",
                    "링크트리에서 연구노트, 오픈소스 파일도 확인해 보세요!",
                    "",
                    "더 자세한 내용은 서울도시건축전시관에서 관람하실 수 있습니다!",
                  ]}
            </TextBox>
            <Button
              type="emph"
              onClick={() => {
                window.open(
                  "https://seoulpanorama2123.com/masterplan",
                  "https://seoulpanorama2123.com/masterplan"
                );
              }}
            >
              {global_var.use_eng
                ? "Vist The Masterplan Page!"
                : "마스터플랜 페이지 가기"}
            </Button>
            <Button
              onClick={() => {
                window.navigator.share({
                  url: "https://seoulpanorama2123.com",
                  text: "서울도시건축비엔날레2023-서라벌전경2123",
                  title: "SBAU2023",
                });
              }}
            >
              {global_var.use_eng
                ? "Share The Exhibition Link!"
                : "모바일 전시링크 공유하기"}
            </Button>
            <Button
              onClick={() => {
                window.open(
                  "https://www.linktr.ee/sbau2023",
                  "https://www.linktr.ee/sbau2023"
                );
              }}
            >
              {global_var.use_eng
                ? "Seoul Panorama 2123 Linktree!"
                : "서라벌전경 2123 링크트리로 이동"}
            </Button>
            <Button
              onClick={() => {
                onClick.Close();
              }}
            >
              {global_var.use_eng ? "Close" : "닫기"}
            </Button>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_easter_egg" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="sentence" align="center">
              {global_var.use_eng
                ? [">>'Animal Protector'!<<"]
                : [">>당신은 명예 동물보호사!<<"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence" align="left">
                {global_var.use_eng
                  ? [
                      "This lot is a haven for animals. Please don't enclose it with developed lots so animals can come and go!",
                    ]
                  : [
                      "여기는 동물들의 보금자리예요. 동물들이 드나들 수 있도록 둘러싸서 개발하지 말아 주세요!",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/animal/01.png"
                  width={575}
                  height={485}
                />
              </div>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/animal/02.png"
                  width={575}
                  height={485}
                />
              </div>

              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button
              onClick={() => {
                onClick.Close();
              }}
            >
              {global_var.use_eng ? "OK. Got it!" : "네 알겠어요!"}
            </Button>
          </div>
        </div>
      )}
      {new_type === "once_clicked_big_building" && (
        <div className={cx("wrapper-fixed", "lightgrey")} id={new_type}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="sentence" black>
              {global_var.use_eng
                ? ["The large facility has a different generation process!"]
                : ["대형 시설은 짓는 방식이 달라요!"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence" align="left">
                {global_var.use_eng
                  ? [
                      "Looks like you're about to build a large facility for the first time!",
                      "",
                      "Large facilities can be built regardless of the lot boundaries. As they built, surrounding buildings that overlap will be removed.",
                      "",
                      "It could be difficult to build near the region boundaries or in lots that have already been developed.",
                    ]
                  : [
                      "처음 큰 건물을 지으려고 하시는군요!",
                      "",
                      "큰 시설은 필지의 경계와 상관없이 지을 수 있어요. 큰 시설이 설치되며 겹치는 주변 건물은 지워지게 돼요.",
                      "",
                      "구역 경계나 이미 개발된 필지 인근에서는 짓기 어려울 수 있어요.",
                    ]}
              </TextBox>
              <div className={cx("frame-popup-image")}>
                <CustomImage
                  srcset={
                    global_var.use_eng
                      ? "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/big_bldg/01e.gif"
                      : "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/big_bldg/01.gif"
                  }
                  width={720}
                  height={436}
                />
              </div>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <Button
              onClick={() => {
                setGlobalVar({ once_clicked_big_building: true });
                setNewType("build");
              }}
            >
              {global_var.use_eng ? "OK. Got it!" : "네 알겠어요!"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

PopupCardScenario.defaultProps = { type: "illust_0", setType: () => {} };

export default PopupCardScenario;
