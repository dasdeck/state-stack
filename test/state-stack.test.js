/*jshint esversion: 6 */
import StateStack from '../src/state-stack';

describe('state-stack simple tests', () => {

    it('set/get state stack', () => {
        let stateStack = new StateStack();

        stateStack.setState({ a: 'b' });

        expect(stateStack.getState().a).toBe('b');
    });

    it('can sends change messages', (done) => {
        let stateStack = new StateStack();

        stateStack.on('change', (stack) => {
            expect(stack).toBe(stateStack);
            done();
        });

        stateStack.emit('change', stateStack);
    });

    it('can not undo or redor anything', () => {
        let stateStack = new StateStack();

        stateStack.startTransaction('some action');

        expect(stateStack.canUndo()).toBe(false);
        expect(stateStack.canRedo()).toBe(false);

    });

});

describe('state-stack advanced', () => {

    beforeEach(function() {

        this.state = { value: 'initial' };
        this.stateStack = new StateStack();
        this.stateStack.on('changed', () => {
            this.state = this.stateStack.getState();
        });
        this.stateStack.setState(this.state);

    });

    it('undo x2', function() {

        this.stateStack.startTransaction('first change');
        this.state.value = 1;

        this.stateStack.startTransaction('second change');
        this.state.value = 2;

        expect(this.stateStack.canRedo()).toBe(false);
        expect(this.stateStack.canUndo()).toBe(true);

        this.stateStack.undo();

        expect(this.stateStack.canRedo()).toBe(true);
        expect(this.stateStack.canUndo()).toBe(true);

        expect(this.state.value).toBe(1);

        this.stateStack.undo();

        expect(this.state.value).toBe('initial');

    });

    it('undo do and undo again', function() {
        this.stateStack.startTransaction('some action');

        this.state.value = 1;

        this.stateStack.undo();

        this.state.value = 1;

        expect(this.stateStack.canRedo()).toBe(false);

        expect(this.stateStack.getUndoText()).toBe('some action');

        this.stateStack.undo();

        expect(this.state.value).toBe('initial');
    });

    it('undo', function() {

        this.stateStack.startTransaction('some unusedAction');
        this.stateStack.startTransaction('some action');

        expect(this.stateStack.canUndo()).toBe(false);
        expect(this.stateStack.canRedo()).toBe(false);

        this.state.value = "first change";

        expect(this.stateStack.canUndo()).toBe(true);
        expect(this.stateStack._hasPrevious()).toBe(false);
        expect(this.stateStack.getUndoText()).toBe('some action');

        this.stateStack.undo();

        expect(this.stateStack._isDirty()).toBe(false);
        expect(this.stateStack._hasPrevious()).toBe(false);

        expect(this.stateStack.getRedoText()).toBe('some action');

        expect(this.stateStack.canUndo()).toBe(false);
        expect(this.stateStack.canRedo()).toBe(true);
        expect(this.state.value).toBe('initial');

        this.stateStack.redo();

        expect(this.stateStack._isDirty()).toBe(false);
        expect(this.stateStack._hasPrevious()).toBe(true);

        expect(this.stateStack.canUndo()).toBe(true);
        expect(this.stateStack.canRedo()).toBe(false);
        expect(this.state.value).toBe('first change');

        this.stateStack.undo();

        expect(this.stateStack.canUndo()).toBe(false);
        expect(this.stateStack.canRedo()).toBe(true);
        expect(this.state.value).toBe('initial');

        this.state.value = 'another change';

        expect(this.stateStack._isDirty()).toBe(true);
        expect(this.stateStack._hasPrevious()).toBe(false);

        expect(this.stateStack.canUndo()).toBe(true);
        expect(this.stateStack.canRedo()).toBe(false);
        expect(this.state.value).toBe('another change');
    });

    it('grouping', function() {
        let group = {};

        this.stateStack.startTransaction("grouped change", group);

        this.state.value = 1;

        this.stateStack.startTransaction('grouped change', group);

        this.state.value = 2;

        this.stateStack.undo();

        expect(this.state.value).toBe('initial');

    });
});