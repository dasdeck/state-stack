
[![circleci-status](https://circleci.com/gh/dasdeck/state-stack/tree/develop.png?style=shield&circle-token=b9eb523df1ac2cba1124e96452aab43a4686d6ac
)](https://circleci.com/gh/dasdeck/state-stack)
[![npm version](https://badge.fury.io/js/state-stack.svg)](https://badge.fury.io/js/state-stack)
[![Coverage Status](https://coveralls.io/repos/github/dasdeck/state-stack/badge.svg)](https://coveralls.io/github/dasdeck/state-stack)
# state-stack
## simple and fast undo/redo function for your web applications

the state-stack offers a simple undo/redo interface to store and restore application states.
This undo/redo method has its limits, but does suffice for simple applications
and is very easy to implement.
Since this idea has been developed around Vue2 and Vuex there are specific packages
for even simpler usage with Vue2

[linktest](https://127.0.0.1:8008)

# download 

...

# api

[documentation](https://hook.io/dasdeck/getartifact/state-stack/index.html)
[(JSDoc)](https://jsdoc.org)

# example



```javascript

import StateStack from 'state-stack'

let history = new StateStack();

let myState = {value:'initial value'};

//tell the history wich state to manage
history.setState(myState);

history.on('changed',()=>{
    //replace your original state after undo/redo
    myState = history.getState();
});



history.startTransaction('change value'); // crates an undo point

myState.value = "new value";

history.undo();

// myState.value === 'initial value'

```


### todo
#### (time traveller / 2.x)

- [ ] rollup setup
- [ ] Browser bin (artifact & git release & doc link)
- [ ] multiple redos (preserve current interface)
- [ ] snapshot that preserve history location
- [ ] objects insead of text
- [ ] translation format
- [ ] group transactions on undo/redo
- [ ] contin. deploy to npm

