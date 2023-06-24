import { useLoader } from "@react-three/fiber";
import React from "react";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

export const useRhinoModel = ({ url, onProgress }) => {
  const model = useLoader(
    Rhino3dmLoader,
    url,
    (loader) => {
      loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@7.15.0/");
    },
    onProgress
    // model_name,
  );

  const children = model?.children;
  const materials = model?.userData?.materials;
  const groups = model?.userData?.groups;
  const layers = model?.userData?.layers;

  console.log(children, materials, groups, layers);

  return { children, materials, groups, layers };
};
