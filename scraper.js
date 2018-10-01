var ss = SpreadsheetApp.openById("YOUR_sh33t_ID_goes_here");//need to call the Spreadsheet by its ID
var s1 = ss.getSheetByName("Sheet1");

function regX(r,n){
  if(r != null){
    return r[n].trim();
  }else{
    return '';
  }
}


function parseHTMLbyId(id) {
  var containArr = []; //empty array. this is overkill at this point, but will be useful at scale.
  var respAll = UrlFetchApp.fetchAll(id);
  //now we are going to call all the URLs at once. We will gget an array of responses, so we need to parse each one individually.
  for(i=0; i<respAll.length; i++){
    var resp = respAll[i].toString().replace(/\n|\r/g, '');
    var fullname = regX(/<h1>(.+?)<\/h1>/.exec(resp),1);
    var bio = regX(/<\/h1>(.+?)<\/div>/.exec(resp),1);
    var title = regX(/Job Title.+?<br\/>(.+?)<br\/>/.exec(resp),1);
    var twitter = regX(/social-icons"\s+href="(.{0,20}twitter.+?)"/.exec(resp),1);
    var linkedin = regX(/social-icons"\s+href="(.{0,20}linkedin.+?)"/.exec(resp),1); 
    var path = regX(/speakers\/\?id=\d+/.exec(resp),0);
    var arr = new Array(fullname,path,title,bio,twitter,linkedin); //each iteration of the for loop, this arr is reset. same for all of the variables except containArr because that variable array is scoped outside of the for loop.
    containArr.push(arr);
    var nextRow = s1.getLastRow()+1;
    }
  s1.getRange(nextRow,1,containArr.length,containArr[0].length).setValues(containArr); //this was runningg for each loop. 
}
function createUrls(arr){  return arr.map(function(el){  return "http://newyork.advertisingweek.com/speakers/?id="+el;}); }

function runrun(){
  var start = [8391,8390,8389,8388,8387,8386,8385,8384];
  var urls = createUrls(start);
  parseHTMLbyId(urls); //oops.
}
