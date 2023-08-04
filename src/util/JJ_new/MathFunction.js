// 함수 :두 점간의 거리
export const distance = (point1, point2) => {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// 함수 :점이 만드는 도형의 넓이
export const polygonArea = (points) => {
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const x1 = points[i][0];
    const y1 = points[i][1];
    const x2 = points[(i + 1) % n][0];
    const y2 = points[(i + 1) % n][1];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
}

// 함수 :점이 만드는 도형의 둘레
export const polygonPerimeter = (points) => {
  let perimeter = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    perimeter += distance(points[i], points[(i + 1) % n]);
  }

  return perimeter;
}

// 함수 : erf(x) 함수
export const erf = (x) => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  return sign*(1.0 - y * Math.exp(-x * x));
}

export const cumulativeDistributionFunction = (x, mu, sigma) => {
  const z = (x - mu) / sigma;
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}
