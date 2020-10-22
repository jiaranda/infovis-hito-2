const getCards = async ({ data, baseElement }) => {
  const SKIP = 70;
  const t0 = Date.now();
  for (let i = 0; i < data.length - 1; i++) {
    await createCard({ data: data[i], baseElement, id: i });
    i += SKIP;
  }
  const t1 = Date.now();
  console.log(t1 - t0);
};

const getSummary = async ({ data }) => {
  const baseElement = d3.select("#summary");
  await createSpiderChart({
    data,
    baseElement,
  });
};

const main = async () => {
  const data = await loadData("data/fifa_20_data.csv");
  const baseElement = d3.select("#cards-container");
  await getCards({ data, baseElement });
  await getSummary({ data: data[0] });
};

main().catch((err) => console.error(err));
