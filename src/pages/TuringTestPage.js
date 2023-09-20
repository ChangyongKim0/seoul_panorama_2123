import React, { useEffect, useReducer, useState, useRef, useMemo } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import { Suspense } from "react";
import styles from "./TuringTestPage.module.scss";
import { _API_URL, _transformScroll } from "../util/alias";
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
import axios from "axios";
import CustomImage from "../component/CustomImage";
import { useEffectAfterFirst } from "../hooks/useEffectAfterSecond";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const TuringTestPage = ({ match }) => {
  const [global_var, setGlobalVar] = useGlobalVar();

  const sample_txt = useMemo(
    () => (global_var.use_eng ? "eng" : "한글"),
    [global_var.use_eng]
  );

  const image_card_list = [
    {
      title: "A",
      subtitle: "분지를 점령한 데이터 센터",
      subtitle_eng: "Data center dominating a basin",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/01.png",
    },
    {
      title: "B",
      subtitle: "나무를 대체한 태양광 패널",
      subtitle_eng: "Solar panels replacing trees",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/02.png",
    },
    {
      title: "C",
      subtitle: "산의 지하를 파고드는 데이터 센터",
      subtitle_eng: "Data center burrowing into the mountain",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/03.png",
    },
    {
      title: "D",
      subtitle: `기후조절이 가능한 대규모 온실 도시`,
      subtitle_eng: "A climate-controlled greenhouse city",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/04.png",
    },
    {
      title: "E",
      subtitle: "사막을 뒤덮은 태양광 발전시설",
      subtitle_eng: "Solar farms covering a desert",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/05.png",
    },
    {
      title: "F",
      subtitle: "황무지의 데이터 센터",
      subtitle_eng: "Data center in a wasteland",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/06.png",
    },
    {
      title: "G",
      subtitle: "컨테이너로 가득 찬 도시",
      subtitle_eng: "A city filled with containers",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/07.png",
    },
    {
      title: "H",
      subtitle: "숲을 이루는 풍력 터빈",
      subtitle_eng: "Wind turbines forming an artificial forest",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/08.png",
    },
    {
      title: "I",
      subtitle: "깊은 산 속의 대규모 변전시설",
      subtitle_eng: "Substation complex deep in the mountain",
      image_path:
        "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/09.png",
    },
  ];
  const [image_card_click_data, setImageCardClickData] = useReducer(
    (state, action) => {
      const new_state = { ...state };
      new_state.each.forEach((e) => {
        e.percent = action.each_data[e.title_left] / action.total;
        e.title_right = Math.round(100 * e.percent) + "%";
      });
      new_state.total.percent = 1 - action.correct / action.total;
      new_state.total.title_right =
        (global_var.use_eng ? "Incorrect! " : "오답! ") +
        Math.round(100 * new_state.total.percent) +
        "%";
      new_state.total.title_left =
        (global_var.use_eng ? "Correct! " : "정답! ") +
        (100 - Math.round(100 * new_state.total.percent)) +
        "%";
      return new_state;
    },
    {
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
        title_left: global_var.use_eng ? "Correct! 46%" : "정답! 46%",
        title_right: global_var.use_eng ? "Incorrect! 46%" : "오답! 54%",
        percent: 0.54,
        right: true,
      },
    }
  );
  const [scrollable, setScrollable] = useState(false);
  const [open_overlay, setOpenOverlay] = useState(false);
  const [open_popup, setOpenPopup] = useState(false);
  const [popup_type, setPopupType] = useState("download_2");
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

  useEffectAfterFirst(() => {
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
              {global_var.use_eng
                ? ["ARCHI-TURING TEST"]
                : ["건축적 튜링테스트"]}
            </TextBox>
            <TextBox type="narration" black>
              {global_var.use_eng
                ? [
                    // "Which are the views of [The Post Anthropocene] maded by A.I.? (2 answers!)",
                    "Among these photos of [Post-Anthropocene], choose two photos that are generated by A.I. (Select two correct answers.)",
                  ]
                : [
                    "다음 사진 중, 인공지능이 생성한 후기-인류세 풍경은? (정답은 2개!)",
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
            {!scrollable && <div className={cx("frame-blank-button")}></div>}
            <div className={cx("frame-real-button", scrollable ? "" : "fixed")}>
              <Button
                type="normal"
                onClick={() => {
                  const clicked_cards = Object.keys(card_clicked_state).filter(
                    (key) => card_clicked_state[key] === true
                  );
                  if (global_var.turing_test_completed) {
                    axios
                      .put(_API_URL + "turingtest", { clicked_cards })
                      .then((res) => {
                        if (res.data.total === 0) {
                          setGlobalData({ error: "put_error" });
                        } else {
                          setImageCardClickData(res.data);
                          setScrollable(true);
                          next_section.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      });
                  } else if (clicked_cards.length !== 2) {
                    setGlobalData({ error: "click_two_cards" });
                  } else {
                    axios
                      .put(_API_URL + "turingtest", { clicked_cards })
                      .then((res) => {
                        if (res.data.total === 0) {
                          setGlobalData({ error: "put_error" });
                        } else {
                          setGlobalVar({ turing_test_completed: true });
                          setImageCardClickData(res.data);
                          setScrollable(true);
                          next_section.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      });
                  }
                  // window.scrollBy(0, -100);
                }}
              >
                {global_var.turing_test_completed
                  ? global_var.use_eng
                    ? "Check out the result"
                    : "다른 사람들의 결과 보기"
                  : global_var.use_eng
                  ? "Check your answer"
                  : "정답 확인하기"}
              </Button>
            </div>
            <div className={cx("frame-middle")} ref={next_section}></div>
            <TextBox type="warning" align={"center"} hug>
              {global_var.use_eng
                ? ["Warning! Warning! Warning!"]
                : ["경고! 경고! 경고! 경고!"]}
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
                    ? global_var.use_eng
                      ? "Great! You are an A.I. discriminator!"
                      : "대단해요! 당신은 인공지능 감별사!"
                    : global_var.use_eng
                    ? "Unfortunately, it is the wrong answer"
                    : "아쉽게도 맞추지 못했어요ㅜㅜㅜ",
                  "",
                  global_var.use_eng
                    ? [
                        "Images (A) and (I) were generated ",
                        'by the artificial intelligence called "Dalle 2"! 🤖',
                      ]
                    : [
                        "사진 (A)와 (I)는 인공지능 모델 ",
                        '"Dalle 2"에 의해 생성되었습니다! 🤖',
                      ],
                ]}
              </TextBox>
              <Divider emph black />
            </AutoLayout>
            <TextBox type="section" align={"center"} black>
              {["Prompt"]}
            </TextBox>
            <TextBox type="narration" align={"center"} black>
              {[
                `“Post-Anthropocene data centers are covering mountains in Seoul”`,
                "",
                `“후기-인류세 데이터센터가 서울의 산을 뒤덮고 있습니다”`,
              ]}
            </TextBox>{" "}
            <Divider opaque />
            <div className={cx("frame-ai")}>
              <AutoLayout type="row" fillX gap={1} attach="center">
                <ImageCard
                  image_path={
                    "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/01.png"
                  }
                  type="disabled"
                />
                <TextBox type="section" black hug>
                  {["A. I."]}
                </TextBox>
                <ImageCard
                  image_path={
                    "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/09.png"
                  }
                  type="disabled"
                />
              </AutoLayout>
            </div>
            <Divider opaque />
            <TextBox type="section" black align="center">
              {global_var.use_eng
                ? ["Result of Archi-Turing Test"]
                : ["건축적 튜링테스트 결과!"]}
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
                {global_var.use_eng
                  ? [
                      `${Math.round(
                        100 * image_card_click_data.total.percent
                      )}% of participants`,
                      "provided incorrect answers.",
                    ]
                  : [
                      `무려 ${Math.round(
                        100 * image_card_click_data.total.percent
                      )}%의 사람들이`,
                      "정답을 맞추지 못했어요.",
                    ]}
              </TextBox>
            </AutoLayout>
            <Divider opaque />
            <Divider opaque />
            <Divider emph black />
            <TextBox type="section" align="center" black>
              {global_var.use_eng
                ? ["Caption of Archi-Turingtest"]
                : ["건축적 튜링테스트 해설"]}
            </TextBox>
            <div className={cx("frame-image")}>
              <CustomImage
                srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/10.png"
                width={600}
                height={600}
              />
            </div>
            <Divider opaque />
            <TextBox type="narration" grey>
              {global_var.use_eng
                ? [
                    "Incorrect Answers:",
                    "",
                    "(B) - Solar panel installations in Ruicheng County in central China's Shanxi Province",
                    "",
                    "(C) - Data center constructed on top of a mountain in Guizhou, China",
                    "",
                    "(D) - Automated, and climate-controlled farms grow crops twenty four seven in any type of weather condition, Netherlands",
                    "",
                    "(E) - Ivanpah Solar Electric Generating System",
                    "",
                    "(F) - Facebook data center under construction in Eagle Mountain, Utah",
                    "",
                    "(G) - The Port of Busan, the largest port in South Korea, located in the city of Busan, South Korea",
                    "",
                    "(H) - Giant wind turbines are powered by strong prevailing winds near Palm Springs, California",
                  ]
                : [
                    "오답:",
                    "",
                    "(B) - 중국 산시성 중부, 루이 청 현의 태양광 패널의 모습",
                    "",
                    "(C) - 중국 구이저우성의 산 아래에 건설된 데이터센터",
                    "",
                    "(D) - 24시간 운영되는 네덜란드의 자동화 기후제어 농장.",
                    "",
                    "(E) - 모하비 사막에 위치한 구글의 이반파 태양열 발전소",
                    "",
                    "(F) - 유타주 이글마운틴에 건설 중인 페이스북 데이터센터",
                    "",
                    "(G) - 부산시에 위치한 대한민국 최대 규모의 항구, 부산항",
                    "",
                    "(H) - 캘리포니아 팜 스프링스 인근의 거대 풍력터빈",
                  ]}
            </TextBox>
            <Divider emph black /> <Divider opaque />
            <Divider opaque />
            <TextBox type="warning" hug>
              {global_var.use_eng
                ? ["Danger! Danger! Danger!"]
                : ["위험! 위험! 위험! 위험!"]}
            </TextBox>
            <div className={cx("frame-image")}>
              <CustomImage
                srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/11.gif"
                width={540}
                height={250}
              />
            </div>
            <TextBox type="narration" black>
              {global_var.use_eng
                ? [
                    "<Architectural Turing Test> is a test designed to distinguish between fictional images generated by AI and the real landscapes of the destructive reality of Post-Anthropocene architecture",
                    "",
                    "The real image is not so much different from the fictional one.",
                    "",
                    "The machine-generated, surreal landscapes of the Post-Anthropocene have already become a part of our real world...",
                  ]
                : [
                    "<건축적 튜링테스트>는 인공지능으로 생성된 허구 이미지와 [후기-인류세] 건축이 파괴적으로 바꾸고 있는 실제 풍경을 구별하기 위한 테스트이다.",
                    "",
                    "허구와 현실이 뒤섞여 제시되는 테스트의 사진들은 그 모습이 서로 크게 다르지 않다…",
                    "",
                    "기계가 만들어낸 후기 인류세의 비현실적 풍경은 이미 현실 세계를 구성하는 일부분이 되고 말았다...",
                  ]}
            </TextBox>
            <Divider opaque />
            <Divider opaque />
            <TextBox type="warning" hug>
              {global_var.use_eng
                ? ["Data centers have appeared!"]
                : ["데이터센터가 출몰했습니다!"]}
            </TextBox>
            <div className={cx("frame-image")}>
              <CustomImage
                srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/turing_test/12.gif"
                width={560}
                height={430}
              />
            </div>
            <TextBox type="narration" black>
              {global_var.use_eng
                ? [
                    "In 2023, co-location data centers have infiltrated Seoul for real-time data processing...",
                    "",
                    "We must remember that the architectural types of the Post-Anthropocene, which emerged behind the cutting-edge technology like autonomous driving, metaverse, and A.I., are gradually encroaching into Seoul's green spaces...",
                    "",
                    "These omnipresent buildings hide their existence in the blind spots of the city. We don't even have the chance to consider what future technology and infrastructure may cost us...",
                  ]
                : [
                    "2023년...데이터센터는 실시간 데이터 처리를 위해 코로케이션이라는 이름으로 서울에 잠입한다…",
                    "",
                    "자율주행, 메타버스, 인공지능 등 화려한 기술의 이면에 등장한 후기-인류세 건축유형이 서울의 녹지 사이로 서서히 파고들고 있다는 사실을 기억해야 한다…",
                    "",
                    "곳곳에 존재하는 이 건축물은 도시의 사각지대 속에서 그 존재를 숨기고 있다. 미래의 기술과 인프라가 우리에게 어떤 대가를 치르게 할지, 우리는 생각할 기회조차 얻지 못했다...",
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
              LAUNCH PROGRAM!
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
