/**
 * common store
 */

import { action, observable } from 'mobx';

class CommonStore {
  @observable message = {}; // 消息提示

  @observable timer = null;

  /**
   * 触发消息提示
   * @param type 消息类型
   * @param content 消息内容
   */
  @action alertMessage = (type, content) => {
    this.message = {
      status: 1,
      type,
      content,
    };
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.message = {};
    }, 3000);
  }
}

export default new CommonStore();
