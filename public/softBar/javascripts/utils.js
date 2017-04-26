holly.utils = {
    showBoxbgDom: null,
    showBoxMsgDom: null,
    notifyDialogRemain: 500,
    notifyDialogInterval: null,
    serachInputNoresult: "serachInputNoresult",
    pickSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "none");
        $("#softphoneBarKick").css("display", "block");
    },
    kickSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "block");
        $("#softphoneBarKick").css("display", "none");
    },
    unRegisterSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "none");
        $("#softphoneBarKick").css("display", "none");
        holly.softphonebar._softphonebar_barupdate('', 'unregister', '');
    },
    hideSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "none");
        $("#softphoneBarKick").css("display", "none");
    },
    showBox: function (width, height, msg) {
        var bodyWidth = document.body.offsetWidth;
        var bodyHeight = screen.height;
        if (!holly.utils.showBoxbgDom) {
            holly.utils.showBoxbgDom = document.createElement("div");
            holly.utils.showBoxbgDom.setAttribute("id", "icc.holly.utils.bgDiv");
            holly.utils.showBoxbgDom.style.position = "absolute";
            holly.utils.showBoxbgDom.style.top = "0";
            holly.utils.showBoxbgDom.style.background = "#f2f2f2";
            holly.utils.showBoxbgDom.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
            holly.utils.showBoxbgDom.style.opacity = "0.6";
            holly.utils.showBoxbgDom.style.left = "0";
            holly.utils.showBoxbgDom.style.zIndex = "10000";
        }
        holly.utils.showBoxbgDom.style.width = bodyWidth + "px";
        holly.utils.showBoxbgDom.style.height = bodyWidth + "px";
        document.body.appendChild(holly.utils.showBoxbgDom);

        if (!holly.utils.showBoxMsgDom) {
            holly.utils.showBoxMsgDom = document.createElement("div");
            holly.utils.showBoxMsgDom.setAttribute("id", "icc.holly.utils.msgDiv");
            holly.utils.showBoxMsgDom.setAttribute("align", "center");
            holly.utils.showBoxMsgDom.style.background = "white";
            holly.utils.showBoxMsgDom.style.border = "1px solid #c6c6c6";
            holly.utils.showBoxMsgDom.style.position = "absolute";
            holly.utils.showBoxMsgDom.style.left = (bodyWidth - width) / 2 + "px";
            holly.utils.showBoxMsgDom.style.top = 135 + document.documentElement.scrollTop + "px";
            holly.utils.showBoxMsgDom.style.textAlign = "left";
            holly.utils.showBoxMsgDom.style.lineHeight = "25px";
            holly.utils.showBoxMsgDom.style.zIndex = "10001";
            holly.utils.showBoxMsgDom.style.paddingTop = "11px";
            holly.utils.showBoxMsgDom.style.paddingLeft = "10px";
            holly.utils.showBoxMsgDom.style.paddingRight = "10px";
        }

        holly.utils.showBoxMsgDom.style.width = width + "px";
        holly.utils.showBoxMsgDom.style.height = height + "px";

        holly.utils.showBoxMsgDom.innerHTML = msg;
        document.body.appendChild(holly.utils.showBoxMsgDom);
    },
    closeBox: function () {
        if (holly.utils.showBoxMsgDom) {
            document.body.removeChild(holly.utils.showBoxMsgDom);
            holly.utils.showBoxMsgDom = null;
        }
        if (holly.utils.showBoxbgDom) {
            document.body.removeChild(holly.utils.showBoxbgDom);
            holly.utils.showBoxbgDom = null;
        }
    },
    sortTable: function (tableID, iCol, dataType, object) {
        var docFrag = document.createDocumentFragment();
        var sortArr = holly.utils._getSortTRs(tableID, iCol, dataType, $(object).attr("state"));
        if (!sortArr)
            return;
        holly.utils._change_sortState(tableID, object);
        for (var i = 0; i < sortArr.length; i++) {
            docFrag.appendChild(sortArr[i]);
        }
        var oTable = document.getElementById(tableID);
        oTable.tBodies[0].appendChild(docFrag);
    },
    _getSortTRs: function (tableID, iCol, dataType, state) {
        var trArr = new Array;
        var oTable = document.getElementById(tableID);
        var rows = oTable.tBodies[0].rows;
        var sortExcludeRow = [];
        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i].cells[0]).attr('sort_exclude')) {
                sortExcludeRow.push(rows[i]);
            } else {
                trArr[trArr.length] = rows[i];
            }
        }
        var html = holly.utils._compareTRs(iCol, dataType, state);
        if (!html)
            return;
        trArr.sort(html);
        if (sortExcludeRow.length > 0) {
            for (var j = 0, jLen = sortExcludeRow.length; j < jLen; j++) {
                trArr.push(sortExcludeRow[j]);
            }
        }
        return trArr;
    },
    _compareTRs: function (iCol, dataType, state) {
        return function compare(tr1, tr2) {
            var cell1 = tr1.cells[iCol];
            var cell2 = tr2.cells[iCol];
            if (!cell1 || !cell2)
                return null;
            var value1 = holly.utils._convert(cell1.innerText, dataType);
            var value2 = holly.utils._convert(cell2.innerText, dataType);
            if (state == "init" || state == "down") {
                return holly.utils._asc(value1, value2);
            } else if (state == "up") {
                return holly.utils._desc(value1, value2);
            }
        };
    },
    _convert: function (value, dataType) {
        switch (dataType) {
            case "int":
                return parseInt(value);
            case "float":
                return parseFloat(value);
            case "date":
                return new Date(Date.parse(value));
            case "intAndString":
            {
                return parseInt(value.substring(0, value.indexOf("(")));
            }
            default:
                return value.toString();
        }
    },
    _desc: function (x, y) {
        if (x > y) {
            return -1;
        } else if (x < y) {
            return 1;
        } else {
            return 0;
        }
    },
    _asc: function (x, y) {
        if (x > y) {
            return 1;
        } else if (x < y) {
            return -1;
        } else {
            return 0;
        }
    },
    _change_sortState: function (tableID, object) {
        var tableIDSort = $("#" + tableID + " .sort");
        tableIDSort.removeClass("monitor_sort_up");
        tableIDSort.removeClass("monitor_sort_down");
        tableIDSort.addClass("monitor_sort");
        var objectObj = $(object);
        var state = objectObj.attr("state");
        if (state == "init") {
            objectObj.attr("state", "up");
            objectObj.find("span").removeClass("monitor_sort");
            objectObj.find("span").addClass("monitor_sort_up");
        } else if (state == "up") {
            objectObj.attr("state", "down");
            objectObj.find("span").removeClass("monitor_sort_up");
            objectObj.find("span").addClass("monitor_sort_down");
        } else if (state == "down") {
            objectObj.attr("state", "up");
            objectObj.find("span").removeClass("monitor_sort_down");
            objectObj.find("span").addClass("monitor_sort_up");
        }
    },
    _available: function (str, object, index) {
        var isAvailable = false;
        if (object.searchField == undefined
            || object.data == undefined) {
            return isAvailable;
        }
        var searchs = object.searchField;
        var pinyinFields = object.pinyinField;
        var data = object.data;
        for (var i = 0; i < searchs.length; i++) {
            var pinyin = false;
            if (holly.utils.contains(pinyinFields, searchs[i])) {
                pinyin = true;
            }
            var searchValue = eval("data[index]." + searchs[i]);
            if (pinyin && data[index].pinyin && (data[index].pinyin).match("^" + str)) {
                isAvailable = true;
                return isAvailable;
            }
            if (searchValue && searchValue.match("^" + str)) {
                isAvailable = true;
                return isAvailable;
            }
        }
        return isAvailable;
    },
    _searchClick: function (object, index) {
        var obj = $("#" + object.id + "_ul li:eq(" + index + ")");
        var userId = obj.attr("userId");
        holly.utils._setValue(object.id, userId, object);
    },
    _searchOnKeyChange: function (object, index) {
        var obj = $("#" + object.id + "_ul li:eq(" + index + ")");
        var userId = obj.attr("userId");
        var user = holly.utils._getObjectInfo(object, userId);
        var callback = object.callbackFuc;
        if (callback)
            eval("callback(user)");
    },
    _setValue: function (id, userId, object) {
        var user = holly.utils._getObjectInfo(object, userId);
        if (object.showField && object.showField != "") {
            var field = object.showField;
            $("#" + id + "_input").val(eval("user." + field));
            $("#" + id + "_input").css("color", "#000");
        }
        $("#" + id + "_div").css("display", "none");
        var callback = object.callbackFuc;
        if (callback)
            eval("callback(user)");
    },
    _getObjectInfo: function (object, userId) {
        if (object.arrayDataType || object.data.length == 0) {
            return object.data[userId];
        } else {
            if (object.cacheData) {
                return getCache(object.cacheData, userId);
            }
            return getCache("agents", userId);
        }
    },
    closeBox: function () {
        holly.phone.phone_closeDiv();
    },
    checkHide: function () {
        if (holly.utils.notifyDialogRemain <= 0) {
            holly.utils.hideNotify();
        }
        holly.utils.notifyDialogRemain -= 500;
    },
    hideNotify: function () {
        if (holly.utils.notifyDialogInterval != null) {
            clearInterval(holly.utils.notifyDialogInterval);
            holly.utils.notifyDialogInterval = null;
            holly.phone.phone_closeDiv();
        }
    },
    showError: function (msg, objectId) {
        $("#softphone-bar-bgdiv").css({display: "block", height: $(document).height()});
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center;'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_error.png' style='float:left;margin-left:10px;'/>" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:4px;'>" + msg + "</div>" +
            "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.phone.phone_closeDiv();\">关 闭</button></div>";
        $('#' + objectId).empty();
        $('#' + objectId).html(msgHtml);
        document.documentElement.scrollTop = 0;
        $('#' + objectId).fadeIn('fast');
    },

    showSucc: function (msg, objectId) {
        $("#softphone-bar-bgdiv").css({display: "block", height: $(document).height()});
//         $('#'+objectId).css("top","5px");
//         var msgHtml = "" +
//                 "<div style='height:30px;overflow:hidden;padding-left:20px;'><img src='./img/tip_succ.png' style='float:left;'/>" +
//                 "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:2px'>"+msg+"</div></div>";
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center;'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_succ.png' style='float:left;margin-left:10px;'/>" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:4px;'>" + msg + "</div></div>";
        $('#' + objectId).empty();
        $('#' + objectId).html(msgHtml);
        document.documentElement.scrollTop = 0;
        $('#' + objectId).fadeIn('fast');
        holly.utils.notifyDialogInterval = setInterval("holly.utils.checkHide()", 600);
    },

    showTransferOrConsultError: function (msg, id) {
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center;'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_error.png' style='float:left;margin-left:20px;'/>" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:2px;'>" + msg + "</div>" +
            "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.phone.phone_closeDiv();\">关 闭</button></div>";
        $('#' + id).html(msgHtml);
    },
    showTransferOrConsultSucc: function (msg, id) {
        holly.utils.notifyDialogRemain = 500;
        holly.utils.hideNotify();
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_succ.png' style='float:left;margin-left:20px;' />" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:5px'>" + msg + "</div>" +
            "</div></div>";
        $('#' + id).html(msgHtml);
        holly.utils.notifyDialogInterval = setInterval("holly.utils.checkHide()", 600);
    },
    contains: function (elems, value) {
        for (var i = 0; i < elems.length; i++) {
            if (elems[i] == value) {
                return true;
            }
        }
        return false;
    },
    _hidden: function (className) {
        $("." + className).css("display", "none");
    },
    _stopEvent: function (event) {
        event.preventDefault();
    },
    startWith: function (str, prefix) {
        return str.indexOf(prefix) == 0;
    },
    json_encode: function (mixed_val) {
        var json = window.JSON;
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            return json.stringify(mixed_val);
        }
        var value = mixed_val;
        var quote = function (string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ?
                '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
                '"' + string + '"';
        };

        var str = function (key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0;          // The loop counter.
            var k = '';          // The member key.
            var v = '';          // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                                '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' :
                        gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });
    }
}