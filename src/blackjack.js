const { Deck } = require('./deck.js')

const STATES = {
  READY: 1,
  DEAL_PLAYER: 2,
  DEAL_DEALER: 3,
  PLAYER_TURN: 4,
  DEALER_TURN: 5,
  CALCULATE_WINNER: 6
}

function Blackjack (dealerStandValue = 17, session = {}) {
  const BLACKJACK = 21
  const DEALER_STAND_VALUE = dealerStandValue

  let state = session.state || STATES.READY
  const deck = session.deck || new Deck()
  const dealerHand = session.dealerHand || []
  const player = session.player || { hand: [], chips: 100, wagered: 0 }

  // starts the game
  function wager (amount = 0) {
    if (amount > player.chips) return

    player.wagered = amount
    player.chips -= amount

    state = STATES.DEAL_PLAYER
  }

  function listActions () {
    switch (state) {
      case STATES.READY: return [wager]
      case STATES.PLAYER_TURN: return [hit, stand]
      default: return []
    }
  }

  // do a step
  function step () {
    switch (state) {
      case STATES.DEAL_PLAYER:
        dealPlayer()
        return
      case STATES.DEAL_DEALER:
        dealDealer()
        return
      case STATES.DEALER_TURN:
        hit()
        return
      case STATES.CALCULATE_WINNER:
        calculateWinner()
    }
  }

  function dealCard(hand, faceUp = true) {
    let c = deck.take()
    if (faceUp) c.turn()
    hand.push(c)
  }

  function dealPlayer () {
    if (player.hand.length < 2) {
      dealCard(player.hand)
    }

    if (player.hand.length === 2) {
      state = total(player.hand) === BLACKJACK 
        ? STATES.CALCULATE_WINNER
        : STATES.DEAL_DEALER
    }
  }

  function dealDealer () {
    if (!dealerHand.length) {
      dealCard(dealerHand)
    } else if (dealerHand.length === 1) {
      dealCard(dealerHand, false)
      state = STATES.PLAYER_TURN
    }
  }

  function hit () {
    if (state === STATES.PLAYER_TURN) {
      dealCard(player.hand)
      const playerTotal = total(player.hand)

      if (playerTotal === BLACKJACK) {
        state = STATES.DEALER_TURN
      } else if (playerTotal > BLACKJACK) {
        state = STATES.CALCULATE_WINNER
      }
    } else if (state === STATES.DEALER_TURN) {
      dealCard(dealerHand)

      if (total(dealerHand) >= DEALER_STAND_VALUE) {
        state = STATES.CALCULATE_WINNER
      }
    }
  }

  const stand = () => state = STATES.DEALER_TURN

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

  function calculateWinner() {
    const playerTotal = total(player.hand)
    const dealerTotal = total(dealerHand)
    
    const playerWin = (playerTotal > dealerTotal && playerTotal <= BLACKJACK) || dealerTotal > BLACKJACK
    const playerDraw = playerTotal === dealerTotal
    
    if (playerWin) {
      player.chips += (player.wagered * 2)
    } else if (playerDraw) {
      player.chips += player.wagered
    }

    state = STATES.READY
  }

  return {
    listActions,
    step,
    dealerHand: () => dealerHand,
    state: () => state,
    player: () => player
  }
}

module.exports = {
  Engine: Blackjack,
  STATES
}