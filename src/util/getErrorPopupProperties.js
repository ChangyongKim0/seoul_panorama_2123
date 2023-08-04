const ERROR_POPUP_PROPERTIES = {
  hell_to_configurate: {
    message: "해당 위치는 이 건물을 배치하기 어려워요.",
    actions: [
      {
        text: "다른 위치 선택하기",
        onClick: () => {},
        click_when_close: true,
        send_global_data: { waiting_clicking_pilji: true },
      },
      // {
      //   text: "닫기",
      //   onClick: () => {},

      //   click_when_close: true,
      //   emph: true,
      // },
    ],
  },
  please_click_pilji: {
    message: "대지를 선택해 주세요.",
    actions: [
      {
        text: "다시 선택하기",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  too_small_pilji: {
    message: "해당 대지가 작거나 좁아서 이 건물을 배치하지 못했어요.",
    actions: [
      {
        text: "다른 건물 선택하기",
        onClick: () => {},
        transit_popup: "build",
        click_when_close: false,
      },
    ],
  },
  out_of_region: {
    message: "구역 바깥에 있는 대지여서 선택할 수가 없어요.",
    actions: [
      {
        text: "다시 선택하기",
        click_when_close: true,
      },
    ],
  },
  out_of_moutain: {
    message: "구룡산-대모산 영역을 선택해주세요.",
    actions: [
      {
        text: "다시 선택하기",
        click_when_close: true,
      },
    ],
  },
  too_far_pilji: {
    message: "처음 시작한 위치에서 너무 멀거나 구역 바깥이라 개발이 어려워요.",
    actions: [
      {
        text: "다시 선택하기",
        click_when_close: true,
      },
    ],
  },
  too_far_pilji_when_build: {
    message: "이 건물을 짓기에는 처음 시작한 위치에서 너무 멀어요.",
    actions: [
      {
        text: "다시 선택하기",
        click_when_close: true,
      },
    ],
  },
  too_small_pilji_by_overlapping: {
    message:
      "이 대지는 옆의 건물에 너무 많이 가려져 있어 이 건물을 배치할 수 없어요.",
    actions: [
      {
        text: "다른 건물 선택하기",
        transit_popup: "build",
        click_when_close: false,
      },
    ],
  },
  click_two_cards: {
    message: "인공지능이 생성한 풍경은 2개 있어요!",
    actions: [
      {
        text: "다시 선택하기",
        click_when_close: true,
      },
    ],
  },
  no_matching_name: {
    message: "검색되는 이름이 없어요. 다시 한번 입력해주세요!",
    actions: [
      {
        text: "돌아가기",
        click_when_close: true,
      },
    ],
  },
  too_small_window: {
    message:
      "해당 페이지는 데스크탑에서 볼 수 있어요! 대신 모바일용 디자인 페이지로 안내해드릴게요!",
    actions: [
      {
        text: "디자인 페이지 방문하기",
        link_to: "/",
      },
    ],
  },
  blank_name: {
    message: "이름을 입력한 뒤에 플레이 버튼을 눌러주세요!",
    actions: [
      {
        text: "이름 입력하러 가기",
        click_when_close: true,
      },
    ],
  },
  duplicated_name: {
    message: "이미 누군가 같은 이름을 갖고 있어요. 다른 이름을 적어주세요!",
    actions: [
      {
        text: "다른 이름 적기",
        click_when_close: true,
      },
    ],
  },
  error_while_register: {
    message: "이름을 등록하는데 오류가 발생했어요. 잠시 후 다시 시도해주세요!",
    actions: [
      {
        text: "뒤로가기",
        click_when_close: true,
      },
    ],
  },
};

const DEFAULT_ERROR_POPUP_PROPERTIES = {
  message: "알 수 없는 오류가 발생했어요.",
  actions: [
    {
      text: "오류 보내기",
      onClick: () => {},
      click_when_close: true,
    },
  ],
};

export const getErrorPopupProperties = (type, onClickActions) => {
  if (type && ERROR_POPUP_PROPERTIES[type]) {
    const return_data = ERROR_POPUP_PROPERTIES[type];
    if (onClickActions) {
      onClickActions.forEach((onClick, idx) => {
        if (return_data.actions[idx]) {
          return_data.actions[idx].onClick = () => {
            return_data.actions[idx]?.onClick?.();
            onClick();
          };
        }
      });
    }
    return return_data;
  }
  return {
    ...DEFAULT_ERROR_POPUP_PROPERTIES,
    message: DEFAULT_ERROR_POPUP_PROPERTIES.message + `\n(오류명 : ${type})`,
  };
};
