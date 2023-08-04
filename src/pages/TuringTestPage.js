import React, { useEffect, useReducer, useState, useRef } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./TuringTestPage.module.scss";
import { _transformScroll } from "../util/alias";
import AutoLayout from "../component/AutoLayout";
import Animation from "../component/Animation";
import Header from "../component/Header";
import TextBox from "../component/TextBox";
import Slider from "../component/Slider";
import ImageCard from "../component/ImageCard";
import Button from "../component/Button";
import { Link } from "react-router-dom";
import ChartBar from "../component/ChartBar";
import Divider from "../component/Divider";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import PopupCardScenario from "../component/PopupCardScenario";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const TuringTestPage = ({ match }) => {
  const image_card_list = [
    {
      title: "A",
      subtitle: "분지를 점령한 데이터 센터",
      image_path: "/img/turing_test/01.png",
    },
    {
      title: "B",
      subtitle: "나무를 대체한 태양광 패널 ",
      image_path: "/img/turing_test/02.png",
    },
    { title: "C", subtitle: "산의 지하를 파고드는 데이터 센터", image_path: "/img/turing_test/03.png" },
    { title: "D", subtitle: "기후조절이 가능한 대규모 온실도시", image_path: "/img/turing_test/04.png" },
    { title: "E", subtitle: "사막을 뒤덮은 태양광 발전시설", image_path: "/img/turing_test/05.png" },
    { title: "F", subtitle: "황무지의 데이터 센터", image_path: "/img/turing_test/06.png" },
    { title: "G", subtitle: "컨테이너로 가득 찬 도시", image_path: "/img/turing_test/07.png" },
    { title: "H", subtitle: "숲을 이루는 풍력 터빈", image_path: "/img/turing_test/08.png" },
    { title: "I", subtitle: "깊은 산 속의 대규모 변전시설", image_path: "/img/turing_test/09.png" },
  ];
  const [image_card_click_data, setImageCardClickData] = useState({
    each: [
      {
        type: "small-emph",
        title_left: "A",
        title_right: "74%",
        percent: 0.74,
      },
      {
        type: "small",
        title_left: "B",
        title_right: "56%",
        percent: 0.57,
      },
      {
        type: "small",
        title_left: "C",
        title_right: "92%",
        percent: 0.92,
      },
      {
        type: "small",
        title_left: "D",
        title_right: "34%",
        percent: 0.34,
      },
      {
        type: "small",
        title_left: "E",
        title_right: "22%",
        percent: 0.22,
      },
      {
        type: "small",
        title_left: "F",
        title_right: "67%",
        percent: 0.67,
      },
      {
        type: "small",
        title_left: "G",
        title_right: "35%",
        percent: 0.35,
      },
      {
        type: "small",
        title_left: "H",
        title_right: "40%",
        percent: 0.4,
      },
      {
        type: "small-emph",
        title_left: "I",
        title_right: "80%",
        percent: 0.8,
      },
    ],
    total: {
      type: "emph",
      title_left: "정답! 46%",
      title_right: "오답! 54%",
      percent: 0.54,
      right: true,
    },
  });
  const [scrollable, setScrollable] = useState(false);
  const [open_overlay, setOpenOverlay] = useState(false);
  const [open_popup, setOpenPopup] = useState(false);
  const [popup_type, setPopupType] = useState("download_2");
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [open_nav_overlay, setOpenNavOverlay] = useState(false);
  const [card_clicked_state, setCardClickedState] = useReducer((prev, curr) => {
    // console.log(curr);
    return { ...prev, ...curr };
  }, {});

  const next_section = useRef();

  useEffect(() => {
    if (scrollable) {
      next_section.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollable]);

  useEffect(() => {
    if (global_data.error) {
      setTimeout(
        () => setGlobalVar({ open_overlay: true, popup_type: "error" }),
        0
      );
    }
  }, [global_data.error]);

  return (
    <div className={cx("wrapper")}>
      <Header />
      <div className={cx("frame-content-wrapper")}>
        <div
          className={cx(
            "frame-content",
            (scrollable ? "" : "not-") + "scrollable"
          )}
        >
          <AutoLayout type="column" padding={1} gap={1}>
            <div className={cx("frame-top")}></div>
            <TextBox type="title-fill" hug>
              {["ARCHITECTURAL TURING TEST"]}
            </TextBox>
            <TextBox type="narration" black>
              {[
                "다음 사진들 중, 인공지능이 생성한 후기-인류세 풍경은? (정답은 2개입니다!)",
              ]}
            </TextBox>
            <div className={cx("frame-slider")}>
              <Slider gap={1} padding={3}>
                {image_card_list.map((e, idx) => {
                  return (
                    <ImageCard
                      key={idx}
                      {...e}
                      onClick={(state) => {
                        const data = {};
                        data[e.title] = state === "clicked" ? true : false;
                        setCardClickedState(data);
                      }}
                    />
                  );
                })}
              </Slider>
            </div>
            <Button
              type="normal"
              onClick={() => {
                if (
                  Object.keys(card_clicked_state).filter(
                    (key) => card_clicked_state[key] === true
                  ).length !== 2
                ) {
                  setGlobalData({ error: "click_two_cards" });
                } else {
                  setScrollable(true);
                  next_section.current.scrollIntoView({ behavior: "smooth" });
                }
                // window.scrollBy(0, -100);
              }}
            >
              정답 확인하기
            </Button>
            <div className={cx("frame-middle")} ref={next_section}></div>
            <TextBox type="warning" align={"center"} hug>
              {["경고! 경고! 경고! 경고!"]}
            </TextBox>
            <AutoLayout gap={0} fillX>
              <Divider emph black />
              <TextBox type="subtitle" align={"center"} black>
                {[
                  Object.keys(card_clicked_state).reduce((prev, curr) => {
                    console.log(curr);
                    if (
                      card_clicked_state[curr] &&
                      !["A", "I"].includes(curr)
                    ) {
                      return false;
                    }
                    return prev;
                  }, true)
                    ? "대단해요! 당신은 인공지능 감별사!"
                    : "아쉽게도 맞추지 못했어요ㅜㅜㅜ",
                  "",
                  "사진 (A)와 (I)는 인공지능 모델",
                  "‘Dalle 2’에 의해 생성되었습니다! 🤖",
                ]}
              </TextBox>
              <Divider emph black />
            </AutoLayout>
            <TextBox type="section" align={"center"} black>
              {["Prompt"]}
            </TextBox>
            <TextBox type="narration" align={"center"} black>
              {[
                `“Post-anthropocene data centers are covering mountains in Seoul”`,
                "",
                `“후기-인류세 데이터센터가 서울의 산을 뒤덮고 있습니다”`,
              ]}
            </TextBox>{" "}
            <Divider opaque />
            <div className={cx("frame-ai")}>
              <AutoLayout type="row" fillX gap={1} attach="center">
                <ImageCard
                  image_path={"/img/turing_test/01.png"}
                  type="disabled"
                />
                <TextBox type="section" black hug>
                  {["A. I."]}
                </TextBox>
                <ImageCard
                  image_path={"/img/turing_test/09.png"}
                  type="disabled"
                />
              </AutoLayout>
            </div>
            <Divider opaque />
            <TextBox type="section" black align="center">
              {["건축적 튜링테스트 결과!"]}
            </TextBox>
            <AutoLayout gap={0.5} fillX>
              {image_card_click_data.each.map((e, idx) => {
                return <ChartBar key={idx} {...e}></ChartBar>;
              })}
            </AutoLayout>
            <AutoLayout gap={0.5} fillX>
              <div className={cx("frame-emph")}>
                <ChartBar {...image_card_click_data.total}></ChartBar>
              </div>
              <TextBox align="right" type="narration" black>
                {["무려 54%의 사람들이", "정답을 맞추지 못했어요."]}
              </TextBox>
            </AutoLayout>
            <Divider opaque />
            <Divider opaque />
            <Divider emph black />
            <TextBox type="section" align="center" black>
              {["건축적 튜링테스트 해설"]}
            </TextBox>
            <img
              className={cx("frame-image")}
              src="/img/turing_test/10.png"
            ></img>
            <Divider opaque />
            <TextBox type="narration" grey>
              {[
                "오답:",
                "",
                "(B) - 중국 산시성 중부에 위치한 루이청 현의 태양광 패널 설치 모습",
                "",
                "(C) - 중국 구이저우 성 위치한 산 아래에 건설된 데이터 센터",
                "",
                "(D) - 24시간 내내 작물을 재배하는 네덜란드의 자동화 기후 제어 농장.",
                "",
                "(E) - 모하비 사막에 위치한 구글의 이반파 태양열 발전소",
                "",
                "(F) - 유타주 이글 마운틴에 건설 중인 페이스북 데이터 센터",
                "",
                "(G) - 부산시에 위치한 대한민국 최대 규모의 항구인 부산항",
                "",
                "(H) - 캘리포니아 팜 스프링스 인근의 거대 풍력 터빈",
              ]}
            </TextBox>
            <Divider emph black /> <Divider opaque />
            <Divider opaque />
            <TextBox type="warning" hug>
              {["위험! 위험! 위험! 위험!"]}
            </TextBox>
            <img
              className={cx("frame-image")}
              src="/img/turing_test/11.png"
            ></img>
            <TextBox type="narration" black>
              {[
                "<건축적 튜링테스트>는 인공지능으로 생성된 허구 이미지와 [후기-인류세] 건축이 파괴적으로 바꾸고 있는 실제 풍경을 구별하기 위한 테스트이다.",
                "",
                "허구과 현실이 뒤섞여 제시되는 테스트의 사진들은 그 모습이 서로 크게 다르지 않다…",
                "",
                "기계가 만들어낸 후기기계가 만들어낸 후기 인류세의 비현실적 풍경은 이미 현실 세계를 구성하는 일부분이 되고 말았다...",
              ]}
            </TextBox>
            <Divider opaque />
            <Divider opaque />
            <TextBox type="warning" hug>
              {["데이터센터가 출몰했습니다!"]}
            </TextBox>
            <img
              className={cx("frame-image")}
              src="/img/turing_test/12.png"
            ></img>
            <TextBox type="narration" black>
              {[
                "2023년...데이터센터는 실시간 데이터 처리를 위해 코 로케이션이라는 이름으로 서울에 잠입한다…",
                "",
                "자율주행, 메타버스, 인공지능 등 화려한 기술의 이면에 등장한 후기-인류세 건축유형이 서울의 녹지 사이로 서서히 파고들고 있다는 사실을 기억해야 한다…",
                "",
                "도처에 존재하는 이 건축물은 도시의 사각지대 속에서 그 존재를 숨기고 있다. 미래의 기술과 인프라가 우리에게 어떤 대가를 치르게 할지, 우리는 생각할 기회조차 갖지 못하고 있다...",
              ]}
            </TextBox>
            <Divider opaque />
            <Divider opaque />
            <Button
              type="warning"
              onClick={() => {
                setOpenOverlay(true);
                setOpenPopup(true);
              }}
            >
              ⚠ LAUNCH PROGRAM! ⚠
            </Button>
          </AutoLayout>
        </div>
      </div>
      <div className={cx("frame-upper")}>
        <AnimatePresence>
          {open_overlay && (
            <Animation type="fade" useExit absolute>
              <div className={cx("frame-overlay")}>
                <PopupCardScenario type={popup_type} setType={setPopupType} />
              </div>
            </Animation>
          )}
        </AnimatePresence>
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
      <AnimatePresence>
        {open_nav_overlay && (
          <Animation type="fade" useExit absolute>
            <div className={cx("frame-overlay")}></div>
          </Animation>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TuringTestPage;
