//初始化 selenium-webdriver 驱动
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;


//加载chrome浏览器 webdriver 驱动程序
var driver = new webdriver.Builder()
	.withCapabilities(webdriver.Capabilities.chrome())
	.build();

//打开指定的url地址
driver.get('http://qa.gbps.com/login');
//发送webdriver 字符串给 id = kw 的 input 标签
driver.findElement(By.id('username')).sendKeys('guanguan');
driver.findElement(By.id('password')).sendKeys('123456');
driver.findElement(By.className('btn btn-large btn-block login-btn btn-orange')).click();
//模拟用户点击事件 触发 id = su 的按钮的click事件
//driver.findElement(By.id('su')).click();
//driver.findElement(By.className('btn btn-large btn-block login-btn btn-orange')).click();
//输入小小材，点击搜索
driver.findElement(By.name('q')).sendKeys('fr4大料');
driver.findElement(By.className('search-btn')).click();
driver.findElement(By.className('ui-btn next-page')).click();
//选择一条加入购物车，


driver.findElement(By.className('btn btn-orange-border add-to-spcar pre-add')).click();


//driver.executeScript('window.scrollTo(0,15);');

driver.sleep(1500);
//点击购物车
driver.actions().click(driver.findElement(By.id('cartSummaryComponent'))).perform()

//点击编辑
driver.findElement(By.className('operate-btn edit')).click();

//填写数量
driver.findElement(By.className('form-input quantity')).sendKeys('200');
//点击确定
driver.findElement(By.className('btn btn-xs btn-red btn-confirm')).click(); 

driver.sleep(1500);
//单选按钮
driver.findElement(By.name('requestApprovalType')).click();

driver.sleep(1500);
//复选框
driver.findElement(By.className('checkitems')).click();
//点击生成采购单
driver.findElement(By.className('btn btn-orange generate-order')).click();

//设置浏览器的标题
//until.titleIs('webdriver - baidu Search');
//暂停3s 
//driver.wait(function(){}, 3000);

//关闭浏览器
//driver.quit();
