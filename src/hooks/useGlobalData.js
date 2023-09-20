import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useReducer,
} from "react";

export const GlobalDataContext = createContext({
  global_data: {},
  setGlobalData: () => {},
});

const local_storage_list = [
  "test",
  "background_state",
  "bldg_state",
  "undo_redo_data",
  // "background_relation",
  "grids",
  "default_position",
  "vec_target",
  "cam_pos",
  "this_region_data",
  "id",
];

const useGlobalData = () => {
  const { global_data, setGlobalData } = useContext(GlobalDataContext);
  return [global_data, setGlobalData];
};

const setLocalStorage = (key, item) => {
  if (item) {
    try {
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.log(e);
      console.log(item);
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
    console.log(new_action);
    console.log("global data updated.");
    Object.keys(new_action).map((key) => {
      if (local_storage_list.includes(key)) {
        setLocalStorage(key, new_action[key]);
      }
    });
    return { ...state, ...new_action };
  }
  console.log(action);
  console.log("global data updated.");
  Object.keys(action).forEach((key) => {
    if (local_storage_list.includes(key)) {
      setLocalStorage(key, action[key]);
    }
  });
  console.log({ ...state, ...action });
  return { ...state, ...action };
};

export const GlobalDataProvider = ({ children }) => {
  const [global_data, setGlobalData] = useReducer(reduceGlobalData, {
    buffer: new Set(),
    editing_data: {},
    assumptions: [],
    clicked_meshs: [],
  });
  useLayoutEffect(() => {
    setGlobalData(
      local_storage_list.reduce((prev, key) => {
        prev[key] = getLocalStorage(key);
        return prev;
      }, {})
    );
  }, []);
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
