const createCard = async ({ data, baseElement, id }) => {
  const ratingColor = getRatingColor(parseInt(data.RATING, 10));
  const card = baseElement
    .append("div")
    .attr("class", "card")
    .attr("id", `card-${id}`)
    .style("background", ratingColor);

  const cardData = card.append("div").attr("class", "card-data");

  const chartContiner = card.append("div").attr("class", "chart-container");
  await createSpiderChart({
    data,
    baseElement: chartContiner,
  });
};
