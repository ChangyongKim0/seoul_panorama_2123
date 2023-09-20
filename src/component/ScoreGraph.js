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
import { _fillZeros, _getThousandSepStrFromNumber } from "../util/alias";

const cx = classNames.bind(styles);

const ScoreGraph = ({ type, onClick, data, resolution = 100, my }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const pathLength = useMotionValue(0);
  const opacity = useMotionValue(0);
  const [show_score, setShowScore] = useState(false);
  const [score_client_x, setScoreClientX] = useState(0);
  const [score_data, setScoreData] = useState({ x: 0, y: 0 });
  const [show_score_timeout_id, setShowScrollTimeoutId] = useState();

  const erf = (mu, sigma, x) => {
    return (
      1 /
      (1 +
        Math.exp(
          (-2 * Math.sqrt(2 / Math.PI) * (x - mu)) / Math.sqrt(2) / sigma
        ))
    );
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
  useEffect(() => {
    const inner_width = Math.min(window.innerWidth, 640);
    if (score_client_x > 32 && score_client_x < inner_width - 32) {
      const x = (score_client_x - 32) / (inner_width - 64);
      setScoreData({
        x,
        y: erf(data.mean / data.max_score, data.stdev / data.max_score, x),
      });
    }
  }, [score_client_x]);
  return (
    <div
      className={cx("wrapper")}
      onTouchStart={(e) => {
        clearTimeout(show_score_timeout_id);
        setShowScore(true);
        setScoreClientX(e?.touches?.[0]?.clientX || 0);
      }}
      onTouchMove={(e) => {
        setScoreClientX(e?.touches?.[0]?.clientX || 0);
        // e.stopPropagation();
      }}
      onTouchEnd={() => {
        setShowScrollTimeoutId(
          setTimeout(() => {
            setShowScore(false);
          }, 300)
        );
      }}
    >
      <AutoLayout type="row" align="right" fillY gap={0}>
        <motion.div
          className={cx("frame-average", "type-" + type)}
          initial={{
            left: (data.mean / data.max_score) * 100 + "%",
            opacity: 0.01,
          }}
          whileInView={{
            left: (data.mean / data.max_score) * 100 + "%",
            opacity: 1,
          }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            bounce: 0.2,
            delay: 0.3,
            duration: 1,
          }}
        >
          <div
            className={cx(
              "text-base-score",
              data.mean / data.max_score > 0.5 ? "left" : "right"
            )}
          >
            {data.mean / data.max_score > 0.5
              ? [global_var.use_eng
              ? "Avg. Level"
              : "평균 레벨"] + ` : ${_fillZeros(
                  Math.round(10 * data.mean) / 10,
                  1,
                  true
                )} ↗`
              : [global_var.use_eng
              ? "↖ Avg. Level"
              : "↖ 평균 레벨"] + ` : ${_fillZeros(
                  Math.round(10 * data.mean) / 10,
                  1,
                  true
                )}`}
          </div>
          <div className={cx("text-score")} style={{ bottom: "50%" }}>
          {[global_var.use_eng
                  ? "↖ 5,000pts"
                  : "↖ 5,000점"]}
          </div>
        </motion.div>
        <motion.div
          className={cx("frame-average", "type-" + type, "my")}
          initial={{
            left: (my / data.max_score) * 100 + "%",
            opacity: 0.01,
          }}
          whileInView={{
            left: (my / data.max_score) * 100 + "%",
            opacity: 1,
          }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            bounce: 0.2,
            delay: 0.3,
            duration: 1,
          }}
        >
          <div
            className={cx(
              "text-base-score",
              "my",
              my / data.max_score > 0.5 ? "left" : "right"
            )}
          >
            {my / data.max_score > 0.5
              ? [global_var.use_eng
              ? "My Level"
              : "나의 레벨"] + ` : ${_fillZeros(Math.round(10 * my) / 10, 1, true)} ↘`
              : [global_var.use_eng
              ? "↙ My Level"
              : "↙ 나의 레벨"] + ` : ${_fillZeros(
                  Math.round(10 * my) / 10,
                  1,
                  true
                )}`}
          </div>
          <div
            className={cx(
              "text-score",
              "my",
              my > data.mean ? "down" : "up",
              my / data.max_score > 0.5 ? "left" : "right"
            )}
            style={{
              bottom:
                Math.max(
                  100 *
                    erf(
                      data.mean / data.max_score,
                      data.stdev / data.max_score,
                      my / data.max_score
                    ),
                  10
                ) + "%",
            }}
          >
            {(my / data.max_score <= 0.5
              ? my > data.mean
                ? "↖ "
                : "↙ "
              : "") +
              `${_getThousandSepStrFromNumber(
                Math.round(
                  10000 *
                    erf(
                      data.mean / data.max_score,
                      data.stdev / data.max_score,
                      my / data.max_score
                    )
                )
              )}` + [global_var.use_eng
                ? "pts"
                : "점"] +
              (my / data.max_score > 0.5 ? (my > data.mean ? " ↗" : " ↘") : "")}
          </div>
        </motion.div>
        <motion.div
          className={cx("frame-average", "smooth", "type-" + type)}
          style={{
            left: score_data.x * 100 + "%",
            opacity: show_score ? 1 : 0,
          }}
        >
          <div className={cx("text-base-score")}>
            {_fillZeros(
              Math.round(10 * score_data.x * data.max_score) / 10,
              1,
              true
            )}
          </div>
          <div
            className={cx(
              "text-score",
              score_data.y > 0.5 ? "down" : "up",
              score_data.x > 0.5 ? "left" : "right"
            )}
            style={{ bottom: 100 * score_data.y + "%" }}
          >
            {(score_data.x <= 0.5 ? (score_data.y > 0.5 ? "↖ " : "↙ ") : "") +
              `${_getThousandSepStrFromNumber(
                Math.round(10000 * score_data.y)
              )}` + [global_var.use_eng
                ? "pts"
                : "점"] +
              (score_data.x > 0.5 ? (score_data.y > 0.5 ? " ↗" : " ↘") : "")}
          </div>
        </motion.div>
        <motion.svg
          initial="initial"
          whileInView="while_in_view"
          viewport={{ once: true }}
          className={cx("graph", "type-" + type)}
        >
          <motion.path
            variants={path_variants}
            strokeWidth="2"
            stroke="#758a79"
            fill="none"
            d={new Array(Math.round(resolution + 1))
              .fill(0)
              .map((e, idx) =>
                idx === 0
                  ? `M 0 ${
                      160 -
                      160 *
                        erf(
                          data.mean / data.max_score,
                          data.stdev / data.max_score,
                          0
                        )
                    }`
                  : `L ${
                      (idx / resolution) *
                      (Math.min(window.innerWidth, 640) - 64)
                    } ${
                      160 -
                      160 *
                        erf(
                          data.mean / data.max_score,
                          data.stdev / data.max_score,
                          idx / resolution
                        )
                    }`
              )
              .join(" ")}
          ></motion.path>
          <motion.path
            variants={fill_variants}
            fill="#758a7933"
            d={
              new Array(Math.min(window.innerWidth, 640) - 64)
                .fill(0)
                .map((e, idx) =>
                  idx === 0
                    ? `M 0 ${
                        160 -
                        160 *
                          erf(
                            data.mean / data.max_score,
                            data.stdev / data.max_score,
                            0
                          )
                      }`
                    : `L ${idx} ${
                        160 -
                        160 *
                          erf(
                            data.mean / data.max_score,
                            data.stdev / data.max_score,
                            idx / (Math.min(window.innerWidth, 640) - 64)
                          )
                      }`
                )
                .join(" ") +
              ` L ${Math.min(window.innerWidth, 640) - 64} 160 L 0 160 Z`
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
    mean: 0.3,
    stdev: 0.15,
  },
  resolution: 100,
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
