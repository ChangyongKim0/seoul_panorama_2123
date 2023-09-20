import PolygonClipping from "polygon-clipping";

const rawAreaOfPolygon = (polygon) => {
  let area = 0;
  polygon.forEach(
    (vertex, idx) =>
      (area +=
        (polygon[(idx + 1) % polygon.length][0] - vertex[0]) *
        (polygon[(idx + 1) % polygon.length][1] + vertex[1]))
  );
  return area;
};

const isClockwise = (polygon) => {
  return rawAreaOfPolygon(polygon) > 0;
};

const areaOfPolygon = (polygon) => {
  return Math.abs(rawAreaOfPolygon(polygon));
};

const offsetPolygon = (polygon, offset) => {
  const new_polygon = [];
  const norm_vectors = [];
  const clockwise_factor = isClockwise(polygon) ? -1 : 1;
  polygon.forEach((vertex, idx) => {
    const edge_vector = polygon[(idx + 1) % polygon.length].map(
      (e2, idx2) => e2 - vertex[idx2]
    );
    if (edge_vector[0] !== 0 || edge_vector[1] !== 0) {
      const rotated_vector = [
        clockwise_factor * edge_vector[1],
        -1 * clockwise_factor * edge_vector[0],
      ];
      new_polygon.push(vertex);
      norm_vectors.push(
        rotated_vector.map(
          (e) => e / Math.sqrt(rotated_vector[0] ** 2 + rotated_vector[1] ** 2)
        )
      );
    }
  });
  return new_polygon.map((vertex, idx) => {
    const tot_norm_vector = norm_vectors[idx].map(
      (e2, idx2) =>
        e2 +
        norm_vectors[(idx + norm_vectors.length - 1) % norm_vectors.length][
          idx2
        ]
    );
    return vertex.map((e2, idx2) => e2 + offset * tot_norm_vector[idx2]);
  });
};

const unionPolygon = (multipolygons, tolerance = 0, threshold_area = 0) => {
  if (multipolygons.length === 0) {
    return [];
  }
  const new_multipolygons = multipolygons.map((multipolygon) =>
    multipolygon.map((polygon, idx) =>
      offsetPolygon(polygon, tolerance * (idx === 0 ? 1 : -1))
    )
  );
  return PolygonClipping.union(...new_multipolygons).map((e) =>
    e.filter((e2) => areaOfPolygon(e2) > threshold_area)
  );
};

const isSimplyConnected = (multipolygons) => {
  if (multipolygons.length === 0) {
    return true;
  }
  if (multipolygons.length === 1 && multipolygons[0].length === 1) {
    return true;
  }
  return false;
};

const getDevelopedPolygonsFromBldgState = (
  background_relation,
  bldg_state,
  get_detailed_data = false
) => {
  const polygons = [];
  const height_list = [];
  Object.keys(bldg_state).forEach((key) => {
    const pilji_guid = background_relation.terrain[key]?.[0];
    if (
      bldg_state[key]?.developed &&
      pilji_guid
      // &&
      // (bldg_state[key]?.bldg_configuration?.length === 0 ||
      //   bldg_state[key]?.bldg_configuration?.reduce(
      //     (prev, curr) => (curr?.overlapped?.length === 0 ? true : prev),
      //     false
      //   ))
    ) {
      polygons.push(background_relation.pilji[pilji_guid]?.terrain_polygon);
      height_list.push(
        background_relation.pilji[pilji_guid]?.pilji_height || 250
      );
    }
    if (bldg_state[key]?.bldg_type?.split("_").includes("big")) {
      if (background_relation.terrain[key]) {
        polygons.push([
          background_relation.terrain[key].reduce((prev, pilji_guid) => {
            const polygon =
              background_relation.pilji[pilji_guid]?.[
                bldg_state[key]?.bldg_model_type + "_polygon"
              ];
            if (prev.length === 0) {
              return polygon;
            }
            return prev;
          }, []),
        ]);
      }
    }
  });
  const avg_height =
    height_list.reduce((a, b) => a + b, 0) / height_list.length;
  const max_height = Math.max(...height_list);
  // console.log(polygons);
  if (get_detailed_data) {
    return { polygons, avg_height, max_height };
  }
  return polygons;
};

export const _isValidDevelopment = (
  background_relation,
  bldg_state,
  tolerance = 0,
  threshold_area = 0,
  get_detailed_data = false,
  get_polygon_data = false
) => {
  if (get_polygon_data) {
    const dev_polygon_data = getDevelopedPolygonsFromBldgState(
      background_relation,
      bldg_state,
      true
    );
    return {
      polygon: unionPolygon(
        dev_polygon_data.polygons,
        tolerance,
        threshold_area
      ),
      avg_height: dev_polygon_data.avg_height,
      max_height: dev_polygon_data.max_height,
    };
  }
  if (get_detailed_data) {
    return unionPolygon(
      getDevelopedPolygonsFromBldgState(background_relation, bldg_state),
      tolerance,
      threshold_area
    ).map((e) => e.length);
  }
  return isSimplyConnected(
    unionPolygon(
      getDevelopedPolygonsFromBldgState(background_relation, bldg_state),
      tolerance,
      threshold_area
    )
  );
};

//test

// const poly1 = [
//   [
//     [1, 0.5],
//     [0, 1.5],
//     [0, 0.5],
//   ],
// ];
// const poly2 = [
//   [
//     [-2, -2],
//     [-2, 4],
//     [4, 4],
//     [4, -2],
//   ],
//   [
//     [1, 0],
//     [1, 1],
//     [0, 1],
//     [0, 0],
//   ],
// ];

// console.log(_isValidDevelopment(0, 0, 1));

// setTimeout(() => {
//   console.log("");
// }, 100000);
