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
import styles from "./DesignMap.module.scss";

import * as THREE from "three";

import { Canvas, useFrame, useGraph, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
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
import RhinoModel from "./RhinoModel";

const cx = classNames.bind(styles);

const Group = ({ children }) => {
  return children;
};

const SampleHouse = ({ onEachProgress }) => {
  const X_LENGTH = 10;
  const Y_LENGTH = 10;
  const pavings = useRef();
  const trees = useRef();
  const newtrees = useRef();
  const [show_paving, setShowPaving] = useState(false);
  const [show_trees, setShowTrees] = useState(true);
  const [paving_data, setPavingData] = useState({});
  const [random_matrix, setRandomMatrix] = useState(
    new Array(X_LENGTH).fill(new Array(Y_LENGTH).fill(0))
  );
  useFrame(() => {
    pavings.current.position.z = show_paving
      ? MathUtils.lerp(pavings.current.position.z, 0, 0.1)
      : MathUtils.lerp(pavings.current.position.z, -0.125, 0.1);
  });
  useLayoutEffect(() => {
    setRandomMatrix(
      new Array(X_LENGTH)
        .fill(new Array(Y_LENGTH).fill(0))
        .map((e) => e.map((e2) => Math.random()))
    );
    console.log(random_matrix);
  }, []);
  useEffect(() => {
    if (pavings.current) {
      setPavingData(
        pavings.current?.children?.reduce?.((prev, curr) => {
          prev[curr?.userData?.attributes?.id] = curr;
          return prev;
        }, {})
      );
    }
  }, [pavings]);
  return (
    <>
      <group
        onClick={(event) => {
          event.stopPropagation();
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
            onEachProgress("test2", xhr);
          }}
        />
      </group>
      <RhinoModel
        url="model/0531_grasshopper + id test.3dm"
        ref={trees}
        onProgress={(xhr) => {
          onEachProgress("test2", xhr);
        }}
      />
    </>
  );
};

const DesignMap = () => {
  const fov = 10;
  const size = { width: window.innerWidth, height: window.innerHeight };
  const box_geometry = new THREE.BoxGeometry();
  const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
  const cube = new THREE.Mesh(box_geometry, box_material);
  const main_cam = useRef();
  const orbit_controls = useRef();
  const [on_change, setOnChange] = useState(0);
  const [each_xhr, setEachXhr] = useReducer((state, action) => {
    return { ...state, ...action };
  }, {});

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Suspense fallback={<Loading each_xhr={each_xhr} />}>
        <Canvas shadows>
          <SoftShadows size={2.5} samples={16} focus={0.05} />
          {/* <fog attach="fog" args={["#ffffff", 0, 10000]} /> */}
          <color attach="background" args={["#ffffff"]}></color>
          {/* <SampleTorus rot_speed={rot_speed} orb_speed={orb_speed} /> */}
          <ambientLight args={[0xffffff, 0.5]}></ambientLight>
          <directionalLight
            args={["#ffffff", 1]}
            castShadow
            shadow-mapSize={4096}
            shadow-bias={-0.001}
            position={[0.05, 0.1, -0.05].map(
              (e, idx) =>
                e * fov * main_cam.current?.position?.y ||
                e * 2000 + on_change * 0
            )}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-0.06, 0.06, 0.06, -0.06, 0.001, 0.2].map(
                (e, idx) =>
                  e * fov * main_cam.current?.position?.y +
                    [
                      -1 *
                        Math.sqrt(1 / 2) *
                        orbit_controls.current?.target?.z -
                        Math.sqrt(1 / 2) * orbit_controls.current?.target?.x,
                      -1 *
                        Math.sqrt(1 / 2) *
                        orbit_controls.current?.target?.z -
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

          <group scale={1} rotation-x={-Math.PI / 2} castShadow receiveShadow>
            <SampleHouse
              onEachProgress={(name, xhr) => {
                const new_xhr = {};
                new_xhr[name] = xhr;
                setEachXhr(new_xhr);
              }}
            />
          </group>

          <OrbitControls
            minDistance={1}
            maxDistance={2000000}
            target={[0, 1.5, 0]}
            enableDamping={true}
            dampingFactor={0.15}
            maxPolarAngle={Math.PI / 2}
            screenSpacePanning={true}
            onChange={() => {
              setOnChange(main_cam.current?.position?.y);
            }}
            ref={orbit_controls}
            touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
          >
            <PerspectiveCamera
              makeDefault
              fov={fov}
              aspect={size.width / size.height}
              near={0.1}
              far={10000}
              position={[100, 100, 100]}
              ref={main_cam}
            ></PerspectiveCamera>
          </OrbitControls>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default DesignMap;
