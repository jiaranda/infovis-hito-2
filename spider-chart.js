// código basado en
// https://observablehq.com/@piyush078/03-the-numbers-decide-the-paths-hybrid-charts-2

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
  return await d3.csv(path, (rawData) => {
    return prepareData(rawData);
  });
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

const getNextElement = (data, i) => {
  if (data.length - 1 == i) {
    return data[0];
  }
  return data[i + 1];
};

const createChart = (svg, data, scale) => {
  svg
    .selectAll("g.spiders")
    .data([data])
    .enter()
    .append("g")
    .classed("spiders", true)
    .append("path")
    .style("fill", (d, i) => "#e605ff")
    .style("stroke", (d, i) => "#253df5")
    .style("stroke-width", "2px")
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

const createLabels = (svg, data) => {
  // Draw Labels
  const labels = svg
    .selectAll("g.labels")
    .data(data)
    .enter()
    .append("g")
    .classed("labels", true)
    .attr(
      "transform",
      (d, i) => `translate(${width * 0.7}, ${height - margin.b - i * 25})`
    );
  labels
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", 10)
    .style("fill", (d, i) => "#e605ff");
  labels
    .append("text")
    .attr("x", 35)
    .attr("y", 10)
    .style("font-size", "0.9rem")
    .text((d) => d);
};

const createSpiderChart = async (params) => {
  // define params for the chart

  const { data } = params;
  const scale = d3.scaleLinear().domain([0, 100]).range([0, sideLength]);

  const body = d3.select("body");
  const svg = body
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", cardColors.gold);
  createPolygon(svg);
  createChart(svg, data, scale);
  createAxes(svg);
  createLabels(svg, data);
};
