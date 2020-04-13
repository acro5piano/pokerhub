import { Room } from '../entities'

export class Repository {
  rooms: Room[] = []

  existsRoom(roomId: string): boolean {
    return Boolean(this.rooms.find(r => r.id === roomId))
  }

  findRoom(roomId: string): Room {
    const room = this.rooms.find(r => r.id === roomId)
    if (!room) {
      throw new Error('rooms is missing')
    }
    return room
  }

  findOrCreateRoom(roomId: string): Room {
    if (this.existsRoom(roomId)) {
      return this.findRoom(roomId)
    }
    const newRoom = new Room(roomId)
    this.rooms.push(newRoom)
    return newRoom
  }

  serialize() {
    return this.rooms.map(r => r.serialize())
  }
}

export const repository = new Repository()
