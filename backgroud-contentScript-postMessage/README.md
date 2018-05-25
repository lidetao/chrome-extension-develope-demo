# backgroud-contentScript-postMessage
background与contentScript通过postMessage进行通信

##实现说明
1. background是浏览器插件的后台运行脚本，在浏览器打开期间，可以保持长活；
2. background可以监听browserAction图标的点击事件，并通过postMessage通信方式通知contentScript；
3. background与contentScript可以通过connect对象，建立长连接，通过获取到的port对象发送消息；
4. contentScript的控制台日志可以通过F12直接查看;background的控制台日志，需要点击“插件管理”-“背景页”查看。

