import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class Log {

    @PrimaryGeneratedColumn()
    id: number;

    // 机器人ID
    @Column()
    robotId: number;

    // 任务ID
    @Column()
    taskId: number;

    // 用户ID
    @Column()
    userId: number;

    // 触发方式
    @Column()
    methond: string;

    // 发给企业微信的类型
    @Column()
    msgType: string;

    // 发给企业微信的消息体
    @Column({ type: 'text' })
    msgContent: string;

    // 内容
    @Column({ type: 'text' })
    remark: string;

    // 执行状态
    @Column()
    status: string;

    // 创建时间
    @CreateDateColumn()
    createDate: Date = new Date();

    // 修改时间
    @UpdateDateColumn()
    updateDate: Date = new Date();

}
