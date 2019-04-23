var dataP = d3.json("classData.json");

//Global GraphSettings---------------------------------------------------
svgScreen = {
  size: 500
}

svgMargin = {
  top: 30,
  bottom:30,
  left: 50,
  right:50
}

var boxSize = 0; //Initialized in initBoxSize()

var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear();

//-----------------------------------------------------------------------


//Initializers-----------------------------------------------------------
var initScales = function(numOfStudents){
  xScale.domain([0, numOfStudents])
        .range([svgMargin.left + (boxSize/2), svgScreen.size - boxSize/2 - svgMargin.right])
  yScale.domain([0, numOfStudents])
        .range([svgMargin.top + (boxSize/2), svgScreen.size - boxSize])
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

  var studentPics = graphSvg
                .append("g")
                .attr("class", "studetn-pics")
                .selectAll("image")
                .data(picSrcArr)
                .enter()
                .append("image")
                .attr("xlink:href", function(picSrc){return "/student_images/" + picSrc})
                .attr("x", function(picSrc, i){return xScale(i)})
                .attr("y", function(){return yScale(0)})
                .attr("width", boxSize)
                .attr("height", boxSize);
                console.log("picSize:", boxSize);

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
