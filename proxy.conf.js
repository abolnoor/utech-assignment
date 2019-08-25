var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: '/api',
  target: 'http://134.209.170.16',
  secure: false,
  pathRewrite: {'^/api' : ''},
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    //console.log(proxyReq, req, res);
    //console.log(req.headers);
    //proxyReq.setHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMzQuMjA5LjE3MC4xNlwvYXV0aCIsImlhdCI6MTU2NjY3NDI3NSwiZXhwIjoxNTY2Njc3ODc1LCJuYmYiOjE1NjY2NzQyNzUsImp0aSI6IjVTTUttaXpTTDV1M0Z6WDEiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.gN27_Jdwu2LccECyHhf05uLghfAKOgQzReHgzOIK2ic');
    
    // or log the req
  }
}
];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = null;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);