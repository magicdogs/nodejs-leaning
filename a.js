
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var driver = new webdriver.Builder().withCapabilities(
    webdriver.Capabilities.chrome()
).build();


driver.get('file:///C:/Users/magicdog/Documents/Tencent%20Files/375904043/FileRecv/cs/GSCSO%20-%20%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.html');

driver.executeScript('return 2').then(function(return_value) {
    console.log('returned ', return_value)
});

var button = driver.findElement(By.xpath('//*[@id="treeview-1045-record-6"]/tbody/tr/td/div/span'));
console.log(button);
button.then(function(cx){
	console.log(cx);
	cx.getText().then(function(x){
		console.log(x);
	})
});