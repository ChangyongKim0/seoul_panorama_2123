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

  useEffect(() => {
    if (clicked_state === "unclicked") {
      setMapClicked(false);
      setTouchDisabled(true);
      setCamTarget([0, 1.5, 0]);
      setCamPos([0, 200, 1]);
    }
  }, [clicked_state]);

  useFrame(() => {
    if (pavings.current?.model) {
      pavings.current.model.position.z = show_paving
        ? MathUtils.lerp(pavings.current.model.position?.z, 0, 0.1)
        : MathUtils.lerp(pavings.current.model.position?.z, -0.125, 0.1);
    }
    const lerp_factor = 0.1;
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
      <ambientLight args={[0xffffff, 0.5]}></ambientLight>
      <directionalLight
        args={["#ffffff", 1]}
        castShadow
        shadow-mapSize={4096}
        shadow-bias={-0.001}
        position={[0.05, 0.1, -0.05].map(
          (e, idx) =>
            e * fov * main_cam.current?.position?.y || e * 2000 + on_change * 0
        )}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-0.04, 0.04, 0.04, -0.04, 0.001, 0.2].map(
            (e, idx) =>
              e * fov * main_cam.current?.position?.y +
                [
                  -1 * Math.sqrt(1 / 2) * orbit_controls.current?.target?.z -
                    Math.sqrt(1 / 2) * orbit_controls.current?.target?.x,
                  -1 * Math.sqrt(1 / 2) * orbit_controls.current?.target?.z -
                    Math.sqrt(1 / 2) * orbit_controls.current?.target?.x,

                  Math.sqrt(1 / 2) * orbit_controls.current?.target?.z -
                    Math.sqrt(1 / 2) * orbit_controls.current?.target?.x,
                  Math.sqrt(1 / 2) * orbit_controls.current?.target?.z -
                    Math.sqrt(1 / 2) * orbit_controls.current?.target?.x,
                  0,
                  0,
                ][idx] || e * 2000 + on_change * 0
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
        <group
          onClick={(event) => {
            // console.log(event);
            event.stopPropagation();

            setTouchDisabled(true);
            setMapClicked(true);
            const vec_target0 = orbit_controls.current.target;
            const vec_target = event.point;
            const vec_pos0 = main_cam.current.position;
            // const vec_pos = event.point;
            if (clicked_state === "unclicked") {
              setClickedState("region");
              setCamTarget([vec_target0.x, vec_target0.y, vec_target0.z]);
              setCamPos([vec_pos0.x, 100, vec_pos0.z]);
            } else if (clicked_state === "region") {
              console.log("he");
              setClickedState("position");
              setCamTarget([vec_target.x, vec_target.y, vec_target.z]);
              setCamPos([
                vec_target.x + 100,
                vec_target.y + 100,
                vec_target.z + 100,
              ]);
            }
          }}
        >
          <RhinoModel
            url="model/test2.3dm"
            onProgress={(xhr) => {
              onEachProgress("test2", xhr);
            }}
          />
        </group>
        <group
          onClick={(event) => {
            event.stopPropagation();
            setShowPaving(!show_paving);
          }}
        >
          <RhinoModel
            url="model/test3.3dm"
            ref={pavings}
            onProgress={(xhr) => {
              onEachProgress("test3", xhr);
            }}
          />
        </group>
        {/* <RhinoModel
          url="model/0511_test.3dm"
          ref={pavings}
          onProgress={(xhr) => {
            onEachProgress("0511_test", xhr);
          }}
        /> */}

        <RhinoModel
          url="model/testtrees.3dm"
          ref={trees}
          onProgress={(xhr) => {
            onEachProgress("testtrees", xhr);
          }}
        />
      </group>
      <OrbitControls
        minDistance={1}
        maxDistance={2000}
        target={[0, 1.5, 0]}
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
          near={0.1}
          far={10000}
          position={[0, 200, 1]}
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
