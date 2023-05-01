import React, { useReducer } from "react";

const useButtonGesture = (normal_style, click_style, delay) => {
  const [button_state, setButtonState] = useReducer(
    (state, action) => {
      return { ...state, ...action };
    },
    { mouse_down: false, mouse_up: false, set_time_out: false }
  );

  const onMouseDown = () => {
    setButtonState({ mouse_down: true, mouse_up: false });
  };
  const onMouseUp = () => {
    setButtonState({ mouse_up: true, mouse_down: false });
  };
  const useEffectContent = () => {
    if (button_state.mouse_down && button_state.set_time_out) {
      clearTimeout(button_state.set_time_out);
      setButtonState({ set_time_out: false });
    } else if (button_state.mouse_up && !button_state.set_time_out) {
      setButtonState({
        set_time_out: setTimeout(
          () => setButtonState({ mouse_down: false, mouse_up: false }),
          delay
        ),
        mouse_down: false,
      });
    }
  };

  const style_content = button_state.mouse_up
    ? { ...normal_style, transition: "all " + delay / 1000 + "s" }
    : button_state.mouse_down
    ? { ...click_style, transition: "none" }
    : { ...normal_style, transition: "none" };
  return [
    button_state,
    onMouseDown,
    onMouseUp,
    useEffectContent,
    style_content,
  ];
};

export default useButtonGesture;
