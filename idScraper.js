var ss = SpreadsheetApp.openById("YOUR_ID");
var s1 = ss.getSheetByName("Sheet1");
var idSheet = ss.getSheetByName("ids");


function flatt(obj){
  return obj.toString().replace(/\n|\r/g, '');
}

//we need this validator since we are calling an index of the whole match. if the whole match is null (meaning it did not find a match), you will get an error. 
function valid(r,n){  if(r != null){    return r[n];  }else{ return '';}}


function getIdArr(){
  var alph = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","Z"]; //lol. bug chasing!
  var containArr = [];
  for(a=0; a<alph.length; a++) {
    var url = "http://newyork.advertisingweek.com/speakers?list="+alph[a];
    var resp = flatt(UrlFetchApp.fetch(url));
    var regXstr = '\\/speakers\\?id=(\\d+)"class="speaker-block';
    var regXmatch = new RegExp(regXstr, "g"); //i need one global, and one not global. 
    var regXgroup = new RegExp(regXstr); //this one will be used to get the "id"
    var matchIds = resp.match(regXmatch);
  
    for(m=0; m<matchIds.length; m++) {
      var wholeMatch = matchIds[m]; //this is the whole match. 
      var id = valid(regXgroup.exec(wholeMatch),1); 
      containArr.push([id]);
    }
    Logger.log(containArr) //nice. now we just need to loop through the alphabet.
  }
  var next = idSheet.getLastRow()+1; 
  idSheet.getRange(next,1,containArr.length,containArr[0].length).setValues(containArr);
}

