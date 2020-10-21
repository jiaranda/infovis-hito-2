// código basado en
// https://observablehq.com/@piyush078/03-the-numbers-decide-the-paths-hybrid-charts-2

const ZOOM = 20;

const width = ZOOM * 9;
const height = ZOOM * 9;
const baseX = width * 0.5;
const baseY = height * 0.5;
const keys = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"];
const bordersQty = keys.length;
const sideLength = height * 0.5 - 40;
const borderDistance = sideLength / bordersQty;
const ratingColors = {
  gold: "#f7d320",
  silver: "#cccccc",
  bronze: "#db9c1f",
};
const positionColors = {
  defense: "#6e7eff",
  mid: "#6eff84",
  front: "#ff4747",
};

const prepareData = (data) => {
  // get PAC, SHO, PAS, DRI, DEF, PHY from each player
  return [
    data.PACE,
    data.SHOOTING,
    data.PASSING,
    data.DRIBBLING,
    data.DEFENDING,
    data.PHYSICAL,
  ];
};

const loadData = async (path) => {
  return await d3.csv(path);
};

const degToRadians = (angle) => {
  return (angle * Math.PI) / 180;
};
const coordX = (angle, rad, base) => {
  return Math.cos(degToRadians(angle)).toFixed(2) * rad + base;
};
const coordY = (angle, rad, base) => {
  return Math.sin(degToRadians(angle)).toFixed(2) * rad + base;
};
const pathToPoint = (i1, rad1, i2, rad2, start = false) => {
  return (
    `${start ? "L" : "M"}` +
    `${coordX((i1 * 360) / bordersQty, rad1, baseX)},${coordY(
      (i1 * 360) / bordersQty,
      rad1,
      baseY
    )}` +
    `L${coordX((i2 * 360) / bordersQty, rad2, baseX)},${coordY(
      (i2 * 360) / bordersQty,
      rad2,
      baseY
    )}`
  );
};

const createPaths = () => {
  const paths = [...Array(bordersQty)].map((b, x) => {
    const rad = (x + 1) * borderDistance;
    return (
      pathToPoint(0, rad, 1, rad) +
      [...Array(bordersQty - 1)]
        .map((e, i) => pathToPoint(i + 1, rad, i + 2, rad, true))
        .join("") +
      " Z"
    );
  });
  return paths;
};

const createBlocks = (svg, paths) => {
  const blocks = svg
    .selectAll("g.block")
    .data(Array(bordersQty))
    .enter()
    .append("g")
    .classed("block", true)
    .append("path")
    .attr("d", (d, i) => paths[i])
    .style("stroke", "rgba(0,0,0,0.2)")
    .style("fill", (d, i) => (i ? "transparent" : "#dbdbcd"));
  return blocks;
};

const createDiagonal = (svg) => {
  const diagonal = svg.append("g").classed("diagonal", true);
  keys.forEach((e, i) => {
    diagonal
      .append("path")
      .attr("d", pathToPoint(i, 0, i, sideLength))
      .style("stroke", "rgba(0,0,0,0.2)");
  });
  return diagonal;
};

const createPolygon = (svg) => {
  const paths = createPaths();
  const blocks = createBlocks(svg, paths);
  const daigonal = createDiagonal(svg);
};

const getNextElement = (data, i) => {
  if (data.length - 1 == i) {
    return data[0];
  }
  return data[i + 1];
};

const createChart = (svg, data, scale, fillColor) => {
  svg
    .selectAll("g.spiders")
    .data([data])
    .enter()
    .append("g")
    .classed("spiders", true)
    .append("path")
    .style("fill", (d, i) => fillColor)
    .style("stroke-width", "0px")
    .attr(
      "d",
      (d, i) =>
        keys
          .map((key, x) => {
            const radiusFrom = scale(data[i]);
            const radiusTo = scale(getNextElement(data, i));
            i += 1;
            return pathToPoint(x, radiusFrom, x + 1, radiusTo, x !== 0);
          })
          .join("") + " Z"
    );
};

const createAxes = (svg) => {
  // Draw Axes
  svg
    .selectAll("g.axes")
    .data(keys)
    .enter()
    .append("g")
    .classed("axes", true)
    .attr(
      "transform",
      (d, i) =>
        `translate(` +
        `${coordX((i * 360) / bordersQty, sideLength + 10, baseX)},` +
        `${coordY((i * 360) / bordersQty, sideLength + 10, baseY)})`
    )
    .append("text")
    .text((d) => d)
    .attr("transform", (d, i) => `rotate(${(i * 360) / bordersQty + 90})`)
    .style("font-size", "0.9rem")
    .attr("text-anchor", "middle");
};

const getPositionColor = (position) => {
  console.log("---------------");
  console.log(position);
  if (["CB", "RB", "LB", "LWB", "RWB"].includes(position))
    return positionColors.defense;
  if (["CM", "CAM", "CDM", "LM", "RM"].includes(position))
    return positionColors.mid;

  return positionColors.front;
};

const getRatingColor = (rating) => {
  if (75 <= rating && rating <= 99) return ratingColors.gold;
  if (65 <= rating && rating < 75) return ratingColors.silver;
  if (1 <= rating && rating < 65) return ratingColors.bronze;
};

const createSpiderChart = async (params) => {
  // get all params
  const { baseElement, data } = params;
  const preparedData = prepareData(data);
  const scale = d3.scaleLinear().domain([0, 100]).range([0, sideLength]);
  const positionColor = getPositionColor(data.POSITION);
  console.log(data.POSITION);
  console.log(positionColor);

  // draw spiderchart
  const svg = baseElement
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "transparent");

  // add white circle
  svg
    .append("circle")
    .attr("cx", baseX)
    .attr("cy", baseY)
    .attr("r", sideLength * 1.5)
    .attr("fill", "#FFFFFF");
  createPolygon(svg);
  createChart(svg, preparedData, scale, positionColor);
  createAxes(svg);
};
