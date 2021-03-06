import ServerTool from 'node-crud-kit/lib/tools/server.tool'
import IDatabase from '../interfaces/db.interface'
import IVisit from '../interfaces/visit.interface'
import VisitRepository from '../repositories/visit.repository'
import BaseRouter from 'node-crud-kit/lib/bases/base.router'
import io from 'socket.io'
import CommonTool from 'node-crud-kit/lib/tools/common.tool'
import StatRepository from '../repositories/stat.repository'
import IStat from '../interfaces/stat.interface'
import SocketTool from '../tools/socket.tool'
var cron = require('node-cron')

export default class VisitRouter extends BaseRouter<IVisit> {
  db: IDatabase
  repository: VisitRepository
  statRepository: StatRepository
  userCount: number = 0
  stats: IStat[] = []

  constructor(db: IDatabase) {
    super(db)

    this.db = db
    this.repository = new VisitRepository(this.db.Visit)
    this.statRepository = new StatRepository(this.db.Stat)
    this.initStats()

    SocketTool.getInstance().initStats = this.initStats
    this.initStats()
  }

  initStats = async () => {
    let tempStats = await this.statRepository.getAll()
    this.stats = tempStats
      .map((stat: any) => {
        stat.desc = `
          <span>💥 ${
            stat.case ? CommonTool.numberWithSpaces(stat.case) : 0
          }</span>
          <span>❌ ${
            stat.death ? CommonTool.numberWithSpaces(stat.death) : 0
          }</span>
          <span>✅ ${
            stat.recov ? CommonTool.numberWithSpaces(stat.recov) : 0
          }</span>`
        return stat
      })
      .sort((a: IStat, b: IStat) => {
        return b.case - a.case
      })

    if (SocketTool.getInstance().socket) {
      SocketTool.getInstance().socket.sockets.emit('stats updated', {
        stats: this.stats,
      })
    }
  }

  initSocket = (server: any) => {
    SocketTool.getInstance().socket = io(server)
    SocketTool.getInstance().socket.on('connection', async (socket: any) => {
      ++this.userCount

      await this.repository.add({ time: new Date() })

      let visits = await this.repository.getAll()
      let totalCount = 0
      if (CommonTool.isEmpty(visits)) {
        totalCount = 0
      } else {
        totalCount = visits.length
      }

      let message = 'Server: A new user has joined the app'

      socket.emit('user joined', {
        message,
        totalCount,
        userCount: this.userCount,
      })

      socket.emit('stats updated', {
        stats: this.stats,
      })

      socket.broadcast.emit('user joined', {
        message,
        totalCount,
        userCount: this.userCount,
      })

      socket.on('disconnect', async () => {
        --this.userCount
        socket.broadcast.emit('user left', {
          userCount: this.userCount,
          totalCount,
        })
      })
    })
  }
}
