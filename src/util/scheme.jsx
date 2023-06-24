const SCHEME = (
  <group>
    {/* load backround path */}
    <ThreeBackground url_list={[]}>
      <ThreeTerrain onClick={""}>
        <primitive></primitive>
      </ThreeTerrain>
      <ThreeRoad></ThreeRoad>
      <ThreeRamp></ThreeRamp>
      <ThreeStair></ThreeStair>
      <ThreePilji></ThreePilji>
    </ThreeBackground>
    {/* instancedmesh로 구현 */}
    <ThreeTree>
      <primitive></primitive>
    </ThreeTree>
    <ThreeBuilding>
      <primitive></primitive>
    </ThreeBuilding>
  </group>
);

const global_var = {
  region_id: "",
};

const bldg_state = {
  "33333-333": {
    developed: true,
    bldg_type: "normal",
    bldg_name: "공동주택",
    bldg_configuration: [
      {
        // svgNest에서는 4D rotation matrix 형태로 제공하므로,
        // translate-rotate 방식으로 할지 아예 matrix를 적용할지 추가 조사 필요
        translate: [100, 10, 300],
        rotate: 0.5,
        overlapped: ["33333-333-2"],
        overlaps: ["33333-333-3"],
      },
    ],
    overlapped: ["33333-333-2"],
  },
};
