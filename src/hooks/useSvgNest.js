import { useEffect, useMemo, useState } from "react";
import { Matrix4 } from "three";

const useSvgNest = () => {
  const [polygon_data, setPolygonData] = useState();
  const [output, setOutput] = useState();
  const [onProgress, setOnProgress] = useState(() => {});
  const [onRenderSvg, setOnRenderSvg] = useState(() => {});
  useEffect(() => {
    getSvgNestWithCallback(polygon_data, 0, setOutput, onProgress, onRenderSvg);
  }, [polygon_data, onProgress, onRenderSvg]);

  return [output, setPolygonData, setOnProgress, setOnRenderSvg];
};

const X_SPACING = 100;

// polygon : [[x1, y1], [x2, y2], ...]
const convertPolygonToSvgPolygon = (polygon, id, move = 0, rotate = 0) => {
  const point_list = polygon
    .map((coord) => {
      const new_coord = [
        Math.cos(rotate) * coord[0] -
          Math.sin(rotate) * coord[1] +
          move * X_SPACING,
        Math.sin(rotate) * coord[0] + Math.cos(rotate) * coord[1],
      ];
      return new_coord.join(",");
    })
    .join(" ");
  return `<polygon id="${id}" fill="none" stroke="#010101" points="${point_list}"></polygon>`;
};

// polygon_data :
// {
//   base : polygon,
//   polygons : {
//     "id" : polygon
//   }
// }
const convertPolygonDataToSvg = (polygon_data, rotate) => {
  const base_svg_polygon = convertPolygonToSvgPolygon(
    polygon_data.base,
    "base",
    0
  );
  const svg_polygon_list = Object.keys(polygon_data.polygons).map((id) =>
    convertPolygonToSvgPolygon(
      polygon_data.polygons[id],
      id,
      Number(id.split("_")[1]),
      rotate
    )
  );
  return `<svg version="1.1" id="svg2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve">
  ${base_svg_polygon}
  ${svg_polygon_list.join("\n  ")}
</svg>`;
};

const convertSvgMatixToMatrix4 = (svg_matrix) => {
  return new Matrix4().set(
    svg_matrix.a,
    svg_matrix.c,
    0,
    svg_matrix.e,
    svg_matrix.b,
    svg_matrix.d,
    0,
    svg_matrix.f,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );
};

const extractSvgMatrixListFromSvgList = (svglist, rotate) => {
  const matrix =
    svglist?.[0]?.children?.[0]?.transform?.baseVal?.consolidate?.()?.matrix;
  console.log(rotate);
  return Array.from(svglist?.[0]?.children).map((e) => ({
    id: e?.children?.[0]?.id || e?.id,
    matrix4: convertSvgMatixToMatrix4(
      e?.transform?.baseVal?.consolidate?.()?.matrix
    )
      ?.premultiply?.(convertSvgMatixToMatrix4(matrix)?.invert?.())
      ?.multiply(
        new Matrix4().makeTranslation(
          Number((e?.children?.[0]?.id || e?.id).split("_")?.[1]) * X_SPACING,
          0,
          0
        )
      )
      ?.multiply(new Matrix4().makeRotationZ(rotate)),
  }));
};

const formatOutput = (svg_matrix_list) => {
  return svg_matrix_list.reduce((prev, curr, idx) => {
    if (idx === 0) {
      return { ...prev, base: curr.matrix4, transformations: {} };
    } else {
      prev.transformations[curr.id] = curr.matrix4;
      return prev;
    }
  }, {});
};

export const getSvgNestWithCallback = (
  polygon_data,
  rotate,
  setOutput,
  onProgress = () => {},
  onRenderSvg = () => {}
) => {
  const svg_nest = new window.SvgNest();
  const progress = (percent) => {
    // console.log(percent);
    onProgress?.(percent);
  };

  const renderSvg = (svglist, efficiency, placed, total) => {
    let transformations = {};
    try {
      transformations = formatOutput(
        extractSvgMatrixListFromSvgList(svglist, rotate)
      );
      console.log(transformations);
      console.log(svglist);
    } catch {}
    setOutput({
      transformations,
      efficiency,
      placed,
      total,
    });
    svg_nest.stop();
    onRenderSvg?.(svglist);
  };
  try {
    const parsed_svgs = svg_nest?.parsesvg?.(
      convertPolygonDataToSvg(polygon_data, rotate)
    );
    console.log(parsed_svgs);
    svg_nest.setbin(parsed_svgs.children[0]);
    svg_nest.stop();
    svg_nest.start(progress, renderSvg);
  } catch {}
};

export default useSvgNest;
