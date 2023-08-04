import * as THREE from "three";
import { Point, doPolygonsIntersect } from "./doPolygonIntersect";

export const _default = (options, default_json) => {
  options = options || {};
  for (let prop in default_json) {
    options[prop] =
      typeof options[prop] !== "undefined" ? options[prop] : default_json[prop];
  }
  return options;
};

export const _getBoundingBox = (x, y) => {
  return {
    left: Math.min(...x),
    right: Math.max(...x),
    top: Math.min(...y),
    bottom: Math.max(...y),
  };
};

export const _center = (x, y) => {
  let bb = _getBoundingBox(x, y);
  return { x: (bb.left + bb.right) / 2, y: (bb.top + bb.bottom) / 2 };
};

export const _centroid = (x, y) => {
  return { x: _avg(x), y: _avg(y) };
};

export const _sum = (list) => list.reduce((a, b) => a + b, 0);
export const _avg = (list) => _sum(list) / list.length || 0;

export const _fillZeros = (data, length) => {
  if (data.length < length) {
    return _fillZeros("0" + data, length);
  }
  return data;
};

export const _stringfy = (data) => {
  if (!data) {
    return "";
  }
  if (typeof data == typeof { abc: "abc" }) {
    return "";
  }
  if (typeof data != typeof "abc") {
    try {
      return data.toString();
    } catch {
      return "";
    }
  }
  return data;
};

export const _transformScroll = (event) => {
  if (!event.deltaY) {
    return;
  }
  event.currentTarget.scrollLeft += 0.5 * event.deltaY + 0.5 * event.deltaX;
  event.preventDefault();
};

export const _addTransformScrollEvent = (id) => {
  let listener = document
    .getElementById(id)
    .addEventListener("wheel", _transformScroll);
  return () => {
    document.getElementById(id).removeEventListener("wheel", listener);
  };
};

export const _ifValidString = (
  data,
  successMapper = () => true,
  err_text = false,
  disallow_zero = false
) => {
  if (typeof data == typeof "11" && data != "") {
    if (disallow_zero && data == "0") {
      return err_text;
    }
    return successMapper(data);
  }
  return err_text;
};

export const _isValidString = (data, err_text, disallow_zero = false) => {
  return _ifValidString(data, (data) => data, err_text, disallow_zero);
};

export const isMobile = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

export const getDistance = (vec1, vec2, default_dist) => {
  try {
    return Math.sqrt(
      (vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2 + (vec1.z - vec2.z) ** 2
    );
  } catch (e) {
    return default_dist;
  }
};

export const constrainVector = (
  type,
  vector,
  constraint_vector,
  offset = 1
) => {
  let changed = false;
  const new_vector_comp = [vector.x, vector.y, vector.z];
  switch (type) {
    case "upper":
      if (vector.x > constraint_vector.x + offset) {
        changed = true;
        new_vector_comp[0] = constraint_vector.x;
      }
      if (vector.y > constraint_vector.y + offset) {
        changed = true;
        new_vector_comp[1] = constraint_vector.y;
      }
      if (vector.z > constraint_vector.z + offset) {
        changed = true;
        new_vector_comp[2] = constraint_vector.z;
      }
      break;
    case "lower":
      if (vector.x < constraint_vector.x - offset) {
        changed = true;
        new_vector_comp[0] = constraint_vector.x;
      }
      if (vector.y < constraint_vector.y - offset) {
        changed = true;
        new_vector_comp[1] = constraint_vector.y;
      }
      if (vector.z < constraint_vector.z - offset) {
        changed = true;
        new_vector_comp[2] = constraint_vector.z;
      }
      break;
    default:
  }
  return { changed, constrained_vector: new THREE.Vector3(...new_vector_comp) };
};

export const rotateX = (vec) => {
  return [vec?.[0], vec?.[2], -vec?.[1]];
};

export const getGuid = (mesh) => {
  return mesh?.userData?.attributes?.id;
};

export const getName = (mesh) => {
  return mesh?.userData?.attributes?.name;
};

export const union = (set, set2) => {
  if (set && set2) {
    return new Set([...set, ...set2]);
  }
  return set;
};

export const multipleUnion = (sets) => {
  return sets.reduce((prev, curr) => union(prev, curr), new Set());
};

export const intersection = (set, set2) => {
  if (set && set2) {
    return new Set([...set].filter((e) => set2.has(e)));
  }
  return set;
};

export const multipleIntersection = (sets) => {
  return sets.reduce((prev, curr) => intersection(prev, curr), new Set());
};

export const difference = (set, set2) => {
  if (set && set2) {
    return new Set([...set].filter((e) => !set2.has(e)));
  }
  return set;
};

export const duplicates = (data_list) => {
  const union_data = [];
  const dup_data = [];
  data_list.forEach((e) =>
    e.forEach((e2) => {
      if (union_data.includes(e2)) {
        dup_data.push(e2);
      } else {
        union_data.push(e2);
      }
    })
  );
  return new Set(dup_data);
};

export const _polygonOverlaps = (polygon1, polygon2) => {
  const new_polygon_1 = polygon1.map((e) => new Point(...e));
  const new_polygon_2 = polygon2.map((e) => new Point(...e));
  return doPolygonsIntersect(new_polygon_1, new_polygon_2);
};

export const _areaOfPolygon = (polygon) => {
  if (polygon.length < 3) {
    return 0;
  }
  let area = 0;
  const point_length = polygon.length;

  for (let i = 0; i < point_length; i++) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[(i + 1) % point_length];
    area += x1 * y2 - x2 * y1;
  }

  area = Math.abs(area) / 2;
  return area;
};

export const _getStrLenWhenHangeulIs2 = (txt) => {
  return txt
    .split("")
    .reduce((prev, curr) => (escape(curr).length > 4 ? prev + 2 : prev + 1), 0);
};

export const _shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const _applyMatrix4OnPolygon = (polygon, matrix_element) => {
  return polygon
    .map((e2) =>
      new THREE.Vector3(...e2, 0).applyMatrix4(
        new THREE.Matrix4().set(...matrix_element?.elements).transpose()
      )
    )
    .map((e3) => [e3.x, e3.y]);
};

export const _API_URL = "https://seoulpanorama2123.com:81/";
