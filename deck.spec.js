const Deck = require('./deck.js')

describe('Deck', () => {
  let deck

  beforeEach(() => {
    deck = new Deck()
  })

  it('returns a deck of cards', () => {
    const expected = [
      'AH', 'KH', 'QH', 'JH', 'TH', '9H', '8H', '7H', '6H', '5H', '4H', '3H', '2H',
      'AC', 'KC', 'QC', 'JC', 'TC', '9C', '8C', '7C', '6C', '5C', '4C', '3C', '2C',
      'AD', 'KD', 'QD', 'JD', 'TD', '9D', '8D', '7D', '6D', '5D', '4D', '3D', '2D',
      'AS', 'KS', 'QS', 'JS', 'TS', '9S', '8S', '7S', '6S', '5S', '4S', '3S', '2S'
    ]

    deck.cards().forEach((card, i) => {
      card.turn()
      expect(card.value()).toEqual(expected[i])
    })
  })

  it('can give you a random card', () => {
    const card = deck.take()
    card.turn()

    expect(card.value()).toMatch(/[AKQJT98765432][HCDS]/)
    expect(deck.cards().length).toEqual(51)
  })
})