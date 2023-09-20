import { useState, useEffect } from "react";

export const useEffectAfterFirst = (fn, dep) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    // console.log("first", first);
    if (!first) {
      fn();
    } else {
      setFirst(false);
    }
  }, dep);
};
