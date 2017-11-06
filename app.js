var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var width = 400;
var height = 400;
var padding = 30;
var yearData = birthData.filter(d => d.year === minYear);

var months = [];
for (var i=0; i < birthData.length; i++) {
  var month = birthData[i].month;
  if (months.indexOf(month) === -1) {
    months.push(month);
  }
}

var monthColors = [
  "#47ED86",
  "#3CC972",
  "#2E9354",
  "#6073FA",
  "#3C4DC9",
  "#182683",
  "#F770C3",
  "#C93C93",
  "#911561",
  "#F7E980",
  "#C9B83C",
  "#A4941A"
];

var quarterColors = [
  "#3CC972",
  "#3CC972",
  "#3CC972",
  "#3C4DC9",
  "#3C4DC9",
  "#3C4DC9",
  "#C93C93",
  "#C93C93",
  "#C93C93",
  "#C9B83C",
  "#C9B83C",
  "#C9B83C"
]

var colorScaleMonth = d3.scaleOrdinal()
                  .domain(months)
                  .range(monthColors);

var colorScaleQuarter = d3.scaleOrdinal()
                  .domain(months)
                  .range(quarterColors);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("text");
svg.append("g");

svg
  .select("text")
    .attr("x", width / 2)
    .attr("y", 10)
    .attr("dy", "1.5em")
    .style("text-anchor", "middle")
    .text("Births by month and quarter for " + minYear);

svg
  .select("g")
    .attr("transform", 'translate(' + width / 2 + ', ' + ((height / 2) + padding/2) + ')')
    .classed("chart", true);

d3.select("#yearSlider")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear)
    .on("input", function() {
      makeGraph(+d3.event.target.value, 2, "big", colorScaleMonth);
      makeGraph(+d3.event.target.value, 3.5, "small", colorScaleQuarter);
    });

d3.select("#funSlider")
    .property("min", 0)
    .property("max", 1080)
    .property("value", 0)
    .on("input", function() {
      d3.selectAll(".arc")
        .attr("transform", "rotate(" + d3.event.target.value + ")")
    })

makeGraph(minYear, 2, "big", colorScaleMonth);
makeGraph(minYear, 3.5, "small", colorScaleQuarter);

function makeGraph(year, outerRadius, name, chartColorScale) {
  var yearData = birthData.filter(d => d.year === year);
  var monthNumbers = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12,
  }

  var arcs = d3.pie()
              .value(d => d.births)
              .sort((a,b) => {
                if (monthNumbers[a.month] < monthNumbers[b.month]) return -1;
                else if (monthNumbers[a.month] > monthNumbers[b.month]) return 1;
                else return a.births - b.births;
              })
              (yearData);

  var path = d3.arc()
              .outerRadius(width / outerRadius - padding)
              .innerRadius(0)
              // .padAngle(0.005)
              ;

  var update = d3.select(".chart")
                  .selectAll(".arc-"+name)
                  .data(arcs);

  update
    .exit()
    .remove();

  update
    .enter()
    .append("path")
      .classed("arc-"+name, true)
      .classed("arc", true)
    .merge(update)
      .attr("fill", d => chartColorScale(d.data.month))
      // .attr("stroke", "black")
      .attr("d", path);

  d3.select("svg")
    .selectAll("text")
    .text("Births by month and quarter for " + year);
}
