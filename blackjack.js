const { Deck } = require('./deck.js')

function Blackjack (dealerStandValue = 17, session = {}) {
  const BLACKJACK = 21
  const DEALER_STAND_VALUE = dealerStandValue
  const states = {
    READY: 0,
    DEAL_PLAYER: 1,
    DEAL_DEALER: 2,
    PLAYER_TURN: 3,
    DEALER_TURN: 4,
    CALCULATE_WINNER: 5
  }

  let state = session.state || states.READY
  const deck = session.deck || new Deck()
  const dealerHand = session.dealerHand || []
  const player = session.player || { hand: [] }

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
      case states.DEALER_TURN:
        hit()
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
      if (total(player.hand) === BLACKJACK) {
        state = states.CALCULATE_WINNER
      } else {
        state = states.DEAL_DEALER
      }
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
    if (state === states.PLAYER_TURN) {
      const c = deck.take()
      c.turn()
      player.hand.push(c)
      
      if (total(player.hand) === BLACKJACK) {
        state = states.DEALER_TURN
      } else if (total(player.hand) > BLACKJACK) {
        state = states.CALCULATE_WINNER
      }
    } else if (state === states.DEALER_TURN) {
      const c = deck.take()
      c.turn()
      dealerHand.push(c)

      if (total(dealerHand) >= DEALER_STAND_VALUE) {
        state = states.CALCULATE_WINNER
      }
    }
  }

  function stand () {
    state = states.DEALER_TURN
  }

  function total (cards) {
    let nonAcesValue = cards.filter(card => card.value().rank !== 'A')
                            .reduce((acc, card) => acc + cardValue(card), 0)

    const aces = cards.filter(card => card.value().rank === 'A')

    return aces.reduce((acc, ace, i, a) => {
      const acesLeft = a.length - (i + 1)
      if (acc + cardValue(ace) + acesLeft > 21) {
        return acc + 1
      } else {
        return acc + cardValue(ace)
      }
    }, nonAcesValue)
  }

  function cardValue (card) {
    if (Number(card.value().rank) <= 9) {
      return Number(card.value().rank)
    } else if (card.value().rank === 'A') {
      return 11
    } else {
      return 10
    }
  }

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