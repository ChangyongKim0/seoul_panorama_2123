import { useHelper } from "@react-three/drei";
import React from "react";

import * as THREE from "three";

export const ThreeDirectionalLightHelper = ({ dir_light }) => {
  useHelper(dir_light, THREE.DirectionalLightHelper, 2, 0xff0000);
};

export const ThreeCameraHelper = ({ cam }) => {
  useHelper(cam, THREE.CameraHelper);
};
