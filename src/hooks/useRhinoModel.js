import { useLoader } from "@react-three/fiber";
import React, { useMemo } from "react";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

export const useRhinoModel = (url, onProgress) => {
  const model = useLoader(
    Rhino3dmLoader,
    url,
    (loader) => {
      loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@7.15.0/");
    },
    onProgress
    // model_name,
  );

  const children = useMemo(() => model?.children, [model]);
  const materials = useMemo(() => model?.userData?.materials, [model]);
  const groups = useMemo(() => model?.userData?.groups, [model]);
  const layers = useMemo(() => model?.userData?.layers, [model]);

  return { children, materials, groups, layers };
};
