//初始化 selenium-webdriver 驱动
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var EventProxy = require('eventproxy');

var driver2 = new webdriver.Builder()
	.withCapabilities(webdriver.Capabilities.chrome())
	.build();

//打开指定的url地址
driver2.get('http://qa.mzerg.com/gscso-management/');

driver2.sleep(2000);

driver2.findElement(By.id('textfield-1012-inputEl')).sendKeys('关洪琴');
driver2.findElement(By.id('textfield-1013-inputEl')).sendKeys('1234567');
driver2.findElement(By.id('button-1016-btnInnerEl')).click();
//driver2.findElement(By.className(' x-tree-elbow-img x-tree-elbow-plus x-tree-expander')).click();
//driver2.findElement(By.className(' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander')).click();
//driver2.findElement(By.className(' x-tree-elbow-img x-tree-elbow-plus x-tree-expander')).click();
//driver2.findElement(By.className('x-tree-node-text ')).click();

driver2.sleep(1500);

//var ep = new EventProxy();
//ep.all('order',function(el){

	//console.log(el);
	//driver2.actions().mouseMove(el).doubleClick().perform();

	//el.click();
//});

//双击 订单中心
driver2
.actions()  
.doubleClick(driver2.findElement(By.xpath('//div[@class="x-grid-item-container"]/table[4]')))
.perform();

//双击电商
driver2
.actions()
.doubleClick(driver2.findElement(By.xpath('//div[@class="x-grid-item-container"]/table[4]/../table[5]')))
.perform();



//双击PCB原材料订单管理
driver2
.actions()
.doubleClick(driver2.findElement(By.xpath('//div[@class="x-grid-item-container"]/table[4]/../table[5]/../table[6]')))
.perform();

//双击 指派交易员
driver2
.actions()
.doubleClick(driver2.findElement(By.xpath('//div[@class="x-grid-item-container"]/table[4]/../table[5]/../table[6]/../table[8]')))
.perform();


//等待ajax执行
driver2.sleep(3000);


//指派交易员 图片双击事件
driver2
.actions()
.doubleClick(driver2.findElement(By.xpath('//div[@id="contentPanel"]//div[@class="x-grid-item-container"]//table[2]//img[@data-qtip="指派交易员"]')))
.perform();

driver2.sleep(1500);

driver2
.actions()
.click(driver2.findElement(By.xpath('//input[@role="combobox"][@name="organization1"]')))
.perform();




driver2.sleep(1500);

driver2
.actions()
.click(driver2.findElement(By.xpath('//li[text()="运营系统 COO"]')))
.perform();

driver2.sleep(1500);

driver2
.actions()
.click(driver2.findElement(By.xpath('//input[@role="combobox"][@name="organization2"]')))
.perform();

driver2.sleep(900);

driver2
.actions()
.click(driver2.findElement(By.xpath('//li[text()="后台管理"]')))
.perform();

driver2.sleep(500);

driver2
.actions()
.click(driver2.findElement(By.xpath('//label[text()="曹辉"]')))
.perform();


driver2.sleep(500);

/*driver2
.actions()
.click(driver2.findElement(By.xpath('//span[text()="保存"]')))
.perform();*/


/*menus.then(function(menu){

	for (var i = menu.length - 1; i >= 0; i--) {
		(function(m){
			m.getText().then(function(c){
				console.log(c);
				if(c == '订单中心'){
					ep.emit('order',m);
				}
			});
			
		})(menu[i]);
	}
});*/

/*var containner = driver2.findElement(By.id('gridview-1056')).findElement(By.className('x-grid-item-container'));
containner.then(function(data){
	console.log(data.getText());
});*/