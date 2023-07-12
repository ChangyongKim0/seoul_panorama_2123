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
import styles from "./ThreeTestPage.module.scss";

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
import AutoLayout from "../component/AutoLayout";
import axios from "axios";

const cx = classNames.bind(styles);

// const OrbitControls = oc(THREE);
const RhinoModel = forwardRef(({ url }, ref) => {
  const model = useLoader(Rhino3dmLoader, url, (loader) => {
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@7.15.0/");
  });

  // console.log(model);

  const modelgr = useGraph(model);
  useEffect(() => {
    if (modelgr) {
      console.log(`◼ ${url} 파일 데이터 출력 시작...`);
      console.log("- 순수 모델 데이터");
      console.log(model);
      console.log("- useGraph로 가공한 데이터");
      console.log(modelgr);
      console.log("- 추정되는 guid 목록");
      console.log(model?.children?.map?.((e) => e?.userData?.attributes?.id));
      console.log("- JSON Object Scene format 4");
      console.log(model?.userData?.materials?.map((e) => e.toJSON()));
      console.log(`◻ ${url} 파일 데이터 출력 완료...`);
    }
  }, [modelgr]);

  // console.log(modelgr);

  useImperativeHandle(ref, () => model, [url]);

  return <primitive object={model}></primitive>;
});

const Group = ({ children }) => {
  return children;
};

const SampleHouse = () => {
  const X_LENGTH = 0;
  const Y_LENGTH = 0;
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
    newtrees.current.position.z = show_trees
      ? MathUtils.lerp(newtrees.current.position.z, 0, 0.1)
      : MathUtils.lerp(newtrees.current.position.z, -2, 0.1);
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
        <RhinoModel url="model/0613.3dm" />
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
      <group
        onClick={(event) => {
          console.log(1);
          event.stopPropagation();
          setShowTrees(!show_trees);
        }}
        ref={newtrees}
      >
        {random_matrix.map((e, idx) => {
          return e.map((val, idx2) => {
            return (
              <group
                key={`${idx}-${idx2}`}
                position-x={5 * (idx + 1) + val * 10}
                position-y={5 * (idx2 + 1) - val * 10}
                scale={val * 0.5 + 0.75}
              >
                {trees.current ? (
                  <primitive object={trees.current.clone()} />
                ) : (
                  <></>
                )}
              </group>
            );
          });
        })}
      </group>

      {/* <group scale={1}>
        {Object.keys(paving_data).map((key, idx) => {
          return idx % 2 === 0 ? (
            <></>
          ) : (
            <primitive key={key} object={paving_data[key]}></primitive>
          );
        })}
      </group> */}
    </>
  );
};

const SampleTorus = ({ rot_speed, orb_speed }) => {
  const torus1 = useRef();
  const torus2 = useRef();
  const group = useRef();
  const model = useRef();

  const point = useTexture(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/snowflake2.png"
  );

  useFrame(() => {
    group.current.rotateX(-0.001 * rot_speed);
    torus1.current.rotateZ(0.002 * orb_speed);
    // torus2.current.rotateX(-0.001);
    torus2.current.rotateZ(-0.001 * orb_speed);
  });

  return (
    <group ref={group}>
      {/* <RhinoModel url="test.3dm" ref={model} /> */}
      <points ref={torus1}>
        <torusGeometry args={[300, 130, 60, 30]}></torusGeometry>
        {/* <meshStandardMaterial color={0x87a7ca} /> */}
        <pointsMaterial
          size={2.5}
          map={point}
          color="#87a7ca"
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        ></pointsMaterial>
      </points>
      <points ref={torus2}>
        <torusGeometry args={[300, 150, 30, 200]}></torusGeometry>
        {/* <meshStandardMaterial color={0x87a7ca} /> */}
        <pointsMaterial
          size={2.5}
          map={point}
          color="#87a7ca"
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        ></pointsMaterial>
      </points>
    </group>
  );
};

const ThreeTestPage = () => {
  const size = { width: window.innerWidth, height: window.innerHeight };
  const box_geometry = new THREE.BoxGeometry();
  const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
  const cube = new THREE.Mesh(box_geometry, box_material);
  const main_cam = useRef();
  const [main_cam_pos, setMainCamPos] = useState([0, 0, 0]);

  const [test_data, setTestData] = useState({ test: 0 });

  const [rot_speed, setRotSpeed] = useState(1);
  const [orb_speed, setOrbSpeed] = useState(1);
  const [lt_pos, setLtPos] = useState(-30);
  const [lt_pow, setLtPow] = useState(2);

  useLayoutEffect(() => {
    axios
      .get(
        `https://seoulpanorama2123-test.s3.ap-northeast-2.amazonaws.com/20211207+rhino7+alias.txt`
      )
      .then(console.log);
  }, []);

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
          <SoftShadows size={2.5} samples={16} focus={0.05} />
          {/* <fog attach="fog" args={["#ffffff", 3000, 7500]} /> */}
          <color attach="background" args={["#ffffff"]}></color>
          {/* <SampleTorus rot_speed={rot_speed} orb_speed={orb_speed} /> */}
          <ambientLight args={[0xffffff, 0.2]}></ambientLight>
          <directionalLight
            args={["#ffffff", 1.6]}
            castShadow
            shadow-mapSize={4096}
            shadow-bias={-0.001}
            position={[1000, 1000, 1000]}
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
          {/* <group scale={1} rotation-x={-Math.PI / 2} castShadow receiveShadow>
            <SampleHouse />
          </group> */}

          <group scale={1} rotation-x={-Math.PI / 2} castShadow receiveShadow>
            <RhinoModel url="https://seoulpanorama2123-test.s3.ap-northeast-2.amazonaws.com/test/0710_MAP_sample_5.3dm" />
          </group>

          <OrbitControls
            minDistance={1}
            maxDistance={2000000}
            target={[0, 1.5, 0]}
            enableDamping={true}
            dampingFactor={0.15}
            maxPolarAngle={Math.PI / 2}
            screenSpacePanning={false}
            //   onEnd={() => {
            //     console.log(main_cam_pos);
            //   }}
            onChange={() => {
              setMainCamPos(
                new THREE.Vector3(
                  ...(main_cam.current?.position ?? [0, 0, 0])
                ).applyAxisAngle(new THREE.Vector3(0, 1, 0), (3 * Math.PI) / 4)
              );
            }}
          >
            <PerspectiveCamera
              makeDefault
              fov={30}
              aspect={size.width / size.height}
              near={10}
              far={1000000}
              position={[2500, 2500, 35]}
              ref={main_cam}
            ></PerspectiveCamera>
          </OrbitControls>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ThreeTestPage;
