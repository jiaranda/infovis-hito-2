const main = async () => {
  const rawData = await loadData("data/fifa_20_data.csv");
  const data = prepareData(rawData);
  console.log(data);
  await createSpiderChart({ data });
};

main().catch((err) => console.error(err));
