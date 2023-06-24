const background_mesh = {
  // 모델 저장 시 'terrain', 'road'와 같이 고정된 레이어로 메쉬를 구분 저장해야 함
  // 해당 레이어 명칭은 협의 후 확정 필요
  terrain: {
    "33333-333": "MESH",
  },
  road: {},
  ramp: {},
};

const bldg_mesh = {
  normal: {
    // 최대한 빨리 모든 빌딩 타입 이름, 파일명 제작 필요
    공동주택: {
      mesh: "MESH",
      // 이전에 언급한대로 파일명에 rec_x_y, rad_r 형태로 넣어주면 알아서 읽겠음
      projected_border: [
        [100, 30],
        [120, 45],
      ],
    },
  },
  infra: {},
  public: {},
};

// background_relation은 url 제외 모두 id 분류기에서 제공되어야 함
// 분류된 id txt 파일명은 최대한 아래 형태를 따르되, 바뀌는 경우 창용에게 즉시 공유 필요
const background_relation = {
  "33333-333": {
    adjacent_pilji_x: [],
    adjacent_pilji_y: [],
    adjacent_ramp: [],
    adjacent_stair: [],
    related_pilji: [],
    projected_border: [
      [100, 30],
      [120, 45],
    ],
    public_mesh_data: {
      데이터센터: {
        url: "https://ddd",
        overlaps: ["33333-333-3"],
        projected_border: [
          [100, 30],
          [120, 45],
        ],
      },
    },
  },
};

const clicked_terrain = "";

const curr_action = {
  pilji: "33333-333",
  type: "develop",
  bldg: "공동주택",
};

const background_state = {
  terrain: {
    "33333-333": true,
  },
  road: {},
  ramp: {},
};

const bldg_state = {
  "33333-333": {
    developed: true,
    bldg_type: "normal",
    bldg_name: "공동주택",
    bldg_configuration: [
      {
        // svgNest에서는 4D rotation matrix 형태로 제공하므로,
        // translate-rotate 방식으로 할지 아예 matrix를 적용할지 추가 조사 필요
        translate: [100, 10, 300],
        rotate: 0.5,
        overlapped: ["33333-333-2"],
        overlaps: ["33333-333-3"],
      },
    ],
    overlapped: ["33333-333-2"],
  },
};

const undo_redo_data = {
  type: "undo",
  background_state: {
    terrain: {
      "33333-333": true,
    },
  },
  bldg_state: {
    "33333-333": {
      developed: true,
      bldg_type: "normal",
      bldg_name: "공동주택",
      bldg_configuration: [
        {
          translate: [100, 10, 300],
          rotate: 0.5,
          overlapped: ["33333-333-2"],
          overlaps: ["33333-333-3"],
        },
      ],
      overlapped: ["33333-333-2"],
    },
  },
};
