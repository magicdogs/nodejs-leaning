$.ajaxSetup({
    cache: true
});
Array.indexOf = function (arr, elt) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elt) {
            return i;
        }
    }
    return -1;
};

var holly = {
    session: {
        logined: false,
        extenType: 'sip',
        user: null,
        account: null
    },
    setCookie: function (name, value, days) {
        var cookieTime = days * 24 * 60 * 60 * 1000;
        var d = new Date();
        d.setTime(d.getTime() + cookieTime);
        var cookieExpires = "; expires=" + d.toGMTString();
        document.cookie = name + "=" + escape(value) + cookieExpires + "; path=/";
    },
    app: {
        init: function () {
            $("#softphoneBarKick").on("click", function () {
                if (holly.session.logined) {
                    holly.phone._phone_exit(true);
                }
            });
            $("#softphoneBarPick").on("click", function () {
                if (!holly.session.logined) {
                    holly.phone._phone_relogin(false);
                }
            });
            $("#softphone-bar .state_dropdown").click(function () {
                $("#softphone_otherstate").fadeToggle('fast');
            });
            $('body').click(function (e) {
                if ($("#softphone_otherstate").css("display") === "block" && e.target.id !== "softphone_dropdown" && e.target.id != "softphone_dropdown_caret") {
                    $("#softphone_otherstate").fadeOut('fast');
                }
            });
        },
        loginSuccessCallback: function () {
            if (hollyglobal.loginSuccessCallback && typeof hollyglobal.loginSuccessCallback == 'function') {
                hollyglobal.loginSuccessCallback();
            }
        },
        loginFailureCallback: function (mess) {
            if (hollyglobal.loginFailureCallback && typeof hollyglobal.loginFailureCallback == 'function') {
                hollyglobal.loginFailureCallback(mess);
            } else {
                alert(mess);
            }
        },
        loginMonitor: function () {
            holly.app._initMonitorPhone();
        },
        _initMonitorPhone: function () {
            var currentPbxId = hollyglobal.sipConfigId, pbx, nickName, proxyUrl, pbxId;
            var config = {
                monitor: true
            };
            for (var i = 0; i < hollyglobal.pbxs.length; i++) {
                pbx = hollyglobal.pbxs[i];
                nickName = pbx.NickName;
                proxyUrl = pbx.proxyUrl;
                pbxId = pbx.PBX;
                pbx = {
                    sipConfigId: pbxId,
                    pbxNick: nickName,
                    proxyUrl: proxyUrl,
                    sessionId: "",
                    isWaitingPbxEvent: false,
                    isMonitorLogOff: false
                };
                if (pbxId !== currentPbxId) {
                    if (!config.monitor) {
                        continue;
                    }
//                    pbx.monitor = false;
                } else {//找到账户相应的PBX，存储到phone_pbx，做为监控数据的基础数据
                    config.proxy_url = proxyUrl;
                    config.extenType = hollyglobal.loginExtenType;
                    config.password = hollyglobal.loginPassword;
                    config.user = hollyglobal.loginUser;
                    config.busyType = hollyglobal.loginBusyType;
                    config.pbxNick = nickName;
                    config.curPbx = pbxId;
                }
                holly.phone.phone_pbxs[pbxId] = pbx;
            }
            var phoneJson = {
                Command: "Action",
                Action: "Login",
                ActionID: "Login" + Math.random(),
                PBX: config.curPbx,
                Account: hollyglobal.accountId,
                Password: hollyglobal.monitorPassword,
                UserID: hollyglobal.monitorUserID,
                MonitorUser: true
            };
            phoneJson.isMonitorPage = true;
            holly.phone.phone_register(config, phoneJson);
        },
        _initSoftbarPhone: function () {
            holly.app.init();
            var actionName = "Login",
                phoneJson = {
                    Command: "Action",
                    Action: actionName,
                    ActionID: actionName + Math.random(),
                    Monitor: false,
                    ExtenType: hollyglobal.loginExtenType,
                    Password: hollyglobal.loginPassword,
                    BusyType: hollyglobal.loginBusyType,
                    User: hollyglobal.loginUser
                },
                config = {
                    proxy_url: hollyglobal.loginProxyUrl,
                    user: hollyglobal.loginUser
                };
            holly.phone.phone_register(config, phoneJson);
        }
    }
};