import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class Robot {

    @PrimaryGeneratedColumn()
    id: number;

    // 用户ID
    @Column()
    userId: number;

    // 机器人名字
    @Column()
    name: string;

    // 机器人描述
    @Column()
    description: string;

    // 机器人webook地址
    @Column()
    webhook: string;

    // 发布状态 公共:public  私有:private
    @Column()
    status: string;

    // 创建时间
    @CreateDateColumn()
    createDate: Date = new Date();

    // 修改时间
    @UpdateDateColumn()
    updateDate: Date = new Date();

}
