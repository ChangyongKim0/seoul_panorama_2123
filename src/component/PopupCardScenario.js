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

const cx = classNames.bind(styles);

const PopupCardScenario = ({ type, onClick, setType }) => {
  const wrapper = useRef();
  const [new_type, setNewType] = useState(type);
  const [timer, setTimer] = useState(0);

  const building_data = [
    {
      section: "건물 타입",
      contents: [
        { image_path: "/img/build/building/01.png", name: "단독주택" },
        { image_path: "/img/build/building/02.png", name: "공동주택" },
        { image_path: "/img/build/building/03.png", name: "캐노피" },
        { image_path: "/img/build/building/04.png", name: "상업시설" },
        { image_path: "/img/build/building/05.png", name: "오피스" },
      ],
    },
    {
      section: "인프라 타입",
      contents: [
        { image_path: "/img/build/infra/01.png", name: "어떤인프라" },
        { image_path: "/img/build/infra/02.png", name: "좀더 긴 인프라" },
        { image_path: "/img/build/infra/03.png", name: "캐노피" },
        { image_path: "/img/build/infra/04.png", name: "공원" },
      ],
    },
    {
      section: "공공 대형 건축",
      contents: [
        { image_path: "/img/build/public/01.png", name: "데이터센터" },
        { image_path: "/img/build/public/02.png", name: "공공청사" },
      ],
    },
  ];

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

  return (
    <>
      {new_type === "download_0" && (
        <div className={cx("wrapper-white")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={0.5} fillX>
              <TextBox type="narration-black" align="center">
                {["[서벌전경 2123]", "ver 3.2.1"]}
              </TextBox>
              <AutoLayout gap={0} fillX>
                <TextBox type="narration-black" align="center">
                  {["다운로드중..."]}
                </TextBox>
                <Divider black />
                {[
                  "[건축적 튜링테스트]를 획득하셨습니다!",
                  "[서울마스터플랜 프로그램]을 획득하셨습니다!",
                  "[어떤 건축가의 연구노트]를 획득하셨습니다!",
                  "[라이노 모델링 파일]를 획득하셨습니다!",
                  "[그래스하퍼 파일]을 획득하셨습니다!",
                  "[SBAU 2023 입장권]를 획득하셨습니다!",
                ].map((e, idx) => (
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
              <img
                src="/img/download/01.png"
                className={cx("frame-intro-02")}
              />
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "download_1" && (
        <div className={cx("wrapper-white")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={0.5} fillX>
              <TextBox type="narration-black" align="center">
                {["[서벌전경 2123]", "ver 3.2.1"]}
              </TextBox>
              <AutoLayout gap={0} fillX>
                <TextBox type="narration-black" align="center">
                  {["다운로드 파일"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {["[건축적 튜링테스트] 확인하시겠습니까?"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {[
                    "건축적 튜링테스트를 통해 여러분은 기계가 만들어낸 인공적인 도시,건축 이미지를 마주하게 될 것이다...",
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
        <div className={cx("wrapper-white")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={0.5} fillX>
              <TextBox type="narration-black" align="center">
                {["[서벌전경 2123]", "ver 3.2.1"]}
              </TextBox>
              <AutoLayout gap={0} fillX>
                <TextBox type="narration-black" align="center">
                  {["다운로드 파일"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {["[서울마스터플랜 프로그램]을 실행할까요?"]}
                </TextBox>
                <Divider black />
                <TextBox type="narration-black" align="center">
                  {[
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
        <div className={cx("wrapper-lightgrey")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <TextBox type="sentence">
                {[
                  "디자인하고 싶은 위치를 선택해주세요.",
                  "여러 위치를 한꺼번에 선택할 수 있어요.",
                ]}
              </TextBox>
              <TextBox type="sentence">
                {["이미 선택한 위치를 다시 누르면", "선택 대상에서 사라져요."]}
              </TextBox>
              <img
                src="/img/imageSample.jpg"
                className={cx("frame-popup-image")}
              ></img>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["1 / 4"]}
            </TextBox>
            <Button onClick={() => setNewType("illust_1")}>다음</Button>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_1" && (
        <div className={cx("wrapper-lightgrey")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {[
                    "선택한 위치를 개발하고 싶다면,",
                    "개발하기 아이콘을 눌러요.",
                  ]}
                </TextBox>
                <div className={cx("frame-icon")}>
                  <Icon type="develop" fill size={2.5} />
                </div>
              </AutoLayout>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {[
                    "원래 형태로 되돌리고 싶다면,",
                    "아이콘을 다시 한번 눌러봐요.",
                  ]}
                </TextBox>
                <div className={cx("frame-icon", "emph")}>
                  <Icon type="undevelop" fill size={2.5} />
                </div>
              </AutoLayout>
              <img
                src="/img/imageSample.jpg"
                className={cx("frame-popup-image")}
              ></img>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["2 / 4"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_0")}>이전</Button>
              <Button onClick={() => setNewType("illust_2")}>다음</Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_2" && (
        <div className={cx("wrapper-lightgrey")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <AutoLayout type="row" attach="space" fillX>
                <TextBox type="sentence">
                  {[
                    "건물, 시설을 설치하고 싶다면,",
                    "건물짓기 아이콘을 눌러요.",
                  ]}
                </TextBox>
                <div className={cx("frame-icon")}>
                  <Icon type="build" fill size={2.5} />
                </div>
              </AutoLayout>
              <TextBox type="sentence">
                {[
                  "건물을 짓거나 허물고 싶다면,",
                  "아이콘을 다시 한번 눌러봐요.",
                ]}
              </TextBox>
              <img
                src="/img/imageSample.jpg"
                className={cx("frame-popup-image")}
              ></img>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["3 / 4"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_1")}>이전</Button>
              <Button onClick={() => setNewType("illust_3")}>다음</Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {new_type === "illust_3" && (
        <div className={cx("wrapper-lightgrey")}>
          <PopupCard key={new_type}>
            <AutoLayout gap={1} fill>
              <TextBox type="sentence">
                {[
                  "개발 영역, 설치한 정도에 따라",
                  "마스터플랜 디자인의 점수가 매겨져요.",
                ]}
              </TextBox>
              <TextBox type="sentence">
                {["점수가 80점을 넘기면,", "다른 사람에게도 공유할 수 있어요!"]}
              </TextBox>
              <img
                src="/img/imageSample.jpg"
                className={cx("frame-popup-image")}
              ></img>
            </AutoLayout>
            <TextBox type="section" lightgrey align="center">
              {["4 / 4"]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("illust_2")}>이전</Button>
              <Button onClick={() => onClick?.Close?.()} type="emph">
                시작해봐요!
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
      {(new_type === "build" || new_type === "build_and_unbuild") && (
        <div className={cx("wrapper-fixed", "lightgrey")}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["건물 또는 시설 설치하기"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              {building_data.map((e, idx) => {
                return (
                  <AutoLayout gap={1} fillX key={idx}>
                    <TextBox type="section" black>
                      {[e.section]}
                    </TextBox>
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
                              if (e2.name === "공동주택") {
                                setNewType("caution_height");
                              } else if (e.section === "공공 대형 건축") {
                                setNewType("caution_largebldg_info");
                              } else {
                                onClick?.Build?.(e2.name);
                                onClick?.Close?.();
                              }
                            }}
                          >
                            <div className={cx("frame-small-image")}>
                              <img src={e2.image_path}></img>
                            </div>
                            <div className={cx("text-small")}>{e2.name}</div>
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
            {new_type === "build" ? (
              <Button onClick={() => onClick?.Close?.()}>뒤로 가기</Button>
            ) : (
              <AutoLayout type="row" gap={1} fillX>
                <Button onClick={() => onClick?.Close?.()}>뒤로 가기</Button>
                <Button
                  onClick={() => {
                    onClick?.Close?.();
                    onClick?.Unbuild?.();
                  }}
                  type="emph"
                >
                  건물 부수기
                </Button>
              </AutoLayout>
            )}
          </div>
        </div>
      )}
      {new_type === "caution_height" && (
        <div className={cx("wrapper-lightgrey")}>
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
        <div className={cx("wrapper-fixed", "lightgrey")}>
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
                src="/img/caution_height_info/01.png"
              />
              <TextBox type="sentence">
                {["추가로 쓸 내용이 있다면 이렇게"]}
              </TextBox>
              <img
                className={cx("frame-popup-image")}
                src="/img/caution_height_info/02.png"
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
        <div className={cx("wrapper-fixed", "lightgrey")}>
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
                src="/img/caution_largebldg_info/01.png"
              />
              <TextBox type="sentence">
                {["추가로 쓸 내용이 있다면 이렇게"]}
              </TextBox>
              <img
                className={cx("frame-popup-image")}
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
        <div className={cx("wrapper-lightgrey")}>
          <PopupCard key={new_type}>
            <TextBox type="section" black>
              {["나의 디자인 점수는?"]}
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
                  title_left="자연친화성"
                  title_right="47/100"
                  percent={0.47}
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
                  title_left="공공성"
                  title_right="97/100"
                  percent={0.97}
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
                  title_left="사업성"
                  title_right="42/100"
                  percent={0.42}
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
                  type="emph"
                  title_left="종합 디자인 점수"
                  title_right="82/100"
                  percent={0.82}
                  border
                />
              </Button>
            </AutoLayout>
            <Button onClick={() => onClick?.Close?.()}>
              좀 더 디자인하러 가기
            </Button>
          </PopupCard>
        </div>
      )}
      {new_type === "score_green" && (
        <div className={cx("wrapper-fixed", "lightgrey")}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["자연친화성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {[
                  "자연과 공존하는 삶을 위해 우리는 더 많은 공원과 녹지를 확보해야 해요.",
                  "",
                  "그래서 개발면적 대비 공원 및 녹지가 차지하는 정도를 자연친화성의 척도로 삼기로 했어요.",
                ]}
              </TextBox>
              <Histogram
                data={{
                  values: [0.7, 0.45, 0.2, 0.15, 0, 0.1, 0.05, 0, 0, 0],
                  average: 0.12,
                }}
              />
              <TextBox type="sentence">
                {[
                  "지금껏 디자인을 업로드한 시민 건축가 분들은 평균 12% 비율의 공원녹지를 계획해 주셨어요! ",
                  "",
                  "12% 비율일 때를 기준으로 두고, 더 많은 공원과 녹지를 만들어 주실수록 더 많은 점수를 드리려고 해요.",
                ]}
              </TextBox>
              <ScoreGraph />
              <TextBox type="sentence">
                {["그럼 다시 디자인하러 돌아가 볼까요?"]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>뒤로 가기</Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                디자인하러 가기
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "score_public" && (
        <div className={cx("wrapper-fixed", "lightgrey")}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["공공성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {[
                  "우리가 살아가기 위해서는 수많은 건물과 시설이 필요해요.",
                  "",
                  "수도 · 전기 · 도로 등 기본적인 시설은 물론이고, 학교 · 소방서 · 동사무소와 같이 필수적인 공공 서비스를 제공하는 건물도 필요해요.",
                  "",
                  "전시관, 체육센터, 도서관과 같은 공공건물은 누구에게나 즐거운 경험을 주고, 높은 질의 생활을 할 수 있게 해줘요.",
                ]}
              </TextBox>
              <div></div> <div></div> <div></div> <div></div>
              <TextBox type="sentence">
                {[
                  "지금껏 디자인을 업로드한 시민 건축가 분들은 평균 12% 비율의 공원녹지를 계획해 주셨어요! ",
                  "",
                  "12% 비율일 때를 기준으로 두고, 더 많은 공원과 녹지를 만들어 주실수록 더 많은 점수를 드리려고 해요.",
                ]}
              </TextBox>
              <TextBox type="sentence">
                {["그럼 다시 디자인하러 돌아가 볼까요?"]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>뒤로 가기</Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                디자인하러 가기
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "score_profit" && (
        <div className={cx("wrapper-fixed", "lightgrey")}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["수익성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {[
                  "자연과 공존하는 삶을 위해 우리는 더 많은 공원과 녹지를 확보해야 해요.",
                  "",
                  "그래서 개발면적 대비 공원 및 녹지가 차지하는 정도를 자연친화성의 척도로 삼기로 했어요.",
                ]}
              </TextBox>
              <div></div> <div></div> <div></div> <div></div>
              <TextBox type="sentence">
                {[
                  "지금껏 디자인을 업로드한 시민 건축가 분들은 평균 12% 비율의 공원녹지를 계획해 주셨어요! ",
                  "",
                  "12% 비율일 때를 기준으로 두고, 더 많은 공원과 녹지를 만들어 주실수록 더 많은 점수를 드리려고 해요.",
                ]}
              </TextBox>
              <TextBox type="sentence">
                {["그럼 다시 디자인하러 돌아가 볼까요?"]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>뒤로 가기</Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                디자인하러 가기
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "score_total" && (
        <div className={cx("wrapper-fixed", "lightgrey")}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["자연친화성이란?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {[
                  "자연과 공존하는 삶을 위해 우리는 더 많은 공원과 녹지를 확보해야 해요.",
                  "",
                  "그래서 개발면적 대비 공원 및 녹지가 차지하는 정도를 자연친화성의 척도로 삼기로 했어요.",
                ]}
              </TextBox>
              <div></div> <div></div> <div></div> <div></div>
              <TextBox type="sentence">
                {[
                  "지금껏 디자인을 업로드한 시민 건축가 분들은 평균 12% 비율의 공원녹지를 계획해 주셨어요! ",
                  "",
                  "12% 비율일 때를 기준으로 두고, 더 많은 공원과 녹지를 만들어 주실수록 더 많은 점수를 드리려고 해요.",
                ]}
              </TextBox>
              <TextBox type="sentence">
                {["그럼 다시 디자인하러 돌아가 볼까요?"]}
              </TextBox>
              <div className={cx("frame-bottom")}></div>
            </AutoLayout>
          </div>
          <div className={cx("frame-footer", "lightgrey")}>
            <AutoLayout type="row" gap={1} fillX>
              <Button onClick={() => setNewType("score")}>뒤로 가기</Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                디자인하러 가기
              </Button>
            </AutoLayout>
          </div>
        </div>
      )}
      {new_type === "logic" && (
        <div className={cx("wrapper-fixed", "lightgrey")}>
          <div className={cx("frame-header", "lightgrey")}>
            <TextBox type="section" black>
              {["디자인 원리는 어떻게 되나요?"]}
            </TextBox>
          </div>
          <div className={cx("frame-scroll")}>
            <AutoLayout gap={1} padding={1} fill>
              <div className={cx("frame-top")}></div>
              <TextBox type="sentence">
                {["필지 구획 원리가 궁금하신가요?"]}
              </TextBox>
              <img
                src="/img/logic/01.png"
                className={cx("frame-popup-image")}
              />
              <TextBox type="sentence">{["추가 내용 쓰기"]}</TextBox>{" "}
              <img
                src="/img/logic/02.png"
                className={cx("frame-popup-image")}
              />
              <TextBox type="sentence">
                {["그럼 다시 디자인하러 돌아가 볼까요?"]}
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
              네 알겠어요!
            </Button>
          </div>
        </div>
      )}
      {new_type === "credit" && (
        <div className={cx("wrapper-lightgrey")}>
          <AutoLayout gap={1} padding={1} fill>
            <TextBox type="section" black align="center">
              {["서울도시건축비엔날레 2023", "<서벌전경 2123> 팀"]}
            </TextBox>

            <TextBox type="sentence" align="center">
              {[
                "전지용 : 전시총괄",
                "",
                "김창용 : 온라인 전시 기획 및 개발",
                "",
                "이재진 : 온라인 전시 기획 및 제작",
                "",
                "장미래: 오프라인 전시 기획 및 제작",
                "",
                "박성진: 디오라마 모형 제작",
                "",
                "홍샘: 오프라인 전시 제작",
              ]}
            </TextBox>

            <Button
              onClick={() => {
                onClick?.Close?.();
              }}
            >
              닫기
            </Button>
          </AutoLayout>
        </div>
      )}
      {new_type === "caution_exit" && (
        <div className={cx("wrapper-lightgrey")}>
          <PopupCard key={new_type}>
            <TextBox type="sentence">
              {[
                "이전 단계로 돌아가시면 진행중이던 디자인이 사라져요! 괜찮으신가요?",
                "",
                "새로운 장소에서 다시 시작해볼까요?",
              ]}
            </TextBox>
            <AutoLayout type="row" gap={1} fillX>
              <Button link_to="/map">다시 시작</Button>
              <Button
                onClick={() => {
                  onClick?.Close?.();
                }}
                type="emph"
              >
                계속하기
              </Button>
            </AutoLayout>
          </PopupCard>
        </div>
      )}
    </>
  );
};

PopupCardScenario.defaultProps = { type: "illust_0", setType: () => {} };

export default PopupCardScenario;

// ### Card

// - shape: default / rectangle
// - children: any
// - padding: int
// - clickable: boolean
// - transparent: boolean
// - onClick: ()=>any
// - use_tooltip: boolean
// - tooltip: [any]
// - tight: boolean
