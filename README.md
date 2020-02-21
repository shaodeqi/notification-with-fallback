## notification-with-fallback

> Notification with a fallback scheme

### 描述

带有降级方案的Notification：

- 支持HTML5 Notification的浏览器使用Notification，不支持的话走降级方案，消息降级策略confirm/alert可选，也可以自定义降级策略
- sound属性使用HTML5的Audio实现，浏览器支持 **IE >= 9**

### 引入方式

```javascript
import WebNotification from 'notification-with-fallback';
```

或

```javascript
<script src="notification-with-fallback/lib/index.min.js"></script>
```

### 使用方式

```javascript
import WebNotification from 'notification-with-fallback';

var notify = new WebNotification('新消息', {
    body: '这是一条新消息'，// 消息内容
    sound: 'xxx', // 音频地址
    icon: 'xxx', // icon地址
    ...
});
```

### 参数

> 参数同HTML5 Notification API [详见>](https://developer.mozilla.org/zh-CN/docs/Web/API/notification)

| 参数 | 类型 | 描述 | 默认参数 |
|:----|:-----:|:-----|:----|
| title | String | 通知标题 |  |
| options.sound | String | 音频地址 |  |
| options.body | String | 通知中额外显示的字符串 |  |
| options.icon | String | 用于显示通知的图标 |  |
| options.lang | String | 指定通知中所使用的语言 |  |
| options.dir | 'auto' \| 'ltr' \| 'rtl' | 文字的方向 |  |
| options.fallbackType | 'alert' \| 'confirm' | 降级方式 | 'confirm'
| options.fallbackTemplate | String | 降级方案时拼接模板、降级时会使用title + body进行拼接 | 'title: body'|
| options.fallbackDelay | Number | 降级方案弹窗延时（ms）(防止alert/confirm的阻塞代码执行) | 1000 |
| options.fallbackForce | Boolean | 是否强制走降级 | false |
| options.fallbackWhenDenied | Boolean | 是否在用户拒绝授权时走降级 | true |
| options.focusOnClick | Boolean | 是否在点击时执行window.onfocus | true |
| options.pauseSoundOnClick | Boolean | 是否在点击时暂停声音播放 | false |
| options.soundHack | Boolean | 是否使用new Audio方式hack sound属性 | true |

### 其他

- 构造函数属性：fallback (降级策略，可自定义降级策略)
- 实例属性：onclose、onclick、onshow、onerror、audio、isFallback (走降级策略时：弹窗出现时触发 onshow ；点击确定触发 onclick；点击关闭时触发 onclose)
- 实例方法：close、pauseSound

### 自定义降级策略

```javascript
import WebNotification from 'notification-with-fallback';
WebNotification.prototype.fallback = function (title, options) {
    ...
}
```