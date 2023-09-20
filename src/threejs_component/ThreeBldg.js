import React, {
  Children,
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from "react";

import * as THREE from "three";
import useGlobalData from "../hooks/useGlobalData";
import RhinoModel from "../component/RhinoModel";
import { useRhinoModel } from "../hooks/useRhinoModel";
import { getS3URL } from "../hooks/useS3";
import { invalidate } from "@react-three/fiber";
import { getGuid } from "../util/alias";

const ThreeBldgRhinoModel = forwardRef(
  ({ file_name, onProgress = () => {}, onLoaded = () => {} }, ref) => {
    const { children } = useRhinoModel(
      getS3URL("", "design/normal_bldg/" + file_name + ".3dm"),
      onProgress
    );
    useEffect(() => {
      onLoaded();
    }, []);
    return (
      <group ref={ref} visible={false}>
        {children.map((e, idx) => (
          <mesh
            key={idx}
            args={[e?.geometry, e?.material]}
            userData={e?.userData}
            castShadow
            receiveShadow
          ></mesh>
        ))}
      </group>
    );
  }
);

const TransformGroup = forwardRef(
  ({ transform, visible, children, copy, onClick, emph }, ref) => {
    const group = useRef();
    const [delay, setDelay] = useState(false);
    useImperativeHandle(ref, () => group, [group]);
    useEffect(() => {
      if (copy) {
        group.current.copy(copy);
      }
      group.current.visible = false;
      group.current.applyMatrix4(
        new THREE.Matrix4().set(...transform?.elements).transpose()
      );
      setTimeout(() => {
        setDelay(true);
      }, [10]);
    }, []);
    useEffect(() => {
      if (emph) {
        group.current.children?.forEach((e) => {
          e.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0xffffff),
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
          });
        });
      } else {
        group.current.children?.forEach((e, idx) => {
          e.material = copy.children?.[idx]?.material;
        });
      }
    }, [emph]);
    return (
      <group ref={group} visible={visible && delay} onClick={onClick}>
        {children}
      </group>
    );
  }
);

const ThreeBldg = ({
  onLoadStart,
  onEachProgress,
  onClickCustomBldg,
  onLoaded,
  visibility,
}) => {
  const [global_data, setGlobalData] = useGlobalData();
  const bldg_ref_data = useRef({});

  const [loading, setLoading] = useState(false);

  const [local_bldg_state, setLocalBldgState] = useState([]);
  const [loaded_rhino_models, setLoadedRhinoModels] = useReducer(
    (state, action) => {
      return [...state, action];
    },
    []
  );

  useEffect(() => {
    const bldg_models = getNormalAndCustomBldgTypes(global_data.bldg_state);
    const load_needed_models = bldg_models.filter(
      (e) => !loaded_rhino_models.includes(e)
    );
    if (!loading) {
      if (load_needed_models.length > 0) {
        console.log("start");
        onLoadStart?.();
        setLoading(true);
        setLoadedRhinoModels(load_needed_models[0]);
      } else {
        setLocalBldgState(
          getNormalAndCustomBldgsToLoad(global_data.bldg_state)
        );
      }
    }
    console.log(load_needed_models, loaded_rhino_models);
  }, [global_data.bldg_state, loaded_rhino_models, loading]);

  useEffect(() => {
    console.log(local_bldg_state.filter((e) => e.visible === false));
    invalidate();
  }, [local_bldg_state]);

  return (
    <Suspense fallback={<mesh />}>
      <group>
        {loaded_rhino_models.map((e) => (
          <Suspense key={e} fallback={<mesh />}>
            <ThreeBldgRhinoModel
              key={e}
              file_name={e}
              onProgress={(xhr) => {
                onEachProgress(e, xhr);
              }}
              onLoaded={() => {
                setLoading(false);
                console.log("end");
                onLoaded?.();
              }}
              ref={(ref) => {
                bldg_ref_data.current[e] = ref;
              }}
            />
          </Suspense>
        ))}
      </group>
      <group visible={visibility ? visibility === "modeling" : true}>
        {local_bldg_state.map((e) => (
          <Suspense key={e.id} fallback={<mesh />}>
            <TransformGroup
              key={e.id}
              transform={e?.transform}
              visible={e.visible}
              copy={bldg_ref_data.current[e.name]}
              onClick={
                e.type === "custom"
                  ? (event) => {
                      event.stopPropagation();
                      if (event.delta < 5) {
                        onClickCustomBldg({
                          event,
                          data_name: e.type,
                          terrain: e.terrain,
                          id: e.id,
                        });
                      }
                    }
                  : undefined
              }
              emph={global_data.clicked_bldg_guids?.includes(e.id)}
            ></TransformGroup>
          </Suspense>
        ))}
      </group>
    </Suspense>
  );
};

const getNormalAndCustomBldgTypes = (bldg_state) => {
  if (bldg_state) {
    const bldg_models = [];
    Object.keys(bldg_state).forEach((e) => {
      if (["normal", "custom"].includes(bldg_state[e].bldg_type)) {
        bldg_state[e].bldg_configuration.forEach((e2) =>
          bldg_models.push(e2.name)
        );
      }
    });
    return [...new Set(bldg_models)];
  }
  return [];
};

const getNormalAndCustomBldgsToLoad = (bldg_state) => {
  if (bldg_state) {
    const list_to_load = [];
    Object.keys(bldg_state).forEach((e) => {
      if (["normal", "custom"].includes(bldg_state[e].bldg_type)) {
        bldg_state[e].bldg_configuration.forEach((e2, idx) =>
          list_to_load.push({
            id: e + "_" + bldg_state[e].bldg_name + "_" + idx,
            bldg_name: bldg_state[e].bldg_name,
            name: e2.name,
            type: bldg_state[e].bldg_type,
            terrain: e,
            visible: e2.overlapped?.length === 0 && bldg_state[e].developed,
            transform: e2.transform,
          })
        );
      }
    });
    // console.log(list_to_load);
    return list_to_load;
  }
  return [];
};

export default ThreeBldg;
