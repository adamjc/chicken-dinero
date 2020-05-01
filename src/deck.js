const suits = ['H', 'C', 'D', 'S']
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

function Card (rank, suit, faceUp = false) {
  const FACE_DOWN = null
  const FACE_UP = {
    rank,
    suit
  }

  let turned = faceUp

  return {
    getDetails: () => turned ? FACE_UP : FACE_DOWN,
    toString: () => turned ? `${rank}${suit}` : '',
    turn: () => turned = !turned
  }
}

function Deck () {
  let cards = []

  suits.forEach(suit => {
    ranks.forEach(rank => {
      cards.push(new Card(rank, suit))
    })
  })

  function take () {
    const i = Math.random() * cards.length
    const card = cards.splice(i, 1)[0]
    return card
  }

  return {
    cards: () => cards,
    take
  }
}

module.exports = {
  Deck,
  Card
}