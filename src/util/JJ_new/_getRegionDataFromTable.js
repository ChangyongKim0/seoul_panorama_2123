import { getFormattedBldgScoreDataByRegionNo } from "./getFormattedBldgScoreDataByRegionNo";
import { region_data_table } from "./region_data_table";

const translation_data = {
  low: { eng: "L. Elev.", kor: "저지대" },
  high: { eng: "H. Elev.", kor: "고지대" },
  north: { eng: "N. Slope", kor: "북사면" },
  south: { eng: "S. Slope", kor: "남사면" },
  public: {
    eng: "Public Incentive",
    kor: "공공 가점 구역",
    illust_kor: `여기는 '공공 기여성' 점수에 
    가점을 주는 구역이예요.`,
    illust_eng: `Extra points are given 
    for 'Public Contribution'.`,
  },
  landscape: {
    eng: "Landscape Incentive",
    kor: "경관 가점 구역",
    illust_kor: `여기는 '경관 친화성' 점수에 
    가점을 주는 구역이예요.`,
    illust_eng: `Extra points are given 
    for 'Landscape Affinity'.`,
  },
  none: {
    eng: "No Special Incentive",
    kor: "가점 미부여 구역",
    illust_kor: `여기는 특정 점수에 가점이 없는 
    일반 구역이예요.`,
    illust_eng: `No additional points 
    for a specific score.`,
  },
};

export const _getRegionDataFromTable = (region_no) => {
  const data = {};
  const filtered_data = region_data_table.filter(
    (e) => e.name === Number(region_no)
  );
  if (filtered_data.length > 0) {
    Object.keys(filtered_data[0]).forEach((key) => {
      if (translation_data[filtered_data[0][key]]) {
        data[key] = translation_data[filtered_data[0][key]];
      } else {
        data[key] = filtered_data[0][key];
      }
    });
  }
  data.bldg_score_data = getFormattedBldgScoreDataByRegionNo(
    region_no,
    translation_data
  );
  return data;
};
