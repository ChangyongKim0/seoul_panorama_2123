import { useThree } from "@react-three/fiber";
import { forwardRef, useEffect } from "react";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRayCast } from "three.meshline";

const ThreeMeshLine = forwardRef(({ line, options, userData }, ref) => {
  const { gl, scene } = useThree();
  useEffect(() => {
    let mesh;
    console.log(line, userData);
    if (line.geometry && options && userData) {
      const mesh_line = new MeshLine();
      // console.log(line.geometry.getAttribute("position"));
      mesh_line.setGeometry(line.geometry);
      const material = new MeshLineMaterial(options);
      mesh = new THREE.Mesh(mesh_line, material);
      mesh.userData = userData;
      console.log(mesh);
      scene.add(mesh);
    }
    return () => {
      scene.remove(mesh);
    };
  }, [line, options, userData]);
});

export default ThreeMeshLine;
