const Blackjack = require('./blackjack.js')
const { Deck } = require('./deck.js')
jest.mock('./deck.js')
Deck.mockImplementation(() => {
  return {
    take: () => new Card('2', 'H')
  }
})
const { Card } = jest.requireActual('./deck.js')

describe('Blackjack', () => {
  describe('READY', () => {
    let game

    beforeEach(() => {
      game = new Blackjack()
    })

    it('starts in the READY state', () => {
      expect(game.state()).toEqual(game.states.READY)
    })
  
    it(`only has 'wager' as an action`, () => {
      const actionNames = game.listActions().map(fn => fn.name)

      expect(actionNames).toEqual(['wager'])
    })

    it('moves to the DEAL_PLAYER state once a wager has been given', () => {
      const wager = game.listActions().filter(fn => fn.name === 'wager')[0] // eeeeeeeh
      wager() // eeeeeeEEEHHHH
      expect(game.state()).toEqual(game.states.DEAL_PLAYER)
    })
  })

  describe('DEAL_PLAYER', () => {
    let game

    beforeEach(() => {
      game = new Blackjack(17, { state: 1 })
    })

    it('deals the player two cards', () => {
      expect(game.player().hand.length).toEqual(0)
      game.step()
      expect(game.player().hand.length).toEqual(1)
      game.step()
      expect(game.player().hand.length).toEqual(2)
    })

    it('after dealing the player 2 cards, moves the game state to DEAL_DEALER', () => {
      game.step()
      game.step()

      expect(game.state()).toEqual(game.states.DEAL_DEALER)
    })
  })
  
  describe('DEAL_DEALER', () => {
    let game

    beforeEach(() => {
      const deck = new Deck()
      cards = new Array(2).fill(deck.take())

      game = new Blackjack(17, {
        state: 2,
        player: { hand: cards }
      })
    })

    it('deals the dealer two cards', () => {
      expect(game.dealerHand().length).toEqual(0)
      game.step()
      expect(game.dealerHand().length).toEqual(1)
      game.step()
      expect(game.dealerHand().length).toEqual(2)
    })

    it('after dealing the dealer 2 cards, then moves the game state to PLAYER_TURN', () => {
      game.step()
      game.step()

      expect(game.state()).toEqual(game.states.PLAYER_TURN)
    })
  })

  describe('PLAYER_TURN', () => {
    let game

    beforeEach(() => {
      const deck = new Deck()
      cards = new Array(2).fill(deck.take())

      game = new Blackjack(17, {
        state: 3,
        player: { hand: cards },
        dealerHand: cards
      })
    })

    it(`should let the player 'hit' or 'stand'`, () => {
      const expectedActions = expect.arrayContaining([
        expect.any(Function),
        expect.any(Function),
      ])
      const actualActions = game.listActions()
      const actualActionNames = actualActions.map(fn => fn.name)
      expect(actualActions).toEqual(expectedActions)
      expect(actualActionNames).toEqual(['hit', 'stand'])
    })

    describe('hit', () => {
      describe('below 21', () => {
        Deck.mockImplementation(() => {
          return {
            take: () => new Card('A', 'S')
          }
        })

        let game

        beforeEach(() => {
          cards = [
            new Card('6', 'S', true),
            new Card('A', 'H', true),
          ]
    
          game = new Blackjack(17, {
            state: 3,
            player: { 
              hand: cards
            },
            dealerHand: cards
          })

          const hit = game.listActions().filter(fn => fn.name === 'hit')[0] // eeeeeeeh
          hit() // eeeeeeEEEHHHH
        })
  
        it(`should add a card to the player's hand`, () => {
          expect(game.player().hand.length).toEqual(3)
        })

        it('should still be in the PLAYER_TURN state', () => {
          expect(game.state()).toEqual(game.states.PLAYER_TURN)
        })
      })

      describe('exactly 21', () => {
        Deck.mockImplementation(() => {
          return {
            take: () => new Card('A', 'S')
          }
        })
  
        let game
  
        beforeEach(() => {
          game = new Blackjack(17, {
            state: 3,
            player: { 
              hand: [
                new Card('5', 'D', true),
                new Card('5', 'S', true),
              ]
            },
            dealerHand: cards
          })
  
          const hit = game.listActions().filter(fn => fn.name === 'hit')[0] // eeeeeeeh
          hit() // eeeeeeEEEHHHH
        })
  
        it(`should add a card to the player's hand`, () => {
          expect(game.player().hand.length).toEqual(3)
        })
  
        it('should be in the DEALER_TURN state', () => {
          expect(game.state()).toEqual(game.states.DEALER_TURN)
        })
      })

      describe('over 21', () => {
        let game

        beforeAll(() => {
          Deck.mockImplementation(() => {
            return {
              take: () => new Card('2', 'S')
            }
          })
        })
  
        beforeEach(() => {
          game = new Blackjack(17, {
            state: 3,
            player: { 
              hand: [
                new Card('J', 'D', true),
                new Card('T', 'S', true),
              ]
            },
            dealerHand: cards
          })
  
          const hit = game.listActions().filter(fn => fn.name === 'hit')[0] // eeeeeeeh
          hit() // eeeeeeEEEHHHH
        })

        afterAll(() => {
          mockFn.mockReset()
        })
  
        it(`should add a card to the player's hand`, () => {
          expect(game.player().hand.length).toEqual(3)
        })
  
        it('should be in the CALCULATE_WINNER state', () => {
          expect(game.state()).toEqual(game.states.CALCULATE_WINNER)
        })
      })
    })
  })
})
