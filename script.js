const main = async () => {
  const data = await loadData("data/fifa_20_data.csv");
  const body = d3.select("body");

  for (let i = 0; i < data.length - 1; i++) {
    await createCard({ data: data[i], baseElement: body, id: i });
    i += 70;
  }
};

main().catch((err) => console.error(err));
