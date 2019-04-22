var dataP = d3.json("classData.json");


var correlation = function(arr1, arr2){
  var mean1 = d3.mean(arr1);
  var mean2 = d3.mean(arr2);
  var numeratorArr =  arr1.map(function(d, i){return (arr1[i]-mean1) * (arr2[i]-mean2)});
  console.log("n", numeratorArr);
  var numerator = d3.sum(numeratorArr);
  var denominator = d3.deviation(arr1) * d3.deviation(arr2);
  var r = (1/(arr1.length-1)) * numerator/denominator;
  console.log("R="+Math.round(r * 1000) / 1000);
  return Math.round(r * 100) / 100;
};

var makeDataArr = function(pengData){
  var dataArr = [];
  pengData.forEach(function(pengX, x){
    pengData.forEach(function(pengY, y){
      var corrObj = {};
      corrObj.x = x;
      corrObj.y = y;
      var pengXHomework = pengX.homework.map(function(day){return day.grade});
      var pengYHomework = pengY.homework.map(function(day){return day.grade});
      console.log("pengXHomework:", pengXHomework);
      console.log("pengYHomework:", pengYHomework);
      corrObj.r = correlation(pengXHomework, pengYHomework);
      corrObj.xPengName = pengX.picture;
      corrObj.yPengName = pengY.picture;
      console.log("("+x+","+y+"):", corrObj);
    });
  });
}

dataP.then(function(data){
  console.log("Data", data);
  var arr1= [1, 2, 3, 4, 5, 6];
  var arr2 = [10, 20, 30, 40, 50, 60];
  makeDataArr(data);

});
