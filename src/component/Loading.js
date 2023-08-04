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

const Loading = ({ each_xhr = {} }) => {
  const xhr = useMemo(
    () =>
      Object.keys(each_xhr?.data || {}).reduce(
        (prev, curr) =>
          prev + each_xhr?.data[curr].loaded / each_xhr?.data[curr].total,
        0
      ) / (each_xhr?.count || 1),
    [each_xhr]
  );
  const TIME_SEC_EACH = useMemo(() => each_xhr.time_sec_each || 3, [each_xhr]);
  const TIME_SEC_LAST = useMemo(() => each_xhr.time_sec_last || 2, [each_xhr]);
  const FACTOR = useMemo(
    () => 100 - (each_xhr?.count || 1) * TIME_SEC_EACH - TIME_SEC_LAST,
    [each_xhr]
  );
  const [state, setState] = useState(0);
  const use_additional_percentage = useMemo(() => {
    // console.log(xhr, Object.keys(each_xhr?.data || {}));
    return Math.floor(xhr * each_xhr?.count + 0.01);
  }, [xhr]);
  const [addtional_percentage, setAdditionalPercentage] = useState(-1);
  useEffect(() => {
    const set_interval = setInterval(() => {
      setState((prev) => prev + 1);
    }, 200);
    return () => {
      clearInterval(set_interval);
    };
  }, []);
  useEffect(() => {
    let set_additional_percentage_interval;
    if (use_additional_percentage === each_xhr?.count) {
      set_additional_percentage_interval = setInterval(() => {
        setAdditionalPercentage((prev) =>
          prev < TIME_SEC_EACH + TIME_SEC_LAST - 1 ? prev + 1 : prev
        );
      }, 1000);
    }
    if (use_additional_percentage > 0) {
      set_additional_percentage_interval = setInterval(() => {
        setAdditionalPercentage((prev) =>
          prev < TIME_SEC_EACH - 1 ? prev + 1 : prev
        );
      }, 1000);
    }
    return () => {
      clearInterval(set_additional_percentage_interval);
      setAdditionalPercentage(-1);
    };
  }, [use_additional_percentage]);

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
              {Math.round(
                xhr * FACTOR +
                  Math.max(addtional_percentage, 0) +
                  Math.max((use_additional_percentage || 0) - 1, 0) *
                    TIME_SEC_EACH
              )}
              %
            </div>
          )}
        </AutoLayout>
      </AutoLayout>
    </div>
  );
};

export default Loading;
