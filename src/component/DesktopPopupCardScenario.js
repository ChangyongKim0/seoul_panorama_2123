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
import AutoLayout from "./AutoLayout";
import Icon from "./Icon";
import PopupCard from "./PopupCard";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import Animation from "./Animation";
import TextBox from "./TextBox";
import Button from "./Button";
import ChartBar from "./ChartBar";
import Divider from "./Divider";
import Histogram from "./Histogram";
import ScoreGraph from "./ScoreGraph";
import {
  building_data,
  setGlobalDataOnClickBuild,
} from "../util/setGlobalDataOnClickBuild";
import {
  _API_URL,
  _fillZeros,
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

const DesktopPopupCardScenario = ({
  type,
  onClick,
  setType,
  for_exhibition,
}) => {
  const wrapper = useRef();
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();

  useEffect(() => {
    return () => {
      setType("default");
    };
  }, []);

  return (
    <>
      {type === "default" && (
        <>
          <TextBox type="sentence" align="center" black>
            {global_var.use_eng
              ? [
                  "SBAU 2023",
                  "Seoul 100-year Masterplan Exhibition",
                  "",
                  "< Seoul Panorama 2123 >",
                ]
              : [
                  "서울도시건축비엔날레 2023",
                  "서울 100년 마스터플랜전",
                  "",
                  "< 서라벌전경 2123  (徐羅伐全景 二千百二十三) >",
                ]}
          </TextBox>
          <div className={cx("frame-image")}>
            <CustomImage
              srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/design/01.png"
              width={2480}
              height={1966}
            />
          </div>
          <Button
            onClick={() => {
              setType("illust_exhibition");
            }}
            type="emph"
          >
            {global_var.use_eng
              ? ["<Seoul Panorama 2123> Description"]
              : ["<서라벌전경 2123> 작품 설명서"]}
          </Button>
          <Button
            onClick={() => {
              setType("illust_web");
            }}
          >
            {global_var.use_eng
              ? ["Web Program Design Principles"]
              : ["웹 프로그램 디자인 원리"]}
          </Button>
          {!for_exhibition && (
            <>
              <Button
                onClick={() => {
                  window.open(
                    "https://competition.seoulbiennale.org/ko/",
                    "https://competition.seoulbiennale.org/ko/"
                  );
                }}
              >
                {global_var.use_eng
                  ? ["Multiple Layered Green Hill City / Architecture"]
                  : ["TYPE C: 다층화 녹화 언덕 도시 / 건축"]}
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    "https://seoulpanorama2123.com/",
                    "https://seoulpanorama2123.com/"
                  );
                }}
              >
                {global_var.use_eng
                  ? ["Web Program Link"]
                  : ["웹 프로그램 링크"]}
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
                  ? ["Open-Soure Download"]
                  : ["오픈소스 다운로드"]}
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              setType("credit");
            }}
          >
            {global_var.use_eng
              ? ["About Featured Artists"]
              : ["TYPE C 대표팀 참여작가 소개"]}
          </Button>
        </>
      )}
      {type === "illust_exhibition" && (
        <>
          <TextBox type="section" black>
            {global_var.use_eng
              ? ["<Seoul Panorama 2123>"]
              : [`<서라벌전경 2123>
              (徐羅伐全景 二千百二十三)`]}
          </TextBox>
          <div className={cx("frame-popup-image")}>
          <CustomImage
              srcset="https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/design/01.png"
              width={2480}
              height={1966}
            />
          </div>
          <TextBox type="sentence" align="left">
            {global_var.use_eng
              ? ["",
                "Seoul Panorama 2123, designed as a ritual offering, encourages reflections on Seoul's past, present, and future. The exhibition, through research, models, and open source software, highlights mountain destruction and invites not only politicians, urban planners and architects but also citizens to contribute.",
                "",
                "Daemo-Guryong Mountain, entwined with interests from the National Intelligence Service, heating company to apartment complexes, faces alteration due to human habitation and future infrastructure. As automated infrastructures by tech companies could become geological agents in the Post-anthropocene, an inclusive planning method is essential.",
                "",
                "Our web program, a strategy to integrate data centers into residential and office spaces without damaging mountains, is shared as open source for wider application. It proposes an infrastructure grid based on contour lines and uses gamification to encourage participation."]
              : ["",
                "<서라벌전경 2123>은 대모산과 구룡산의 안녕을 위해 2123년의 미래에서 보내는 전언이다. 제사의 형식을 취한 전시기획을 통해 과거, 현재를 성찰하고 거울에 비친 ‘당신’에게 서울의 미래를 의탁한다. 제사상 위에 놓인 침식도, 모형, 건축적 튜링테스트, 오픈소스 프로그램 등은 산의 파괴 현황을 드러내고 소수의 전문가 뿐만 아니라 모두가 마스터플랜 과정에 목소리를 내도록 돕는다.",
                "",
                "대모산과 구룡산은 국정원, 난방공사, 터널, 아파트 단지 등의 수많은 이해관계가 뒤엉킨 정치적 지형이다. 은폐와 무관심 속에서 침식된 산은 인간의 삶에 맞춰지기 위해 더욱 파괴적으로 변형 당하거나, 미래 도시 인프라에게 침범될 위기에 처해있다. 한편, 후기-인류세는 인공지능으로 자동화된 건축유형들이 지질학적 행위자가 되는 시대로, 소수의 기업가에 의해 주도될 수 있다는 점을 고려했을 때 모든 시민들을 위한 대안적 방법론이 필요하다.",
                "",
                "마스터플랜 알고리즘은 구릉지를 파괴하지 않으면서 데이터센터를 주거와 오피스를 위한 인프라로 편입하려는 시도로, 다른 산지에 확장될 수 있도록 오픈소스로 배포된다. 구체적으로는 등고선을 새로운 인프라-그리드 축으로 채택한 마스터플랜 가이드라인을 제안하며, 시민들의 적극적인 참여를 독려하기 위해 웹을 통한 게이미피케이션 서비스를 도입한다.",]}
          </TextBox>
          <Button
            onClick={() => {
              onClick?.Back?.();
            }}
          >
            {global_var.use_eng ? ["OK, Got it!"] : ["네, 알겠어요!"]}
          </Button>
        </>
      )}
      {type === "illust_web" && (
        <>
          <TextBox type="section" black>
            {global_var.use_eng
              ? ["Design Principles"]
              : ["디자인 원리는 어떻게 되나요?"]}
          </TextBox>
          <TextBox type="sentence">
            {global_var.use_eng
              ? [
                  "Master plan is designed after the creation and analysis of the lots, and placing facility types.",
                ]
              : [
                  "마스터플랜 계획은 필지생성 및 분석 후, 시설 유형을 배치하는 방식으로 진행됩니다.",
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
              : ["[필지 자동 생성 및 분석]"]}
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
              ? ["[Facilities and Street system]"]
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
              ? ["[The Masterplan by Everyone]"]
              : ["[모두가 함께 참여하는 마스터플랜]"]}
          </TextBox>
          <Button
            onClick={() => {
              onClick?.Back?.();
            }}
          >
            {global_var.use_eng ? ["OK, Got it!"] : ["네, 알겠어요!"]}
          </Button>
        </>
      )}
      {type === "credit" && (
        <>
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
              onClick?.Back?.();
            }}
          >
            {global_var.use_eng ? ["Close"] : ["닫기"]}
          </Button>
        </>
      )}
    </>
  );
};

export default DesktopPopupCardScenario;

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
