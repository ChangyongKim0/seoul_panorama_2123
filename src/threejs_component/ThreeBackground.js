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
import useGlobalData from "../hooks/useGlobalData";
import { useRhinoModel } from "../hooks/useRhinoModel";
import { getS3URL } from "../hooks/useS3";

const ThreeObjectByLayerIndex = forwardRef(
  ({ objects, layer_index, onClick = false, show = false }, ref) => {
    const [global_data, setGlobalData] = useGlobalData();

    useEffect(() => {
      setGlobalData({ test: { name: "test", layer_index, onClick } });
    }, [objects]);

    const texture = useRhinoModel(getS3URL("", "texture/sample.3dm"))
      .materials[0];

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
              e?.userData?.attributes?.layerIndex === layer_index &&
              (show ? show[e?.userData?.attributes?.id] : true)
          )
          .map((e, idx) => (
            <mesh
              key={e?.userData?.attributes?.id}
              args={[e.geometry, texture]}
              userData={e?.userData}
            >
              {/* <meshBasicMaterial
                    attach={"material"}
                    transparent={true}
                    color={0xff0000}
                    opacity={0.5}
                  /> */}
            </mesh>
          ))}
      </group>
    );
  }
);

const ThreeBackground = forwardRef(
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
      getS3URL("", "design/grid_model/{12;10}.3dm"),
      (xhr) => {
        onEachProgress("three_background", xhr);
      }
    );

    // console.log(model, children, materials, groups, layers);

    return (
      <group>
        <ThreeObjectByLayerIndex
          objects={children}
          onClick={(event) => {
            onClick(event);
          }}
          ref={terrain}
          layer_index={layers.findIndex((e) => e.name === "topo")}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={road}
          layer_index={layers.findIndex((e) => e.name === "road")}
          show={{ "5c1d3668-dd0f-4bf7-bee2-8eb8d3af275d": true }}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={pilji}
          layer_index={layers.findIndex((e) => e.name === "plot")}
          show={{ "5c1d3668-dd0f-4bf7-bee2-8eb8d3af275d": true }}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={ramp}
          layer_index={layers.findIndex((e) => e.name === "ramp")}
          show={{ "5c1d3668-dd0f-4bf7-bee2-8eb8d3af275d": true }}
        />
        <ThreeObjectByLayerIndex
          objects={children}
          ref={stair}
          layer_index={layers.findIndex((e) => e.name === "stairs")}
          show={{ "5c1d3668-dd0f-4bf7-bee2-8eb8d3af275d": true }}
        />
      </group>
    );
  }
);

export default ThreeBackground;
