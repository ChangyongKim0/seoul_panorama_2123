import { locateBldgsInPilji } from "./locateBldgsInPilji";

export const building_data = [
  {
    section: "기본 건물이나 인프라는 땅을 개발한 뒤에 지을 수 있어요!",
    section_idx: 0,
    contents: [],
  },
  {
    section: "기본 건물",
    section_idx: 1,
    section_eng: "Basic Building",
    illust:
      "지역을 구성하는 기본 건물이에요. 필지 내에서 일정한 간격으로 배치됩니다. 주거 및 업무 공간과 같은 다양한 용도로 조성되어 일상 생활에 필요한 시설들로 이루어져 있어요!",
    illust_eng:
      "These are the basic buildings that shape an area. They're placed evenly within the lots. They have many uses in our daily lives, like homes and workplaces, meeting our everyday needs.",
    contents: [
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building/01.png",
        name: "주택",
        name_eng: "House",
        bldg_type: "normal",
        bldg_name: "house",
        require_svgNest: true,
        illust: "삶의 기본 단위가 되는 공간입니다.",
        illust_eng: "The fundamental units of life's spaces.",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building/03.png",
        name: "소매점",
        name_eng: "Retail",
        bldg_type: "normal",
        bldg_name: "retail",
        require_svgNest: true,
        illust: "상업을 위한 공간입니다.",
        illust_eng: "Spaces designed for commercial activities.",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building/02.png",
        name: "사무실",
        name_eng: "Work Space",
        bldg_type: "normal",
        bldg_name: "workspace",
        require_svgNest: true,
        illust: "업무를 위한 공간입니다.",
        illust_eng: "Spaces intended for work-related activities.",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building/04.png",
        name: "생활 편의공간",
        name_eng: "Amenities",
        bldg_type: "normal",
        bldg_name: "amenities",
        require_svgNest: true,
        illust: "생활편의를 위한 공간입니다.",
        illust_eng: "Spaces for daily life convenience.",
      },
    ],
  },
  {
    section: "인프라",
    section_idx: 2,
    section_eng: "Infrastructure",
    illust:
      "산지에서 자원을 활용하기 위한 소규모 인프라에요. 이 시설들은 필지 내부에 높은 밀도로 배치됩니다. 지역 내의 자급자족적인 생활을 위해 활용되며, 남은 에너지는 주변 도심 지역으로 공급돼요!",
    illust_eng:
      "These are small infrastructures designed to help efficiently use resources in mountain regions. They're built closely together within the lots, aiming to support self-sufficient ways of life. Any extra energy they produce are sent to nearby urban areas.",
    contents: [
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra/04.png",
        name: "태양광 패널",
        name_eng: "Solar Panel",
        bldg_type: "normal",
        bldg_name: "solarPanel",
        require_svgNest: true,
        illust: "햇빛을 이용한 재생에너지를 생산을 위한 시설입니다.",
        illust_eng: "A facility for producing renewable energy using sunlight.",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra/01.png",
        name: "온실",
        name_eng: "Green House",
        bldg_type: "normal",
        bldg_name: "greenhouse",
        require_svgNest: true,
        illust: "소규모 지역 농산물 생산을 위한 시설입니다.",
        illust_eng: "Facilities for small-scale local agricultural production.",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra/02.png",
        name: "풍력 발전기",
        name_eng: "Wind Farm",
        bldg_type: "normal",
        bldg_name: "windFarm",
        require_svgNest: true,
        illust: "바람을 이용한 재생에너지 생산을 위한 시설입니다.",
        illust_eng:
          "Facilities for generating renewable energy using wind",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra/03.png",
        name: "수처리 탱크",
        name_eng: "Water Tank",
        bldg_type: "normal",
        bldg_name: "waterTank",
        require_svgNest: true,
        illust: "빗물처리와 생활용수 공급을 위한 시설입니다.",
        illust_eng:
          "Facilities for rainwater purification and the supply of domestic water.",
      },
    ],
  },
  {
    section: "대형 건물",
    section_idx: 3,
    section_eng: "Large-scale Building",
    illust:
      "넓은 지역에서 이용할 수 있는 대규모 건물이에요. 이 건물들은 여러 필지를 가로지르며 세워지며, 주변에 작은 여분 공간을 형성합니다. 따라서 주변에서 쉽게 접근할 수 있으며, 지하 주차장과 연결된 수직동선을 갖추고 있어요!",
    illust_eng:
      "These are large-scale buildings intended for use in expansive areas. They are built across multiple lots, creating small additional areas around them. This layout makes it easy to reach them from the surroundings and includes vertical connections that connect to an underground parking area.",
    contents: [
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building_big/01.png",
        name: "공원",
        name_eng: "Public Park",
        bldg_type: "big_x",
        bldg_name: "publicPark",
        bldg_model_type: "x_2",
        illust: "야외 휴게녹지를 갖춘 반 외부 공공 공간입니다.",
        illust_eng:
          "Semi-outdoor public spaces with recreational green spaces",
      },

      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building_big/02.png",
        name: "커뮤니티 시설",
        name_eng: "Community Complex",
        bldg_type: "big",
        bldg_name: "communityComplex",
        bldg_model_type: "d_1",
        illust: "지역의 편의시설이 모여있는 복합 공공 공간입니다.",
        illust_eng: "Mixed public spaces where local amenities are gathered",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building_big/03.png",
        name: "아파트",
        name_eng: "Apt. Building",
        bldg_type: "big",
        bldg_name: "apartmentBuilding",
        bldg_model_type: "y_2",
        illust: "고밀도의 주거공간을 제공하는 건물이에요.",
        illust_eng: "Spaces that provide housing with high population density",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/building_big/04.png",
        name: "대형 오피스",
        name_eng: "Office Building",
        bldg_type: "big",
        bldg_name: "officeBuilding",
        bldg_model_type: "y_2",
        illust: "고밀도의 업무공간을 제공하는 건물이에요.",
        illust_eng: "Spaces that offer high-density workspaces.",
      },
    ],
  },
  {
    section: "대형 인프라",
    section_idx: 4,
    section_eng: "Large-scale Infrastructure",
    illust:
      "넓은 지역의 자원활용을 위한 대형 인프라 건물이에요. 고도에 따른 높이제한과 산의 경관보호를 위해 경사지와 필지를 가로질러 배치됩니다. 자원의 생산과 관리를 위한 시설들이 지하와 연결되어 함께 모여 있어요.",
    illust_eng:
      "This is large-scale infrastructure building for efficient resource utilization in vast areas. To accommodate height restrictions based on elevation and preserve the natural landscape of the mountains, it is situated across slopes and lots. Facilities for resource production and management are clustered underground, working together seamlessly",
    contents: [
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra_big/01.png",
        name: "도심 항공센터",
        name_eng: "U.A.M. Center",
        bldg_type: "custom",
        bldg_name: "uamCenter",
        bldg_model_type: "c_1",
        illust: "지상과 항공교통을 3차원으로 연결하는 대형 시설입니다.",
        illust_eng:
          "Large facilities that connect ground and aerial transportation in three dimensions.",
      },

      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra_big/02.png",
        name: "자동화 온실",
        name_eng: "Automated Greenhouse",
        bldg_type: "big",
        bldg_name: "automatedGreenhouse",
        bldg_model_type: "d_1",
        illust: "농산물의 생육환경을 자동으로 제어하는 대형 시설입니다.",
        illust_eng:
          "Large facilities that automatically control the growth environment of agricultural products",
      },
      {
        image_path:
          "https://seoulpanorama2123.s3.ap-northeast-2.amazonaws.com/design/img/build/infra_big/03.png",
        name: "데이터 센터",
        name_eng: "Data Center",
        bldg_type: "big",
        bldg_name: "dataCenter",
        bldg_model_type: "y_1",
        illust:
          "지역의 데이터 보관과 처리를 담당하는 대형 시설입니다. 시설의 폐열을 이용하여 지역의 난방, 급탕, 발전에 활용합니다.",
        illust_eng:
          "Large facilities responsible for storing and processing local data. The waste heat from the facility is utilized for heating, hot water supply, and power generation in the area.",
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
