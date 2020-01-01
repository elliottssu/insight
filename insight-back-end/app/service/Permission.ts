import { Service } from 'egg';

export default class Permission extends Service {
    /**
     * 根据机器人状态获取当前用户实际权限
     * @param userInfo 用户信息
     * @param permissionList 权限列表
     * @param robotInfo 当前机器人信息
     */
    public getPermission(userInfo, permissionList, robotInfo) {

        const permissionInfo: any = permissionList.find(e => e.robotId === robotInfo.id && e.userId === userInfo.id);

        // 1. 超级管理员：所有机器人全部设置为管理员
        // 2. 公共机器人：有当前用户如果是admin则设为admin，否则全部设为readonly
        // 3. 私有机器人：根据当前用户权限设置，没有则无权限

        let role = '';

        if (userInfo.isSuperAdmin) {
            role = 'admin';
            return role;
        }

        if (robotInfo.status === 'public') {
            role = !permissionInfo || permissionInfo.role !== 'admin' ? 'readonly' : 'admin';
            return role;
        }

        if (!permissionInfo) {
            role = 'none';
            return role;
        }

        role = permissionInfo.role;

        return role;

    }
}
