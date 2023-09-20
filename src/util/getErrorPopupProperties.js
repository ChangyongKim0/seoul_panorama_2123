const ERROR_POPUP_PROPERTIES = {
  please_click_pilji: {
    message: "필지를 선택해 주세요.",
    message_eng: "Please select a lot.",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  too_small_pilji: {
    message: "해당 필지가 작거나 좁아서 이 시설을 배치하지 못했어요.",
    message_eng: "The lot is too small or narrow to build the facility.",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        onClick: () => {},
        transit_popup: "build",
        click_when_close: false,
        emph: true,
      },
    ],
  },
  out_of_region: {
    message: "구역 바깥에 있는 필지는 선택할 수 없어요.",
    message_eng: "Please select a lot inside the region.",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  out_of_moutain: {
    message: "구룡산-대모산 영역을 선택해주세요.",
    message_eng: "Please select the <Daemosan-Guryongsan> area.",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  too_far_pilji: {
    message: "처음 시작 위치에서 너무 멀거나 구역 바깥이라 개발이 어려워요.",
    message_eng: "It's too far from the starting location or out of the region",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  too_far_pilji_when_build: {
    message: "이 시설을 짓기에는 처음 시작한 위치에서 너무 멀어요.",
    message_eng:
      "It's too far from the starting location to build the facility",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  too_small_pilji_by_overlapping: {
    message:
      "이곳은 주변 시설에 너무 많이 가려져 있어 이 시설을 배치할 수 없어요.",
    message_eng:
      "The lot is too obscured by the surrounding buildings to place this facility.",
    actions: [
      {
        text: "다른 시설 선택하기",
        text_eng: "Select Another Facility",
        transit_popup: "build",
        click_when_close: false,
      },
    ],
  },
  click_two_cards: {
    message: "인공지능이 생성한 풍경은 2개 있어요!",
    message_eng: "There are 'two' AI-generated landscapes!",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  no_matching_name: {
    message: "검색되는 이름이 없어요. 다시 한번 입력해주세요!",
    message_eng: "No names found. Please try another name!",
    actions: [
      {
        text: "돌아가기",
        text_eng: "Back",
        click_when_close: true,
      },
    ],
  },
  too_small_window: {
    message:
      "해당 페이지는 데스크탑에서 볼 수 있어요! 대신 모바일용 디자인 페이지로 안내해드릴게요!",
    message_eng:
      "You can view this page on desktop. I'll redirect you to the mobile Design Page instead!",
    actions: [
      {
        text: "디자인 페이지 방문",
        text_eng: "Visit the Design Page",
        link_to: "/",
      },
    ],
  },
  blank_name: {
    message: "이름을 입력한 뒤에 플레이 버튼을 눌러주세요!",
    message_eng: "Please enter your name first!",
    actions: [
      {
        text: "이름 입력하기",
        text_eng: "Back",
        click_when_close: true,
      },
    ],
  },
  duplicated_name: {
    message: "이미 누군가 같은 이름을 갖고 있어요. 다른 이름을 적어주세요!",
    message_eng: "The name is already taken. Please try another name!",
    actions: [
      {
        text: "다른 이름 입력하기",
        text_eng: "Back",
        click_when_close: true,
      },
    ],
  },
  error_while_register: {
    message: "이름을 등록하는데 오류가 발생했어요. 잠시 후 다시 시도해주세요!",
    message_eng:
      "An error occurred while registering your name. Please try again later!",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        click_when_close: true,
      },
    ],
  },
  put_error: {
    message:
      "다른 사용자들의 선택 결과를 가져오는데 오류가 발생했어요. 잠시 후 다시 시도해주세요!",
    message_eng:
      "An error occurred fetching other's selection data. Please try again later!",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        click_when_close: true,
      },
    ],
  },
  maximum_developing_number_exceeded: {
    message:
      "최대 20개의 대지만 개발 가능해요! 다른 대지를 개발하려면 이미 개발된 대지를 원상복구해야 해요.",
    message_eng:
      "You can develop up to 20 lots! To develop other lots, you need to restore the already developed ones to their original state",
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        click_when_close: true,
      },
    ],
  },
  no_registered_name: {
    message: "처음 방문하셨나요? 시작하시기 전에 이름을 먼저 등록해야 해요.",
    message_eng:
      "Is this your first visit? Before you begin, please register your name first!",
    actions: [
      {
        text: "등록하러 가기",
        text_eng: "Register!",
        link_to: "/nicknaming",
      },
    ],
  },
  no_selected_region: {
    message: "디자인하기 전에 시작하실 위치를 선택해야 해요.",
    message_eng: "Before you start, choose a starting location.",
    actions: [
      {
        text: "위치 선택하기",
        text_eng: "Select",
        link_to: "/map",
      },
    ],
  },
  welcome_to_revisit: {
    message: "다시 방문해주셨네요! 디자인에 대한 설명이 필요하신가요?",
    message_eng:
      "Welcome back! Do you need instructions for the design process?",
    actions: [
      {
        text: "괜찮아요.",
        text_eng: "No thanks.",
        click_when_close: true,
      },
      {
        text: "네, 필요해요!",
        text_eng: "Yes Please!",
        emph: true,
        transit_popup: "illust_0",
      },
    ],
  },
  hell_to_configurate: {
    message:
      "해당 위치는 이 시설을 배치하기 어려워요. 이 시설을 배치하는 경우 구역 경계를 벗어나거나, 기존의 도시조직을 훼손할 우려가 있어요",
    message_eng:
      "It's difficult to place the facility at this location, as it is outside of the region or disrupts the existing urban fabric.",
    actions: [
      // {
      //   text: "다른 건물 선택하기",
      //   text_eng: "Select another building",
      //   onClick: () => {},
      //   click_when_close: true,
      //   send_global_data: { waiting_clicking_pilji: true },
      // },
      {
        text: "다른 건물 선택하기",
        text_eng: "Reselect",
        transit_popup: "build",
      },
      // {
      //   text: "닫기",
      //   onClick: () => {},

      //   click_when_close: true,
      //   emph: true,
      // },
    ],
  },
  too_small_terrain: {
    message:
      "엇, 동물들의 보금자리를 발견했어요. >>명예 동물보호사<< 칭호를 획득했습니다!! 동물들이 드나들 수 있도록 보금자리를 둘러싸서 개발하지 말아 주세요.",
    message_eng:
      "OH! you discovered a haven for animals. You've earned the title of honorary >>Animal Protector<<. Please avoid developing the lot that surrounds the haven to enclose, allowing animals to move around freely",
    actions: [
      {
        text: "명예 동물보호사 전당에 이름올리기",
        text_eng: "Get the title of Animal Protectors",
        onClick: () => {},
        send_global_var: { found_easter_egg: true },
        click_when_close: true,
      },
    ],
  },
  too_small_terrain_again: {
    message:
      "여기는 동물들의 보금자리예요. 동물들이 드나들 수 있도록 둘러싸서 개발하지 말아 주세요.",
    message_eng:
      "This lot is a haven for animals. Please avoid developing the lot that surrounds the haven to enclose, allowing animals to move around freely",
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Got it!",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  too_few_pilji: {
    message: "최소 5개 이상의 땅을 개발해야 서버에 올릴 수 있어요!",
    message_eng:
      "You need to develop at least five lots to upload to the server.",
    actions: [
      {
        text: "더 개발하기",
        text_eng: "Develop More",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  gltf_error: {
    message: "모델링을 변환하는데 실패했어요. 잠시 후 다시 시도해주세요.",
    message_eng: "The 3d models conversion failed. Please try again later",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  put_info_error: {
    message: "구역 정보를 업로드하는데 실패했어요. 잠시 후 다시 시도해주세요.",
    message_eng: "Uploading Region data failed. Please try again later.",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  put_data_error: {
    message:
      "디자인 정보를 업로드하는데 실패했어요. 잠시 후 다시 시도해주세요.",
    message_eng: "Uploading design data failed. Please try again later.",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  put_modeling_error: {
    message:
      "디자인 영역 경계를 업로드하는데 실패했어요. 잠시 후 다시 시도해주세요.",
    message_eng:
      "Uploading the boundary of designed area failed. Please try again later",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  put_modeling_error: {
    message: "모델링을 업로드하는데 실패했어요. 잠시 후 다시 시도해주세요.",
    message_eng: "Uploading 3d models failed. Please try again later",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  put_score_error: {
    message:
      "디자인 점수를 업로드하는데 실패했어요. 잠시 후 다시 시도해주세요.",
    message_eng: "Uploading your design score failed. Please try again later.",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        onClick: () => {},
        click_when_close: true,
      },
    ],
  },
  out_of_region_on_map: {
    message:
      "구역 바깥에서는 시작할 수 없어요. 구역 안에서 시작점을 터치해주세요.",
    message_eng:
      "A starting location should be inside a region. Please select other locations",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  unrankable_design: {
    message:
      "당신의 디자인 영역과 겹치는 다른 디자인의 점수가 더 높아요. 마스터플랜 페이지에 이름을 올리려면 더 높은 점수를 획득해야 해요. 물론, 마스터플랜 페이지에서 이름을 검색하면 점수와 상관없이 디자인 확인이 가능해요! 데이터를 업로드하시겠어요?",
    message_eng:
      "The score of another design overlapping with your design area is higher. To have your name on the Master Plan Page, you need to achieve a higher score. Of course, you can still view the design on the Master Plan Page regardless of the score. Would you like to upload the data?",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
      {
        text: "데이터 업로드",
        text_eng: "Upload Data",
        click_when_close: true,
        emph: true,
      },
    ],
  },
  get_network_error: {
    message:
      "서버에 업로드 중 통신 에러가 발생했어요. 잠시 후에 다시 시도해주세요.",
    message_eng:
      "A communication error occurred uploading to the server. Please try again later.",
    actions: [
      {
        text: "닫기",
        text_eng: "Close",
        click_when_close: true,
      },
    ],
  },
  warning_to_go_startpage: {
    message: `시작 페이지로 가더라도 디자인 페이지를 다시 방문하면 진행하던 디자인을 불러올 수 있어요. 

    단, 다른 브라우저로 접속하거나 새로운 위치에서 시작하면 진행중인 디자인이 사라져요.`,
    message_eng: `Even if you return to the start page, you can still load your ongoing design by revisiting the Design Page.
    
    However, please note that if you access from a different browser or start from a new location, your ongoing design will disappear`,
    actions: [
      {
        text: "뒤로가기",
        text_eng: "Back",
        click_when_close: true,
      },
      {
        text: "시작 페이지",
        text_eng: "Return to Start Page.",
        link_to: "/",
        emph: true,
      },
    ],
  },
  predeveloped_terrain: {
    message: `여기는 이미 개발되어 있는 곳이예요. 다른 곳을 선택해 주세요.`,
    message_eng:
      "This lot has already been developed. Please select a different place",
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  easter_egg_solved: {
    message: `명예의 전당에 이름을 등록했어요!
    이제 디자인페이지 왼쪽 위에서 >>명예 동물보호사<<라는 자격을 확인할 수 있어요!`,
    message_eng:
      ">>Animal Protector<< status is added on the top left of the Design Page",
    actions: [
      {
        text: "네, 고마워요.",
        text_eng: "OK, Thanks.",
        click_when_close: true,
      },
    ],
  },
  undevelopable_position: {
    message: `여기는 다른 시설들이 이미 들어서 있어 개발이 불가능해요.
    다른 위치를 선택해주세요!`,
    message_eng: `This location is already occupied by other facilities.
    Please choose another location!`,
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
      },
    ],
  },
  lowly_developable_position: {
    message: `여기는 다른 시설들이 많아 개발이 힘들 수 있어요.
    이 곳에서 시작하셔도 괜찮으신가요?`,
    message_eng: `There are a lot of other facilities nearby and there are not enough lots to develop around here.
    Are you sure to start from this location?`,
    actions: [
      {
        text: "다시 선택하기",
        text_eng: "Reselect",
        click_when_close: true,
        send_global_var: { map_clicked_state: "region" },
      },
      {
        text: "네, 괜찮아요!",
        text_eng: "Sure!",
        click_when_close: true,
        emph: true,
      },
    ],
  },
  no_modeling_exists: {
    message: `일부 디자인 모델링을 불러오는 데 문제가 생겼어요. 
    
    작동에는 문제가 없지만, 근처에 관리자가 있다면 문의해주세요.`,
    message_eng: `There was a minor issue while loading some 3d models. 
    
    The operation is not affected, but if an administrator is available nearby, please contact them.`,
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        click_when_close: true,
      },
    ],
  },
  no_modeling_exists_critical: {
    message: `이 디자인 모델링을 불러오는 데 문제가 생겼어요.

    해당 모델링이 서버에 업로드되지 않았거나, 업로드 중 실패했을 수 있어요.

    만일 이 디자인의 주인공이시라면, 디자인페이지에서 다시 한번 업로드를 시도해주세요!`,
    message_eng: `There is an issue while loading this 3d model.

    The 3d model may not have been uploaded to the server or the upload might have failed.

    If you are the owner of this design, please try uploading it again on the Design Page!`,
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        click_when_close: true,
      },
    ],
  },
  invalid_nickname: {
    message: `한글, 영문, 숫자, 그리고 띄어쓰기로만 이름을 만들어주세요!`,
    message_eng: `Please create a name using Korean, English, numbers, and spaces only!`,
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        click_when_close: true,
      },
    ],
  },
  too_long_nickname: {
    message: `이름이 너무 길어요. 10자 이내로 이름을 지어주세요!`,
    message_eng: `The name is too long. Please shorten it to 10 characters or less?`,
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        click_when_close: true,
      },
    ],
  },
  possible_crash_warning: {
    message: `이 디자인 프로그램은 3D 정보를 다루기 때문에 일부 기기를 지원하지 않거나 연산에 오랜 시간이 걸릴 수 있어요.
    
    만일 페이지에서 나가게 되더라도, 데이터는 유지되니 새로고침 해주시면 돼요!`,
    message_eng: `As this design program handles 3D data, it might not be compatible with some devices or may require longer processing times.
    
    Even if you leave this page, don't worry, the data will be retained. Just refresh the page when needed!`,
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        click_when_close: true,
      },
    ],
  },
  far_to_configurate: {
    message:
      "해당 위치는 이 시설을 배치하기 어려워요. 이 시설을 배치하는 경우 처음 선택한 시작점 범위에서 너무 멀리 벗어나요.",
    message_eng:
      "It's hard to place the facility in this lot. Placing the facility would take it too far away from the starting location.",
    actions: [
      {
        text: "다른 건물 선택하기",
        text_eng: "Reselect",
        transit_popup: "build",
      },
    ],
  },
  loading_timeout: {
    message:
      "디자인을 로드하는데 시간이 너무 오래 걸려요. 잠시 후에 다시 시도해주세요.",
    message_eng:
      "It takes too long time to load design. Please try again later.",
    actions: [
      {
        text: "네, 알겠어요!",
        text_eng: "Ok, Got it!",
        transit_popup: "build",
      },
    ],
  },
};

const DEFAULT_ERROR_POPUP_PROPERTIES = {
  type: "default",
  message:
    "아래 버튼을 눌러 팝업을 닫아주세요. 만약 닫히지 않는다면, 새로고침을 부탁드려요.",
  message_eng:
    "Please close this popup by clicking the button below. If the popup isn't closed, refresh the page.",
  actions: [
    {
      text: "팝업 닫기",
      text_eng: "Close popup",
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
    return { ...return_data, type };
  }
  return {
    ...DEFAULT_ERROR_POPUP_PROPERTIES,
    message: DEFAULT_ERROR_POPUP_PROPERTIES.message + `\n(오류명 : ${type})`,
    message_eng:
      DEFAULT_ERROR_POPUP_PROPERTIES.message_eng + `\n(error type : ${type})`,
  };
};
