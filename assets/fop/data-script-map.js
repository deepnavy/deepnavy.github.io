window.onload = function () {

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
        .defer(d3.json, "https://opendatabot.com/api/statistics/CloseFop")  // карта в topoJSON-формате
        .defer(d3.json, "/assets/fop/ukraine.json")  
        .await(processData);  // обработка загруженных данных
    }

    /*var width, height, svg, path;

    width = 818, height = 400;*/

    function processData(error, stats, mapData) {
        if (error) return console.error(error);
        console.log(stats);
        console.log(mapData);

        /*svg = d3.select('#map').append('svg')
            .attr('width', width)
            .attr('height', height);

        var mercator = d3.geo.mercator()
            .scale(450)
            .translate([120, height / 2 + 400]);

        var path = d3.geo.path().projection(mercator);

        var world = topojson.feature(mapData, mapData.objects.ukraine);

        console.log(world)

        svg.append("path")
        .datum(world)
        .attr("d", path);

        var map = svg.append("g");
        map.selectAll(".country")
        .data(world.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);
    }*/

    var template = _.template(d3.select('#tooltip-template').html());

    var colors = d3.scale.quantize()
        .range(colorbrewer.YlOrRd[7]);

    colors.domain([
        0, 
        d3.max(d3.values(stats.items), function(d) { return d.share + 10; })
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

        

        /*var water_group = svg.append("g")
            .attr("id", "water-resources");

        

        // Add lakes after rivers so that river lines connect reservoirs, not cross them.
        var lakes = topojson.feature(ukraine_data, ukraine_data.objects.lakes);
        water_group.selectAll(".lake")
            .data(lakes.features)
        .enter().append("path")
            .attr("class", "lake")  // Note: not necessary a lake, it can be a reservoir.
            .attr("name", function(d) { return d.properties.name; })
            .attr("d", path);*/

        var regions = topojson.feature(ukraine_data, ukraine_data.objects.regions);

        console.log(regions.features);
        
        //link map and data
        regionsNames = []
        regions.features.forEach(function(item, i, arr) {
            regionsNames.push(item.id)
        });

        console.log(regionsNames);

        for (var i in regions.features) {
            for (var j in stats.items) {
                if (regionsAlignment[regions.features[i].id] == stats.items[j].region){
                    regions.features[i]['regionData'] = stats.items[j];
                }
            }
        }

        console.log(regions.features);

        var regionsOnMap = svg.selectAll("path.region")
            .data(regions.features)
        .enter().append("path")
            .classed("region", true)
            .attr("id", function(d) { return d.id; })
            .attr("d", path)
            .style('fill', function(d) {
                console.log(d.properties);
                return colors(d.regionData.share);
            });
        svg.append("path")
            .datum(topojson.mesh(ukraine_data, ukraine_data.objects.regions, function(a, b) { return a !== b; }))
            .classed("region-boundary", true)
            .attr("d", path)
        
        regionsOnMap.on('mouseover', tooltipShow)
        .on('mouseout', tooltipHide);
        
    });

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
}

