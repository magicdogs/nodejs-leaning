holly.phone = {
    phone_data: {},
    _phone_url: "",
    _phone_iccCount: 0,
    _phone_isWaitingEvent: false,
    _phone_isKick: true,
    _phone_unregister: 0,
    _phone_peerstate: 1,
    _phone_dialing: 2,
    _phone_innerDialing: 3,
    _phone_belling: 4,
    _phone_innerBelling: 5,
    _phone_listening: 6,
    _phone_talking: 7,
    _phone_threeWayTalking: 8,
    _phone_innerTalking: 9,
    _phone_dialTalking: 10,
    _phone_listened: 11,
    _phone_transferBelling: 12,
    _phone_transferDialing: 13,
    _phone_transfer: 14,
    _phone_dialoutTransfer: 15,
    _phone_systemBusy: 99,
    _phone_currentState: "",
    _phone_stateBeforeHold: "",
    _phone_isInvestigatting: false,
    _phone_stateDescription: ["unregister", "peerstate", "dialing", "innerDialing", "belling", "innerBelling", "listening", "talking", "threeWayTalking", "innerTalking", "dialTalking", "listened", "transferBelling", "transferDialing", "transfer", "dialTransfer"],

    _phone_peersFromSip: [],
    phone_peers: [],
    phone_peers_sip: [],
    phone_queues: [],
    phone_accountCalls: [],
    phone_serviceNos: [],
    _phone_isSettingbusy: false,
    _phone_isRelogin: false,
    phone_pbxs: [],
    _phone_callObject: {},
    _phone_sendAction: function (jsonData, onload, onerror) {
        var json = $.toJSON(jsonData);
        var timeout = 15000;
        if (jsonData.Timeout != undefined) {
            timeout = jsonData.Timeout;
        }
        $.ajax({
            type: "get",
            url: holly.phone._phone_url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    phone_register: function (config, phoneJson) {
        holly.phone._phone_url = config.proxy_url;
        var isMonitorPage = phoneJson.isMonitorPage;
        delete phoneJson.isMonitorPage;
        var onload = function (response) {
            var _response = response;
            if (!_response.Succeed) {
                var code = _response.Result;
                if (code) {
                    if (code == 601) {
                        holly.app.loginFailureCallback("您的账户通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                    } else {
                        if (code == 602) {
                            holly.app.loginFailureCallback("您的账户无通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                        } else if (code == 408) {
                            holly.app.loginFailureCallback("由于您的主软电话条没有签入，不能登录软电话");
                        } else {
                            holly.app.loginFailureCallback("登录失败" + code + ",通话功能将不能使用");
                        }
                    }
                }
            } else if (_response.SessionID) {
                config.uniqueId = _response.SessionID;
                var date = new Date();
                var identity = date.valueOf();
                config.currentServerTime = identity - _response.Timestamp * 1000;
                config.phonebarConfig = _response.PhonebarConfig;
                config.autoBusyTime = _response.AutoBusyTime;
                config.userId = _response.UserID;
                config.pbx_in_ip = _response.PBX;
                config.accountId = _response.Account;
                config.loginName = config.user;
                config.sipNo = _response.SipNum;
                config.monitorUser = _response.MonitorUser;
                config.monitorPassword = _response.MonitorPassword;
                config.depts = $.evalJSON(_response.Departments);
                config.departmentID = (_response.DepartmentID) ? (_response.DepartmentID) : "";
                holly.session.logined = true;
                holly.softphonebar.softphonebar_init();
                holly.phone._phone_init(config);
                holly.phone._phone_waitEvent(isMonitorPage);
                if (isMonitorPage) {
                    hollyglobal.isMonitorPage = true;
                    var curpbx;
                    if (holly.phone.phone_data.pbx_in_ip) {
                        curpbx = holly.phone.phone_pbxs[holly.phone.phone_data.pbx_in_ip];
                        curpbx.sessionId = _response.SessionID;
                    } else {
                        curpbx = holly.phone.phone_pbxs[hollyglobal.sipConfigId];
                        curpbx.sessionId = _response.SessionID;
                        holly.phone.phone_data.pbx_in_ip = hollyglobal.sipConfigId;
                        holly.phone.phone_data.accountId = hollyglobal.accountId;
                        holly.phone.phone_data.userId = config.userId;
                    }
                    $("#monitor_allpbx").css("display", "block");
                    holly.softphonebar.monitor_agent();
                } else {
                    holly.utils.pickSoftphonebar();
                }
                holly.app.loginSuccessCallback();
            }
        };
        var onerror = function (xhr, status, error) {
            holly.app.loginFailureCallback('请求超时，请检查本地网络');
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    _phone_init: function (config) {
        holly.session.user = {};
        holly.session.user.userId = config.userId;
        holly.session.user.loginName = config.loginName;
        holly.session.user.password = config.password;
        holly.session.user.extenType = config.extenType;
        holly.session.user.busyType = config.busyType;
        holly.session.user.sipConfigId = config.curPbx;
        holly.phone.phone_data.uniqueId = config.uniqueId;
        holly.phone.phone_data.currentServerTime = config.currentServerTime;
        holly.phone.phone_data.autoBusyTime = config.autoBusyTime;
        holly.phone.phone_data.userId = config.userId;
        holly.phone.phone_data.pbx_in_ip = config.pbx_in_ip;
        holly.phone.phone_data.accountId = config.accountId;
        holly.phone.phone_data.loginName = config.loginName;
        holly.phone.phone_data.sipNo = config.sipNo;
        holly.phone.phone_data.monitor = config.monitor;
        holly.phone.phone_data.user = config.user;
        holly.phone.phone_data.password = config.password;
        holly.phone.phone_data.extenType = config.extenType;
        holly.phone.phone_data.busyType = config.busyType;
        holly.phone.phone_data.monitorUser = config.monitorUser;
        holly.phone.phone_data.monitorPassword = config.monitorPassword;
        holly.phone.phone_data.depts = config.depts;
        holly.phone.phone_data.departmentID = config.departmentID;
        holly.phone.phone_data.phonebarConfig = new Array();
        if (config.phonebarConfig) {
            var peerstates = config.phonebarConfig.split(",");
            for (var i = 0; i < peerstates.length; i++) {
                holly.phone.phone_data.phonebarConfig[peerstates[i].split(":")[0]] = peerstates[i].split(":")[1]
            }
        }
        holly.phone._phone_currentState = holly.phone._phone_unregister;
        holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_currentState], ""]);
    },
    _phone_waitEvent: function (isMonitorPage) {
        if (holly.phone._phone_isWaitingEvent)
            return;
        holly.phone._phone_isWaitingEvent = true;
        var phoneJson = {
            Command: "Action",
            Action: "GetState",
            ActionID: "GetState" + Math.random(),
            SessionID: holly.phone.phone_data.uniqueId,
            User: holly.phone.phone_data.userId
        };
        var onload = function (response) {
            holly.phone._phone_iccCount = 0;
            if (!response)
                return;
            var datas = response;
            var _response = datas.Response;
            if (!_response)
                _response = datas;
            if (_response.Succeed && !_response.HasEvent) {
            } else if (!_response.Succeed) {
                if (_response.Expired && holly.phone._phone_isKick) {
                    holly.phone._phone_relogin(isMonitorPage);
                    holly.phone._phone_isWaitingEvent = false;
                    return;
                }
                return;
            } else {
                if (_response.Kick) {
                    var comments = "";
                    if (_response.Comments)
                        comments = _response.Comments;
                    if (!isMonitorPage) {
                        if (comments == "ukick" || comments == "ekick") {
                            holly.utils.showError("您的帐号在其他地方登录了", "softphone_transfer");
                        } else {
                            holly.utils.showError("您已被管理员强制签出", "softphone_transfer");
                        }
                        holly.session.logined = false;
                        holly.phone._phone_isWaitingEvent = false;
                        holly.utils.kickSoftphonebar();
                        holly.phone._phone_isKick = false;
                        holly.softphonebar._softphonebar_barupdate('', 'unregister', '');
                        return;
                    }
                } else {
                    var events = datas.Event;
                    if (events != null && holly.phone._phone_isKick) {
                        holly.phone._phone_eventHandler(events);
                        if (hollyglobal.multiLogin && holly.phone._phone_currentState === holly.phone._phone_unregister) {
                            holly.session.logined = false;
                            holly.phone._phone_isWaitingEvent = false;
                            return;
                        }
                    }
                }
            }
            holly.phone._phone_isWaitingEvent = false;
            holly.phone._phone_waitEvent(isMonitorPage);
        };
        var onerror = function () {
            holly.phone._phone_isWaitingEvent = false;
            holly.phone._phone_isKick = true;
            window.setTimeout(function () {
                holly.phone._phone_iccCount++;
                if (holly.phone._phone_iccCount >= 3) {
                    holly.phone._phone_iccCount = 0;
                    holly.utils.unRegisterSoftphonebar();
                    //alert("连接服务器超时，可能是您的网络问题，正在尝试重新连接...");
                    holly.utils.showError("连接超时，尝试重新连接", "softphone_transfer");
                }
                holly.phone._phone_waitEvent(isMonitorPage);
            }, 1000);
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    _phone_relogin: function (isMonitorPage) {
        if (holly.phone._phone_isRelogin)
            return;
        holly.phone._phone_isRelogin = true;
        var actionName = "Login";
        if (hollyglobal.multiLogin) {
            actionName = "MultipleLogin";
        }
        var phoneJson = {
            Command: "Action",
            Action: actionName,
            ActionID: "Login" + Math.random(),
            Monitor: holly.phone.phone_data.monitor
        };
        var config = {
            monitor: false
        };
        phoneJson.ExtenType = hollyglobal.loginExtenType;
        phoneJson.Password = hollyglobal.loginPassword;
        phoneJson.BusyType = hollyglobal.loginBusyType;
        phoneJson.User = hollyglobal.loginUser;
        config.extenType = hollyglobal.loginExtenType;
        config.password = hollyglobal.loginPassword;
        config.user = hollyglobal.loginUser;
        if (isMonitorPage) {
            var phoneJson = {
                Command: "Action",
                Action: "Login",
                ActionID: "Login" + Math.random(),
                PBX: holly.session.user.sipConfigId,
                Account: hollyglobal.accountId,
                Password: hollyglobal.monitorPassword,
                UserID: hollyglobal.monitorUserID,
                MonitorUser: true
            };
        }
        var onload = function (response) {
            var _response = response;
            if (!_response.Succeed) {
                var code = _response.Result;
                if (code) {
                    if (code == 601) {
                        holly.app.loginFailureCallback("您的账户通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                    } else if (code == 602) {
                        holly.app.loginFailureCallback("您的账户无通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                    } else if (code == 408) {
                        holly.app.loginFailureCallback("由于您的主软电话条没有签入，不能签入软电话");
                    } else {
                        holly.app.loginFailureCallback("登录失败" + code + ",通话功能将不能使用");
                    }
                } else {
                    holly.app.loginFailureCallback("您当前的会话已经失效,通话功能将不能使用");
                }
            } else if (_response.SessionID) {
                config.uniqueId = _response.SessionID;
                var date = new Date();
                var identity = date.valueOf();
                config.currentServerTime = identity - _response.Timestamp * 1000;
                config.phonebarConfig = _response.PhonebarConfig;
                config.autoBusyTime = _response.AutoBusyTime;
                config.userId = _response.UserID;
                config.pbx_in_ip = _response.PBX;
                config.accountId = _response.Account;
                config.sipNo = _response.SipNum;
                config.monitorUser = _response.MonitorUser;
                config.monitorPassword = _response.MonitorPassword;
                config.depts = $.evalJSON(_response.Departments);
                config.departmentID = (_response.DepartmentID) ? (_response.DepartmentID) : "";
                holly.session.logined = true;
                holly.softphonebar.softphonebar_init();
                holly.phone._phone_init(config);
                if (isMonitorPage) {
                    var curPbx;
                    if (holly.phone.phone_data.pbx_in_ip) {
                        curPbx = holly.phone.phone_pbxs[holly.phone.phone_data.pbx_in_ip];
                        curPbx.sessionId = _response.SessionID;
                    } else {
                        curPbx = holly.phone.phone_pbxs[holly.session.user.sipConfigId];
                        curPbx.sessionId = _response.SessionID;
                        holly.phone.phone_data.pbx_in_ip = holly.session.user.sipConfigId;
                        holly.phone.phone_data.accountId = hollyglobal.accountId;
                        holly.phone.phone_data.userId = holly.session.user.userId;
                    }
                } else
                    holly.utils.pickSoftphonebar();
                holly.phone._phone_isWaitingEvent = false;
                holly.phone._phone_isKick = true;
                holly.phone._phone_waitEvent(isMonitorPage);
                holly.app.loginSuccessCallback();
            }
            holly.phone._phone_isRelogin = false;
        };
        var onerror = function () {
            holly.app.loginFailureCallback('请求合力通话服务器超时，请检查本地网络');
            holly.phone._phone_isRelogin = false;
            holly.phone._phone_isKick = true;
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    _phone_eventHandler: function (evtJsons) {
        $.each(evtJsons, function (i, item) {
            holly.phone._phone_stateProcess(item);
            if (hollyglobal.isMonitorPage) {
                holly.phone._phone_monitorPeer(item);
                holly.phone._phone_monitorQueue(item);
                holly.phone._phone_monitorServiceNo(item);
            }
            if (item.Event === "UserStatus" && item.PeerStatus === "Unregistered" && holly.phone.phone_data.userId === item.UserID) {
                if (!holly.phone.phone_data.monitor)
                    return false;
            }
        });
    },
    _phone_monitorAccount: function (evtJson) {
        if (evtJson.Event === "AccountStatus") {
            var account;
            if (!holly.phone.phone_accountCalls[evtJson.PBX]) {
                account = {
                    account: evtJson.Account,
                    inCalls: evtJson.InCalls,
                    outComplete: evtJson.OutComplete,
                    inComplete: evtJson.InComplete,
                    outCalls: evtJson.OutCalls,
                    inCallsPerHour: evtJson.InCallsPerHour,
                    currentOutCalls: evtJson.CurrentOutCalls,
                    pbx: evtJson.PBX,
                    inCompletePerHour: evtJson.InCompletePerHour,
                    outCallsPerHour: evtJson.OutCallsPerHour,
                    currentInCalls: evtJson.CurrentInCalls,
                    outCompletePerHour: evtJson.OutCompletePerHour
                };
                holly.phone.phone_accountCalls[evtJson.PBX] = account;
                holly.phone.phone_publishEvent("EvtAccountCalls", [account]);
            } else {
                account = holly.phone.phone_accountCalls[evtJson.PBX];
                account.account = evtJson.Account;
                account.inCalls = evtJson.InCalls;
                account.outComplete = evtJson.OutComplete;
                account.inComplete = evtJson.InComplete;
                account.outCalls = evtJson.OutCalls;
                account.inCallsPerHour = evtJson.InCallsPerHour;
                account.currentOutCalls = evtJson.CurrentOutCalls;
                account.pbx = evtJson.PBX;
                account.inCompletePerHour = evtJson.InCompletePerHour;
                account.outCallsPerHour = evtJson.OutCallsPerHour;
                account.currentInCalls = evtJson.CurrentInCalls;
                account.outCompletePerHour = evtJson.OutCompletePerHour;
                holly.phone.phone_publishEvent("EvtAccountCalls", [account]);
            }
        }
    },
    phone_pbxMonitor: function (pbx) {
        for (var i in holly.phone.phone_pbxs) {
            if (i === holly.phone.phone_data.pbx_in_ip)
                continue;
            if (i === pbx) {
                if (!holly.phone.phone_pbxs[pbx].monitor)
                    holly.phone._phone_pbxMonitorResister(i);
            } else {
                if (holly.phone.phone_pbxs[i].monitor)
                    holly.phone._phone_pbxMonitorLogOff(i)
            }
        }
    },
    _phone_pbxMonitorLogOff: function (pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        if (phone_pbx.isMonitorLogOff)
            return;
        phone_pbx.isMonitorLogOff = true;
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "Logoff",
            ActionID: "Logoff" + Math.random(),
            SessionID: phone_pbx.sessionId
        };
        var onload = function (response) {
            phone_pbx.isMonitorLogOff = false;
            phone_pbx.monitor = false;
        };
        var onerror = function () {
            phone_pbx.isMonitorLogOff = false;
            phone_pbx.monitor = false;
        };
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    _phone_pbxMonitorResister: function (pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx],
            url = phone_pbx.proxyUrl,
            phoneJson = {
                Command: "Action",
                Action: "Login",
                ActionID: "Login" + Math.random(),
                PBX: pbx,
                Account: holly.phone.phone_data.accountId,
                UserID: hollyglobal.monitorUserID,
                Password: hollyglobal.monitorPassword,
                MonitorUser: true
            };
        if (pbx === hollyglobal.sipConfigId)
            phoneJson.MonitorRealUserID = hollyglobal.userId;
        var onload = function (response) {
            if (response.Succeed) {
                holly.phone.phone_pbxs[pbx].sessionId = response.SessionID;
                holly.phone.phone_pbxs[pbx].isWaitingPbxEvent = false;
                holly.phone.phone_pbxs[pbx].monitor = true;
                holly.phone._phone_waitPbxEvent(pbx);
            } else {
                holly.phone.phone_pbxs[pbx].monitor = false;
            }
        };
        var onerror = function () {
            holly.phone.phone_pbxs[pbx].monitor = false;
            holly.utils.showError("请求超时，请检查本地网络", "softphone_transfer");

        };
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    _phone_waitPbxEvent: function (pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        if (!phone_pbx || !phone_pbx.monitor || phone_pbx.isWaitingPbxEvent)
            return;
        phone_pbx.isWaitingPbxEvent = true;
        var url = phone_pbx.proxyUrl,
            phoneJson = {
                Command: "Action",
                Action: "GetState",
                ActionID: "GetState" + Math.random(),
                SessionID: phone_pbx.sessionId,
                User: holly.phone.phone_data.monitorUser
            };
        var onload = function (response) {
            if (!response) {
                return;
            }
            var _response = response.Response;
            if (!_response.Succeed) {
                if (_response.Expired) {
                    phone_pbx.isWaitingPbxEvent = false;
                    holly.phone._phone_pbxMonitorResister(pbx, url);
                    return;
                }
            } else if (_response.Succeed && _response.HasEvent) {
                var events = response.Event;
                if (events != null) {
                    holly.phone._phone_eventHandler(events, true);
                }
            }
            phone_pbx.isWaitingPbxEvent = false;
            holly.phone._phone_waitPbxEvent(pbx);
        };
        var onerror = function () {
            phone_pbx.isWaitingPbxEvent = false;
        };
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    _phone_monitorServiceNo: function (evtJson) {
        if (evtJson.Event === "TrunkStatus") {
            var displayName, serviceNo;
            if (evtJson.DisplayName) {
                displayName = evtJson.DisplayName;
                if (holly.utils.startWith(displayName, "serviceno-"))
                    displayName = "";
            }
            if (!holly.phone.phone_serviceNos[evtJson.ServiceNo]) {
                serviceNo = {
                    serviceNo: evtJson.ServiceNo,
                    inCalls: evtJson.InCalls,
                    inLost: evtJson.InLost,
                    inComplete: evtJson.InComplete,
                    outCalls: 0,
                    outComplete: 0,
                    displayName: displayName,
                    pbx: evtJson.PBX
                };
                holly.phone.phone_serviceNos[evtJson.ServiceNo] = serviceNo;
            } else {
                serviceNo = holly.phone.phone_serviceNos[evtJson.ServiceNo];
                serviceNo.inCalls = evtJson.InCalls,
                    serviceNo.inLost = evtJson.InLost,
                    serviceNo.inComplete = evtJson.InComplete,
                    serviceNo.outCalls = 0,
                    serviceNo.outComplete = 0,
                    serviceNo.displayName = displayName
            }
            holly.phone.phone_publishEvent("EvtMonitorServiceNo", [holly.phone.phone_serviceNos[evtJson.ServiceNo]]);
        }
    },
    _phone_stateProcess: function (evtJson) {
        holly.phone._phone_super(evtJson);
        switch (holly.phone._phone_currentState) {
            case holly.phone._phone_unregister:
                if (evtJson.Event === "PeerStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.PeerStatus === "Registered") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                } else if (evtJson.Event === "UserStatus") {
                    if (holly.phone.phone_data.userId === evtJson.UserID) {
                        if (holly.phone.phone_data.sipNo !== evtJson.SipNum) {
                            if (evtJson.PeerStatus === "Registered") {
                                holly.phone._phone_currentState = holly.phone._phone_peerstate;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_peerstate:
                if (evtJson.Event === "UserBusy") {
                    if (holly.phone.phone_data.userId === evtJson.UserID) {
                        holly.phone.phone_data.busyType = evtJson.BusyType;
                        holly.phone._phone_currentState = holly.phone._phone_peerstate;
                        holly.phone._phone_update(evtJson);
                    }
                } else if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Ringing") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_belling;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerBelling;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transferBelling;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transferDialing;
                                holly.phone._phone_update(evtJson);
                            }
                        } else if (evtJson.ChannelStatus === "Ring") {
                            if (evtJson.ChannelType === "dialout") {
                                holly.phone._phone_currentState = holly.phone._phone_dialing;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerDialing;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.ChannelType === "listen") {
                                holly.phone._phone_currentState = holly.phone._phone_listening;
                                holly.phone._phone_update(evtJson);
                            }
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialout") {
                                holly.phone._phone_currentState = holly.phone._phone_dialTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        } else if (evtJson.ChannelStatus === "Up") {
                            if (evtJson.ChannelType === "listen") {
                                holly.phone._phone_currentState = holly.phone._phone_listened;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                } else if (evtJson.Event === "PeerStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.PeerStatus !== "Registered") {
                            holly.phone._phone_currentState = holly.phone._phone_unregister;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_dialing:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.ChannelType === "dialout") {
                                holly.phone._phone_currentState = holly.phone._phone_dialTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_innerDialing:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_belling:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_innerBelling:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_listening:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Up") {
                            if (evtJson.ChannelType === "listen") {
                                holly.phone._phone_currentState = holly.phone._phone_listened;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_talking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_transfer:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_dialoutTransfer:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_threeWayTalking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_innerTalking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_dialTalking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_listened:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_transferBelling:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus == "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_transferDialing:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
        }
    },
    _phone_monitorPeer: function (evtJson) {
        if (evtJson.Event === "ChannelStatus") {
            if (evtJson.ChannelStatus === "Hangup" && !evtJson.UserID)
                return;
            var peer = holly.phone.phone_peers_sip[evtJson.Exten];
            if (!peer)
                return;
            if (evtJson.ChannelStatus === "Down") {
                peer.callStatus = "Down";
                peer.channel = evtJson.Channel;
                holly.phone._phone_updateQueueInfo();
            } else if (evtJson.ChannelStatus === "Ring") {
                peer.callStatus = "Ring";
                peer.called = false;
                peer.C5Status = evtJson.C5Status;
                peer.timestamp = evtJson.Timestamp;
                peer.channel = evtJson.Channel;
                peer.queueName = "";
                if (evtJson.C5Status === "OutboundCall"
                    || evtJson.C5Status === "InboundCall"
                    || evtJson.C5Status === "listen") {
                    peer.callNo = evtJson.Data.ListenExten;
                } else if (evtJson.FromDid)
                    peer.callNo = evtJson.FromDid;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else if (evtJson.ChannelStatus === "Ringing") {
                peer.called = true;
                peer.callStatus = "Ringing";
                peer.C5Status = evtJson.C5Status;
                peer.channel = evtJson.Channel;
                peer.linkedChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.LinkedChannel)
                    peer.queueName = evtJson.LinkedChannel.QueueName;
                if (evtJson.ChannelType === "dialTransfer")
                    peer.callNo = evtJson.FromDid;
                else
                    peer.callNo = evtJson.FromCid;
                peer.timestamp = evtJson.Timestamp;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else if (evtJson.ChannelStatus === "Up") {
                if (evtJson.ChannelType === "listen") {
                    peer.callNo = evtJson.Data.ListenExten;
                    peer.timestamp = evtJson.Timestamp;
                    peer.C5Status = evtJson.C5Status;
                    peer.callStatus = evtJson.ChannelType;
                    peer.linked = true;
                    peer.channel = evtJson.Channel;
                    holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                }
            } else if (evtJson.ChannelStatus === "Link") {
                peer.timestamp = evtJson.Timestamp;
                peer.C5Status = evtJson.C5Status;
                peer.linked = true;
                peer.channel = evtJson.Channel;
                peer.callStatus = evtJson.ChannelType;
                if (evtJson.LinkedChannel) {
                    peer.linkedChannel = evtJson.LinkedChannel.Channel;
                    peer.queueName = evtJson.LinkedChannel.QueueName;
                }
                if (evtJson.ChannelType === "dialout"
                    || evtJson.ChannelType === "dialTransfer")
                    peer.callNo = evtJson.FromDid;
                else if (evtJson.ChannelType === "inner") {
                    if (evtJson.LinkedChannel) {
                        var linkExten = evtJson.LinkedChannel.Exten;
//                        var linkPeer = holly.phone._phone_getUserFromSip(linkExten);
                        var linkPeer = holly.phone.phone_peers_sip[linkExten];
                        if (linkPeer) {
                            if (linkPeer.callStatus !== "inner") {
                                peer.callNo = evtJson.FromDid;
                            } else {
                                peer.callNo = evtJson.FromCid;
                            }
                        } else {
                            peer.callNo = evtJson.FromCid;
                        }
                    } else {
                        peer.callNo = evtJson.FromCid;
                    }
                } else
                    peer.callNo = evtJson.FromCid;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else if (evtJson.ChannelStatus === "Unlink") {

            } else if (evtJson.ChannelStatus === "Hangup") {
                if (evtJson.ChannelType === "listen") {
                    if (holly.phone.phone_data._curChannel === evtJson.Channel) {
                        holly.phone.phone_data._otherChannel = "";
                        holly.phone.phone_publishEvent("EvtEndListen", []);
                    }
                }
                if (peer.channel === evtJson.Channel) {
                    if (holly.phone.phone_data._otherChannel === evtJson.Channel
                        && (holly.phone._phone_stateDescription[holly.phone._phone_currentState] === "listening"
                            || holly.phone._phone_stateDescription[holly.phone._phone_currentState] == "listened")) {
                        holly.phone.phone_hangup();
                    }
                }
                peer.callNo = "";
                peer.callStatus = "Idle";
                peer.timestamp = evtJson.Timestamp;
                peer.channel = "";
                peer.linkedChannel = "";
                peer.queueName = "";
                holly.phone._phone_updateQueueInfo();
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);

                if (evtJson.Exten && peer.sipNo === evtJson.Exten) {
                    if (hollyglobal.hangupEvent && typeof hollyglobal.hangupEvent === 'function') {
//                        hollyglobal.hangupEvent(peer);
                    }
                }
            }
        } else if (evtJson.Event === "UserStatus") {
            var isRegistered = false;
            if (evtJson.PeerStatus === "Registered")
                isRegistered = true;
            if (!holly.phone.phone_peers[evtJson.UserID]) {
                peer = {
                    exten: evtJson.Exten,
                    sipNo: evtJson.SipNum,
                    name: evtJson.User,
                    DisplayName: evtJson.DisplayName,
                    loginExten: evtJson.LoginExten,
                    peerStatus: evtJson.PeerStatus,
                    status: evtJson.Status,
                    C5Status: evtJson.C5Status,
                    busy: evtJson.Busy,
                    extenType: evtJson.ExtenType,
                    login: evtJson.Login,
                    userId: evtJson.UserID,
                    user: evtJson.User,
                    localNo: evtJson.Local,
                    register: isRegistered,
                    InCalls: evtJson.InCalls,
                    InComplete: evtJson.InComplete,
                    TransferComplete: evtJson.TransferComplete,
                    OutCalls: evtJson.OutCalls,
                    OutComplete: evtJson.OutComplete,
                    DialoutTimeLength: evtJson.DialoutTimeLength,
                    linked: false,
                    channel: "",
                    linkedChannel: "",
                    called: false,//是否是被呼
                    callStatus: "Idle",
                    callNo: "",
                    department: evtJson.DepartmentID ? evtJson.DepartmentID : "",
                    timestamp: evtJson.Login ? (evtJson.BusyTimestamp) : "",
                    busyTimestamp: evtJson.BusyTimestamp,
                    loginTimestamp: evtJson.LoginTimestamp,
                    busyType: evtJson.BusyType,
                    pinyin: cnToSpell.getSpell(evtJson.DisplayName),
                    pbx: evtJson.PBX
                };
                holly.phone.phone_peers[evtJson.UserID] = peer;
                holly.phone.phone_peers_sip[evtJson.SipNum] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.peerStatus = evtJson.PeerStatus;
                peer.status = evtJson.Status;
                peer.exten = evtJson.Exten;
                peer.sipNo = evtJson.SipNum;
                peer.C5Status = evtJson.C5Status;
                peer.busy = evtJson.Busy;
                peer.extenType = evtJson.ExtenType;
                peer.login = evtJson.Login;
                peer.loginExten = evtJson.LoginExten;
                peer.name = evtJson.User;
                peer.DisplayName = evtJson.DisplayName;
                peer.userId = evtJson.UserID;
                peer.user = evtJson.User;
                peer.localNo = evtJson.Local;
                peer.register = isRegistered;
                peer.InCalls = evtJson.InCalls;
                peer.InComplete = evtJson.InComplete;
                peer.TransferComplete = evtJson.TransferComplete;
                peer.DialoutTimeLength = evtJson.DialoutTimeLength;
                peer.OutCalls = evtJson.OutCalls;
                peer.OutComplete = evtJson.OutComplete;
                peer.department = evtJson.DepartmentID ? evtJson.DepartmentID : "";
                peer.busyTimestamp = evtJson.BusyTimestamp;
                peer.loginTimestamp = evtJson.LoginTimestamp;
                peer.busyType = evtJson.BusyType;
                peer.timestamp = peer.login ? (peer.busyTimestamp) : "";
                if (peer.DisplayName !== evtJson.DisplayName)
                    peer.pinyin = cnToSpell.getSpell(evtJson.DisplayName);
                holly.phone.phone_peers_sip[evtJson.SipNum] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserBusy") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.busy = evtJson.Busy;
                peer.busyType = evtJson.BusyType;
                peer.busyTimestamp = evtJson.BusyTimestamp;
                peer.timestamp = peer.login ? (peer.busyTimestamp) : "";
                peer.loginTimestamp = evtJson.LoginTimestamp;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserCallsUpdate") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.InCalls = evtJson.InCalls;
                peer.InComplete = evtJson.InComplete;
                peer.TransferComplete = evtJson.TransferComplete;
                peer.DialoutTimeLength = evtJson.DialoutTimeLength;
                peer.OutCalls = evtJson.OutCalls;
                peer.OutComplete = evtJson.OutComplete;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserSignIn") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.extenType = evtJson.ExtenType;
                peer.login = evtJson.Login;
                peer.sipNo = evtJson.SipNum;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserSignOut") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.extenType = evtJson.ExtenType;
                peer.sipNo = evtJson.SipNum;
                peer.login = evtJson.Login;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "PeerStatus") {
            isRegistered = false;
            if (evtJson.PeerStatus === "Registered")
                isRegistered = true;
//            var peer = holly.phone._phone_getUserFromSip(evtJson.Exten);
            peer = holly.phone.phone_peers_sip[evtJson.Exten];
            if (peer) {
                peer.register = isRegistered;
                peer.status = evtJson.Status;
                if (evtJson.ExtenType && evtJson.ExtenType === 'Local') {
                    peer.localNo = evtJson.LocalNum;
                    peer.loginExten = evtJson.LocalNum;
                }
                holly.phone.phone_peers[peer.UserID] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        }
    },
    phone_registerEvent: function (eventName, method) {
        $("#icc_event").on(eventName, method);
    },
    phone_publishEvent: function (eventName, params) {
        $("#icc_event").trigger(eventName, params);
    },
    _phone_updateQueueInfo: function () {
//        if(!phone_queues || phone_queues.length<1)
//            return;
        for (var i in holly.phone.phone_queues) {
            var queue = holly.phone.phone_queues[i];
            var members = queue.members;
            queue.busyAgentCount = 0;
            queue.idleAgentCount = 0;
            for (var j in members) {
//                var peer = holly.phone._phone_getUserFromSip(members[j]);
                var peer = holly.phone.phone_peers_sip[members[j]];
                if (peer) {
                    if (peer.extenType === "sip") {
                        if (!peer.register
                            || !peer.login
                            || peer.busy
                            || peer.callStatus !== "Idle") {
                            queue.busyAgentCount++;
                        } else {
                            queue.idleAgentCount++;
                        }
                    } else if (peer.extenType === "gateway") {
                        if (!peer.register
                            || peer.busy
                            || peer.callStatus !== "Idle") {
                            queue.busyAgentCount++;
                        } else {
                            queue.idleAgentCount++;
                        }
                    } else if (peer.extenType === "Local") {
                        if (peer.busy
                            || peer.callStatus !== "Idle") {
                            queue.busyAgentCount++;
                        } else {
                            queue.idleAgentCount++;
                        }
                    } else {
                        queue.busyAgentCount++;
                    }
                } else {
                    queue.idleAgentCount++;
                }
            }
            holly.phone.phone_publishEvent("EvtMonitorQueue", [queue, "noNeedWaitCount"]);
        }
    },
    _phone_update: function (evtJson) {
        var timestamp = "";
        if (evtJson.Event === "ChannelStatus") {
            if (evtJson.Timestamp)
                timestamp = evtJson.Timestamp;
        } else if (evtJson.Event === "UserStatus") {
            timestamp = (evtJson.Login ? (evtJson.BusyTimestamp) : "");
        } else if (evtJson.Event === "UserBusy") {
            timestamp = evtJson.BusyTimestamp;
        }
        if (holly.phone._phone_currentState !== holly.phone._phone_peerstate) {
            holly.utils.hideSoftphonebar();
        } else {
            holly.utils.pickSoftphonebar();
        }
        holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_currentState], timestamp]);
        switch (holly.phone._phone_currentState) {
            case holly.phone._phone_unregister:
                break;
            case holly.phone._phone_peerstate:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        holly.phone.phone_data._curChannel = evtJson.Channel;
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone.phone_publishEvent("EvtHangup", evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_dialing:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                    holly.phone.phone_publishEvent("EvtRing", evtJson);
//                    holly.softphonebar._softphonebar_evtRing(evtJson);
                }
                break;
            case holly.phone._phone_innerDialing:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                break;
            case holly.phone._phone_belling:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    holly.phone.phone_publishEvent("EvtRing", evtJson);
//                    holly.softphonebar._softphonebar_evtRing(evtJson);
                }
                break;
            case holly.phone._phone_innerBelling:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
//                        holly.phone.phone_publishEvent("EvtRing", evtJson);
                    }
                }
                break;
            case holly.phone._phone_listening:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                break;
            case holly.phone._phone_talking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Exten == holly.phone.phone_data.sipNo) {
//                    holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    holly.softphonebar._softphonebar_evtTalking(evtJson);
                }
                break;
            case holly.phone._phone_transfer:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
//                        holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    }
                }
                break;
            case holly.phone._phone_dialoutTransfer:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                if (evtJson.LinkedChannel) {
                    holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                }
                break;
            case holly.phone._phone_threeWayTalking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                break;
            case holly.phone._phone_innerTalking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                if (evtJson.LinkedChannel)
                    holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
//                        holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    }
                }
                break;
            case holly.phone._phone_dialTalking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Exten === holly.phone.phone_data.sipNo) {
//                    holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    holly.softphonebar._softphonebar_evtTalking(evtJson);
                }
                break;
            case holly.phone._phone_listened:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                break;
            case holly.phone._phone_transferBelling:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
//                        holly.phone.phone_publishEvent("EvtRing", evtJson);
                    }
                }
                break;
            case holly.phone._phone_transferDialing:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    var linkedChannel = evtJson.LinkedChannel;
                    if (holly.phone._phone_callObject.callId !== linkedChannel.Uniqueid) {
                        holly.phone._phone_callObject.callId = linkedChannel.Uniqueid;
                        var callsheetid = "";
                        if (linkedChannel.Data && linkedChannel.Data.CallSheetID)
                            callsheetid = linkedChannel.Data.CallSheetID;
                        holly.phone._phone_callObject = {
                            callSheetId: callsheetid,
                            originId: linkedChannel.Uniqueid,
                            originCallNo: linkedChannel.FromDid,
                            originCalledNo: linkedChannel.FromCid,
                            callType: linkedChannel.ChannelType,
                            callId: linkedChannel.Uniqueid,
                            queue: linkedChannel.Queue,
                            location: linkedChannel.Location,
                            offeringTime: holly.phone._phone_dateParse(new Date(evtJson.Timestamp * 1000)),
                            callerProvince: decodeURIComponent(evtJson.CallerProvince),
                            callerProvinceCode: evtJson.CallerProvinceCode,
                            callerCity: decodeURIComponent(evtJson.CallerCity),
                            callerCityCode: evtJson.CallerCityCode,
                            data: {}
                        };
                        if (linkedChannel.Data) {
                            holly.phone._phone_callObject.data = linkedChannel.Data;
                            holly.phone._phone_callObject.data.callSheetId = callsheetid;
                        }
                        var queue = holly.phone.phone_queues[holly.phone._phone_callObject.queue];
                        if (queue) {
                            holly.phone._phone_callObject.queueName = queue.queueName;
                        }
//                        holly.phone.phone_publishEvent("EvtRing", [holly.phone._phone_callObject]);
                    }
                }
                break;
        }
    },
    _phone_getUserFromSip: function (sipNo) {
        var peer = holly.phone._phone_peersFromSip[sipNo];
        if (!peer) {
            if (!holly.phone.phone_peers)
                return null;
            for (var i in holly.phone.phone_peers) {
                if (holly.phone.phone_peers[i].sipNo === sipNo) {
                    holly.phone._phone_peersFromSip[sipNo] = holly.phone.phone_peers[i];
                    return holly.phone._phone_peersFromSip[sipNo];
                }
            }
            return null;
        } else {
            return peer;
        }
    },
    _phone_getUserFromExten: function (exten) {
        if (!holly.phone.phone_peers)
            return null;
        for (var i in holly.phone.phone_peers) {
            if (holly.phone.phone_peers[i].exten === exten) {
                return holly.phone.phone_peers[i];
            }
        }
        return null;
    },

    _phone_super: function (evtJson) {
        if (evtJson.Event === "UserStatus") {
            if (holly.phone.phone_data.userId === evtJson.UserID) {
                holly.phone.phone_data.busyType = evtJson.BusyType;
                if (holly.phone.phone_data.sipNo !== evtJson.SipNum) {
                    holly.phone.phone_data.sipNo = evtJson.SipNum;
                    if (evtJson.PeerStatus === "Unregistered") {
                        holly.phone._phone_currentState = holly.phone._phone_unregister;
                        holly.phone._phone_update(evtJson);
                        if (hollyglobal.multiLogin) {
                            holly.utils.kickSoftphonebar();
                        }
                    } else if (evtJson.PeerStatus === "Registered") {
                        holly.phone._phone_currentState = holly.phone._phone_peerstate;
                        holly.phone._phone_update(evtJson);
                        if (hollyglobal.multiLogin) {
                            holly.utils.pickSoftphonebar();
                        }
                    }
                }
            }
        } else if (evtJson.Event === "UserBusy") {
            if (holly.phone.phone_data.userId === evtJson.UserID)
                holly.phone.phone_data.busyType = evtJson.BusyType;
        } else if (evtJson.Event === "ChannelStatus") {
            if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                if (evtJson.ChannelStatus === "Unlink") {
                    holly.phone.phone_data._curChannel = evtJson.Channel;
                    holly.phone.phone_data._callId = "";
                }
            }
        } else if (evtJson.Event === "PeerStatus") {
            if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                if (holly.phone._phone_currentState == holly.phone._phone_peerstate)
                    return;
                if (holly.phone.phone_data.busyType == holly.phone._phone_systemBusy)
                    return;
//                var peer = holly.phone._phone_getUserFromSip(evtJson.Exten);
                var peer = holly.phone.phone_peers_sip[evtJson.Exten];
                if (peer)
                    holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_currentState], ""]);
            }
        } else if (evtJson.Event === "TransferSuccess"
            || evtJson.Event === "TransferFailed") {
            evtJson.Type = "Transfer";
            if (evtJson.Investigate) {
                evtJson.Type = "Investigate";
            }
            holly.phone.phone_publishEvent("transfering", [evtJson]);
        } else if (evtJson.Event === "IvrMenuEnd") {
            holly.phone.phone_publishEvent("ivrMenuTransfering", [evtJson]);
        } else if (evtJson.Event === "DialinAgentBusyMessage") {
            holly.phone.phone_publishEvent("EvtDialinAgentBusyMessage", [evtJson]);
        }
    },
    phone_dialout: function (phoneNum, interfaceData) {
        if (/^\d+$/.test(phoneNum)) {
            var call_type = "";
            if (phoneNum.length < 5 && phoneNum.length !== 4) {
                var peer = holly.phone._phone_getUserFromExten(phoneNum);
                if (!peer) {
                    phoneNum = "9" + phoneNum;
                    call_type = "dialout";
                } else {
                    call_type = "inner";
                }
            } else if (phoneNum.length === 4) {
                call_type = "inner";
            } else if (phoneNum.length === 5) {
                if (holly.utils.startWith(phoneNum, '1') || holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                    phoneNum = "9" + phoneNum;
                    call_type = "dialout";
                } else {
                    call_type = "inner";
                }
            } else {
                phoneNum = "9" + phoneNum;
                call_type = "dialout";
            }
            //interfaceData = {'tt': '131'};
//            var Variable = "directCallerIDNum%3d13488817474";
            hollyglobal.isPopPage = true;
            var phoneJson = {
                Command: "Action",
                Action: "Originate",
                ActionID: "Originate" + Math.random(),
                Channel: "SIP/" + holly.phone.phone_data.sipNo,
                Context: holly.phone.phone_data.accountId,
                Exten: phoneNum,
                Priority: '1',
                UserID: holly.phone.phone_data.userId,
                Timeout: 60000,
                Async: "true",
                CallType: call_type,
//                Variable:Variable,
                PBX: holly.phone.phone_data.pbx_in_ip,
                Account: holly.phone.phone_data.accountId,
                SessionID: holly.phone.phone_data.uniqueId
            };
            if(interfaceData)
                phoneJson.InterfaceData = interfaceData;
            debugger;
            var onload = function (response) {
                try {
                    debugger;
                    if (!response.Succeed) {
                        if (response.Expired) {
                            holly.phone._phone_relogin(false);
                        }
                    } else {
//                        if($('#DialEnable'))
//                            $('#DialEnable').removeAttr("disabled");
                    }
                } catch (e) {
                    if ($('#DialEnable'))
                        $('#DialEnable').removeAttr("disabled");
                }
            }
            var onerror = function () {
                if ($('#DialEnable'))
                    $('#DialEnable').removeAttr("disabled");
            };
            holly.phone._phone_sendAction(phoneJson, onload, onerror);
            return true;
        } else {
            alert("请输入正确的电话号码");
            if ($('#DialEnable'))
                $('#DialEnable').removeAttr("disabled");
            return false;
        }
    },
    phone_setBusy: function (isBusy, busyType) {
        if (holly.phone._phone_isSettingbusy)
            return;
        else
            holly.phone._phone_isSettingbusy = true;
        var phoneJson = {
            Command: "Action",
            Action: "Busy",
            ActionID: "Busy" + Math.random(),
            Exten: holly.phone.phone_data.userId,
            Busy: isBusy,
            BusyType: "" + busyType,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
            holly.phone._phone_isSettingbusy = false;
        }
        var onerror = function () {
            holly.phone._phone_isSettingbusy = false;
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    phone_hangup: function () {
        var phoneJson = {
            Command: "Action",
            Action: "Hangup",
            ActionID: "Hangup" + Math.random(),
            Channel: holly.phone.phone_data._curChannel,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function () {
        });
    },

    phone_hold: function () {
        var phoneJson = {
            Command: "Action",
            Action: "Hold",
            ActionID: "Hold" + Math.random(),
            Channel: holly.phone.phone_data._otherChannel,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.phone._phone_stateBeforeHold = holly.phone._phone_currentState;
                holly.phone.phone_publishEvent("barupdate", ["hold", "continueTime"]);
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function () {
        });
    },
    phone_unhold: function () {
        var phoneJson = {
            Command: "Action",
            Action: "Unhold",
            ActionID: "Unhold" + Math.random(),
            Channel: holly.phone.phone_data._otherChannel,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.phone.phone_publishEvent("barupdate", [holly.phone._phone_stateDescription[holly.phone._phone_stateBeforeHold], "continueTime"]);
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function () {
        });
    },
    phone_consult: function (phoneNum, mode) {
        if (mode === "number") {
            if (phoneNum.length <= 6) {
                var phoneNumBak = phoneNum;
                phoneNum = phoneNum.substr(1);
                if (phoneNum.length === 5) {
                    if (holly.utils.startWith(phoneNum, '1') || holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showConsult(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showConsult("工号 " + phoneNum + " ");
                    }
                } else if (phoneNum.length === 4) {
                    if (holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showConsult(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showConsult("工号 " + phoneNum + " ");
                    }
                }
            } else
                holly.softphonebar._softphonebar_showConsult(phoneNum + " ");
        } else if (mode === "skillgroup") {
            holly.softphonebar._softphonebar_showConsult(phoneNum + " ");
        }
        var phoneJson = {
            Command: "Action",
            Action: "Consult",
            ActionID: "Consult" + Math.random(),
            FromExten: holly.phone.phone_data.sipNo,
            Exten: phoneNum,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            holly.softphonebar.softphonebar_close();
            if (response.Succeed) {
                holly.utils.showTransferOrConsultSucc("咨询成功", "softphone_consult");
                holly.phone.phone_publishEvent("toolbarupdate", ["consultTalking", "continueTime"]);
            } else {
                holly.utils.showTransferOrConsultError("咨询失败", "softphone_consult");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
            holly.softphonebar.softphonebar_close();
            holly.utils.showTransferOrConsultError("咨询失败", "softphone_consult");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    phone_stopConsult: function () {
        var phoneJson = {
            Command: "Action",
            Action: "StopConsult",
            ActionID: "StopConsult" + Math.random(),
            FromExten: holly.phone.phone_data.sipNo,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                if (response.Message != undefined) {
                    if (response.Message === "Idle") {
                        holly.phone.phone_publishEvent("toolbarupdate", ["peerstate", "continueTime"]);
                    } else {
                        holly.phone.phone_publishEvent("toolbarupdate", ["talking", "continueTime"]);
                    }
                } else {
                    holly.phone.phone_publishEvent("toolbarupdate", ["talking", "continueTime"]);
                }
            } else {
                holly.utils.showTransferOrConsultError("结束咨询通话失败", "softphone_consult");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
            holly.utils.showTransferOrConsultError("结束咨询通话失败", "softphone_consult");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_toMenu: function (exten, displayName) {
        holly.softphonebar.softphonebar_closeModel();
        holly.softphonebar._softphonebar_showToMenu(displayName);
        var phoneJson = {
            Command: "Action",
            Action: "IvrMenu",
            ActionID: "IvrMenu" + Math.random(),
            Channel: holly.phone.phone_data._otherChannel,
            Context: exten,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId
        }
        var onload = function (response) {
            if (response.Succeed) {
                //holly.softphonebar.softphonebar_closeModel();
            } else {
                holly.softphonebar.softphonebar_close();
                holly.utils.showError("转IVR菜单失败", "softphone_transfer");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
            holly.softphonebar.softphonebar_close();
            holly.utils.showError("转IVR菜单失败", "softphone_transfer");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_transfer: function (phoneNum, mode) {
        if (mode == "number") {
            if (phoneNum.length <= 6) {
                var phoneNumBak = phoneNum;
                phoneNum = phoneNum.substr(1);
                if (phoneNum.length === 5) {
                    if (holly.utils.startWith(phoneNum, '1') || holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showTranster(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showTranster("工号 " + phoneNum + " ");
                    }
                } else if (phoneNum.length === 4) {
                    if (holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showTranster(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showTranster("工号 " + phoneNum + " ");
                    }
                }
            } else
                holly.softphonebar._softphonebar_showTranster(phoneNum + " ");
        } else if (mode == "skillgroup") {
            holly.softphonebar._softphonebar_showTranster(phoneNum + " ");
        }
        var phoneJson = {
            Command: "Action",
            Action: "Transfer",
            ActionID: "Transfer" + Math.random(),
            Exten: phoneNum,
            Channel: holly.phone.phone_data._otherChannel,
            ExtraChannel: holly.phone.phone_data._curChannel,
            UserID: holly.phone.phone_data.userId,
            Context: holly.phone.phone_data.accountId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.softphonebar.softphonebar_close();
                holly.utils.showTransferOrConsultSucc("转接成功", 'softphone_transfer');
            } else {
                holly.softphonebar.softphonebar_close();
                var message = "";
                if (response.Message == "310") {
                    message = "未配置外呼线路";
                } else if (response.Message == "311") {
                    message = "转接的用户忙";
                } else if (response.Message == "312") {
                    message = "转接的用户未签入";
                } else if (response.Message == "313") {
                    message = "转接的用户正在通话";
                } else if (response.Message == "314") {
                    message = "转接的用户没有以通话方式登录";
                } else if (response.Message == "315") {
                    message = "无法呼通转接的用户";
                } else if (response.Message == "316") {
                    message = "转接用户不存在";
                } else {
                    message = "";
                }
                if (message == "") {
                    holly.utils.showTransferOrConsultError("转接失败", 'softphone_transfer');
                } else {
                    holly.utils.showTransferOrConsultError("转接失败：" + message, 'softphone_transfer');
                }
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
            holly.softphonebar.softphonebar_close();
            holly.utils.showTransferOrConsultError("转接失败", 'softphone_transfer');
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    phone_cancelTransfer: function () {
        if (holly.phone.phone_data._otherChannel) {
            var phoneJson = {
                Command: "Action",
                Action: "CancelTransfer",
                ActionID: "CancelTransfer" + Math.random(),
                Channel: holly.phone.phone_data._otherChannel,
                PBX: holly.phone.phone_data.pbx_in_ip,
                Account: holly.phone.phone_data.accountId,
                SessionID: holly.phone.phone_data.uniqueId
            };
            var onload = function (response) {
                holly.softphonebar.softphonebar_close();
                if (response.Succeed) {
                    holly.utils.showTransferOrConsultSucc("取消转接成功", 'softphone_transfer');
                } else {
                    holly.utils.showTransferOrConsultError("取消转接失败", 'softphone_transfer');
                    if (response.Expired) {
                        holly.phone._phone_relogin();
                    }
                }
            }
            var error = function () {
                holly.softphonebar.softphonebar_close();
                holly.utils.showTransferOrConsultError("取消转接失败", "softphone_transfer");
            }
            holly.phone._phone_sendAction(phoneJson, onload, error);
        }
    },

    phone_threewaycall: function (phoneNum) {
        var phoneJson = {
            Command: "Action",
            Action: "ThreeWayCall",
            ActionID: "ThreeWayCall" + Math.random(),
            FromExten: holly.phone.phone_data.sipNo,
            Exten: phoneNum,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            holly.softphonebar.softphonebar_close();
            if (response.Succeed) {
                holly.utils.showTransferOrConsultSucc("三方通话成功", "softphone_consult");
                holly.phone.phone_publishEvent("toolbarupdate", ["threeWayTalking", ""]);
            } else {
                holly.utils.showTransferOrConsultError("三方通话失败", "softphone_consult");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
            holly.softphonebar.softphonebar_close();
            holly.utils.showTransferOrConsultError("咨询失败", "softphone_consult");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_kick: function (userId) {
        var phoneJson = {
            Command: "Action",
            Action: "Kick",
            ActionID: "Kick" + Math.random(),
            Exten: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                var peer = holly.phone.phone_peers[userId];
                if (peer) {
                    peer.C5Status = "";
                    peer.callNo = "";
                    peer.callStatus = "Idle";
                    var date = new Date();
                    var identity = date.valueOf();
                    peer.timestamp = identity / 1000;
                    peer.channel = "";
                    peer.linkedChannel = "";
                    holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                    holly.phone._phone_updateQueueInfo();
                }
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_toIVR: function () {
        if (holly.phone._phone_isToIVR)
            return;
        holly.phone._phone_isToIVR = true;
        var phoneJson = {
            Command: "Action",
            Action: "Validate",
            ActionID: "Validate" + Math.random(),
            Exten: 's',
            Channel: holly.phone.phone_data._otherChannel,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            Context: holly.phone.phone_data.accountId + "-validate",
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
            holly.phone._phone_isToIVR = false;
        }
        var error = function () {
            holly.phone._phone_isToIVR = false;
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_kickFromPbx: function (userId, pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "Kick",
            ActionID: "Kick" + Math.random(),
            Exten: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: pbx,
            Account: holly.phone.phone_data.accountId,
            SessionID: phone_pbx.sessionId
        };
        var onload = function (response) {
            if (response.Succeed) {
                var peer = holly.phone.phone_peers[userId];
                if (peer) {
                    peer.C5Status = "";
                    peer.callNo = "";
                    peer.callStatus = "Idle";
                    var date = new Date();
                    var identity = date.valueOf();
                    peer.timestamp = identity / 1000;
                    peer.channel = "";
                    peer.linkedChannel = "";
                    holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                    holly.phone._phone_updateQueueInfo();
                }
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
        }
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    phone_pick: function (userId) {
        var peer = holly.phone.phone_peers[userId];
        if (peer == null || peer.localNo == null || peer.localNo == "") {
            holly.utils.showError("当前在线座席总数已达最大值，无法再签入", "softphone_transfer");
            return;
        }
        var phoneJson = {
            Command: "Action",
            Action: "SignIn",
            ActionID: "SignIn" + Math.random(),
            User: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.utils.showSucc("座席签入成功", "softphone_transfer");
            } else {
                holly.utils.showError("当前在线座席总数已达最大值，无法再签入", "softphone_transfer");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_hangupChannel: function (channel) {
        var phoneJson = {
            Command: "Action",
            Action: "Hangup",
            ActionID: "ForceHangup" + Math.random(),
            Channel: channel,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
        }
        var error = function () {
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    phone_hangupChannelFromPbx: function (channel, pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "Hangup",
            ActionID: "ForceHangup" + Math.random(),
            Channel: channel,
            UserID: holly.phone.phone_data.userId,
            PBX: pbx,
            Account: holly.phone.phone_data.accountId,
            SessionID: phone_pbx.sessionId
        };
        var onload = function (response) {
        }
        var error = function () {
        }
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },

    phone_loot: function (channel) {
        if (holly.phone.phone_data.busyType == "0") {
            holly.utils.showError("请先将电话置为忙碌", "softphone_transfer");
            return;
        }
        var phoneJson = {
            Command: "Action",
            Action: "Transfer",
            ActionID: "Transfer" + Math.random(),
            Exten: holly.phone.phone_data.sipNo,
            Channel: channel,
            CallType: "Loot",
            Context: holly.phone.phone_data.accountId,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_pickFromPbx: function (userId, pbx) {
        var peer = holly.phone.phone_peers[userId];
        if (peer == null || peer.localNo == null || peer.localNo == "") {
            holly.utils.showError("不能对没有直线号码的座席做签入操作", "softphone_transfer");
            return;
        }
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "SignIn",
            ActionID: "SignIn" + Math.random(),
            User: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: pbx,
            Account: holly.phone.phone_data.accountId,
            SessionID: phone_pbx.sessionId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.utils.showSucc("座席签入成功", "softphone_transfer");
            } else {
                holly.utils.showError("当前在线座席总数已达最大值，无法再签入", "softphone_transfer");
                if (response.Expired) {
                    holly.phone._phone_relogin(true);
                }
            }
        }
        var error = function () {
        }
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {json: json},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    phone_investigate: function () {
        if (holly.phone._phone_isInvestigatting)
            return;
        holly.phone._phone_isInvestigatting = true;
        var phoneJson = {
            Command: "Action",
            Action: "Transfer",
            ActionID: "Transfer" + Math.random(),
            Exten: 's',
            Channel: holly.phone.phone_data._otherChannel,
            Timeout: 60000,
            CallType: 'investigate',
            UserID: holly.phone.phone_data.userId,
            Context: holly.phone.phone_data.accountId + "-investigate",
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {

            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
            holly.phone._phone_isInvestigatting = false;
        }
        var error = function () {
            holly.phone._phone_isInvestigatting = false;
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    _phone_exit: function (removeQueue) {
        if (!removeQueue)
            removeQueue = false;
        if (!holly.phone.phone_data.uniqueId) {
            phone_data = {};
            holly.session.logined = false;
            window.location = './softphoneBar.html';
            return;
        }
        var actionName = "Logoff";
        if (hollyglobal.multiLogin) {
            actionName = "MultipleLogoff";
        }
        var phoneJson = {
            Command: "Action",
            Action: "Logoff",
            ActionID: "Logoff" + Math.random(),
            QueueRemove: removeQueue,
            User: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.utils.kickSoftphonebar();
                holly.session.logined = false;
                holly.phone._phone_isKick = false;
                holly.softphonebar._softphonebar_barupdate('', 'unregister', '');
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function () {
        });
    },
    _phone_dateParse: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + (month > 9 ? month : "0" + month) + "-" + (day > 9 ? day : "0" + day) + " "
            + (hour > 9 ? hour : "0" + hour) + ":" + (minute > 9 ? minute : "0" + minute) + ":" + (second > 9 ? second : "0" + second);
    },

    phone_isAllowDialout: function () {
        return holly.phone._phone_stateDescription[holly.phone._phone_currentState] == "peerstate";
    },
    phone_closeTransfer: function () {
        var bgObj = document.getElementById("hollyc5.bgDiv");
        var msgObj = document.getElementById("hollyc5.msgDiv");
        if (msgObj != null) {
            document.getElementById("TransferEnable1").removeChild(msgObj);
        }
        if (bgObj != null) {
            document.getElementById("TransferEnable1").removeChild(bgObj);
        }
    },
    phone_openTransferOrConsult: function (objectId) {
        $("#softphone-bar-bgdiv").css({display: "block", height: $(document).height()});
        var inputElement = "<input type=\"text\" id=\"" + objectId + "_div_input\" style=\"width:160px;height:20px;color:#938c8c;float:left;padding-right: 10px;\" " +
            "value=\"请输入工号或者手机号\" onfocus=\"if(this.value=='请输入工号或者手机号'){this.value='';this.style.color='#000'}\" " +
            "onblur=\"if(this.value==''){this.value='请输入工号或者手机号';this.style.color='#938c8c'}\" autocomplete='off'/>";
        var bodyHtml = "<div class='modal-body' style='height:30px;padding:9px 0 0 2px;' >" + inputElement;
        if (objectId === 'softphone_transfer') {
            bodyHtml += "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.softphonebar.softphonebar_transfer($('#" + objectId + "_div_input').val())\">转 接</button>";
//            bodyHtml +="<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"holly.softphonebar._softphonebar_showTranster('913488817474')\">转 接</button>";
//            bodyHtml +="<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"holly.utils.showTransferOrConsultError('913488817474','softphone_transfer')\">转 接</button>";
        } else
            bodyHtml += "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.softphonebar.softphonebar_consult($('#" + objectId + "_div_input').val())\">咨 询</button>";
//            bodyHtml +="<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"holly.softphonebar._softphonebar_showConsult('913488817474')\">咨 询</button>";
        bodyHtml += "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.phone.phone_closeDiv();\">关 闭</button></div>";
        $('#' + objectId).empty();
        $('#' + objectId).html(bodyHtml);
        document.documentElement.scrollTop = 0;
        $('#' + objectId).fadeIn('fast');
    },
    phone_listen: function (curChannel) {
        var phoneJson = {
            Command: "Action",
            Action: "Originate",
            ActionID: "Originate" + Math.random(),
            Channel: "SIP/" + holly.phone.phone_data.sipNo,
            Application: "ChanSpy",
            Data: curChannel + "|bq",
            Callerid: holly.phone.phone_data.sipNo,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function (response) {
            if (response.Succeed) {
                holly.phone.phone_data._otherChannel = curChannel;
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function () {
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
        return true;
    },
    phone_closeDiv: function () {
        var pagedir = $('#softphone-bar-bgdiv');
        var transferObj = $('#softphone_transfer');
        var consultObj = $('#softphone_consult');
        if (transferObj != null) {
            transferObj.css('display', 'none');
        }
        if (consultObj != null) {
            consultObj.css('display', 'none');
        }
        if (pagedir != null) {
            pagedir.css('display', 'none');
        }
    },
    phone_unregisterEvent: function (eventName) {
        $("#icc_event").unbind(eventName);
    },
    _phone_queryQueueItem: function (evtJson) {
        return holly.phone.phone_queues[evtJson.Queue];
    },
    _phone_monitorQueue: function (evtJson) {
        if (evtJson.Event === "QueueParams") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            var member;
            if (queueItem) {
                if (evtJson.Removed) {
                    queueItem.removed = true;
                }
                queueItem.queueName = evtJson.DisplayName;
                queueItem.idleAgentCount = evtJson.Members - evtJson.BusyMembers;
                queueItem.busyAgentCount = evtJson.BusyMembers;
                queueItem.totalAgentCount = evtJson.Members;
                queueItem.queueWaitCount = evtJson.Calls;
                queueItem.abadonedCalls = evtJson.Abandoned;
                queueItem.totalCalls = evtJson.TotalCalls;
                queueItem.DisplayName = evtJson.DisplayName;
                queueItem.members = [];
                for (var i in evtJson.QueueMember) {
                    member = evtJson.QueueMember[i];
                    queueItem.members[member] = member;
                }
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            } else {
                queueItem = {
                    queueName: evtJson.DisplayName,
                    queueId: evtJson.Queue,
                    idleAgentCount: evtJson.Members - evtJson.BusyMembers,
                    busyAgentCount: evtJson.BusyMembers,
                    totalAgentCount: evtJson.Members,
                    queueWaitCount: evtJson.Calls,
                    abadonedCalls: evtJson.Abandoned,
                    DisplayName: evtJson.DisplayName,
                    totalCalls: evtJson.TotalCalls,
                    members: [],
                    removed: false,
                    pbx: evtJson.PBX
                };
                for (var i in evtJson.QueueMember) {
                    member = evtJson.QueueMember[i];
                    queueItem.members[member] = member;
                }
                holly.phone.phone_queues[evtJson.Queue] = queueItem;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            }
        } else if (evtJson.Event === "QueueMemberAdded") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                if (!queueItem.members[evtJson.Exten]) {
                    queueItem.members[evtJson.Exten] = evtJson.Exten;  //change
                    queueItem.totalAgentCount++;
                    holly.phone._phone_updateQueueInfo();
                }
            }
        } else if (evtJson.Event === "QueueMemberRemoved") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                if (queueItem.members[evtJson.Exten]) {
                    delete queueItem.members[evtJson.Exten];
                    queueItem.totalAgentCount--;
                    holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "noNeedWaitCount"]);
                }
            }
        } else if (evtJson.Event === "Join") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                queueItem.queueWaitCount++;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            }
        } else if (evtJson.Event === "Leave") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                queueItem.totalCalls++;
                queueItem.queueWaitCount--;
                if (queueItem.queueWaitCount < 0)
                    queueItem.queueWaitCount = 0;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            }
        } else if (evtJson.Event === "QueueCallerAbandon") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                queueItem.abadonedCalls++;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "noNeedWaitCount"]);
            }
        }
    },
    dialoutInterface: function () {
        var url = "http://127.0.0.1:7788/app?Action=Dialout&ActionID=Dialout" + Math.random() + "&Account=N000000007121&FromExten=8000&PBX=2.3.1.100&Exten=13488817474";
        var ExternalData = {
            callNum: "131313"
        };
        var json = encodeURI(ExternalData);
        var onload = function (response) {
            console.log(response);
        };
        var onerror = function (error) {
            console.log(error);
        };
        holly.phone._phone_test_sendAction(json, onload, onerror, url);
    },
    _phone_test_sendAction: function (jsonData, onload, onerror, url) {
        jsonData = $.toJSON("{'callNum' = '131313'}");
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {ExternalData: jsonData},
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    }
}