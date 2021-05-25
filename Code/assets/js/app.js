// @TODO: YOUR CODE HERE!

// First find all our coordinates of our chart
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 560;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating the chart with D3
// Select #scatter, append SVG area to it, and set dimensions using SVGheight and SVGwidth 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create a chart group
// allows us to affect entire canvas at once
// group is designated by a "g" in html
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// changing transform to translate will create those margins,left and top, basically ingoring right and bottom right now 
// 

// -----------
// Load data from CSV
// Import and format to numerical values
d3.csv("assets/data/data.csv").then(function(CensusData) {
  CensusData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
    // console.log(data);
    });
    // + is making sure the # is an actual number and not a string
// -----------
  //Create Scales, x and y
  const xScale = d3.scaleLinear()
    .domain(d3.extent(CensusData, x => x.age))
    .range([0, width])
    .nice(); 

  const yScale = d3.scaleLinear()
    .domain([6,d3.max(CensusData, y => y.smokes)])
    .range([height, 0])
    .nice();
// -----------
  // Create Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);


// Append axes to the chartGroup
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
  
  chartGroup.append("g").call(yAxis);

// -----------
//Generate scatter plot
chartGroup.selectAll("circle")
.data(CensusData)
.enter()
.append("circle")
.attr("cx", x=>xScale(x.age))
.attr("cy", y=>yScale(y.smokes))
.attr("r", "12")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.70);

//add texts to each datapoint
chartGroup.append("g")
  .selectAll('text')
  .data(CensusData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xScale(d.age))
  .attr("y",d=>yScale(d.smokes))
  .classed(".stateText", true)
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");
  
  //add axes titles
  chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 12})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "purple")
        .style("font-weight", "bold")
        .text("Median Age");

        chartGroup.append("text")
        .attr("y", 0 - ((margin.left / 2) + 2))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "purple")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Smokers (%)");



}).catch(function(error) {
  console.log(error);
});
