import React, { useState, useEffect, useReducer, useRef } from "react";
// { useEffect }

import styles from "./ScoreGraph.module.scss";
import classNames from "classnames/bind";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import useButtonGesture from "../hooks/useButtonGesture";
import AutoLayout from "./AutoLayout";
import Icon from "./Icon";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion/dist/framer-motion";

const cx = classNames.bind(styles);

const ScoreGraph = ({ type, onClick, data }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const pathLength = useMotionValue(0);
  const opacity = useMotionValue(0);
  const erf = (mu, sigma, x) => {
    return 1 / (1 + Math.exp((-2 * Math.sqrt(2 / Math.PI) * (x - mu)) / sigma));
  };
  const path_variants = {
    initial: {
      pathLength: 0.01,
      opacity: 0.01,
    },
    while_in_view: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          type: "spring",
          bounce: 0.2,
          delay: 0.3,
          duration: 1,
        },
        opacity: {
          type: "spring",
          bounce: 0.2,
          delay: 0.3,
          duration: 1,
        },
      },
    },
  };
  const fill_variants = {
    initial: {
      opacity: 0.01,
    },
    while_in_view: {
      opacity: 1,
      transition: {
        opacity: {
          type: "spring",
          bounce: 0.2,
          delay: 0.9,
          duration: 1,
        },
      },
    },
  };
  return (
    <div className={cx("wrapper")}>
      <AutoLayout type="row" align="right" fillY gap={0}>
        <motion.div
          className={cx("frame-average", "type-" + type)}
          initial={{ left: data.average * 100 + "%", opacity: 0.01 }}
          whileInView={{ left: data.average * 100 + "%", opacity: 1 }}
          // viewport={{ once: true }}
          transition={{
            type: "spring",
            bounce: 0.2,
            delay: 0.3,
            duration: 1,
          }}
        >
          <div>{100 * data.average}%</div>
        </motion.div>
        <motion.svg
          initial="initial"
          whileInView="while_in_view"
          // viewport={{ once: true }}
          className={cx("graph", "type-" + type)}
        >
          <motion.path
            variants={path_variants}
            strokeWidth="2"
            stroke="#000"
            fill="none"
            d={new Array(window.innerWidth - 64)
              .fill(0)
              .map((e, idx) =>
                idx === 0
                  ? `M 0 ${160 - 160 * erf(data.average, data.stdev, 0)}`
                  : `L ${idx} ${
                      160 -
                      160 *
                        erf(
                          data.average,
                          data.stdev,
                          idx / (window.innerWidth - 64)
                        )
                    }`
              )
              .join(" ")}
          ></motion.path>
          <motion.path
            variants={fill_variants}
            fill="rgba(0,0,0,0.3)"
            d={
              new Array(window.innerWidth - 64)
                .fill(0)
                .map((e, idx) =>
                  idx === 0
                    ? `M 0 ${160 - 160 * erf(data.average, data.stdev, 0)}`
                    : `L ${idx} ${
                        160 -
                        160 *
                          erf(
                            data.average,
                            data.stdev,
                            idx / (window.innerWidth - 64)
                          )
                      }`
                )
                .join(" ") + ` L ${window.innerWidth - 64} 160 L 0 160 Z`
            }
          ></motion.path>
        </motion.svg>
      </AutoLayout>
    </div>
  );
};

ScoreGraph.defaultProps = {
  data: {
    values: [0.1, 0.45, 0.2, 0.15, 0, 0.1, 0, 0, 0, 0.3],
    average: 0.3,
    stdev: 0.15,
  },
};

export default ScoreGraph;

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
