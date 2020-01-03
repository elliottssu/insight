/**
 * 公共方法
 */
import imgLoading from '../images/s-loading.gif';
import imgOn from '../images/s-on.gif';
import imgOff from '../images/s-off.gif';

class CommonUtil {
  /**
   * 中文名字显示后两位
   * @param name 中文全称
   */
  getShortName = (name) => {
    return name.substring(name.length - 2);
  }

  /**
   * 获取机器人状态
   * @param isLoading 是否加载中
   * @param taskCount 任务数量
   */
  getRobotStatus = (isLoading, taskCount) => {
    let status = '';
    if (isLoading) {
      status = imgLoading;
      return status;
    }
    if (taskCount === 0) {
      status = imgOff;
      return status;
    }
    status = imgOn;
    return status;
  }
}
export default new CommonUtil();
