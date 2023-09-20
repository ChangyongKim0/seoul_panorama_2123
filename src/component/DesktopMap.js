import React, {
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import "../util/reset.css";
import styles from "./DesktopMap.module.scss";

import * as THREE from "three";

import {
  Canvas,
  useFrame,
  useGraph,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  SoftShadows,
  Sphere,
  Stats,
  useTexture,
} from "@react-three/drei";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";
import { MathUtils } from "three";
import AutoLayout from "./AutoLayout";
import Loading from "./Loading";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import RhinoModel from "./RhinoModel";
import ThreeMap from "../threejs_component/ThreeMap";
import {
  _getThousandSepStrFromNumber,
  constrainVector,
  getAngle,
  getDistance,
  rotateX,
} from "../util/alias";
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import {
  getGridIsovectorsFromGrasshopperText,
  getRegionDataFromGrasshopperText,
} from "../util/grasshopperText";
import axios from "axios";
import { getS3URL } from "../hooks/useS3";
import ThreeHere from "../threejs_component/ThreeHere";
import ThreeDesktopMap from "../threejs_component/ThreeDesktopMap";
import ThreeDesktopDesign from "../threejs_component/ThreeDesktopDesign";

const cx = classNames.bind(styles);

// const OrbitControls = oc(THREE);

const SampleHouse = ({
  onEachProgress,
  clicked_state,
  setClickedState,
  is_small_window,
  compass,
  ruler,
}) => {
  const size = useMemo(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    [window.innerWidth, window.innerHeight]
  );

  const MAX_HEIGHT = useMemo(
    () => ((is_small_window ? 15000 : 38000) * size.height) / size.width,
    [size, is_small_window]
  );
  const CAM_TARGET_0 = [2950, 100, -2000];
  const CAM_POS_0 = useMemo(
    () =>
      CAM_TARGET_0.map(
        (e, idx) =>
          e + ((is_small_window ? (idx === 2 ? -1 : 1) : 1) * MAX_HEIGHT) / 2
      ),
    [MAX_HEIGHT, is_small_window]
  );
  const BOUND = useMemo(() => [1250, MAX_HEIGHT, 750], [MAX_HEIGHT]);

  const Group = ({ children }) => {
    return children;
  };

  const fov = 10;
  const map = useRef();
  const pavings = useRef();
  const trees = useRef();
  const [show_paving, setShowPaving] = useState(false);
  const main_cam = useRef();
  const orbit_controls = useRef();

  const [cam_target, setCamTarget] = useState(CAM_TARGET_0);
  const [cam_pos, setCamPos] = useState([10000, 10000, 10000]);
  const [map_clicked, setMapClicked] = useState(false);
  const [touch_disabled, setTouchDisabled] = useState(false);
  const [on_change, setOnChange] = useState(0);
  const [global_data, setGlobalData] = useGlobalData();
  const [global_var, setGlobalVar] = useGlobalVar();
  const [setTimeoutIds, setSetTimeoutIds] = useReducer((state, action) => {
    switch (action.type) {
      case "push":
        return [...state, action.id];
      case "delete all":
        state.forEach((e) => {
          // console.log("clear "+ e)
          clearTimeout(e);
        });
        return [];
    }
  }, []);

  const { invalidate } = useThree();

  const renewSetTimeout = (
    setSetTimeoutIds,
    setClickedState,
    setGlobalData,
    setGlobalVar
  ) => {
    setSetTimeoutIds({ type: "delete all" });
    setSetTimeoutIds({
      type: "push",
      id: setTimeout(() => {
        setClickedState("unclicked");
        setGlobalVar({
          send_force_click: false,
          send_force_load: false,
          open_overlay: false,
          popup_type: "",
          loading_state: false,
        });
        setGlobalData({
          error: undefined,
        });
      }, 60000),
    });
  };

  useEffect(() => {
    axios.get(getS3URL("", "map/region_data.txt")).then((res) =>
      setGlobalData({
        region_data: getRegionDataFromGrasshopperText(res.data),
      })
    );
  }, []);

  useEffect(() => {
    if (clicked_state === "unclicked") {
      setMapClicked(false);
      setTouchDisabled(true);
      setCamTarget(CAM_TARGET_0);
      setCamPos(CAM_POS_0);
      setGlobalData({ clicked_meshs: [], emph_guids: [] });
      const id = setTimeout(() => {
        setClickedState("unzoomed");
      }, 5000);
      return () => {
        clearTimeout(id);
      };
    }
    if (clicked_state === "zoomed") {
      renewSetTimeout(
        setSetTimeoutIds,
        setClickedState,
        setGlobalData,
        setGlobalVar
      );
    }
  }, [clicked_state]);

  const desktop_design = useRef({});

  useFrame(() => {
    const lerp_factor = 0.2;
    if (clicked_state === "unzoomed") {
      const new_bound_vector = BOUND.map(
        (e) => e * (1 - (main_cam.current.position.y / MAX_HEIGHT) * 0.5)
      );

      const upper_bound_vector = new THREE.Vector3(
        ...CAM_TARGET_0.map((e, idx) => e + new_bound_vector[idx])
      );
      const lower_bound_vector = new THREE.Vector3(
        ...CAM_TARGET_0.map((e, idx) => e - new_bound_vector[idx])
      );

      let { changed, constrained_vector } = constrainVector(
        "upper",
        orbit_controls.current.target,
        upper_bound_vector
      );
      changed =
        changed ||
        constrainVector("lower", constrained_vector, lower_bound_vector)
          .changed;
      constrained_vector = constrainVector(
        "lower",
        constrained_vector,
        lower_bound_vector
      ).constrained_vector;
      if (changed) {
        const x_diff =
          main_cam.current.position.x - orbit_controls.current.target.x;
        const y_diff =
          main_cam.current.position.y - orbit_controls.current.target.y;
        const z_diff =
          main_cam.current.position.z - orbit_controls.current.target.z;
        orbit_controls.current.target = constrained_vector;
        main_cam.current.position.x = constrained_vector.x + x_diff;
        main_cam.current.position.y = constrained_vector.y + y_diff;
        main_cam.current.position.z = constrained_vector.z + z_diff;
      }
    } else if (map_clicked || touch_disabled) {
      main_cam.current.position.set(
        MathUtils.lerp(main_cam.current.position.x, cam_pos[0], lerp_factor),
        MathUtils.lerp(main_cam.current.position.y, cam_pos[1], lerp_factor),
        MathUtils.lerp(main_cam.current.position.z, cam_pos[2], lerp_factor)
      );
      orbit_controls.current.target = new THREE.Vector3(
        MathUtils.lerp(
          orbit_controls.current.target.x,
          cam_target[0],
          lerp_factor
        ),
        MathUtils.lerp(
          orbit_controls.current.target.y,
          cam_target[1],
          lerp_factor
        ),
        MathUtils.lerp(
          orbit_controls.current.target.z,
          cam_target[2],
          lerp_factor
        )
      );
      // console.log(Math.abs(main_cam.current.position.x - cam_pos[0]));
      if (
        Math.abs(orbit_controls.current.target.x - cam_target[0]) < 5 &&
        Math.abs(main_cam.current.position.x - cam_pos[0]) <
          (clicked_state === "clicked" ? 10 : 50)
      ) {
        setTouchDisabled(false);
        if (clicked_state === "clicked") {
          setClickedState("zoomed");
        } else if (clicked_state === "unclicked") {
          setClickedState("unzoomed");
        }
      } else {
        invalidate();
      }
    }
    if (orbit_controls.current && main_cam.current && compass.current) {
      const rot = Math.atan2(
        -orbit_controls.current.target.z + main_cam.current.position.z,
        orbit_controls.current.target.x - main_cam.current.position.x
      );
      compass.current.style.transform = `rotate(${rot}rad)`;
      const size = getDistance(
        orbit_controls.current.target,
        main_cam.current.position
      );
      ruler.current.innerText =
        _getThousandSepStrFromNumber(Math.round(size / 67.7)) + "m";
    }
  });

  const min_zoom = useMemo(() => MAX_HEIGHT / 8, [MAX_HEIGHT]);
  const max_zoom = useMemo(() => MAX_HEIGHT / 1.1, [MAX_HEIGHT]);

  useFrame(() => {
    // console.log(html);
    if (desktop_design.current) {
      // console.log(html.current);

      const scale =
        0.01 *
        getDistance(
          main_cam?.current?.position,
          orbit_controls?.current?.target
        );

      Object.keys(desktop_design.current).forEach((key) => {
        if (desktop_design.current[key].frame_bar) {
          desktop_design.current[key].frame_bar.style.height =
            1000 / scale + "px";
        }
        if (desktop_design.current[key].html) {
          desktop_design.current[key].html.scale.set(scale, scale, scale);
          desktop_design.current[key].html.rotation.fromArray([
            0,
            -Math.PI / 2 -
              getAngle(
                main_cam?.current?.position,
                orbit_controls?.current?.target
              ),
            0,
          ]);
        }
        const region_no =
          desktop_design.current[
            key
          ].user_info?.this_region_data?.name?.toString() || "1";
        const ranking =
          Object.values(global_data.user_score?.[region_no] || {})?.filter(
            (e) => e > desktop_design.current[key].score
          )?.length || 0;
        const max_design_no_in_region = Math.max(
          ...Object.values(global_data.user_score || {}).map(
            (region_data) => Object.values(region_data).length
          )
        );
        // console.log(ranking);
        if (desktop_design.current[key].prior_visible) {
          if (
            100 * scale > min_zoom &&
            ranking >
              ((max_zoom - 100 * scale) / (max_zoom - min_zoom)) *
                max_design_no_in_region
          ) {
            desktop_design.current[key].setPriorVisible(false);
          }
        } else {
          if (
            100 * scale < min_zoom ||
            ranking <
              ((max_zoom - 100 * scale) / (max_zoom - min_zoom)) *
                max_design_no_in_region
          ) {
            desktop_design.current[key].setPriorVisible(true);
          }
        }
      });
      // console.log(100 * scale, min_zoom, max_zoom);
    }
  });

  const [target, setTarget] = useState([0, 0, 0]);

  const dir_light = useRef();
  const shadow_target = useRef();
  const ortho_cam = useRef();

  const updateOrthoCam = (ref, args) => {
    ref.current.left = args[0];
    ref.current.right = args[1];
    ref.current.top = args[2];
    ref.current.bottom = args[3];
    ref.current.near = args[4];
    ref.current.far = args[5];
    ref.current.updateProjectionMatrix();
  };

  useFrame(() => {
    shadow_target.current.position.set(
      orbit_controls.current.target.x,
      orbit_controls.current.target.y,
      orbit_controls.current.target.z
    );
    dir_light.current.position.set(
      ...[0.05, 0.1, -0.05].map(
        (e, idx) =>
          (e *
            fov *
            getDistance(
              main_cam.current?.position,
              orbit_controls.current.target,
              200
            ) || e * 2000) +
          [
            orbit_controls.current.target.x,
            orbit_controls.current.target.y,
            orbit_controls.current.target.z,
          ][idx]
      )
    );
    updateOrthoCam(
      ortho_cam,
      [-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
        (e, idx) =>
          e *
          fov *
          getDistance(
            main_cam.current?.position,
            orbit_controls.current.target,
            200
          )
      )
    );
  });

  useEffect(() => {
    if (global_var.vec_target) {
      const new_target = JSON.parse(global_var.vec_target);
      setTarget([new_target.x, -new_target.z, new_target.y + 10]);
    }
  }, [global_var.vec_target]);

  return (
    <>
      <SoftShadows size={10} samples={16} focus={0.05} />
      <color attach="background" args={["#97959C"]}></color>
      <ambientLight args={[0xffffff, 0.7]}></ambientLight>
      <directionalLight
        args={["#ffffff", 1.6]}
        castShadow
        shadow-mapSize={4096}
        shadow-bias={-0.001}
        target={shadow_target.current}
        position={[3000, 10000, -1000]}
        ref={dir_light}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map((e, idx) => e * 2000)}
          ref={ortho_cam}
        />
      </directionalLight>
      <mesh
        ref={shadow_target}
        position={[1000, 100, -1500]}
        visible={false}
        receiveShadow
        castShadow
      >
        <sphereGeometry args={[10]} />
        <meshBasicMaterial color={0xff00000} />
      </mesh>
      <group
        scale={1}
        rotation-x={-Math.PI / 2}
        castShadow
        receiveShadow
        ref={map}
      >
        <ThreeDesktopMap onEachProgress={onEachProgress} />
      </group>
      {(global_data.ranked_user_names || []).map((e) => (
        <ThreeDesktopDesign
          key={e}
          user_name={e}
          orbit_controls={orbit_controls}
          main_cam={main_cam}
          setCamPos={setCamPos}
          setCamTarget={setCamTarget}
          setTouchDisabled={setTouchDisabled}
          clicked_state={clicked_state}
          setClickedState={setClickedState}
          force_unload={global_var.send_force_load}
          min_zoom={MAX_HEIGHT / 8}
          max_zoom={MAX_HEIGHT / 1.1}
          ref={(ref) => {
            if (ref === null) {
              delete desktop_design.current[e];
            } else {
              desktop_design.current[e] = ref;
            }
          }}
        />
      ))}
      {global_var.send_force_load && (
        <ThreeDesktopDesign
          key={global_var.send_force_load}
          user_name={global_var.send_force_load}
          orbit_controls={orbit_controls}
          main_cam={main_cam}
          setCamPos={setCamPos}
          setCamTarget={setCamTarget}
          setTouchDisabled={setTouchDisabled}
          clicked_state={clicked_state}
          setClickedState={setClickedState}
          force_load
          min_zoom={MAX_HEIGHT / 8}
          max_zoom={MAX_HEIGHT / 1.1}
          ref={(ref) => {
            if (ref === null) {
              delete desktop_design.current[global_var.send_force_load];
            } else {
              desktop_design.current[global_var.send_force_load] = ref;
            }
          }}
        />
      )}

      <group scale={1} rotation-x={-Math.PI / 2} receiveShadow castShadow>
        {global_data.clicked_meshs?.map?.((e, idx) => (
          <group key={idx} position={[0, 0, 10]}>
            <mesh args={[e.clone().geometry]}>
              <meshBasicMaterial
                attach={"material"}
                transparent={true}
                opacity={0.75}
              />
            </mesh>
          </group>
        ))}
      </group>
      <OrbitControls
        minDistance={
          clicked_state === "unzoomed" ? MAX_HEIGHT / 10 : MAX_HEIGHT / 20
        }
        maxDistance={clicked_state !== "zoomed" ? MAX_HEIGHT : MAX_HEIGHT / 5}
        target={CAM_TARGET_0}
        enableDamping={true}
        dampingFactor={0.15}
        autoRotate
        autoRotateSpeed={1}
        maxPolarAngle={Math.atan(clicked_state === "zoomed" ? 3 : Math.sqrt(2))}
        screenSpacePanning={false}
        mouseButtons={
          clicked_state === "unzoomed" || clicked_state === "unclicked"
            ? {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN,
              }
            : clicked_state === "zoomed"
            ? {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE,
              }
            : {}
        }
        touches={
          clicked_state === "unzoomed" || clicked_state === "unclicked"
            ? {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN,
              }
            : clicked_state === "zoomed"
            ? {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_ROTATE,
              }
            : {}
        }
        ref={orbit_controls}
        onStart={() => {
          if (clicked_state === "unclicked") {
            setClickedState("unzoomed");
          }
          renewSetTimeout(
            setSetTimeoutIds,
            setClickedState,
            setGlobalData,
            setGlobalVar
          );
          console.log("start", clicked_state);
        }}
      >
        <PerspectiveCamera
          makeDefault
          fov={fov}
          // aspect={(2 * size.width) / size.height}
          near={
            0.01 *
            getDistance(
              main_cam.current?.position,
              orbit_controls.current?.target,
              100
            )
          }
          far={
            100 *
            getDistance(
              main_cam.current?.position,
              orbit_controls.current?.target,
              100
            )
          }
          position={CAM_POS_0}
          ref={main_cam}
        ></PerspectiveCamera>
      </OrbitControls>
    </>
  );
};

const DesktopMap = ({
  clicked_state,
  setClickedState,
  is_small_window,
  compass,
  ruler,
}) => {
  const box_geometry = new THREE.BoxGeometry();
  const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
  const cube = new THREE.Mesh(box_geometry, box_material);

  const [test_data, setTestData] = useState({ test: 0 });

  const [rot_speed, setRotSpeed] = useState(1);
  const [orb_speed, setOrbSpeed] = useState(1);
  const [lt_pos, setLtPos] = useState(-30);
  const [lt_pow, setLtPow] = useState(2);

  const [each_xhr, setEachXhr] = useReducer((state, action) => {
    if (action === "reset") {
      return { count: 0, data: {} };
    }
    // console.log(action);
    return {
      data: { ...state.data, ...action.data },
      count: action.count,
      time_sec_last: action.time_sec_last,
      time_sec_each: action.time_sec_each,
    };
  }, {});

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Suspense fallback={<Loading each_xhr={each_xhr} />}>
        <Canvas shadows frameloop="demand">
          <SampleHouse
            onEachProgress={(name, xhr) => {
              const new_xhr = {
                count: 1,
                data: {},
                time_sec_last: 9,
                time_sec_each: 0,
              };
              new_xhr.data[name] = xhr;
              setEachXhr(new_xhr);
            }}
            clicked_state={clicked_state}
            setClickedState={setClickedState}
            is_small_window={is_small_window}
            compass={compass}
            ruler={ruler}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default DesktopMap;
