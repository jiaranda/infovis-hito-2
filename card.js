const createCard = async ({ data, baseElement, id }) => {
  const ratingColor = getRatingColor(parseInt(data.RATING, 10));
  const card = baseElement
    .append("div")
    .attr("id", `card-${id}`)
    .attr("class", `${ratingColor}-card card`);

  const cardData = card.append("div").attr("class", "card-data");
  const cardTitle = cardData.append("div").attr("class", "card-title");
  const cardDescription = cardData.append("div").attr("class", "card-desc");
  cardTitle.append("p").attr("class", "rating mid-bold").text(data.RATING);
  cardTitle.append("p").attr("class", "player-name mid-bold").text(data.NAME);
  cardDescription
    .append("p")
    .attr("class", "player-desc, player-club")
    .text(data.CLUB);
  cardDescription.append("p").attr("class", "player-desc").text(data.LEAGUE);

  const chartContiner = card.append("div").attr("class", "chart-container");
  await createSpiderChart({
    data,
    baseElement: chartContiner,
  });
};
