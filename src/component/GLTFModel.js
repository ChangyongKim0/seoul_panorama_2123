import { useGraph, useLoader } from "@react-three/fiber";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const GLTFModel = forwardRef(
  (
    {
      url,
      onProgress = (xhr) => {
        console.log(xhr.loaded / xhr.total);
      },
      onLoaded = () => {
        console.log("loaded");
      },
      onFail = () => {
        console.log("fail");
      },
      color,
      visible,
    },
    ref
  ) => {
    const set_timeout_id = useRef(0);
    const flattenObjectStructure = (obj) => {
      const flatten_list = [];
      if (obj.isMesh) {
        flatten_list.push(obj.geometry);
      } else {
        obj.children?.forEach((e) => {
          flatten_list.push(...flattenObjectStructure(e));
        });
      }
      return flatten_list;
    };
    const material = useMemo(
      () => new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide }),
      [color]
    );
    useLayoutEffect(() => {
      if (!color) {
        set_timeout_id.current = setTimeout(() => {
          console.log("failed");
          onFail();
        }, 15000);
      }
    }, []);
    const model = useLoader(
      GLTFLoader,
      url,
      (loader) => {},
      onProgress
      // model_name,
    );
    const flatten_model = useMemo(
      () => (color ? flattenObjectStructure(model.scene) : []),
      [model]
    );
    const internal_ref = useRef();
    useImperativeHandle(ref, () => internal_ref.current, [
      internal_ref.current,
    ]);
    // console.log(model);
    useEffect(() => {
      console.log(internal_ref);
      return () => {
        if (!color && internal_ref?.current) {
          internal_ref.current.traverse((e) => e.dispose?.());
        }
      };
    }, [internal_ref?.current]);

    useEffect(() => {
      clearTimeout(set_timeout_id.current);
      if (!color) {
        console.log("loaded");
        setTimeout(() => {
          onLoaded();
        }, 600);
      }
    }, []);
    return color ? (
      <group
        rotation-x={-Math.PI / 2}
        receiveShadow
        castShadow
        visible={visible}
        ref={internal_ref}
      >
        {flatten_model.map((e, idx) => (
          <mesh key={idx} args={[e, material]}></mesh>
        ))}
      </group>
    ) : (
      <group
        ref={internal_ref}
        onClick={() => console.log(internal_ref)}
        castShadow
        receiveShadow
      >
        <primitive castShadow receiveShadow object={model.scene}></primitive>
      </group>
    );
  }
);

export default GLTFModel;
