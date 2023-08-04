import { erf } from "./MathFunction.js";
import { getDevelopedPilji } from "./getDevelopedPilji.js";
import { _getBldgScoreData } from "./_getBldgScoreData.js";

export function calculateScore(
  background_relation,
  bldg_state,
  region_no,
  region_data_table,
  origin_bldgscore_table,
  mean_data,
  stdev_data
) {
  const developedPiljiData = getDevelopedPilji(
    bldg_state,
    background_relation
  );
  const bldg_score_table = _getBldgScoreData(
    origin_bldgscore_table,
    region_data_table,
    region_no
  );
  
  const num_develop = developedPiljiData.length;
  const coeff_more = 0.025

  if (num_develop === 0){
    return {
      l: 0,
      b: 0,
      p: 0,
      l_converted: 0,
      b_converted: 0,
      p_converted: 0,
      tot_converted: 0,
    };
  } else {
    
  // 건물 나누기
    const n_bldg_raw = developedPiljiData.filter((x) => x.bldg_type === "normal"); // NORMAL 빌딩
    
    const isNBldgDeadOrAlive = (n_bldg) => {
      const isAllOverlapped = (arr) => {
        return arr.every((obj) => obj.overlapped.length > 0);
      } // 전부다 가려지면 true 

      return n_bldg.reduce((result, obj) => {
        const bldg_destiny = isAllOverlapped(obj.bldg_configuration) ? 'dead_bldg' : 'alive_bldg';
        result[bldg_destiny].push(obj);
        return result;
      }, { dead_bldg: [], alive_bldg: [] });
    }

    const n_bldg = isNBldgDeadOrAlive(n_bldg_raw).alive_bldg ; // NORMAL 살아남은 빌딩
    const n_bldg_covered = isNBldgDeadOrAlive(n_bldg_raw).dead_bldg ; // 가려진 건물. 나대지 점수산정시 포함시켜야 함.


    const b_bldg = developedPiljiData.filter((x) => x.bldg_type === "big"); // BIG 빌딩(x타입제외)
    const e_Bldg = developedPiljiData.filter(
      (x) => x.bldg_type === "" && x.overlapped[0] === undefined
    ); //개발만 한 필지 : bldg_type, overlapped 가 0
    const x_bldg = developedPiljiData.filter((x) => x.bldg_type === "big_x");

    const x_bldg_guid = x_bldg.map((x) => x.tguid); // x 건물 guid 어레이
    const x_next_Bldg = developedPiljiData.filter(
      (x) => x.bldg_type === "" && x.overlapped.some((y) => x_bldg_guid.includes(y))
    ); // x건물 옆필지

    
    // 개발적합도 계산 : piljiTypicalities x minAreaCoeffient
    function getDevelopmentFitness(x) {
      const min_area = 10; // 최소면적 파라미터 이거보다 낮으면 개발적합도 쭉떨어짐
      const min_area_pt = 356; // 평균 필지크기 0.5배 // 이거 이하면 필지 비정형도 고려
      if (x.area < min_area_pt){
      return (
        ((16 * x.area) / x.perimeter ** 2) *
        (1 + Math.exp(-(x.area - (min_area + 4))))
      );
      } else {
        return (1 + Math.exp(-(x.area - (min_area + 4))));
      }
    }

    // 지표점수 합산한 오브젝트 생성
    function getsumScores(scoresWithId) {
      const area_sum = scoresWithId.reduce(
        (sum, item) => sum + (item.area || 0),
        0
      );
      const lv_sum = scoresWithId.reduce((sum, item) => sum + (item.lv || 0), 0);
      const bv_sum = scoresWithId.reduce((sum, item) => sum + (item.bv || 0), 0);
      const pv_sum = scoresWithId.reduce((sum, item) => sum + (item.pv || 0), 0);
      return { area_sum, lv_sum, bv_sum, pv_sum };
    }

    //------------------------------------------------ n_bldg 점수계산 시작 -----------------------------------------------
    // nBldg 받아서 점수관련 오브젝트로 변환함수
    function getNBldgscoresWithId(n_bldg) {
      return n_bldg.map((x) => {
        const bldg_score = bldg_score_table.find(
          (scoreItem) => scoreItem.bldgName === x.bldg_name
        );

        const factor = x.area * getDevelopmentFitness(x);
        return {
          guid: x.guid,
          area: x.area,
          lv: bldg_score.landscapeValue * factor,
          bv: bldg_score.businessValue * factor,
          pv: bldg_score.publicValue * factor,
        };
      });
    }

    const n_bldgscores_with_id = getNBldgscoresWithId(n_bldg); // 필지 ID, 면적, 각종 지표점수 오브젝트
    const sum_n_bldgscores = getsumScores(n_bldgscores_with_id); // 면적과 지표점수 합산

  
    
    //------------------------------------------------ b_bldg 점수계산 시작 ---------------------------------------------

    function getBBldgscoresWithId(b_bldg) {
      return b_bldg.map((x) => {
        const bldgScore = bldg_score_table.find(
          (scoreItem) => scoreItem.bldgName === x.bldg_name
        );
        const areaType = bldgScore.modelType + "_area";
        const farea = x[areaType];

        
        return {
          guid: x.guid,
          area: farea,
          lv: bldgScore.landscapeValue * farea,
          bv: bldgScore.businessValue * farea,
          pv: bldgScore.publicValue * farea,
        };
      });
    }

    const b_bldgscores_with_id = getBBldgscoresWithId(b_bldg); // 필지 ID, 면적, 각종 지표점수 오브젝트
    const sum_b_bldgscores = getsumScores(b_bldgscores_with_id); // 면적과 지표점수 합산


    //------------------------------------------------ e_Bldg 점수계산 시작 ---------------------------------------------
    function getEBldgscoresWithId(e_Bldg) {
      return e_Bldg.map((x) => {
        const bldg_score = bldg_score_table.find(
          (scoreItem) => scoreItem.bldgName === "empty"
        );
        const area = x.area;

        return {
          guid: x.guid,
          area: area,
          lv: bldg_score.landscapeValue * area,
          bv: bldg_score.businessValue * area,
          pv: bldg_score.publicValue * area,
        };
      });
    }

    const eBldgscoresWithId = getEBldgscoresWithId(e_Bldg); // 필지 ID, 면적, 각종 지표점수 오브젝트
    const sum_e_bldgscores = getsumScores(eBldgscoresWithId); // 면적과 지표점수 합산


    //------------------------------------------------ x_bldg 점수계산 시작 ---------------------------------------------

    function GetXBldgscoresWithId(x_bldg) {
      return x_bldg.map((x) => {
        const bldg_score = bldg_score_table.find(
          (scoreItem) => scoreItem.bldgName === x.bldg_name
        );

        const factor = x.area * getDevelopmentFitness(x);
        return {
          guid: x.guid,
          area: x.area,
          lv: bldg_score.landscapeValue * factor,
          bv: bldg_score.businessValue * factor,
          pv: bldg_score.publicValue * factor,
        };
      });
    }

    const xBldgscoresWithId = GetXBldgscoresWithId(x_bldg); // 필지 ID, 면적, 각종 지표점수 오브젝트
    const sum_x_bldgscores = getsumScores(xBldgscoresWithId); // 면적과 지표점수 합산

    
    //------------------------------------------------ x_next_Bldg 점수계산 시작 ---------------------------------------------

    function GetXNextBldgscoresWithId(x_next_Bldg) {
      return x_next_Bldg.map((x) => {
        const bldg_score = bldg_score_table.find(
          (scoreItem) => scoreItem.bldgName === "greenhouse"
        );

        const factor = x.area * getDevelopmentFitness(x);
        return {
          guid: x.guid,
          area: x.area,
          lv: bldg_score.landscapeValue * factor,
          bv: bldg_score.businessValue * factor,
          pv: bldg_score.publicValue * factor,
        };
      });
    }

    const xNextBldgscoresWithId = GetXNextBldgscoresWithId(x_next_Bldg); // 필지 ID, 면적, 각종 지표점수 오브젝트
    const sum_xnext_bldgscores = getsumScores(xNextBldgscoresWithId); // 면적과 지표점수 합산

    const sum = [
      sum_n_bldgscores,
      sum_b_bldgscores,
      // sum_e_bldgscores,
      sum_x_bldgscores,
      sum_xnext_bldgscores,
    ].reduce(
      (result, obj) => ({
        area: result.area + obj.area_sum,
        lv: result.lv + obj.lv_sum,
        bv: result.bv + obj.bv_sum,
        pv: result.pv + obj.pv_sum,
      }),
      { area: 0, lv: 0, bv: 0, pv: 0 }
    );
    
  
    
    // 0~5 인 지표 기본점수
    // const l_score = (1+coeff_more*(1-num_develop))*sum.lv / sum.area;
    // const b_score = (1+coeff_more*(1-num_develop))*sum.bv / sum.area;
    // const p_score = (1+coeff_more*(1-num_develop))*sum.pv / sum.area;

    // 보정안한것
    const l_score = sum.lv / sum.area;
    const b_score = sum.bv / sum.area;
    const p_score = sum.pv / sum.area;


    //100점만점 환산점수로 변환
    function cumulativeDistributionFunction(x, mean_data, stdev_data) {
      const z = (x - mean_data) / stdev_data;
      return 0.5 * (1 + erf(z / Math.sqrt(2)));
    }

    const score_coeff = 0.4; // 가점비율
    const other_coeff = (1 - score_coeff) / 2;

    const landscapeComformity = cumulativeDistributionFunction(l_score, mean_data.l, stdev_data.l);
    const businessValue = cumulativeDistributionFunction(b_score, mean_data.b, stdev_data.b);
    const publicContribution = cumulativeDistributionFunction(p_score, mean_data.p, stdev_data.p);

    function getTotalDesignScore(lv, bv, pv, region_no, region_data_table) {
      let TotalDesignScore = 0;
      const extra_value = region_data_table.find((x) => x.name === region_no).factor;
      if (extra_value === "none") {
        TotalDesignScore = (lv + bv + pv) / 3;
      } else if (extra_value === "landscape") {
        TotalDesignScore =
          lv * score_coeff + bv * other_coeff + pv * other_coeff;
      } else if (extra_value === "public") {
        TotalDesignScore =
          lv * other_coeff + bv * other_coeff + pv * score_coeff;
      }
      return {
        l: l_score,
        b: b_score,
        p: p_score,
        l_converted: landscapeComformity,
        b_converted: businessValue,
        p_converted: publicContribution,
        tot_converted: TotalDesignScore,
      };
    }

    const final_score_set = getTotalDesignScore(
      landscapeComformity,
      businessValue,
      publicContribution,
      region_no,
      region_data_table
    );
    return final_score_set;
  }
};