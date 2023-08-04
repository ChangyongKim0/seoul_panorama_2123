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
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

import * as THREE from "three";

import {
  Canvas,
  invalidate,
  useFrame,
  useGraph,
  useLoader,
} from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
  Sphere,
  Stats,
  useHelper,
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
import { getDistance, getGuid, getName } from "../util/alias";
import { getAsyncRegionGuidDataFromS3RegionGuid } from "../util/grasshopperText";
import useGlobalVar from "../hooks/useGlobalVar";
import {
  ThreeCameraHelper,
  ThreeDirectionalLightHelper,
} from "../threejs_component/ThreeHelper";
import ThreeBldg from "../threejs_component/ThreeBldg";
import { _getMasterplanScore } from "../util/JJ_new/_getMasterplanScore";
import { _isValidDevelopment } from "../util/JJ_new/_isValidDevelopment";

const cx = classNames.bind(styles);

const Group = ({ children }) => {
  return children;
};

const updateOrthoCam = (ref, args) => {
  ref.current.left = args[0];
  ref.current.right = args[1];
  ref.current.top = args[2];
  ref.current.bottom = args[3];
  ref.current.near = args[4];
  ref.current.far = args[5];
  ref.current.updateProjectionMatrix();
};

const updateRaycaster = (raycaster, main_cam) => {
  if (raycaster.current && main_cam.current) {
    raycaster.current.setFromCamera(new THREE.Vector2(0, 0), main_cam.current);
  }
};

const DEFAULT_TARGET_POS = [5032, 26, -1568];

const DesignMap = () => {
  const [global_data, setGlobalData] = useGlobalData();
  const fov = 10;
  const size = { width: window.innerWidth, height: window.innerHeight };
  const shadow_target = useRef();
  const main_cam = useRef();
  const raycaster = useRef();
  const three_background = useRef({});
  const orbit_controls = useRef();
  const design_model = useRef();
  const [global_var, setGlobalVar] = useGlobalVar();
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
  const [dist, setDist] = useState(100);
  const dir_light = useRef();
  const ortho_cam = useRef();
  const shadow_pos = useRef();
  const fog = useRef();

  const onStartTransition = () => {
    updateRaycaster(raycaster, main_cam);
    if (three_background.current?.terrains) {
      const raycaster_result = Object.keys(
        three_background.current.terrains || {}
      ).reduce(
        (prev, key) => [
          ...prev,
          ...raycaster.current.intersectObject(
            three_background.current.terrains[key],
            true
          ),
        ],
        []
      );
      // console.log(raycaster_result);
      if (raycaster_result.length > 0) {
        const target_pos = raycaster_result[0].point;
        orbit_controls.current.target = target_pos;
        shadow_target.current.position.set(
          target_pos.x,
          target_pos.y,
          target_pos.z
        );
        dir_light.current.position.set(
          ...[0.05, 0.1, -0.05].map(
            (e, idx) =>
              (e *
                fov *
                getDistance(main_cam.current?.position, target_pos, 200) ||
                e * 2000) + [target_pos.x, target_pos.y, target_pos.z][idx]
          )
        );
        // shadow_pos.current.position.set(
        //   ...[0.05, 0.1, -0.05].map(
        //     (e, idx) =>
        //       (e *
        //         0.01 *
        //         fov *
        //         getDistance(main_cam.current?.position, target_pos, 200) ||
        //         e * 2000) + [target_pos.x, target_pos.y, target_pos.z][idx]
        //   )
        // );
        // console.log(shadow_target.current);
        // fog.current.near =
        //   getDistance(
        //     main_cam.current?.position,
        //     orbit_controls.current?.target,
        //     100
        //   ) * 0.9;
        // fog.current.far =
        //   getDistance(
        //     main_cam.current?.position,
        //     orbit_controls.current?.target,
        //     100
        //   ) * 1.1;
        setDist(
          getDistance(
            main_cam.current?.position,
            orbit_controls.current?.target,
            100
          )
        );
        updateOrthoCam(
          ortho_cam,
          [-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
            (e, idx) =>
              e * fov * getDistance(main_cam.current?.position, target_pos, 200)
          )
        );
      }
    }
  };

  // useEffect(() => {
  //   if (!global_var.loading_state) {
  //     console.log("export...");
  //     const exporter = new GLTFExporter();
  //     exporter.parse(
  //       design_model.current,
  //       (gltf) => {
  //         console.log(gltf);
  //         console.log("finished");
  //       },
  //       (err) => {
  //         console.log(err);
  //         console.log("finished");
  //       }
  //     );
  //   }
  // }, [design_model.current, global_var.loading_state]);

  useEffect(() => {
    if (global_data.background_relation && global_data.bldg_state) {
      console.log("score updated.");
      setGlobalData({
        masterplan_score: _getMasterplanScore(
          global_data.background_relation,
          global_data.bldg_state
        ),
        is_valid_development: _isValidDevelopment(
          global_data.background_relation,
          global_data.bldg_state,
          0.01,
          4
        ),
      });
    }
  }, [global_data.background_relation, global_data.bldg_state]);

  const onClickThreeBackground = (event) => {
    const pilji_list =
      global_data.background_relation.terrain[getGuid(event.object)];

    if (pilji_list === undefined) {
      setGlobalData({
        error: "out_of_region",
      });
    } else if (global_data.clicked_meshs?.[0]?.uuid === event.object?.uuid) {
      setGlobalData({
        clicked_meshs: [],
        clicked_bldg_guids: [],
        emph_guids: [],
        clicked_guid: undefined,
      });
    } else {
      const related_data_list = pilji_list.map(
        (e) => global_data.background_relation.pilji[e]
      );
      if (global_data.waiting_clicking_pilji) {
        setGlobalData({
          waiting_clicking_pilji: false,
          curr_action: {
            ...global_data.curr_action,
            guid: getGuid(event.object),
          },
        });
      } else {
        setGlobalData({
          clicked_meshs: [event.object],
          clicked_bldg_guids: [],
          emph_guids: related_data_list.reduce(
            (prev, curr) => [...prev, ...curr.terrain_outline],
            []
          ),
          clicked_guid: getGuid(event.object),
        });
      }
    }
  };

  const onClickThreeBackgroundBldgWithGlobalData = (
    { event, data_name },
    global_data
  ) => {
    if (global_data.waiting_clicking_pilji) {
      setGlobalData({ error: "please_click_pilji" });
    } else {
      const associated_terrain_guid =
        global_data?.background_state?.[data_name]?.[getGuid(event.object)]
          ?.terrain_guid;
      if (
        associated_terrain_guid === global_data?.clicked_guid &&
        global_data.clicked_bldg_guids?.length > 0
      ) {
        setGlobalData({
          clicked_meshs: [],
          clicked_bldg_guids: [],
          emph_guids: [],
          clicked_guid: undefined,
        });
      } else {
        const associated_pilji_guids =
          global_data?.background_state?.[data_name]?.[getGuid(event.object)]
            ?.pilji_guids;
        const clicked_bldg_guids = [];
        const bldg_model_type = data_name
          .split("_")
          .splice(0, data_name.split("_").length - 1)
          .join("_");
        ["model", "wall", "roof"].forEach((type) => {
          associated_pilji_guids.forEach((pilji_guid) => {
            const bldg_guid =
              global_data.background_relation?.pilji?.[pilji_guid]?.[
                bldg_model_type + "_" + type
              ];
            if (bldg_guid) {
              clicked_bldg_guids.push(bldg_guid);
            }
          });
        });
        setGlobalData({
          clicked_meshs: [],
          clicked_bldg_guids,
          emph_guids: [],
          clicked_guid: associated_terrain_guid,
        });
      }
    }
  };

  useEffect(() => {
    getAsyncRegionGuidDataFromS3RegionGuid("1").then((res) => {
      console.log("this");
      setGlobalData({ background_relation: res });
    });
  }, []);

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Suspense fallback={<Loading each_xhr={each_xhr} />}>
        <Canvas shadows frameloop="demand">
          <SoftShadows size={10} samples={16} focus={0.05} />
          {/* <fog attach="fog" args={["#ffffff", 1, 10000]} ref={fog} /> */}
          <color attach="background" args={["#ffffff"]}></color>
          {/* <SampleTorus rot_speed={rot_speed} orb_speed={orb_speed} /> */}
          <ambientLight args={[0xffffff, 0.3]}></ambientLight>
          <directionalLight
            args={["#ffffff", 0.8]}
            castShadow
            // receiveShadow
            shadow-mapSize={2048}
            shadow-bias={-0.001}
            target={shadow_target.current}
            position={[0.05, 0.1, -0.05].map(
              (e, idx) => e * 2000 + DEFAULT_TARGET_POS[idx]
            )}
            ref={dir_light}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
                (e, idx) => e * 2000
              )}
              ref={ortho_cam}
            />
          </directionalLight>
          {/* <ThreeDirectionalLightHelper dir_light={dir_light} />
          <ThreeCameraHelper cam={ortho_cam} /> */}
          <raycaster ref={raycaster} />
          <mesh
            ref={shadow_target}
            position={DEFAULT_TARGET_POS}
            visible={false}
            receiveShadow
            castShadow
          >
            <sphereGeometry args={[1]} />
            <meshBasicMaterial color={0xff00000} />
          </mesh>
          {/* <mesh
            ref={shadow_pos}
            position={DEFAULT_TARGET_POS}
            // visible={false}
            receiveShadow
            castShadow
          >
            <sphereGeometry args={[1]} />
            <meshBasicMaterial color={0x00000ff} />
          </mesh> */}
          <group
            scale={1}
            rotation-x={-Math.PI / 2}
            receiveShadow
            castShadow
            ref={design_model}
          >
            <ThreeBackground
              onClick={onClickThreeBackground}
              onClickBldg={(event) => {
                onClickThreeBackgroundBldgWithGlobalData(event, global_data);
              }}
              onClickBack={() => {
                setGlobalData({ error: "too_far_pilji" });
              }}
              onEachProgress={(name, xhr) => {
                const new_xhr = { count: 6, data: {} };
                new_xhr.data[name] = xhr;
                setEachXhr(new_xhr);
              }}
              ref={three_background}
            />
            <ThreeBldg
              onLoadStart={() => {
                setEachXhr("reset");
                console.log("start");
                setGlobalVar({ loading_state: "building" });
              }}
              onEachProgress={(name, xhr) => {
                const new_xhr = { count: 2, data: {} };
                new_xhr.data[name] = xhr;
                setEachXhr(new_xhr);
              }}
              onLoaded={() => {
                console.log("end");
                setGlobalVar({ loading_state: false });
              }}
            />
          </group>
          {/* <Selection>
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
              
                {global_data.clicked_meshs?.map?.((e, idx) => (
                  <group key={idx} position={[0, 0, 0]}>
                    <mesh args={[e.clone().geometry]}>
                      <meshBasicMaterial
                        attach={"material"}
                        transparent={true}
                        opacity={0.5}
                        side={THREE.DoubleSide}
                      />
                    </mesh>
                  </group>
                ))}
              </group>
            </Select>
          </Selection> */}
          <group scale={1} rotation-x={-Math.PI / 2} receiveShadow castShadow>
            {global_data.clicked_meshs?.map?.((e, idx) => (
              <mesh key={idx} args={[e.clone().geometry]}>
                <meshBasicMaterial
                  attach={"material"}
                  transparent={true}
                  opacity={0.5}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
          </group>

          <OrbitControls
            minDistance={500}
            maxDistance={4000}
            target={DEFAULT_TARGET_POS}
            enableDamping={true}
            dampingFactor={0.15}
            screenSpacePanning={true}
            onStart={() => {
              onStartTransition();
            }}
            ref={orbit_controls}
            touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
          >
            <PerspectiveCamera
              makeDefault
              fov={fov}
              aspect={size.width / size.height}
              near={0.1 * dist}
              far={100 * dist}
              position={[184 * 4, 523 * 4, 490 * 4].map(
                (e, idx) => e + DEFAULT_TARGET_POS[idx]
              )}
              ref={main_cam}
            ></PerspectiveCamera>
          </OrbitControls>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default DesignMap;
