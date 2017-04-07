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
        .defer(d3.json, "/assets/fop/ukraine.json")  
        .await(processData);  
    }


    function processData(error, statsMap, statsClasses, mapData) {
        if (error) return console.error(error);

    var template = _.template(d3.select('#tooltip-template').html());

    var colors = d3.scale.quantize()
        .range(colorbrewer.YlOrRd[7]);

    colors.domain([
        0, 
        d3.max(d3.values(statsMap.items), function(d) { return d.share + 10; })
    ]);
    

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

    var projection = d3.geo.conicEqualArea()
        .center([0, geometry_center.latitude])
        .rotate([-geometry_center.longitude, 0])
        .parallels([46, 52])  // vsapsai: selected these parallels myself, most likely they are wrong.
        .scale(width*4.5)
        .translate([width / 2, height / 2]);
    var path = d3.geo.path()
        .projection(projection);

    var topo_data = null;

    d3.json("/assets/fop/ukraine.json", function(error, ukraine_data) {
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
        
    });

    console.log(typeof(statsClasses));


     var statsClassesReMapped = statsClasses.items.map(function(d) {
        
        return {
            classes: d.number,
            values: 
                 {
                    active: d.active,
                    closed: d.count,
                    share: d.share,
                    //value: d["y"+year],
                },
        }
    });

    console.log(statsClassesReMapped);


    console.log('Mobile: ' + mobile);
    //create classes table
        data = statsClasses.items;
         console.log(data);
        function tabulate(data, columns, names) {
                var table = d3.select('#classesTable').append('table').attr("class", "table insert");
                var thead = table.append('thead')
                var	tbody = table.append('tbody');

                // append the header row
                thead.append('tr')
                .selectAll('th')
                .data(names).enter()
                .append('th')
                    .text(function (column) { return column; })
                     .filter(function(d) { return d != 'Клас' })
                    .attr("class", "text-right");;

            

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
                .append('td')
                    .text(function (d) { return d.value; }
                    );
                
                cells
                    .filter(function(d) { return d.column == 'number' })
                    .style("width", '60%')

                cells
                    .filter(function(d) { return d.column == 'share' })
                    .style('backgroud-color', function(d) {
                        return colors(d.value);
                    });

                cells
                    .filter(function(d) { return d.column != 'number' })
                    .attr("class", "text-right");

                    

                thead
                    .filter(function(d) { return d != 'Клас' })
                    .attr("class", "text-right");

                console.log(thead);

            return table;
            }

            // render the table(s)
            //tabulate(data, ['number', 'values'], ['Клас', 'Частка (%)']); 
            tabulate(data, ['number', 'active', 'count', 'share'], ['Клас', 'Було', 'Закрилось', 'Частка (%)']); // 2 column table


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
        /*width = parseInt(d3.select('#map').style('width'));
        width = width - margin.left - margin.right;
        height = width * mapRatio;

        // update projection
        projection
            .translate([width / 2, height / 2])
            .scale(width);

        // resize the map container
        map
            .style('width', width + 'px')
            .style('height', height + 'px');

        // resize the map
        map.select('.land').attr('d', path);
        map.selectAll('.state').attr('d', path);*/
    }
    

    }
    init();


