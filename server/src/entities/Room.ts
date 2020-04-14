import { Room as IRoom, times } from '@fastpoker/core'
import { Player } from './Player'
import { Card } from './Card'
import { Board } from './Board'

const { Hand } = require('pokersolver')

export function getWinners(communityCards: Card[], players: Player[]): Player[] {
  const communityCardsSolverirzed = communityCards.map(card => card.toSolverValue())
  const hands = players.map(player => {
    return Hand.solve([
      ...communityCardsSolverirzed,
      ...player.hand.map(card => card.toSolverValue()),
    ])
  })
  const winnersHands = Hand.winners(hands)
  return players.filter(player => {
    const hands = player.hand.map(c => c.toSolverValue())
    const winnerHands = winnersHands[0].cards.map((card: any) => card.toString())
    return hands.every(card => winnerHands.includes(card))
  })
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
    Card.randomizeSeed()
    this.players.forEach(player => {
      player.setHand()
      player.isActive = true
      player.checed = false
    })
    this.board.dealerPlayerId = (dealer || this.players[0]).id

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
    this.getCurrentTurnPlayer().bet(toBeAdded)
    this.board.pot += toBeAdded
    this.proceedToNextTurn()
  }

  onCurrentPlayerFold() {
    this.getCurrentTurnPlayer().isActive = false
    this.proceedToNextTurn()
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
          this.board.cards = []
          const winners = getWinners(this.board.cards, this.players)
          winners.forEach(winner => {
            winner.stack += this.board.pot / winners.length
          })
          this.startGame(this.getSmallBlind())
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
        const winners = this.players.filter(p => p.isActive)
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

  private getBoardState(): 'revealNextCard' | 'folded' | 'nextPlayer' {
    const maxBetAmount = this.getCurrentMaximumBet()
    const activePlayers = this.players.filter(player => player.isActive)

    if (activePlayers.length === 1) {
      return 'folded'
    }

    if (
      this.board.cards.length === 0 &&
      this.board.turnPlayerId === this.board.dealerPlayerId &&
      maxBetAmount === this.board.bigBlind
    ) {
      return 'nextPlayer'
    }

    if (
      (maxBetAmount > 0 && activePlayers.every(player => player.betting === maxBetAmount)) ||
      (maxBetAmount === 0 &&
        this.players.filter(player => player.isActive).every(player => player.checed))
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
