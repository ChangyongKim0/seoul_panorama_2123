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

import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

extend({ MeshLine, MeshLineMaterial });

const ThreeObjectByLayerIndex = forwardRef(
  (
    {
      objects,
      layer_index,
      layer_indices,
      onClick = false,
      show = false,
      is_line = false,
      merge = false,
    },
    ref
  ) => {
    return (
      <group
        onClick={
          onClick
            ? (event) => {
                event.stopPropagation();
                onClick?.(event);
              }
            : undefined
        }
        ref={ref}
      >
        {merge ? (
          <mesh
            args={[
              BufferGeometryUtils.mergeGeometries(
                objects
                  .filter(
                    (e) =>
                      (layer_indices
                        ? layer_indices.includes(
                            e?.userData?.attributes?.layerIndex
                          )
                        : e?.userData?.attributes?.layerIndex ===
                          layer_index) &&
                      (show ? show[e?.userData?.attributes?.id] : true)
                  )
                  .map((e) => e.geometry),
                false
              ),
            ]}
          ></mesh>
        ) : (
          objects
            .filter(
              (e) =>
                (layer_indices
                  ? layer_indices.includes(e?.userData?.attributes?.layerIndex)
                  : e?.userData?.attributes?.layerIndex === layer_index) &&
                (show ? show[e?.userData?.attributes?.id] : true)
            )
            .map((e, idx) =>
              is_line ? (
                <mesh raycast={MeshLineRaycast} userData={e?.userData}>
                  <meshLine attach="geometry" geom={e.geometry} />
                  <meshLineMaterial
                    attach="material"
                    depthTest={false}
                    lineWidth={2}
                    sizeAttenuation={0}
                    color={0xffffff}
                    //   dashArray={0.1}
                    transparent
                    opacity={0.75}
                    resolution={
                      new THREE.Vector2(window.innerWidth, window.innerHeight)
                    }
                  />
                </mesh>
              ) : (
                <mesh
                  key={e?.userData?.attributes?.id}
                  args={[e.geometry, e.material]}
                  userData={e?.userData}
                ></mesh>
              )
            )
        )}
      </group>
    );
  }
);

const ThreeMap = forwardRef(
  ({ onEachProgress = console.log, onClick = console.log }, ref) => {
    const [global_data, setGlobalData] = useGlobalData();
    const terrain = useRef();
    const line = useRef();
    useImperativeHandle(
      ref,
      () => ({
        terrain: terrain.current,
        line: line.current,
      }),
      [terrain.current, line.current]
    );

    const { children, materials, groups, layers } = useRhinoModel(
      getS3URL("", "map/map_model.3dm"),
      (xhr) => {
        onEachProgress("three_map", xhr);
      }
    );

    useEffect(() => {
      console.log(layers);
    }, [layers]);

    return (
      <group>
        <ThreeObjectByLayerIndex
          objects={children}
          onClick={(event) => {
            if (event.delta < 10) {
              onClick(event);
            }
          }}
          ref={terrain}
          layer_index={layers.findIndex((e) => e.name === "지형_구역")}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={line}
          layer_index={layers.findIndex((e) => e.name === "지형_선")}
          is_line
        />
        <ThreeObjectByLayerIndex
          objects={children}
          layer_indices={[
            // layers.findIndex((e) => e.name === "Default"),
            layers.findIndex((e) => e.name === "지형"),
            layers.findIndex((e) => e.name === "~1970"),
            layers.findIndex((e) => e.name === "1970s"),
            layers.findIndex((e) => e.name === "1980s"),
            layers.findIndex((e) => e.name === "1990s"),
            layers.findIndex((e) => e.name === "2000s"),
            layers.findIndex((e) => e.name === "2010~"),
          ]}
        />
        {/* <ThreeObjectByLayerIndex
          objects={children}
          layer_index={layers.findIndex((e) => e.name === "background")}
          // merge
        /> */}
      </group>
    );
  }
);

export default ThreeMap;
