<a name="StateStack"></a>

## StateStack
state based undo/redo class

**Kind**: global class  

* [StateStack](#StateStack)
    * [new StateStack([state])](#new_StateStack_new)
    * [.getState()](#StateStack+getState) ⇒ <code>object</code>
    * [.setState(state)](#StateStack+setState)
    * [.canRedo()](#StateStack+canRedo) ⇒ <code>boolean</code>
    * [.canUndo()](#StateStack+canUndo) ⇒ <code>boolean</code>
    * [.getRedoText()](#StateStack+getRedoText) ⇒ <code>string</code>
    * [.getUndoText()](#StateStack+getUndoText) ⇒ <code>string</code>
    * [.undo()](#StateStack+undo)
    * [.redo()](#StateStack+redo)
    * [.startTransaction([name], [group])](#StateStack+startTransaction)

<a name="new_StateStack_new"></a>

### new StateStack([state])

| Param | Type | Description |
| --- | --- | --- |
| [state] | <code>object</code> | optionally pass the state to manage on construction |

<a name="StateStack+getState"></a>

### stateStack.getState() ⇒ <code>object</code>
gets the current managed state

**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+setState"></a>

### stateStack.setState(state)
**Kind**: instance method of [<code>StateStack</code>](#StateStack)  

| Param |
| --- |
| state | 

<a name="StateStack+canRedo"></a>

### stateStack.canRedo() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+canUndo"></a>

### stateStack.canUndo() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+getRedoText"></a>

### stateStack.getRedoText() ⇒ <code>string</code>
returns text of redoable action

**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+getUndoText"></a>

### stateStack.getUndoText() ⇒ <code>string</code>
returns text of undoable action

**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+undo"></a>

### stateStack.undo()
undo the current transaction

**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+redo"></a>

### stateStack.redo()
redo last undone transaction
is not save to call if canUdno returns false

**Kind**: instance method of [<code>StateStack</code>](#StateStack)  
<a name="StateStack+startTransaction"></a>

### stateStack.startTransaction([name], [group])
**Kind**: instance method of [<code>StateStack</code>](#StateStack)  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>string</code> | string to show in history / idetify change |
| [group] | <code>mixed</code> | optional group to merge consecutive chagnes to one transaction |

