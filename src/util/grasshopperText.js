import { getS3URL } from "../hooks/useS3";
import axios from "axios";

export const getRegionDataFromGrasshopperText = (txt) => {
  const new_list = [];

  txt
    .split("\n")
    .map((e) => e.trim())
    .forEach((e, idx) => {
      switch (e[0]) {
        case "{":
          new_list.push({});
          break;
        case "0":
          new_list[new_list.length - 1]["region_name"] = e.split(". ")[1];
          break;
        case "1":
          new_list[new_list.length - 1]["guid"] = e.split(". ")[1];
          break;
        case "2":
          new_list[new_list.length - 1]["center"] =
            _getVectorCompFromGrasshopperText(e);
          break;
        case "3":
          new_list[new_list.length - 1]["width"] = Number(e.split(". ")[1]);
          break;
        case "4":
          new_list[new_list.length - 1]["height"] = Number(e.split(". ")[1]);
          break;
      }
    });

  return new_list.reduce((prev, curr) => {
    const new_data = { ...prev };
    new_data[curr.guid] = curr;
    return new_data;
  }, {});
};

// 결과물을 data/region_data.json에 저장하세요.
// console.log(JSON.stringify(getRegionDataFromGrasshopperText(txt)));

export const getGridIsovectorsFromGrasshopperText = (txt) => {
  const new_list = [];

  txt
    .split("\n")
    .map((e) => e.trim())
    .forEach((e, idx) => {
      switch (e[0]) {
        case "{":
          if (e.split(";")?.[1]?.[0] === "0") {
            new_list.push([]);
          }
          new_list[new_list.length - 1].push([523.259018, 0, 523.259018]);
          break;
        case "0":
          new_list[new_list.length - 1][
            new_list[new_list.length - 1].length - 1
          ] = _getVectorCompFromGrasshopperText(e);
          break;
      }
    });

  return new_list;
};

const _getVectorCompFromGrasshopperText = (txt) => {
  return txt
    .split(". {")[1]
    .split("}")[0]
    .split(",")
    .map((e) => {
      if (isNaN(Number(e.trim()))) {
        console.log(e);
      }
      return Number(e.trim());
    });
};

// model | wall | roof
const REGION_GUID_TYPE = {
  region_no: { file_name: "개발구역", data_type: "number" },
  d_1_overlaps: { file_name: "마름모 겹침 필지", data_type: "guids" },
  d_1_wall: { file_name: "마름모 벽", data_type: "guid" },
  d_1_polygon: { file_name: "마름모 사영 구역", data_type: "vectors" },
  d_1_roof: { file_name: "마름모 지붕", data_type: "guid" },
  terrain_wall: { file_name: "원지형 벽", data_type: "guids" },
  terrain_outline: { file_name: "원지형 외곽선", data_type: "guids" },
  terrain: { file_name: "원지형", data_type: "guid" },
  pilji: { file_name: "필지 메인", data_type: "guid" },
  pilji_top: { file_name: "필지 벡터", data_type: "vector" },
  pilji_polygon: { file_name: "필지 사영 경계", data_type: "vectors" },
  adjacent_road_back: { file_name: "필지 인접 뒷 도로", data_type: "guids" },
  adjacent_road_front: { file_name: "필지 인접 앞 도로", data_type: "guids" },
  adjacent_stair: { file_name: "계단", data_type: "guids" },
  adjacent_ramp: { file_name: "램프", data_type: "guids" },
  pilji_isovector: { file_name: "필지 ISO 벡터", data_type: "vector" },
  adjacent_pilji_x: { file_name: "필지 X인접", data_type: "guids" },
  adjacent_pilji_y_back: {
    file_name: "필지 Y인접 뒷 필지",
    data_type: "guids",
  },
  adjacent_pilji_y_front: {
    file_name: "필지 Y인접 앞 필지",
    data_type: "guids",
  },
  x_1_overlaps: { file_name: "X 공통 겹침 필지", data_type: "guids" },
  x_1_model: { file_name: "X1", data_type: "guid" },
  x_1_polygon: { file_name: "X1, X2 사영 구역", data_type: "vectors" },
  x_2_overlaps: { file_name: "X 공통 겹침 필지", data_type: "guids" },
  x_2_model: { file_name: "X2", data_type: "guid" },
  x_2_polygon: { file_name: "X1, X2 사영 구역", data_type: "vectors" },
  x_3_overlaps: { file_name: "X 공통 겹침 필지", data_type: "guids" },
  x_3_wall: { file_name: "X3 벽", data_type: "guid" },
  x_3_roof: { file_name: "X3 지붕", data_type: "guid" },
  x_3_polygon: { file_name: "X3 사영 구역", data_type: "vectors" },
  y_1_overlaps: { file_name: "Y1 겹침 필지", data_type: "guids" },
  y_1_wall: { file_name: "Y1 벽", data_type: "guid" },
  y_1_roof: { file_name: "Y1 지붕", data_type: "guid" },
  y_1_polygon: { file_name: "Y1 사영 구역", data_type: "vectors" },
  y_2_overlaps: { file_name: "Y2 겹침 필지", data_type: "guids" },
  y_2_wall: { file_name: "X1", data_type: "guid" },
  y_2_roof: { file_name: "X1", data_type: "guid" },
  y_2_polygon: { file_name: "Y2 사영 구역", data_type: "vectors" },
};

export const getAsyncRegionGuidDataFromS3RegionGuid = async (region_name) => {
  let new_data = {};
  for (let key in REGION_GUID_TYPE) {
    const res = await axios.get(
      getS3URL(
        "",
        `design/region_guid/${region_name}/${REGION_GUID_TYPE[key].file_name}.txt`
      )
    );
    new_data[key] = getRegionGuidDataFromGrasshopperText(
      res.data,
      REGION_GUID_TYPE[key].data_type
    );
  }
  const keys = Object.keys(new_data);
  const pilji = {};
  const terrain = {};
  new_data.pilji.forEach((guid, idx) => {
    pilji[guid] = {};
    if (terrain[new_data.terrain[idx]] === undefined) {
      terrain[new_data.terrain[idx]] = [];
    }
    terrain[new_data.terrain[idx]].push(guid);
    keys.forEach((key) => {
      pilji[guid][key] = new_data[key][idx];
    });
  });
  return { pilji, terrain };
};

// guid | guids | vector | number
export const getRegionGuidDataFromGrasshopperText = (txt, type) => {
  let new_list = [];
  txt
    .split("\n")
    .map((e) => e.trim())
    .forEach((e, idx) => {
      switch (e[0]) {
        case undefined:
          break;
        case "{":
          new_list.push([]);
          break;
        default:
          switch (type) {
            case "guid":
              new_list[new_list.length - 1] = e.split(". ")[1];
              break;
            case "guids":
              new_list[new_list.length - 1].push(e.split(". ")[1]);
              break;
            case "vector":
              new_list[new_list.length - 1] =
                _getVectorCompFromGrasshopperText(e);
              break;
            case "vectors":
              new_list[new_list.length - 1].push(
                _getVectorCompFromGrasshopperText(e)
              );
              break;
            case "number":
              new_list[new_list.length - 1] = Number(e.split(". ")[1]);
              break;
          }
      }
    });

  return new_list;
};
