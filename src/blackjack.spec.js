const { Engine: Blackjack, STATES } = require('./blackjack.js')
const { Deck } = require('./deck.js')
const { Card } = jest.requireActual('./deck.js')

jest.mock('./deck.js')
Deck.mockImplementation(() => {
  return {
    take: () => new Card('2', 'S')
  }
})

describe('Blackjack', () => {
  let game

  describe('READY', () => {
    beforeEach(() => {
      game = new Blackjack()
    })

    it('starts in the READY state', () => {
      expect(game.state()).toEqual(STATES.READY)
    })
  
    it(`only has 'wager' as an action`, () => {
      const actionNames = game.listActions().map(fn => fn.name)

      expect(actionNames).toEqual(['wager'])
    })

    it('moves to the DEAL_PLAYER state once a wager has been given', () => {
      const wager = game.listActions().filter(fn => fn.name === 'wager')[0] // eeeeeeeh
      wager() // eeeeeeEEEHHHH
      expect(game.state()).toEqual(STATES.DEAL_PLAYER)
    })
  })

  describe('DEAL_PLAYER', () => {
    beforeEach(() => {
      game = new Blackjack(17, { state: STATES.DEAL_PLAYER })
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

      expect(game.state()).toEqual(STATES.DEAL_DEALER)
    })
  })
  
  describe('DEAL_DEALER', () => {
    beforeEach(() => {
      game = new Blackjack(17, { state: STATES.DEAL_DEALER })
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

      expect(game.state()).toEqual(STATES.PLAYER_TURN)
    })
  })

  describe('PLAYER_TURN', () => {
    let game

    beforeEach(() => {
      game = new Blackjack(17, { state: STATES.PLAYER_TURN })
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
        beforeEach(() => {
          game = new Blackjack(17, {
            state: STATES.PLAYER_TURN,
            player: { 
              hand: [
                new Card('6', 'S', true),
                new Card('A', 'H', true)
              ] 
            }
          })

          const hit = game.listActions().filter(fn => fn.name === 'hit')[0] // eeeeeeeh
          hit() // eeeeeeEEEHHHH
        })
  
        it(`should add a card to the player's hand`, () => {
          expect(game.player().hand.length).toEqual(3)
        })

        it('should still be in the PLAYER_TURN state', () => {
          expect(game.state()).toEqual(STATES.PLAYER_TURN)
        })
      })

      describe('exactly 21', () => {
        beforeEach(() => {
          game = new Blackjack(17, {
            state: STATES.PLAYER_TURN,
            player: { 
              hand: [
                new Card('T', 'D', true),
                new Card('9', 'S', true)
              ]
            }
          })
  
          const hit = game.listActions().filter(fn => fn.name === 'hit')[0] // eeeeeeeh
          hit() // eeeeeeEEEHHHH
        })
  
        it(`should add a card to the player's hand`, () => {
          expect(game.player().hand.length).toEqual(3)
        })
  
        it('should move to the DEALER_TURN state', () => {
          expect(game.state()).toEqual(STATES.DEALER_TURN)
        })
      })

      describe('over 21', () => {
        beforeEach(() => {
          game = new Blackjack(17, {
            state: STATES.PLAYER_TURN,
            player: { 
              hand: [
                new Card('J', 'D', true),
                new Card('T', 'S', true),
              ]
            }
          })
  
          const hit = game.listActions().filter(fn => fn.name === 'hit')[0] // eeeeeeeh
          hit() // eeeeeeEEEHHHH
        })
  
        it(`should add a card to the player's hand`, () => {
          expect(game.player().hand.length).toEqual(3)
        })
  
        it('should move to the CALCULATE_WINNER state', () => {
          expect(game.state()).toEqual(STATES.CALCULATE_WINNER)
        })
      })
    })

    describe('stand', () => {
      beforeEach(() => {
        game = new Blackjack(17, {
          state: STATES.PLAYER_TURN,
          player: { 
            hand: [
              new Card('6', 'S', true),
              new Card('A', 'H', true)
            ]
          }
        })

        const stand = game.listActions().filter(fn => fn.name === 'stand')[0] // eeeeeeeh
        stand() // eeeeeeEEEHHHH
      })

      it('should be move to the DEALER_TURN state', () => {
        expect(game.state()).toEqual(STATES.DEALER_TURN)
      })
    })
  })

  describe('DEALER_TURN', () => {
    describe('hitting and being below the dealer stand value', () => {
      beforeEach(() => {
        game = new Blackjack(17, {
          state: STATES.DEALER_TURN,
          dealerHand: [
            new Card('2', 'S', true),
            new Card('3', 'S', true),
          ]
        })
      })

      it('should stay in DEALER_TURN', () => {
        game.step()
        expect(game.state()).toEqual(STATES.DEALER_TURN)
      })
    })

    describe('hitting the dealer stand value', () => {
      beforeEach(() => {
        game = new Blackjack(17, {
          state: STATES.DEALER_TURN,
          dealerHand: [
            new Card('A', 'S', true),
            new Card('8', 'S', true),
          ]
        })
      })

      it('should move to CALCULATE_WINNER', () => {
        game.step()
        expect(game.state()).toEqual(STATES.CALCULATE_WINNER)
      })
    })
  })

  describe('CALCULATE_WINNER', () => {
    const initialChips = 90
    const initialWager = 10

    describe('player winning', () => {
      beforeEach(() => {
        game = new Blackjack(17, {
          state: STATES.CALCULATE_WINNER,
          player: {
            hand: [
              new Card('A', 'S', true),
              new Card('T', 'S', true),
            ],
            chips: initialChips,
            wagered: initialWager
          },
          dealerHand: [
            new Card('J', 'S', true),
            new Card('J', 'C', true),
            new Card('5', 'H', true),
          ]
        })

        game.step()
      })

      it(`should add twice the wagered chips to the player's chips`, () => {
        expect(game.player().chips).toEqual(initialChips + (initialWager * 2))
      })

      it('should move to the READY state', () => {
        expect(game.state()).toEqual(STATES.READY)
      })
    })

    describe('player losing', () => {
      beforeEach(() => {
        game = new Blackjack(17, {
          state: STATES.CALCULATE_WINNER,
          player: {
            hand: [
              new Card('J', 'S', true),
              new Card('J', 'C', true),
              new Card('5', 'C', true),
            ],
            chips: initialChips,
            wagered: initialWager
          },
          dealerHand: [
            new Card('J', 'S', true),
            new Card('7', 'C', true),
          ]
        })

        game.step()
      })

      it(`should keep the player's chips as the initialChip value`, () => {
        expect(game.player().chips).toEqual(initialChips)
      })

      it('should move to the READY state', () => {
        expect(game.state()).toEqual(STATES.READY)
      })
    })
  })
})
