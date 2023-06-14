import axios from "axios";

// import { useReducer } from "react";

// const useGuid = () => {
//   // {adj_}
//   const [guid_data, setGuidData] = useReducer((state, action) => {
//     switch (action.type) {
//       case "add":
//         return { ...state, ...action.data };
//       case "remove all":
//         return {};
//     }
//   }, {});
// };

const getDataFromGrasshopperTreeTextFileAsync = (url) => {
  return axios
    .get(url)
    .then((res) => convertGrasshopperTreeText(res.data))
    .catch((err) => []);
};

const convertGrasshopperTreeText = (text) => {
  try {
    let curr_idx = 0;
    let new_data = [];
    const splited_txt = text.split("\n");
    for (const e of splited_txt.map((e) => e.trim())) {
      if (e?.[0] === "{") {
        curr_idx = Number(e.substring(1, e.length - 1));
        new_data[curr_idx] = [];
      } else {
        new_data[curr_idx].push(e.split(" ")[1]);
      }
    }
    //validation
    if (
      new_data.reduce((prev, curr) => prev + curr.length, 0) +
        new_data.length !==
      splited_txt.length
    ) {
      return [];
    }
    return new_data;
  } catch (e) {
    return [];
  }
};
console.log("d");
console.log(
  getDataFromGrasshopperTreeTextFileAsync(
    "https://raw.githubusercontent.com/ChangyongKim0/seoul_panorama_2123/master/public/guid/temp.txt"
  )
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
);

setTimeout(() => {}, 100000);
