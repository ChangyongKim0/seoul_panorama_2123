import { distance, polygonArea, polygonPerimeter } from "./MathFunction.js";

export const getDevelopedPilji = (bldg_state, background_relation) => {
  // 함수 :piljiRelation, guids어레이를 받아서 해당되는 guid를 가진 필지 폴리곤의 점데이터 추출 (NORMAL)
  function getPiljiPolygonFromGuids(source_data, guid) {
    const extracted_data = [];
    if (source_data.hasOwnProperty(guid)) {
      extracted_data.push(source_data[guid]["pilji_polygon"][0]);
      extracted_data.push(source_data[guid]["x_2_polygon"]);
      extracted_data.push(source_data[guid]["y_1_polygon"]);
      extracted_data.push(source_data[guid]["y_2_polygon"]);
      extracted_data.push(source_data[guid]["c_1_polygon"]);
      extracted_data.push(source_data[guid]["d_1_polygon"]);
    }
    return extracted_data;
  }
  //개발 필지의 guid, bldg_type, bldg_name를 value로 갖는 object의 array 생성하는 함수
  const developed_objects = [];

  for (const [tguid, obj] of Object.entries(bldg_state)) {
    // console.log(tguid, obj);
    if (obj.developed) {
      const { bldg_type, bldg_name, overlapped, bldg_configuration } = obj;

      // CY 추가
      const guids = background_relation.terrain[tguid];
      if (guids === undefined) {
        break;
      }

      // 재진 보완 필요
      const guid = guids[0];
      const polygons = getPiljiPolygonFromGuids(
        background_relation.pilji,
        guid
      );

      const area = polygonArea(polygons[0]);
      const x_2_area = polygonArea(polygons[1]);
      const y_1_area = polygonArea(polygons[2]);
      const y_2_area = polygonArea(polygons[3]);
      const c_1_area = polygonArea(polygons[4]);
      const d_1_area = polygonArea(polygons[5]);
      const perimeter = polygonPerimeter(polygons[0]);
      developed_objects.push({
        tguid,
        guid,
        area,
        bldg_configuration,
        x_2_area,
        y_1_area,
        y_2_area,
        c_1_area,
        d_1_area,
        perimeter,
        bldg_type,
        bldg_name,
        overlapped,
      });
    }
  }

  return developed_objects;
};

// testcode
// import { background_relation } from "./background_relation.js";
// import { bldg_state } from "./bldg_state.js";
// console.log(getDevelopedPilji(bldg_state, background_relation));
