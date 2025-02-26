// import { toggleTheme } from '@src/toggleTheme';
import { get } from 'lodash-es';
console.log('content script loaded');

function findTargetImageUrls(): string[] {
  const targetParent = document.getElementsByClassName('goods-container-v2')[0].children.item(1);
  let count = 0;
  let secondEmptyDiv = null;

  // 遍历子元素
  for (let i = 0; i < targetParent.children.length; i++) {
    const child = targetParent.children[i];
    if (child.tagName === 'DIV' && child.attributes.length === 0) {
      count++;
      const temp1 = get(child,'children.0.children.0.children.0.children')
      if (temp1 || count === 2) {
        secondEmptyDiv = child;
        break;
      }
    }
  }
  const result = [];
  const temp = get(secondEmptyDiv, 'children.0.children.0.children.0.children')?.length > 0 ? get(secondEmptyDiv, 'children.0.children.0.children.0.children'):  get(secondEmptyDiv, 'children.0.children')
  for (let item of (temp as Array<any>)) {
    if(item.children[0].tagName === 'IMG') {
      result.push(item.children[0].dataset.src);
    }
  }

  return result;
}

// 监听来自后台脚本的消息
window.addEventListener('message', event => {
  if (event.data.type === 'DOWNLOAD_IMAGES') {
    // 查找 test 类名下的所有图片元素
    const testElements = findTargetImageUrls();
    console.log(testElements, 'testElements ===>'); // 居然就好了·
    testElements.forEach((img, index) => {
      // 向后台脚本发送下载请求
      chrome.runtime.sendMessage(
        {
          type: 'DOWNLOAD_IMAGE',
          url: img,
          index: index + 1,
        },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            console.log('收到背景脚本的响应:', response);
          }
        },
      );
    });
  }
});

// void toggleTheme();
