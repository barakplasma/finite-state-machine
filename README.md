[![Build Status](https://travis-ci.org/barakplasma/finite-state-machine.svg?branch=master)](https://travis-ci.org/barakplasma/finite-state-machine.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/barakplasma/finite-state-machine/badge.svg?branch=master)](https://coveralls.io/github/barakplasma/finite-state-machine?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Finite State Machine
Tiny finite state machine library for fun and profit.
See the tests for more usage examples.

## Using this module in other modules

Here is a quick example of how this module can be used in other modules. The [TypeScript Module Resolution Logic](https://www.typescriptlang.org/docs/handbook/module-resolution.html) makes it quite easy. The file `src/index.ts` is a [barrel](https://basarat.gitbooks.io/typescript/content/docs/tips/barrel.html) that re-exports selected exports from other files. The _package.json_ file contains `main` attribute that points to the generated `lib/index.js` file and `typings` attribute that points to the generated `lib/index.d.ts` file.

- To use the `FSM` class in a TypeScript file -

```ts
import { FSM } from "@barakplasma/finite-state-machine";

const anFSM = new FSM();

anFSM.addState('on');
anFSM.addState('off');

anFSM.on({ inputName: 'toggle' }, () => {
    return new Map([['on', 'off'], ['off', 'on']]);
});

const { dispatch } = anFSM;

dispatch({ inputName: 'toggle' });

anFSM.getCurrentState() // 'off'
```

- To use the `FSM` class in a JavaScript file -

```js
const FSM = require('@barakplasma/finite-state-machine').FSM;

const anFSM = new FSM();

anFSM.addState('on');
anFSM.addState('off');

anFSM.on({ inputName: 'toggle' }, () => {
    return new Map([['on', 'off'], ['off', 'on']]);
});

const { dispatch } = anFSM;

dispatch({ inputName: 'toggle' });

anFSM.getCurrentState() // 'off'
```

# finite-state-machine
