var login_username = getUrlValue("loginName");
var login_password = getUrlValue("password");
var login_type = getUrlValue("loginType");
function getUrlValue (param) {
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd == -1)
        return query.substring(iStart);
    return query.substring(iStart, iEnd);
};

var hollyglobal = {
    hangupEvent: function (peer) {
//        console.dir(peer);
        alert('aaaaa');
    },
    ringEvent: function (peer) {
//        console.dir(peer);
    },
    talkingEvent: function (peer) {
//        console.dir(peer);
    },
    loginSuccessCallback: null,

    loginFailureCallback: function (peer) {
//        console.log(peer);
        alert('登录失败！');
    },
    pbxs: [
        {
            PBX: '2.3.1.101',
            pbxNick: '101',
            NickName: '101',
            proxyUrl: "http://10.8.15.222"
        }
    ],
    accountId: 'N000000008006',
    sipConfigId: '2.3.1.101',
    monitorPassword: '7pu3refwds98172e',
    monitorUserID: '2387rufhinjvcx73rfws',
    loginBusyType: "0",
    loginExtenType: login_type || "Local",
    loginPassword: login_password || "",//"123abc",
    loginUser: login_username || "" ,//"8210@wld",
    loginProxyUrl: "http://172.30.4.60",
    isDisplayInvestigate: true,
    isDisplayConsult: false,
    isHiddenNumber: false,
    isMonitorPage: false,
    isDisplayTransfer: false
};