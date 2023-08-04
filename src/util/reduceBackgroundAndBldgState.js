import {
  _applyMatrix4OnPolygon,
  _polygonOverlaps,
  difference,
  duplicates,
  multipleUnion,
  union,
} from "./alias";
import * as THREE from "three";
import { LAYER_PROPERTIES } from "../threejs_component/ThreeBackground";
import { getErrorPopupProperties } from "./getErrorPopupProperties";
import { MODELS_TO_LOAD } from "./locateBldgsInPilji";
import { cloneDeep } from "lodash";

const reduceBackgroundAndBldgState = (global_data) => {
  if (
    global_data.background_state &&
    global_data.bldg_state &&
    global_data.background_relation
  ) {
    const data_to_update = {
      background_state: { ...global_data.background_state },
      bldg_state: { ...global_data.bldg_state },
    };
    const action = global_data?.curr_action || {};
    switch (action?.type) {
      case "develop":
        data_to_update.bldg_state[action.guid].developed = true;
        break;
      case "undevelop":
        data_to_update.bldg_state[action.guid].developed = false;
        break;
      case "build":
        switch (action.bldg_type) {
          case "big":
          case "big_x":
            if (!global_data?.waiting_clicking_pilji) {
              if (
                _isBuildable(
                  global_data.background_relation,
                  action.guid,
                  action.bldg_model_type
                )
              ) {
                _arrangeOverlappedWhenUnbuildBigType(
                  data_to_update,
                  action.guid
                );
                _arranageBldgStateWhenBuildBigType(
                  data_to_update,
                  global_data.background_relation,
                  action.guid,
                  action.bldg_type,
                  action.bldg_model_type,
                  action.bldg_name
                );
              } else {
                return {
                  error: "hell_to_configurate",
                };
              }
            }
            break;
          case "normal":
            if (action.svgNest_completed) {
              const temp_data_to_update = cloneDeep(data_to_update);
              if (action.output.placed > 0) {
                _arrangeBldgStateWhenSvgNestCompleted(
                  temp_data_to_update,
                  global_data.background_relation,
                  action.guid,
                  action.bldg_type,
                  action.bldg_model_type,
                  action.bldg_name,
                  action.output
                );
                _arrangeOverlappedWhenBuildNormalType(
                  temp_data_to_update,
                  global_data.background_relation,
                  action.guid,
                  action.bldg_type,
                  action.bldg_model_type,
                  action.bldg_name,
                  action.output
                );
                if (
                  temp_data_to_update.bldg_state?.[
                    action.guid
                  ]?.bldg_configuration?.filter(
                    (e) => e?.overlapped?.length === 0
                  )?.length === 0
                ) {
                  return { error: "too_small_pilji_by_overlapping" };
                }
                data_to_update.background_state =
                  temp_data_to_update.background_state;
                data_to_update.bldg_state = temp_data_to_update.bldg_state;
              } else {
                return {
                  error: "too_small_pilji",
                };
              }
            }
        }
        break;
      case "unbuild":
        _arrangeOverlappedWhenUnbuildBigType(data_to_update, action.guid);
    }
    //   const terrain_guid = getGuid(global_data.clicked_meshs[0]);
    //   const new_terrain_data = global_data.background_state?.terrain || {};
    //   new_terrain_data[terrain_guid] = false;
    //   const data_to_update = {
    //     background_state: {
    //       ...global_data.background_state,
    //       terrain: new_terrain_data,
    //     },
    //     bldg_state: {
    //       ...global_data.bldg_state,
    //     },
    //   };
    //   data_to_update.bldg_state[terrain_guid].developed =
    //     !data_to_update.bldg_state[terrain_guid].developed;
    //   setGlobalData(data_to_update);
    _arrangeBackgroundStateByTerrainState(
      data_to_update,
      global_data.background_relation
    );
    return data_to_update;
  }
  return {};
};

const _arrangeOverlappedWhenBuildNormalType = (
  data,
  background_relation,
  terrain_guid,
  bldg_type,
  bldg_model_type,
  bldg_name,
  svgNest_output
) => {
  const overlapped = data.bldg_state[terrain_guid].overlapped;
  overlapped.forEach((e) => {
    if (e !== terrain_guid) {
      data.bldg_state[terrain_guid].bldg_configuration.forEach((_, idx) => {
        const pilji_list = background_relation.terrain[e];
        const my_polygon =
          MODELS_TO_LOAD?.[data.bldg_state[terrain_guid].bldg_name]?.filter(
            (e2) =>
              e2.name ===
              data.bldg_state[terrain_guid].bldg_configuration[idx].name
          )?.[0]?.polygon || [];
        const rotated_polygon = _applyMatrix4OnPolygon(
          my_polygon,
          data.bldg_state[terrain_guid].bldg_configuration[idx]?.transform
        );
        const this_polygon = pilji_list.reduce((prev, pilji_guid) => {
          if (prev.length === 0) {
            const new_polygon =
              background_relation.pilji[pilji_guid]?.[
                data.bldg_state[e]?.bldg_model_type + "_polygon"
              ] || [];
            if (new_polygon.length > 0) {
              return new_polygon;
            }
          }
          return prev;
        }, []);
        if (_polygonOverlaps(this_polygon, rotated_polygon)) {
          data.bldg_state[terrain_guid].bldg_configuration[idx].overlapped.push(
            e
          );
        }
      });
    }
  });
};

const _arrangeOverlappedWhenUnbuildBigType = (data_to_update, action_guid) => {
  data_to_update.bldg_state[action_guid].developed = true;
  data_to_update.bldg_state[action_guid].bldg_name = "";
  data_to_update.bldg_state[action_guid].bldg_type = "";
  data_to_update.bldg_state[action_guid].bldg_model_type = "";
  data_to_update.bldg_state[action_guid].bldg_configuration.forEach((e) => {
    e.overlaps.forEach((terrain_guid) => {
      if (data_to_update.bldg_state[terrain_guid]) {
        data_to_update.bldg_state[terrain_guid].overlapped = [
          ...difference(
            new Set(data_to_update.bldg_state[terrain_guid].overlapped),
            new Set([action_guid])
          ),
        ];
        data_to_update.bldg_state[terrain_guid].bldg_configuration.forEach(
          (_, idx) =>
            (data_to_update.bldg_state[terrain_guid].bldg_configuration[
              idx
            ].overlapped = [
              ...difference(
                new Set(
                  data_to_update.bldg_state[terrain_guid].bldg_configuration[
                    idx
                  ].overlapped
                ),
                new Set([action_guid])
              ),
            ])
        );
      }
    });
  });
  data_to_update.bldg_state[action_guid].bldg_configuration = [];
};

const _arrangeBldgStateWhenSvgNestCompleted = (
  data,
  background_relation,
  terrain_guid,
  bldg_type,
  bldg_model_type,
  bldg_name,
  svgNest_output
) => {
  data.bldg_state[terrain_guid].bldg_name = bldg_name;
  data.bldg_state[terrain_guid].bldg_type = bldg_type;
  data.bldg_state[terrain_guid].bldg_model_type = bldg_model_type;
  // console.log(svgNest_output);1
  const transformations = svgNest_output.transformations.transformations;
  const configurations = Object.keys(transformations).map((key) => ({
    name: key.split("_")[0],
    transform: transformations[key],
    overlapped: [],
    overlaps: [],
  }));
  data.bldg_state[terrain_guid].bldg_configuration = configurations;
  console.log(data.bldg_state[terrain_guid]);
};

const _isBuildable = (background_relation, terrain_guid, bldg_model_type) => {
  const pilji_guids = background_relation.terrain[terrain_guid];
  let bldg_count = 0;
  pilji_guids.forEach((pilji_guid) => {
    ["model", "wall", "roof"].forEach((type) => {
      if (
        background_relation.pilji[pilji_guid][bldg_model_type + "_" + type]
          ?.length > 0
      ) {
        bldg_count += 1;
      }
    });
  });
  return bldg_count > 0;
};

const _arranageBldgStateWhenBuildBigType = (
  data,
  background_relation,
  terrain_guid,
  bldg_type,
  bldg_model_type,
  bldg_name
) => {
  const { pilji_guids, my_polygon } = background_relation.terrain[
    terrain_guid
  ].reduce(
    (prev, pilji_guid) => {
      if (prev.pilji_guids.length === 0) {
        const new_polygon =
          background_relation.pilji[pilji_guid]?.[
            bldg_model_type + "_polygon"
          ] || [];
        if (new_polygon.length > 0) {
          return { pilji_guids: [pilji_guid], my_polygon: new_polygon };
        }
      }
      return prev;
    },
    { pilji_guids: [], my_polygon: [] }
  );
  const overlaps = [
    ...multipleUnion(
      pilji_guids.map(
        (e) =>
          new Set(
            background_relation.pilji?.[e]?.[
              bldg_model_type + "_overlaps"
            ]?.map((e2) => background_relation.pilji[e2].terrain)
          )
      )
    ),
  ];
  data.bldg_state[terrain_guid].bldg_name = bldg_name;
  data.bldg_state[terrain_guid].bldg_model_type = bldg_model_type;
  data.bldg_state[terrain_guid].bldg_type = bldg_type;
  data.bldg_state[terrain_guid].bldg_configuration = [
    { overlapped: [], transform: new THREE.Matrix4(), overlaps },
  ];

  // big_x는 주변 무조건 개발시킴
  if (bldg_type === "big_x") {
    overlaps.forEach((e) => {
      if (data.bldg_state[e]) {
        data.bldg_state[e].developed = true;
      }
    });
  }
  console.log(my_polygon);
  overlaps.forEach((e) => {
    if (data.bldg_state[e]) {
      const it_overlapped_by = data.bldg_state[e].overlapped;
      data.bldg_state[e].overlapped = [
        ...union(it_overlapped_by, [terrain_guid]),
      ];
    }
  });
  const overlaps_and_overlapped = [
    ...union(
      new Set(overlaps),
      multipleUnion(
        overlaps.map((guid) => data.bldg_state[guid]?.overlapped || [])
      )
    ),
  ];
  overlaps_and_overlapped.forEach((e) => {
    if (e !== terrain_guid && data.bldg_state[e]) {
      data.bldg_state[e].bldg_configuration.forEach((_, idx) => {
        let this_polygon = [];
        if (data.bldg_state[e].bldg_type === "normal") {
          this_polygon =
            MODELS_TO_LOAD?.[data.bldg_state[e].bldg_name]?.filter(
              (e2) =>
                e2.name === data.bldg_state[e].bldg_configuration[idx].name
            )?.[0]?.polygon || [];
        } else {
          const pilji_list = background_relation.terrain[e];
          this_polygon = pilji_list.reduce((prev, pilji_guid) => {
            if (prev.length === 0) {
              const new_polygon =
                background_relation.pilji[pilji_guid]?.[
                  data.bldg_state[e].bldg_model_type + "_polygon"
                ] || [];
              if (new_polygon.length > 0) {
                return new_polygon;
              }
            }
            return prev;
          }, []);
          console.log(this_polygon);
        }
        const rotated_polygon = _applyMatrix4OnPolygon(
          this_polygon,
          data.bldg_state[e].bldg_configuration[idx]?.transform
        );
        if (_polygonOverlaps(rotated_polygon, my_polygon)) {
          if (data.bldg_state[e].bldg_type === "normal") {
            data.bldg_state[e].bldg_configuration[idx].overlapped.push(
              terrain_guid
            );
          } else {
            _arrangeOverlappedWhenUnbuildBigType(data, e);
          }
        }
        console.log(
          rotated_polygon,
          _polygonOverlaps(rotated_polygon, my_polygon)
        );
      });
    }
  });

  // console.log(bldg_name);
};

const _arrangeBackgroundStateByTerrainState = (data, background_relation) => {
  const background_state = data.background_state;
  const bldg_state = data.bldg_state;
  background_state.terrain = Object.keys(bldg_state).filter(
    (key) => bldg_state[key].developed
  );
  const developed_pilji_list = background_state.terrain.reduce(
    (prev, key) => [...prev, ...background_relation.terrain[key]],
    []
  );
  const adjacent_pilji_list = [
    ...difference(
      multipleUnion([
        multipleUnion(
          developed_pilji_list.map(
            (e) => background_relation.pilji[e].adjacent_pilji_x
          )
        ),
        multipleUnion(
          developed_pilji_list.map(
            (e) => background_relation.pilji[e].adjacent_pilji_y_front
          )
        ),
        multipleUnion(
          developed_pilji_list.map(
            (e) => background_relation.pilji[e].adjacent_pilji_y_back
          )
        ),
      ]),
      new Set(developed_pilji_list)
    ),
  ];
  const adjacent_terrain_wall_list = [
    ...union(
      difference(
        background_relation.terrain_wall_list_of_mound,
        multipleUnion(
          developed_pilji_list.map(
            (e) => background_relation.pilji[e].terrain_wall
          )
        )
      ),
      multipleUnion(
        adjacent_pilji_list.map(
          (e) => background_relation.pilji[e].terrain_wall
        )
      )
    ),
  ];
  const adjacent_road_list = [
    ...multipleUnion([
      multipleUnion(
        developed_pilji_list.map(
          (e) => background_relation.pilji[e].adjacent_road_front
        )
      ),
      multipleUnion(
        developed_pilji_list.map(
          (e) => background_relation.pilji[e].adjacent_road_back
        )
      ),
    ]),
  ];
  const developed_pilji_list_by_big = [
    ...multipleUnion(
      Object.keys(bldg_state)
        .filter((e) => bldg_state[e].overlapped.length > 0)
        .map((e2) => background_relation.terrain[e2])
    ),
  ];

  const dup_ramp_list = [
    ...difference(
      duplicates(
        developed_pilji_list.map(
          (e) => background_relation.pilji[e].adjacent_ramp
        )
      ),
      duplicates(
        developed_pilji_list_by_big.map(
          (e) => background_relation.pilji[e].adjacent_ramp
        )
      )
    ),
  ];
  const dup_stair_list = [
    ...difference(
      duplicates(
        developed_pilji_list.map(
          (e) => background_relation.pilji[e].adjacent_stair
        )
      ),
      duplicates(
        developed_pilji_list_by_big.map(
          (e) => background_relation.pilji[e].adjacent_stair
        )
      )
    ),
  ];
  background_state.pilji = developed_pilji_list;
  background_state.terrain_wall = adjacent_terrain_wall_list;
  background_state.road = adjacent_road_list;
  background_state.ramp = dup_ramp_list;
  background_state.stair = dup_stair_list;
  const big_bldg_list = Object.keys(bldg_state).reduce(
    (prev, key) =>
      bldg_state[key].bldg_type.includes("big")
        ? [
            ...prev,
            {
              terrain_guid: key,
              bldg_name: bldg_state[key].bldg_name,
              bldg_model_type: bldg_state[key].bldg_model_type,
            },
          ]
        : prev,
    []
  );
  const arranged_big_bldg_data = {};
  big_bldg_list.forEach((e) => {
    if (arranged_big_bldg_data[e.bldg_model_type] === undefined) {
      arranged_big_bldg_data[e.bldg_model_type] = {};
    }
    const pilji_guids = background_relation.terrain[e.terrain_guid];
    arranged_big_bldg_data[e.bldg_model_type][e.terrain_guid] = {
      bldg_name: e.bldg_name,
      terrain_guid: e.terrain_guid,
      pilji_guids,
    };
  });

  LAYER_PROPERTIES.forEach((e) => {
    if (e.bldg) {
      data.background_state[e.data_name] = {};
    }
  });
  // console.log(arranged_big_bldg_data);
  Object.keys(arranged_big_bldg_data).forEach((bldg_model_type) => {
    // console.log(bldg_model_type);
    ["wall", "roof", "model"].forEach((type) => {
      if (data.background_state[bldg_model_type + "_" + type]) {
        const type_guid_list = Object.keys(
          arranged_big_bldg_data[bldg_model_type]
        ).reduce((prev, terrain_guid) => {
          const pilji_guids =
            arranged_big_bldg_data[bldg_model_type][terrain_guid].pilji_guids;
          const each_type_guid_list = pilji_guids.reduce((prev, pilji_guid) => {
            const type_guid =
              background_relation.pilji[pilji_guid][
                bldg_model_type + "_" + type
              ];
            //한 지형에 여러개면 버리기
            if (type_guid?.length > 0 && prev?.length === 0) {
              console.log(type_guid);
              return [
                ...prev,
                {
                  type_guid,
                  texture:
                    arranged_big_bldg_data[bldg_model_type][terrain_guid]
                      .bldg_name +
                    "_" +
                    type,
                  ...arranged_big_bldg_data[bldg_model_type][terrain_guid],
                },
              ];
            }
            return prev;
          }, []);
          return [...prev, ...each_type_guid_list];
        }, []);

        const type_guid_data = {};

        type_guid_list.forEach((e) => {
          type_guid_data[e.type_guid] = e;
        });
        data.background_state[bldg_model_type + "_" + type] = type_guid_data;
      }
    });
  });

  // console.log(background_relation);

  // console.log(developed_pilji_list);
  // console.log(adjacent_terrain_wall_list);
  // const adjacent_pilji_list =
};

export default reduceBackgroundAndBldgState;
