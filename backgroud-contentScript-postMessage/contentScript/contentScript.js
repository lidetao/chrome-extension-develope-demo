(function() {
	/**
	 * 全局变量容器
	 */
	var _INFO = {
		name: md5(window.location.href) || "contentScript"
	};

	/**
	 * 处理消息
	 * @param {Object} _message
	 */
	function handleMessage_bg(_message) {
		var from = _message.from; //消息来源
		var to = _message.to; //接收者
		var type = _message.type; //消息类型
		var data = _message.data; //消息内容

	}
	//=========================自执行部分=================================
	/**
	 * 与background建立链接
	 */
	var port_bg = chrome.runtime.connect({
		name: "toBackgroud"
	});

	/**
	 * 收到消息
	 */
	port_bg.onMessage.addListener(function(message) {
		console.log(_INFO.name + "-收到消息", message);

		if(_INFO.name === message.to) {
			//判断是否是给当前发送的消息
			handleMessage_bg(message);
		} else {
			console.log(_INFO.name + "-消息接收者不是当前页面，抛弃");
		}

	});
	port_bg.onDisconnect.addListener(function(error) {
		console.log(_INFO.name + "-链接断开", error);
	});
	/**
	 * 发送消息
	 */
	port_bg.postMessage({
		from: _INFO.name,
		to: "background",
		type: "init",
		data: {
			action: "ping"
		}
	});
	//=========================//自执行部分=================================

})();