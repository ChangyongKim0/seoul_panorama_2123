import React, {
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import classNames from "classnames/bind";
import "../util/reset.css";
import styles from "./ThreeDesktopDesign.module.scss";

import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

import {
  Canvas,
  useFrame,
  useGraph,
  useLoader,
  extend,
} from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
  Sphere,
  Stats,
  useTexture,
  Html,
} from "@react-three/drei";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { MathUtils } from "three";
import useGlobalData from "../hooks/useGlobalData";
import { useRhinoModel } from "../hooks/useRhinoModel";
import { getS3URL } from "../hooks/useS3";
import {
  _API_URL,
  _getThousandSepStrFromNumber,
  _transformScoreGraphData,
  getAngle,
  getDistance,
  getGuid,
  rotateX,
} from "../util/alias";
import axios from "axios";
import GLTFModel from "../component/GLTFModel";
import AutoLayout from "../component/AutoLayout";
import TextBox from "../component/TextBox";
import { _getTotConvertedScore } from "../util/getAsyncRankability";
import useGlobalVar from "../hooks/useGlobalVar";
import { ErrorBoundary } from "../component/ErrorBoundary";
import ErrorBoundaryFallBack from "../component/ErrorBoundaryFallBack";

const cx = classNames.bind(styles);

const ThreeDesktopDesign = forwardRef(
  (
    {
      user_name = "반가워fffff",
      show_model,
      main_cam,
      orbit_controls,
      setCamPos,
      setCamTarget,
      setTouchDisabled,
      clicked_state,
      setClickedState,
      onEachProgress = console.log,
      onClick = console.log,
      force_load = false,
      force_unload = false,
      min_zoom = 50,
      max_zoom = 200,
    },
    ref
  ) => {
    const [valid, setValid] = useState(false);
    const [global_data, setGlobalData] = useGlobalData();
    const [global_var, setGlobalVar] = useGlobalVar();
    const terrain = useRef();
    const line = useRef();
    const [popup_pos, setPopupPos] = useState([4728, 100, -1559]);
    const [popup_cam_pos, setPopupCamPos] = useState([5728, 1100, -559]);
    const [score, setScore] = useState(0);
    const [visible, setVisible] = useState(true);
    const [prior_visible, setPriorVisible] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [user_info, setUserInfo] = useState({});
    const html = useRef();
    const FACTOR = 2.5;
    const frame_bar = useRef();

    useEffect(() => {
      axios
        .put(_API_URL + "user_info", {
          user_name,
        })
        .then((res) => {
          console.log(res);
          setValid(true);
          const pos = rotateX(
            res.data?.position?.length > 0
              ? res.data.position
              : [4728, 1559, 100]
          ).map((e, idx) => (idx === 1 ? e + 25 : e));
          const cam_pos = rotateX(
            res.data?.position?.length > 0
              ? res.data.position
              : [4728, 1559, 100]
          ).map((e, idx) => e + FACTOR * res.data.cam_pos[idx]);
          setPopupPos(pos);
          setPopupCamPos(cam_pos);
          if (force_load) {
            console.log("good");
            setCamTarget(pos);
            setCamPos(cam_pos);
            setTouchDisabled(true);
            setClickedState("clicked");
            setClicked(true);
          }
          setUserInfo(res.data);
        });
    }, []);

    useEffect(() => {
      const region_no = user_info?.this_region_data?.name?.toString() || "1";
      setGlobalData((global_data) => {
        if (global_data.user_score === undefined) {
          global_data.user_score = {};
        }
        if (global_data.user_score[region_no] === undefined) {
          global_data.user_score[region_no] = {};
        }
        global_data.user_score[region_no][user_name] = score;
        return { user_score: global_data.user_score };
      });
      return () => {
        setGlobalData((global_data) => {
          Object.keys(global_data.user_score[region_no]).forEach((key2) => {
            if (key2.split("_").includes(user_name.split("_")?.[0])) {
              delete global_data.user_score[region_no][key2];
            }
          });
          return { user_score: global_data.user_score };
        });
      };
    }, [score]);

    useEffect(() => {
      if (user_info.internal_score) {
        setScore(
          _getTotConvertedScore(
            user_info.internal_score,
            user_info.this_region_data?.name,
            ..._transformScoreGraphData(global_data.score_graph_data)
          )
        );
      }
    }, [user_info, global_data.score_graph_data]);

    useEffect(() => {
      console.log(line.current);
    }, [line.current]);

    useImperativeHandle(
      ref,
      () => ({
        html: html.current,
        frame_bar: frame_bar.current,
        user_info,
        score,
        prior_visible,
        setPriorVisible,
      }),
      [
        html.current,
        frame_bar.current,
        user_info,
        score,
        prior_visible,
        setPriorVisible,
      ]
    );

    useEffect(() => {
      console.log(global_var.send_force_click, user_name);
      if (global_var.send_force_click) {
        if (global_var.send_force_click === user_name) {
          console.log("good");
          setCamTarget(popup_pos);
          setCamPos(popup_cam_pos);
          setTouchDisabled(true);
          setClickedState("clicked");
          setClicked(true);
        } else {
          setClicked(false);
        }
      }
    }, [global_var.send_force_click, force_load]);

    useEffect(() => {
      if (clicked_state === "unclicked") {
        setClicked(false);
      } else if (clicked_state === "clicked") {
        setGlobalVar({ loading_state: "downloading" });
      }
      console.log(clicked_state, clicked);
    }, [clicked_state]);

    return valid ? (
      <Suspense fallback={<mesh />}>
        <group position={[0, 20, 0]} ref={line}>
          {(clicked_state === "zoomed" || clicked_state === "clicked") &&
            clicked && (
              <ErrorBoundary
                fallback={
                  <ErrorBoundaryFallBack
                    type="no_modeling_exists_critical"
                    onFallBack={() => {
                      setTimeout(() => {
                        setClicked(false);
                        setClickedState("unclicked");
                      }, 1000);
                    }}
                  />
                }
              >
                <GLTFModel
                  key={user_name}
                  url={getS3URL(
                    "",
                    "development/modeling/" + user_name + ".gltf"
                  )}
                  onLoaded={() => {
                    setGlobalVar({ loading_state: false });
                  }}
                  onFail={() => {
                    setGlobalData({ error: "loading_timeout" });
                    setClickedState("unclicked");
                    setGlobalVar({
                      loading_state: false,
                      send_force_click: false,
                      send_force_load: false,
                    });
                  }}
                />
              </ErrorBoundary>
            )}
          <ErrorBoundary>
            <GLTFModel
              color={0xdd580e}
              key={user_name}
              url={getS3URL(
                "",
                "development/silhouette/" + user_name + ".gltf"
              )}
              visible={
                (!(clicked_state === "zoomed" || clicked_state === "clicked") ||
                  !clicked) &&
                !force_unload
              }
            />
          </ErrorBoundary>
          <group ref={html} position={popup_pos}>
            <Html
              occlude
              onOcclude={(occuluded) => {
                console.log("occuluded");
                setVisible(!occuluded);
              }}
              transform={true}
              style={{
                transition: "all 0.2s",
                opacity: (visible && prior_visible) || force_load ? 1 : 0,
                transform: `scale(${
                  (visible && prior_visible) || force_load ? 1 : 0.25
                })`,
                backgroundColor: 0xff0000,
              }}
            >
              <div
                className={cx("wrapper")}
                onClick={(event) => {
                  event.stopPropagation();
                  console.log("clicked");
                  if (
                    clicked_state === "unzoomed" ||
                    clicked_state === "unclicked"
                  ) {
                    setCamTarget(popup_pos);
                    setCamPos(popup_cam_pos);
                    setTouchDisabled(true);
                    setClickedState("clicked");
                    setClicked(true);
                  } else if (clicked_state === "zoomed") {
                    setClickedState("unclicked");
                    setGlobalVar({
                      send_force_click: false,
                      send_force_load: false,
                    });
                  }
                }}
              >
                <AutoLayout fill>
                  <TextBox type="section" align="center">
                    {[user_name.split("_")?.[0]]}
                  </TextBox>
                  <TextBox type="section" align="center">
                    {[
                      _getThousandSepStrFromNumber(
                        Math.round(10000 * score) + "점"
                      ),
                    ]}
                  </TextBox>
                </AutoLayout>
                <div className={cx("frame-bar")} ref={frame_bar}></div>
              </div>
            </Html>
          </group>
        </group>
      </Suspense>
    ) : (
      <></>
    );
  }
);

export default ThreeDesktopDesign;
