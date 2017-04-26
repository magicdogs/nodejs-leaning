/**
 * Created by zhangxc on 14-5-16.
 */
//坐席状态

var agentState = {
    eAvailable:0, 		//登录
    eLogin:1,    		//签入
    eLogout:2,   		//签出
    eDialing:3,			//拨号
    eTalking:4,  		//外拨通话
    //eHangup:5,          //挂机
    ePreview:22,		//预览客户资料
    eUnknown : 99, 		//未知
    eWorkFinish: 21,	//案头结束

    toString:function(State)
    {
        var result = "";
        switch(State)
        {
            case this.eAvailable:result = "登录";break;
            case this.eLogin:result = "签入";break;
            case this.eLogout:result = "签出";break;
            case this.eDialing:result = "拨号";break;
            case this.eTalking:result = "通话";break;

            case this.eLittleBreak:result = "休息";break;
            case this.eWashRoom:result = "洗手间";break;
            case this.eNoonBreak:result = "午休";break;

            case this.eMeeting:result = "会议中";break;
            case this.eHold:result = "保持";break;
            case this.eHelpDialing:result = "求救拨号";break;
            case this.eHelpTalking:result = "求救通话";break;
            case this.eThreeTalking:result = "三方通话";break;

            case this.eInTalkIng:result = "来话通话中";break;
            case this.einHold:result = "来话保持";break;

            case this.eWorkOn:result = "案头";break;
            case this.eWorkFinish:result = "案头结束";break;
            case this.ePreview:result = "预览资料";break;

            case this.eAnswerRequest:result = "呼叫到达";break;
            case this.eUnknown:result = "未知";break;

            default:result = "错误";break;
        }
        return result;
    }
}

var agentBtn = {
    eLogIn : 0x00000000,//签入
    eLogOut : 0x00000001,//签出
    eAgentstate : 0x00000002,//坐席状态

    exitsettle : 0x00000003,  //结束案头
    eAnswer : 0x00000004,//应答
    eCallOut : 0x00000005,//呼出
    eTransfer : 0x00000006,//发起转移
    eConference : 0x00000007,//发起会议
    eHold : 0x00000008,//保持
    eRetrieve : 0x00000009,//恢复
    eEmergencyHelp : 0x0000000A,//求救
    eCommonHelp : 0x0000000B,//求助
    eSupermonitor : 0x0000000C,//监控
    eInsert : 0x0000000D,//插入
    eIntercept : 0x0000000E,//拦截
    eQueryagentstate : 0x0000000F,//坐席AMS状态查询

    eQueryvdninfo : 0x00000010,//VDN查询
    eHangup :0x00000030 //挂机
}

var phone = {
    sinoAgentInfo : null,
    webSoftPhone : null,
    logWindow : null,
    isShowLog:false,
    currLogLine : 1,
    AmsServerIP : "172.16.207.247",
    IP : "10.227.3.2",
    vccCode : "wintel",
    EnsureDefaultLink : 1,
    MainIcUrl : "http://172.16.128.80:9700/icsdk",
    BackIcUrl : "",
    AutoEnterIdle : true,
    AutoReportAgentMode : true,
    AgentIDPrefix : "a",
    AgentID : "01000001",
    IcUser : '3001',
    IcUserDomain : '@sino-life.com',
    AgentName : "菲菲",
    Password : "a123456",
    AgentStation : "1001",
    AgentType : "0",
    AgentSkills : "1",
    bOCXOlderStatus	: 0,
    writeLog : function(message){
        if(this.isShowLog){
            this.logWindow = new Log(Log.DEBUG, Log.popupLogger);
        }
        if(this.logWindow!=null){
            if(this.currLogLine >10000){
                this.logWindow.close();
                this.logWindow = new Log(Log.DEBUG, Log.popupLogger);
                this.logWindow.info(message);
                this.currLogLine = 1;
            }else{
                this.logWindow.info(message);
                this.currLogLine++;
            }
        }
    },
    init : function(){
        this.webSoftPhone.doInit();
        this.webSoftPhone.doStateChange(agentState.eAvailable);

    },

    Login : function(){
        var pwd = hex_md5(this.Password);
        wincall.fn_login(this.IP,this.vccCode,this.IcUser,pwd,this.AgentStation,1,0);
    },
    LogOut : function(){
        wincall.fn_logout();
    },

    IcReleaseCall : function (){
        wincall.fn_hangup();
    },

    IcResetControl : function (){
        this.webSoftPhone.doStateChange(agentState.eLogin);
    },

    IcCallOut : function (CallOutNo)
    {
        var groupid = 1;

        //wincall.fn_dialinner(1,this.AgentStation,groupid);
        wincall.fn_dialouter(CallOutNo,'4000095535',groupid);
        this.webSoftPhone.setCallPhoneNO(CallOutNo);
    },

    onLogInSuccess : function(){
        this.webSoftPhone.doStateChange(agentState.eLogin);
    },
    onLogInFail : function(rtnid){
        this.webSoftPhone.doStateChange(agentState.eLogout);
        alert('签入失败'+ rtnid);
    },
    onLogOutSuccess : function(){
        this.webSoftPhone.doStateChange(agentState.eLogout);
    },
    onLogOutFail : function(){
        this.webSoftPhone.doStateChange(agentState.eLogout);
        alert('签出失败');
    },

    onIcCallOutSuccess : function(callID){
        this.webSoftPhone.addCallOutNum();
        //设置无出局字冠的被叫号码
        this.webSoftPhone.doStateChange(agentState.eDialing);
        this.webSoftPhone.setCallDirection('00');		//呼叫方向 00呼出，01呼入
        //外呼调用成功，设置本次通话系统呼叫编号
        this.webSoftPhone.setCallUcid(callID);

    },

    onIcCallReleased : function(){
        //sinoCallData.recordUrl=Recv1.GetRecordURLByID(sinoCallData.CallID);//获取录音文件
        this.webSoftPhone.onIcCallReleased();
        this.webSoftPhone.doStateChange(agentState.eLogin);
    },
    onIcOpAnswered : function(){
        var agentstatus = sinoAgentInfo.status;
        if(agentstatus==agentState.eDialing){
            this.webSoftPhone.onIcOpAnswered();
            this.webSoftPhone.doStateChange(agentState.eTalking);
        }
        else{
            alert('错误的拨号状态：'+agentstatus);
        }
    },

    backstate : function(){
        var agentstatus = sinoAgentInfo.status;
        return agentstatus;
    },
    setICConfig : function(AmsServerIP,EnsureDefaultLink,MainIcUrl,BackIcUrl,AutoEnterIdle,AutoReportAgentMode){
        this.AmsServerIP = AmsServerIP;
        this.EnsureDefaultLink = EnsureDefaultLink;
        this.MainIcUrl = MainIcUrl;
        this.BackIcUrl = BackIcUrl;
        this.AutoEnterIdle = AutoEnterIdle;
        this.AutoReportAgentMode = AutoReportAgentMode;
    },
    setAgentConfig:function(AgentIDPrefix,AgentID,IcUser,AgentName,Password,AgentStation,AgentType,AgentSkills){
        this.AgentIDPrefix = AgentIDPrefix;
        this.AgentID = AgentID;
        this.IcUser = IcUser;
        this.AgentName = AgentName;
        this.Password = Password;
        this.AgentStation = AgentStation;
        this.AgentType = AgentType;
        this.AgentSkills = AgentSkills;
    }
}

function PhoneInit(){
    phone.init();
}

function logOut(){
    //Recv1.SignOut();
}

if (typeof window.attachEvent != "undefined"){
    window.attachEvent( "onunload", logOut);
}