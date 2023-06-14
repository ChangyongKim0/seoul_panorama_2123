import React, {
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import "../util/reset.css";
import styles from "./Loading.module.scss";

import * as THREE from "three";
import AutoLayout from "./AutoLayout";

const cx = classNames.bind(styles);

const Loading = ({ each_xhr }) => {
  const xhr = {
    loaded: Object.keys(each_xhr).reduce(
      (prev, key) => prev + each_xhr[key].loaded,
      0
    ),
    total: Object.keys(each_xhr).reduce(
      (prev, key) => prev + each_xhr[key].total,
      0
    ),
  };
  const [state, setState] = useState(0);
  useEffect(() => {
    const set_interval = setInterval(() => {
      setState((prev) => prev + 1);
    }, 200);
    return () => {
      clearInterval(set_interval);
    };
  }, []);

  return (
    <div className={cx("wrapper")}>
      <AutoLayout fill attach="center" gap={1.25}>
        <img className={cx("frame-image")} src="/img/loading/01.png" />
        <AutoLayout attach="center" gap={0.25}>
          <AutoLayout type="row" gap={0.25}>
            {["L", "O", "A", "D", "I", "N", "G", "..."].map((e, idx) => (
              <p
                className={cx("text", state % 8 >= idx ? "emph" : "fade")}
                key={idx}
              >
                {e}
              </p>
            ))}
          </AutoLayout>
          {each_xhr && (
            <div className={cx("text")}>
              {Math.round(((xhr.loaded || 0) / (xhr.total || 1)) * 100)}%
            </div>
          )}
        </AutoLayout>
      </AutoLayout>
    </div>
  );
};

Loading.defaultProps = { each_xhr: {} };

export default Loading;
