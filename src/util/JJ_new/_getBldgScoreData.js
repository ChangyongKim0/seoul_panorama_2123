export function _getBldgScoreData(
  region_no,
  origin_bldgscore_table,
  region_data_table
) {
  const region_num = region_no;

  // 리전 넘버에 맞게 원형점수표 수정하여 수정점수표 획득
  const region_data = region_data_table.find(
    (region) => region.name === region_num
  );
  const converted_bldgscore_table = JSON.parse(
    JSON.stringify(origin_bldgscore_table)
  );

  if (region_data) {
    const { elevation, direction } = region_data;

    converted_bldgscore_table.forEach((building) => {
      if (
        building.minus.includes(elevation) &&
        building.minus.includes(direction)
      ) {
        building.landscapeValue = Math.max(0, building.landscapeValue - 1);
        building.businessValue = Math.max(0, building.businessValue - 1);
        building.publicValue = Math.max(0, building.publicValue - 1);
      } else if (
        building.minus.includes(elevation) ||
        building.minus.includes(direction)
      ) {
        building.landscapeValue = Math.max(0, building.landscapeValue - 0.5);
        building.businessValue = Math.max(0, building.businessValue - 0.5);
        building.publicValue = Math.max(0, building.publicValue - 0.5);
      }
    });
  }
  return converted_bldgscore_table;
}

// testcode
// import { region_data_table } from "./region_data_table.js";
// import { origin_bldgscore_table } from "./origin_bldgscore_table.js";
// const region_no = 1; // 숫자여야함
// console.log(
//   _getBldgScoreData(region_no, origin_bldgscore_table, region_data_table)
// );
// setTimeout(() => {
//   console.log("debugger finished");
// }, 1000000);
