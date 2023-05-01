import React, { createContext, useContext, useMemo, useReducer } from "react";

export const GlobalDataContext = createContext({
  global_data: {},
  setGlobalData: () => {},
});

const useGlobalData = () => {
  const { global_data, setGlobalData } = useContext(GlobalDataContext);
  return [global_data, setGlobalData];
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
  console.log(action);
  console.log("global data updated.");
  return { ...state, ...action };
};

export const GlobalDataProvider = ({ children }) => {
  const [global_data, setGlobalData] = useReducer(reduceGlobalData, {
    buffer: new Set(),
    editing_data: {},
    assumptions: [],
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
