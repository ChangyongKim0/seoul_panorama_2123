import { polygonArea, polygonPerimeter } from "./MathFunction";

export const _getPiljiType = (pilji_polygon) => {
  const area = polygonArea(pilji_polygon[0]);
  const perimeter = polygonPerimeter(pilji_polygon[0]);
  const min_area = 700
  const converted_area = area * Math.min(((16 * area) / (perimeter ** 2)),1);
  // console.log(area);
  // console.log(converted_area);
  if (area < min_area) {
    if (converted_area <= 400) {
      return "s";
    } else if (converted_area <= 2500) {
      return "m";
    } else {
      return "l";
    }
  } else {
    if (area <= 2500) {
      return "m";
    } else {
      return "l";
    }
  }
}