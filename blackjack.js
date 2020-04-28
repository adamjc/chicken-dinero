const Deck = require('./deck.js')

function Blackjack () {
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
      case states.READY: return [wager.name]
      case states.DEAL_PLAYER: return []
      case state.DEAL_DEALER: return []
      case states.PLAYER_TURN: return [hit.name, stand.name]
      case states.DEALER_TURN: return []
      case states.CALCULATE_WINNER: return []
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
    } else {
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
    } else {
      state = states.PLAYER_TURN
    }
  }

  function hit () {

  }

  function stand () {

  }

  return {
    listActions,
    wager,
    hit,
    stand,
    step,
    dealerHand: () => dealerHand,
    state: () => state,
    player: () => player,
    states
  }
}

module.exports = Blackjack