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

  function getActions () {
    switch (state) {
      case STATES.READY: return { wager }
      case STATES.PLAYER_TURN: return { hit, stand }
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

  function stepUntilChange () {
    const statesWithMultipleSteps = [STATES.DEAL_PLAYER, STATES.DEAL_DEALER, STATES.DEALER_TURN, STATES.CALCULATE_WINNER]
    if (statesWithMultipleSteps.includes(state)) {
      const initialState = state

      while (initialState === state) {
        step()
      }
    } else {
      step()
    }
  }

  function dealCard(hand, faceUp = true) {
    let card = deck.take()
    if (faceUp) card.turn()
    hand.push(card)
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
    let faceDownCards = cards.filter(card => card.getDetails() === null)
    faceDownCards.forEach(card => card.turn())

    let nonAceValues = cards.filter(card => card.getDetails().rank !== 'A')
                            .reduce((acc, card) => acc + cardValue(card), 0)

    const aces = cards.filter(card => card.getDetails().rank === 'A')

    faceDownCards.forEach(card => card.turn())

    return aces.reduce((runningTotal, ace, i, a) => {
      const acesLeft = a.length - (i + 1)

      if (runningTotal + cardValue(ace) + acesLeft > 21) {
        return runningTotal + 1
      } else {
        return runningTotal + cardValue(ace)
      }
    }, nonAceValues)
  }

  function cardValue (card) {
    const cardRank = card.getDetails().rank
    if (Number(cardRank) <= 9) {
      return Number(cardRank)
    } else if (cardRank === 'A') {
      return 11
    } else {
      return 10
    }
  }

  function calculateWinner() {
    const playerTotal = total(player.hand)
    const dealerTotal = total(dealerHand)
    
    const playerHasWon = (playerTotal > dealerTotal && playerTotal <= BLACKJACK) || dealerTotal > BLACKJACK
    const playerHasDrawn = playerTotal === dealerTotal
    
    if (playerHasWon) {
      player.chips += (player.wagered * 2)
    } else if (playerHasDrawn) {
      player.chips += player.wagered
    }

    state = STATES.READY
  }

  return {
    getActions,
    step,
    stepUntilChange,
    getDealerHand: () => dealerHand,
    getState: () => state,
    getPlayer: () => player
  }
}

module.exports = {
  Engine: Blackjack,
  STATES
}