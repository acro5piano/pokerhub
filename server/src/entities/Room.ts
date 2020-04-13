import { Room as IRoom } from '@fastpoker/core'
import { Player } from './Player'
import { Card } from './Card'
import { Board } from './Board'

export class Room implements IRoom {
  id: string
  players: Player[] = []
  board = new Board()

  isGameStarted = false

  constructor(roomId: string) {
    this.id = roomId
  }

  serialize() {
    this.board.cards[0]
    return {
      ...this,
      players: this.players.map(p => p.serialize()),
      board: this.board.serialize(),
    }
  }

  findOrCreatePlayer(playerId: string): Player {
    if (this.existsPlayer(playerId)) {
      return this.findPlayer(playerId)
    }
    const newPlayer = new Player(playerId, this.players.length)
    this.players.push(newPlayer)
    return newPlayer
  }

  startGame(dealer?: Player): void {
    this.players.forEach(player => {
      player.setHand()
      player.isActive = true
      player.checed = false
    })
    this.board.dealerPlayerId = (dealer || this.players[0]).id

    const { bigBlind } = this.board
    this.board.pot = bigBlind * 1.5

    const smallBlindPlayer = this.getSmallBlind()
    smallBlindPlayer.bet(bigBlind / 2)

    const bigBlindPlayer = this.getBigBlind()
    bigBlindPlayer.bet(bigBlind)

    const underTheGun = this.getAdjacentPlayer(bigBlindPlayer, 1)
    this.board.turnPlayerId = underTheGun.id
    this.isGameStarted = true
  }

  onCurrentPlayerBet(amount: number) {
    this.board.pot += amount
    this.getCurrentTurnPlayer().bet(amount)
    this.proceedToNextTurn()
  }

  onCurrentPlayerCheck() {
    this.getCurrentTurnPlayer().checed = true
    this.proceedToNextTurn()
  }

  getCurrentMaximumBet() {
    const bets = this.players.map(player => player.betting)
    return Math.max(...bets)
  }

  onCurrentPlayerCall() {
    const toBeAdded = this.getCurrentMaximumBet() - this.getCurrentTurnPlayer().betting
    this.getCurrentTurnPlayer().bet(toBeAdded)
    this.board.pot += toBeAdded
    this.proceedToNextTurn()
  }

  onCurrentPlayerFold() {
    this.getCurrentTurnPlayer().isActive = false
    this.proceedToNextTurn()
  }

  private proceedToNextTurn() {
    if (this.shouldRevealCard()) {
      this.players.forEach(player => {
        player.betting = 0
        player.checed = false
      })
      this.board.turnPlayerId = this.getNextTurnPlayer(this.getDealer()).id
      if (this.board.cards.length === 0) {
        this.board.cards = [new Card(), new Card(), new Card()]
      } else if (this.board.cards.length < 5) {
        this.board.cards.push(new Card())
      } else {
        this.board.cards = []
        const winners = this.players.slice(0, 1) // TODO
        winners.forEach(winner => {
          winner.stack += this.board.pot / winners.length
        })
        this.startGame(this.getSmallBlind())
        // this.players.forEach(player => {
        //   player.setHand()
        //   player.isActive = true
        // })
        // this.board.dealerPlayerId = this.getSmallBlind().id
        // this.board.turnPlayerId = this.getNextTurnPlayer(this.getSmallBlind()).id
        // this.board.pot = 0
      }
    } else {
      this.board.turnPlayerId = this.getNextTurnPlayer().id
    }
  }

  private shouldRevealCard() {
    const maxBetAmount = this.getCurrentMaximumBet()

    return (
      (maxBetAmount > 0 &&
        this.players
          .filter(player => player.isActive)
          .every(player => player.betting === maxBetAmount)) ||
      (maxBetAmount === 0 &&
        this.players.filter(player => player.isActive).every(player => player.checed))
    )
  }

  private getDealer(): Player {
    return this.findPlayer(this.board.dealerPlayerId)
  }

  private getSmallBlind(): Player {
    return this.getAdjacentPlayer(this.getDealer(), 1)
  }

  private getBigBlind(): Player {
    return this.getAdjacentPlayer(this.getDealer(), 2)
  }

  private getAdjacentPlayer(targetPlayer: Player, by: number) {
    const position = (targetPlayer.position + by) % this.players.length
    const player = this.players.find(p => p.position === position)
    if (!player) {
      throw new Error('Adjacent player not found, this is a bug')
    }
    return player
  }

  private getCurrentTurnPlayer() {
    return this.findPlayer(this.board.turnPlayerId)
  }

  private getNextTurnPlayer(player?: Player): Player {
    const targetPlayer = player || this.getCurrentTurnPlayer()
    const nextPlayer = this.getAdjacentPlayer(targetPlayer, 1)
    if (!nextPlayer) {
      throw new Error('Logic error: there is only 0 or 1 active player')
    }
    if (!nextPlayer.isActive) {
      return this.getNextTurnPlayer(nextPlayer)
    }
    return nextPlayer
  }

  private existsPlayer(playerId: string): boolean {
    return Boolean(this.players.find(p => p.id === playerId))
  }

  private findPlayer(playerId: string): Player {
    const player = this.players.find(p => p.id === playerId)
    if (!player) {
      throw new Error('player is missing')
    }
    return player
  }
}
