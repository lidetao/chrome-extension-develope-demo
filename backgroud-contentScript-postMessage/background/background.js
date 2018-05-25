(function() {
	/**
	 * 全局变量容器
	 */
	var _INFO = {
		name: "background", //本模块名
		tabPort: {} //tab页的port连接容器
	};

	/**
	 * 监听browserAction按钮点击事件
	 */
	chrome.browserAction.onClicked.addListener(function(tab) {

		//通知tab页初始化编辑窗口
		var tabcode = md5(tab.url); //tab对应的编号，使用url进行MD5

		//给tab页发送消息
		var port = _INFO.tabPort[tabcode];
		if(port) {
			port.postMessage({
				from: _INFO.name,
				to: tabcode,
				type: "init"
			});
		} else {
			console.log(_INFO.name + "-无法向目标tab页发送消息");
		}

	});

	/**
	 * 监听给background发送的消息
	 */
	chrome.runtime.onConnect.addListener(function(port) {

		var tab = null; //发送消息的tab
		var tabcode = null; //tab对应的编号
		var fromTab = port.sender && port.sender.tab ? true : false; //是否来自tab页面(contentScript对应的内容页)

		if(fromTab) {
			tab = port.sender.tab; //发送消息的tab
			tabcode = md5(tab.url); //tab对应的编号，使用url进行MD5
			console.log("tab:", tab);

			/**
			 * 注册tab对应的port
			 */
			_INFO.tabPort[tabcode] = port;
			console.log(_INFO.tabPort);
		}

		/**
		 *收到消息
		 */
		port.onMessage.addListener(function(message) {
			console.log(_INFO.name + "-收到消息", message);

			if(_INFO.name === message.to) {
				//判断是否是给当前发送的消息
				handleMessage_tab(port, message);
			} else {
				console.log(_INFO.name + "-消息接收者不是当前页面，抛弃");
			}

		});
		/**
		 * 断开连接
		 */
		port.onDisconnect.addListener(function(error) {
			console.log(_INFO.name + "-链接断开", error);
			/**
			 * 注销tab对应的port
			 */
			if(tabcode) {
				delete _INFO.tabPort[tabcode];
				console.log(_INFO.tabPort);
			}

		});
	});

	/**
	 * 处理来自tab的消息
	 * @param {Object} _port
	 * @param {Object} _message
	 */
	function handleMessage_tab(_port, _message) {

		var from = _message.from; //消息来源
		var to = _message.to; //接收者
		var type = _message.type; //消息类型
		var data = _message.data; //消息内容

		//回发消息
		var message = {
			from: _INFO.name,
			to: from
		};
		if(type === "init") {
			message.type = "init";
			message.data = {
				action: "pong"
			};
		}

		//发送消息
		_port.postMessage(message);

	}
})();