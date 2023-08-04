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

import * as THREE from "three";

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
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { getGuid, getName } from "../util/alias";
import useGlobalVar from "../hooks/useGlobalVar";

extend({ MeshLine, MeshLineMaterial });

const ThreeObjectByLayerName = forwardRef(
  (
    {
      objects,
      data_name,
      layer_name,
      layers,
      textures,
      is_line,
      onClick = false,
      onClickBldg = false,
      show = false,
      use_name = false,
      hide_default = false,
      bldg = false,
      update_data = false,
    },
    ref
  ) => {
    const [global_data, setGlobalData] = useGlobalData();

    const setNewBldgState = (objects) => {
      if (layer_name === "topo") {
        const guids = objects
          .filter(
            (e) =>
              layers[e?.userData?.attributes?.layerIndex].name === layer_name
          )
          .map((e) => (use_name ? getName(e) : getGuid(e)));
        const new_data = {};
        guids.forEach((e) => {
          new_data[e] = {
            developed: false,
            bldg_type: "",
            bldg_name: "",
            bldg_configuration: [],
            overlapped: [],
          };
        });
        setGlobalData((global_data) => ({
          bldg_state: { ...global_data?.bldg_state, ...new_data },
        }));
      }
    };

    // const setNewBackgroundState = (objects, hide_default) => {
    //   const getNewBackgroundState = (global_data) => {
    //     const guids = objects
    //       .filter(
    //         (e) =>
    //           layers[e?.userData?.attributes?.layerIndex].name === layer_name
    //       )
    //       .map((e) => (use_name ? getName(e) : getGuid(e)));
    //     const new_data = {};
    //     guids.forEach((e) => {
    //       new_data[e] = !hide_default;
    //     });
    //     const new_background_state = global_data.background_state || {};
    //     new_background_state[data_name || layer_name] = new_data;
    //     return new_background_state;
    //   };
    //   setGlobalData((global_data) => ({
    //     background_state: getNewBackgroundState(global_data),
    //   }));
    // };
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      setTimeout(() => {
        setVisible(true);
      }, 100);
    }, []);

    useEffect(() => {
      if (data_name) {
        setNewBldgState(objects);
        if (update_data) {
          setGlobalData((global_data) => {
            const data_to_update = global_data.background_state || {};
            data_to_update[data_name] = bldg ? {} : [];
            return { background_state: data_to_update, type: "silent" };
          });
        }
      }
    }, []);

    return (
      <group
        onClick={
          onClick
            ? (event) => {
                event.stopPropagation();
                if (event.delta < 5) {
                  onClick?.(event);
                }
              }
            : undefined
        }
        ref={ref}
      >
        {objects
          .filter(
            (e) =>
              layers[e?.userData?.attributes?.layerIndex].name === layer_name
          )
          .map((e, idx) =>
            is_line ? (
              <mesh
                key={e?.userData?.attributes?.id}
                raycast={MeshLineRaycast}
                userData={e?.userData}
                visible={
                  data_name
                    ? global_data?.background_state?.[data_name]?.includes(
                        use_name ? getName(e) : getGuid(e)
                      )
                      ? hide_default
                      : !hide_default
                    : true
                }
              >
                <meshLine attach="geometry" geom={e.geometry} />
                <meshLineMaterial
                  attach="material"
                  depthTest={
                    global_data.emph_guids?.includes(getGuid(e)) ? false : true
                  }
                  lineWidth={
                    global_data.emph_guids?.includes(getGuid(e)) ? 5 : 1
                  }
                  sizeAttenuation={0}
                  color={0xffffff}
                  //   dashArray={0.1}
                  transparent
                  opacity={
                    global_data.emph_guids?.includes(getGuid(e)) ? 0.75 : 0.25
                  }
                  resolution={
                    new THREE.Vector2(window.innerWidth, window.innerHeight)
                  }
                />
              </mesh>
            ) : (
              <mesh
                key={e?.userData?.attributes?.id}
                args={[
                  e.geometry,
                  global_data.clicked_bldg_guids?.includes(
                    e?.userData?.attributes?.id
                  )
                    ? undefined
                    : textures.filter(
                        (e2) =>
                          e2.name ===
                          (bldg
                            ? global_data?.background_state?.[data_name]?.[
                                use_name ? getName(e) : getGuid(e)
                              ]?.texture
                            : data_name
                            ? data_name
                            : layer_name)
                      )?.[0],
                ]}
                userData={e?.userData}
                visible={
                  visible &&
                  (data_name
                    ? (
                        bldg
                          ? Object.keys(
                              global_data?.background_state?.[data_name] || {}
                            )?.includes(use_name ? getName(e) : getGuid(e))
                          : global_data?.background_state?.[
                              data_name
                            ]?.includes(use_name ? getName(e) : getGuid(e))
                      )
                      ? hide_default
                      : !hide_default
                    : true)
                }
                onClick={
                  bldg &&
                  (data_name
                    ? (
                        bldg
                          ? Object.keys(
                              global_data?.background_state?.[data_name] || {}
                            )?.includes(use_name ? getName(e) : getGuid(e))
                          : global_data?.background_state?.[
                              data_name
                            ]?.includes(use_name ? getName(e) : getGuid(e))
                      )
                      ? hide_default
                      : !hide_default
                    : true)
                    ? (event) => {
                        event.stopPropagation();
                        if (event.delta < 5) {
                          onClickBldg?.({ event, data_name });
                        }
                      }
                    : undefined
                }
                receiveShadow
                castShadow
              >
                {global_data.clicked_bldg_guids?.includes(
                  e?.userData?.attributes?.id
                ) && (
                  <meshPhongMaterial
                    attach={"material"}
                    transparent={true}
                    opacity={0.9}
                    side={THREE.DoubleSide}
                  />
                )}
              </mesh>
            )
          )}
      </group>
    );
  }
);

export const LAYER_PROPERTIES = [
  {
    data_name: "terrain_outline",
    layer_name: "topo_outline",
    is_line: true,
    // hide_default: true,
  },
  {
    layer_name: "always_on",
  },
  {
    data_name: "pilji",
    layer_name: "plot_mesh",
    hide_default: true,
    use_name: true,
  },
  {
    data_name: "ramp",
    layer_name: "ramp",
    hide_default: true,
  },
  {
    data_name: "stair",
    layer_name: "stairs",
    hide_default: true,
  },
  {
    data_name: "terrain_wall",
    layer_name: "topo_wall",
    hide_default: true,
  },
  {
    data_name: "road",
    layer_name: "road_mesh",
    hide_default: true,
    use_name: true,
  },

  {
    data_name: "d_1_roof",
    layer_name: "square bldg_roof",
    hide_default: true,
    bldg: true,
  },
  {
    data_name: "d_1_wall",
    layer_name: "square bldg_wall",
    hide_default: true,
    bldg: true,
  },
  // {
  //   data_name: "x_1_model",
  //   layer_name: "x-1 bldg",
  //   hide_default: true,
  //   bldg: true,
  // },
  {
    data_name: "x_2_model",
    layer_name: "x-2 bldg",
    hide_default: true,
    bldg: true,
  },
  // {
  //   data_name: "x_3_roof",
  //   layer_name: "x-3 bldg_roof",
  //   hide_default: true,
  //   bldg: true,
  // },
  // {
  //   data_name: "x_3_wall",
  //   layer_name: "x-3 bldg_wall",
  //   hide_default: true,
  //   bldg: true,
  // },
  {
    data_name: "y_1_roof",
    layer_name: "y-1 bldg_roof",
    hide_default: true,
    bldg: true,
  },
  {
    data_name: "y_1_wall",
    layer_name: "y-1 bldg_wall",
    hide_default: true,
    bldg: true,
  },
  {
    data_name: "y_2_roof",
    layer_name: "y-2 bldg_roof",
    hide_default: true,
    bldg: true,
  },
  {
    data_name: "y_2_wall",
    layer_name: "y-2 bldg_wall",
    hide_default: true,
    bldg: true,
  },
];

const ThreeBackgroundEach = forwardRef(
  (
    {
      objects = [],
      layers = [],
      textures = [],
      update_data = false,
      onEachProgress = console.log,
      onClick = console.log,
      onClickBldg = console.log,
    },
    ref
  ) => {
    const [global_data, setGlobalData] = useGlobalData();
    const terrain = useRef();
    const road = useRef();
    const ramp = useRef();
    const stair = useRef();
    const pilji = useRef();
    useImperativeHandle(
      ref,
      () => ({
        terrain: terrain.current,
        road: road.current,
        ramp: ramp.current,
        stair: stair.current,
        pilji: pilji.current,
      }),
      [terrain.current]
    );

    return (
      <group>
        <ThreeObjectByLayerName
          objects={objects}
          layers={layers}
          textures={textures}
          onClick={(event) => {
            onClick(event);
          }}
          ref={terrain}
          data_name="terrain"
          layer_name="topo"
          update_data={update_data}
        />
        {LAYER_PROPERTIES.map((e, idx) => (
          <ThreeObjectByLayerName
            objects={objects}
            layers={layers}
            key={idx}
            textures={textures}
            onClickBldg={(event) => {
              onClickBldg(event);
            }}
            update_data={update_data}
            {...e}
          />
        ))}
      </group>
    );
  }
);

export const ThreeBackground = forwardRef(
  (
    {
      onEachProgress = console.log,
      onClick = console.log,
      onClickBldg = console.log,
      onClickBack = console.log,
    },
    ref
  ) => {
    const terrains = useRef();
    const [global_data, setGlobalData] = useGlobalData();
    const [global_var, setGlobalVar] = useGlobalVar();

    const url_data = useMemo(
      () => ({
        background: global_data.grids?.map((e) =>
          getS3URL("", `design/grid_model/${e}.3dm`)
        ),
        back: getS3URL(
          "",
          `design/grid_background/${global_var.region_no}_${global_data.grids[0]}.3dm`
        ),
      }),
      [global_data.grids, global_var.region_no]
    );

    const textures = useRhinoModel(
      getS3URL("", "texture/big_bldg.3dm"),
      (xhr) => {
        onEachProgress("three_texture", xhr);
      }
    ).materials;
    const background_0 = useRhinoModel(url_data.background?.[0], (xhr) => {
      onEachProgress("three_background_grid_0", xhr);
    });
    const background_1 = useRhinoModel(url_data.background?.[1], (xhr) => {
      onEachProgress("three_background_grid_1", xhr);
    });
    const background_2 = useRhinoModel(url_data.background?.[2], (xhr) => {
      onEachProgress("three_background_grid_2", xhr);
    });
    const background_3 = useRhinoModel(url_data.background?.[3], (xhr) => {
      onEachProgress("three_background_grid_3", xhr);
    });
    const background_back = useRhinoModel(url_data.back, (xhr) => {
      onEachProgress("three_background_back", xhr);
    });

    const getEachRef = (ref, id) => {
      return (internal_ref) => {
        if (ref.current === undefined) {
          ref.current = {};
        }
        Object.keys(internal_ref || {}).forEach((key) => {
          if (ref.current[key + "s"] === undefined) {
            ref.current[key + "s"] = {};
          }
          ref.current[key + "s"][id] = internal_ref[key];
        });
      };
    };

    // useEffect(() => {
    //   console.log(background_back);
    // }, [background_back]);

    return (
      <group>
        <ThreeBackgroundEach
          objects={background_0.children}
          layers={background_0.layers}
          textures={textures}
          onClick={onClick}
          onClickBldg={onClickBldg}
          ref={getEachRef(ref, "background_0")}
          update_data
        />
        <ThreeBackgroundEach
          objects={background_1.children}
          layers={background_1.layers}
          textures={textures}
          onClick={onClick}
          onClickBldg={onClickBldg}
          ref={getEachRef(ref, "background_1")}
        />
        <ThreeBackgroundEach
          objects={background_2.children}
          layers={background_2.layers}
          textures={textures}
          onClick={onClick}
          onClickBldg={onClickBldg}
          ref={getEachRef(ref, "background_2")}
        />
        <ThreeBackgroundEach
          objects={background_3.children}
          layers={background_3.layers}
          textures={textures}
          onClick={onClick}
          onClickBldg={onClickBldg}
          ref={getEachRef(ref, "background_3")}
        />
        <group
          ref={(internal_ref) => {
            if (ref.current === undefined) {
              ref.current = {};
            }
            ref.current.back = internal_ref;
          }}
          onClick={onClickBack}
        >
          {background_back.children.map((e) => (
            <mesh
              key={getGuid(e)}
              args={[
                e.geometry,
                textures.filter(
                  (e2) =>
                    e2.name ===
                    background_back?.layers?.[
                      e?.userData?.attributes?.layerIndex || 0
                    ]?.name
                )?.[0],
              ]}
              userData={e.userData}
            ></mesh>
          ))}
        </group>
      </group>
    );
  }
);

export default ThreeBackground;
