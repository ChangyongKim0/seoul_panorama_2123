import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";

import styles from "./NotFound.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

let rewinder;

const NotFound = () => {
  const [count, reduceCount] = useReducer((state, _) => {
    return state - 1;
  }, 5);
  useEffect(() => {
    setInterval(reduceCount, 1000);
    rewinder = setTimeout(() => {
      window.location.href = "/";
    }, 4500);
    return () => {
      clearTimeout(rewinder);
    };
  }, []);

  return (
    <div className={cx("wrapper")}>
      <Link to="/">
        <div className={cx("frame-logo")}>
          <img className={cx("logo")} src="/logo512.png" alt="Propi"></img>
          <div className={cx("logo-title")}>Calculator × Propi</div>
        </div>
      </Link>
      <div></div>
      <div className={cx("text")}>잘못된 경로입니다.</div>
      <div className={cx("text")}>잠시 후 메인 페이지로 이동합니다.</div>
      <div className={cx("text", "emph")}>{count}</div>
    </div>
  );
};

export default NotFound;
