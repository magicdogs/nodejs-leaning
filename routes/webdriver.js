var express = require('express');
var router = express.Router();
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    driver.get('https://www.baidu.com');
    driver.findElement(By.id('kw')).sendKeys('webdriver');
    driver.findElement(By.id('su')).click();
    driver.wait(until.titleIs('webdriver_百度搜索'), 1000);
    driver.quit();
});

module.exports = router;


