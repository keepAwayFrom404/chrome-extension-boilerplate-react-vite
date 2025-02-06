import 'webextension-polyfill';

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, _, sendRes) => {
  console.log(message, 'message ===>');
  if (message.type === 'DOWNLOAD_IMAGE') {
    const { url, index } = message;
    console.log(url, 'url ===>');
    // 下载图片
    chrome.downloads.download({
      url: url,
      conflictAction: 'overwrite',
      saveAs: false,
      filename: `${index}.jepg`,
    });
  }
  sendRes('接收到消息');
  return true;
});
