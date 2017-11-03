
import Vue from 'vue';

function cloneDeep(data) {
    return data ? JSON.parse(JSON.stringify(data)) : data;
}

function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * state based undo/redo class
 * @class
 *
 */
export default {

    props: ['value'],

	/**
	 *
	 * @param {object} [state] - optionally pass the state to manage on construction
	 */
    data() {
		// this.value = state || {}
        return { stack: null}; //this.stack = null
    },

    computed: {

		/**
		 * returns text of undoable action
		 * @returns {string}
		 */
        undoText() {

            if (this.canUndo) {

                if (this._isDirty()) {
                    return this.stack.name;
                } else if (this._hasPrevious()) {
                    return this.stack.prev.name;
                }

            } else {

                return '';

            }
        },

        /**
		 *
		 * @returns {boolean}
		 */
        canRedo() {
            return !!(this.stack && this.stack.next && !this._isDirty());
        },

		/**
		 *
		 * @returns {boolean}
		 */
        canUndo() {
            return !!(this._isDirty() || this._hasPrevious());
        },

        /**
		 * returns text of redoable action
		 * @returns {string}
		 */
        redoText() {
            if (this.canRedo) {
                return this.stack.name;
            } else {
                return '';
            }
        },
        redos() {
            var res = [];

            var pointer = this.stack;

            if (!pointer) return [];

            while (pointer.next) {
                pointer = pointer.next;
                res.push(pointer);
            }
            return res;
        },
        undos() {
            var res = [];

            var pointer = this.stack;

            if (!pointer) return [];

            if (this._isDirty()) {
                res.push(pointer);
            }

            while (pointer.prev) {
                pointer = pointer.prev;
                res.push(pointer);
            }
            return res;
        }
    },

    methods: {

        clear() {
            this.stack = null;
        },

		/**
		 * @private
		 * @returns {boolean}
		 */
        _hasPrevious() {
            return !!(this.stack && this.stack.prev);
        },

		/**
		 *
		 * @private
		 * @returns {boolean}
		 */
        _isDirty() {
            return !!(this.stack && !isEqual(this.stack.state, this.value));
        },

		/**
		 *
		 * @private
		 * @returns {boolean}
		 */
        _hasNext() {
            return !!(this.stack && this.stack.next);
        },

		/**
		 * undo the current transaction
		 */
        undo() {
            if (!this.canUndo) return;

            if (!this._isDirty() && this._hasPrevious()) {
                this.stack = this.stack.prev;
            }

            if (!this.stack.next) {
                Vue.set(this.stack, 'next', { prev: this.stack });
            }

            this.stack.next.state = cloneDeep(this.value);

            this.value = cloneDeep(this.stack.state);

            this.$emit('changed', this.value);//update v-model
            this.$emit('input', this.value);//update v-model
            this.$emit('update:value', this.value);//update value.sync in vue >= 2.2
        },

        getStart() {
            if (!this.stack) return false;

            var pointer = this.stack;

            while (pointer.prev) {
                pointer = pointer.prev;
            }
            return pointer;
        },

        contains(state) {
            if (!this.stack) return false;

            var pointer = this.getStart();

            while (pointer) {
                if (pointer === state) {
                    return true;
                }
                pointer = pointer.next;
            }

            return false;

        },

        jumpToState(stateToLoad) {
            if (!this.stack) throw 'you can not jump to a state on an empty stack';
            if (!this.contains(stateToLoad)) throw 'you can only jumpt to local states';

            if (this.pendingRedo) {
                this.stack.name = this.pendingRedo.name;
                this.stack.group = this.pendingRedo.group;
                delete this.pendingRedo;
            }

            if (this._isDirty()) {
                if (!this.stack.next) Vue.set(this.stack, 'next', { prev: this.stack });
                this.stack.next.state = cloneDeep(this.value);
            }

            this.value = cloneDeep(stateToLoad.state);
            this.stack = stateToLoad;

            this.$emit('changed', this.value);//update v-model
            this.$emit('input', this.value);//update v-model
            this.$emit('update:value', this.value);//update value.sync in vue >= 2.2

        },

        setState(state) {
            this.value = state;
        },

        getState() {
            return this.value;
        },
		/**
		 * redo last undone transaction
		 * is not save to call if canUndo returns false
		 */
        redo() {
            if (!this.canRedo) return;

            this.jumpToState(this.stack.next);

        },

		/**
		 *
		 * @param {string} [name] - string to show in history / idetify change
		 * @param {mixed} [group] - optional group to merge
		 * consecutive chagnes to one transaction
		 */
        startTransaction(name, group) {
            let nextTransaction;

            if (this.stack) {

                if (group && this.stack.group === group || !this._isDirty()) {
                    nextTransaction = this.stack;
                }

                if (group && this.stack.prev && this.stack.prev.group === group && !this._isDirty()) {
                    this.stack = this.stack.prev;
                    nextTransaction = this.stack;
                }

            }

            if (this.canRedo && nextTransaction) {
                this.pendingRedo = {};
                this.pendingRedo.name = nextTransaction.name;
                this.pendingRedo.group = nextTransaction.group;
            }

            if (!nextTransaction) {

                nextTransaction = {
                    prev: this.stack
                };

                if (this.stack) {
                    this.stack.next = nextTransaction;
                }

                nextTransaction.state = cloneDeep(this.value);
                this.stack = nextTransaction;// this.stack = nextTransaction;

            }

            this.stack.name = name;
            this.stack.group = group;
        }
    }
};
