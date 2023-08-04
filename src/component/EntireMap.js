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
import styles from "./EntireMap.module.scss";

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
import { constrainVector, getDistance, rotateX } from "../util/alias";
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import {
  getGridIsovectorsFromGrasshopperText,
  getGridSelectionDataFromGrasshopperText,
  getRegionDataFromGrasshopperText,
} from "../util/grasshopperText";
import axios from "axios";
import { getS3URL } from "../hooks/useS3";
import ThreeHere from "../threejs_component/ThreeHere";

const cx = classNames.bind(styles);

// const OrbitControls = oc(THREE);

const SampleHouse = ({ onEachProgress, clicked_state, setClickedState }) => {
  const size = useMemo(
    () => ({
      width: Math.min(window.innerWidth - 24, 606),
      height: window.innerHeight - 172,
    }),
    [window.innerWidth, window.innerHeight]
  );

  const MAX_HEIGHT = useMemo(() => (40000 * size.height) / size.width, [size]);
  const CAM_TARGET_0 = [2950, 100, -2000];
  const CAM_POS_0 = useMemo(() => [2950, MAX_HEIGHT, -1950], [MAX_HEIGHT]);
  const BOUND = useMemo(() => [2500, MAX_HEIGHT, 1500], [MAX_HEIGHT]);

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

  const [cam_target, setCamTarget] = useState([1, 1, 1]);
  const [cam_pos, setCamPos] = useState([1, 1, 1]);
  const [map_clicked, setMapClicked] = useState(false);
  const [touch_disabled, setTouchDisabled] = useState(false);
  const [on_change, setOnChange] = useState(0);
  const [global_data, setGlobalData] = useGlobalData();
  const [global_var, setGlobalVar] = useGlobalVar();

  const { invalidate } = useThree();

  useEffect(() => {
    axios.get(getS3URL("", "map/region_data.txt")).then((res) =>
      setGlobalData({
        region_data: getRegionDataFromGrasshopperText(res.data),
      })
    );
    axios.get(getS3URL("", "map/grid_selection.txt")).then((res) =>
      setGlobalData({
        grid_selection_data: getGridSelectionDataFromGrasshopperText(res.data),
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
    }
  }, [clicked_state]);

  useFrame(() => {
    const new_bound_vector = BOUND.map(
      (e) => e * (1 - (main_cam.current.position.y / MAX_HEIGHT) * 0.5)
    );

    const upper_bound_vector = new THREE.Vector3(
      ...CAM_TARGET_0.map((e, idx) => e + new_bound_vector[idx])
    );
    const lower_bound_vector = new THREE.Vector3(
      ...CAM_TARGET_0.map((e, idx) => e - new_bound_vector[idx])
    );
    const lerp_factor = 0.1;
    let { changed, constrained_vector } = constrainVector(
      "upper",
      orbit_controls.current.target,
      upper_bound_vector
    );
    changed =
      changed ||
      constrainVector("lower", constrained_vector, lower_bound_vector).changed;
    constrained_vector = constrainVector(
      "lower",
      constrained_vector,
      lower_bound_vector
    ).constrained_vector;
    if (changed && clicked_state === "unclicked") {
      orbit_controls.current.target = constrained_vector;
      main_cam.current.position.x = constrained_vector.x;
      main_cam.current.position.z = constrained_vector.z + 50;
    }
    if (map_clicked || touch_disabled) {
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
      if (Math.abs(main_cam.current.position.x - cam_pos[0]) < 0.01) {
        setTouchDisabled(false);
      } else {
        invalidate();
      }
    }
  });

  const [target, setTarget] = useState([0, 0, 0]);
  useEffect(() => {
    if (global_var.vec_target) {
      const new_target = JSON.parse(global_var.vec_target);
      setTarget([new_target.x, -new_target.z, new_target.y + 10]);
    }
  }, [global_var.vec_target]);

  return (
    <>
      <SoftShadows size={2.5} samples={16} focus={0.05} />
      <color attach="background" args={["#ffffff"]}></color>
      <ambientLight args={[0xffffff, 0.2]}></ambientLight>
      <directionalLight
        args={["#ffffff", 1.6]}
        castShadow
        shadow-mapSize={4096}
        shadow-bias={-0.001}
        position={[3000, 10000, -1000]}
        // position={[0.05, 0.1, -0.05].map(
        //   (e, idx) =>
        //     (e *
        //       fov *
        //       getDistance(
        //         main_cam.current?.position,
        //         cam_target.current,
        //         200
        //       ) || e * 2000) +
        //     on_change * 0 +
        //     [
        //       cam_target.current?.x,
        //       cam_target.current?.y,
        //       cam_target.current?.z,
        //     ][idx]
        // )}
      >
        <orthographicCamera
          attach="shadow-camera"
          // args={[-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
          //   (e, idx) =>
          //     e *
          //       fov *
          //       getDistance(
          //         main_cam.current?.position,
          //         cam_target.current,
          //         200
          //       ) || e * 2000 + on_change * 0
          // )}
        />
      </directionalLight>
      <group
        scale={1}
        rotation-x={-Math.PI / 2}
        castShadow
        receiveShadow
        ref={map}
      >
        <ThreeMap
          onClick={(event) => {
            // console.log(event);
            event.stopPropagation();
            // console.log(event);
            // console.log(event?.object?.userData?.attributes?.id);
            // console.log(event?.point?.x, event?.point?.y);
            setTouchDisabled(true);
            setMapClicked(true);
            if (clicked_state === "unclicked") {
              const region_center = rotateX(
                global_data.region_data?.[
                  event?.object?.userData?.attributes?.id
                ]?.center || [0, 0, 0]
              );
              console.log(event?.object?.userData?.attributes?.id);
              setGlobalVar({
                region_guid: event?.object?.userData?.attributes?.id,
                region_no:
                  Number(
                    global_data.region_data?.[
                      event?.object?.userData?.attributes?.id
                    ].region_name
                  ) || -1,
              });
              setGlobalData({
                clicked_meshs: [event.object],
                emph_guids: [
                  global_data.region_data?.[
                    event?.object?.userData?.attributes?.id
                  ]?.polygon,
                ],
              });
              setClickedState("region");
              setCamTarget(region_center);
              const HEIGHT_FACTOR = 6.2;
              setCamPos([
                region_center[0],
                region_center[1] +
                  Math.max(
                    (global_data.region_data?.[
                      event?.object?.userData?.attributes?.id
                    ]?.width *
                      size.height) /
                      size.width || 1000,
                    global_data.region_data?.[
                      event?.object?.userData?.attributes?.id
                    ]?.height || 1000
                  ) *
                    HEIGHT_FACTOR,
                region_center[2] + 50,
              ]);
            } else if (
              clicked_state === "region" &&
              event?.object?.userData?.attributes?.id === global_var.region_guid
            ) {
              const vec_target = event.point;
              const GRID_FACTOR = 300;
              const ISO_FACTOR = (6 * size.height) / size.width;
              axios.get(getS3URL("", "map/grid_isovectors.txt")).then((res) => {
                const x_grid = Math.floor(vec_target.x / GRID_FACTOR),
                  y_grid = Math.floor(-vec_target.z / GRID_FACTOR),
                  x_direction_to_add =
                    Math.floor(vec_target.x / GRID_FACTOR) ===
                    Math.floor((2 * vec_target.x) / GRID_FACTOR) / 2
                      ? "left"
                      : "right",
                  y_direction_to_add =
                    Math.floor(-vec_target.z / GRID_FACTOR) ===
                    Math.floor((2 * -vec_target.z) / GRID_FACTOR) / 2
                      ? "down"
                      : "up";
                setGlobalVar({
                  x_grid,
                  y_grid,
                  x_direction_to_add,
                  y_direction_to_add,
                });
                const cam_pos = rotateX(
                  getGridIsovectorsFromGrasshopperText(res.data)[x_grid][y_grid]
                );
                setGlobalVar({
                  vec_target: JSON.stringify(vec_target),
                  cam_pos: JSON.stringify(cam_pos),
                  ISO_FACTOR,
                  GRID_FACTOR,
                });
                setCamPos([
                  vec_target.x + cam_pos[0] * ISO_FACTOR,
                  vec_target.y + cam_pos[1] * ISO_FACTOR,
                  vec_target.z + cam_pos[2] * ISO_FACTOR,
                ]);
              });
              setClickedState("position");
              setCamTarget([vec_target.x, vec_target.y, vec_target.z]);
            }
          }}
          onEachProgress={onEachProgress}
        />
        <ThreeHere position={target} show={clicked_state === "position"} />
      </group>
      {/* {clicked_state !== "unclicked" && (
        <Selection>
          <EffectComposer autoClear={false}>
            <Outline
              blur
              visibleEdgeColor={0xffffff}
              edgeStrength={20}
              hiddenEdgeColor={0xffffff}
              multisampling={2}
              width={window.innerWidth}
              height={window.innerHeight}
              resolutionX={window.innerWidth * 3}
              resolutionY={window.innerHeight * 3}
              xRay
              kernelSize={KernelSize.SMALL}
              blendFunction={BlendFunction.ALPHA}
            />
          </EffectComposer>
          <Select enabled>
            <group scale={1} rotation-x={-Math.PI / 2} receiveShadow castShadow>
              {global_data.clicked_meshs?.map?.((e, idx) => (
                <group key={idx} position={[0, 0, 0]}>
                  <mesh key={idx} args={[e.clone().geometry]}>
                    <meshBasicMaterial
                      attach={"material"}
                      transparent={true}
                      opacity={0.5}
                    />
                  </mesh>
                </group>
              ))}
            </group>
          </Select>
        </Selection>
      )} */}
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
        minDistance={clicked_state === "unclicked" ? MAX_HEIGHT / 2 : 1}
        maxDistance={MAX_HEIGHT}
        target={CAM_TARGET_0}
        enableDamping={true}
        dampingFactor={0.15}
        maxPolarAngle={
          touch_disabled || clicked_state !== "unclicked" ? Math.PI / 2 : 0.1
        }
        screenSpacePanning={true}
        touches={
          touch_disabled || clicked_state !== "unclicked"
            ? {}
            : { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }
        }
        ref={orbit_controls}
      >
        <PerspectiveCamera
          makeDefault
          fov={fov}
          // aspect={(2 * size.width) / size.height}
          near={
            0.1 *
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

const EntireMap = ({ clicked_state, setClickedState }) => {
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
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default EntireMap;
