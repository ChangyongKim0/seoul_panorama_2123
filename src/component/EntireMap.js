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

const cx = classNames.bind(styles);

// const OrbitControls = oc(THREE);
const RhinoModel = forwardRef(({ url }, ref) => {
  const model = useLoader(Rhino3dmLoader, url, (loader) => {
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");
  });

  // console.log(model);

  const modelgr = useGraph(model);
  // useEffect(() => {
  //   if (modelgr) {
  //     console.log(`◼ ${url} 파일 데이터 출력 시작...`);
  //     console.log("- 순수 모델 데이터");
  //     console.log(model);
  //     console.log("- useGraph로 가공한 데이터");
  //     console.log(modelgr);
  //     console.log("- 추정되는 guid 목록");
  //     console.log(model?.children?.map?.((e) => e?.userData?.attributes?.id));
  //     console.log(`◻ ${url} 파일 데이터 출력 완료...`);
  //   }
  // }, [modelgr]);

  // console.log(modelgr);

  useImperativeHandle(ref, () => model, [url]);

  return <primitive object={model}></primitive>;
});

const Group = ({ children }) => {
  return children;
};

const SampleHouse = () => {
  const X_LENGTH = 10;
  const Y_LENGTH = 10;
  const map = useRef();
  const pavings = useRef();
  const trees = useRef();
  const [show_paving, setShowPaving] = useState(false);
  const main_cam = useRef();
  const orbit_controls = useRef();
  const [main_cam_pos, setMainCamPos] = useState([0, 0, 0]);
  const size = { width: window.innerWidth, height: window.innerHeight };
  const [cam_target, setCamTarget] = useState([1, 1, 1]);
  const [cam_target0, setCamTarget0] = useState([0, 0, 0]);
  const [cam_pos, setCamPos] = useState([1, 1, 1]);
  const [cam_pos0, setCamPos0] = useState([0, 0, 0]);
  const [lerp_val, setLerpVal] = useState(0);
  const [map_clicked, setMapClicked] = useState(false);
  const [touch_disabled, setTouchDisabled] = useState(false);

  useFrame(() => {
    // console.log(cam_target);
  });

  useEffect(() => {
    // main_cam.current.position.set(0, 100, 0);
    // orbit_controls.current.target.set(1, 1, 0);
    // orbit_controls.current.update();
  }, [map_clicked]);

  useFrame(() => {
    pavings.current.position.z = show_paving
      ? MathUtils.lerp(pavings.current.position.z, 0, 0.1)
      : MathUtils.lerp(pavings.current.position.z, -0.125, 0.1);

    const new_lerp_val = MathUtils.lerp(lerp_val, map_clicked ? 1 : 0, 0.05);
    setLerpVal(new_lerp_val);
    if (map_clicked || touch_disabled) {
      main_cam.current.position.set(
        ...[0, 0, 0].map(
          (_, idx) =>
            new_lerp_val * cam_pos[idx] + (1 - new_lerp_val) * cam_pos0[idx]
        )
      );
      orbit_controls.current.target = new THREE.Vector3(
        ...[0, 0, 0].map(
          (_, idx) =>
            new_lerp_val * cam_target[idx] +
            (1 - new_lerp_val) * cam_target0[idx]
        )
      );
      if (new_lerp_val < 0.05) {
        setTouchDisabled(false);
      }
    }
  });

  return (
    <>
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
        position={main_cam_pos}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-50, 50, 50, -50, 0.1, 200]}
        />
      </directionalLight>
      {/* <pointLight
          args={["#ffbb55", lt_pow, 200]}
          position={main_cam_pos}
          castShadow
          shadow-mapSize={1024}
          shadow-radius={5}
          shadow-bias={-0.005}
        >
          <mesh>
            <Sphere />
            <meshBasicMaterial />
          </mesh>
        </pointLight> */}
      <group
        scale={1}
        rotation-x={-Math.PI / 2}
        castShadow
        receiveShadow
        ref={map}
      >
        <group
          onClick={(event) => {
            console.log(event);
            event.stopPropagation();
            setMapClicked(!map_clicked);
            if (!map_clicked) {
              setTouchDisabled(true);
              const vec_target0 = orbit_controls.current.target;
              const vec_target = event.point;
              const vec_pos0 = main_cam.current.position;
              // const vec_pos = event.point;
              setCamTarget0([vec_target0.x, vec_target0.y, vec_target0.z]);
              setCamTarget([vec_target.x, vec_target.y, vec_target.z]);
              setCamPos0([vec_pos0.x, vec_pos0.y, vec_pos0.z]);
              setCamPos([
                vec_target.x + 10,
                vec_target.y + 10,
                vec_target.z + 10,
              ]);
            }
          }}
        >
          <RhinoModel url="model/test2.3dm" />
        </group>
        <group
          onClick={(event) => {
            event.stopPropagation();
            setShowPaving(!show_paving);
          }}
        >
          <RhinoModel url="model/test3.3dm" ref={pavings} />
        </group>
        <RhinoModel url="model/testtrees.3dm" ref={trees} />
      </group>
      <OrbitControls
        minDistance={1}
        maxDistance={2000}
        target={[0, 1.5, 0]}
        enableDamping={true}
        dampingFactor={0.15}
        maxPolarAngle={touch_disabled ? Math.PI / 2 : 0.1}
        screenSpacePanning={true}
        touches={
          touch_disabled
            ? {}
            : { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }
        }
        //   onEnd={() => {
        //     console.log(main_cam_pos);
        //   }}
        onChange={() => {
          console.log(main_cam.current);
          console.log(orbit_controls.current);
          // main_cam.current?.lookAt?.(0, 0, 0);
          setMainCamPos(
            new THREE.Vector3(
              ...(main_cam.current?.position ?? [0, 0, 0])
            ).applyAxisAngle(new THREE.Vector3(0, 1, 0), (3 * Math.PI) / 4)
          );
        }}
        ref={orbit_controls}
      >
        <PerspectiveCamera
          makeDefault
          fov={50}
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

const EntireMap = () => {
  const box_geometry = new THREE.BoxGeometry();
  const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
  const cube = new THREE.Mesh(box_geometry, box_material);

  const [test_data, setTestData] = useState({ test: 0 });

  const [rot_speed, setRotSpeed] = useState(1);
  const [orb_speed, setOrbSpeed] = useState(1);
  const [lt_pos, setLtPos] = useState(-30);
  const [lt_pow, setLtPow] = useState(2);

  const updateData = (e) => {
    switch (e.path) {
      case "도넛 회전속도":
        setOrbSpeed(e.state);
        break;
      case "도넛 자전속도":
        setRotSpeed(e.state);
        break;
      case "조명 움직이기":
        setLtPos(e.state);
        break;
      case "조명 세기":
        setLtPow(e.state);
        break;
    }
  };

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Suspense
        fallback={
          <AutoLayout fill absolute attach="center">
            로딩중입니다...
          </AutoLayout>
        }
      >
        <Stats />
        {/* <div className={cx("frame")}>
        <h1>Testing ThreeJS...</h1>
      </div> */}
        <Canvas shadows>
          <SampleHouse />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default EntireMap;
