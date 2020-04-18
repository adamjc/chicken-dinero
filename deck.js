const suits = ['H', 'C', 'D', 'S']
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

function Card (rank, suit) {
  const FACE_DOWN = null
  const FACE_UP = `${rank}${suit}`
  let turned = false

  return {
    value: () => turned ? FACE_UP : FACE_DOWN,
    turn: () => turned = !turned
  }
}

class Deck {
  constructor () {
    this._cards = []

    suits.forEach(suit => {
      ranks.forEach(rank => {
        this._cards.push(new Card(rank, suit))
      })
    })
  }

  get cards () {
    return this._cards
  }

  take () {
    const i = Math.random() * this._cards.length
    const card = this._cards.splice(i, 1)[0]
    return card
  }
}

module.exports = Deck