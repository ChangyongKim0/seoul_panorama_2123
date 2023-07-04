import React, {
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import "../util/reset.css";
import styles from "./EntireMap.module.scss";

import * as THREE from "three";

import { Canvas, useFrame, useGraph, useLoader } from "@react-three/fiber";
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
import { constrainVector, getDistance } from "../util/alias";
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";

const cx = classNames.bind(styles);

let XHRS = {};
const getXhrFromXhrs = (xhrs) => {
  return {
    loaded: Object.keys(xhrs).reduce(
      (prev, curr_key) => prev + xhrs[curr_key].loaded,
      0
    ),
    total: Object.keys(xhrs).reduce(
      (prev, curr_key) => prev + xhrs[curr_key].total,
      0
    ),
  };
};

// const OrbitControls = oc(THREE);
const MAX_HEIGHT = 30000;
const CAM_TARGET_0 = [2950, 100, -2000];
const CAM_POS_0 = [2900, MAX_HEIGHT, -2000];
const BOUND = [3500, MAX_HEIGHT, 2000];

const Group = ({ children }) => {
  return children;
};

const SampleHouse = ({ onEachProgress, clicked_state, setClickedState }) => {
  const fov = 10;
  const map = useRef();
  const pavings = useRef();
  const trees = useRef();
  const [show_paving, setShowPaving] = useState(false);
  const main_cam = useRef();
  const orbit_controls = useRef();
  const size = { width: window.innerWidth, height: window.innerHeight };
  const [cam_target, setCamTarget] = useState([1, 1, 1]);
  const [cam_pos, setCamPos] = useState([1, 1, 1]);
  const [map_clicked, setMapClicked] = useState(false);
  const [touch_disabled, setTouchDisabled] = useState(false);
  const [on_change, setOnChange] = useState(0);
  const [global_data, setGlobalData] = useGlobalData();

  useEffect(() => {
    if (clicked_state === "unclicked") {
      setMapClicked(false);
      setTouchDisabled(true);
      setCamTarget(CAM_TARGET_0);
      setCamPos(CAM_POS_0);
    }
  }, [clicked_state]);

  useFrame(() => {
    const new_bound_vector = BOUND.map(
      (e) => e * (1 - (main_cam.current.position.y / MAX_HEIGHT) * 0.95)
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
      console.log(true);
      orbit_controls.current.target = constrained_vector;
      main_cam.current.position.x = constrained_vector.x - 50;
      main_cam.current.position.z = constrained_vector.z;
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
      }
    }
  });

  return (
    <>
      <SoftShadows size={2.5} samples={16} focus={0.05} />
      <color attach="background" args={["#ffffff"]}></color>
      <ambientLight args={[0xffffff, 1]}></ambientLight>
      <directionalLight
        args={["#ffffff", 1.6]}
        castShadow
        shadow-mapSize={4096}
        shadow-bias={-0.001}
        position={[0.05, 0.1, -0.05].map(
          (e, idx) =>
            (e *
              fov *
              getDistance(
                main_cam.current?.position,
                cam_target.current,
                200
              ) || e * 2000) +
            on_change * 0 +
            [
              cam_target.current?.x,
              cam_target.current?.y,
              cam_target.current?.z,
            ][idx]
        )}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
            (e, idx) =>
              e *
                fov *
                getDistance(
                  main_cam.current?.position,
                  cam_target.current,
                  200
                ) || e * 2000 + on_change * 0
          )}
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
            console.log(event);
            setTouchDisabled(true);
            setMapClicked(true);
            const vec_target0 = orbit_controls.current.target;
            const vec_target = event.point;
            const vec_pos0 = main_cam.current.position;
            // const vec_pos = event.point;
            if (clicked_state === "unclicked") {
              setClickedState("region");
              setCamTarget([vec_target0.x, vec_target0.y, vec_target0.z]);
              setCamPos([vec_target.x, vec_target.y + 10000, vec_target.z]);
            } else if (clicked_state === "region") {
              console.log("he");
              setClickedState("position");
              setCamTarget([vec_target.x, vec_target.y, vec_target.z]);
              setCamPos([
                vec_target.x + 100,
                vec_target.y + 10000,
                vec_target.z + 100,
              ]);
            }
          }}
          onEachProgress={onEachProgress}
        />
      </group>
      <Selection>
        <EffectComposer autoClear={false}>
          <Outline
            blur
            visibleEdgeColor={0xff0000}
            edgeStrength={10}
            hiddenEdgeColor={0xff0000}
            multisampling={16}
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
                <mesh args={[e.clone().geometry]}>
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

      <OrbitControls
        minDistance={1}
        maxDistance={30000}
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
            : { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }
        }
        //   onEnd={() => {
        //     console.log(main_cam_pos);
        //   }}
        onChange={() => {
          setOnChange(main_cam.current?.position?.y);
          // console.log(main_cam.current?.position?.y);
        }}
        ref={orbit_controls}
      >
        <PerspectiveCamera
          makeDefault
          fov={fov}
          aspect={size.width / size.height}
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
    return { ...state, ...action };
  }, {});

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Suspense fallback={<Loading each_xhr={each_xhr} />}>
        <Canvas shadows>
          <SampleHouse
            onEachProgress={(name, xhr) => {
              const new_xhr = {};
              new_xhr[name] = xhr;
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
