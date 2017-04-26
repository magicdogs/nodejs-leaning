holly.softphonebar = {
    _softphonebar_state: new Array(),
    _softphonebar_desc: new Array(),
    _softphonebar_countTimer: 0,
    _softphonebar_calculagraph: "",
    _softphonebar_otherstateref: "",
    _softphonebar_curstateref: "",
    _softphonebar_timestateref: "",
    _softphonebar_callstateref: "",
    _softphonebar_dialogBoxRemain: 40000,
    _softphonebar_notifyDialogInterval: "",
    softphonebar_count: 0,
    _softphonebar_monitorTimers: [],
    _softphoneBar_replaceAll: new RegExp("\\.", "g"),
    _softphoneBar_replaceAll_bak: new RegExp("\\_", "g"),
    _softphonebar_peer_index: 0,
    _softphonebar_queue_index: 0,
    _softphonebar_serviceNo_index: 0,
    softphonebar_init: function () {
        holly.softphonebar._softphonebar_timestateref = $("#softphone_timer");
        holly.softphonebar._softphonebar_otherstateref = $("#softphone_otherstate");
        holly.softphonebar._softphonebar_curstateref = $("#softphone_curstate");
        holly.softphonebar._softphonebar_callstateref = $("#softphone_phonestate");

        holly.softphonebar._softphonebar_desc["unregister"] = "失效";
        holly.softphonebar._softphonebar_desc["peerstate"] = "空闲";
        holly.softphonebar._softphonebar_desc["dialing"] = "呼叫中";
        holly.softphonebar._softphonebar_desc["innerDialing"] = "呼叫中";
        holly.softphonebar._softphonebar_desc["belling"] = "来电振铃";
        holly.softphonebar._softphonebar_desc["innerBelling"] = "来电振铃";
        holly.softphonebar._softphonebar_desc["listening"] = "监听振铃";
        holly.softphonebar._softphonebar_desc["talking"] = "普通通话";
        holly.softphonebar._softphonebar_desc["threeWayTalking"] = "三方通话";
        holly.softphonebar._softphonebar_desc["innerTalking"] = "内部通话";
        holly.softphonebar._softphonebar_desc["dialTalking"] = "外呼通话";
        holly.softphonebar._softphonebar_desc["listened"] = "监听中";
        holly.softphonebar._softphonebar_desc["hold"] = "保持";
        holly.softphonebar._softphonebar_desc["consultTalking"] = "普通通话";
        holly.softphonebar._softphonebar_desc["dialTransfer"] = "转接通话";
        holly.softphonebar._softphonebar_desc["transfer"] = "转接通话";
        holly.softphonebar._softphonebar_desc["offline"] = "离线接听";
        holly.softphonebar._softphonebar_desc["ready"] = "签出";
        holly.softphonebar._softphonebar_desc["transferBelling"] = "转接振铃";
        holly.softphonebar._softphonebar_desc["transferDialing"] = "转接振铃";

        holly.softphonebar._softphonebar_state["unregister"] = [];
        holly.softphonebar._softphonebar_state["peerstate"] = ["dialout_input", "DialEnable"];
        holly.softphonebar._softphonebar_state["dialing"] = ["dialout_input", "HangupEnable"];
        holly.softphonebar._softphonebar_state["innerDialing"] = ["dialout_input", "HangupEnable"];
        holly.softphonebar._softphonebar_state["belling"] = ["dialout_input"];
        holly.softphonebar._softphonebar_state["innerBelling"] = ["dialout_input"];
        holly.softphonebar._softphonebar_state["transferBelling"] = [];
        holly.softphonebar._softphonebar_state["transferDialing"] = [];
        holly.softphonebar._softphonebar_state["listening"] = ["HangupEnable"];
        holly.softphonebar._softphonebar_state["talking"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["transfer"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["dialTransfer"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["threeWayTalking"] = ["HangupEnable"];
        holly.softphonebar._softphonebar_state["innerTalking"] = ["HangupEnable"];
        holly.softphonebar._softphonebar_state["dialTalking"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["listened"] = ["TransferDisable", "HangupEnable"];
        holly.softphonebar._softphonebar_state["hold"] = ["HoldGetEnable"];
        holly.softphonebar._softphonebar_state["consultTalking"] = ["ConsultThreeWayCallEnable", "ConsultTransferEnable", "StopConsultEnable", "HangupEnable"];

        holly.phone.phone_registerEvent("toolbarupdate", holly.softphonebar._softphonebar_toolbarupdate);
        holly.phone.phone_registerEvent("barupdate", holly.softphonebar._softphonebar_barupdate);
        holly.phone.phone_registerEvent("transfering", holly.softphonebar._softphonebar_transfering);
        holly.phone.phone_registerEvent("ivrMenuTransfering", holly.softphonebar._softphonebar_ivrMenuTransfering);
        holly.phone.phone_registerEvent("EvtMonitorServiceNo", holly.softphonebar._softphonebar_onServiceNoChanged);
        holly.phone.phone_registerEvent("EvtMonitorQueue", holly.softphonebar._softphonebar_onQueueChanged);
        holly.phone.phone_registerEvent("EvtMonitorPeer", holly.softphonebar._softphonebar_onPeerChanged);
        holly.phone.phone_registerEvent("EvtEndListen", holly.softphonebar._softphonebar_onEndListen);
        holly.phone.phone_registerEvent("EvtAccountCalls", holly.softphonebar._softphonebar_onAccountCalls);
        holly.phone.phone_registerEvent("EvtRing", holly.softphonebar._softphonebar_evtRing);
//        holly.phone.phone_registerEvent("EvtTalking", holly.softphonebar._softphonebar_evtTalking);
        holly.phone.phone_registerEvent("EvtHangup", holly.softphonebar._softphonebar_evtHangup);
        holly.phone.phone_registerEvent("EvtDialinAgentBusyMessage", holly.softphonebar._softphonebar_ontDialinAgentBusy);

        if (!hollyglobal.isDisplayInvestigate) {
            holly.softphonebar._softphonebar_removeButton("InvestigateEnable");
        }
        if (!hollyglobal.isDisplayConsult) {
            holly.softphonebar._softphonebar_removeButton("ConsultEnable");
        }
        if (!hollyglobal.isDisplayTransfer) {
            holly.softphonebar._softphonebar_removeButton("TransferEnable");
        }
    },
    _softphonebar_removeButton: function (buttonId) {
        var state = holly.softphonebar._softphonebar_state;
        for (var i in state) {
            var softPhoneState = state[i];
            if (Array.indexOf(softPhoneState, buttonId) > -1) {
                for (var index in softPhoneState) {
                    if (softPhoneState[index] === buttonId) {
                        softPhoneState.splice(index, 1);
                        break;
                    }
                }
            }
        }
    },
    _softphonebar_toolbarupdate: function (event, state, timestamp) {
        $("#phone_bar :input").each(function () {
            var id = $(this).attr("id");
            if (holly.softphonebar._softphonebar_state[state]) {
                if (Array.indexOf(holly.softphonebar._softphonebar_state[state], id) < 0) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css('display', 'inline-block');
                    $(this).removeAttr('disabled');
                }
            }
        });
        holly.softphonebar._softphonebar_switchState(state, timestamp);
    },

    _softphonebar_barupdate: function (event, state, timestamp) {
        $("#phone_bar :input").each(function () {
            var id = $(this).attr("id");
            if (holly.softphonebar._softphonebar_state[state]) {
                if (Array.indexOf(holly.softphonebar._softphonebar_state[state], id) < 0) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css('display', 'inline-block');
                    $(this).removeAttr('disabled');
                }
            }
        });
        if (state === "unregister") {
            holly.softphonebar._softphonebar_timestateref.css('display', 'none');
        } else {
            holly.softphonebar._softphonebar_timestateref.css('display', 'inline-block');
        }
        holly.softphonebar._softphonebar_callstateref.css("color", "#B30000");
        if (state === "peerstate") {
            if (holly.phone.phone_data.busyType == "99") {
                holly.softphonebar._softphonebar_systemBusy();
            } else if (holly.phone.phone_data.busyType == "0") {
                holly.softphonebar._softphonebar_callstateref.css("color", "#468847");
            }
            holly.softphonebar._softphonebar_updPeerState();
            $("#softphone-bar .state_dropdown").css('display', 'inline-block');
            $("#softphone-bar .state_line").css('display', 'inline-block');
        } else {
            holly.softphonebar._softphonebar_updCallState(state);
            $("#softphone-bar .state_dropdown").css('display', 'none');
            $("#softphone-bar .state_line").css('display', 'none');
        }
    },

    _softphonebar_switchState: function (state, timestamp) {
        if (state === "unregister") {
            holly.softphonebar._softphonebar_timestateref.css('display', 'none');
        } else {
            holly.softphonebar._softphonebar_timestateref.css('display', 'inline-block');
        }
        holly.softphonebar._softphonebar_callstateref.css("color", "#B30000");
        if (state === "peerstate") {
            if (holly.phone.phone_data.busyType == "99") {
                holly.softphonebar._softphonebar_systemBusy();
            } else if (holly.phone.phone_data.busyType == "0") {
                holly.softphonebar._softphonebar_callstateref.css("color", "#468847");
            }
            holly.softphonebar._softphonebar_updPeerState();
            $("#softphone-bar .state_dropdown").css('visibility', 'visible');
            $("#softphone-bar .state_dropdown").css('display', 'inline-block');
        } else {
            holly.softphonebar._softphonebar_updCallState(state);
            $("#softphone-bar .state_dropdown").css('visibility', 'hidden');
            $("#softphone-bar .state_dropdown").css('display', 'none');
        }
        if ((state === "peerstate" && holly.phone.phone_data.busyType == "99") || timestamp === "continueTime")
            return;
        if (timestamp != "") {
            var date = new Date();
            var identity = date.valueOf();
            var oldTime = ((identity - holly.phone.phone_data.currentServerTime) - parseFloat(timestamp) * 1000) / 1000;
            if (oldTime < 0)
                holly.softphonebar._softphonebar_countTimer = 0;
            else
                holly.softphonebar._softphonebar_countTimer = oldTime;
        } else {
            holly.softphonebar._softphonebar_countTimer = 0;
        }
        if (holly.softphonebar._softphonebar_calculagraph != null)
            window.clearInterval(holly.softphonebar._softphonebar_calculagraph);
        holly.softphonebar._softphonebar_calculagraph = window.setInterval(function () {
            holly.softphonebar._softphonebar_doCallTimer();
        }, 1000);
    },
    _softphonebar_doCallTimer: function () {
        holly.softphonebar._softphonebar_timestateref.html(holly.softphonebar._softphonebar_getTimer(holly.softphonebar._softphonebar_countTimer));
        holly.softphonebar._softphonebar_countTimer++;
    },
    _softphonebar_getTimer: function (countTimer) {
        countTimer = parseInt(countTimer) + 1;
        var hour = parseInt(countTimer / 3600);
        var minute = parseInt((countTimer % 3600) / 60);
        var second = (countTimer % 3600) % 60;

        var mtime = (hour < 10) ? "0" + hour : "" + hour;
        mtime += ":";
        mtime += (minute < 10) ? "0" + minute : "" + minute;
        mtime += ":";
        mtime += (second < 10) ? "0" + second : "" + second;
        return mtime;
    },
    _softphonebar_setStatePadding: function (stateDes) {
        $("#softphone_phonestate").css('padding-left', 16 / (stateDes.length));
    },
    _softphonebar_updPeerState: function () {
        var stateDes = holly.phone.phone_data.phonebarConfig[holly.phone.phone_data.busyType];
        holly.softphonebar._softphonebar_callstateref.html(stateDes);
        holly.softphonebar._softphonebar_setStatePadding(stateDes);
        var html = "";
        holly.softphonebar._softphonebar_otherstateref.find("li").remove();
        for (var i in holly.phone.phone_data.phonebarConfig) {
            if (i != "99" && i != holly.phone.phone_data.busyType) {
                var isBusy = true;
                var color = "#B30000";
                if (i == "0") {
                    isBusy = false;
                    color = "#468847";
                }
                html += "<div class='customer_div' style=\"color:" + color + ";font-weight:bold;\" onclick=\"holly.phone.phone_setBusy(" + isBusy + ", " + i + ")\">" + holly.phone.phone_data.phonebarConfig[i] + "</div><div class='customer_line'>|</div>";
            }
        }
        holly.softphonebar._softphonebar_otherstateref.html(html);
//        $('#softphone-bar .customer_db .customer_line').last().remove();
    },
    softphonebar_dialout: function (phoneNum, interfaceData) {
        if (holly.phone.phone_isAllowDialout()) {
            $('#DialEnable').attr("disabled", "true");
            holly.phone.phone_dialout(phoneNum, interfaceData);
        } else {
            holly.utils.showError("您已经在通话中,不能再次进行外呼", 'softphone_transfer');
            return true;
        }
        if (hollyglobal.isHiddenNumber) {
            phoneNum = holly.softphonebar.softphonebar_getHiddenNum(phoneNum);
        }
        $("#dialout_input").val(phoneNum);
    },

    softphonebar_getHiddenNum: function (phoneNum) {
        var mask = '';
        if (phoneNum > 5) {
            mask = '****';
        } else if (phoneNum < 4) {
            mask = '*';
        } else {
            mask = '***';
        }
        return phoneNum.substring(0, phoneNum.length - 6) + mask + phoneNum.substring(phoneNum.length - 2);
    },

    softphonebar_hangup: function () {
        holly.phone.phone_hangup();
    },

    _softphonebar_updCallState: function (state) {
        holly.softphonebar._softphonebar_callstateref.html(holly.softphonebar._softphonebar_desc[state]);
    },

    _softphonebar_systemBusy: function () {
        var autoBusyTime = holly.phone.phone_data.autoBusyTime;
        if (autoBusyTime < 1)
            return;
        holly.softphonebar._softphonebar_callstateref.html(holly.phone.phone_data.phonebarConfig["99"]);
        if (holly.softphonebar._softphonebar_calculagraph != null) {
            window.clearInterval(holly.softphonebar._softphonebar_calculagraph);
        }
        holly.softphonebar._softphonebar_calculagraph = window.setInterval(function () {
            autoBusyTime--;
            holly.softphonebar._softphonebar_autoBusyTime(autoBusyTime);
        }, 1000);
    },

    _softphonebar_autoBusyTime: function (autoBusyTime) {
        var minute = "0";
        var second = "0";
        var hour = "0";
        if (autoBusyTime >= 60 * 60) {
            hour = parseInt(autoBusyTime / (60 * 60));
            minute = parseInt((autoBusyTime - hour * (60 * 60)) / (60));
            second = autoBusyTime - hour * (60 * 60) - minute * (60);
        } else if (autoBusyTime >= 60 && (autoBusyTime < 60 * 60)) {
            hour = "0";
            minute = parseInt(autoBusyTime / 60);
            second = autoBusyTime - minute * 60;
        } else if (0 < autoBusyTime < 60) {
            hour = "0";
            minute = "0";
            second = autoBusyTime;
        } else if (autoBusyTime <= 0) {
            hour = "0";
            minute = "0";
            second = "0";
        }
        if (hour < 0) {
            hour = 0;
        }
        if (minute < 0) {
            minute = 0;
        }
        if (second < 0) {
            second = 0;
        }
        holly.softphonebar._softphonebar_timestateref.html(((hour < 10) ? ("0" + hour) : hour) + ":" + ((minute < 10) ? ("0" + minute) : minute) + ":" + ((second < 10) ? ("0" + second) : second));
    },


    _softphonebar_showConsult: function (destExten) {
        holly.softphonebar._softphonebar_dialogBoxRemain = 40000;
        holly.softphonebar.softphonebar_count = 1;
        var bodyMsg = "<div style='height:20px;overflow:hidden;text-align:center'><img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/loading.gif' style='float:left;' />" +
            "<div id='holly.softphonebar.showMsg.id' style='float:left;color:#666666;padding-left:5px;'></div></div>";
        var bodyHtml = "<div class='modal-body' style='height:20px;padding-top:9px;' ><div style='float: left;position: relative;width: 325px;'>" + bodyMsg + "</div>" +
            "</div>";
        $('#softphone_consult').empty();
        $('#softphone_consult').html(bodyHtml);
        holly.softphonebar._softphonebar_notifyDialogInterval = setInterval(function () {
            holly.softphonebar._softphonebar_checkLoadingHide(destExten, "");
        }, 1000);
    },
    _softphonebar_showTranster: function (destExten) {
        holly.softphonebar._softphonebar_dialogBoxRemain = 40000;
        holly.softphonebar.softphonebar_count = 1;
        var bodyMsg = "<div style='height:20px;overflow:hidden;text-align:center'><img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/loading.gif' style='float:left;' />" +
            "<div id='holly.softphonebar.showMsg.id' style='float:left;color:#666666;padding-left:5px;'></div></div>";
        var bodyHtml = "<div class='modal-body' style='height:20px;padding-top:9px;' >" + bodyMsg + "</div>";
        $('#softphone_transfer').empty();
        $('#softphone_transfer').html(bodyHtml);
        holly.softphonebar._softphonebar_notifyDialogInterval = setInterval(function () {
            var cancelHtml = "<a href=\"javascript:holly.phone.phone_cancelTransfer();\" style='margin-left:5px;cursor:pointer;font-weight:bold;color:red;text-decoration:underline;'>取消</a>";
            holly.softphonebar._softphonebar_checkLoadingHide(destExten, cancelHtml);
        }, 1000);
    },
    _softphonebar_checkLoadingHide: function (destExten, cancelHtml) {
        var count = holly.softphonebar.softphonebar_count++;
        var html = "正在等待<span style='color:#3fb23f;font-weight:bold'>" + destExten + "</span>接听，" + "请稍后<span style='font-weight:bold'>(00:" + (count < 10 ? ("0" + count) : count) + ")</span>" + cancelHtml;
        if (document.getElementById("holly.softphonebar.showMsg.id")) {
            document.getElementById("holly.softphonebar.showMsg.id").innerHTML = html;
        }
        if (holly.softphonebar._softphonebar_dialogBoxRemain <= 0) {
            holly.softphonebar.softphonebar_close();
        }
        holly.softphonebar._softphonebar_dialogBoxRemain -= 1000;
    },


    _softphonebar_showToMenu: function (displayname) {
        holly.softphonebar._softphonebar_dialogBoxRemain = 40000;
        holly.softphonebar.softphonebar_count = 1;
        var bodyMsg = "<div style='height:20px;overflow:hidden;text-align:center'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/loading.gif' style='float:left;margin-top:5px;' />" +
            "<div id='holly.softphonebar.showMsg.id' style='float:left;color:#666666;padding-left:5px;'></div>" +
            "<div style='clear:both;height:1px;overflow:hidden'>&nbsp;</div></div>";
        holly.utils.showBox(310, 40, bodyMsg);
        holly.softphonebar._softphonebar_notifyDialogInterval = setInterval(function () {
            holly.softphonebar._softphonebar_checkMenuLoadingHide(displayname, "");
        }, 1000);
    },

    _softphonebar_checkMenuLoadingHide: function (destExten, cancelHtml) {
        var count = holly.softphonebar.softphonebar_count++;
        var html = "正在等待转<span style='color:#3fb23f;font-weight:bold'>" + destExten + "</span>，" + "请稍后<span style='font-weight:bold'>(00:" + (count < 10 ? ("0" + count) : count) + ")</span>" + cancelHtml;
        document.getElementById("holly.softphonebar.showMsg.id").innerHTML = html;
        if (holly.softphonebar._softphonebar_dialogBoxRemain <= 0) {
            holly.softphonebar.softphonebar_close();
        }
        holly.softphonebar._softphonebar_dialogBoxRemain -= 1000;
    },

    softphonebar_close: function () {
        if (holly.softphonebar._softphonebar_notifyDialogInterval)
            clearInterval(holly.softphonebar._softphonebar_notifyDialogInterval);
    },

    softphonebar_consult: function (phoneNum) {
        if (/^\d+$/.test(phoneNum)) {
            holly.phone.phone_consult("9" + phoneNum, "number");
        } else {
            alert('请输入工号或者手机号');
        }
    },
    softphonebar_closeModel: function () {
        if ($('#softphone_consult'))
            $('#softphone_consult').modal('hide');
        if ($('#softphone_transfer'))
            $('#softphone_transfer').modal('hide');
        if ($('#softphone_ivrMenu'))
            $('#softphone_ivrMenu').modal('hide');
    },

    softphonebar_transfer: function (phoneNum) {
        if (/^\d+$/.test(phoneNum)) {
            holly.phone.phone_transfer("9" + phoneNum, "number");
        } else {
            alert('请输入工号或者手机号');
        }
    },
    _softphonebar_transfering: function (event, json) {
        if (json.Event === "TransferSuccess") {
            holly.softphonebar.softphonebar_close();
            if (json.Type === "Investigate") {
                holly.utils.showSucc("转调查成功", "softphone_transfer");
            } else {
                if (json.Loot) {
                    holly.utils.showTransferOrConsultSucc("抢接成功", "softphone_transfer");
                } else {
                    holly.phone._phone_currentState = holly.phone._phone_peerstate;
                    holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_peerstate], ""]);
                    holly.utils.showTransferOrConsultSucc("转接成功", "softphone_transfer");
                }
            }
        } else if (json.Event === "TransferFailed") {
            holly.softphonebar.softphonebar_close();
            if (json.Type === "Investigate") {
                holly.utils.showTransferOrConsultError("转调查失败", "softphone_transfer");
            } else {
                if (json.Loot) {
                    holly.utils.showTransferOrConsultError("抢接失败", "softphone_transfer");
                } else {
                    holly.utils.showTransferOrConsultError("转接失败", "softphone_transfer");
                }
            }
        }
    },

    _softphonebar_ivrMenuTransfering: function (event, json) {
        if (json.Event === "IvrMenuEnd") {
            holly.softphonebar.softphonebar_close();
            if (json.VAL_OF_IVR_MENU) {
                var outIvrRefused = json.VAL_OF_IVR_MENU;
                if (outIvrRefused === "DTSF") {
                    outIvrRefused = "转第三方系统失败！";
                    holly.utils.showError(outIvrRefused, 'softphone_transfer');
                } else {
                }
            }
        }
    },
    _softphonebar_onServiceNoChanged: function (event, monitorServiceNo) {
        if (!holly.phone.phone_data.monitor || !monitorServiceNo || !monitorServiceNo.serviceNo)
            return;
        var curRow = $("#monitor_serviceNo_" + monitorServiceNo.serviceNo);
        if (curRow.html() == null) {
            holly.softphonebar._softphonebar_createRow(monitorServiceNo, 'serviceNo');
        } else {
            holly.softphonebar._softphonebar_updateRow(monitorServiceNo, curRow, 'serviceNo')
        }
        holly.softphonebar._softphonebar_monitoringOnServiceNoChanged(monitorServiceNo);
    },
    _softphonebar_onQueueChanged: function (event, monitorQueue, type) {
        if (!monitorQueue || !monitorQueue.queueId)
            return;
        var curRow = $("#monitor_queue_" + monitorQueue.queueId);
        if (curRow.html() == null) {
            holly.softphonebar._softphonebar_createRow(monitorQueue, 'queueId');
        } else {
            holly.softphonebar._softphonebar_updateRow(monitorQueue, curRow, 'queueId')
        }
//        if(type == "needWaitCount") {
//            if(holly.phone.phone_queues) {
//                var totalQueueWait = 0;
//                var pbx;
//                for(var j in holly.phone.phone_queues) {
//                    var item = holly.phone.phone_queues[j];
//                    totalQueueWait = totalQueueWait + item.queueWaitCount;
//                    pbx = item.pbx;
//                }
//                $("#monitor_waitCountTotal_" + pbx.replace(holly.softphonebar._softphoneBar_replaceAll, "_")).html(totalQueueWait);
//            }
//        }
        holly.softphonebar._softphonebar_queue(monitorQueue);
    },
    _softphonebar_onPeerChanged: function (event, monitorPeer) {
        if (!monitorPeer || !monitorPeer.userId)
            return;
        if (monitorPeer.user.indexOf("admin") != -1)
            return;
        if (!holly.phone.phone_data.monitor) {
            if (monitorPeer.userId != holly.session.user._id) {
                if (jQuery.inArray(monitorPeer.userId, holly.session.user.childs) == -1) {
                    return;
                }
            }
        }
        var curRow = $("#monitor_peer_" + monitorPeer.userId);
        if (curRow.html() == null) {
            holly.softphonebar._softphonebar_createRow(monitorPeer, 'userId');
        } else {
            holly.softphonebar._softphonebar_updateRow(monitorPeer, curRow, 'userId')
        }
//        holly.softphonebar._softphonebar_info(monitorPeer);
    },
    _softphonebar_isCalling: function (userId) {
        var peer = holly.phone.phone_peers[userId];
        if (peer) {
            if (peer.callStatus == 'Ring'
                || peer.callStatus == 'Ringing' || peer.callStatus == 'inner'
                || peer.callStatus == 'normal' || peer.callStatus == 'dialout' || peer.callStatus == 'dialTransfer'
                || peer.callStatus == 'transfer' || peer.callStatus == 'listen') {
                return true;
            }
        }
        return false;
    },
    _softphonebar_info: function (obj) {
//        var userId = obj.userId;
//        if(userId != holly.session.user._id)
//            return;
//        var status = obj.status;
//        var inComplete = obj.InComplete;
//        var inCalls = obj.InCalls;
//        var outComplete = obj.OutComplete;
        //var TransferComplete = obj.TransferComplete
//        var outCalls = obj.OutCalls;
//        var dialoutTimeLength = holly.softphonebar._softphonebar_getDialoutTime(obj.DialoutTimeLength);

    },
    _softphonebar_getDialoutTime: function (dialoutLength) {
        var time = Math.ceil(dialoutLength / 1000);
        return holly.softphonebar._softphonebar_getTimer(time - 1);
    },
    _softphonebar_onEndListen: function (event) {
        for (var id in holly.phone.phone_peers) {
            if (holly.softphonebar._softphonebar_isCalling(id)) {
                $("#" + id + "_listen_disable").css("display", "none");
                $("#" + id + "_listen").css("display", "");
                $("#" + id + "_loot_disable").css("display", "none");
                $("#" + id + "_loot").css("display", "");
            } else {
                $("#" + id + "_listen_disable").css("display", "");
                $("#" + id + "_listen").css("display", "none");
                $("#" + id + "_loot_disable").css("display", "");
                $("#" + id + "_loot").css("display", "none");
            }
            $("#" + id + "_endlisten").css("display", "none");
        }
    },
    _softphonebar_monitoringInit: function () {
        for (var i in holly.phone.phone_pbxs) {
            var pbxid = i.replace(holly.softphonebar._softphoneBar_replaceAll, "_");
            holly.softphonebar._softphonebar_initInCallChart(pbxid);
            holly.softphonebar._softphonebar_initOutCallChart(pbxid);
        }
        if (holly.phone.phone_accountCalls) {
            for (var i in holly.phone.phone_accountCalls) {
                var accountCall = holly.phone.phone_accountCalls[i];
                if (accountCall) {
                    var curPbxId = i.replace(holly.softphonebar._softphoneBar_replaceAll, "_");
                    holly.softphonebar._softphonebar_toDrawingTodayPandectChart(accountCall.inCalls, accountCall.inComplete, accountCall.outCalls, accountCall.outComplete, curPbxId);
                    holly.softphonebar._softphonebar_toDrawingInCallChart(accountCall.inCalls, accountCall.inCallsPerHour, accountCall.inCompletePerHour, curPbxId);
                    holly.softphonebar._softphonebar_toShowInCallChart(curPbxId);
                    holly.softphonebar._softphonebar_toDrawingOutCallChart(accountCall.outCalls, accountCall.outCallsPerHour, accountCall.outCompletePerHour, curPbxId);
                    holly.softphonebar._softphonebar_toShowOutCallChart(curPbxId);
                }
            }
        }
        if (holly.phone.phone_serviceNos) {
            for (var i in holly.phone.phone_serviceNos) {
                var monitorServiceNo = holly.phone.phone_serviceNos[i];
                holly.softphonebar._softphonebar_toDrawingServiceNumberChart(monitorServiceNo.serviceNo, monitorServiceNo.inCalls, monitorServiceNo.inLost, monitorServiceNo.inComplete, (monitorServiceNo.pbx).replace(_softphoneBar_replaceAll, "_"));
            }
        }
    },
    _softphonebar_initOutCallChart: function (curPbx) {
        var ic = $("#" + curPbx + "_TwentyFourHourOutChart");
        var icArea = $("#" + curPbx + "_TwentyFourHourOutCallChartArea");
        for (var i = 0; i < 25; i++) {
            if (i === 24) {
                var timerow = document.createElement("div");
                timerow.id = curPbx + "_outCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + "px";
                timerow.style.width = "50px";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.innerHTML = "时间/时";
                ic.append(timerow);
            } else {
                var sumrow = document.createElement("div");
                sumrow.id = curPbx + "_outCallsumrow_" + i;
                sumrow.setAttribute("class", "call");
                sumrow.setAttribute("call", 0);
                sumrow.setAttribute("showTip", true);
                sumrow.style.left = 26 * i + "px";
                sumrow.style.height = 0 + "px";
                sumrow.style.width = "10px";
                sumrow.style.border = "solid 0px #1280ef";
                sumrow.style.position = "absolute";
                sumrow.style.overflow = "hidden";
                sumrow.style.background = "none repeat scroll 0 0 #1280ef";
                sumrow.style.display = "block";
                sumrow.style.top = 200 + "px";
                sumrow.style.zIndex = "1";
                icArea.append(sumrow);

                var timerow = document.createElement("div");
                timerow.id = curPbx + "_outCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + 3 + "px";
                timerow.style.width = "10px";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.style.textAlign = "center";
                timerow.innerHTML = i;
                ic.append(timerow);

                var cptrow = document.createElement("div");
                cptrow.id = curPbx + "_outCallcptrow_" + i;
                cptrow.setAttribute("class", "outcallchartcptrow");
                cptrow.setAttribute("call", 0);
                cptrow.setAttribute("showTip", true);
                cptrow.style.width = "10px";
                cptrow.style.height = 0 + "px";
                cptrow.style.border = "solid 0px #f8c713";
                cptrow.style.position = "absolute";
                cptrow.style.overflow = "hidden";
                cptrow.style.background = "none repeat scroll 0 0 #f8c713";
                cptrow.style.left = 10 + 26 * i + "px";
                cptrow.style.display = "block";
                cptrow.style.top = 200 + "px";
                cptrow.style.zIndex = "1";
                icArea.append(cptrow);
            }
        }

        for (var i = 0; i < 6; i++) {
            if (i === 0) {
                var tity = document.createElement("div");
                tity.id = curPbx + "_outCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "50px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 5 + "px";
                tity.style.left = "-40px";
                tity.innerHTML = "数量/个";
                ic.append(tity);
            } else {
                var tity = document.createElement("div");
                tity.id = curPbx + "_outCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "35px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 21 + "px";
                tity.style.left = "-18px";
                tity.innerHTML = 6 - i;
                ic.append(tity);

                var liney = document.createElement("div");
                liney.id = curPbx + "_outCallliney_" + i;
                liney.setAttribute("class", "liney");
                liney.style.width = "620px";
                liney.style.position = "absolute";
                liney.style.borderTop = "1px dotted #B9B9B9";
                liney.style.height = "1px";
                liney.style.overflow = "hidden";
                liney.style.top = (36 * i) - 16 + "px";
                liney.style.left = "0px";
                icArea.append(liney);
            }
        }
    },
    _softphonebar_initInCallChart: function (curPbx) {
        var ic = $("#" + curPbx + "_TwentyFourHourInChart");
        var icArea = $("#" + curPbx + "_TwentyFourHourInCallChartArea");
        for (var i = 0; i < 25; i++) {
            if (i === 24) {
                var timerow = document.createElement("div");
                timerow.id = curPbx + "_inCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + "px";
                timerow.style.width = "50px";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.innerHTML = "时间/时";
                ic.append(timerow);
            } else {
                var sumrow = document.createElement("div");
                sumrow.id = curPbx + "_inCallsumrow_" + i;
                sumrow.setAttribute("class", "incallchartsumrow");
                sumrow.setAttribute("call", 0);
                sumrow.setAttribute("showTip", true);
                sumrow.style.left = (26 * i) + "px";
                sumrow.style.height = 0 + "px";
                sumrow.style.width = "10px";
                sumrow.style.border = "solid 0px #1280ef";
                sumrow.style.position = "absolute";
                sumrow.style.overflow = "hidden";
                sumrow.style.background = "none repeat scroll 0 0 #1280ef";
                sumrow.style.display = "block";
                sumrow.style.top = 200 + "px";
                sumrow.style.zIndex = "1";
                icArea.append(sumrow);

                var timerow = document.createElement("div");
                timerow.id = curPbx + "_inCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + 3 + "px";
                timerow.style.width = "10px";
                timerow.style.textAlign = "center";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.innerHTML = i;
                ic.append(timerow);

                var cptrow = document.createElement("div");
                cptrow.id = curPbx + "_inCallcptrow_" + i;
                cptrow.setAttribute("class", "incallchartcptrow");
                cptrow.setAttribute("call", 0);
                cptrow.setAttribute("showTip", true);
                cptrow.style.width = "10px";
                cptrow.style.height = 0 + "px";
                cptrow.style.border = "solid 0px #92be0f";
                cptrow.style.position = "absolute";
                cptrow.style.overflow = "hidden";
                cptrow.style.background = "none repeat scroll 0 0 #92be0f";
                cptrow.style.left = (26 * i) + 10 + "px";
                cptrow.style.display = "block";
                cptrow.style.top = 200 + "px";
                cptrow.style.zIndex = "1";
                icArea.append(cptrow);
            }
        }

        for (var i = 0; i < 6; i++) {
            if (i === 0) {
                var tity = document.createElement("div");
                tity.id = curPbx + "_inCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "50px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 5 + "px";
                tity.style.left = "-40px";
                tity.innerHTML = "数量/个";
                ic.append(tity);
            } else {
                var tity = document.createElement("div");
                tity.id = curPbx + "_inCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "35px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 21 + "px";
                tity.style.left = "-18px";
                tity.style.right = "30px";
                tity.innerHTML = 6 - i;
                ic.append(tity);

                var liney = document.createElement("div");
                liney.id = curPbx + "_inCallliney_" + i;
                liney.style.width = "620px";
                liney.style.position = "absolute";
                liney.style.borderTop = "1px dotted #B9B9B9";
                liney.style.height = "1px";
                liney.style.overflow = "hidden";
                liney.style.top = (36 * i) - 16 + "px";
                liney.style.left = "0px";
                icArea.append(liney);
            }
        }
    },
    _softphonebar_toDrawingTodayPandectChart: function (inCalls, inComplete, outCalls, outComplete, curPbx) {
        $("#" + curPbx + "_today_call_sum").html("今日呼叫总量：" + (inCalls + outCalls));
        $("#" + curPbx + "_today_call_in_sum").html("呼入总量：" + inCalls);
        $("#" + curPbx + "_today_call_out_sum").html("呼出总量：" + outCalls);
        if (inCalls == 0) {
            $("#" + curPbx + "_todayChartInCallBox").html('<div class="callNullStyle" >呼入数据为空</div>');
        } else {
            var sinCallCpt, sinCallLst, inCallCpt, inCallLst;
            var perInComplete = Math.round((inComplete / inCalls) * 100);
            if (perInComplete < 15) {
                sinCallCpt = 15;
                sinCallLst = 85;
            } else if (perInComplete > 85) {
                sinCallCpt = 85;
                sinCallLst = 15;
            } else {
                sinCallCpt = perInComplete;
                sinCallLst = 100 - perInComplete;
            }
            inCallCpt = perInComplete.toString();
            inCallLst = (100 - perInComplete).toString();
            $("#" + curPbx + "_todayChartInCallBox").html('<div id="' + curPbx + '_today_call_in_success" class="todayCallInSuccess" style="width:' + sinCallCpt + '%;" >'
                + inComplete + '(' + inCallCpt + '%)' + '</div><div id="' + curPbx + '_today_call_in_failure" style="width:'
                + sinCallLst + '%;" class="todayCallInFailure" >' + (inCalls - inComplete) + '(' + inCallLst + '%)' + '</div>');
        }
        if (outCalls == 0) {
            $("#" + curPbx + "_todayChartOutCallBox").html('<div class="callNullStyle" >呼出数据为空</div>');
        } else {
            var soutCallCpt, soutCallLst, outCallCpt, outCallLst;
            var perOutComplete = Math.round((outComplete / outCalls) * 100);
            if (perOutComplete < 15) {
                soutCallCpt = 15;
                soutCallLst = 85;
            } else if (perOutComplete > 85) {
                soutCallCpt = 85;
                soutCallLst = 15;
            } else {
                soutCallCpt = perOutComplete;
                soutCallLst = 100 - perOutComplete;
            }
            outCallCpt = perOutComplete.toString();
            outCallLst = (100 - perOutComplete).toString();
            $("#" + curPbx + "_todayChartOutCallBox").html('<div id="' + curPbx + '_today_call_out_success" class="todayCallOutSuccess" style="width:' + soutCallCpt + '%;" >' + outComplete + '(' + outCallCpt + '%)' + '</div><div id="' + curPbx + '_today_call_out_failure" style="width:' + soutCallLst + '%;" class="todayCallOutFailure">' + (outCalls - outComplete) + '(' + outCallLst + '%)' + '</div>');
        }
    },

    _softphonebar_onAccountCalls: function (event, accountCall) {
        var curPbxId = (accountCall.pbx).replace(holly.softphonebar._softphoneBar_replaceAll, "_");
        holly.softphonebar._softphonebar_toDrawingTodayPandectChart(accountCall.inCalls, accountCall.inComplete, accountCall.outCalls, accountCall.outComplete, curPbxId);
        if ($("#" + curPbxId + "_TwentyFourHourInChart").html() == null) {
            return;
        }
        holly.softphonebar._softphonebar_toDrawingInCallChart(accountCall.inCalls, accountCall.inCallsPerHour, accountCall.inCompletePerHour, curPbxId);
        holly.softphonebar._softphonebar_toShowInCallChart(curPbxId);
        if ($("#" + curPbxId + "_TwentyFourHourOutChart").html() == null) {
            return;
        }
        holly.softphonebar._softphonebar_toDrawingOutCallChart(accountCall.outCalls, accountCall.outCallsPerHour, accountCall.outCompletePerHour, curPbxId);
        holly.softphonebar._softphonebar_toShowOutCallChart(curPbxId);
    },

    _softphonebar_toDrawingServiceNumberChart: function (serviceNo, inCalls, inLost, inComplete, curPbx) {
        var sn = $("#" + curPbx + "_ServiceNumberChart");
        if (serviceNo != undefined) {
            var snChart = document.createElement("div");
            if (inCalls == 0) {
                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" style="text-align:center; border:dashed 1px #ccc; background-color:#f2f6fb;" > 呼入数量为空  </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            } else if (inCalls == inComplete) {
                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" > <div style="width:100%; "  class="snChartComplete">' + inComplete + " (100%)" + '</div> <div style="display:none; " class="snChartLost"></div> </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            } else if (inCalls == inLost) {
                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" > <div style=" display:none;"  class="snChartComplete"></div> <div style="width:100%; " class="snChartLost">' + inLost + " (100%)" + '</div> </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            } else {
                var sinCallCpt, sinCallLst, inCallCpt, inCallLst;
                var perInComplete = Math.round((inComplete / inCalls) * 100);
                if (perInComplete < 15) {
                    sinCallCpt = 15;
                    sinCallLst = 85;
                } else if (perInComplete > 85) {
                    sinCallCpt = 85;
                    sinCallLst = 15;
                } else {
                    sinCallCpt = perInComplete;
                    sinCallLst = 100 - perInComplete;
                }
                inCallCpt = perInComplete.toString();
                inCallLst = (100 - perInComplete).toString();

                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo
                    + '</div> <div class="snChartDiagram" > <div style="width:' + sinCallCpt
                    + '%; "  class="snChartComplete">' + inComplete + " (" + inCallCpt + "%)"
                    + '</div> <div style="width:' + sinCallLst + '%; " class="snChartLost">'
                    + inLost + " (" + inCallLst + "%)" + '</div> </div> <div class="snChartSum"> 总计：'
                    + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            }
        }
    },

    _softphonebar_monitoringOnServiceNoChanged: function (serviceNos) {
        var serviceNo = serviceNos.serviceNo;
        var inCalls = serviceNos.inCalls;
        var inComplete = serviceNos.inComplete;
        var inLost = serviceNos.inLost;
        var outCalls = serviceNos.outCalls;
        var outComplete = serviceNos.outComplete;

        var pbxId = (serviceNos.pbx).replace(holly.softphonebar._softphoneBar_replaceAll, "_");
        var updateBox = $("#" + pbxId + "_snChart" + serviceNo);
        if (updateBox.html() == null) {
            holly.softphonebar._softphonebar_toDrawingServiceNumberChart(serviceNo, inCalls, inLost, inComplete, pbxId);
            return;
        }
        if (inCalls == 0) {
            updateBox.css("background", "none repeat scroll 0 0 #ffffff");
            updateBox.html('<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" style="text-align:center; border:dashed 1px #ccc; background-color:#f2f6fb;" > 呼入数量为空  </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>');
        } else {
            var sinCallCpt, sinCallLst, inCallCpt, inCallLst;
            var perInComplete = Math.round((inComplete / inCalls) * 100);
            if (perInComplete < 15) {
                sinCallCpt = 15;
                sinCallLst = 85;
            } else if (perInComplete > 85) {
                sinCallCpt = 85;
                sinCallLst = 15;
            } else {
                sinCallCpt = perInComplete;
                sinCallLst = 100 - perInComplete;
            }
            inCallCpt = perInComplete.toString();
            inCallLst = (100 - perInComplete).toString();
            updateBox.html('<div class="snChartNumber">服务号：' + serviceNo
                + '</div> <div class="snChartDiagram" > <div style="width:' + sinCallCpt
                + '%; "  class="snChartComplete">' + inComplete + " (" + inCallCpt + "%)"
                + '</div> <div style="width:' + sinCallLst + '%; " class="snChartLost">'
                + inLost + " (" + inCallLst + "%)" + '</div> </div> <div class="snChartSum"> 总计：'
                + inCalls + '</div> <div class="clear"></div>');
        }
    },

    _softphonebar_toDrawingInCallChart: function (inCalls, inCallsPerHour, inCompletePerHour, curPbx) {
        if (inCalls != 0) {
            var inCallSumArray, inCallCptArray = [];
            inCallSumArray = inCallsPerHour.split(",");
            inCallCptArray = inCompletePerHour.split(",");
            var inCallMax = 0;
            for (var i = 0; i < 24; i++) {
                inCallMax = Math.max(inCallMax, inCallSumArray[i]);
            }
            var b = inCallMax % 5;
            var mainLength = inCallMax - b + 5;
            var offsetCall = mainLength / 5;
            var topOffsetPercent = 180 / mainLength;
            for (var i = 0; i < 24; i++) {
                var sumrow = document.getElementById(curPbx + "_inCallsumrow_" + i);
                sumrow.setAttribute("call", inCallSumArray[i]);
                sumrow.style.height = Math.round(topOffsetPercent * inCallSumArray[i]) + "px";
                sumrow.style.top = 200 - Math.round(topOffsetPercent * inCallSumArray[i]) + "px";

                var cptrow = document.getElementById(curPbx + "_inCallcptrow_" + i);
                cptrow.setAttribute("call", inCallCptArray[i]);
                cptrow.style.height = Math.round(topOffsetPercent * inCallCptArray[i]) + "px";
                cptrow.style.top = 200 - Math.round(topOffsetPercent * inCallCptArray[i]) + "px";
            }
            for (var i = 1; i < 6; i++) {
                var tity = document.getElementById(curPbx + "_inCalltity_" + i);
                var temp = offsetCall * ( 6 - i );
                tity.innerHTML = temp;
            }
        }
    },

    _softphonebar_toShowInCallChart: function (curPbx) {
        var incalls = $("#" + curPbx + "_TwentyFourHourInCallChartArea div");
        incalls.each(function (i, incall) {
            if (!incall.getAttribute("showTip"))
                return;

            incall.onmouseover = function () {
                var temp = this.id.split("_");
                var hour = temp[temp.length - 1];
                var type = temp[temp.length - 2];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);

                var times = this.getAttribute("call");
                var tipMessage = "";
                if (type == "inCallsumrow") {
                    tipMessage = "今日" + hour + "时呼入" + times;
                } else if (type == "inCallcptrow") {
                    tipMessage = "今日" + hour + "时已接" + times;
                }
                var liney = document.getElementById(pbx + "_inCallMouseTip");
                if (!liney) {
                    liney = document.createElement("div");
                    liney.id = pbx + "_inCallMouseTip";

                    liney.style.position = "absolute";
                    liney.style.border = "1px dotted #FFFF99";

                    liney.style.padding = "3px";

                    liney.style.overflow = "hidden";
                    liney.style.background = "none repeat scroll 0 0 #f8c713";
                    liney.style.textAlign = "center";
                    liney.style.zIndex = "2";
                    var area = $("#" + pbx + "_TwentyFourHourInChart");
                    area.append(liney);
                }
                liney.innerHTML = tipMessage;
                liney.style.top = $(this).position().top + "px";
                liney.style.left = $(this).position().left + 5 + "px";
                liney.style.visibility = "visible";

                var timeText = document.getElementById(pbx + "_inCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "none repeat scroll 0 0 #f8c713";
                }
            };
            incall.onmouseout = function () {
                var temp = this.id.split("_");
                var type = temp[temp.length - 2];
                var hour = temp[temp.length - 1];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);
                var liney = document.getElementById(pbx + "_inCallMouseTip");
                if (liney) {
                    liney.style.visibility = "hidden";
                }
                var timeText = document.getElementById(pbx + "_inCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "";
                }
            };
        });
    },

    _softphonebar_toDrawingOutCallChart: function (outCalls, outCallsPerHour, outCompletePerHour, curPbx) {
        if (outCalls != 0) {
            var outCallSumArray, outCallCptArray = [];
            outCallSumArray = outCallsPerHour.split(",");
            outCallCptArray = outCompletePerHour.split(",");
            var outCallMax = 0;
            for (var i = 0; i < 24; i++) {
                outCallMax = Math.max(outCallMax, outCallSumArray[i]);
            }
            var b = outCallMax % 5;
            var mainLength = outCallMax - b + 5;
            var offsetCall = mainLength / 5;
            var topOffsetPercent = 180 / mainLength;

            for (var i = 0; i < 24; i++) {
                var sumrow = document.getElementById(curPbx + "_outCallsumrow_" + i);
                sumrow.setAttribute("call", outCallSumArray[i]);
                sumrow.style.height = Math.round(topOffsetPercent * outCallSumArray[i]) + "px";
                sumrow.style.top = 200 - Math.round(topOffsetPercent * outCallSumArray[i]) + "px";

                var cptrow = document.getElementById(curPbx + "_outCallcptrow_" + i);
                cptrow.setAttribute("call", outCallCptArray[i]);
                cptrow.style.height = Math.round(topOffsetPercent * outCallCptArray[i]) + "px";
                cptrow.style.top = 200 - Math.round(topOffsetPercent * outCallCptArray[i]) + "px";
            }
            for (var i = 1; i < 6; i++) {
                var tity = document.getElementById(curPbx + "_outCalltity_" + i);
                var temp = offsetCall * ( 6 - i );
                tity.innerHTML = temp;
            }
        }
    },

    _softphonebar_toShowOutCallChart: function (curPbx) {
        var outcalls = $("#" + curPbx + "_TwentyFourHourOutCallChartArea div");
        outcalls.each(function (i, outcall) {
            if (!outcall.getAttribute("showTip"))
                return;
            outcall.onmouseover = function () {
                var temp = this.id.split("_");
                var hour = temp[temp.length - 1];
                var type = temp[temp.length - 2];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);

                var times = this.getAttribute("call");
                var tipMessage = "";

                if (type === "outCallsumrow") {
                    tipMessage = "今日" + hour + "时呼出" + times;

                } else if (type === "outCallcptrow") {
                    tipMessage = "今日" + hour + "时呼通" + times;
                }

                var liney = document.getElementById(pbx + "_outCallMouseTip");
                if (!liney) {
                    liney = document.createElement("div");
                    liney.id = curPbx + "_outCallMouseTip";
                    liney.style.position = "absolute";
                    liney.style.border = "1px dotted #FFFF99";
                    //liney.style.height = "18px";
                    liney.style.padding = "3px";
                    liney.style.overflow = "hidden";
                    liney.style.background = "none repeat scroll 0 0 #f8c713";
                    liney.style.textAlign = "center";
                    liney.style.zIndex = "2";
                    var area = $("#" + pbx + "_TwentyFourHourOutChart");
                    area.append(liney);
                }
                liney.innerHTML = tipMessage;
                liney.style.top = $(this).position().top - 18 + "px";
                liney.style.left = $(this).position().left + 5 + "px";
                liney.style.visibility = "visible";

                var timeText = document.getElementById(pbx + "_outCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "none repeat scroll 0 0 #f8c713";
                }
            };
            outcall.onmouseout = function () {
                var temp = this.id.split("_");
                var type = temp[temp.length - 2];
                var hour = temp[temp.length - 1];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);
                var liney = document.getElementById(pbx + "_outCallMouseTip");
                if (liney) {
                    liney.style.visibility = "hidden";
                }
                var timeText = document.getElementById(pbx + "_outCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "";
                }
            };
        });
    },
    softphonebar_getpbxid: function (pbx) {
        if (!pbx) {
            pbx = holly.session.user.sipConfigId;
        }
        return pbx.replace(holly.softphonebar._softphoneBar_replaceAll, "_");
    },
    _softphonebar_queue: function (queue) {
        if (queue.members[holly.phone.phone_data.sipNo] == undefined)
            return;
        var queueName = $("#icc_statistics_queue_" + queue.queueId);
        if (queueName.length > 0) {
            if ($("#icc_statistics_name_" + queue.queueId))
                $("#icc_statistics_name_" + queue.queueId).html(queue.queueName);
            if ($("#icc_statistics_idle_" + queue.queueId))
                $("#icc_statistics_idle_" + queue.queueId).html(queue.idleAgentCount);
            if ($("#icc_statistics_wait_" + queue.queueId))
                $("#icc_statistics_wait_" + queue.queueId).html(queue.queueWaitCount);
        } else {
            var htmls = [];
            htmls.push("<div>技能组名:<span id=\"icc_statistics_name_" + queue.queueId + "\">" + queue.queueName + "</span></div>");
            htmls.push("<div>空闲座席数:<span id=\"icc_statistics_idle_" + queue.queueId + "\">" + queue.idleAgentCount + "</span></div>");
            htmls.push("<div>排队数:<span id=\"icc_statistics_wait_" + queue.queueId + "\">" + queue.queueWaitCount + "</span></div>");
            htmls.push("<div class=\"clear5\"></div>")
            var elementDiv = document.createElement("div");
            elementDiv.id = "icc_statistics_queue_" + queue.queueId;
            elementDiv.innerHTML = htmls.join("");
            $("#user_queue").append(elementDiv);
        }
    },
    monitor_agent: function () {
        var ul = "<ul class=\"nav nav-tabs\" id=\"monitor_ul\">";
        var curpbxid = holly.softphonebar.softphonebar_getpbxid(holly.phone.phone_data.pbx_in_ip);
        ul += "<li class=\"active\"><a href=\"#monitor_" + curpbxid + "\">" + holly.phone.phone_pbxs[holly.phone.phone_data.pbx_in_ip].pbxNick + "</a></li>";
        for (var pbx in holly.phone.phone_pbxs) {
            if (pbx != holly.phone.phone_data.pbx_in_ip) {
                var pbxid = holly.softphonebar.softphonebar_getpbxid(pbx);
                ul += "<li><a href=\"#monitor_" + pbxid + "\" >" + holly.phone.phone_pbxs[pbx].pbxNick + "</a></li>";
            }
        }
        ul += "</ul>";
        var content = "";
        content += "<div class=\"tab-content\">";
        for (var pbx in holly.phone.phone_pbxs) {
            var agentItem = $("#monitor_allpbx").html();
            var pbxid = holly.softphonebar.softphonebar_getpbxid(pbx);
            agentItem = agentItem.replace("monitor_serviceNo", "monitor_serviceNo" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_queue", "monitor_queue" + "_" + pbxid);
            agentItem = agentItem.replace(/monitor_peer/g, "monitor_peer" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_waitCountTotal", "monitor_waitCountTotal" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_countAll", "monitor_countAll" + "_" + pbxid);
            agentItem = agentItem.replace(/__pbxid/g, pbxid);
            agentItem = agentItem.replace("monitor_onlineCount", "monitor_onlineCount" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_idleCount", "monitor_idleCount" + "_" + pbxid);
            if (pbx == holly.phone.phone_data.pbx_in_ip) {
                content += "<div class=\"tab-pane active\" id=\"monitor_" + pbxid + "\">";
            } else {
                content += "<div class=\"tab-pane\" id=\"monitor_" + pbxid + "\">";
            }
            content += agentItem;
            content += "</div>";
        }
        content += "</div>";
        $("#monitor_allpbx").html(ul + content);
        $('#monitor_ul a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        })
        $('#monitor_ul a').on('shown', function (e) {
            var value = e.target + "";
            var pbxid = value.substr(value.indexOf("#monitor_") + 9, value.length);
            var pbx = holly.softphonebar._softphonebar_getpbx(pbxid);
            holly.phone.phone_pbxMonitor(pbx);
        })
        holly.softphonebar._softphonebar_monitorInit();
    },
    _softphonebar_getpbx: function (pbxid) {
        return pbxid.replace(holly.softphonebar._softphoneBar_replaceAll_bak, ".");
    },
    _softphonebar_monitorInit: function () {
        holly.softphonebar._softphonebar_peer_index = 0;
        holly.softphonebar._softphonebar_queue_index = 0;
        holly.softphonebar._softphonebar_serviceNo_index = 0;
        if (holly.phone.phone_data.monitor) {
            if (holly.phone.phone_serviceNos) {
                for (var i in holly.phone.phone_serviceNos) {
                    var item = holly.phone.phone_serviceNos[i];
                    if (!item || !item.serviceNo)
                        continue;
                    var curRow = $("#monitor_serviceNo_" + item.serviceNo);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'serviceNo');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'serviceNo')
                    }
                }
            }

            if (holly.phone.phone_queues) {
                for (var i in holly.phone.phone_queues) {
                    var item = holly.phone.phone_queues[i];
                    if (!item || !item.queueId)
                        continue;
                    var curRow = $("#monitor_queue_" + item.queueId);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'queueId');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'queueId')
                    }
                }
            }

            if (holly.phone.phone_peers) {
                for (var i in holly.phone.phone_peers) {
                    var item = holly.phone.phone_peers[i];
                    if (!item || !item.userId)
                        continue;
                    if (item.user.indexOf("admin") != -1)
                        continue;
                    var curRow = $("#monitor_peer_" + item.userId);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'userId');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'userId')
                    }
                }
            }
            holly.softphonebar._softphonebar_setInterval();
            $(".monitor_department").css("display", "block");
            holly.softphonebar._softphonebar_initDept();
        } else {
            if (holly.phone.phone_peers) {
                for (var i in holly.phone.phone_peers) {
                    var item = holly.phone.phone_peers[i];
                    if (!item || !item.userId)
                        continue;
                    if (item.user.indexOf("admin") != -1)
                        continue;
                    if (item.userId != holly.session.user._id) {
                        if (jQuery.inArray(item.userId, holly.session.user.childs) == -1) {
                            continue;
                        }
                    }
                    var curRow = $("#monitor_peer_" + item.userId);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'userId');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'userId')
                    }
                }
            }
            holly.softphonebar._softphonebar_setInterval();
            $(".monitor_department").css("display", "none");
            $(".monitor_list_serviceNo").css("display", "none");
            $(".monitor_list_queue").css("display", "none");
        }
        holly.softphonebar._softphonebar_updatePeerNum(holly.phone.phone_data.pbx_in_ip);
    },
    _softphonebar_setInterval: function () {
        if (holly.softphonebar._softphonebar_monitorTimersHandle) {
            window.clearInterval(holly.softphonebar._softphonebar_monitorTimersHandle);
        }
        holly.softphonebar._softphonebar_monitorTimersHandle = window.setInterval("holly.softphonebar._softphonebar_monitorDoCallTimer()", 1000);
    },
    _softphonebar_initDept: function () {
        for (var i in holly.phone.phone_pbxs) {
            var obj = document.getElementById('monitor_department_options' + '_' + holly.softphonebar.softphonebar_getpbxid(i));
            if (obj) {
                obj.options.length = 0;
                obj.options.add(new Option("全部", ""));
                for (var i = 0; i < holly.phone.phone_data.depts.length; i++) {
                    obj.options.add(new Option(holly.phone.phone_data.depts[i].Name, holly.phone.phone_data.depts[i].ID));
                }
            }
        }
    },
    _softphonebar_monitorDoCallTimer: function () {
        if (holly.softphonebar._softphonebar_monitorTimers) {
            for (var i in holly.softphonebar._softphonebar_monitorTimers) {
                var timerTd = $("#" + i + "_timer");
                if (timerTd != null) {
                    timerTd.text(holly.softphonebar._softphonebar_getTimer(holly.softphonebar._softphonebar_monitorTimers[i].count));
                    holly.softphonebar._softphonebar_monitorTimers[i].count++;
                }
            }
        }
    },
    _softphonebar_deptChange: function (pbxId) {
        var obj = document.getElementById('monitor_department_options_' + pbxId);
        if (obj) {
            var index = obj.selectedIndex;
            var deptId = obj[index].value;

            var trs = $("table[id=monitor_peer_" + pbxId + "] > tbody").children("tr");
            for (var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                if (deptId == "") {
                    $(tr).css("display", "");
                } else {
                    var userid = trs[i].id.replace("monitor_peer_", "");
                    var peer = holly.phone.phone_peers[userid];
                    if (peer && peer.department && peer.department == deptId) {
                        $(tr).css("display", "");
                    } else {
                        $(tr).css("display", "none");
                    }
                }
            }
            holly.softphonebar._softphonebar_updatePeerNum(holly.softphonebar._softphonebar_getpbx(pbxId));
        }
    },
    _softphonebar_displayStatus: function (peer) {
        var displayName = '';
        if (peer.login && peer.extenType != 'none') {
            if ((peer.extenType === 'sip' || peer.extenType === 'gateway') && peer.register == false) {
                displayName = holly.softphonebar._softphonebar_desc["unregister"];
            } else if (peer.callStatus === 'Idle') {
                if (peer.busyType === "0")
                    displayName = holly.softphonebar._softphonebar_getColor(holly.phone.phone_data.phonebarConfig[peer.busyType], "0");
                else
                    displayName = holly.softphonebar._softphonebar_getColor(holly.phone.phone_data.phonebarConfig[peer.busyType], "1");
            } else if (peer.callStatus === 'Ring') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialing"], "2");
            } else if (peer.callStatus === 'Ringing') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["belling"], "2");
            } else if (peer.callStatus === 'inner') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["innerTalking"], "2");
            } else if (peer.callStatus === 'normal') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["talking"], "2");
            } else if (peer.callStatus === 'dialout') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTalking"], "2");
            } else if (peer.callStatus === 'dialTransfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTransfer"], "2");
            } else if (peer.callStatus === 'transfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["transfer"], "2");
            } else if (peer.callStatus === 'listen') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["listened"], "2");
            }
        } else if (peer.login && peer.extenType == 'none') {
            displayName = '';
        } else {
            if (peer.callStatus === 'Ring') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialing"], "2");
            } else if (peer.callStatus === 'Ringing') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["belling"], "2");
            } else if (peer.callStatus === 'inner') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["innerTalking"], "2");
            } else if (peer.callStatus === 'normal') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["talking"], "2");
            } else if (peer.callStatus === 'dialout') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTalking"], "2");
            } else if (peer.callStatus === 'dialTransfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTransfer"], "2");
            } else if (peer.callStatus === 'transfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["transfer"], "2");
            } else if (peer.callStatus == '=listen') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["listened"], "2");
            } else {
                if (!peer.login && (peer.extenType === 'gateway' || peer.extenType === 'Local')) {
                    displayName = holly.softphonebar._softphonebar_desc["offline"];
                } else {
                    displayName = holly.softphonebar._softphonebar_desc["ready"];
                }
            }
        }
        return displayName;
    },
    _softphonebar_getColor: function (content, type) {
        if (type == "0") {
            return "<span style=\"color: green\">" + content + "</span>";
        } else if (type == "1") {
            return "<span style=\"color: red\">" + content + "</span>";
        } else if (type == "2") {
            return "<span style=\"color: #FF33FF\">" + content + "</span>";
        } else {
            return content;
        }
    },
    _softphonebar_updatePeerNum: function (pbx) {
        var idleNum = 0;
        var totalNum = 0;
        var onlineNum = 0;
        var deptOptions = document.getElementById('monitor_department_options_' + holly.softphonebar.softphonebar_getpbxid(pbx));
        var deptId = "";
        if (deptOptions && deptOptions.selectedIndex && deptOptions.selectedIndex != -1) {
            if (deptOptions[deptOptions.selectedIndex]) {
                deptId = deptOptions[deptOptions.selectedIndex].value;
            }
        }
        for (var i in holly.phone.phone_peers) {
            var item = holly.phone.phone_peers[i];
            if (item.pbx != pbx)
                continue;
            var peerState = holly.softphonebar._softphonebar_displayStatus(item);
            if (item.user != null) {
                if (item.user.indexOf('admin') != -1) {
                    continue;
                }
            }
            if (holly.phone.phone_data.monitor) {
                if (deptId == "" || item.department == deptId) {
                    totalNum++;
                    if (peerState != holly.softphonebar._softphonebar_desc["offline"]
                        && peerState != holly.softphonebar._softphonebar_desc["unregister"]
                        && peerState != holly.softphonebar._softphonebar_desc["ready"]) {
                        onlineNum++;
                        if (peerState.indexOf(holly.softphonebar._softphonebar_desc["peerstate"]) > 0) {
                            idleNum++;
                        }
                    }
                }
            } else {
                if (item.userId != holly.session.user._id) {
                    if (jQuery.inArray(item.userId, holly.session.user.childs) == -1) {
                        continue;
                    }
                }
                totalNum++;
                if (peerState != holly.softphonebar._softphonebar_desc["offline"]
                    && peerState != holly.softphonebar._softphonebar_desc["unregister"]
                    && peerState != holly.softphonebar._softphonebar_desc["ready"]) {
                    onlineNum++;
                    if (peerState.indexOf(holly.softphonebar._softphonebar_desc["peerstate"]) > 0) {
                        idleNum++;
                    }
                }
            }
        }
        $("#monitor_countAll_" + holly.softphonebar.softphonebar_getpbxid(pbx)).html(totalNum);
        $("#monitor_onlineCount_" + holly.softphonebar.softphonebar_getpbxid(pbx)).html(onlineNum);
        $("#monitor_idleCount_" + holly.softphonebar.softphonebar_getpbxid(pbx)).html(idleNum);
    },
    _softphonebar_createRow: function (item, key) {
        if (key === 'serviceNo') {
            var tdHtml = "";
            if ((holly.softphonebar._softphonebar_serviceNo_index++) % 2 == 0) {
                tdHtml = "<tr id=\"monitor_serviceNo_" + item.serviceNo + "\">";
            } else {
                tdHtml = "<tr id=\"monitor_serviceNo_" + item.serviceNo + "\" class=\"odd\">";
            }
            tdHtml += "<td>" + item.serviceNo + "</td><td>" + item.inCalls + "</td><td>" + item.inLost + "</td><td>" + item.inComplete + "</td><tr>";
            $('#monitor_serviceNo_' + holly.softphonebar.softphonebar_getpbxid(item.pbx) + ' > tbody:last').append(tdHtml);
        } else if (key == 'queueId') {
            var tdHtml = "";
            if ((holly.softphonebar._softphonebar_queue_index++) % 2 == 0) {
                tdHtml = "<tr id=\"monitor_queue_" + item.queueId + "\">";
            } else {
                tdHtml = "<tr id=\"monitor_queue_" + item.queueId + "\" class=\"odd\">";
            }
            var waitCountTd = "";
            if (item.queueWaitCount > 0) {
                waitCountTd = "<td style='color:red;'>" + item.queueWaitCount + "</td>";
            } else {
                waitCountTd = "<td>" + item.queueWaitCount + "</td>";
            }
            tdHtml += "<td class=\"ellipsis\" title=\"" + item.queueName + "\">" + item.queueName + "</td><td>" + item.idleAgentCount + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_getQueuePeer(item) + "\">" + item.totalAgentCount + holly.softphonebar._softphonebar_getQueuePeer(item) + "</td>" +
                waitCountTd + "<td>" + (item.totalCalls - item.abadonedCalls) + "</td><tr>";
            $('#monitor_queue_' + holly.softphonebar.softphonebar_getpbxid(item.pbx) + ' > tbody:last').append(tdHtml);
        } else if (key == 'userId') {
            var tdHtml = "";
            if ((holly.softphonebar._softphonebar_peer_index++) % 2 == 0) {
                tdHtml = "<tr id=\"monitor_peer_" + item.userId + "\">";
            } else {
                tdHtml = "<tr id=\"monitor_peer_" + item.userId + "\" class=\"odd\">";
            }
            tdHtml += "<td class=\"ellipsis\" title='" + item.DisplayName + "' style=\"height:20px;overflow: hidden\">" + item.DisplayName + "</td><td>" + item.exten + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_getInComCount(item) + "\">" + (item.InComplete + item.TransferComplete) + "(" + holly.softphonebar._softphonebar_getInComCount(item) + ")</td>" +
                "<td>" + item.OutComplete + "</td><td>" + item.callNo + "</td><td>" + holly.softphonebar._softphonebar_displayExtenType(item) + "</td>" +
                "<td>" + holly.softphonebar._softphonebar_displayStatus(item) + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "\">" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "</td><td id=\"" + item.userId + "_timer\"></td>" +
                "<td>" + holly.softphonebar._softphonebar_getDialoutTime(item.DialoutTimeLength) + "</td><td>" + holly.softphonebar._softphonebar_getStatus(item) + "</td>" +
                "<td><button id=\"" + item.userId + "_listen_disable\" class=\"btn btn-mini disabled\" >监听</button>" +
                "<button id=\"" + item.userId + "_listen\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_listen('" + item.channel + "', '" + item.userId + "')\">监听</button>" +
                "<button id=\"" + item.userId + "_endlisten\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_endListen()\">结束监听</button>" +
                "<button id=\"" + item.userId + "_forceHangup_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">强拆</button>" +
                "<button id=\"" + item.userId + "_forceHangup\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_forceHangup('" + item.channel + "', '" + item.pbx + "')\">强拆</button>" +
                "<button id=\"" + item.userId + "_loot_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">抢接</button>" +
                "<button id=\"" + item.userId + "_loot\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_loot('" + item.linkedChannel + "')\">抢接</button>" +
                "<button id=\"" + item.userId + "_kick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签出</button>" +
                "<button id=\"" + item.userId + "_kick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_kick('" + item.userId + "', '" + item.pbx + "')\">签出</button>" +
                "<button id=\"" + item.userId + "_pick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签入</button>" +
                "<button id=\"" + item.userId + "_pick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_pick('" + item.userId + "', '" + item.pbx + "')\">签入</button>" +
                "</td></tr>";
            var currentPbxId = holly.softphonebar.softphonebar_getpbxid(item.pbx);
            var currentTbody = $('#monitor_peer_' + currentPbxId + ' > tbody:last');
            currentTbody.append(tdHtml);

            if (item.login && item.timestamp) {
                var date = new Date();
                var identity = date.valueOf();
                var oldTime = ((identity - holly.phone.phone_data.currentServerTime) - parseFloat(item.timestamp) * 1000) / 1000;
                if (oldTime < 0) {
                    oldTime = 0;
                }
                var countTimer = {
                    count: oldTime
                };
                holly.softphonebar._softphonebar_monitorTimers[item.userId] = countTimer;
            }

            holly.softphonebar._softphonebar_controlMonitor(item);
            holly.softphonebar._softphonebar_updatePeerNum(item.pbx);
        }
    },
    _softphonebar_getStatus: function (peer) {
        if (!peer.login && !(peer.extenType == 'gateway' || peer.extenType == 'Local')) {
            return "";
        } else {
            return peer.status;
        }
    },
    _softphonebar_controlMonitor: function (peer) {
        if (peer.userId == holly.phone.phone_data.userId
            || (!peer.login && peer.extenType != 'Local' && peer.extenType != 'gateway')) {
            $("#" + peer.userId + "_kick_disable").css("display", "");
            $("#" + peer.userId + "_kick").css("display", "none");
        } else {
            $("#" + peer.userId + "_kick_disable").css("display", "none");
            $("#" + peer.userId + "_kick").css("display", "");
        }
        if (peer.userId == holly.phone.phone_data.userId
            || peer.login || (!peer.login && peer.extenType == "Local") || (!peer.login && peer.extenType == "gateway")) {
            $("#" + peer.userId + "_pick_disable").css("display", "");
            $("#" + peer.userId + "_pick").css("display", "none");
        } else {
            $("#" + peer.userId + "_pick_disable").css("display", "none");
            $("#" + peer.userId + "_pick").css("display", "");
        }
        if (peer.callStatus != "listen" && peer.callStatus != "Idle") {
            $("#" + peer.userId + "_forceHangup_disable").css("display", "none");
            $("#" + peer.userId + "_forceHangup").css("display", "");
        } else {
            $("#" + peer.userId + "_forceHangup_disable").css("display", "");
            $("#" + peer.userId + "_forceHangup").css("display", "none");
        }
        if (holly.phone.phone_data.extenType == "none"
            || peer.userId == holly.phone.phone_data.userId || holly.softphonebar._softphonebar_isCalling(holly.phone.phone_data.userId) || !holly.softphonebar._softphonebar_isCalling(peer.userId)) {
            $("#" + peer.userId + "_loot_disable").css("display", "");
            $("#" + peer.userId + "_loot").css("display", "none");
        } else {
            $("#" + peer.userId + "_loot_disable").css("display", "none");
            $("#" + peer.userId + "_loot").css("display", "");
        }
        if (holly.phone.phone_data.extenType != "none" && peer.userId != holly.phone.phone_data.userId
            && !holly.softphonebar._softphonebar_isCalling(holly.phone.phone_data.userId)
            && (peer.callStatus == "webcall" || peer.callStatus == "inner" || peer.callStatus == "normal" || peer.callStatus == "dialout" || peer.callStatus == "dialTransfer" || peer.callStatus == "transfer")) {
            $("#" + peer.userId + "_listen_disable").css("display", "none");
            $("#" + peer.userId + "_listen").css("display", "");
        } else {
            $("#" + peer.userId + "_listen_disable").css("display", "");
            $("#" + peer.userId + "_listen").css("display", "none");
        }
        if (peer.pbx != holly.phone.phone_data.pbx_in_ip) {
            $("#" + peer.userId + "_loot_disable").css("display", "none");
            $("#" + peer.userId + "_loot").css("display", "none");
            $("#" + peer.userId + "_listen_disable").css("display", "none");
            $("#" + peer.userId + "_listen").css("display", "none");
        }
    },
    _softphonebar_displayExtenType: function (peer) {
        var displayExtenType = "";
        if (peer.extenType === 'sip') {
            displayExtenType = "云通信客户端";
        } else if (peer.extenType === 'gateway') {
            displayExtenType = "SIP话机/网关";
        } else if (peer.extenType === 'Local') {
            displayExtenType = peer.localNo;
        } else if (peer.extenType === 'none') {
            displayExtenType = "无电话接入";
        }
        return displayExtenType;
    },

    _softphonebar_updateRow: function (item, curRow, key) {
        if (key == 'serviceNo') {
            var tdHtml = "<td>" + item.serviceNo + "</td><td>" + item.inCalls + "</td><td>" + item.inLost + "</td><td>" + item.inComplete + "</td>";
            curRow.html(tdHtml);
        } else if (key === 'queueId') {
            var waitCountTd = "";
            if (item.queueWaitCount > 0) {
                waitCountTd = "<td style='color:red;'>" + item.queueWaitCount + "</td>";
            } else {
                waitCountTd = "<td>" + item.queueWaitCount + "</td>";
            }
            var tdHtml = "<td class=\"ellipsis\" title=\"" + item.queueName + "\">" + item.queueName + "</td><td>" + item.idleAgentCount + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_getQueuePeer(item) + "\">" + item.totalAgentCount + holly.softphonebar._softphonebar_getQueuePeer(item) + "</td>" + waitCountTd + "<td>" + (item.totalCalls - item.abadonedCalls) + "</td>";
            curRow.html(tdHtml);
        } else if (key === 'userId') {
            var tdHtml = "<td class=\"ellipsis\" title='" + item.DisplayName + "' style=\"height:20px;overflow: hidden\">" + item.DisplayName + "</td><td>" + item.exten + "</td><td class=\"ellipsis\"  title=\"" + holly.softphonebar._softphonebar_getInComCount(item) + "\">" + (item.InComplete + item.TransferComplete) + "(" + holly.softphonebar._softphonebar_getInComCount(item) + ")</td><td>" + item.OutComplete + "</td><td>" + item.callNo + "</td>" +
                "<td>" + holly.softphonebar._softphonebar_displayExtenType(item) + "</td><td>" + holly.softphonebar._softphonebar_displayStatus(item) + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "\">" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "</td>" +
                "<td id=\"" + item.userId + "_timer\"></td><td>" + holly.softphonebar._softphonebar_getDialoutTime(item.DialoutTimeLength) + "</td><td>" + holly.softphonebar._softphonebar_getStatus(item) + "</td>" +
                "<td><button id=\"" + item.userId + "_listen_disable\" class=\"btn btn-mini disabled\" >监听</button>" +
                "<button id=\"" + item.userId + "_listen\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_listen('" + item.channel + "', '" + item.userId + "')\">监听</button>" +
                "<button id=\"" + item.userId + "_endlisten\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_endListen('" + item.channel + "')\">结束监听</button>" +
                "<button id=\"" + item.userId + "_forceHangup_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">强拆</button>" +
                "<button id=\"" + item.userId + "_forceHangup\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_forceHangup('" + item.channel + "', '" + item.pbx + "')\">强拆</button>" +
                "<button id=\"" + item.userId + "_loot_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">抢接</button>" +
                "<button id=\"" + item.userId + "_loot\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_loot('" + item.linkedChannel + "')\">抢接</button>" +
                "<button id=\"" + item.userId + "_kick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签出</button>" +
                "<button id=\"" + item.userId + "_kick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_kick('" + item.userId + "', '" + item.pbx + "')\">签出</button>" +
                "<button id=\"" + item.userId + "_pick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签入</button>" +
                "<button id=\"" + item.userId + "_pick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_pick('" + item.userId + "', '" + item.pbx + "')\">签入</button>" +
                "</td>";
            curRow.html(tdHtml);

            if (item.login && item.timestamp) {
                var date = new Date();
                var identity = date.valueOf();
                var oldTime = ((identity - holly.phone.phone_data.currentServerTime) - parseFloat(item.timestamp) * 1000) / 1000;
                if (oldTime < 0) {
                    oldTime = 0;
                }
                var countTimer = {
                    count: oldTime
                }
                holly.softphonebar._softphonebar_monitorTimers[item.userId] = countTimer;
            } else {
                delete holly.softphonebar._softphonebar_monitorTimers[item.userId];
                $("#" + item.userId + "_timer").text("");
            }
            holly.softphonebar._softphonebar_controlMonitor(item);
            holly.softphonebar._softphonebar_updatePeerNum(item.pbx);
        }
    },
    _softphonebar_listen: function (curChannel, userId) {
        var peer = holly.phone.phone_peers[userId];
        if (peer == null) {
            holly.utils.showError("监听失败!", "softphone_transfer");
            return;
        }
        if (holly.phone.phone_data.busyType == "0") {
            holly.utils.showError("请先将电话置为忙碌", "softphone_transfer");
            return;
        }
        if (holly.phone.phone_data.extenType == "none") {
            holly.utils.showError("执行该操作必须以电话方式登录", "softphone_transfer");
            return;
        }
        if (peer.userId == holly.phone.phone_data.userId) {
            holly.utils.showError("不允许对自身进行操作", "softphone_transfer");
            return;
        }
        if (peer.callStatus != "webcall"
            && peer.callStatus != "inner"
            && peer.callStatus != "normal"
            && peer.callStatus != "dialout"
            && peer.callStatus != "dialTransfer"
            && peer.callStatus != "transfer") {
            holly.utils.showError("该状态不允许监听", "softphone_transfer");
            return;
        }
        var listen = holly.phone.phone_listen(curChannel);
        if (listen) {
            $("#" + userId + "_listen").css("display", "none");
            $("#" + userId + "_endlisten").css("display", "");
        }
    },
    _softphonebar_getQueuePeer: function (item) {
        var queue = holly.phone.phone_queues[item.queueId];
        var members;
        var curPeer;
        var tipTitle = "";
        if (queue) {
            members = queue.members;
            for (var j in members) {
                curPeer = holly.phone.phone_peers_sip[j];
                if (curPeer)
                    tipTitle += (curPeer.DisplayName + ",");
            }
            if (tipTitle != "") {
                tipTitle = "(" + tipTitle.substring(0, tipTitle.lastIndexOf(",")) + ")";
            }
        }
        return tipTitle;
    },
    _softphonebar_getInComCount: function (item) {
        return "普通来电数:" + item.InComplete + "\r\n" + "转接来电数:" + item.TransferComplete;
    },
    _softphonebar_endListen: function () {
        holly.phone.phone_hangup();
    },

    _softphonebar_forceHangup: function (curChannel, pbx) {
        if (pbx === holly.phone.phone_data.pbx_in_ip)
            holly.phone.phone_hangupChannel(curChannel);
        else
            holly.phone.phone_hangupChannelFromPbx(curChannel, pbx);
    },
    _softphonebar_loot: function (linkedChannel) {
        holly.phone.phone_loot(linkedChannel);
    },
    _softphonebar_kick: function (userId, pbx) {
        if (pbx === holly.phone.phone_data.pbx_in_ip)
            holly.phone.phone_kick(userId);
        else
            holly.phone.phone_kickFromPbx(userId, pbx);
    },
    _softphonebar_pick: function (userId, pbx) {
        if (pbx === holly.phone.phone_data.pbx_in_ip)
            holly.phone.phone_pick(userId);
        else
            holly.phone.phone_pickFromPbx(userId, pbx);
    },
    _softphonebar_evtRing: function (event, callObject) {
        var dialoutInput = $("#dialout_input");
        if (dialoutInput) {
            var phoneNum = '';
            if (callObject) {
                if (callObject.ChannelType === 'dialout') {
                    phoneNum = callObject.FromDid;
                } else if (callObject.ChannelType === 'normal') {
                    phoneNum = callObject.FromCid;
                }
                if (hollyglobal.isHiddenNumber) {
                    phoneNum = holly.softphonebar.softphonebar_getHiddenNum(phoneNum);
                }
            }
            $("#dialout_input").val(phoneNum);
        }
        if (!hollyglobal.isMonitorPage && hollyglobal.ringEvent && typeof hollyglobal.ringEvent == 'function') {
            hollyglobal.ringEvent(callObject);
        }
    },
    _softphonebar_evtTalking: function (callObject) {
        if (!hollyglobal.isMonitorPage && hollyglobal.talkingEvent && typeof hollyglobal.talkingEvent == 'function') {
            hollyglobal.talkingEvent(callObject);
        }
    },
    _softphonebar_evtHangup: function (event, callObject) {
        if (!hollyglobal.isMonitorPage && hollyglobal.hangupEvent && typeof hollyglobal.hangupEvent == 'function') {
            hollyglobal.hangupEvent(callObject);
        }
    },
    _softphonebar_displayQueueName: function (queueName) {
        if (!queueName)
            queueName = "";
        return queueName;
    },
    _softphonebar_ontDialinAgentBusy: function (event, callObject) {
//        Account: "N000000007121"
//        Command: "Event"
//        Event: "DialinAgentBusyMessage"
//        FromCid: "0105004"
//        PBX: "2.3.1.100"
//        UserID: "82dc2510-bef4-11e3-9327-9b83bd1d8356"
        holly.utils.showError("您有新来电，来电号码:" + callObject.FromCid, "softphone_transfer");
    }
}

