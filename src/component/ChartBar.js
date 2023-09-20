import React, { useState, useEffect, useReducer, useRef, useMemo } from "react";
// { useEffect }

import styles from "./ChartBar.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import AutoLayout from "../component/AutoLayout";
import Icon from "../component/Icon";
import { motion } from "framer-motion/dist/framer-motion";

const cx = classNames.bind(styles);

const ChartBar = ({
  type,
  onClick,
  title_left,
  title_right,
  percent,
  right,
  border,
  fill_window,
}) => {
  const wrapper = useRef();
  const [wrapper_width, setWrapperWidth] = useState("0px");
  const bar_width = useMemo(() => {
    if (wrapper.current) {
      console.log(
        Number(window.getComputedStyle(wrapper.current).width.split("px")[0]) *
          percent
      );
      return (
        Number(window.getComputedStyle(wrapper.current).width.split("px")[0]) *
        percent
      );
    } else {
      return 0;
    }
  }, [percent, wrapper.current]);

  useEffect(() => {
    if (wrapper.current) {
      setWrapperWidth(
        "calc(" +
          (fill_window
            ? window.innerWidth - 32 + "px"
            : window.getComputedStyle(wrapper.current).width) +
          " - " +
          (["small", "small-emph"].includes(type) ? "1" : "2") +
          "rem)"
      );
    } else {
      setWrapperWidth("0px");
    }
  }, [wrapper.current, fill_window]);

  return (
    <div
      className={cx(
        "wrapper",
        "type-" + type,
        right ? "right" : "",
        border ? "border" : ""
      )}
      ref={wrapper}
    >
      <div
        className={cx(
          "frame-back-background",
          "type-" + type,
          right ? "right" : "",
          border ? "border" : ""
        )}
      >
        <div
          className={cx(
            "frame-back-text",
            "type-" + type,
            right ? "right" : "",
            border ? "border" : ""
          )}
        >
          {title_left}
        </div>
        <div
          className={cx(
            "frame-back-text",
            "type-" + type,
            right ? "right" : "",
            border ? "border" : ""
          )}
        >
          {title_right}
        </div>
      </div>
      <motion.div
        className={cx(
          "frame-front-bar",
          "type-" + type,
          right ? "right" : "",
          border ? "border" : ""
        )}
        // style={bar_style}
        initial={{ width: 0.1 }}
        whileInView={{ width: bar_width }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 1,
        }}
      >
        <div
          className={cx(
            "frame-front-background",
            "type-" + type,
            right ? "right" : "",
            border ? "border" : ""
          )}
          style={{ width: wrapper_width }}
          onClick={() =>
            console.log(window.getComputedStyle(wrapper.current).width)
          }
        >
          <div
            className={cx(
              "frame-front-text",
              "type-" + type,
              right ? "right" : "",
              border ? "border" : ""
            )}
          >
            {title_left}
          </div>
          <div
            className={cx(
              "frame-front-text",
              "type-" + type,
              right ? "right" : "",
              border ? "border" : ""
            )}
          >
            {title_right}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

ChartBar.defaultProps = {
  type: "normal",
  title_left: "샘플",
  title_right: "50%",
  percent: 0.8,
};

export default ChartBar;

// ### Card

// - shape: default / rectangle
// - children: any
// - padding: int
// - clickable: boolean
// - transparent: boolean
// - onClick: ()=>any
// - use_tooltip: boolean
// - tooltip: [any]
// - tight: boolean
