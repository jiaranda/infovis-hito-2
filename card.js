const createCard = ({ data, baseElement, id }) => {
  console.log(data);
  const ratingColor = getRatingColor(parseInt(data.RATING, 10));
  const card = baseElement
    .append("div")
    .attr("class", "card")
    .attr("id", `card-${id}`)
    .style("background", ratingColor);

  card.append("div").attr("class", "card-data");

  card.append("div").attr("class", "chart-container");
};
