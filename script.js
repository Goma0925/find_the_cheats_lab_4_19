var dataP = d3.json("classData.json");

//Global GraphSettings---------------------------------------------------
svgScreen = {
  size: 700
}

svgMargin = {
  top: 30,
  bottom:30,
  left: 0,
  right: 200
}

var boxSize = 0; //Initialized in initBoxSize()

var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear();



var startColor = "#ffffff";
var endColor = "#3498DB"

var colorScale = [
    {threshold:[1.0, 0.7], color: "#FA2A05"},//red
    {threshold:[0.7, 0.4], color: "#FAA505"},//pink
    {threshold:[0.4, 0.2], color: "#EBFA05"},//light pink
    {threshold:[0.2, -0.2], color: "#66FA05"},//white
    {threshold:[-0.2, -0.4], color: "#EBFA05"},//light pink
    {threshold:[-0.4, -0.8], color: "#FAA505"},//pink
    {threshold:[-0.8, -1.0], color: "#FA2A05"},//red
    ]

var colorMap = function(val){
  if (val === 1){
    return "black";
  }
  else {
      var colorCode = ""
      colorScale.forEach(function(scaleObj){
      //console.log("val:" + val + "   threshold[1]:" + scaleObj.threshold[1])
      if ( val <= scaleObj.threshold[0] && val > scaleObj.threshold[1]){console.log(scaleObj.threshold[0] + ">=" + val + " >" + scaleObj.threshold[1]);
      console.log("COLOR=", scaleObj.color);
      colorCode = scaleObj.color};
    });
    return colorCode;
  }
};

//-----------------------------------------------------------------------


//Initializers-----------------------------------------------------------
var initScales = function(numOfStudents){
  xScale.domain([0, numOfStudents])
        .range([svgMargin.left + boxSize, svgScreen.size - svgMargin.right - boxSize]);
  yScale.domain([0, numOfStudents])
        .range([svgMargin.left + boxSize, svgScreen.size - svgMargin.right - boxSize]);

};

var initBoxSize = function(numOfStudents){
  console.log("initBoxSize");
  console.log("svgScreen.size", svgScreen.size);
  console.log("numOfStudents:", numOfStudents);
  boxSize = (svgScreen.size - svgMargin.left - svgMargin.right) / numOfStudents;
};

var correlation = function(arr1, arr2){
  var mean1 = d3.mean(arr1);
  var mean2 = d3.mean(arr2);
  var numeratorArr =  arr1.map(function(d, i){return (arr1[i]-mean1) * (arr2[i]-mean2)});
  //console.log("n", numeratorArr);
  var numerator = d3.sum(numeratorArr);
  var denominator = d3.deviation(arr1) * d3.deviation(arr2);
  var r = (1/(arr1.length-1)) * numerator/denominator;
  console.log("R="+Math.round(r * 1000) / 1000);
  return Math.round(r * 100) / 100;
};

var makeDataArr = function(pengData){
  var dataArr = [];
  var pictureSrcArr = []
  pengData.forEach(function(pengX, x){
    pengData.forEach(function(pengY, y){
      var corrObj = {};
      corrObj.x = x;
      corrObj.y = y;
      var pengXHomework = pengX.homework.map(function(day){return day.grade});
      var pengYHomework = pengY.homework.map(function(day){return day.grade});
      //console.log("pengXHomework:", pengXHomework);
      //console.log("pengYHomework:", pengYHomework);
      corrObj.r = correlation(pengXHomework, pengYHomework);
      corrObj.xPengName = pengX.picture;
      corrObj.yPengName = pengY.picture;
      console.log("("+x+","+y+"):", corrObj);
      dataArr.push(corrObj);
    });
  });
  return dataArr;
}

var makePicSrcArr = function(pengData){
  var pictureSrcArr = []
  pengData.forEach(function(peng, x){
    pictureSrcArr.push(peng.picture);
  });
  console.log("pic", pictureSrcArr)
  return pictureSrcArr;
}
//-----------------------------------------------------------------------

var drawGraph = function(dataArr, picSrcArr){
  console.log("Using dataArr:", dataArr);
  //Insert student image
  var graphSvg = d3.select("#main-graph")
                .append("svg")
                .attr("class", "svg-graph")
                .attr("width", svgScreen.size)
                .attr("height", svgScreen.size);

  var studentPicRow = graphSvg
                .append("g")
                .attr("class", "studetn-pics")
                .selectAll("image")
                .data(picSrcArr)
                .enter()
                .append("image")
                .attr("xlink:href", function(picSrc){return "student_images/" + picSrc})
                .attr("x", function(picSrc, i){return xScale(i+1)})
                .attr("y", function(){return yScale(0)})
                .attr("width", boxSize)
                .attr("height", boxSize);
                console.log("picSize:", boxSize);

  var studentPicCol = graphSvg
                .append("g")
                .attr("class", "studetn-pics")
                .selectAll("image")
                .data(picSrcArr)
                .enter()
                .append("image")
                .attr("xlink:href", function(picSrc){return "student_images/" + picSrc})
                .attr("x", xScale(0))
                .attr("y", function(picSrc, i){return yScale(i+1)})
                .attr("width", boxSize)
                .attr("height", boxSize);
                console.log("picSize:", boxSize);


  var dataRect = graphSvg.append("g")
                          .attr("class", "data-rect")
                          .selectAll("rect")
                          .data(dataArr)
                          .enter()
                          .append("rect")
                          .attr("x", function(corrObj){return xScale(corrObj.x + 1)})
                          .attr("y", function(corrObj){return yScale(corrObj.y + 1)})
                          .attr("width", boxSize)
                          .attr("height", boxSize)
                          .attr("stroke", "#555556")
                          .attr("stroke-width", 1)
                          .attr("fill", function(corrObj){console.log("VAL=" + corrObj.r + "   " + colorMap(corrObj.r));return colorMap(corrObj.r)})
//------------------------

var legendWidth = 80;
var legendHeight = 300;

var legendColorScale = ["#F90422", "#FB5166", "FA7E8D", "FCFAFA", "FA7E8D", "FB5166", "F90422"]

var legend = graphSvg
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" +  xScale(picSrcArr.length + 2) + "," + boxSize + ")");

var legendRects = legend.selectAll("rect")
                  .data(colorScale)
                  .enter()
                  .append("rect")
                  .attr("x", 0)
                  .attr("y", function(threshold, i){return (i * 30) + 20})
                  .attr("height", function(threshold, i){return 20})
                  .attr("width", function(threshold, i){return 20})
                  .attr("fill", function(threshold){return threshold.color})
                  .attr("stroke", "black")
                  .attr("stroke-width", 1)

var legendTexts = legend.selectAll("text")
                  .data(colorScale)
                  .enter()
                  .append("text")
                  .attr("x", 25)
                  .attr("y", function(threshold, i){return (i * 30) + 35})
                  .text(function(threshold){return threshold.threshold[0] + " ~ " + threshold.threshold[1]});

var legendTitle = legend.append("text")
                        .text("Correlation coeficient R:")
                        .attr("x", 0)
                        .attr("y", 10)

// var legend = graphSvg
// .append("defs")
// .append("svg:linearGradient")
// .attr("id", "gradient")
// .attr("x1", "100%")
// .attr("y1", "0%")
// .attr("x2", "100%")
// .attr("y2", "100%")
// .attr("spreadMethod", "pad");
//
// legend
// .append("stop")
// .attr("offset", "0%")
// .attr("stop-color", endColor)
// .attr("stop-opacity", 1);
//
// legend
// .append("stop")
// .attr("offset", "100%")
// .attr("stop-color", startColor)
// .attr("stop-opacity", 1);
//
// graphSvg.append("rect")
// .attr("width", legendWidth/4)
// .attr("height", legendHeight)
// .style("fill", "url(#gradient)")
// .attr("stroke", "#555556")
// .attr("transform", "translate(" +  (svgScreen.size - 50) + "," + boxSize + ")");
//
// legenAxis = graphSvg.append("g")
//             .attr("class", "legen-axis")
//             .call(axisFunc)
//             .attr("transform", "translate(" +  (svgScreen.size - 50 + legendWidth/4) + "," + boxSize + ")");;






  //----------------------
  // var studentPics = graphSvg
  //                   .append("circle")
  //                   .attr("cx", svgScreen.size)
  //                   .attr("cy", 0)
  //                   .attr("r", 40)
  //                   .attr("fill", red)

console.log("x domai:", xScale(23));
};

dataP.then(function(data){
  var numOfStudents = data.length;
  console.log("Data", data);
  var arr1= [1, 2, 3, 4, 5, 6];
  var arr2 = [10, 20, 30, 40, 50, 60];
  var dataArr = makeDataArr(data); //Stores the correlation objs;
  var picSrcArr = makePicSrcArr(data); //Stores the correlation objs;
  initScales(numOfStudents);
  initBoxSize(numOfStudents);
  drawGraph(dataArr, picSrcArr);

});


//Next: Display images;
