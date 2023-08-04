import { getSvgNestWithCallback } from "../hooks/useSvgNest";
import { _areaOfPolygon, _shuffleArray } from "./alias";
import { Matrix4 } from "three";

// export const MODELS_TO_LOAD = {
//   sample: [{ name: "sample_-20_-20_-20_20_20_20_20_-20", multiplicity: 5 }],
// };

const UNIT_AREA = 14400;

export const MODELS_TO_LOAD = {
  house: [
    {
      name: "house1",
      polygon: [
        [-7.5, -7.5],
        [-7.5, 7.5],
        [7.5, 7.5],
        [7.5, -7.5],
      ],
      multiplicity: 10,
    },
    {
      name: "house2",
      polygon: [
        [-7.5, -11.25],
        [-7.5, 11.25],
        [7.5, 11.25],
        [7.5, -11.25],
      ],
      multiplicity: 5,
    },
    {
      name: "house3",
      polygon: [
        [-7.5, -11.25],
        [-7.5, 11.25],
        [7.5, 11.25],
        [7.5, -11.25],
      ],
      multiplicity: 5,
    },
    {
      name: "house4",
      polygon: [
        [-15, -15],
        [-15, 15],
        [15, 15],
        [15, -15],
      ],
      multiplicity: 3,
    },
    {
      name: "house5",
      polygon: [
        [-15, -15],
        [-15, 15],
        [15, 15],
        [15, -15],
      ],
      multiplicity: 3,
    },
    {
      name: "house6",
      polygon: [
        [-15, -15],
        [-15, 15],
        [15, 15],
        [15, -15],
      ],
      multiplicity: 3,
    },
  ],
  retail: [
    {
      name: "retail1",
      polygon: [
        [-5, -5],
        [-5, 5],
        [5, 5],
        [5, -5],
      ],
      multiplicity: 10,
    },
    {
      name: "retail2",
      polygon: [
        [-5, -5],
        [-5, 5],
        [5, 5],
        [5, -5],
      ],
      multiplicity: 23,
    },
    {
      name: "retail3",
      polygon: [
        [-5, -7.5],
        [-5, 7.5],
        [5, 7.5],
        [5, -7.5],
      ],
      multiplicity: 11,
    },
    {
      name: "retail4",
      polygon: [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10],
      ],
      multiplicity: 5,
    },
    {
      name: "retail5",
      polygon: [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10],
      ],
      multiplicity: 5,
    },
    {
      name: "retail6",
      polygon: [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10],
      ],
      multiplicity: 5,
    },
  ],
  workspace: [
    {
      name: "workspace1",
      polygon: [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10],
      ],
      multiplicity: 11,
    },
    {
      name: "workspace2",
      polygon: [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10],
      ],
      multiplicity: 11,
    },
    {
      name: "workspace3",
      polygon: [
        [-10, -20],
        [-10, 20],
        [10, 20],
        [10, -20],
      ],
      multiplicity: 5,
    },
  ],
  amenities: [
    {
      name: "amenities1",
      polygon: [
        [-15, -10],
        [-15, 10],
        [15, 10],
        [15, -10],
      ],
      multiplicity: 7,
    },
    {
      name: "amenities2",
      polygon: [
        [-20, -10],
        [-20, 10],
        [20, 10],
        [20, -10],
      ],
      multiplicity: 5,
    },
    {
      name: "amenities3",
      polygon: [
        [-20, -10],
        [-20, 10],
        [20, 10],
        [20, -10],
      ],
      multiplicity: 5,
    },
  ],
  greenhouse: [
    {
      name: "greenhouse",
      polygon: [
        [-5, -10],
        [-5, 10],
        [5, 10],
        [5, -10],
      ],
      multiplicity: 71,
    },
  ],
  windFarm: [
    {
      name: "windFarm",
      polygon: [
        [-7.5, -7.5],
        [-7.5, 7.5],
        [7.5, 7.5],
        [7.5, -7.5],
      ],
      multiplicity: 63,
    },
  ],
  solarPanel: [
    {
      name: "solarPanel",
      polygon: [
        [-3.75, -5],
        [-3.75, 5],
        [3.75, 5],
        [3.75, -5],
      ],
      multiplicity: 383,
    },
  ],
  waterTank: [
    {
      name: "waterTank",
      polygon: [
        [-7.5, -7.5],
        [-7.5, 7.5],
        [7.5, 7.5],
        [7.5, -7.5],
      ],
      multiplicity: 63,
    },
  ],
};

export const locateBldgsInPilji = (
  pilji_polygon,
  pilji_height,
  pilji_rotation,
  bldg_name,
  setOutput = () => {}
) => {
  const base_polygon = _getPolygonDataFromGrasshopperVectors(
    pilji_polygon?.[0]
  );
  console.log(_areaOfPolygon(base_polygon));
  const input_data = {
    base: base_polygon,
    polygons: _getPolygonDataFromBldgName(
      bldg_name,
      _areaOfPolygon(base_polygon)
    ),
  };
  console.log(input_data);
  getSvgNestWithCallback(input_data, pilji_rotation, (output) => {
    if (output.transformations.base) {
      const lift_matrix = new Matrix4().makeTranslation(0, 0, pilji_height);
      output.transformations.base =
        output.transformations.base.premultiply(lift_matrix);
      Object.keys(output.transformations.transformations).forEach((key) => {
        output.transformations.transformations[key] =
          output.transformations.transformations[key].premultiply(lift_matrix);
      });
    }
    setOutput(output);
  });
};

const _getPolygonDataFromGrasshopperVectors = (vectors) => {
  return vectors.map((e) => [e[0], e[1]]);
};

const _getPolygonDataFromBldgNameOld = (bldg_name) => {
  if (MODELS_TO_LOAD[bldg_name] === undefined) {
    return {};
  }
  return MODELS_TO_LOAD[bldg_name].reduce((prev, curr) => {
    const splitted = curr.name.split("_");
    const id = splitted[0];
    const polygon = [];
    splitted.forEach((e, idx) => {
      if (idx > 0) {
        if (idx % 2 === 1) {
          polygon.push([e]);
        } else {
          polygon[polygon.length - 1].push(e);
        }
      }
    });
    const return_data = {};
    new Array(curr.multiplicity).fill(0).forEach((_, idx) => {
      return_data[id + "_" + idx] = polygon;
    });
    return { ...prev, ...return_data };
  }, {});
};

const _getPolygonDataFromBldgName = (bldg_name, base_area) => {
  if (MODELS_TO_LOAD[bldg_name] === undefined) {
    return {};
  }
  const polygon_list = [];
  MODELS_TO_LOAD[bldg_name].forEach((e) => {
    new Array(Math.ceil((e.multiplicity * base_area) / UNIT_AREA))
      .fill(0)
      .forEach((_, idx) => {
        polygon_list.push({ id: e.name, polygon: e.polygon });
      });
  });
  const shuffled_polygon_list = _shuffleArray(polygon_list);
  const return_data = {};
  shuffled_polygon_list.forEach((e, idx) => {
    return_data[e.id + "_" + idx] = e.polygon;
  });
  return return_data;
};
