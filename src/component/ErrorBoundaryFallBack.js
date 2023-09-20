import React, { useEffect } from "react";
import useGlobalData from "../hooks/useGlobalData";
import useGlobalVar from "../hooks/useGlobalVar";

const ErrorBoundaryFallBack = ({ type, onFallBack = () => {} }) => {
  const [global_data, setGlobalData] = useGlobalData();
  const [global_var, setGlobalVar] = useGlobalVar();
  useEffect(() => {
    console.log("error occured");
    switch (type) {
      case "no_modeling_exists":
        setTimeout(() => {
          setGlobalData({ error: "no_modeling_exists" });
        }, 1000);
      case "no_modeling_exists_critical":
        setTimeout(() => {
          setGlobalData({ error: "no_modeling_exists_critical" });
          setGlobalVar({ loading_state: false });
        }, 1000);
    }
    onFallBack();
  }, [type, onFallBack]);
  return <></>;
};

export default ErrorBoundaryFallBack;
