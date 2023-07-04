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
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { MathUtils } from "three";
import Loading from "./Loading";
import RhinoModel from "./RhinoModel";
import useGlobalData from "../hooks/useGlobalData";
import ThreeBackground from "../threejs_component/ThreeBackground";
import { getDistance } from "../util/alias";

const cx = classNames.bind(styles);

const Group = ({ children }) => {
  return children;
};

const DesignMap = () => {
  const [global_data, setGlobalData] = useGlobalData();
  const fov = 10;
  const size = { width: window.innerWidth, height: window.innerHeight };
  const box_geometry = new THREE.BoxGeometry();
  const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
  const cube = new THREE.Mesh(box_geometry, box_material);
  const shadow_target = useRef();
  const main_cam = useRef();
  const raycaster = useRef();
  const three_background = useRef();
  const orbit_controls = useRef();
  const [target_pos, setTargetPos] = useState(new THREE.Vector3(0, 0, 0));
  const [on_change, setOnChange] = useState(0);
  const [each_xhr, setEachXhr] = useReducer((state, action) => {
    return { ...state, ...action };
  }, {});
  const [start_count, setStartCount] = useState(0);

  useEffect(() => {
    if (raycaster.current && main_cam.current) {
      raycaster.current.setFromCamera(
        new THREE.Vector2(0, 0),
        main_cam.current
      );
    }
  }, [main_cam.current, raycaster.current, on_change]);

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Suspense fallback={<Loading each_xhr={each_xhr} />}>
        <Canvas shadows>
          <SoftShadows size={10} samples={16} focus={0.05} />
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
                (e *
                  fov *
                  getDistance(main_cam.current?.position, target_pos, 200) ||
                  e * 2000) +
                on_change * 0 +
                [target_pos.x, target_pos.y, target_pos.z][idx]
            )}
            target={shadow_target.current}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
                (e, idx) =>
                  e *
                    fov *
                    getDistance(main_cam.current?.position, target_pos, 200) ||
                  e * 2000 + on_change * 0
              )}
            />
          </directionalLight>
          <raycaster ref={raycaster} />
          <mesh
            position={[target_pos.x, target_pos.y, target_pos.z]}
            ref={shadow_target}
          >
            <sphereGeometry args={[1]} />
            <meshBasicMaterial color={0xff00000} />
          </mesh>
          <group scale={1} rotation-x={-Math.PI / 2} receiveShadow castShadow>
            <ThreeBackground
              onEachProgress={(name, xhr) => {
                const new_xhr = {};
                new_xhr[name] = xhr;
                setEachXhr(new_xhr);
              }}
              ref={three_background}
            />
          </group>
          {/* <group scale={1} rotation-x={-Math.PI / 2} receiveShadow castShadow>
            <SampleHouse
              onEachProgress={(name, xhr) => {
                const new_xhr = {};
                new_xhr[name] = xhr;
                setEachXhr(new_xhr);
              }}
              // onClick={(event)=>{orbit_controls.current.target = event.point;}}
              // ref={sample_model}
            />
          </group> */}
          <Selection>
            <EffectComposer autoClear={false}>
              <Outline
                blur
                visibleEdgeColor={0xffffff}
                edgeStrength={10}
                hiddenEdgeColor={0xffffff}
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
              <group
                scale={1}
                rotation-x={-Math.PI / 2}
                receiveShadow
                castShadow
              >
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
            minDistance={100}
            maxDistance={20000}
            target={[128, 98, 30]}
            enableDamping={true}
            dampingFactor={0.15}
            // maxPolarAngle={Math.PI / 2}
            screenSpacePanning={true}
            onStart={() => {
              if (start_count < 5) {
                setStartCount(start_count + 1);
              } else {
                orbit_controls.current.target = target_pos || [-42, 90, 258];
              }
            }}
            onChange={() => {
              setOnChange(main_cam.current?.position?.y);
              // console.log(main_cam.current?.position?.y, orbit_controls.current?.target?.y )
              if (three_background.current?.terrain) {
                // console.log(sample_model);
                const raycaster_result =
                  raycaster.current?.intersectObject?.(
                    three_background.current.terrain,
                    true
                  ) || [];
                if (raycaster_result.length > 0) {
                  setTargetPos(raycaster_result[0].point);
                }
              }
            }}
            ref={orbit_controls}
            touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
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
              position={[-500 + 128, 500 + 98, -500 + 30]}
              ref={main_cam}
            ></PerspectiveCamera>
          </OrbitControls>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default DesignMap;
