import 'egg'
import { Repository, Connection } from 'typeorm'
import Log from '../app/entity/Log'
import Permission from '../app/entity/Permission'
import Robot from '../app/entity/Robot'
import Task from '../app/entity/Task'
import User from '../app/entity/User'

declare module 'egg' {
  interface Context {
    connection: Connection
    entity: {
      Log: any
      Permission: any
      Robot: any
      Task: any
      User: any
    }
    repo: {
      Log: Repository<Log>
      Permission: Repository<Permission>
      Robot: Repository<Robot>
      Task: Repository<Task>
      User: Repository<User>
    }
  }
}
