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
  useThree,
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

const ThreeHere = forwardRef(({ position = [0, 0, 0], show = false }, ref) => {
  const { children } = useRhinoModel(getS3URL("", "map/here_model.3dm"));
  useEffect(() => {
    console.log(position, show);
  }, [position, show]);

  const here = useRef();
  useImperativeHandle(ref, () => here, [here]);

  const { invalidate } = useThree();

  useFrame(() => {
    if (show) {
      here.current.rotateZ(-0.02);
      invalidate();
    }
  });

  return (
    <group visible={show} position={position} ref={here}>
      {children.map((e) => (
        <mesh
          key={e?.userData?.attributes?.id}
          args={[e.geometry]}
          userData={e?.userData}
        >
          <meshPhongMaterial attach={"material"} color={0x70a979} />
        </mesh>
      ))}
    </group>
  );
});

export default ThreeHere;
