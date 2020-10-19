const width = 43 * 21;
const height = 43 * 9;
const baseX = width * 0.33;
const baseY = height * 0.5;
const sizeOfData = 5;
const keys = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"];
const bordersQty = keys.length;
const sideLength = height * 0.5 - 40;
const borderDistance = sideLength / bordersQty;
const margin = { l: 60, r: 30, t: 30, b: 60 };
const cardColors = {
  gold: "#FFD700",
};

const loadData = async (path) => {
  return await d3.csv(path);
};

const prepareData = (data) => {
  // get PAC, SHO, PAS, DRI, DEF, PHY from each player
  return data.map((item, index, arr) => {
    return [
      item.PACE,
      item.SHOOTING,
      item.PASSING,
      item.DRIBBLING,
      item.DEFENDING,
      item.PHYSICAL,
    ];
  });
};

const degToRadians = (angle) => (angle * Math.PI) / 180;
const coordX = (angle, rad, base) =>
  Math.cos(degToRadians(angle)).toFixed(2) * rad + base;
const coordY = (angle, rad, base) =>
  Math.sin(degToRadians(angle)).toFixed(2) * rad + base;
const pathToPoint = (i1, rad1, i2, rad2, start = false) =>
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
  )}`;

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
    .style("stroke", "rgba(0,0,0,0.4)")
    .style("fill", (d, i) => (i ? "transparent" : "rgba(219,219,205,0.2)"));
  return blocks;
};

const createDiagonal = (svg) => {
  const diagonal = svg.append("g").classed("diagonal", true);
  keys.forEach((e, i) => {
    diagonal
      .append("path")
      .attr("d", pathToPoint(i, 0, i, sideLength))
      .style("stroke", "rgba(0,0,0,0.4)");
  });
  return diagonal;
};

const createPolygon = (svg) => {
  const paths = createPaths();
  const blocks = createBlocks(svg, paths);
  const daigonal = createDiagonal(svg);
};

const createSpiderChart = async (params) => {
  // define params for the chart

  const { data } = params;
  const scale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
  console.log(scale);

  const body = d3.select("body");
  const svg = body
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", cardColors.gold);
  createPolygon(svg);
};
