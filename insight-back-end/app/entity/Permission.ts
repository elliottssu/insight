import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import User from './User';

@Entity()
export default class Permission {

    @PrimaryGeneratedColumn()
    id: number;

    // 机器人ID
    @Column()
    robotId: number;

    // 用户ID
    @Column()
    userId: number;

    // 角色 管理员: admin 只读：readonly
    @Column()
    role: string;

    // 多对一外键（查询用）
    @ManyToOne(() => User, user => user.id)
    user: User;

    // 创建时间
    @CreateDateColumn()
    createDate: Date = new Date();

    // 修改时间
    @UpdateDateColumn()
    updateDate: Date = new Date();
}
