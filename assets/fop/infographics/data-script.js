moment.locale('uk');

// number of weeks to cut from the end of dataset
var weeksToFollow = 15;

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

console.log('start');

getJSON('https://opendatabot.com/api/statistics/FOPOpenClose',
function(err, rawData) {
  if (err != null) {
    console.log('Something went wrong');
  } else {

    // filtering data 
    date = rawData.map(function(id) {
        return id.date;
    });
    count_close = rawData.map(function(id) {
        return id.count_close;
    });

    countTotal = rawData.map(function(id) {
        return id.total;
      });

    count_new = rawData.map(function(id) {
        return id.count_new;
    });

    var min = Math.min.apply(null, count_close),
    max = Math.max.apply(null, count_close);


    var options = {
      type: 'line',
      data: {
        labels: date.slice(-weeksToFollow, date.length),
        datasets: [{
          fill: false,
          label: 'Відкрито',
          data: count_new.slice(-weeksToFollow, count_new.length),
          borderColor: '#9BC53D',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#9BC53D',
          backgroundColor: '#9BC53D',
          pointHitRadius: 7,
        }, {
          fill: false,
          label: 'Закрито',
          data: count_close.slice(-weeksToFollow, count_close.length),
          borderColor: '#E55934',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#E55934',
          backgroundColor: '#E55934',
          pointHitRadius: 7,
        }]
      },
      options: {
        tooltips: {
            bodySpacing: 6,
            intersect: true,
            mode: 'index',
            callbacks: {
                title: function(tooltipItems, data) {
                  
                    return moment(data.labels[tooltipItems[0].index]).format('DD MMMM YYYY');
                },

                label: function(tooltipItems, data) {
                    return " " +  data.datasets[tooltipItems.datasetIndex].label + ": " +
                    Math.abs(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) +
                    ' ФОП';
                }
            }
        },
        maintainAspectRatio: false,
        legend: {
            position: 'bottom'
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },

              ticks: {
              maxRotation: 0,
                stepSize:400,
                autoSkip: true,
                maxTicksLimit: 5,

                callback: function(value, index, values) {
                        return moment(value).format("MMMM");
                },

            },
            afterFit: function(humdaysChart) {    
                  humdaysChart.ticks.pop();
                  humdaysChart.ticks.pop();
            }
          }],
          yAxes: [{
            gridLines: {
              borderDash: [3, 3]
            },
          }]
        },
      }
    };

    var options2 = {
      type: 'line',
      data: {
        labels: date.slice(-weeksToFollow, date.length),
        datasets: [{
          fill: false,
          label: 'Зареєстровано',
          data: countTotal.slice(-weeksToFollow, countTotal.length),
          borderColor: '#9BC53D',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#9BC53D',
          backgroundColor: '#9BC53D',
          pointHitRadius: 7,
        }]
      },
      
      options: {
        
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        tooltips: {
            bodySpacing: 6,
            intersect: true,
            mode: 'index',
            callbacks: {
                title: function(tooltipItems, data) {
                  
                    return moment(data.labels[tooltipItems[0].index]).format('DD MMMM YYYY');
                },

                label: function(tooltipItems, data) {
                    return " " +  data.datasets[tooltipItems.datasetIndex].label + ": " +
                    Math.abs(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) +
                    ' ФОП';
                }
            }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },

            ticks: {
              maxRotation: 0,
                stepSize:400,
                autoSkip: true,
                maxTicksLimit: 5,

                callback: function(value, index, values) {
                        return moment(value).format("MMMM");
                },

            },
            afterFit: function(humdaysChart) {    
                  humdaysChart.ticks.pop();
                  humdaysChart.ticks.pop();

                }
          }],
          yAxes: [{
            gridLines: {
              borderDash: [3, 3]
            },
            ticks: {
              min: 1700000
            }
          }]
        },
        /*annotation: {
          annotations: [{
            id: 'a-line-1', // optional
            type: 'line',
            mode: 'vertical',
            scaleID: 'y-axis-0',
            value: '25',
            borderColor: 'red',
            borderWidth: 2,

            // Fires when the user clicks this annotation on the chart
            // (be sure to enable the event in the events array below).
            onClick: function(e) {
              // `this` is bound to the annotation element
            }
          }],

          // Defines when the annotations are drawn.
          // This allows positioning of the annotation relative to the other
          // elements of the graph.
          //
          // Should be one of: afterDraw, afterDatasetsDraw, beforeDatasetsDraw
          // See http://www.chartjs.org/docs/#advanced-usage-creating-plugins
          drawTime: 'afterDraw', // (default)

          // Mouse events to enable on each annotation.
          // Should be an array of one or more browser-supported mouse events
          // See https://developer.mozilla.org/en-US/docs/Web/Events
          events: ['click'],

          // Double-click speed in ms used to distinguish single-clicks from 
          // double-clicks whenever you need to capture both. When listening for
          // both click and dblclick, click events will be delayed by this
          // amount.
          dblClickSpeed: 350 // ms (default)
        }*/
      }
    };

    

    var ctx = document.getElementById('openCloseChart').getContext('2d');

    
    var myChart = new Chart(ctx, options, {
        tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    });

    var ctx2 = document.getElementById('qChart').getContext('2d');
    var myChart2 = new Chart(ctx2, options2, {
        tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    });
  }
});

var mobile = false;

if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  mobile = true;
  // viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0,window.screen.availHeight);
  // console.log(document.documentElement,window,window.screen.availHeight);
}


regionsAlignment = {
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
        "kr": "Херсонська",
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

function init() {
    setMap();
}

function setMap() {
    loadData();
}

function loadData() {
    queue()
    .defer(d3.json, "https://opendatabot.com/api/statistics/CloseFop")  
    .defer(d3.json, "https://opendatabot.com/api/statistics/CloseFopClasses")  
    .defer(d3.json, "/assets/fop/infographics/ukraine.json")  
    .await(processData);  
}


function processData(error, statsMap, statsClasses, mapData) {
    if (error) return console.error(error);

    var template = _.template(d3.select('#tooltip-template').html());
    

    var margin = {top: 10, left: 10, bottom: 10, right: 10}
        , width = parseInt(d3.select('#map').style('width'))
        , width = width - margin.left - margin.right
        , mapRatio = .7
        , height = width * mapRatio;



    var geometry_center =  {"latitude": 48.360833, "longitude": 31.1809725};
    var geography_center = {"latitude": 49.0275, "longitude": 31.482778};

    var svg = d3.select('#map').append('svg')
        .attr("width", width)
        .attr("height", height);

    d3.select(window).on('resize', resize);

    var colors = d3.scale.quantize()
        .range(colorbrewer.YlOrRd[7]);

    colors.domain([
        0, 
        d3.max(d3.values(statsMap.items), function(d) { return d.share + 10; })
    ]);

    var projection = d3.geo.conicEqualArea()
        .center([0, geometry_center.latitude])
        .rotate([-geometry_center.longitude, 0])
        .parallels([46, 52])  
        .scale(width*4.5)
        .translate([width / 2, height / 2]);
    var path = d3.geo.path()
        .projection(projection);

    var topo_data = null;

    function buildMap(ukraine_data) {
        topo_data = ukraine_data;


        var countries = topojson.feature(ukraine_data, ukraine_data.objects.countries);

        var ukrId;
        countries.features.forEach(function(item, i, arr) {
            if (item.id == "UKR"){
                ukrId = i;
            }
        });



        svg.selectAll(".country")
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

        for (var i in regions.features) {
            for (var j in statsMap.items) {
                if (regionsAlignment[regions.features[i].id] == statsMap.items[j].region){
                    regions.features[i]['regionData'] = statsMap.items[j];
                }
            }
        }

        var regionsOnMap = svg.selectAll("path.region")
            .data(regions.features)
        .enter().append("path")
            .classed("region", true)
            .attr("id", function(d) { return d.id; })
            .attr("d", path)
            .style('fill', function(d) {
                return colors(d.regionData.share);
            });
        svg.append("path")
            .datum(topojson.mesh(ukraine_data, ukraine_data.objects.regions, function(a, b) { return a !== b; }))
            .classed("region-boundary", true)
            .attr("d", path)
        
        regionsOnMap.on('mouseover', tooltipShow)
        .on('mouseout', tooltipHide);
        
    };

    buildMap(mapData);

    // d3js generated table barchart

    statsClasses.items = statsClasses.items.slice(0, 10)

     var statsClassesReMapped = statsClasses.items.map(function(d) {
        return {
            classes: d.number,
            values: 
                 {
                    active: d.active,
                    closed: d.count,
                    share: d.share,
                    diff: d.diff
                },
        }
    });


    console.log('Mobile: ' + mobile);
    //create classes table
        //data = statsClasses.items;
    data = statsClassesReMapped

    function tabulate(data, columns, names) {
                var table = d3.select('#classesTable').append('table').attr("class", "table insert");
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
                        return d.value.share + "%";
                    })
                    .style('background-color', '#E55934');

                cellDivsBase
                    .append('p')
                    .each(function(d){
                    }).append("text")
                    .text(function (d){
                        return d.value.closed; 
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
    tabulate(data, ['classes', 'values'], ['Клас', 'Закрилось / Активно']); 
          


    function tooltipShow(d, i) {
        var datum = d.regionData;
        if (!datum) return;
        datum.share = datum.share + '%'
        /*datum.formats = formats;*/

        $(this).tooltip({
            title: template(datum),
            html: true,
            container: svg.node().parentNode,
            placement: 'auto'
        }).tooltip('show');

    }

    function tooltipHide(d, i) {
        $(this).tooltip('hide');
    }


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
        svg
            .style('width', width + 'px')
            .style('height', height + 'px');

        // resize the map
        svg.select('.country').attr('d', path);
        svg.selectAll('.region').attr('d', path);
        svg.selectAll('.region-boundary').attr('d', path);
    }
}
init();



