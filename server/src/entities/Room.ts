import { Room as IRoom, times } from '@pokerhub/core'
import { Player } from './Player'
import { Card } from './Card'
import { Board } from './Board'

const { Hand } = require('pokersolver')

export function getWinners(communityCards: Card[], players: Player[]): Player[] {
  const communityCardsSolverirzed = communityCards.map(card => card.toSolverValue())
  const hands = players.map(player => {
    const hand = Hand.solve([
      ...communityCardsSolverirzed,
      ...player.hand.map(card => card.toSolverValue()),
    ])
    hand.__ID = player.id
    return hand
  })
  const winnersIDs = Hand.winners(hands).map((hand: any) => hand.__ID)
  return players.filter(player => winnersIDs.includes(player.id))
}

export class Room implements IRoom {
  id: string
  players: Player[] = []
  board = new Board()
  isGameStarted = false

  constructor(roomId: string) {
    this.id = roomId
  }

  serialize() {
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
    Card.randomizeSeed()
    this.players.forEach(player => {
      player.setHand()
      if (player.isDead) {
        player.isActive = false
      } else {
        player.isActive = true
      }
      player.checed = false
    })
    this.board.dealerPlayerId = (dealer || this.players[0]).id
    this.board.showDown = false
    this.board.cards = []

    const { bigBlind } = this.board
    this.board.pot = bigBlind * 1.5

    if (this.players.length === 2) {
      this.getDealer().bet(bigBlind / 2)
      this.getSmallBlind().bet(bigBlind)
      this.board.turnPlayerId = this.getDealer().id
    } else {
      this.getSmallBlind().bet(bigBlind / 2)
      const bigBlindPlayer = this.getBigBlind()
      bigBlindPlayer.bet(bigBlind)
      const underTheGun = this.getAdjacentPlayer(bigBlindPlayer, 1)
      this.board.turnPlayerId = underTheGun.id
    }
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
    if (toBeAdded > this.getCurrentTurnPlayer().stack) {
      this.getCurrentTurnPlayer().bet(this.getCurrentTurnPlayer().stack)
    } else {
      this.getCurrentTurnPlayer().bet(toBeAdded)
    }
    this.board.pot += toBeAdded
    this.proceedToNextTurn()
  }

  onCurrentPlayerFold() {
    this.getCurrentTurnPlayer().isActive = false
    this.proceedToNextTurn()
  }

  calculateShowDownResult() {
    const winners = getWinners(this.board.cards, this.getActivePlayers())
    const losers = this.getActivePlayers().filter(
      player => !Boolean(winners.find(w => w.id === player.id)),
    )
    winners.forEach(winner => {
      winner.stack += this.board.pot / winners.length
    })
    losers.forEach(loser => {
      if (loser.stack === 0) {
        loser.isDead = true
      }
    })
    if (this.getActivePlayers().length > 1) {
      this.startGame(this.getSmallBlind())
    } else {
      this.board.pot = 0
    }
  }

  private proceedToNextTurn() {
    switch (this.getBoardState()) {
      case 'revealNextCard': {
        this.players.forEach(player => {
          player.betting = 0
          player.checed = false
        })
        this.board.turnPlayerId = this.getNextTurnPlayer(this.getDealer()).id
        if (this.board.cards.length === 0) {
          times(3, () => this.board.openCard())
        } else if (this.board.cards.length < 5) {
          this.board.openCard()
        } else {
          if (this.board.showDown) {
            throw new Error('already show down!')
          }
          this.board.showDown = true // SHOW DOWN!!
        }
        return
      }
      case 'folded': {
        this.players.forEach(player => {
          player.betting = 0
          player.checed = false
        })
        this.board.turnPlayerId = this.getNextTurnPlayer(this.getDealer()).id
        this.board.cards = []
        const winners = this.getActivePlayers()
        const winner = winners[0]
        if (!winner) {
          throw new Error('there is no winner, this is a bug')
        }
        if (winners.length > 1) {
          throw new Error('there are more than two winner, but state is "folded". this is a bug')
        }
        winner.stack += this.board.pot
        this.startGame(this.getSmallBlind())
        return
      }
      case 'nextPlayer': {
        this.board.turnPlayerId = this.getNextTurnPlayer().id
        return
      }
    }
  }

  private getActivePlayers() {
    return this.players.filter(player => player.canHasTurn())
  }

  private getBoardState(): 'revealNextCard' | 'folded' | 'nextPlayer' {
    const maxBetAmount = this.getCurrentMaximumBet()

    if (this.getActivePlayers().length === 1) {
      return 'folded'
    }

    if (
      maxBetAmount === this.board.bigBlind &&
      this.board.cards.length === 0 &&
      (this.board.turnPlayerId === this.board.dealerPlayerId ||
        (this.getActivePlayers().length > 2 && this.board.turnPlayerId === this.getSmallBlind().id))
    ) {
      return 'nextPlayer'
    }

    if (
      (maxBetAmount > 0 &&
        this.getActivePlayers().every(player => player.betting === maxBetAmount)) ||
      (maxBetAmount === 0 && this.getActivePlayers().every(player => player.checed))
    ) {
      return 'revealNextCard'
    }

    return 'nextPlayer'
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
    if (!nextPlayer.canHasTurn()) {
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
