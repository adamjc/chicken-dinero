# Chicken Dinero

blackjack 'engine' written in js, for fun

## Usage

It's a state machine, so at any point you are given a list of actions you can take, and then you can 'step' through them.

The states are given in a `STATES` object (emulating an enum)

To get a list of the possible states (for use in finding out what to present to the client):
```javascript
const STATES = require('chicken-dinero').STATES 

// STATES = {
//   READY: 1,
//   DEAL_PLAYER: 2,
//   DEAL_DEALER: 3,
//   PLAYER_TURN: 4,
//   DEALER_TURN: 5,
//   CALCULATE_WINNER: 6
// }
```

To get the game started:
```javascript
const blackjack = require('chicken-dinero').Engine

const game = blackjack()

const player = game.getPlayer() // { chips: 100, hand: [], wagered: 0 }

game.getActions().wager(10) // wager 10 chips
game.stepUntilChange()
game.stepUntilChange()
console.log(game.getPlayer().hand[0].toString(), game.getPlayer().hand[1].toString()) // e.g 'AS', '6H' 

```

## API

### Engine

Because the engine is a state machine, and it is not functional (i.e. it does not give you back a new state machine object upon every invocation of a method), many of these methods return 'undefined', and instead change the state of the engine.

### getActions
`() => { k: v }`

Returns an object of all possible actions that the player can take

```javascript
game.getActions() // -> { wager: function () { ... }}
```

### step
`() => undefined`

Steps the state machine forward in time. If there is a new STATE to move to, it will move to that new state

The use of this, for example, is in `DEAL_PLAYER`, you may wish to animate each card being drawn onto the screen, `DEAL_PLAYER` consists of two steps (deal the first card, then deal the second card).

```javascript
game.getActions().wager(10)
game.step()
console.log(game.getPlayer().hand.length) // 1
game.step()
console.log(game.getPlayer().hand.length) // 2
```

### stepUntilChange
`() => undefined`

As step, but will do all steps until the next state change

If it is possible to move from one state to the next, this will loop through the state machine until a new state is achieved. If it is not possible (e.g. it is in `PLAYER_TURN`, waiting for a player action), then it will stay in the initial state.

```javascript
game.getActions()wager(10)
game.stepUntilChange()
console.log(game.getPlayer().hand.length) // 2
```

### getDealerHand
`() => [<Card>]`

Returns a list of Cards the dealer holds

```javascript
game.getActions().wager(10)
console.log(game.getDealerHand().length) // 0
game.stepUntilChange() // deal the player hand
game.stepUntilChange() // deal the dealer hand
console.log(game.getDealerHand().length) // 2
```

### getState
`() => <Number>`

returns the current state of the game, you can match this against the STATES enum provided

```javascript
const { Engine: blackjack, STATES } = require('chicken-dinero')
const game = new blackjack()
game.getState === STATES.READY // true
game.getActions().wager(10)
game.getState() === STATES.DEAL_DEALER // true
```

### getPlayer
`() => { hand: [<Card>], chips: <Number>, wagered: <Number> }`

Returns the player object