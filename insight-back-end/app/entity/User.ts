import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    // 昵称
    @Column()
    nickname: string;

    // 用户名
    @Column()
    username: string;

    // 密码
    @Column()
    password: string;

    // 是否是超级管理员（能看到所有机器人）
    @Column()
    isSuperAdmin: boolean;

    // 创建时间
    @CreateDateColumn()
    createDate: Date = new Date();

    // 修改时间
    @UpdateDateColumn()
    updateDate: Date = new Date();
}
