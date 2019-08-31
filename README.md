# Neurone-network-that-applies-a-trending-strategy-
Node js &amp;  python


Collection of BITCOIN data 

Extraction of BitCoin trend movements using bollinger bands

Creation of a neural network to predict the end of the trend


Part 1 : collect data from chart the bitcoin chart 
https://bitcoincharts.com/charts/bitstampEUR#rg1ztgSzm1g10zm2g25zv


run : 
node scrape.js
node combine.js data/ohclv.json



Part 2 :  extract bollinger bands and bands where the candle close  lower than the middle 


run :
node index.js

curl -H "Content-Type: application/json" --data @ohclv.json "http://127.0.0.1:8080/bollinger_bands"

then run :

node bands.js



Part 3 :

In jupyter notebook 
