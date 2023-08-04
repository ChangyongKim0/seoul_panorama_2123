import React, { createContext, useContext, useMemo, useReducer } from "react";

export const GlobalDataContext = createContext({
  global_data: {},
  setGlobalData: () => {},
});

const local_storage_list = [
  "test",
  "background_state",
  "bldg_state",
  "undo_redo_data",
  "background_relation",
];

const useGlobalData = () => {
  const { global_data, setGlobalData } = useContext(GlobalDataContext);
  return [global_data, setGlobalData];
};

const setLocalStorage = (key, item) => {
  if (item) {
    try {
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch {
      window.localStorage.setItem(key, item);
    }
  }
};

const getLocalStorage = (key) => {
  const temp = window.localStorage.getItem(key);
  try {
    return JSON.parse(temp);
  } catch {
    return temp;
  }
};

const reduceGlobalData = (state, action) => {
  // if (action.data[action.type] == undefined) {
  //   action.data[action.type] = {};
  // }
  // Object.keys(action.data || {}).map((key) => {
  //   console.log(new_state);
  //   console.log(action);
  //   if (action.data[action.type][key] != undefined) {
  //     new_state[action.type][key] = action.data[action.type][key];
  //   }
  // });
  if (typeof action === "function") {
    const new_action = action(state);
    if (new_action.type !== "silent") {
      console.log(new_action);
      console.log("global data updated.");
    }
    Object.keys(new_action).map((key) => {
      if (local_storage_list.includes(key)) {
        setLocalStorage(key, new_action[key]);
      }
    });
    return { ...state, ...new_action };
  }
  if (action.type !== "silent") {
    console.log(action);
    console.log("global data updated.");
  }
  Object.keys(action).map((key) => {
    if (local_storage_list.includes(key)) {
      setLocalStorage(key, action[key]);
    }
  });
  return { ...state, ...action };
};

export const GlobalDataProvider = ({ children }) => {
  const [global_data, setGlobalData] = useReducer(reduceGlobalData, {
    buffer: new Set(),
    editing_data: {},
    assumptions: [],
    clicked_meshs: [],
    test: getLocalStorage("test"),
    background_state: getLocalStorage("background_state"),
    bldg_state: getLocalStorage("bldg_state"),
    undo_redo_data: getLocalStorage("undo_redo_data"),
  });
  const value = useMemo(() => {
    return { global_data, setGlobalData };
  }, [global_data, setGlobalData]);

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export default useGlobalData;
