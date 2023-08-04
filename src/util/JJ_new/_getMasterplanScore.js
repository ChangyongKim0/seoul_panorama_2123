import { calculateScore } from "./calculateScore.js";
import { region_data_table } from "./region_data_table.js";
import { origin_bldgscore_table } from "./origin_bldgscore_table.js";

export const _getMasterplanScore = (
  background_relation,
  bldg_state,
  region_no = 1,
  mean_data = { l: 2.5, b: 2.5, p: 2.5 },
  stdev_data = { l: 1, b: 1, p: 1 }
) => {
  return calculateScore(
    background_relation,
    bldg_state,
    region_no,
    region_data_table,
    origin_bldgscore_table,
    mean_data,
    stdev_data
  );
};

// 테스트용 import
// import { background_relation } from "./background_relation.js";
// import { bldg_state } from "./bldg_state.js";
// const region_no = 1// 숫자여야함

// 테스트 코드
// const start_time = Date.now();
// console.log(
//   _getMasterplanScore(
//     background_relation,
//     bldg_state,
//     region_no,
//     { l: 2, b: 3, p: 2 },
//     { l: 2, b: 1, p: 3 }
//   )
// );
// const finish_time = Date.now();
// console.log(`OPERATING TIME : ${finish_time - start_time}ms`);

// setTimeout(() => {
//   console.log("debugger stopped");
// }, 100000);
