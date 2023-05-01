import React from "react";
// { useEffect }

import styles from "./Divider.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Divider = ({ emph, opaque, black }) => {
  return (
    <div
      className={cx(
        "wrapper",
        emph ? "emph" : "",
        opaque ? "opaque" : "",
        black ? "black" : ""
      )}
    >
      ----------------------------------------------------------------------------------------------------
    </div>
  );
};

Divider.defaultProps = {
  style: "default",
  color: "grey",
  vertical: false,
  length: "100%",
};

export default Divider;

// ### Divider

// - style: default / bold / dashed / faint
// - color: primary / grey
