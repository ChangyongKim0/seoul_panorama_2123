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
    { objects, layer_index, onClick = false, show = false, is_line = false },
    ref
  ) => {
    const [global_data, setGlobalData] = useGlobalData();

    useEffect(() => {
      setGlobalData({ test: { name: "test", layer_index, onClick } });
      console.log(
        objects.filter(
          (e) =>
            e?.userData?.attributes?.layerIndex === layer_index &&
            (show ? show[e?.userData?.attributes?.id] : true)
        )
      );
    }, [objects]);

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
        {objects
          .filter(
            (e) =>
              e?.userData?.attributes?.layerIndex === layer_index &&
              (show ? show[e?.userData?.attributes?.id] : true)
          )
          .map((e, idx) =>
            is_line ? (
              <mesh raycast={MeshLineRaycast} useData={e?.useData}>
                <meshLine attach="geometry" geom={e.geometry} />
                <meshLineMaterial
                  attach="material"
                  depthTest={false}
                  lineWidth={3}
                  sizeAttenuation={0}
                  color={0xffffff}
                  //   dashArray={0.1}
                  transparent
                  opacity={0.25}
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
          )}
      </group>
    );
  }
);

const ThreeMap = forwardRef(
  ({ onEachProgress = console.log, onClick = console.log }, ref) => {
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

    const { model, children, materials, groups, layers } = useRhinoModel(
      getS3URL("", "map/map_model.3dm"),
      (xhr) => {
        onEachProgress("three_map", xhr);
      }
    );

    return (
      <group>
        <ThreeObjectByLayerIndex
          objects={children}
          onClick={(event) => {
            if (event.delta < 10) {
              if (global_data.clicked_meshs?.[0]?.uuid === event.object?.uuid) {
                setGlobalData({ clicked_meshs: [] });
              } else {
                setGlobalData({ clicked_meshs: [event.object] });
              }
              onClick(event);
            }
          }}
          ref={terrain}
          layer_index={layers.findIndex((e) => e.name === "지형_구역")}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={road}
          layer_index={layers.findIndex((e) => e.name === "지형_선")}
          is_line
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={pilji}
          layer_index={layers.findIndex((e) => e.name === "background")}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={ramp}
          layer_index={layers.findIndex((e) => e.name === "지형")}
        />
      </group>
    );
  }
);

export default ThreeMap;
