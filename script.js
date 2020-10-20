const main = async () => {
  const data = await loadData("data/fifa_20_data.csv");
  await createSpiderChart({ data: data[1] });
};

main().catch((err) => console.error(err));
