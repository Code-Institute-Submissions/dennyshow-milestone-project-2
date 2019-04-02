queue()
    .defer(d3.csv, "data/tfl_buses_type.csv")
    .await(createGraphs);
    
function createGraphs(error, busesData) {
    var ndx = crossfilter(busesData);
    
    busesData.forEach(function(d){
        d.number_of_buses = parseInt(d.number_of_buses);
    });
    
    
    show_yearly_total_number_of_buses(ndx);
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
        .width(600)
        .height(400)
        .margins({top:20, right:20, bottom:40, left:20})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Fuels")
        .yAxis().ticks(20);
        
}

function show_yearly_total_number_of_buses(ndx) {
    
    var date_dim = ndx.dimension(dc.pluck('number_of_buses'));
    var total_number_of_buses_yearly = date_dim.group().reduceSum(dc.pluck('year'));
    
  
    dc.lineChart('#yearly-number-of-buses')
        .width(1700)
        .height(300)
        .margins({top:10, right:50, bottom:30, left:20})
        .dimension(date_dim)
        .group(total_number_of_buses_yearly)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Number of Buses")
        .yAxis().ticks(4);
}



function show_total_number_of_buses(ndx) {
    
    var buses_dim = ndx.dimension(dc.pluck('year'));
    var total_buses = buses_dim.group().reduceSum(dc.pluck('number_of_buses'));
    
    dc.pieChart('#total-number-of-buses')
        .height(450)
        .radius(400)
        .transitionDuration(1500)
        .dimension(buses_dim)
        .group(total_buses);
    
    dc.renderAll();
        
        
}


function show_years_of_buses(ndx) {
    
    var buses_dim = ndx.dimension(dc.pluck('bus_type'));
    var total_buses = buses_dim.group().reduceSum(dc.pluck('year'));
    
    dc.pieChart('#years-of-buses')
        .height(450)
        .radius(400)
        .transitionDuration(1500)
        .dimension(buses_dim)
        .group(total_buses);
    
    dc.renderAll();
        
        
}



// function show_total_number_of_buses(ndx) {
//     var dim = ndx.dimension(dc.pluck('number_of_buses'));
//     var group = dim.group()
  
//     dc.barChart("#total-number-of-buses")
//         .width(900)
//         .height(400)
//         .margins({top:10, right:20, bottom:30, left:20})
//         .dimension(dim)
//         .group(group)
//         .transitionDuration(500)
//         .x(d3.scale.ordinal())
//         .xUnits(dc.units.ordinal)
//         .xAxisLabel("Number Of Buses")
//         .yAxis().ticks(5);
// }