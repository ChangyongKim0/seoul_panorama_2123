import { useReducer } from "react";
import { _center } from "../util/alias";
import { col_primary, col_g3 } from "../util/style";

const _convertPosListToPolygon = (
  pos_list,
  internal_pos_list,
  secondary = false
) => {
  internal_pos_list = internal_pos_list || [];
  let path = [];
  let lats = [];
  let lngs = [];
  let data_list = pos_list.split(" ");
  for (let i = 0; i < data_list.length; ) {
    let lat = parseFloat(data_list[i]);
    let lng = parseFloat(data_list[i + 1]);
    path.push(new window.kakao.maps.LatLng(lng, lat));
    lats.push(lat);
    lngs.push(lng);
    i += 2;
  }
  const int_paths = internal_pos_list.map((pos_list) => {
    let path = [];
    let data_list = pos_list.split(" ");
    for (let i = 0; i < data_list.length; ) {
      let lat = parseFloat(data_list[i]);
      let lng = parseFloat(data_list[i + 1]);
      path.push(new window.kakao.maps.LatLng(lng, lat));
      i += 2;
    }
    return path;
  });
  //   let center_value = _center(lats, lngs);
  //   let center = new window.kakao.maps.LatLng(center_value.y, center_value.x);
  let polygon;
  if (!secondary) {
    polygon = new window.kakao.maps.Polygon({
      // map: map, // 다각형을 표시할 지도 객체
      path: int_paths.length == 0 ? path : [path, ...int_paths],
      strokeWeight: 3,
      strokeColor: col_primary,
      strokeOpacity: 0.8,
      fillColor: col_primary,
      fillOpacity: 0.2,
    });
  } else {
    polygon = new window.kakao.maps.Polygon({
      // map: map, // 다각형을 표시할 지도 객체
      path: int_paths.length == 0 ? path : [path, ...int_paths],
      strokeWeight: 1,
      strokeColor: col_primary,
      strokeOpacity: 0.6,
      fillColor: col_primary,
      fillOpacity: 0.2,
      // strokeStyle: "dashed",
    });
  }
  // console.log(polygon);
  return polygon;
};

const reducePolygon = (state, action) => {
  const new_state = { ...state };
  switch (action.type) {
    case "set map":
      new_state.map = action.map;
      return new_state;
    case "add":
      // console.log(new_state.map);
      action.data.map((e) => {
        new_state.mounted_data[e.pnu] = _convertPosListToPolygon(
          e.pos_list,
          e.internal_pos_list
        );
        new_state.mounted_data[e.pnu].setMap(new_state.map);
      });
      return new_state;
    case "add secondary":
      // console.log(new_state.map);
      Object.keys(state.mounted_data).map((pnu) => {
        new_state.mounted_data[pnu].setMap(null);
      });
      action.data.map((e) => {
        new_state.secondary_mounted_data[e.pnu] = _convertPosListToPolygon(
          e.pos_list,
          e.internal_pos_list,
          true
        );
        new_state.secondary_mounted_data[e.pnu].setMap(new_state.map);
      });
      Object.keys(state.mounted_data).map((pnu) => {
        new_state.mounted_data[pnu].setMap(new_state.map);
      });
      return new_state;
    case "remove":
      action.pnu_list.map((pnu) => {
        new_state.mounted_data[pnu].setMap(null);
        delete new_state.mounted_data[pnu];
      });
      return new_state;
    case "remove secondary":
      action.pnu_list.map((pnu) => {
        new_state.secondary_mounted_data[pnu].setMap(null);
        delete new_state.secondary_mounted_data[pnu];
      });
      return new_state;
    case "remove all":
      Object.keys(state.mounted_data).map((pnu) => {
        new_state.mounted_data[pnu].setMap(null);
      });
      Object.keys(state.secondary_mounted_data).map((pnu) => {
        console.log(pnu);
        console.log(new_state.secondary_mounted_data[pnu]);
        new_state.secondary_mounted_data[pnu].setMap(null);
      });
      new_state.mounted_data = [];
      new_state.secondary_mounted_data = [];
      return new_state;
    default:
      return new_state;
  }
};

const usePolygon = () => {
  const [polygon, handlePolygon] = useReducer(reducePolygon, {
    map: null,
    mounted_data: [],
    secondary_mounted_data: [],
  });
  return [polygon, handlePolygon];
};

export default usePolygon;
