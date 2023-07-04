const txt = `            {0}
0. 1
1. df728813-5be7-45e5-884c-a08e1607cd10
2. {4787.371479, 1331.630967, -10.073304}
            {1}
0. 2
1. 8dcf7f65-5934-4e32-aa76-a874e82dfd85
2. {5438.872006, 1578.674253, -18.07874}
            {2}
0. 3
1. 00d015d2-8eeb-48e6-a545-0bb7371389d5
2. {4808.709143, 2186.510643, -0.29319}
            {3}
0. 4
1. 64306603-b2d9-43f4-9155-659246c6fc97
2. {4444.63828, 3247.243196, -6.509903}
            {4}
0. 5
1. a7619c70-5efc-406b-ae44-916975a3f7f5
2. {3462.826611, 3211.215493, 3.711319}
            {5}
0. 6
1. 3e2c8be4-eedb-44f7-8d1b-b350a7fd8805
2. {2190.081016, 2520.580208, 11.584643}
            {6}
0. 7
1. 4d6c1327-e1ae-4b9b-a04c-cd2be00963ad
2. {1054.129788, 1875.389526, 20.304033}
            {7}
0. 8
1. af990384-20c7-4e98-aa61-9227898303b1
2. {826.04581, 909.976578, 3.339278}
            {8}
0. 9
1. bedc2168-8a31-4f8a-a3ff-8d1fad73b1d8
2. {1931.337478, 495.661685, 21.5507}
            {9}
0. 10
1. 12166795-85bd-4ca8-aa7d-0f19bcf3a0c5
2. {3297.561203, 1127.69786, 7.144694}
            {10}
0. 11
1. e2eea56b-f8b6-41b5-9b38-41b3c874a337
2. {2849.240702, 1567.136547, 91.428399}
            {11}
0. 12
1. 8de1b52b-931e-4ef8-94fe-98bed7b976bf
2. {4124.791421, 2201.343684, 88.456043}
            {12}
0. 13
1. fefc9bc5-7493-431f-8192-a42a389db8f3
2. {4061.374043, 2499.91455, 82.739674}
            {13}
0. 14
1. 9a0cc789-74a4-4f04-9769-2b2d508f9a3c
2. {3159.73834, 2434.299208, 109.731309}
            {14}
0. 15
1. f8ee55d4-0226-4814-9b78-e097921624ee
2. {2357.962667, 2106.685159, 87.40146}
            {15}
0. 16
1. de6d45bf-ec31-47c4-8b40-27101db6603d
2. {1296.246605, 1650.009221, 125.134552}
            {16}
0. 17
1. 042009bf-e012-4490-b2e6-77f69c7a60c5
2. {1196.122238, 1245.210939, 115.672751}
            {17}
0. 18
1. 6bc3d42e-9d5c-4817-ae55-18c2be2a0e0a
2. {2067.914114, 899.730025, 77.462482}
`;

const getRegionDataFromGrasshopperText = (txt) => {
  const new_list = [];

  txt
    .split("\n")
    .map((e) => e.trim())
    .forEach((e, idx) => {
      switch (e[0]) {
        case "{":
          new_list.push({});
          break;
        case "0":
          new_list[new_list.length - 1]["region_name"] = e.slice(3, e.length);
          break;
        case "1":
          new_list[new_list.length - 1]["guid"] = e.slice(3, e.length);
          break;
        case "2":
          new_list[new_list.length - 1]["center"] = e
            .slice(4, e.length - 1)
            .split(", ")
            .map((e) => Number(e));
          break;
      }
    });

  return new_list.reduce((prev, curr) => {
    const new_data = { ...prev };
    new_data[curr.guid] = curr;
    return new_data;
  }, {});
};

// 결과물을 data/region_data.json에 저장하세요.
console.log(JSON.stringify(getRegionDataFromGrasshopperText(txt)));
