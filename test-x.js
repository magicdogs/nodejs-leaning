var EventProxy = require('eventproxy');
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var ep = new EventProxy();

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();


driver.get('https://www.baidu.com/');
driver.findElement(By.id('kw')).sendKeys('webdriver');
driver.switchTo().alert('ssss');
driver.findElement(By.id('su')).click();
until.titleIs('webdriver - baidu Search');

ep.all('r','c',function(r,c){
	//console.log(c);
	driver.executeScript(function(){
		return document.getElementById('1').innerHTML;
	}).then(function(dt){
		console.log(dt);
	});
	for (var i = 0; i <= c.length - 1; i++) {
		(function(s){
			s.getText().then(function(val,error){
				console.log(val);
			});
		})(c[i]);
	}
});

driver.wait(until.elementLocated(By.id('content_left'))).then(function(data,error){
	if(!error){
		ep.emit('r',data);
		data.findElements(By.className('result c-container')).then(function(rc,error){
			if(!error){
				ep.emit('c',rc);
			}
		});
		
	}
});

driver.wait(until.elementLocated(By.id('content_left')),3000);

//driver.quit();


