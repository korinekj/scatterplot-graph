document.addEventListener("DOMContentLoaded", () => {
  d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  ).then((data) => {
    drawScatterPlot(data);
  });
});

const drawScatterPlot = (dataset) => {
  const svg = d3.select("svg");

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const formatTime = d3.timeFormat("%M:%S");
  const parseTime = d3.timeParse(formatTime);

  const parseYear = d3.timeParse("%Y");

  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 60,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => parseYear(d.Year - 1)),
      d3.max(dataset, (d) => parseYear(d.Year + 1)),
    ])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => parseTime(d.Time)),
      d3.max(dataset, (d) => parseTime(d.Time)),
    ])
    .range([0, innerHeight]);

  //Define x, y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

  //Define the div for the TOOLTIP
  const div = d3
    .select(".container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //adding color legend
  const legendText = [
    "No doping allegations",
    "Riders with doping allegations",
  ];

  const legends = svg
    .append("g")
    .attr("transform", `translate(${innerWidth}, ${innerHeight / 2})`)
    .attr("id", "legend")
    .selectAll(".legends")
    .data(["rgb(255, 127, 14)", "rgb(31, 119, 180)"]);

  const legend = legends
    .enter()
    .append("g")
    .classed("legends", true)
    .attr("transform", (d, i) => `translate(0, ${i * 25})`);

  legend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => d);

  legend
    .append("text")
    .text((d, i) => legendText[i])
    .attr("transform", "translate(-10,15)")
    .attr("font-size", "12")
    .style("text-anchor", "end");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Add text right next to y-axis
  g.append("text")
    .attr("x", -155)
    .attr("y", -45)
    .text("Time in Minutes")
    .style("font-size", "1.2rem")
    .attr("transform", "rotate(-90)");

  //Add axes
  g.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${innerHeight})`)
    .call(xAxis);

  g.append("g").attr("id", "y-axis").call(yAxis);

  g.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(parseYear(d.Year)))
    .attr("cy", (d) => yScale(parseTime(d.Time)))
    .attr("r", 7)
    .attr("fill", (d) => {
      if (d.Doping === "") {
        return "rgb(255, 127, 14)";
      } else {
        return "rgb(31, 119, 180)";
      }
    })
    .attr("opacity", "0.8")
    .attr("stroke", "#000")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => parseTime(d.Time))
    .on("mouseover", (event, d) => {
      const x = event.pageX;
      const y = event.pageY;

      div.style("opacity", 0.9);
      div
        .html(
          d.Name +
            ": " +
            d.Nationality +
            "<br/>" +
            "Year" +
            ": " +
            d.Year +
            ", Time: " +
            d.Time +
            "<br/>" +
            "<p>" +
            d.Doping +
            "</p>"
        )
        .style("left", x + 10 + "px")
        .style("top", y - 20 + "px")
        .attr("data-year", d.Year)
        .attr("id", "tooltip");
    })
    .on("mouseout", () => {
      div.style("opacity", 0);
    });
};
