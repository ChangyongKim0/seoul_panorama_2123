import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
// , { useEffect }

import styles from "./Search.module.scss";
import classNames from "classnames/bind";

import { cloneDeep } from "lodash";
import Icon from "./Icon";
import Divider from "./Divider";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";

const cx = classNames.bind(styles);

let input_search = "";

const reduceSearchResults = (state, action) => {
  let new_state = cloneDeep(state);
  // console.log(new_state.focus);
  switch (action.type) {
    case "focus_down":
      if (state.focus < state.data.length - 1) {
        new_state.focus = state.focus + 1;
      } else {
        new_state.focus = 0;
      }
      return new_state;
    case "focus_up":
      if (state.focus > 0) {
        new_state.focus = state.focus - 1;
      } else {
        new_state.focus = Math.max(state.data.length - 1, 0);
      }
      return new_state;
    case "update":
      new_state.data = action.data;
      new_state.focus = 0;
      return new_state;
    case "force_activate":
      // console.log(state);
      action.callback(state);
      return new_state;
    case "activate":
      // Search.log(state);
      if (state.data.length == 0) {
        action.callback(state);
      }
      return new_state;
    default:
      return state;
  }
};

const emphasizeText = (text, word) => {
  // return text.replace(new RegExp(word, "gi"), `<mark>${word}</mark>`);
  return text.split(word).map((e, idx) =>
    idx == 0 ? (
      <span>{e}</span>
    ) : (
      <span>
        <span className={cx("text-emph")}>{word}</span>
        {e}
      </span>
    )
  );
};

const SAMPLE = [
  { name: "지용이형" },
  { name: "지용" },
  { name: "전지용" },
  { name: "김창용" },
  { name: "김창용0103" },
  { name: "창용" },
  { name: "재진" },
  { name: "샘플0" },
  { name: "샘플2" },
];

const Search = forwardRef(({ onClick }, ref) => {
  const [search_results, handleSearchResults] = useReducer(
    reduceSearchResults,
    { data: [], focus: 0 }
  );
  const [global_data, setGlobalData] = useGlobalData();

  let callback = function (result, status) {
    // if (status === window.kakao.maps.services.Status.OK) {
    //   handleSearchResults({ type: "update", data: result });
    // }
  };

  const search_field = useRef(null);

  // {
  //   name: ""
  // }

  // address_name: "서울 마포구 연남동 568-23";
  // category_group_code: "FD6";
  // category_group_name: "음식점";
  // category_name: "음식점 > 한식";
  // distance: "";
  // id: "1650833864";
  // phone: "02-332-9357";
  // place_name: "한";
  // place_url: "http://place.map.kakao.com/1650833864";
  // road_address_name: "서울 마포구 동교로27길 41";
  // x: "126.921453250265";
  // y: "37.5596821334816";

  useEffect(() => {
    input_search = document.getElementById("input_search");
    input_search.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        e.preventDefault();
      }
    });
    input_search.addEventListener("keyup", (e) => {
      // console.log(e);
      if (e.code == "ArrowUp") {
        if (e.key == "ArrowUp") {
          handleSearchResults({ type: "focus_up" });
        }
      } else if (e.code == "ArrowDown") {
        if (e.key == "ArrowDown") {
          handleSearchResults({ type: "focus_down" });
          handleSearchResults({
            type: "activate",
            callback: () => forceSearch(),
          });
        }
      } else if (e.code == "Enter") {
        forceActivateSearchResults();
      } else if (
        e.code != "Enter" &&
        e.code != "ArrowLeft" &&
        e.code != "ArrowRight"
      ) {
        forceSearch();
      }
    });
  }, []);

  const [global_var, setGlobalVar] = useGlobalVar();

  const forceActivateSearchResults = () => {
    handleSearchResults({
      type: "force_activate",
      callback: (state) => {
        // console.log(state);
        if (state.data.length > 0) {
          onClick(state.data[state.focus]);
        }
      },
    });
    handleSearchResults({ type: "update", data: [] });
  };

  const [focused, setFocused] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        onForceSearch: () => {
          if (search_results.data.length > 0) {
            onClick(search_results.data[search_results.focus]);
          } else {
            setGlobalData({ error: "no_matching_name" });
          }
        },
      };
    },
    [search_results.focus, focused]
  );

  useEffect(() => {
    const focus = search_results.focus;
    const length = search_results.data.length;
    let ele_drop_down = document.getElementById("input_search_drop_down");
    if (focus < length) {
      let offset_top = document.getElementById(
        "input_search_" + search_results.focus
      ).offsetTop;
      let offset_bottom = 0;
      if (focus == length - 1) {
        offset_bottom = ele_drop_down.scrollHeight;
      } else {
        offset_bottom = document.getElementById(
          "input_search_" + (search_results.focus + 1)
        ).offsetTop;
      }
      // console.log(document.getElementById("input_search_drop_down").scrollTop);
      if (
        offset_bottom >=
        ele_drop_down.clientHeight + ele_drop_down.scrollTop
      ) {
        ele_drop_down.scrollTop = offset_bottom - ele_drop_down.clientHeight;
      } else if (offset_top <= ele_drop_down.scrollTop) {
        ele_drop_down.scrollTop = offset_top;
      }
    }
  }, [search_results.focus]);

  const forceSearch = () => {
    // places.keywordSearch(input_search.value, callback);
    if (search_field.current?.value?.length > 0) {
      const related_data = SAMPLE.filter((data) =>
        data.name.includes(search_field.current.value)
      )
        .sort((a, b) => a.name?.length - b.name?.length)
        .slice(0, 5);
      handleSearchResults({ type: "update", data: related_data });
    }
  };

  return (
    <div
      className={cx("wrapper", search_results.data.length > 0 ? "focused" : "")}
    >
      <div
        tabIndex="0"
        className={cx(
          "frame-field",
          search_results.data.length > 0 ? "dropdown" : ""
        )}
        onBlur={(e) => {
          // console.log(e);
          setTimeout(
            () => handleSearchResults({ type: "update", data: [] }),
            100
          );
          setFocused(false);
        }}
      >
        <div className={cx("frame-button", "full")}>
          <input
            id="input_search"
            className={cx("text-field")}
            type="text"
            placeholder="이름을 검색하시면 자신의 디자인을 확인할 수 있어요!"
            onFocus={() => {
              forceSearch();
              setFocused(true);
            }}
            ref={search_field}
            autoComplete="false"
          ></input>
        </div>

        <div
          className={cx("frame-button")}
          onMouseDown={() => {
            search_field.current.value = "";
          }}
        >
          <Icon type="close button" color="primary" size="1.75" />
        </div>
        {search_results.data.length > 0 ? (
          <div className={cx("frame-drop-down")}>
            <div id="input_search_drop_down" className={cx("drop-down")}>
              {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                search_results.data.map((e, idx) => (
                  // eslint-disable-next-line
                  <>
                    {idx == 0 ? <></> : <div className={cx("divider")}></div>}
                    <div
                      key={idx}
                      id={"input_search_" + idx}
                      tabIndex="-1"
                      className={cx(
                        "frame-list",
                        search_results.focus == idx ? "focused" : ""
                      )}
                      onMouseDown={() => {
                        onClick(e);
                      }}
                    >
                      <div className={cx("title")}>
                        {emphasizeText(e.name, input_search.value)}
                      </div>
                    </div>
                  </>
                ))
              }
              <div className={cx("frame-bottom")}></div>
            </div>
          </div>
        ) : focused ? (
          <div className={cx("frame-drop-down")}>
            <div id="input_search_drop_down" className={cx("drop-down")}>
              <div className={cx("frame-list")}>
                <div className={cx("title", "grey")}>
                  {"검색하신 이름이 없어요."}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
});

Search.defaultProps = {
  onClick: (e) => {
    console.log("clicked default search with param:");
    console.log(e);
  },
};

export default Search;
