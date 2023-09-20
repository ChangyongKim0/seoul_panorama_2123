import React from "react";

import styles from "./CustomImage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CustomImage = ({ srcset, width = 1, height = 1, fillY }) => {
  return (
    <picture className={cx("wrapper")}>
      <source srcSet={srcset} media="(min-width:0px)" />
      <img
        src={srcset}
        style={{
          aspectRatio: width / height,
          width: fillY ? "auto" : "100%",
          height: fillY ? "100%" : "auto",
          display: "block",
        }}
      />
    </picture>
  );
};

export default CustomImage;
