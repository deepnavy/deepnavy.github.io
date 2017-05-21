---
layout:     post
title:      Почему нам не нужно "Инферно"
date:       2016-10-15
minutes:    10
---

Я давно читал... <br>
<!--more-->
<style>
svg {
    font-family: "Lato", "Helvetica Neue", Helvetica, sans-serif;
    font-size: 0.707rem;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.focus line {
    shape-rendering: crispEdges;
    
}

.y.axis path {
  display: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}


.overlay {
  fill: none;
  pointer-events: all;
}

.focus circle {
  fill: none;
  stroke: steelblue;
}

</style>

<script src="//d3js.org/d3.v3.min.js"></script>
<script>

var margin = {top: 20, right: 40, bottom: 60, left: 40},
    width = 840 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var formatDate = d3.time.format("%y"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(25)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(0)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var svg = d3.select("article").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/assets/population.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")
      .call(xAxis)
      .selectAll("text")	
            .attr("dx", "1.5em")
           
            .attr("transform", function(d) {
                return "rotate(45)" 
                });;

svg.append("line")
    .style("stroke", "black")
    .style("shape-rendering", "crispEdges")
      .attr("x1", -margin.left * 0.5)
      .attr("y1", 0)
      .attr("x2", -margin.left * 0.5)
      .attr("y2", margin.top + height);
/*svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-20, 0)")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");*/


  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

      var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  /*focus.append("circle")
      .attr("r", 4.5);*/

  focus.append("text")
      .attr("x", 9)
      .attr("dy", "-0.5em");
    
focus.append("line")
    .classed("vertical", true)
    .style("stroke", "black")
    .style("stroke-dasharray", ("3, 3"))
      .attr("x1", 0)
      .attr("y1", 4.5)
      .attr("x2", 0)
      .attr("y2", 40);

focus.append("line")
    .classed("horizontal2", true)
    .style("stroke", "black")
    .style("stroke-dasharray", ("3, 3"))
      .attr("x1", 4.5)
      .attr("y1", 0)
      .attr("x2", 40)
      .attr("y2", 0);

focus.append("line")
    .classed("horizontal1", true)
    .style("stroke", "black")
    .style("stroke-dasharray", ("3, 3"))
      .attr("x1", -4.5)
      .attr("y1", 0)
      .attr("x2", -40)
      .attr("y2", 0);

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

ticks = svg.select(".x.axis").selectAll(".tick");

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
    focus.select("text")
        .text(formatValue(d.close))
        .attr("x", - x(d.date));
    focus.select(".vertical")
        .attr("y2", height - y(d.close) + 20)
        .attr("y1", -y(d.close));
    focus.select(".horizontal2")
        .attr("x2", width - x(d.date));
    focus.select(".horizontal1")
        .attr("x2", -x(d.date));

   /*var tick = d3.select(ticks[i]);

    var transform = d3.transform(tick.attr("transform")).translate;*/

  // passed in "data" is the value of the tick, transform[0] holds the X value
  console.log(i);
  }
});

function type(d) {
  //d.date = formatDate.parse(d.date);
  d.date = Date.parse(d.date)
  d.close = +d.close * 1000;
  return d;
}

</script>

