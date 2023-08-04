import { locateBldgsInPilji } from "./locateBldgsInPilji";

export const building_data = [
  {
    section: "기본 건물이나 인프라는 땅을 개발한 뒤에 지을 수 있어요!",
    contents: [],
  },
  {
    section: "기본 건물",
    contents: [
      {
        image_path: "/img/build/building/01.png",
        name: "주택",
        bldg_type: "normal",
        bldg_name: "house",
        require_svgNest: true,
      },
      {
        image_path: "/img/build/building/02.png",
        name: "사무실",
        bldg_type: "normal",
        bldg_name: "workspace",
        require_svgNest: true,
      },
      {
        image_path: "/img/build/building/03.png",
        name: "소매점",
        bldg_type: "normal",
        bldg_name: "retail",
        require_svgNest: true,
      },
      {
        image_path: "/img/build/building/04.png",
        name: "생활 편의공간",
        bldg_type: "normal",
        bldg_name: "amenities",
        require_svgNest: true,
      },
    ],
  },
  {
    section: "인프라",
    contents: [
      {
        image_path: "/img/build/infra/01.png",
        name: "온실",
        bldg_type: "normal",
        bldg_name: "greenhouse",
        require_svgNest: true,
      },
      {
        image_path: "/img/build/infra/02.png",
        name: "풍력 발전기",
        bldg_type: "normal",
        bldg_name: "windFarm",
        require_svgNest: true,
      },
      {
        image_path: "/img/build/infra/03.png",
        name: "수처리 탱크",
        bldg_type: "normal",
        bldg_name: "waterTank",
        require_svgNest: true,
      },
      {
        image_path: "/img/build/infra/04.png",
        name: "태양광 패널",
        bldg_type: "normal",
        bldg_name: "solarPanel",
        require_svgNest: true,
      },
    ],
  },
  {
    section: "대형 건물",
    contents: [
      {
        image_path: "/img/build/public/02.png",
        name: "공원",
        bldg_type: "big_x",
        bldg_name: "publicPark",
        bldg_model_type: "x_2",
      },

      {
        image_path: "/img/build/public/02.png",
        name: "커뮤니티시설",
        bldg_type: "big",
        bldg_name: "communityComplex",
        bldg_model_type: "d_1",
      },
      {
        image_path: "/img/build/public/02.png",
        name: "아파트",
        bldg_type: "big",
        bldg_name: "apartmentBuilding",
        bldg_model_type: "y_2",
      },
      {
        image_path: "/img/build/public/02.png",
        name: "대형 오피스",
        bldg_type: "big",
        bldg_name: "officeBuilding",
        bldg_model_type: "y_2",
      },
    ],
  },
  {
    section: "대형 인프라",
    contents: [
      {
        image_path: "/img/build/public/02.png",
        name: "도심항공센터",
        bldg_type: "big",
        bldg_name: "uamCenter",
        bldg_model_type: "d_1",
      },

      {
        image_path: "/img/build/public/02.png",
        name: "자동화 온실",
        bldg_type: "big",
        bldg_name: "automatedGreenhouse",
        bldg_model_type: "d_1",
      },
      {
        image_path: "/img/build/public/02.png",
        name: "데이터 센터",
        bldg_type: "big",
        bldg_name: "dataCenter",
        bldg_model_type: "y_1",
      },
    ],
  },
];

export const setGlobalDataOnClickBuild = (
  bldg_type,
  bldg_name,
  bldg_model_type,
  require_svgNest = false
) => {
  return (global_data) =>
    false
      ? // bldg_type.split("_").includes("big")
        {
          waiting_clicking_pilji: true,
          curr_action: {
            type: "build",
            bldg_type,
            bldg_name,
            bldg_model_type,
            require_svgNest,
          },
          clicked_meshs: [],
          clicked_bldg_guids: [],
          emph_guids: [],
          clicked_guid: undefined,
        }
      : {
          curr_action: {
            guid: global_data.clicked_guid,
            type: "build",
            bldg_type,
            bldg_name,
            bldg_model_type,
            require_svgNest,
          },
        };
};
