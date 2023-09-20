import axios from "axios";
import { _API_URL, _transformScoreGraphData } from "./alias";
import { doCustomPolygonsIntersect } from "./doPolygonIntersect";
import { _getMasterplanScore } from "./JJ_new/_getMasterplanScore";
import { _isValidDevelopment } from "./JJ_new/_isValidDevelopment";
import { region_data_table } from "./JJ_new/region_data_table";
import { erf } from "./JJ_new/MathFunction";

export const getAsyncRankability = async (
  global_data,
  setGlobalData,
  global_var,
  setGlobalVar
) => {
  return axios
    .put(_API_URL + "ranked_region_polygon_data", {
      region_no: global_var.region_no,
    })
    .then((res) => {
      const my_polygon_data = _isValidDevelopment(
        global_data.background_relation,
        global_data.bldg_state,
        0.01,
        4,
        false,
        true
      );
      const center = (
        my_polygon_data.polygon?.[0]?.[0]?.reduce(
          (prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]],
          [0, 0]
        ) || [0, 0]
      ).map((e) => e / (my_polygon_data.polygon?.[0]?.[0]?.length || 1));
      setGlobalData({
        region_polygon: my_polygon_data.polygon?.[0]?.[0],
        region_position: [...center, my_polygon_data?.max_height],
      });
      const my_score = global_data.masterplan_score.tot_converted;
      // console.log(my_score_old)
      // const my_score = _getTotConvertedScore(
      //   global_data.masterplan_score,
      //   Number(global_var.region_no),
      //   ..._transformScoreGraphData(global_data.score_graph_data)
      // );
      let rankable = true;
      let min_score_to_be_ranked = 0;
      const overlapping_users = [];
      const overlapping_users_above_me = [];
      Object.entries(res.data || {}).forEach(([key, val]) => {
        const its_score = _getTotConvertedScore(
          { l: val.l, b: val.b, p: val.p },
          Number(global_var.region_no),
          ..._transformScoreGraphData(global_data.score_graph_data)
        );
        // console.log(my_score, its_score);
        if (
          doCustomPolygonsIntersect(
            val.region_polygon,
            my_polygon_data.polygon?.[0]?.[0]
          )
        ) {
          overlapping_users.push(key);
          if (
            doCustomPolygonsIntersect(
              val.region_polygon,
              my_polygon_data.polygon?.[0]?.[0]
            ) &&
            my_score <= its_score &&
            key !== global_var.user_name
          ) {
            rankable = false;
            min_score_to_be_ranked = Math.max(
              min_score_to_be_ranked,
              its_score
            );
            overlapping_users_above_me.push(key);
          }
        }
      });
      // console.log(overlapping_users, overlapping_users_above_me);
      return {
        rankable,
        min_score_to_be_ranked,
        overlapping_users,
        overlapping_users_above_me,
      };
    });
};

export const _getTotConvertedScore = (
  score,
  region_no,
  mean_data,
  stdev_data
) => {
  //100점만점 환산점수로 변환 (old)
  // function cumulativeDistributionFunction(x, mean_data, stdev_data) {
  //   const z = (x - mean_data) / stdev_data;
  //   return 0.5 * (1 + erf(z / Math.sqrt(2)));
  // }

    //100점만점 환산점수로 변환 (old)
  function cumulativeDistributionFunction(x, mean_data, stdev_data) {
    return erf(mean_data,stdev_data,x);
  }

  const score_coeff = 0.4; // 가점비율
  const other_coeff = (1 - score_coeff) / 2;

  const landscapeComformity = cumulativeDistributionFunction(
    score.l,
    mean_data.l,
    stdev_data.l
  );
  const businessValue = cumulativeDistributionFunction(
    score.b,
    mean_data.b,
    stdev_data.b
  );
  const publicContribution = cumulativeDistributionFunction(
    score.p,
    mean_data.p,
    stdev_data.p
  );

  function getTotalDesignScore(lv, bv, pv, region_no, region_data_table) {
    let TotalDesignScore = 0;
    const extra_value = region_data_table.find(
      (x) => x.name === region_no
    ).factor;
    if (extra_value === "none") {
      TotalDesignScore = (lv + bv + pv) / 3;
    } else if (extra_value === "landscape") {
      TotalDesignScore = lv * score_coeff + bv * other_coeff + pv * other_coeff;
    } else if (extra_value === "public") {
      TotalDesignScore = lv * other_coeff + bv * other_coeff + pv * score_coeff;
    }
    return TotalDesignScore;
  }

  return getTotalDesignScore(
    landscapeComformity,
    businessValue,
    publicContribution,
    region_no,
    region_data_table
  );
};
