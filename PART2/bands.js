var fs=require('fs');
var bollingerData=fs.readFileSync('bollinger-bands.json', 'utf8');
var bitcoinData=fs.readFileSync('ohclv.json', 'utf8');

var bollingerDataParsed=JSON.parse(bollingerData);
var bitcoinDataParsed=JSON.parse(bitcoinData);

console.log("total bollinger bands ="+Object.keys(bollingerDataParsed).length )





i=0
bands=[]
 while(i<=Object.keys(bollingerDataParsed).length-18) 
 {   periodCount=0
     j=i
     while(bitcoinDataParsed[j][3]<bollingerDataParsed[j]['middle'])
     {
         periodCount++
         j++
     }
     if (periodCount> 18)
     { console.log("periode count ="+periodCount)
          band=[]
         for(k=i;k<=j;k++)
         {
            band.push(bitcoinDataParsed[k])
         }
         bands.push(band)
         i=j+1
     }
     else
     {
         i++

     }


 }



 const output = JSON.stringify(bands)

	fs.writeFile('bands.json', output, 'utf8', err => {
		if(err) {
			return reject(err)
		} else {
			console.log('bands.json saved')
			  }
    })
    

console.log(" total bands saved = "+Object.keys(bands).length)