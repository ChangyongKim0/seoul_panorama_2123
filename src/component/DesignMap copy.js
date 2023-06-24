// import React, {
//   Suspense,
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useLayoutEffect,
//   useReducer,
//   useRef,
//   useState,
//   useMemo,
// } from "react";
// import classNames from "classnames/bind";
// import "../util/reset.css";
// import styles from "./DesignMap.module.scss";

// import * as THREE from "three";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
// import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";

// import { Canvas, useFrame, useGraph, useLoader, useThree, extend } from "@react-three/fiber";

// import {
//   OrbitControls,
//   PerspectiveCamera,
//   SoftShadows,
//   Sphere,
//   Stats,
//   useTexture,
// } from "@react-three/drei";
// // import {EffectComposer, Outline} from "@react-three/postprocessing";
// // import { BlendFunction, Resizer, KernelSize } from "postprocessing";
// import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";
// import { MathUtils } from "three";
// import AutoLayout from "./AutoLayout";
// import Loading from "./Loading";
// import RhinoModel from "./RhinoModel";

// const cx = classNames.bind(styles);


// extend({EffectComposer, RenderPass, OutlinePass});

// const Group = ({ children }) => {
//   return children;
// };

// const SampleHouse = forwardRef(({ onEachProgress, onClick }, ref) => {
//   const X_LENGTH = 10;
//   const Y_LENGTH = 10;
//   const pavings = useRef();
//   const trees = useRef();
//   const newtrees = useRef();
//   const clicked_meshs = useRef([]);
//   useImperativeHandle(ref, ()=>({terrain : trees.current, clicked_mesh : clicked_meshs.current }), [trees.current, clicked_meshs.current]);
//   const [show_paving, setShowPaving] = useState(false);
//   const [show_trees, setShowTrees] = useState(true);
//   const [paving_data, setPavingData] = useState({});
//   const [random_matrix, setRandomMatrix] = useState(
//     new Array(X_LENGTH).fill(new Array(Y_LENGTH).fill(0))
//   );
//   useFrame(() => {
//     pavings.current.position.z = show_paving
//       ? MathUtils.lerp(pavings.current.position.z, 0, 0.1)
//       : MathUtils.lerp(pavings.current.position.z, -0.125, 0.1);
//   });
//   useLayoutEffect(() => {
//     setRandomMatrix(
//       new Array(X_LENGTH)
//         .fill(new Array(Y_LENGTH).fill(0))
//         .map((e) => e.map((e2) => Math.random()))
//     );
//     console.log(random_matrix);
//   }, []);
//   useEffect(() => {
//     if (pavings.current) {
//       setPavingData(
//         pavings.current?.children?.reduce?.((prev, curr) => {
//           prev[curr?.userData?.attributes?.id] = curr;
//           return prev;
//         }, {})
//       );
//     }
//   }, [pavings]);
//   return (
//     <>
//       <group
//         onClick={(event) => {
//           event.stopPropagation();
//         }}
//       >
//         <RhinoModel
//           url="model/test2.3dm"
//           onProgress={(xhr) => {
//             onEachProgress("test2", xhr);
//           }}
//         />
//       </group>
//       <group
//         onClick={(event) => {
//           event.stopPropagation();
//           setShowPaving(!show_paving);
//         }}
//       >
//         <RhinoModel
//           url="model/test3.3dm"
//           ref={pavings}
//           onProgress={(xhr) => {
//             onEachProgress("test2", xhr);
//           }}
//         />
//       </group><group
//         onClick={(event)=>{onClick?.(event);console.log(clicked_meshs); clicked_meshs.current = [event.object];}}
//       >
//       {clicked_meshs.current.map(
//         (e,idx)=><group key={idx} position={[0,0,10]}>
//             <primitive object={e.clone()}/>
//           </group>)
//       }
//       <RhinoModel
//         url="model/0531_idtest.3dm"
//         ref={trees}
//         onProgress={(xhr) => {
//           onEachProgress("test2", xhr);
//         }}
//       /></group>
//     </>
//   );
// });

// const CustomEffect = ({children}) => {
//   const { gl, scene, camera, size } = useThree()
//   const composer = useRef()
//   const [hovered, set] = useState([])
//   const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
//   useEffect(() => composer.current.setSize(size.width, size.height), [size])
//   // useFrame(() => composer.current.render(), 1)

//   return (
//     <effectComposer ref={composer} args={[gl]}>
//       <renderPass attachArray="passes" args={[scene, camera]} />
//       <outlinePass
//         attachArray="passes"
//         args={[aspect, scene, camera]}
//         selectedObjects={[]}
//         visibleEdgeColor="white"
//         edgeStrength={50}
//         edgeThickness={1}
//       />
//       {/* <Outline 
//         selection={shadow_target}
//         selectionLayer={1} 
//         blendFunction={BlendFunction.SCREEN}
//         patternTexture={null} 
//         edgeStrength={2.5}
//         pulseSpeed={.0}
//         visibleEdgeColor={0x22090a} 
//         hiddenEdgeColor={0x22090a} 
//         width={Resizer.AUTO_SIZE} 
//         height={Resizer.AUTO_SIZE}
//         kernelSize={KernelSize.LARGE}
//         blur={false}
//         xRay={true}
//       /> */}
//     </effectComposer>
//   )
// }

// const DesignMap = () => {
//   const fov = 10;
//   const size={width:window.innerWidth, height:window.innerHeight}
//   const box_geometry = new THREE.BoxGeometry();
//   const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
//   const cube = new THREE.Mesh(box_geometry, box_material);
//   const shadow_target = useRef();
//   const main_cam = useRef();
//   const raycaster = useRef();
//   const sample_model = useRef();
//   const orbit_controls = useRef();
//   const [target_pos, setTargetPos] = useState(new THREE.Vector3(0,0,0));
//   const [on_change, setOnChange] = useState(0);
//   const [each_xhr, setEachXhr] = useReducer((state, action) => {
//     return { ...state, ...action };
//   }, {});
//   const [start_count, setStartCount] = useState(0);

//   const getDistance = (vec1, vec2, default_dist) => {
//     try{
//     return Math.sqrt((vec1.x-vec2.x)**2+(vec1.y-vec2.y)**2+(vec1.z-vec2.z)**2)}catch(e){return default_dist}
//   }

//   useEffect(()=>{
//     if(raycaster.current && main_cam.current){
//       raycaster.current.setFromCamera(new THREE.Vector2(0,0), main_cam.current)
//     }
//   }, [main_cam.current, raycaster.current, on_change]);

  

//   return (
//     <div className={cx("wrapper") + " three-js-container"}>
//       <Suspense fallback={<Loading each_xhr={each_xhr} />}>
//         <Canvas shadows>
//           <SoftShadows size={10} samples={16} focus={0.05} />
//           {/* <fog attach="fog" args={["#ffffff", 0, 10000]} /> */}
//           <color attach="background" args={["#ffffff"]}></color>
//           {/* <SampleTorus rot_speed={rot_speed} orb_speed={orb_speed} /> */}
//           <ambientLight args={[0xffffff, 0.5]}></ambientLight>
//           <directionalLight
//             args={["#ffffff", 1]}
//             castShadow
//             shadow-mapSize={4096}
//             shadow-bias={-0.001}
//             position={[0.05, 0.1, -0.05].map(
//               (e, idx) =>
//                 (e * fov * getDistance(main_cam.current?.position, target_pos, 200) ||
//                 e * 2000) + on_change * 0 + [target_pos.x,target_pos.y, target_pos.z][idx]
//             )}
//             target={shadow_target.current}
//           >
//             <orthographicCamera
//               attach="shadow-camera"
//               args={[-0.02, 0.02, 0.02, -0.02, 0.1, 0.15].map(
//                 (e, idx) =>
//                   e * fov *  getDistance(main_cam.current?.position, target_pos, 200) || e * 2000 + on_change * 0
//               )}
//             />
//           </directionalLight>
//           <raycaster ref={raycaster}/>
//           <mesh position={[target_pos.x,target_pos.y, target_pos.z] } ref={shadow_target}><sphereGeometry args={[1]}/><meshBasicMaterial color={0xff00000}/></mesh>
//           <group scale={1} rotation-x={-Math.PI / 2}  receiveShadow castShadow>
//             <SampleHouse
//               onEachProgress={(name, xhr) => {
//                 const new_xhr = {};
//                 new_xhr[name] = xhr;
//                 setEachXhr(new_xhr);
//               }}
//               // onClick={(event)=>{orbit_controls.current.target = event.point;}}sample_model.current?.clicked_meshs
//               ref={sample_model}
//             />
//           </group>
//           <CustomEffect>
//           {shadow_target.current}  
//           </CustomEffect>
//           <OrbitControls
//             minDistance={100}
//             maxDistance={1000}
//             target={[-42, 90, 258]}
//             enableDamping={true}
//             dampingFactor={0.15}
//             maxPolarAngle={Math.PI / 2}
//             screenSpacePanning={true}
//             onStart={()=>{if(start_count < 5){setStartCount(start_count + 1);}else{orbit_controls.current.target = target_pos ||  [-42, 90, 258];}}}
//             onChange={() => {
//               setOnChange(main_cam.current?.position?.y);
//               console.log(main_cam.current?.position?.y, orbit_controls.current?.target?.y )
//               if(sample_model.current){
//                 console.log(sample_model);
//                 const raycaster_result = raycaster.current?.intersectObject?.(sample_model.current.terrain, true) || [];
//                 if(raycaster_result.length > 0){
//                   setTargetPos(raycaster_result[0].point)
//                 }
//             }}}
//             ref={orbit_controls}
//             touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
//           >
            
//             <PerspectiveCamera
//               makeDefault
//               fov={fov}
//               aspect={size.width / size.height}
//               near={0.1*getDistance(main_cam.current?.position, orbit_controls.current?.target, 100)}
//               far={100*getDistance(main_cam.current?.position, orbit_controls.current?.target, 100)}
//               position={[-500-42, 500+90, -500+258]}
//               ref={main_cam}
//             ></PerspectiveCamera>
//           </OrbitControls>
//         </Canvas>
//       </Suspense>
//     </div>
//   );
// };

// export default DesignMap;
