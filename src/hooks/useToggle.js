import { useEffect, useReducer, useState } from "react";

const reduceToggle = (state, action) => {
  return !state;
};

const useToggle = (initial_state) => {
  return useReducer(reduceToggle, initial_state);
};

export default useToggle;
