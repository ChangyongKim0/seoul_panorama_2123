import { _getBldgScoreData } from "./_getBldgScoreData";
import { origin_bldgscore_table } from "./origin_bldgscore_table";
import { region_data_table } from "./region_data_table";

export const getFormattedBldgScoreDataByRegionNo = (
  region_no,
  translation_data
) => {
  const bldg_score_data = _getBldgScoreData(
    region_no,
    origin_bldgscore_table,
    region_data_table
  );
  const formatted_bldg_score_data = {};
  bldg_score_data.forEach((e) => {
    formatted_bldg_score_data[e.bldgName] = {
      b: e.businessValue || 0,
      l: e.landscapeValue || 0,
      p: e.publicValue || 0,
      minus: e.minus.map(
        (type) => translation_data[type] || { eng: "", kor: "" }
      ),
    };
  });
  return formatted_bldg_score_data;
};
