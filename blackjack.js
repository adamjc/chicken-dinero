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
  const player = {
    chips: 100,
    hand: []
  }

  // starts the game
  function wager (amount = 0) {
    // subtract amount from player, add to their 'wagered' amount in some way
    state = states.DEAL_PLAYER
  }

  function listActions () {
    switch (state) {
      case states.READY: return ['wager']
      case states.DEAL_PLAYER: return []
      case state.DEAL_DEALER: return []
      case states.PLAYER_TURN: return ['hit', 'stand']
      case states.DEALER_TURN: return []
      case states.CALCULATE_WINNER: return []
    }
  }

  // do a step
  function step () {

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
    state: () => state,
    states
  }
}

module.exports = Blackjack