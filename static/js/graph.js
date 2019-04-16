queue()
    .defer(d3.csv, "data/tfl_buses_type.csv")
    .await(createGraphs);
    
function createGraphs(error, ndx) {
    var ndx = crossfilter(ndx);
    (function(d){
     d.number_of_buses = parseInt(d.number_of_buses);
    });
    
    show_total_number_of_buses_per_year(ndx);
    show_years_of_buses(ndx);
    show_total_number_of_buses(ndx);
    show_bus_types(ndx);
    show_bus_fuel(ndx);
    show_buses_mostly_used_per_year(ndx);
    
    // show_percenatge_of_buses(ndx, "Single deck", "#percentage-of-single-deck-bus");
    // show_percenatge_of_buses(ndx, "Double deck", "#percentage-of-double-deck-bus");
    
    // show_percenatge_of_buses(ndx, "Artic", "#percentage-of-artic-bus");
    // show_percenatge_of_buses(ndx, "Routemaster", "#percentage-of-routemaster-bus");
    // show_percenatge_of_buses(ndx, "New Routemaster", "#percentage-of-new-routemaster-bus");


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
        .width(550)
        .height(350)
        .margins({top:20, right:20, bottom:40, left:20})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Fuels")
        .yAxis().ticks(20);
        
}



// function show_percenatge_of_buses(ndx, bus_type, element) {
//     var percentageThatAreSingleBuses = ndx.groupAll().reduce(
//         function(p, v){
//             if (v.transport === bus_type) {
//                   p.count++;
//                 if (v.drive_train_type === "Diesel") {
//                     p.are_single++;
//                 }
//             }
            
//             return p;
            
//       },
       
//       function(p, v){
//              if (v.transport === bus_type) {
//                   p.count--;
//                 if (v.drive_train_type === "Diesel") {
//                     p.are_single--;
//                 }
//             }
            
//             return p;
//       },
       
//       function() {
//             return {count: 0 , are_single: 0};
//       }
//      );
     
//     //  console.log(percentageThatAreSingleBuses);
     
//     dc.numberDisplay("#percentage-of-single-deck-bus")
//         .formatNumber(d3.format(".2%"))
//         .valueAccessor(function (d) {
//             if (d.count == 0) {
//                 return 0;
//             } else{
//                 return (d.are_single / d.count);
//             }
//         })
//         .group(percentageThatAreSingleBuses);
        
    
// }


function show_total_number_of_buses_per_year(ndx) {
            
        var year_dim = ndx.dimension(dc.pluck('year'));
    
        var minYear = year_dim.bottom(1)[0].year;
        var maxYear = year_dim.top(1)[0].year;
            
        function bus_total_per_year(busType) {
            return function (ndx) {
              if (ndx.bus_type === busType) {
                     return +ndx.number_of_buses;
               } else {
                        return 0;
              }
        };
    }
            
            
      var articTypeBus = year_dim.group().reduceSum(bus_total_per_year('Artic'));
          
               
      var singleDeckTypeBus = year_dim.group().reduceSum(bus_total_per_year('Single deck'));
          
               
      var doubleDeckTypeBus = year_dim.group().reduceSum(bus_total_per_year('Double deck'));
               
               
      var routeMasterTypeBus = year_dim.group().reduceSum(bus_total_per_year('Routemaster'));
          
               
      var newRouteMasterTypeBus = year_dim.group().reduceSum(bus_total_per_year('New Routemaster'));
          
          
      var compositeChart = dc.compositeChart('#yearly-number-of-buses');
          compositeChart
            .width(650)
            .height(350)
            .dimension(year_dim)
            .x(d3.time.scale().domain([minYear, maxYear]))
            .yAxisLabel("Numbers Of Buses")
            .margins({top:20, right:50, bottom:30, left:70})
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

function show_buses_mostly_used_per_year(ndx) {
    
       var year_dim = ndx.dimension(dc.pluck('year'));
    
        var min_year = year_dim.bottom(1)[0].year;
        var max_year = year_dim.top(1)[0].year;
        
        var most_dim = ndx.dimension(function(ndx) {
            return [ndx.year, ndx.number_of_buses, ndx.bus_type];
        });
        
        var most_group = most_dim.group().reduceSum(dc.pluck('number_of_buses'));
        
        var busesColors = d3.scale.ordinal()
                        .domain(["singleDeckTypeBus", "doubleDeckTypeBus", "articTypeBus",
                                "routeMasterTypeBus", "newRouteMasterTypeBus"])
                        .range(["black","green","red","yellow","blue"]);
        
        // console.log(most_group.all());
        
        var most_chart = dc.scatterPlot("#most-used-buses");
        most_chart
            .width(650)
            .height(480)
            .x(d3.time.scale().domain([min_year, max_year]))
            .brushOn(false)
            .symbolSize(8)
            .clipPadding(10)
            .yAxisLabel("Most Used Buses")
            .margins({top:20, right:50, bottom:30, left:70})
            .title(function(ndx) {
                return ndx.key[2] + " bus used " + ndx.key[1] + " times ";
            })
            .colorAccessor(function(ndx) {
                return ndx.key[2];
            })
            .colors(busesColors)
            .dimension(most_dim)
            .group(most_group);
            
        dc.renderAll();
}


    

function show_total_number_of_buses(ndx) {
    
    var buses_dim = ndx.dimension(dc.pluck('bus_type'));
    var total_buses = buses_dim.group().reduceSum(dc.pluck('number_of_buses'));
    
    dc.pieChart('#total-number-of-buses')
        .height(250)
        .radius(150)
        .transitionDuration(1500)
        .dimension(buses_dim)
        .group(total_buses);
    
    dc.renderAll();
        
}


function show_years_of_buses(ndx) {
    
    var years_dim = ndx.dimension(dc.pluck('year'));
    var total_years = years_dim.group().reduceSum(dc.pluck('number_of_buses'));
    
    dc.pieChart('#buses-per-year')
        .height(250)
        .radius(150)
        .transitionDuration(1500)
        .dimension(years_dim)
        .group(total_years);
    
    dc.renderAll();
        
}