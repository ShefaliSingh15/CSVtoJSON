let readline = require('readline');
let fs = require('fs');
let asia=[];
let india=[];
let top=[];
let wl=fs.createWriteStream('../json/asia.json');
let al=fs.createWriteStream('../json/data.json');
let tl=fs.createWriteStream('../json/top.json');
const rl = readline.createInterface({
	input: fs.createReadStream('Indicators.csv')
});
rl.on('line', (line) =>{
		let arr = line.split(",")
	let asiaarray=['ARM','AZE','BHR','BGD','BTN','BRN','KHM','CHN','CXR','CCK','IOT','GEO','HKG','IND','IDN','IRN','IRQ','ISR','JPN','JOR','KAZ','KWT', 'KGZ','LAO','LBN','MAC','MYS','MDV','MNG','MMR','NPL','PRK','OMN','PAK','PSE','PHL','QAT','SAU','SGP','KOR','LKA','SYR','TWN','TJK','THA','TUR','TKM','ARE','UZB','VNM','YEM']
	for(i in asiaarray){
		if(arr[1]===asiaarray[i] && arr[2]==='\"Life expectancy at birth' && (arr[3]===' female (years)\"' || arr[3] ===' male (years)\"'))	{
			if(asia.find(x => (x.countrycode== arr[1])) == undefined) {
					let temp = {countrycode : (arr[1].length == 3)?arr[1]:arr[2] }
					temp[(arr[arr.length - 3] == "SP.DYN.LE00.FE.IN")?"LifeExpectancyFemale":"LifeExpectancyMale"] = parseFloat(arr[arr.length - 1]);
				    asia.push(temp);
				}
				else {
					let index =asia.findIndex(x => x.countrycode == arr[1]);
					if (asia[index][(arr[arr.length - 3] == "SP.DYN.LE00.FE.IN")?"LifeExpectancyFemale":"LifeExpectancyMale"] == undefined) {
				asia[index][(arr[arr.length - 3] == "SP.DYN.LE00.FE.IN")?"LifeExpectancyFemale":"LifeExpectancyMale"] = parseFloat(arr[arr.length - 1]);
					} else {
					asia[index][(arr[arr.length - 3] == "SP.DYN.LE00.FE.IN")?"LifeExpectancyFemale":"LifeExpectancyMale"] =asia[index][(arr[arr.length - 3] == "SP.DYN.LE00.FE.IN")?"LifeExpectancyFemale":"LifeExpectancyMale"] + parseFloat(arr[arr.length - 1]);
					}
				}
			}
		}

		if(arr[1]=="IND" && (arr[arr.length-3]=="SP.DYN.CBRT.IN" || arr[arr.length-3]=="SP.DYN.CDRT.IN")){
			if(india.find(x=> x.year === arr[arr.length-2])== undefined){
				let temp={year:arr[arr.length-2]}
				temp[arr[arr.length-3]]= parseFloat(arr[arr.length-1]);
				india.push(temp);
			}
			else{
				let index=india.findIndex(x=>x.year===arr[arr.length-2]);
				india[index][arr[arr.length-3]]= parseFloat(arr[arr.length-1]);
			}
		}

		if(arr[arr.length-3]=="SP.DYN.LE00.IN"){
			top.push({
				countryname : arr[0],
				value:parseFloat(arr[arr.length-1])
			});
		}
	});
rl.on('close',()=>{
	let x=1;
	let y=[];
	top.sort((a,b)=> a.value-b.value);
	while(y.length<5){
		if(y.find(z => z.countryname === top[top.length - x]["countryname"]) === undefined) {
			let temp = {	countryname : top[top.length - x]["countryname"],
			value : top[top.length - x]["value"]
		}
		y.push(temp);
	}
	x++;
}
wl.write(JSON.stringify(asia,null,2),'utf-8');
al.write(JSON.stringify(india,null,2),'utf-8');
tl.write(JSON.stringify(y,null,2),'utf-8');
});
