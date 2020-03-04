import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class Task {

    @PrimaryGeneratedColumn()
    id: number;

    // 机器人ID
    @Column()
    robotId: number;

    // 用户ID
    @Column()
    userId: number;

    // 消息类型
    @Column()
    msgType: string;

    // 消息体
    @Column({ type: 'text' })
    msgContent: string;

    // cron表达式
    @Column()
    cron: string;

    // cron表达式中文
    @Column()
    cronText: string;

    // 运行状态
    @Column()
    status: string;

    // 套件类型 (用来拓展任务能力)
    @Column()
    suite: string;

    // 是否是工作日（智能跳过节假日）
    @Column()
    isWorkday: boolean;

    // 备注
    @Column({ type: 'text' })
    remark: string;

    // 创建时间
    @CreateDateColumn()
    createDate: Date = new Date();

    // 修改时间
    @UpdateDateColumn()
    updateDate: Date = new Date();
}
