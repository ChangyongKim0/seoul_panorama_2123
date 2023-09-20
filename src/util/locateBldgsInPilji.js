import { getSvgNestWithCallback } from "../hooks/useSvgNest";
import { _getPiljiType } from "./JJ_new/_getPiljiType";
import { _areaOfPolygon, _shuffleArray } from "./alias";
import { Matrix4 } from "three";

// export const MODELS_TO_LOAD = {
//   sample: [{ name: "sample_-20_-20_-20_20_20_20_20_-20", multiplicity: 5 }],
// };

const UNIT_AREA = 28800;

const MODEL_CONFIG = {
  windFarm: {
    rotations: 1,
  },
  solarPanel: {
    rotations: 1,
    no_rotation: true,
  },
};

export const MODELS_TO_LOAD = {
  house: [
    {
      name: "house1", // 배치를 위한 최소면적용
      polygon: [
        [-2.5, -2.5],
        [-2.5, 2.5],
        [2.5, 2.5],
        [2.5, -2.5],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "house1",
      polygon: [
        [-2.5, -2.5],
        [-2.5 - 7.5, -2.5 + 2.5],
        [-2.5, 2.5],
        [-2.5 + 2.5, 2.5 + 0.5],
        [2.5, 2.5],
        [2.5 + 7.5, 2.5 - 2.5],
        [2.5, -2.5],
        [2.5 - 2.5, -2.5 - 0.5],
      ],
      multiplicity: 443,
      pilji_type: "s",
    },
    {
      name: "house1", // 배치를 위한 최소면적용
      polygon: [
        [-2.5, -2.5],
        [-2.5, 2.5],
        [2.5, 2.5],
        [2.5, -2.5],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "house1",
      polygon: [
        [-2.5, -2.5],
        [-2.5 - 7.5, -2.5 + 2.5],
        [-2.5, 2.5],
        [-2.5 + 2.5, 2.5 + 0.5],
        [2.5, 2.5],
        [2.5 + 7.5, 2.5 - 2.5],
        [2.5, -2.5],
        [2.5 - 2.5, -2.5 - 0.5],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "house1",
      polygon: [
        [-3, -3],
        [-3 - 6, -3 + 3],
        [-3, 3],
        [3, 3],
        [3 + 6, 3 - 3],
        [3, -3],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "house1",
      polygon: [
        [-5, -5],
        [-5 - 10, -5 + 5],
        [-5, 5],
        [5, 5],
        [5 + 10, 5 - 5],
        [5, -5],
      ],
      multiplicity: 64 / 4,
      pilji_type: "m",
    },
    {
      name: "house2",
      polygon: [
        [-5, -7.5],
        [-5 - 5, -7.5 + 7.5],
        [-5, 7.5],
        [5, 7.5],
        [5 + 5, 7.5 - 7.5],
        [5, -7.5],
      ],
      multiplicity: 64 / 4,
      pilji_type: "m",
    },
    {
      name: "house3",
      polygon: [
        [-5, -7.5],
        [-5 - 5, -7.5 + 7.5],
        [-5, 7.5],
        [5, 7.5],
        [5 + 5, 7.5 - 7.5],
        [5, -7.5],
      ],
      multiplicity: 64 / 4,
      pilji_type: "m",
    },
    // {
    //   name: "house1", // 배치를 위한 최소면적용
    //   polygon: [
    //     [-2.5, -2.5],
    //     [-2.5, 2.5],
    //     [2.5, 2.5],
    //     [2.5, -2.5],
    //   ],
    //   multiplicity: 1,
    //   pilji_type: "l",
    // },
    // {
    //   name: "house1",
    //   polygon: [
    //     [-2.5, -2.5],
    //     [-2.5-7.5, -2.5+2.5],
    //     [-2.5, 2.5],
    //     [2.5, 2.5],
    //     [2.5+7.5, 2.5-2.5],
    //     [2.5, -2.5],
    //   ],
    //   multiplicity: 1,
    //   pilji_type: "l",
    // },
    {
      name: "house2",
      polygon: [
        [-5, -7.5],
        [-5 - 5, -7.5 + 7.5],
        [-5, 7.5],
        [5, 7.5],
        [5 + 5, 7.5 - 7.5],
        [5, -7.5],
      ],
      multiplicity: 64 / 8,
      pilji_type: "l",
    },
    {
      name: "house3",
      polygon: [
        [-5, -7.5],
        [-5 - 5, -7.5 + 7.5],
        [-5, 7.5],
        [5, 7.5],
        [5 + 5, 7.5 - 7.5],
        [5, -7.5],
      ],
      multiplicity: 64 / 8,
      pilji_type: "l",
    },
    {
      name: "house4",
      polygon: [
        [-9.25, -9.25],
        [-9.25 - 9.25, -9.25 + 9.25],
        [-9.25, 9.25],
        [9.25, 9.25],
        [9.25 + 9.25, 9.25 - 9.25],
        [9.25, -9.25],
      ],
      multiplicity: 56 / 4,
      pilji_type: "l",
    },
    {
      name: "house5",
      polygon: [
        [-9.25, -9.25],
        [-9.25 - 9.25, -9.25 + 9.25],
        [-9.25, 9.25],
        [9.25, 9.25],
        [9.25 + 9.25, 9.25 - 9.25],
        [9.25, -9.25],
      ],
      multiplicity: 56 / 4,
      pilji_type: "l",
    },
    {
      name: "house6",
      polygon: [
        [-9.25, -9.25],
        [-9.25 - 9.25, -9.25 + 9.25],
        [-9.25, 9.25],
        [9.25, 9.25],
        [9.25 + 9.25, 9.25 - 9.25],
        [9.25, -9.25],
      ],
      multiplicity: 56 / 4,
      pilji_type: "l",
    },
  ],
  retail: [
    {
      name: "retail1", // 배치를 위한 최소면적용 (팔각형)
      polygon: [
        [-3 + 1, -3],
        [-3, -3 + 1],
        [-3, 3 - 1],
        [-3 + 1, 3],
        [3 - 1, 3],
        [3, 3 - 1],
        [3, -3 + 1],
        [3 - 1, -3],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "retail2",
      polygon: [
        [-3.25, -3.25],
        [-3.25 - 6, -3.25 + 3.25],
        [-3.25, 3.25],
        [3.25, 3.25],
        [3.25 + 6, 3.25 - 3.25],
        [3.25, -3.25],
      ],
      multiplicity: 354 / 2,
      pilji_type: "s",
    },
    {
      name: "retail1", // 배치를 위한 최소면적용 (팔각형)
      polygon: [
        [-3 + 1, -3],
        [-3, -3 + 1],
        [-3, 3 - 1],
        [-3 + 1, 3],
        [3 - 1, 3],
        [3, 3 - 1],
        [3, -3 + 1],
        [3 - 1, -3],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "retail2",
      polygon: [
        [-3, -3],
        [-3 - 6, -3 + 3],
        [-3, 3],
        [3, 3],
        [3 + 6, 3 - 3],
        [3, -3],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "retail1",
      polygon: [
        [-5, -5],
        [-5 - 5, -5 + 5],
        [-5, 5],
        [5, 5],
        [5 + 5, 5 - 5],
        [5, -5],
      ],
      multiplicity: 192 / 4,
      pilji_type: "m",
    },
    {
      name: "retail2",
      polygon: [
        [-5, -5],
        [-5 - 5, -5 + 5],
        [-5, 5],
        [5, 5],
        [5 + 5, 5 - 5],
        [5, -5],
      ],
      multiplicity: 192 / 4,
      pilji_type: "m",
    },
    {
      name: "retail3",
      polygon: [
        [-5, -7.5],
        [-5 - 5, -7.5 + 7.5],
        [-5, 7.5],
        [5, 7.5],
        [5 + 5, 7.5 - 7.5],
        [5, -7.5],
      ],
      multiplicity: 128 / 2,
      pilji_type: "m",
    },
    {
      name: "retail2",
      polygon: [
        [-3, -3],
        [-3 - 6, -3 + 3],
        [-3, 3],
        [3, 3],
        [3 + 6, 3 - 3],
        [3, -3],
      ],
      multiplicity: 1,
      pilji_type: "l",
    },
    {
      name: "retail3",
      polygon: [
        [-7.5, -11.25],
        [-7.5, 11.25],
        [7.5, 11.25],
        [7.5, -11.25],
      ],
      multiplicity: 84 / 6,
      pilji_type: "l",
    },
    {
      name: "retail4",
      polygon: [
        [-10, -10],
        [-10 - 10, -10 + 10],
        [-10, 10],
        [10, 10],
        [10 + 10, 10 - 10],
        [10, -10],
      ],
      multiplicity: 48 / 5,
      pilji_type: "l",
    },
    {
      name: "retail5",
      polygon: [
        [-10, -10],
        [-10 - 10, -10 + 10],
        [-10, 10],
        [10, 10],
        [10 + 10, 10 - 10],
        [10, -10],
      ],
      multiplicity: 48 / 5,
      pilji_type: "l",
    },
    {
      name: "retail6",
      polygon: [
        [-10, -10],
        [-10 - 10, -10 + 10],
        [-10, 10],
        [10, 10],
        [10 + 10, 10 - 10],
        [10, -10],
      ],
      multiplicity: 36 / 5,
      pilji_type: "l",
    },
  ],
  workspace: [
    {
      name: "workspace1", // 배치를 위한 최소면적용 (팔각형)
      polygon: [
        [-3.75, -3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "workspace1",
      polygon: [
        [-3.75, -3.75],
        [-3.75 - 11.25, -3.75 + 3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75 + 11.25, 3.75 - 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 128,
      pilji_type: "s",
    },
    {
      name: "workspace1", // 배치를 위한 최소면적용 (팔각형)
      polygon: [
        [-3.75, -3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "workspace1",
      polygon: [
        [-3.75, -3.75],
        [-3.75 - 7.5, -3.75 + 3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75 + 7.5, 3.75 - 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "workspace2",
      polygon: [
        [-5, -7],
        [-5 - 7, -7 + 7],
        [-5, 7],
        [5, 7],
        [5 + 7, 7 - 7],
        [5, -7],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "workspace1",
      polygon: [
        [-7, -7],
        [-7 - 8, -7 + 7],
        [-7, 7],
        [7, 7],
        [7 + 8, 7 - 7],
        [7, -7],
      ],
      multiplicity: 73 / 2,
      pilji_type: "m",
    },
    {
      name: "workspace2",
      polygon: [
        [-8, -10],
        [-8 - 9, -10 + 10],
        [-8, 10],
        [8, 10],
        [8 + 9, 10 - 10],
        [8, -10],
      ],
      multiplicity: 45 / 2,
      pilji_type: "m",
    },
    {
      name: "workspace1",
      polygon: [
        [-7, -7],
        [-7 - 8, -7 + 7],
        [-7, 7],
        [7, 7],
        [7 + 8, 7 - 7],
        [7, -7],
      ],
      multiplicity: 1,
      pilji_type: "l",
    },
    {
      name: "workspace2",
      polygon: [
        [-8, -10],
        [-8 - 9, -10 + 10],
        [-8, 10],
        [8, 10],
        [8 + 9, 10 - 10],
        [8, -10],
      ],
      multiplicity: 1,
      pilji_type: "l",
    },
    {
      name: "workspace2",
      polygon: [
        [-10, -13],
        [-10, 13],
        [10, 13],
        [10, -13],
      ],
      multiplicity: 55 / 2,
      pilji_type: "l",
    },
    {
      name: "workspace3",
      polygon: [
        [-13, -20],
        [-13, 20],
        [13, 20],
        [13, -20],
      ],
      multiplicity: 27 / 2,
      pilji_type: "l",
    },
  ],
  amenities: [
    {
      name: "amenities1", // 배치를 위한 최소면적용 (팔각형)
      polygon: [
        [-3.75, -3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "amenities1",
      polygon: [
        [-3.75, -3.75],
        [-3.75 - 7.5, -3.75 + 3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75 + 7.5, 3.75 - 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 256,
      pilji_type: "s",
    },
    {
      name: "amenities1", // 배치를 위한 최소면적용 (팔각형)
      polygon: [
        [-3.75, -3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "amenities1",
      polygon: [
        [-3.75, -3.75],
        [-3.75 - 7.5, -3.75 + 3.75],
        [-3.75, 3.75],
        [3.75, 3.75],
        [3.75 + 7.5, 3.75 - 3.75],
        [3.75, -3.75],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "amenities1",
      polygon: [
        [-5.75, -5.75],
        [-5.75 - 5.75, -5.75 + 5.75],
        [-5.75, 5.75],
        [5.75, 5.75],
        [5.75 + 5.75, 5.75 - 5.75],
        [5.75, -5.75],
      ],
      multiplicity: 145 / 2,
      pilji_type: "m",
    },
    {
      name: "amenities2",
      polygon: [
        [-7, -12],
        [-7 - 7, -12 + 12],
        [-7, 12],
        [7, 12],
        [7 + 7, 12 - 12],
        [7, -12],
      ],
      multiplicity: 57 / 2,
      pilji_type: "m",
    },
    {
      name: "amenities1",
      polygon: [
        [-5.75, -12],
        [-5.75 - 5.75, -5.75 + 5.75],
        [-5.75, 12],
        [5.75, 12],
        [5.75 + 5.75, 5.75 - 5.75],
        [5.75, -12],
      ],
      multiplicity: 69 / 3,
      pilji_type: "l",
    },
    {
      name: "amenities2",
      polygon: [
        [-7, -12],
        [-7 - 7, -12 + 12],
        [-7, 12],
        [7, 12],
        [7 + 7, 12 - 12],
        [7, -12],
      ],
      multiplicity: 57 / 3,
      pilji_type: "l",
    },
    {
      name: "amenities3",
      polygon: [
        [-7, -17],
        [-7 - 10, -17 + 17],
        [-7, 17],
        [7, 17],
        [7 + 10, 17 - 17],
        [7, -17],
      ],
      multiplicity: 40 / 3,
      pilji_type: "l",
    },
  ],
  greenhouse: [
    {
      name: "greenhouse1",
      polygon: [
        [-4, -3],
        [-4, 3],
        [4, 3],
        [4, -3],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "greenhouse1",
      polygon: [
        [-4, -3],
        [-4 - 8, -3 + 3],
        [-4, 3],
        [4, 3],
        [4 + 8, 3 - 3],
        [4, -3],
      ],
      multiplicity: 144,
      pilji_type: "s",
    },
    {
      name: "greenhouse1",
      polygon: [
        [-4, -3],
        [-4, 3],
        [4, 3],
        [4, -3],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "greenhouse1",
      polygon: [
        [-4, -3],
        [-4 - 8, -3 + 3],
        [-4, 3],
        [4, 3],
        [4 + 8, 3 - 3],
        [4, -3],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "greenhouse2",
      polygon: [
        [-8.5, -4],
        [-8.5, 4],
        [8.5, 4],
        [8.5, -4],
      ],
      multiplicity: 211 / 2,
      pilji_type: "m",
    },
    {
      name: "greenhouse2",
      polygon: [
        [-8.5, -4],
        [-8.5 - 8.5, -4 + 4],
        [-8.5, 4],
        [8.5, 4],
        [8.5 + 8.5, 4 - 4],
        [8.5, -4],
      ],
      multiplicity: 141 / 2,
      pilji_type: "m",
    },
    {
      name: "greenhouse3",
      polygon: [
        [-13, -7],
        [-13, 7],
        [13, 7],
        [13, -7],
      ],
      multiplicity: 79 / 2,
      pilji_type: "l",
    },
    {
      name: "greenhouse3",
      polygon: [
        [-13, -7],
        [-13 - 13, -7 + 7],
        [-13, 7],
        [13, 7],
        [13 + 13, 7 - 7],
        [13, -7],
      ],
      multiplicity: 52 / 2,
      pilji_type: "l",
    },
  ],
  windFarm: [
    {
      name: "windFarm1",
      polygon: [
        [-4, -3 - 1],
        [-4, 3 - 1],
        [4, 3 - 1],
        [4, -3 - 1],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "windFarm1",
      polygon: [
        [-5, -4],
        [-5 - 10, -4 + 4],
        [-5, 4],
        [5, 4],
        [5 + 10, 4 - 4],
        [5, -4],
      ],
      multiplicity: 205,
      pilji_type: "s",
    },
    {
      name: "windFarm1",
      polygon: [
        [-5, -4],
        [-5, 4],
        [5, 4],
        [5, -4],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "windFarm1",
      polygon: [
        [-5, -4],
        [-5 - 10, -4 + 4],
        [-5, 4],
        [5, 4],
        [5 + 10, 4 - 4],
        [5, -4],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "windFarm1",
      polygon: [
        [-7, -6 - 3],
        [-7, 6],
        [7 + 7, 6 - 6],
        [7, -6 - 3],
      ],
      multiplicity: 130 / 2,
      pilji_type: "m",
    },
    {
      name: "windFarm1",
      polygon: [
        [-7, -6 - 3],
        [-7 - 7, -6 + 6],
        [-7, 6],
        [7, 6],
        [7 + 7, 6 - 6],
        [7, -6 - 3],
      ],
      multiplicity: 91 / 2,
      pilji_type: "m",
    },
    {
      name: "windFarm3",
      polygon: [
        [-9, -7 - 3],
        [-9, 7],
        [9 + 9, 7 - 7],
        [9, -7 - 3],
      ],
      multiplicity: 90 / 2,
      pilji_type: "l",
    },
    {
      name: "windFarm3",
      polygon: [
        [-9, -7 - 3],
        [-9 - 9, -7 + 7],
        [-9, 7],
        [9, 7],
        [9 + 9, 7 - 7],
        [9, -7 - 3],
      ],
      multiplicity: 72 / 2,
      pilji_type: "l",
    },
  ],
  waterTank: [
    {
      name: "waterTank1",
      polygon: [
        [-4, -4],
        [-4, 4],
        [4, 4],
        [4, -4],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "waterTank1",
      polygon: [
        [-4, -5],
        [-4 - 8, -4 + 8],
        [-4, 5],
        [4, 4],
        [4 + 8, 4 - 8],
        [4, -5],
      ],
      multiplicity: 189,
      pilji_type: "s",
    },
    {
      name: "waterTank1",
      polygon: [
        [-4, -4],
        [-4, 4],
        [4, 4],
        [4, -4],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "waterTank1",
      polygon: [
        [-4, -5],
        [-4 - 8, -4 + 8],
        [-4, 5],
        [4, 4],
        [4 + 8, 4 - 8],
        [4, -5],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "waterTank2",
      polygon: [
        [-6, -11],
        [-6, 11],
        [6, 11],
        [6, -11],
      ],
      multiplicity: 109 / 2,
      pilji_type: "m",
    },
    {
      name: "waterTank2",
      polygon: [
        [-6, -11],
        [-6 - 6, -11 + 11],
        [-6, 11],
        [6, 11],
        [6 + 6, 11 - 11],
        [6, -11],
      ],
      multiplicity: 72 / 2,
      pilji_type: "m",
    },
    {
      name: "waterTank3",
      polygon: [
        [-11, -11],
        [-11, 11],
        [11, 11],
        [11, -11],
      ],
      multiplicity: 59 / 2,
      pilji_type: "l",
    },
    {
      name: "waterTank3",
      polygon: [
        [-11, -11],
        [-11 - 11, -11 + 11],
        [-11, 11],
        [11, 11],
        [11 + 11, 11 - 11],
        [11, -11],
      ],
      multiplicity: 39 / 2,
      pilji_type: "l",
    },
  ],
  solarPanel: [
    {
      name: "solarPanel1",
      polygon: [
        [-2.5, -2 - 1],
        [-2.5, 2],
        [2.5, 2],
        [2.5, -2 - 1],
      ],
      multiplicity: 1,
      pilji_type: "s",
    },
    {
      name: "solarPanel1",
      polygon: [
        [-2.5, -2],
        [-2.5 - 5, -2 + 2],
        [-2.5, 2],
        [2.5, 2],
        [2.5 + 5, 2 - 2],
        [2.5, -2],
      ],
      multiplicity: 512,
      pilji_type: "s",
    },
    {
      name: "solarPanel1",
      polygon: [
        [-2.5, -2 - 1],
        [-2.5, 2],
        [2.5, 2],
        [2.5, -2 - 1],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    {
      name: "solarPanel1",
      polygon: [
        [-2.5, -2],
        [-2.5 - 5, -2 + 2],
        [-2.5, 2],
        [2.5, 2],
        [2.5 + 5, 2 - 2],
        [2.5, -2],
      ],
      multiplicity: 1,
      pilji_type: "m",
    },
    // {
    //   name: "solarPanel1",
    //   polygon: [
    //     [-3.5, -3],
    //     [-3.5-3.5, -3+3],
    //     [-3.5, 3],
    //     [3.5, 3],
    //     [3.5+3.5, 3-3],
    //     [3.5, -3],
    //   ],
    //   multiplicity: 457/2,
    //   pilji_type: "m",
    // },
    {
      name: "solarPanel2",
      polygon: [
        [-5.5, -3 - 2],
        [-5.5, 3],
        [5.5, 3],
        [5.5, -3 - 2],
      ],
      multiplicity: 327 / 2,
      pilji_type: "m",
    },
    {
      name: "solarPanel2",
      polygon: [
        [-5.5, -3 - 2],
        [-5.5 - 5.5, -3 + 3],
        [-5.5, 3],
        [5.5, 3],
        [5.5 + 5.5, 3 - 3],
        [5.5, -3 - 2],
      ],
      multiplicity: 290 / 2,
      pilji_type: "m",
    },
    // {
    //   name: "solarPanel1",
    //   polygon: [
    //     [-3.5, -3],
    //     [-3.5-3.5, -3+3],
    //     [-3.5, 3],
    //     [3.5, 3],
    //     [3.5+3.5, 3-3],
    //     [3.5, -3],
    //   ],
    //   multiplicity: 457/3,
    //   pilji_type: "l",
    // },
    // {
    //   name: "solarPanel2",
    //   polygon: [
    //     [-5.5, -3],
    //     [-5.5-5.5, -3+3],
    //     [-5.5, 3],
    //     [5.5, 3],
    //     [5.5+5.5, 3-3],
    //     [5.5, -3],
    //   ],
    //   multiplicity: 290/3,
    //   pilji_type: "l",
    // },
    {
      name: "solarPanel3",
      polygon: [
        [-7.5, -3 - 2],
        [-7.5 - 7.5, -3 + 3 - 1],
        [-7.5, 3],
        [7.5, 3],
        [7.5 + 7.5, 3 - 3 - 1],
        [7.5, -3 - 2],
      ],
      multiplicity: 160 / 2,
      pilji_type: "l",
    },
    {
      name: "solarPanel3",
      polygon: [
        [-7.5, -3 - 2],
        [-7.5, 3],
        [7.5, 3],
        [7.5, -3 - 2],
      ],
      multiplicity: 240 / 2,
      pilji_type: "l",
    },
  ],
};

export const locateBldgsInPilji = (
  pilji_multipolygon,
  pilji_height,
  pilji_rotation,
  bldg_name,
  setOutput = () => {}
) => {
  const base_multipolygon =
    _getPolygonDataFromGrasshopperVectors(pilji_multipolygon);
  const input_data = {
    base: base_multipolygon[0],
    polygons: _getPolygonDataFromBldgName(bldg_name, base_multipolygon),
  };
  const config = MODEL_CONFIG[bldg_name] || {};
  // console.log(config);
  // console.log(input_data);
  getSvgNestWithCallback(
    input_data,
    config,
    config?.no_rotation ? 0 : pilji_rotation,
    (output) => {
      if (output.transformations.base) {
        const lift_matrix = new Matrix4().makeTranslation(0, 0, pilji_height);
        output.transformations.base =
          output.transformations.base.premultiply(lift_matrix);
        Object.keys(output.transformations.transformations).forEach((key) => {
          output.transformations.transformations[key] =
            output.transformations.transformations[key].premultiply(
              lift_matrix
            );
        });
      }
      setOutput(output);
    }
  );
};

const _getPolygonDataFromGrasshopperVectors = (vectors_list) => {
  return vectors_list.map((e) => e.map((e2) => [e2[0], e2[1]]));
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

const _getPolygonDataFromBldgName = (bldg_name, base_multipolygon) => {
  if (MODELS_TO_LOAD[bldg_name] === undefined) {
    return {};
  }
  const polygon_list = [];
  const pilji_type = _getPiljiType(base_multipolygon);
  console.log(`면적 : ${base_multipolygon
    .map((e, idx) => (idx === 0 ? 1 : -1) * _areaOfPolygon(e))
    .reduce((a, b) => a + b, 0)}, 
유형 : ${pilji_type}`);
  MODELS_TO_LOAD[bldg_name].forEach((e) => {
    if (e.pilji_type === pilji_type) {
      new Array(
        Math.ceil(
          (e.multiplicity *
            base_multipolygon
              .map((e, idx) => (idx === 0 ? 1 : -1) * _areaOfPolygon(e))
              .reduce((a, b) => a + b, 0)) /
            UNIT_AREA
        )
      )
        .fill(0)
        .forEach((_, idx) => {
          polygon_list.push({ id: e.name, polygon: e.polygon });
        });
    }
  });
  const shuffled_polygon_list = _shuffleArray(polygon_list);
  const return_data = {};
  shuffled_polygon_list.forEach((e, idx) => {
    return_data[e.id + "_" + idx] = e.polygon;
  });
  console.log("배치대기 모형들 : ", Object.keys(return_data));
  return return_data;
};
