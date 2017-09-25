import {EventEmitter} from 'events';
import {cloneDeep, isEqual} from 'lodash';

/**
 * state based undo/redo class
 * @class
 *
 */
class StateStack extends EventEmitter {

    /**
     *
     * @param {object} [state] - optionally pass the state to manage on construction
     */
    constructor(state)
    {
        super();
        this.state = state || {};
        this.stack = null;
    }

    /**
     * @private
     * @returns {boolean}
     */
    _hasPrevious()
    {
        return !!( this.stack && this.stack.prev);
    }

    /**
     *
     * @returns {boolean}
     * @private
     */
    _isDirty()
    {
        return !!( this.stack && !isEqual(this.stack.state, this.getState()) );
    }

    /**
     *
     * @returns {boolean}
     * @private
     */
    _hasNext()
    {
        return !!(this.stack && this.stack.next)
    }


    /**
     * gets the current managed state
     * @returns {object}
     */
    getState()
    {
        return this.state;
    }

    /**
     *
     * @param state
     */
    setState(state)
    {
        this.state = state;
        this.emit('changed');
    }

    /**
     *
     * @returns {boolean}
     */
    canRedo()
    {
        return !!(this.stack && this.stack.next && !this._isDirty() );

    }


    /**
     *
     * @returns {boolean}
     */
    canUndo()
    {
        return !!(this._isDirty() || this._hasPrevious());
    }

    getRedoText()
    {
        if (this._hasNext())
        {
            return this.stack.name;
        }

    }

    getUndoText()
    {
        if (this._isDirty())
        {
            return this.stack.name;
        }
        else if (this._hasPrevious())
        {
            return this.stack.prev.name;
        }

    }

    undo()
    {
        if (!this._isDirty() && this._hasPrevious())
        {
            this.stack = this.stack.prev;
        }
        if (!this.stack.next)
        {
            this.stack.next = {prev: this.stack};
        }

        this.stack.next.state = cloneDeep(this.getState());

        this.setState(cloneDeep(this.stack.state));
    }

    redo()
    {
        this.stack = this.stack.next;
        this.setState(cloneDeep(this.stack.state));
    }

    startTransaction(name)
    {
        let nextTransaction;
        if (this.stack && !this._isDirty())
        {
            nextTransaction = this.stack;
        }
        else
        {
            nextTransaction = {
                prev: this.stack
            };

            if (this.stack)
            {
                this.stack.next = nextTransaction;
            }

            this.stack = nextTransaction;
        }

        nextTransaction.state = cloneDeep(this.getState());
        nextTransaction.name = name;


    }
}

export default StateStack;