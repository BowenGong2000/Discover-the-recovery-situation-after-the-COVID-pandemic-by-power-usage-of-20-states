var monthly = d3.csv("data/2019and2020monthly.csv",function(data,error) {
    var power = {
        year: data["Year"],
        month: data["Month"],
        usage: [data["Total"], data["Commercial"], data["Industrial"], data["Residential"], data["Transportation"]]
    }			
    return power
}).then(function(powerinfo){
    year2019 = []
    year2020 = []
    console.log(powerinfo)
    for(var d in powerinfo){
        record = powerinfo[d]
        if(record['year'] == '2019'){
            year2019.push(record)
        }
        else{
            year2020.push(record)
        }
    }

    var width = 1200
    var height = 800

    var svg = d3.select("#yeartrend")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // add the plots
    var margin = {
            top: 30,
            right: 200,
            bottom: 20,
            left: 70
        }

    var data2019 = []
    var data2020 = []
    var maxdata = 0
    var mindata = 9999999
    for(var i=0; i<6; i++){
        var tmp2019 = parseFloat(year2019[i]['usage'][0])
        var tmp2020 = parseFloat(year2020[i]['usage'][0])
        data2019.push({month: parseInt(year2019[i]['month']), number: tmp2019})
        data2020.push({month: parseInt(year2020[i]['month']), number: tmp2020})
        maxdata = Math.max(maxdata, tmp2019, tmp2020)
        mindata = Math.min(mindata, tmp2019, tmp2020)
    }

    // console.log(maxdata, mindata)

    var xScale = d3.scaleBand()
        .domain([1,2,3,4,5,6])
        .range([margin.left, width-margin.right])
    
    var yScale =  d3.scaleLinear()
        .domain([mindata*0.88, maxdata*1.12])
        .range([height - margin.bottom, margin.top])

    var xLines = g => g
        .attr("transform", "translate(0, " + (height - margin.bottom - 20) +")")
        .call(d3.axisBottom(xScale))
        .call(g => g.select(".domain").remove())
    
    var yLines = g => g
        .attr("transform", "translate( "+ margin.left +",0)")
        .call(d3.axisLeft(yScale))
        .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.2)
        .attr("x2", width - margin.left - margin.right))
        .call(g => g.select(".domain").remove())
    
    svg.append("g")
        // .attr("transform", "translate(0," + (height - margin.bottom- margin.top) + ")")
        .call(xLines)
        .append("text")
        .text("Month")
        .attr("text-anchor","end")
        .attr("transform", "translate(" + width*0.85+",0)")
        .attr("fill", "black")
        .attr("dy", "-0.5em")
        .attr("font-size", "14px")

    svg.append("g")
        .call(yLines)
        .append("text")
        .text("Power usage/million kwh")
        .attr("text-anchor","end")
        .attr("transform","translate(120, 20)")
        .attr("fill", "black")
        .attr("dy", "-0.5em")
        .attr("font-size", "14px")
    
    var linepath = d3.line()
        .x(function(d, i){
            return xScale(i+1)+margin.left
        })
        .y(function(d){
            return yScale(d['number'])
        })

    var line1 = svg.append("g")
        .attr("width",width)
        .attr("height",height)

    line1.selectAll("path")
        .data([data2019])
        .enter()
        .append("path")
        .attr("d", function(d){
            return linepath(d)
        }) 
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "orange")
    
    var line2 = svg.append("g")
        .attr("width",width)
        .attr("height",height)

    line2.selectAll("path")
        .data([data2020])
        .enter()
        .append("path")
        .attr("d", function(d){
            return linepath(d)
        }) 
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "blue")
    
    svg.append('text')
        .text('2019')
        .attr("transform","translate(1100, 50)")

    
    svg.append('text')
        .text('2020')
        .attr("transform","translate(1100, 100)")

    svg.append('path')
        .attr("d", "M1060,45L1090,45")
        .attr("stroke-width", 1.5)
        .attr('stroke', 'orange')
    
    svg.append('path')
        .attr("d", "M1060,95L1090,95")
        .attr("stroke-width", 1.5)
        .attr('stroke', 'blue')

    var lineselect = $('#linetabs')
    var lineopt = $('#linetabs option')

    var title = ['Total', 'Commercial', "Industrial","Residential","Transportation"]

    lineselect.change(function(){
        // console.log(lineselect.get(0).selectedIndex)
        requireidx = lineselect.get(0).selectedIndex

        $('#yeartrendtitle').text(title[requireidx] + ' Power Usage Trend of 2019 and 2020')
        
        svg.selectAll('g').remove()
        
        svg.append("g")
            // .attr("transform", "translate(0," + (height - margin.bottom- margin.top) + ")")
            .call(xLines)
            .append("text")
            .text("Month")
            .attr("text-anchor","end")
            .attr("transform", "translate(" + width*0.85+",0)")
            .attr("fill", "black")
            .attr("dy", "-0.5em")
            .attr("font-size", "14px")

        svg.append("g")
            .call(yLines)
            .append("text")
            .text("Power usage/million kwh")
            .attr("text-anchor","end")
            .attr("transform","translate(120, 20)")
            .attr("fill", "black")
            .attr("dy", "-0.5em")
            .attr("font-size", "14px")

        var data2019 = []
        var data2020 = []
        var maxdata = 0
        var mindata = 9999999
        for(var i=0; i<6; i++){
            var tmp2019 = parseFloat(year2019[i]['usage'][requireidx])
            var tmp2020 = parseFloat(year2020[i]['usage'][requireidx])
            data2019.push({month: parseInt(year2019[i]['month']), number: tmp2019})
            data2020.push({month: parseInt(year2020[i]['month']), number: tmp2020})
            maxdata = Math.max(maxdata, tmp2019, tmp2020)
            mindata = Math.min(mindata, tmp2019, tmp2020)
        }

        yScale =  d3.scaleLinear()
            .domain([mindata*0.88, maxdata*1.12])
            .range([height - margin.bottom, margin.top])

        linepath = d3.line()
            .x(function(d, i){
                return xScale(i+1)+margin.left
            })
            .y(function(d){
                return yScale(d['number'])
            })
        line1 = svg.append("g")
            .attr("width",width)
            .attr("height",height)
    
        line1.selectAll("path")
            .data([data2019])
            .enter()
            .append("path")
            .attr("d", function(d){
                return linepath(d)
            }) 
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke", "orange")
        
        var line2 = svg.append("g")
            .attr("width",width)
            .attr("height",height)
    
        line2.selectAll("path")
            .data([data2020])
            .enter()
            .append("path")
            .attr("d", function(d){
                return linepath(d)
            }) 
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke", "blue")

    })
    

    return powerinfo
})

var maychange = d3.csv("data/MayChange.csv",function(data,error) {
    var change = {
        name: data["StateName"],
        code: data["StateCode"],
        may: -parseFloat(data['ChangeMay']),
        june: -parseFloat(data['ChangeJune']),
        diff: parseFloat(data['June-May']),
        commercial: parseFloat(data['Commercial']),
        industrial: parseFloat(data['Industrial'])
    }		
    // console.log(data)	
    return change
}).then(function(changeinfo){

    // console.log(changeinfo)
    avgMay = 0.0
    max = 0
    min = 0
    recovermax = 0
    recovermin = 0
    for(var i = 0; i< changeinfo.length-1; i++){
        // console.log(i, changeinfo[i].may)
        avgMay += changeinfo[i].may / changeinfo.length
        max = Math.max(changeinfo[i]['may'], max)
        min = Math.min(changeinfo[i]['may'], min)
        recovermax = Math.max(changeinfo[i]['diff'], recovermax)
        recovermin = Math.min(changeinfo[i]['diff'], recovermin)
    }
    changeinfo.sort(function(a,b){return -a.may+b.may})
    // console.log(changeinfo.length)
    
    top20 = []

    for(var i=0;i<20;i++){
        top20.push(changeinfo[i])
        
    }
    
    var width = 1200
    var height = 800

    // add the plots
    var margin = {
            top: 30,
            right: 200,
            bottom: 20,
            left: 70
        }

    var svg2 = d3.select("#topstates")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    var xScale2 = d3.scaleBand()
        .domain(top20.map((item) => item.code))
        .rangeRound([margin.left, width-margin.right])

    var yScale2 = d3.scaleLinear()
        .domain([0, max*1.1])
        .range([height - margin.bottom, margin.top])
    
    var xAxis = d3.axisBottom(xScale2)
        .ticks(0)
        .tickPadding(10)

    var yAxis = d3.axisLeft(yScale2)

    svg2.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
        .text("State Code")
        .attr("text-anchor","end")
        .attr("transform", "translate(" + width*0.9+",0)")
        .attr("fill", "black")
        .attr("dy", "-0.5em")
        .attr("font-size", "14px")
      
    svg2.append("g")
        .attr("transform", "translate("+(margin.left-15)+", 0)")
        .call(yAxis)
        // .attr('opacity', 0)
        .append("text")
        .text("Decreasing Percentage")
        .attr("text-anchor","end")
        .attr("transform","rotate(90), translate(180, 0)")
        .attr("fill", "black")
        .attr("dy", "-0.5em")
        .attr("font-size", "14px")
    
    var rects = svg2.selectAll('rect')
        .data(top20)
        .enter()
        .append('g')
        .attr('class', 'rectItem')
    
    var color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(top20.map(d => d.code))   

    console.log((xScale2.bandwidth()))

    rects.append('rect')
        .attr('width', 30)
        .attr('y', (d) => yScale2(d.may)-margin.bottom)
        .attr('height',  (d) => height-yScale2(d.may)-margin.bottom)
        .attr('fill', d => color(d.code))
        .attr("opacity", 0.6)
        .attr('transform', "translate(0,"+margin.bottom+")")
        .attr('x', (d) => xScale2(d.code) + ((xScale2.bandwidth() - 30) / 2))
    
    rects.append('text')
        .text((d) => d.may)
        .attr('x', (d) => xScale2(d.code) + ((xScale2.bandwidth() - 30) / 2) )
        .attr('y', (d, i) => yScale2(d.may) - 10)
        .attr("font-size", 10)
    
    rects.append('text')
        .text((d) => d.code)
        .attr('x', (d) => xScale2(d.code) + ((xScale2.bandwidth() - 20) / 2) )
        .attr('y', height-margin.bottom+20)
        .attr("font-size", 10)
    
    var linepath = d3.line()
        .x(function(d){
            console.log( xScale2(d.code))
            return xScale2(d.code)
        })
        .y(function(d){
            return yScale2(d.may)
        })
    avgPath = 'M70,'+ yScale2(avgMay)+"L1000,"+yScale2(avgMay)
    svg2.append('path')
        .attr('d', avgPath)
        .attr("stroke-width", 1.5)
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "5,5")
    
    svg2.append('text')
        .text('Average Decrease Percentage')
        .attr('transform', 'translate(1000, '+ yScale2(avgMay)+')')
    

    // console.log(maxranges, minranges)
    var mapjson = d3.json("data/us-states.json")
    .then(function(states){
        console.log(states)

        var mapheight = 600, mapwidth = 1000

        var svg3 = d3.select('#recovermap')
        .append('svg')
        .attr('width', mapwidth)
        .attr('height', mapheight)
    
        var projection = d3.geoAlbersUsa()
        
        
        // console.log(projection)
        
        // Define path generator
        var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
                .projection(projection);
        
        var maxranges = [Math.ceil(recovermax/8), Math.ceil(recovermax/4), Math.ceil(recovermax/2)]
        var minranges = [Math.floor(recovermin/8), Math.floor(recovermin/4), Math.floor(recovermin/2)]
        // var colorPos = d3.scaleLinear()
        //     .domain(maxranges)
        //     .range(['#9AFF9A', '#90EE90', '#00CD66', '#008B45'])
    
        // var colorNeg = d3.scaleLinear()
        //     .domain(minranges)
        //     .range(['#b00c0c', '#c20f0f', '#d42525', '#f0a3a3'].reverse())
        
        // console.log(colorPos(34.1))
        var colorrange = ['#a40c0c', '#c60f0f', '#dc2525', '#f0a3a3', '#9AFF9A', '#90EE90', '#00CD66', '#008B45']
        var numrange = ['<'+minranges[2],minranges[2]+'~'+minranges[1],minranges[1]+'~'+minranges[0],minranges[0]+'~0', '0~'+maxranges[0], maxranges[0]+'~'+maxranges[1], maxranges[1]+'~'+maxranges[2], '>'+maxranges[2]]

        for(var i=0;i<8;i++){
            svg3.append('rect')
                .attr('width', 30)
                .attr('height', 20)
                .attr('fill', colorrange[i])
                .attr('x', 850)
                .attr('y', 300 + 30*i)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
            svg3.append('text')
                .text(numrange[i])
                .attr('x', 890)
                .attr('y', 315 + 30*i)
        }
        var mappath = svg3.append('g')
            .attr("width",width)
            .attr("height",height)

        console.log(maxranges, minranges)
        for(var i in states.features){
            for(var j in changeinfo){
                if(states.features[i].properties.name == changeinfo[j].name){
                    states.features[i]['recover'] = changeinfo[j]['diff']
                }
            }
        }   
        console.log(states.features) 
        mappath.selectAll("path")
            .data(states.features)
            .enter()
            .append('path')
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", function(d) {
                if(d.recover>0){
                    for(var i=2;i>=0;i--){
                        if(d.recover > maxranges[i]){
                            return colorrange[5+i]
                        }
                    }
                    return colorrange[4]
                }
                for(var i=2;i>=0;i--){
                    if(d.recover < minranges[i]){
                        return colorrange[2-i]
                    }
                }
                return colorrange[3]
            })
            .attr("d", path)
            .append("title").text(function(d, i) {
                return d.properties.name + ' recovery rate: ' + d.recover+'%';
            });
        
        var mapselect = $('#maptabs')
        mapselect.change(function(){
            var choice = mapselect.get(0).selectedIndex
            mappath.selectAll('path').remove()
            if(choice == 0){
                for(var i in states.features){
                    for(var j in changeinfo){
                        if(states.features[i].properties.name == changeinfo[j].name){
                            states.features[i]['recover'] = changeinfo[j]['diff']
                        }
                    }
                }
                mappath.selectAll("path")
                    .data(states.features)
                    .enter()
                    .append('path')
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", function(d) {
                        if(d.recover>0){
                            for(var i=2;i>=0;i--){
                                if(d.recover > maxranges[i]){
                                    return colorrange[5+i]
                                }
                            }
                            return colorrange[4]
                        }
                        for(var i=2;i>=0;i--){
                            if(d.recover < minranges[i]){
                                return colorrange[2-i]
                            }
                        }
                        return colorrange[3]
                    })
                    .attr("d", path)
                    .append("title").text(function(d, i) {
                        return d.properties.name + ' recovery rate: ' + d.recover+'%';
                    });  
            }
            else if(choice == 1){
                for(var i in states.features){
                    for(var j in changeinfo){
                        if(states.features[i].properties.name == changeinfo[j].name){
                            states.features[i]['recover'] = changeinfo[j]['commercial']
                        }
                    }
                }
                mappath.selectAll("path")
                    .data(states.features)
                    .enter()
                    .append('path')
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", function(d) {
                        if(d.recover>0){
                            for(var i=2;i>=0;i--){
                                if(d.recover > maxranges[i]){
                                    return colorrange[5+i]
                                }
                            }
                            return colorrange[4]
                        }
                        for(var i=2;i>=0;i--){
                            if(d.recover < minranges[i]){
                                return colorrange[2-i]
                            }
                        }
                        return colorrange[3]
                    })
                    .attr("d", path)
                    .append("title").text(function(d, i) {
                        return d.properties.name + ' commercial recovery rate: ' + d.recover+'%';
                    });  
            }
            else if(choice == 2){
                for(var i in states.features){
                    for(var j in changeinfo){
                        if(states.features[i].properties.name == changeinfo[j].name){
                            states.features[i]['recover'] = changeinfo[j]['industrial']
                        }
                    }
                }
                mappath.selectAll("path")
                    .data(states.features)
                    .enter()
                    .append('path')
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", function(d) {
                        if(d.recover>0){
                            for(var i=2;i>=0;i--){
                                if(d.recover > maxranges[i]){
                                    return colorrange[5+i]
                                }
                            }
                            return colorrange[4]
                        }
                        for(var i=2;i>=0;i--){
                            if(d.recover < minranges[i]){
                                return colorrange[2-i]
                            }
                        }
                        return colorrange[3]
                    })
                    .attr("d", path)
                    .append("title").text(function(d, i) {
                        return d.properties.name + ' industrial recovery rate: ' + d.recover+'%';
                    });  
            } 
        })

    })
})

