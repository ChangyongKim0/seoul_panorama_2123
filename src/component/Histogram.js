import React, { useState, useEffect, useReducer, useRef } from "react";
// { useEffect }

import styles from "./Histogram.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import useButtonGesture from "../hooks/useButtonGesture";
import AutoLayout from "./AutoLayout";
import Icon from "./Icon";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";

const cx = classNames.bind(styles);

const Histogram = ({ type, onClick, data }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  return (
    <div className={cx("wrapper")}>
      <AutoLayout type="row" align="right" fillY gap={0}>
        {data?.values?.map?.((e, idx) => {
          return (
            <motion.div
              key={idx}
              className={cx("frame-bar", "type-" + type)}
              // style={bar_style}
              initial={{ height: 0.1 }}
              whileInView={{ height: e * 10 + "rem" }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 1,
              }}
            >
              <div className={cx("frame-bar-inside", "type-" + type)}></div>
            </motion.div>
          );
        })}
        <motion.div
          className={cx("frame-average", "type-" + type)}
          // style={bar_style}
          initial={{ left: data.average * 100 + "%", opacity: 0.01 }}
          whileInView={{ left: data.average * 100 + "%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 1,
          }}
        >
          <div className={cx("frame-average-text")}>{100 * data.average}%</div>
        </motion.div>
      </AutoLayout>
    </div>
  );
};

Histogram.defaultProps = {
  data: { values: [0.1, 0.45, 0.2, 0.15, 0, 0.1, 0, 0, 0, 0.3], average: 0.3 },
};

export default Histogram;

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
