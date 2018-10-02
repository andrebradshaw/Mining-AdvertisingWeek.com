var ss = SpreadsheetApp.openById("1v5FImFCzt-RbAmyTVDlOXTOuDV8oQmHVqoytoxtaWb0");//need to call the Spreadsheet by its ID
var s1 = ss.getSheetByName("Sheet1");
var idSheet = ss.getSheetByName("ids");

function regX(r,n){
  if(r != null){
    return r[n].trim();
  }else{
    return '';
  }
}
function getUniqueRowNumbers(matchArr){  var unqArr = [];  matchArr.filter(function(elm,pos,arr){        if(arr.indexOf(elm) == pos){      unqArr.push(arr.indexOf(elm));    }    });  return unqArr;}
function splitarray(input, spacing) {    var output = [];    for (i = 0; i < input.length; i += spacing) {        output[output.length] = input.slice(i, i + spacing);    }    return output;}

function deDuped(){
  var colToClean = [].concat.apply([], s1.getRange(1,2,s1.getLastRow(),1).getValues());
  var rowsToPull = getUniqueRowNumbers(colToClean);
  var dd = ss.insertSheet("deDuped_"+s1.getSheetName());
  var allRows = s1.getRange(1,1,s1.getLastRow(), s1.getLastColumn()).getValues();
  var newSheetCols = [];
  for(i=0; i<rowsToPull.length; i++){
    var r = rowsToPull[i];
    newSheetCols.push(allRows[r]);
  }
  dd.getRange(1,1,newSheetCols.length,newSheetCols[0].length).setValues(newSheetCols);
}

function parseHTMLbyId(id) {
  var containArr = []; //empty array. this is overkill at this point, but will be useful at scale. 
  var respAll = UrlFetchApp.fetchAll(id);
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
  var ids = idSheet.getRange(1,1,idSheet.getLastRow(),1).getValues().join().split(',').map(Number);  
  var urls = createUrls(ids);//arr[i]);
  parseHTMLbyId(urls); 
} 
