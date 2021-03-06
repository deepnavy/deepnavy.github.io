var mobile = false;

if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  mobile = true;
  // viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0,window.screen.availHeight);
  // console.log(document.documentElement,window,window.screen.availHeight);
}


regionsAlignment2 = {
        "crimea": "Автономна Республіка Крим",
        "mk": "Миколаївська",
        "cn": "Чернівецька",
        "rv": "Рівненська",
        "cv": "Чернівецька",
        "if": "Івано-Франківська",
        "km": "Хмельницька",
        "lviv": "Львівська",
        "te": "Тернопільська",
        "uz": "Закарпатська",
        "volyn": "Волинська",
        "ck": "Черкаська",
        "kr": "Кіровоградська",
        "kiev": "Київська",
        "od": "Одеська",
        "vn": "Вінницька",
        "zt": "Житомирська",
        "sm": "Сумська",
        "dp": "Дніпропетровська",
        "dn": "Донецька",
        "kh": "Харківська",
        "lg": "Луганська",
        "pl": "Полтавська",
        "zp": "Запорізька",
        "ks": "Херсонська"
}

regionsAlignment = {
        "crimea": "Автономна Республіка Крим",
        "mk": "Миколаївська обл",
        "cn": "Чернівецька обл",
        "rv": "Рівненська обл",
        "cv": "Чернівецька обл",
        "if": "Івано-Франківська обл",
        "km": "Хмельницька обл",
        "lviv": "Львівська обл",
        "te": "Тернопільська обл",
        "uz": "Закарпатська обл",
        "volyn": "Волинська обл",
        "ck": "Черкаська обл",
        "kr": "Кіровоградська обл",
        "kiev": "Київська обл",
        "od": "Одеська обл",
        "vn": "Вінницька обл",
        "zt": "Житомирська обл",
        "sm": "Сумська обл",
        "dp": "Дніпропетровська обл",
        "dn": "Донецька обл",
        "kh": "Харківська обл",
        "lg": "Луганська обл",
        "pl": "Полтавська обл",
        "zp": "Запорізька обл",
        "ks": "Херсонська обл"
}

function init() {
    setMap();
}

function setMap() {
    loadData();
}

function loadData() {
    queue()
    .defer(d3.csv, "/assets/fop/debt/obl-companies.csv")  
    .defer(d3.csv, "/assets/fop/debt/fop-otrasli.csv")  
    .defer(d3.json, "/assets/fop/infographics/ukraine.json")  
    .defer(d3.csv, "/assets/fop/debt/obl-fop.csv")  
    .defer(d3.csv, "/assets/fop/debt/komp-otrasli.csv")  
    .defer(d3.csv, "/assets/fop/debt/chart-fop.csv") 
    .defer(d3.csv, "/assets/fop/debt/chart-companies.csv") 
    .defer(d3.csv, "/assets/fop/debt/odb-users.csv") 
    .defer(d3.csv, "/assets/fop/debt/odb-notifications.csv") 
    .defer(d3.csv, "/assets/fop/debt/activity-companies.csv") 
    .defer(d3.csv, "/assets/fop/debt/activity-fop.csv") 
    .defer(d3.csv, "/assets/fop/debt/debt-overall.csv") 
    .await(processData);  
}


function processData(error, statsMap, fopClasses, mapData, statsMap2, kompClasses, chart1Data, chart2Data, odbUsers, odbNotifications, activityCompanies, activityFop, debtOverall) {
    if (error) return console.error(error);

    var template = _.template(d3.select('#tooltip-template').html());

    var formats = {
        sum: d3.format(",.2r")
    };
    

    var margin = {top: 10, left: 30, bottom: 10, right: 10}
        , width = parseInt(d3.select('#map').style('width'))
        , width = width - margin.left - margin.right
        , mapRatio = .7
        , height = width * mapRatio;



    var geometry_center =  {"latitude": 48.360833, "longitude": 31.1809725};
    var geography_center = {"latitude": 49.0275, "longitude": 31.482778};

    var mapSvg1 = d3.select('#map').append('svg')
        .attr("width", width)
        .attr("height", height);

    var mapSvg2 = d3.select('#map2').append('svg')
        .attr("width", width)
        .attr("height", height);


    var colors = d3.scaleLog()
        .range(colorbrewer.YlOrRd[9]);

    colors.domain([
        d3.min(d3.values(statsMap), function(d) { return d.share-10; }), 
        d3.max(d3.values(statsMap), function(d) { return d.share+10; })
    ]);

    var projection = d3.geoConicConformal()
        .center([0, geometry_center.latitude])
        .rotate([-geometry_center.longitude, 0])
        .parallels([46, 52])  
        .scale(width*4.5)
        .translate([width / 2, height / 2]);
    var path = d3.geoPath()
        .projection(projection);

    var topo_data = null;

    function buildMap(ukraine_data, dataset, svgObject, resizeNamespace, type) {
        topo_data = ukraine_data;

        var countries = topojson.feature(ukraine_data, ukraine_data.objects.countries);

        var ukrId;
        countries.features.forEach(function(item, i, arr) {
            if (item.id == "UKR"){
                ukrId = i;
            }
        });

        svgObject.selectAll(".country")
            .data(countries.features)
        .enter().append("path")
            .filter(function(d){ return d.id == "UKR"})
            .attr("class", function(d) { return "country " + d.id; })
            .attr("d", path);

        var regions = topojson.feature(ukraine_data, ukraine_data.objects.regions);
        
        //link map and data
        regionsNames = []
        regions.features.forEach(function(item, i, arr) {
            regionsNames.push(item.id)
        });


        var totalAmountOfDebtByRegions = 0;
        for (var i in regions.features) {
            for (var j in dataset) {
                if (regionsAlignment[regions.features[i].id] == dataset[j].region){
                    regions.features[i]['regionData'] = dataset[j];
                    totalAmountOfDebtByRegions += totalAmountOfDebtByRegions + parseInt(regions.features[i]['regionData'].quantity);
                }
            }
        }

        regions.features.forEach(function(item, i, arr) {
            item.regionData.share = parseInt(item.regionData.quantity)/totalAmountOfDebtByRegions*100;
            item.regionData.type = type; 
        });

        console.log(totalAmountOfDebtByRegions);

        colors.domain([
            d3.min(d3.values(regions.features), function(d) { return d.regionData.share +  d.regionData.share*2; }), 
            d3.max(d3.values(regions.features), function(d) { return d.regionData.share ; ; })
        ]);

        console.log(d3.min(d3.values(regions.features), function(d) { return d.regionData.share; }));

        console.log(d3.max(d3.values(regions.features), function(d) { return d.regionData.share; }))

        console.log("vsego dolgov po reg" + totalAmountOfDebtByRegions);

        var regionsOnMap = svgObject.selectAll("path.region")
            .data(regions.features)
        .enter().append("path")
            .classed("region", true)
            .attr("id", function(d) { return d.id; })
            .attr("d", path)
            .style('fill', function(d) {
                return colors(d.regionData.share + d.regionData.share*30); //colors((parseInt(d.regionData.sum)/totalAmountOfDebtByRegions));
            });
        svgObject.append("path")
            .datum(topojson.mesh(ukraine_data, ukraine_data.objects.regions, function(a, b) { return a !== b; }))
            .classed("region-boundary", true)
            .attr("d", path)
        
        regionsOnMap.on('mouseover', tooltipShow)
        .on('mouseout', tooltipHide);

        function resize() {
            // adjust things when the window size changes
            width = parseInt(d3.select('#map').style('width'));
            width = width - margin.left - margin.right;
            height = width * mapRatio;
    
            // update projection
            projection
                .translate([width / 2, height / 2])
                .scale(width*4.5);
    
            // resize the map container
            svgObject
                .style('width', width + 'px')
                .style('height', height + 'px');
    
            // resize the map
            svgObject.select('.country').attr('d', path);
            svgObject.selectAll('.region').attr('d', path);
            svgObject.selectAll('.region-boundary').attr('d', path);
        }

        d3.select(window).on('resize.' + resizeNamespace, resize);
        
    };

    buildMap(mapData, statsMap, mapSvg1, "map1", "компаній");
    buildMap(mapData, statsMap2, mapSvg2, "map2", "ФОП");

    // d3js generated table barchart

    //statsClasses.items = statsClasses.items.slice(0, 10)

     var fopClassesReMapped = fopClasses.map(function(d) {
        d.active =  d.active.replace(/\s+/g, '');
        d.with_debt =  d.with_debt.replace(/\s+/g, '');

        return {
            classes: d.class,
            values: 
                 {
                    active: d.active,
                    with_debt: d.with_debt,
                    //share: d.share,
                    diff:  parseInt(d.active) - parseInt(d.with_debt)
                },
        }
    });

    var kompClassesReMapped = kompClasses.map(function(d) {
        d.active =  d.active.replace(/\s+/g, '');
        d.with_debt =  d.with_debt.replace(/\s+/g, '');

        return {
            classes: d.class,
            values: 
                 {
                    active: d.active,
                    with_debt: d.with_debt,
                    //share: d.share,
                    diff:  parseInt(d.active) - parseInt(d.with_debt)
                },
        }
    });

    function activityType(data, elementId, type) {

        data = data.slice(0, 10);

        data.forEach(function(d) {
            // d.date = parseTime(d.date);
            d.quantity = +d.quantity;
        });
        var div = d3.select(elementId);

        var maxActivityQuantity = d3.max(data, function(d) { return d.quantity; })

        console.log(maxActivityQuantity);

        names = data.map(function(entry){
            return entry.name;
        });

        activityQuantity = data.map(function(entry){
            return entry.quantity;
        });

        var activityDivs = div.selectAll('div')
            .data(data).enter()
            .append("div");

        activityDivs.attr("class", "activity-div");

        activityDivs.each(function(d) {
            d3.select(this)
                .append("div")
                .attr('class', 'activity-name')
                .html(d.name);

            d3.select(this)
                .append("div")
                .attr('class', 'activity-quantity')
                .html(d.quantity + " "+ type);

            d3.select(this)
                .append("hr")
                .attr('class', 'activity-length')
                .style("width", d.quantity/maxActivityQuantity*100 + "%");
          });

    }

    activityType(activityCompanies, "#companies-activity-container", "компаній")
    activityType(activityFop, "#fop-activity-container", "ФОП")


    function tabulate(data, elementId, columns, names) {
                var table = d3.select(elementId).append('table').attr("class", "table insert");
                var thead = table.append('thead')
                var	tbody = table.append('tbody');

                // append the header row
                thead.append('tr')
                .selectAll('th')
                .data(names).enter()
                .append('th')
                    .text(function (column) { return column; });

                // create a row for each object in the data
                var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr');

                // create a cell in each row for each column
                var cells = rows.selectAll('td')
                    .data(function (row) {
                        return columns.map(function (column) {
                        return {column: column, value: row[column]};
                        });
                    })
                    .enter()
                    .append('td');

                cells
                    .filter(function(d) { return d.column == 'classes' })
                    .text(function (d) { return d.value; }
                    );

                cells
                    .filter(function(d) { return d.column == 'values' })
                    .style("width", "50%");

                var cellDivsBase = cells
                    .filter(function(d) { return d.column == 'values' })
                    .append('div');

                cellDivsBase
                    .style('height', '25px')
                    .style('background-color', '#9BC53D')
                    .attr("class", "classesBarBase");

                cellDivsPercent = cellDivsBase
                    .append('div');

                cellDivsPercent
                    .style('height', '25px')
                    .style("width", function(d){
                        
                        var share = (parseInt(d.value.with_debt) / parseInt(d.value.active)) * 100;
                        return share + "%";
                    })
                    .style('background-color', '#E55934');

                cellDivsBase
                    .append('p')
                    .each(function(d){
                    }).append("text")
                    .text(function (d){
                        return d.value.with_debt; 
                    });

                cellDivsBase
                    .append('p')
                    .each(function(d){
                    })
                    .style("float", "right")
                    .style("color", "#111")
                    .append("text")
                    .text( function (d){
                        return d.value.diff; 
                    });

            return table;
    }

    // render the table(s)
    tabulate(fopClassesReMapped, "#classesTable1", ['classes', 'values'], ['Клас', 'З боргами / Без боргів']); 
    tabulate(kompClassesReMapped, "#classesTable2", ['classes', 'values'], ['Клас', 'З боргами / Без боргів']); 
          


    function tooltipShow(d, i) {
        var datum = d.regionData;
        console.log(datum);
        if (!datum) return;
        //datum.share = datum.share + '%'
       // datum.formats = formats;


        $(this).tooltip({
            title: template(datum),
            html: true,
            container: this.parentNode.parentNode,
            placement: 'auto'
        }).tooltip('show');

    }

    function tooltipHide(d, i) {
        $(this).tooltip('hide');
    }



    // buildCharts(generalData);
    // buildCharts2();


    /*var fopBubbleChart = bubbleChart().width(400).height(400);
    d3.select('#bubbleChart').data(topFopData).call(fopBubbleChart);*/
    // bubbleChart2(topFopData, "#bubbleChart");
    // bubbleChart2(topKompData, "#bubbleChart2");
    // bubbleChart2(topNalogData, "#bubbleChart3");
    buildChartD3(chart2Data, "#chart1");
    buildChartD3(chart1Data, "#chart2");
    buildChartD3OneLine(odbUsers, "#chart3", true)
    buildChartD3OneLine(odbNotifications, "#chart4", true)
    buildChartD3OneLine(debtOverall, "#chart-debt", false)
}
init();

function buildChartD3 (dataVar, chartId){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    chartRatio = .5,
    width = parseInt(d3.select(chartId).style("width")) - margin.left - margin.right,
    height = width * chartRatio;


    // parse the date / time
    // var parseTime = d3.timeParse("%Y");

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var x2 = d3.scalePoint().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    bisectDate = d3.bisector(function(d) { return d.month; }).left;
    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.active); });

    var valueline2 = d3.line()
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.open); });

    var valueline3 = d3.line()
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.closed); });

    const tooltipChart = d3.select('#tooltip' + chartId.substr(1));

    var svg = d3.select(chartId)
    // .append("div")
    // .classed("svg-container", true) //container class to make it responsive
    .append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//    .attr("viewBox", "0 0 600 400")
//    //class to make it responsive
//    .classed("svg-content-responsive", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          dataVar.forEach(function(d) {
            // d.date = parseTime(d.date);
            d.active = +d.active;
            d.open = +d.open;
            d.closed = +d.closed;
        });
      
        // Scale the range of the data
        x.domain([1, 12]);
        x2.domain(dataVar.map(function(entry){
            return entry.month_ticks;
        }));
        yMax = d3.max([d3.max(dataVar, function(d) { return d.open; }),d3.max(dataVar, function(d) { return d.closed; })]);
        y.domain([0, yMax]);

        var xAxis = d3.axisBottom().scale(x);
        if (Math.max(width/75, 2) < 7) {
            var ticks = x2.domain().filter(function(d,i){ return !(i%2); } );
            xAxis2 = d3.axisBottom().tickValues(ticks).scale(x2);
        }
        else {
            xAxis2 = d3.axisBottom().scale(x2);
        }
        var yAxis = d3.axisLeft().scale(y)
            .tickSizeInner(-width)
            .tickSizeOuter(0);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        xAxis.ticks(Math.max(width/75, 2));
        yAxis.ticks(Math.max(height/50, 2));
        // svg.append("path")
        //     .data(dataVar)
        //     .attr("class", "line")
        //     .attr("stroke", "#F9C746")
        //     .attr("d", function(d) { return valueline(dataVar); });
            
        svg.append("path")
            .data(dataVar)
            .attr("class", "line open")
            .attr("stroke", "#306B34")
            .attr("d", function(d) { return valueline2(dataVar); });

        svg.append("g").selectAll("line-circle")
            .data(dataVar)
            .enter().append("circle")
            .attr("class", "data-circle open-circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.month); })
            .attr("cy", function(d) { return y(d.open); });

        svg.append("path")
            .data(dataVar)
            .attr("class", "line closed")
            .attr("stroke", "#A4031F")
            .attr("d", function(d) { return valueline3(dataVar); });

        svg.append("g").selectAll("line-circle")
            .data(dataVar)
            .enter().append("circle")
            .attr("class", "data-circle closed-circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.month); })
            .attr("cy", function(d) { return y(d.closed); });
        

        var focusOpen = svg.append("g")
            .attr("class", "focus open-focus")
            .style("display", "none");

        var focusClosed = svg.append("g")
            .attr("class", "focus closed-focus")
            .style("display", "none");
        
        // var div = focus
        //     .append("div")  
        //     .attr("class", "tooltip")              
        //     .style("opacity", 0); 
        
        focusOpen.append("circle")
            .attr("r", 5.5);

        focusClosed.append("circle")
            .attr("r", 5.5);
        
        var initialElement = dataVar[dataVar.length-1];
        focusOpen.attr("transform", "translate(" + x(initialElement.month) + "," + y(initialElement.open) + ")");
        focusClosed.attr("transform", "translate(" + x(initialElement.month) + "," + y(initialElement.closed) + ")");

        tooltipChart.select(".open-placeholder").html(
            initialElement.open
        );

        tooltipChart.select(".closed-placeholder").html(
            initialElement.closed
        );

        tooltipChart.select(".month-label").html(
            initialElement.month_ticks
        );
    
        
    
        var overlay = svg.append("rect")
            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focusOpen.style("display", null); focusClosed.style("display", null);})
            .on("mouseout", function() { focusOpen.style("display", "none"); focusClosed.style("display", "none");})
            .on("mousemove", mousemove);

        focusOpen.style("display", null);
        focusClosed.style("display", null);
        

        var templateChart = _.template(d3.select('#tooltip-template-chart').html());
    
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataVar, x0, 1),
                d0 = dataVar[i - 1],
                d1 = dataVar[i],
                d = x0 - d0.month > d1.month - x0 ? d1 : d0;
            focusOpen.attr("transform", "translate(" + x(d.month) + "," + y(d.open) + ")");
            focusClosed.attr("transform", "translate(" + x(d.month) + "," + y(d.closed) + ")");
            // focus.select("text").text(function() { return d.date; });
            // tooltipChart

            //     .style('display', 'block')
            //     .style('left', d3.event.pageX + "px")
            //     .style('top', d3.event.pageY - 20 + "px");
            tooltipChart.select(".open-placeholder").html(
                d.open
            );

            tooltipChart.select(".closed-placeholder").html(
                d.closed
            );

            tooltipChart.select(".month-label").html(
                d.month_ticks
            );
        }
        
    

    function resizeChart() {
      var width = parseInt(d3.select(chartId).style("width")) - margin.left - margin.right,
      height = parseInt(d3.select(chartId).style("height")) - margin.top - margin.bottom;
      svg.style("height", height);

      // Update the range of the scale with new width/height
      x.range([0, width]);
      x2.range([0, width]);
      y.range([height, 0]);

      overlay
      .attr("width", width)
      .attr("height", height);
        console.log(Math.max(width/75, 2));
    if (Math.max(width/75, 2) < 7) {
      var ticks = x2.domain().filter(function(d,i){ return !(i%2); } );
      xAxis2 = d3.axisBottom().tickValues(ticks).scale(x2);
    }
    else {
        xAxis2 = d3.axisBottom().scale(x2);
    }

    console.log(ticks);

    yAxis = d3.axisLeft().scale(y)
            .tickSizeInner(-width)
            .tickSizeOuter(0)
            .ticks(Math.max(height/50, 2));

      // Update the axis and text with the new scale
      svg.select(chartId +' .x.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

      svg.select(chartId +' .y.axis')
        .call(yAxis);

    

      // Force D3 to recalculate and update the line
      svg.selectAll(chartId +' .line.open')
        .attr("d", function(d) { return valueline2(dataVar); });
    
    svg.selectAll(chartId +' .line.closed')
        .attr("d", function(d) { return valueline3(dataVar); });

    svg.selectAll(chartId +" .data-circle.open-circle")
    .attr("cx", function(d) { return x(d.month); })
    .attr("cy", function(d) { return y(d.open); });    

    svg.selectAll(chartId +" .data-circle.closed-circle")
    .attr("cx", function(d) { return x(d.month); })
    .attr("cy", function(d) { return y(d.closed); });  

      // Update the tick marks
      xAxis.ticks(Math.max(width/75, 2));
      yAxis.ticks(Math.max(height/50, 2))
      .tickSizeInner(-width)
            .tickSizeOuter(0);

    };

    // Call the resize function whenever a resize event occurs
    d3.select(window).on('resize.'+ chartId.substr(1), resizeChart);

    // Call the resize function
    // resizeChart();
}

function buildChartD3OneLine (dataVar, chartId, fromZero){
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    chartRatio = .5,
    width = parseInt(d3.select(chartId).style("width")) - margin.left - margin.right,
    height = width * chartRatio;


    // parse the date / time
    // var parseTime = d3.timeParse("%Y");

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var x2 = d3.scalePoint().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    bisectDate = d3.bisector(function(d) { return d.month; }).left;
    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.quantity); });

    const tooltipChart = d3.select('#tooltip' + chartId.substr(1));

    var svg = d3.select(chartId)
    // .append("div")
    // .classed("svg-container", true) //container class to make it responsive
    .append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//    .attr("viewBox", "0 0 600 400")
//    //class to make it responsive
//    .classed("svg-content-responsive", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          dataVar.forEach(function(d) {
            // d.date = parseTime(d.date);
            d.quantity = +d.quantity;
        });
      
        // Scale the range of the data
        x.domain([1, 12]);
        x2.domain(dataVar.map(function(entry){
            return entry.month_ticks;
        }));
        if (fromZero == true){
            y.domain([0, d3.max(dataVar, function(d) { return d.quantity; })]);
        }
        else {
            var min = d3.min(dataVar, function(d) { return d.quantity; });
            y.domain([min - min*0.05, d3.max(dataVar, function(d) { return d.quantity; })]);
        }

        var xAxis = d3.axisBottom().scale(x);
        if (Math.max(width/75, 2) < 7) {
            var ticks = x2.domain().filter(function(d,i){ return !(i%2); } );
            xAxis2 = d3.axisBottom().tickValues(ticks).scale(x2);
        }
        else {
            xAxis2 = d3.axisBottom().scale(x2);
        }
        var yAxis = d3.axisLeft().scale(y)
            .tickSizeInner(-width)
            .tickSizeOuter(0);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        xAxis.ticks(Math.max(width/75, 2));
        yAxis.ticks(Math.max(height/50, 2));
        // svg.append("path")
        //     .data(dataVar)
        //     .attr("class", "line")
        //     .attr("stroke", "#F9C746")
        //     .attr("d", function(d) { return valueline(dataVar); });
            
        svg.append("path")
            .data(dataVar)
            .attr("class", "line odb")
            .attr("stroke", "#0066ff")
            .attr("d", function(d) { return valueline(dataVar); });

        svg.append("g").selectAll("line-circle")
            .data(dataVar)
            .enter().append("circle")
            .attr("class", "data-circle odb-circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.month); })
            .attr("cy", function(d) { return y(d.quantity); });
        

        var focusOpen = svg.append("g")
            .attr("class", "focus odb")
            .style("display", "none");
        
        // var div = focus
        //     .append("div")  
        //     .attr("class", "tooltip")              
        //     .style("opacity", 0); 
        
        focusOpen.append("circle")
            .attr("r", 5.5);
        
        var initialElement = dataVar[dataVar.length-1];
        focusOpen.attr("transform", "translate(" + x(initialElement.month) + "," + y(initialElement.quantity) + ")");
    

        tooltipChart.select(".odb-placeholder").html(
            initialElement.quantity
        );

        tooltipChart.select(".month-label").html(
            initialElement.month_ticks
        );
    
        
    
        var overlay = svg.append("rect")
            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focusOpen.style("display", null);})
            .on("mouseout", function() { focusOpen.style("display", "none");})
            .on("mousemove", mousemove);

        focusOpen.style("display", null);
        

        var templateChart = _.template(d3.select('#tooltip-template-chart').html());
    
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataVar, x0, 1),
                d0 = dataVar[i - 1],
                d1 = dataVar[i],
                d = x0 - d0.month > d1.month - x0 ? d1 : d0;
            focusOpen.attr("transform", "translate(" + x(d.month) + "," + y(d.quantity) + ")");
            // focus.select("text").text(function() { return d.date; });
            // tooltipChart

            //     .style('display', 'block')
            //     .style('left', d3.event.pageX + "px")
            //     .style('top', d3.event.pageY - 20 + "px");
            tooltipChart.select(".odb-placeholder").html(
                d.quantity
            );

            tooltipChart.select(".month-label").html(
                d.month_ticks
            );

        }
        
    

    function resizeChart() {
      var width = parseInt(d3.select(chartId).style("width")) - margin.left - margin.right,
      height = parseInt(d3.select(chartId).style("height")) - margin.top - margin.bottom;
      svg.style("height", height);

      // Update the range of the scale with new width/height
      x.range([0, width]);
      x2.range([0, width]);
      y.range([height, 0]);

      overlay
      .attr("width", width)
      .attr("height", height);

    yAxis = d3.axisLeft().scale(y)
            .tickSizeInner(-width)
            .tickSizeOuter(0);
            // .ticks(Math.max(width/75, 2));;

    if (Math.max(width/75, 2) < 7) {
      var ticks = x2.domain().filter(function(d,i){ return !(i%2); } );
      xAxis2 = d3.axisBottom().tickValues(ticks).scale(x2);
    }
    else {
        xAxis2 = d3.axisBottom().scale(x2);
    }

      // Update the axis and text with the new scale
      svg.select(chartId +' .x.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

      svg.select(chartId +' .y.axis')
        .call(yAxis);

    

      // Force D3 to recalculate and update the line
      svg.selectAll(chartId +' .line.odb')
        .attr("d", function(d) { return valueline(dataVar); });
    

    svg.selectAll(chartId +" .data-circle.odb-circle")
    .attr("cx", function(d) { return x(d.month); })
    .attr("cy", function(d) { return y(d.quantity); });    


      // Update the tick marks
      xAxis.ticks(Math.max(width/75, 2));
      yAxis.ticks(Math.max(height/50, 2))
      .tickSizeInner(-width)
            .tickSizeOuter(0);

    };

    // Call the resize function whenever a resize event occurs
    d3.select(window).on('resize.'+ chartId.substr(1), resizeChart);

    // Call the resize function
    // resizeChart();
}


// get data image

// function renderCanvas(){


//     var style = "\n";
//     var requiredSheets = ['infographics.css', 'bootstrap.min.css']; // list of required CSS
//     for (var i=0; i<document.styleSheets.length; i++) {
//         var sheet = document.styleSheets[i];
//         if (sheet.href) {
//             var sheetName = sheet.href.split('/').pop();
//             if (requiredSheets.indexOf(sheetName) != -1) {
//                 var rules = sheet.rules;
//                 if (rules) {
//                     for (var j=0; j<rules.length; j++) {
//                         style += (rules[j].cssText + '\n');
//                     }
//                 }
//             }
//         }
//     }  

//     console.log(style);

//     var defs = document.createElement('div');
//     defs.setAttribute("id", "defs");
//     document.body.insertBefore(defs, document.body.firstChild);
//     d3.select("#defs")
//         .append('style')
//         .attr('type','text/css')
//         .html(style);


//     elemToRender = document.getElementById("open-close-wrapper");
//     html2canvas(elemToRender).then(function(canvas) {
//         document.body.appendChild(canvas);

//         var dataURL = canvas.toDataURL();

//         console.log(dataURL);
//     });


// }

// function expandContainer(){
//     var infContainer = document.getElementById("infContainer");

//     var chartWrapper = document.querySelector("#open-close-wrapper .chart-wrapper");

//     //var widthPercent = 100;

//     infContainer.style.width = "1200px";
//     chartWrapper.style.height = "600px";
// }



// d3.select('#infContainer')
//     .append("button")
//     .on("click", expandContainer)
//     .attr('class', 'btn btn-success')
//     .text("Expand");

// d3.select('#infContainer')
//     .append("button")
//     .on("click",renderCanvas)
//     .attr('class', 'btn btn-success')
//     .text("Make Canvas");


// function buildCharts(data){

//     console.log(data);

//     var months = data.map(function(id) {
//         return id.month;
//     });
//     var to_state = data.map(function(id) {
//         return id.to_state;
//     });
//     var to_local = data.map(function(id) {
//         return id.to_local;
//     });
//     var dynamics = data.map(function(id) {
//         return id.dynamics;
//     });

//     console.log(dynamics);
//     var options = {
//       type: 'bar',
//       data: {
//         labels: months,
//         datasets: [{
//             type: 'bar',
//           fill: false,
//           label: 'Борги державномю бюджету',
//           data: to_state,
//           borderColor: '#9BC53D',
//           borderWidth: 3,
//           pointRadius: 2,
//           pointBackgroundColor: '#9BC53D',
//           backgroundColor: '#9BC53D',
//           pointHitRadius: 7,
//         }, {
//           fill: false,
//           type: 'bar',
//           label: 'Борги місцевим бюджетам',
//           data: to_local,
//           borderColor: '#E55934',
//           borderWidth: 3,
//           pointRadius: 2,
//           pointBackgroundColor: '#E55934',
//           backgroundColor: '#E55934',
//           pointHitRadius: 7,
//         },
//         ]
//       },
//       options: {
//         tooltips: {
//             bodySpacing: 6,
//             intersect: true,
//             mode: 'index',
//             /*callbacks: {
//                 title: function(tooltipItems, data) {
                  
//                     return moment(data.labels[tooltipItems[0].index]).format('DD MMMM YYYY');
//                 },

//                 label: function(tooltipItems, data) {
//                     return " " +  data.datasets[tooltipItems.datasetIndex].label + ": " +
//                     Math.abs(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) +
//                     ' ФОП';
//                 }
//             }*/
//         },
//         maintainAspectRatio: false,
//         legend: {
//             position: 'bottom'
//         },
//         scales: {
//           xAxes: [{
//                     stacked: true,
//             gridLines: {
//               display: false
//             },
//           }],
//           yAxes: [{
//               stacked: true,
//             gridLines: {
//               borderDash: [3, 3]
//             },
//           }]
//         },
//       }
//     };


//     var ctx = document.getElementById('debtChart').getContext('2d');

//     var myChart = new Chart(ctx, options, {
//         tooltipEvents: ["mousemove", "touchstart", "touchmove"],
//     });
// }

// function buildCharts2(){

//     options = {
//         type: 'doughnut',
//         data: {
//             labels: [
//                 "Компаній з боргами",
//                 "Компаній без боргів",
//             ],
//             datasets: [
//                 {
//                     data: [135926, 1498036 - 135926],
//                     backgroundColor: [
//                         "#FF6384",
//                         "#36A2EB",
//                         "#FFCE56"
//                     ],
//                     hoverBackgroundColor: [
//                         "#FF6384",
//                         "#36A2EB",
//                         "#FFCE56"
//                     ]
//                 }]
//         },
//         options: {
//             tooltips: {
//                 callbacks: {
//                     title: function(tooltipItems, data) {
                    
//                         return data.labels[tooltipItems[0].index];
//                     },

//                     label: function(tooltipItems, data) {
//                         return " " +
//                         Math.abs(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) +
//                         " (" + Math.floor(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]/1498036*10000)/100 + "%)";
//                     }
//                 },
//             },
//             maintainAspectRatio: false,
//             legend: {
//                 position: 'bottom'
//             },
//         }
//     };

//     var ctx = document.getElementById('debtChart2').getContext('2d');

//     var myChart = new Chart(ctx, options, {
//         tooltipEvents: ["mousemove", "touchstart", "touchmove"],
//     });
// }


// function bubbleChart() {

//     var template = _.template(d3.select('#tooltip-template2').html());

//     var width = 960,
//         height = 960,
//         maxRadius = 6,
//         columnForColors = "category",
//         columnForRadius = "debt";

//     function chart(selection) {
//         var data = selection.enter().data();
//         var div = selection,
//             svg = selection.append('svg');
//         svg.attr('width', width).attr('height', height);

//         var totalDebtAmount = 0;

//         data.forEach(function(item, i, arr) {
//             totalDebtAmount += parseInt(item.debt);
//         });

//         data.forEach(function(item, i, arr) {
//             item.share = parseInt(item.debt)/totalDebtAmount;
//         });

//         console.log(data);

//         /*var tooltip = selection
//             .append("div")
//             .style("position", "absolute")
//             .style("visibility", "hidden")
//             .style("color", "white")
//             .style("padding", "8px")
//             .style("background-color", "#626D71")
//             .style("border-radius", "6px")
//             .style("text-align", "center")
//             .style("font-family", "monospace")
//             .style("width", "400px")
//             .text("");*/

//         console.log(data);
//         var simulation = d3.forceSimulation(data)
//             .force("charge", d3.forceManyBody().strength([-30]))
//             .force("x", d3.forceX())
//             .force("y", d3.forceY())
//             .on("tick", ticked);

//         function ticked(e) {
//             node.attr("cx", function(d) {
//                     return d.x;
//                 })
//                 .attr("cy", function(d) {
//                     return d.y;
//                 });
//         }

//         var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);

//         var colors = d3.scaleSqrt()
//             .range(colorbrewer.YlOrRd[9]);

//         colors.domain([
//             0, 
//             d3.max(data, function(d) { return d.share; })
//         ]);
//         var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
//             return +d[columnForRadius];
//         }), d3.max(data, function(d) {
//             return +d[columnForRadius];
//         })]).range([5, 15])

//         var node = svg.selectAll("circle")
//             .data(data)
//             .enter()
//             .append("circle")
//             .attr('r', function(d) {
//                 return scaleRadius(d[columnForRadius])
//             })
//             .style("fill", function(d) {
//                 return colors(d.share * 100)
//             })
//             .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
//             .on('mouseover', tooltipShow)
//             .on('mouseout', tooltipHide);
//     }

//     chart.width = function(value) {
//         if (!arguments.length) {
//             return width;
//         }
//         width = value;
//         return chart;
//     };

//     chart.height = function(value) {
//         if (!arguments.length) {
//             return height;
//         }
//         height = value;
//         return chart;
//     };


//     chart.columnForColors = function(value) {
//         if (!arguments.columnForColors) {
//             return columnForColors;
//         }
//         columnForColors = value;
//         return chart;
//     };

//     chart.columnForRadius = function(value) {
//         if (!arguments.columnForRadius) {
//             return columnForRadius;
//         }
//         columnForRadius = value;
//         return chart;
//     };

//     function tooltipShow(d, i) {
//         if (!d) return;
//         //datum.share = datum.share + '%'
//        // datum.formats = formats;


//         $(this).tooltip({
//             title: template(d),
//             html: true,
//             container: this.parentNode.parentNode,
//             placement: 'auto'
//         }).tooltip('show');

//     }

//     function tooltipHide(d, i) {
//         $(this).tooltip('hide');
//     }

//     return chart;
// }


// function bubbleChart2(data, elementId){

    

//      var template = _.template(d3.select('#tooltip-template2').html());

//      var totalDebtAmount = 0;

//     data.forEach(function(item, i, arr) {
//         totalDebtAmount += parseInt(item.debt);
//     });

//     data.forEach(function(item, i, arr) {
//         item.share = parseInt(item.debt)/totalDebtAmount;
//     });

//     var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);

//     var colors = d3.scaleSqrt()
//         .range(colorbrewer.YlOrRd[9]);

//     colors.domain([
//         0, 
//         d3.max(data, function(d) { return d.share; })
//     ]);

//     width = 600; //+svg.attr("width"),
//     height = 600; //+svg.attr("height");
//     var svg = d3.select(elementId).append("svg")
//     .attr("width", width)
//         .attr("height", height);

// var format = d3.format(",d");

// var color = d3.scaleOrdinal(d3.schemeCategory20c);

// var pack = d3.pack()
//     .size([width, height])
//     .padding(1.5);



//   var root = d3.hierarchy({children: data})
//       .sum(function(d) { return d.debt; })
//       .each(function(d) {
//         /*if (id = d.data.id) {
//           var id, i = id.lastIndexOf(".");
//           d.id = id;
//           d.package = id.slice(0, i);
//           d.class = id.slice(i + 1);
//         }*/
        
//         d.id = name.replace(/\s+/g, '');
        
//       });

//       console.log(root);
//   var node = svg.selectAll(".node")
//     .data(pack(root).leaves())
//     .enter().append("g")
//       .attr("class", "node")
//       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

//   node.append("circle")
//       .attr("id", function(d) { return d.id; })
//       .attr("r", function(d) { return d.r; })
//       .style("fill", function(d) { return colors(d.data.share * 15); })

//   /*node.append("clipPath")
//       .attr("id", function(d) { return "clip-" + d.data.name.replace(/\s+/g, ''); })
//     .append("use")
//       .attr("xlink:href", function(d) { return "#" + d.data.name.replace(/\s+/g, ''); });*/

//   node.filter(function(d) {  return d.r > 20;})
//   .append("text")
//     /* .attr("clip-path", function(d) { return "url(#clip-" + d.data.name.replace(/\s+/g, '') + ")"; })*/
//     .selectAll("tspan")
//     .data(function(d) { return d.data.debt.split(/(?=[A-Z][^A-Z])/g); })
//     .enter().append("tspan")
//       .attr("x", function(d, i, nodes) { console.log(this.clientWidth); return -16;})
//       .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
//       .text(function(d) { return d; })
//       .attr("font-size", "10px");

//       node
//       .on('mouseover', tooltipShow)
//         .on('mouseout', tooltipHide);

//   /*node.append("title")
//       .text(function(d) { return d.id + "\n" + format(d.value); });*/

//     function tooltipShow(d, i) {
//         if (!d) return;
//         datum = d.data;
//         console.log(d.data);
//        // datum.formats = formats;


//         $(this).tooltip({
//             title: template(datum),
//             html: true,
//             container: this.parentNode.parentNode,
//             placement: 'auto'
//         }).tooltip('show');

//     }

//     function tooltipHide(d, i) {
//         $(this).tooltip('hide');
//     }


// }