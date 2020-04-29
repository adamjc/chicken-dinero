const Blackjack = require('./blackjack.js')

// This test RELIES on each `it` changing the state of the game, time will tell if this is horrendous decision.
// Usually I'd avoid this behaviour at all costs.
describe('Blackjack', () => {
  let game = new Blackjack()

  it('starts in the READY state', () => {
    expect(game.state()).toEqual(game.states.READY)

    const actionNames = game.listActions().map(fn => fn.name)
    expect(actionNames).toEqual(['wager'])
  })

  it('moves to the DEAL_PLAYER state once a wager has been given', () => {
    const wager = game.listActions().filter(fn => fn.name === 'wager')[0] // eeeeeeeh
    wager() // eeeeeeEEEHHHH
    expect(game.state()).toEqual(game.states.DEAL_PLAYER)
  })

  describe('DEAL_PLAYER', () => {
    it('deals the player two cards', () => {
      expect(game.player().hand.length).toEqual(0)
      game.step()
      expect(game.player().hand.length).toEqual(1)
      game.step()
      expect(game.player().hand.length).toEqual(2)
  
      const hand = game.player().hand
  
      const cardSchema = expect.objectContaining({
        value: expect.any(Function),
        turn: expect.any(Function)
      })
  
      hand.forEach(card => {
        expect(card).toEqual(cardSchema)
      })
    })

    it('then moves the game state to DEAL_DEALER', () => {
      expect(game.state()).toEqual(game.states.DEAL_DEALER)
    })
  })
  
  describe('DEAL_DEALER', () => {
    it('deals the dealer two cards', () => {
      expect(game.dealerHand().length).toEqual(0)
      game.step()
      expect(game.dealerHand().length).toEqual(1)
      game.step()
      expect(game.dealerHand().length).toEqual(2)
  
      const hand = game.dealerHand()
  
      const cardSchema = expect.objectContaining({
        value: expect.any(Function),
        turn: expect.any(Function)
      })
  
      hand.forEach(card => {
        expect(card).toEqual(cardSchema)
      })
    })

    it('then moves the game state to PLAYER_TURN', () => {
      expect(game.state()).toEqual(game.states.PLAYER_TURN)
    })
  })
})