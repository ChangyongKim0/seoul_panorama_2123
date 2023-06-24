import { useGraph, useLoader } from "@react-three/fiber";
import React, { forwardRef, useImperativeHandle } from "react";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

const RhinoModel = forwardRef(
  (
    {
      url,
      onProgress = (xhr) => {
        console.log(xhr.loaded / xhr.total);
      },
    },
    ref
  ) => {
    const model = useLoader(
      Rhino3dmLoader,
      url,
      (loader) => {
        loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@7.15.0/");
      },
      onProgress
      // model_name,
    );
    // console.log(model);

    const modelgr = useGraph(model);
    // useEffect(() => {
    //   if (modelgr) {
    //     console.log(`◼ ${url} 파일 데이터 출력 시작...`);
    //     console.log("- 순수 모델 데이터");
    //     console.log(model);
    //     console.log("- useGraph로 가공한 데이터");
    //     console.log(modelgr);
    //     console.log("- 추정되는 guid 목록");
    //     console.log(model?.children?.map?.((e) => e?.userData?.attributes?.id));
    //     console.log(`◻ ${url} 파일 데이터 출력 완료...`);
    //   }
    // }, [modelgr]);

    // console.log(modelgr);

    useImperativeHandle(ref, () => ({ model, modelgr }), [url]);

    return <primitive object={model}></primitive>;
  }
);

export default RhinoModel;
