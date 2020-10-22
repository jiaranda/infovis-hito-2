const getCards = async ({ data, baseElement }) => {
  const SKIP = 70;
  const t0 = Date.now();
  for (let i = 0; i < data.length - 1; i++) {
    await createCard({ data: data[i], baseElement, id: i });
    i += SKIP;
  }
  const t1 = Date.now();
};

const calculateMeans = async ({ data }) => {
  const n = data.length;
  const res = {
    PACE: 0,
    SHOOTING: 0,
    PASSING: 0,
    DRIBBLING: 0,
    DEFENDING: 0,
    PHYSICAL: 0,
    POSITION: "SUMMARY",
  };
  data.forEach((player) => {
    res.PACE += player.PACE / n;
    res.SHOOTING += player.SHOOTING / n;
    res.PASSING += player.PASSING / n;
    res.DRIBBLING += player.DRIBBLING / n;
    res.DEFENDING += player.DEFENDING / n;
    res.PHYSICAL += player.PHYSICAL / n;
  });

  return res;
};

const showMeans = async ({ means, baseElement }) => {
  baseElement
    .select("#def-mean")
    .select(".mean-value")
    .text(parseInt(means.DEFENDING));
  baseElement
    .select("#pac-mean")
    .select(".mean-value")
    .text(parseInt(means.PACE));
  baseElement
    .select("#phy-mean")
    .select(".mean-value")
    .text(parseInt(means.PHYSICAL));
  baseElement
    .select("#sho-mean")
    .select(".mean-value")
    .text(parseInt(means.SHOOTING));
  baseElement
    .select("#pas-mean")
    .select(".mean-value")
    .text(parseInt(means.PASSING));
  baseElement
    .select("#dri-mean")
    .select(".mean-value")
    .text(parseInt(means.DRIBBLING));
};

const getSummary = async ({ data }) => {
  const baseElement = d3.select("#summary-chart");
  const means = await calculateMeans({ data });
  await createSpiderChart({
    data: means,
    baseElement,
  });
  const summaryData = d3.select("#summary-data");
  await showMeans({ means, baseElement: summaryData });
};

const main = async () => {
  const data = await loadData("data/fifa_20_data.csv");
  const baseElement = d3.select("#cards-container");
  await getCards({ data, baseElement });
  await getSummary({ data });
};

main().catch((err) => console.error(err));
