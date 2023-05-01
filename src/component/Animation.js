import { motion } from "framer-motion/dist/framer-motion";
import styles from "./Animation.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Animation = ({
  type,
  children,
  useExit,
  useOnlyExit,
  delay,
  duration,
  absolute,
  zIndex,
  tight,
  fill,
}) => {
  const animation_props = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    fade_swap: {
      initial: { opacity: 0, scale: 0.975 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.975 },
      transition: { duration: 0.3 },
    },
    pop: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.75 },
      transition: { duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] },
    },
    slide_left: {
      initial: { paddingLeft: "100%", width: "0%", overflow: "hidden" },
      animate: { paddingLeft: "0%", width: "100%", overflow: "hidden" },
      exit: { paddingLeft: "100%", width: "0%", overflow: "hidden" },
      transition: { duration: 0.6, ease: [0, 0.71, 0.2, 1.01] },
    },
    slide_left_70: {
      initial: { paddingLeft: "100%", width: "0%", overflow: "hidden" },
      animate: { paddingLeft: "30%", width: "70%", overflow: "hidden" },
      exit: { paddingLeft: "100%", width: "0%", overflow: "hidden" },
      transition: { duration: 0.6, ease: [0, 0.71, 0.2, 1.01] },
    },
    slide_right: {
      initial: { paddingRight: "100%", width: "0%", overflow: "hidden" },
      animate: { paddingRight: 0, width: "100%", overflow: "hidden" },
      exit: { paddingRight: "100%", width: "0%", overflow: "hidden" },
      transition: { duration: 0.6, ease: [0, 0.71, 0.2, 1.01] },
    },
    default: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0.3 },
    },
  };

  const getAnimationProps = (type) => {
    let key = type;
    if (!Object.keys(animation_props).includes(type)) {
      key = "default";
    }
    const props = animation_props[key];
    const initial = !useOnlyExit ? props.initial : {};
    const exit = useExit || useOnlyExit ? props.exit : {};
    let transition = props.transition;
    transition =
      duration !== undefined ? { ...transition, duration } : transition;
    transition = delay !== undefined ? { ...transition, delay } : transition;

    return { ...props, initial, exit, transition };
  };

  return (
    <motion.div
      className={cx(
        "wrapper",
        absolute ? "absolute" : "",
        tight ? "tight" : "",
        fill ? "fill" : ""
      )}
      {...getAnimationProps(type)}
      style={{ zIndex: zIndex }}
    >
      {children}
    </motion.div>
  );
};

export default Animation;
