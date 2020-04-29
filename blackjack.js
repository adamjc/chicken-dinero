const Deck = require('./deck.js')

function Blackjack (dealerStandValue = 17) {
  const BLACKJACK = 21
  const DEALER_STAND_VALUE = dealerStandValue
  const states = {
    READY: 0,
    DEAL_PLAYER: 1,
    DEAL_DEALER: 2,
    PLAYER_TURN: 3,
    DEALER_TURN: 4,
    CALCUATE_WINNER: 5
  }

  let state = states.READY
  const deck = new Deck()
  const dealerHand = []
  const player = {
    chips: 100,
    hand: []
  }

  // starts the game
  function wager (amount = 0) {
    if (state !== states.READY) return
    
    state = states.DEAL_PLAYER
  }

  function listActions () {
    switch (state) {
      case states.READY: return [wager]
      case states.PLAYER_TURN: return [hit, stand]
      default: return []
    }
  }

  // do a step
  function step () {
    switch (state) {
      case states.DEAL_PLAYER:
        dealPlayer()
        return
      case states.DEAL_DEALER:
        dealDealer()
        return
    }
  }

  function dealPlayer () {
    if (player.hand.length < 2) {
      const c = deck.take()
      c.turn()
      player.hand.push(c)
    }
    
    if (player.hand.length === 2) {
      state = states.DEAL_DEALER
    }
  }

  function dealDealer () {
    if (!dealerHand.length) {
      const c = deck.take()
      c.turn()
      dealerHand.push(c)
    } else if (dealerHand.length === 1) {
      const c = deck.take()
      dealerHand.push(c)
      state = states.PLAYER_TURN
    }
  }

  function hit () {
    if (state === state.PLAYER_TURN) {
      const c = deck.take()
      c.turn()
      player.hand.push(c)
      
      if (total(player.hand) >= BLACKJACK) {
        state = states.DEALER_TURN
      }
    } else if (state === state.DEALER_TURN) {
      const c = deck.take()
      c.turn()
      dealerHand.push(c)

      if (total(dealerHand) >= DEALER_STAND_VALUE) {
        state = CALCUATE_WINNER
      }
    }
  }

  function stand () {

  }

  const total = cards => cards.reduce((prev, curr) => prev + curr)

  return {
    listActions,
    step,
    dealerHand: () => dealerHand,
    state: () => state,
    player: () => player,
    states
  }
}

module.exports = Blackjack