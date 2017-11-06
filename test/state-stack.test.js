/* jshint esversion: 6 */
/* eslint-env jasmine */

import StateStackDefinition from '../src/state-stack-comp';
import Vue from 'vue';


const StateStack = Vue.extend(StateStackDefinition);

describe('state-stack simple tests', () => {
  it('set/get state stack', () => {
    let stateStack = new StateStack()

    stateStack.setState({ a: 'b' })

    expect(stateStack.getState().a).toBe('b')
  })

  it('can send change messages', (done) => {
    let stateStack = new StateStack()

    stateStack.$on('change', (stack) => {
      expect(stack).toBe(stateStack)
      done()
    })

    stateStack.$emit('change', stateStack)
  })

  it('can not undo or redor anything', () => {
    let stateStack = new StateStack()

    stateStack.startTransaction('some action')

    expect(stateStack.canUndo).toBe(false)
    expect(stateStack.canRedo).toBe(false)
  })
})

describe('state-stack advanced propsSets=true', createAdvancedTestsWith({propsSets:true}))
describe('state-stack advanced propsSets=false', createAdvancedTestsWith({propsSets:false}))

function createAdvancedTestsWith(params) {


return () => {
  
    beforeEach(function () {
      this.state = { value: 'initial' }
      if(params.propsSets) {

        const args = {propsData: {value: this.state}};
        if(Vue.version < 2) {
          args.el = 'body'; //provide dom for vue 1.x compat
        }

        this.stateStack = new StateStack(args)

      }
      else {
        this.stateStack = new StateStack()
        this.stateStack.setState(this.state)
      }
      this.stateStack.$on('changed', () => {
        this.state = this.stateStack.getState()
      })
    })
  
    it('undo x2', function () {
      
      this.stateStack.startTransaction('first change')
      this.state.value = 1
  
      this.stateStack.startTransaction('second change')
      this.state.value = 2
  
      expect(this.stateStack.canRedo).toBe(false)
      expect(this.stateStack.canUndo).toBe(true)
  
      this.stateStack.undo()
  
      expect(this.stateStack.canRedo).toBe(true)
      expect(this.stateStack.canUndo).toBe(true)
  
      expect(this.state.value).toBe(1)
  
      this.stateStack.undo()
  
      expect(this.state.value).toBe('initial')
    })
  
    it('start new transaction but do not use it', function (){
  
      // debugger;
      this.stateStack.startTransaction('change1');
      this.state.value = 1;
      this.stateStack.startTransaction('no change');
      this.stateStack.startTransaction('real change2');
      this.state.value = 2;
  
      expect(this.stateStack.canUndo).toBe(true);
      expect(this.stateStack.undoText).toBe('real change2');
  
      this.stateStack.undo();
  
      expect(this.state.value).toBe(1);
      expect(this.stateStack.canUndo).toBe(true);
      expect(this.stateStack.canRedo).toBe(true);
  
      this.stateStack.startTransaction('another transaction that does nothing');
  
      expect(this.stateStack.undoText).toBe('change1');
      expect(this.stateStack.redoText).toBe('real change2');
      
  
  
    });
  
    it('undo do and undo again', function () {
  
      this.stateStack.startTransaction('some action')
      this.state.value = 1
      this.stateStack.undo()
      this.state.value = 2

      expect(this.stateStack.canRedo).toBe(false)
      expect(this.stateStack.undoText).toBe('some action')

      this.stateStack.undo()
  
      expect(this.state.value).toBe('initial')
    })
  
    it('undo', function () {
  
      this.stateStack.startTransaction('some unusedAction')
      this.stateStack.startTransaction('some action')
  
      expect(this.stateStack.canUndo).toBe(false)
      expect(this.stateStack.canRedo).toBe(false)
  
      this.state.value = 'first change'
  
      expect(this.stateStack.canUndo).toBe(true)
      expect(this.stateStack._hasPrevious()).toBe(false)
      expect(this.stateStack.undoText).toBe('some action')
  
      this.stateStack.undo()
  
      expect(this.stateStack._isDirty()).toBe(false)
      expect(this.stateStack._hasPrevious()).toBe(false)
  
      expect(this.stateStack.redoText).toBe('some action')
  
      expect(this.stateStack.canUndo).toBe(false)
      expect(this.stateStack.canRedo).toBe(true)
      expect(this.state.value).toBe('initial')
  
      this.stateStack.redo()
  
      expect(this.stateStack._isDirty()).toBe(false)
      expect(this.stateStack._hasPrevious()).toBe(true)
  
      expect(this.stateStack.canUndo).toBe(true)
      expect(this.stateStack.canRedo).toBe(false)
      expect(this.state.value).toBe('first change')
  
      this.stateStack.undo()
  
      expect(this.stateStack.canUndo).toBe(false)
      expect(this.stateStack.canRedo).toBe(true)
      expect(this.state.value).toBe('initial')
  
      this.state.value = 'another change'
  
      expect(this.stateStack._isDirty()).toBe(true)
      expect(this.stateStack._hasPrevious()).toBe(false)
  
      expect(this.stateStack.canUndo).toBe(true)
      expect(this.stateStack.canRedo).toBe(false)
      expect(this.state.value).toBe('another change')
    })
  
    it('grouping', function () {
  
      
      let group = {}
      this.stateStack.startTransaction('grouped change', group)
      this.state.value = 1
      this.stateStack.startTransaction('grouped change', group)
      this.state.value = 2
      this.stateStack.undo()
      expect(this.state.value).toBe('initial')

    })
  
    it('restart pending redo', function () {
  
      this.stateStack.startTransaction('operation a');
      this.state.value = 'a';
      this.stateStack.undo();
  
      this.stateStack.startTransaction('operation b');
      this.stateStack.redo();
  
      expect(this.stateStack.undoText).toBe('operation a');
  
  
    })
  }
}