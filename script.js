const main = async () => {
  const data = await loadData("data/fifa_20_data.csv");
  const body = d3.select("body");

  for (let i = 0; i < data.length - 1; i++) {
    await createSpiderChart({ data: data[i], baseElement: body });
    i += 70;
  }
};

main().catch((err) => console.error(err));
