const main = async () => {
  const data = await loadData("data/fifa_20_data.csv");
  await createSpiderChart({ data: data[2200] });
  await createSpiderChart({ data: data[0] });
};

main().catch((err) => console.error(err));
