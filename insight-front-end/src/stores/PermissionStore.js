/**
 * permission store
 */

import { action, observable } from 'mobx';
import { PermissionService } from '../services';

class PermissionStore {
  @observable isModelPermissionVisable = false;

  @observable permissionList = [];

  // 获取日志
  @action getPermissionList = (params) => {
    PermissionService.getPermission(params).then((result) => {
      if (result.data.code !== 0) return;
      this.permissionList = result.data.data;
    });
  }

  // 显示权限模态框
  @action showModelPermission = () => {
    this.isModelPermissionVisable = true;
  }

  // 隐藏权限模态框
  @action handleCancel = () => {
    this.isModelPermissionVisable = false;
  }
}

export default new PermissionStore();
