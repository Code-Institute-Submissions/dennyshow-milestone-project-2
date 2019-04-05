queue()
    .defer(d3.csv, "data/tfl_buses_type.csv")
    .await(createGraphs);
    
function createGraphs(error, busesData) {
    var ndx = crossfilter(busesData);
    busesData.forEach(function(d){
        d.number_of_buses = parseInt(d.number_of_buses);
    });
    
    show_total_number_of_buses_per_year(ndx);
    show_years_of_buses(ndx);
    show_total_number_of_buses(ndx);
    show_bus_types(ndx);
    show_bus_fuel(ndx);
    

   dc.renderAll();
}

function show_bus_types(ndx) {
    dim = ndx.dimension(dc.pluck('bus_type'));
    group = dim.group()
    
    dc.selectMenu("#types-of-buses")
        .dimension(dim)
        .group(group);
}

function show_bus_fuel(ndx) {
    var dim = ndx.dimension(dc.pluck('drive_train_type'));
    var group = dim.group();
    
    dc.barChart("#types-of-fuel")
        .width(400)
        .height(300)
        .margins({top:20, right:20, bottom:40, left:20})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Fuels")
        .yAxis().ticks(20);
        
}

function show_total_number_of_buses_per_year(ndx) {
    function show_total_number_of_buses_per_year(busesData) {
        var parseYear = d3.time.format("%d/%m/%Y").parse;
        busesData.forEach(function(d) {
        d.year = parseYear(d.year);
      });
    } 
      var year_dim = ndx.dimension(dc.pluck('year'));
      
      var minYear = year_dim.bottom(1)[0].year;
      var maxYear = year_dim.top(1)[0].year;
      
      var articTypeBus = year_dim.group().reduceSum(function (d) {
        if (d.bus_type === 'Artic') {
            return +d.number_of_buses;
        } else {
            return 0;
        }
    });
    
      var singleDeckTypeBus = year_dim.group().reduceSum(function (d) {
        if (d.bus_type === 'Single deck') {
            return +d.number_of_buses;
        } else {
            return 0;
        }
    });
    
      var doubleDeckTypeBus = year_dim.group().reduceSum(function (d) {
        if (d.bus_type === 'Double deck') {
            return +d.number_of_buses;
        } else {
            return 0;
        }
    });
    
      var routeMasterTypeBus = year_dim.group().reduceSum(function (d) {
        if (d.bus_type === 'Routemaster') {
            return +d.number_of_buses;
        } else {
            return 0;
        }
    });
    
      var newRouteMasterTypeBus = year_dim.group().reduceSum(function (d) {
        if (d.bus_type === 'New Routemaster') {
            return +d.number_of_buses;
        } else {
            return 0;
        }
    });
    
    var compositeChart = dc.compositeChart('#yearly-number-of-buses');
    compositeChart
            .width(850)
            .height(350)
            .dimension(year_dim)
            .x(d3.time.scale().domain([minYear, maxYear]))
            .yAxisLabel("Numbers Of Buses")
            .legend(dc.legend().x(80).y(30).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(articTypeBus, 'Artic'),
                dc.lineChart(compositeChart)
                    .colors('black')
                    .group(singleDeckTypeBus, 'Single deck'),
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(doubleDeckTypeBus, 'Double deck'),
                dc.lineChart(compositeChart)
                    .colors('yellow')
                    .group(routeMasterTypeBus, 'Routemaster'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(newRouteMasterTypeBus, 'New Routemaster')
            ])
            .brushOn(false);
            
    dc.renderAll();
    
  }
    

function show_total_number_of_buses(ndx) {
    
    var buses_dim = ndx.dimension(dc.pluck('bus_type'));
    var total_buses = buses_dim.group().reduceSum(dc.pluck('number_of_buses'));
    
    dc.pieChart('#total-number-of-buses')
        .height(300)
        .radius(100)
        .transitionDuration(1500)
        .dimension(buses_dim)
        .group(total_buses);
    
    dc.renderAll();
        
}


function show_years_of_buses(ndx) {
    
    var years_dim = ndx.dimension(dc.pluck('year'));
    var total_years = years_dim.group().reduceSum(dc.pluck('number_of_buses'));
    
    dc.pieChart('#buses-per-year')
        .height(300)
        .radius(100)
        .transitionDuration(1500)
        .dimension(years_dim)
        .group(total_years);
    
    dc.renderAll();
        
}