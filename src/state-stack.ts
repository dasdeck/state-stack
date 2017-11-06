
import Vue from 'vue';

function cloneDeep(data:any) {
    return data ? JSON.parse(JSON.stringify(data)) : data;
}

function isEqual(a:any, b:any) {
    return JSON.stringify(a) === JSON.stringify(b);
}

interface Listener {
    message:string;
    callback:Function;

}

class VueComp {
    private listeners:Array<Listener> = [];

    protected $emit(message:string, data:any) {
        this.listeners.forEach(listener => {
            if(listener.message === message) {
                listener.callback(data);
            }
        });
    };

    public $on(message:string, callback:Function) {
        this.listeners.push({message,callback});
    };
}
/**
 * state based undo/redo class
 * @class
 *
 */
export default class extends VueComp {

    constructor(value?:Object) {
        super();
        this.setState(value);
    }

    private stack:any|null = null;
    private pendingRedo:any|null = null;
    private value:any = null;

		/**
		 * returns text of undoable action
		 * @returns {string}
		 */

    public get undoText():string {
        
        if (this.canUndo) {
            
            if (this._isDirty()) {
                return this.stack.name;
            } else if (this._hasPrevious()) {
                return this.stack.prev.name;
            }
            
        }

        return '';
    }

        /**
		 *
		 * @returns {boolean}
		 */
        public get canRedo():boolean {
            return !!(this.stack && this.stack.next && !this._isDirty());
        }

		/**
		 *
		 * @returns {boolean}
		 */
        public get canUndo():boolean {
            return !!(this._isDirty() || this._hasPrevious());
        }

        /**
		 * returns text of redoable action
		 * @returns {string}
		 */
        public get redoText():string {
            if (this.canRedo) {
                if(this.pendingRedo) {
                    return this.pendingRedo.name;
                } else {
                    return this.stack.name;
                }
            } else {
                return '';
            }
        }

        public get redos():Array<object> {
            var res = [];

            var pointer = this.stack;

            if (!pointer) return [];

            while (pointer.next) {
                pointer = pointer.next;
                res.push(pointer);
            }
            return res;
        }
        
        public get undos():Array<object> {
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
    

   

        public clear() {
            this.stack = null;
        }

		/**
		 * @private
		 * @returns {boolean}
		 */
        private _hasPrevious() {
            return !!(this.stack && this.stack.prev);
        }

		/**
		 *
		 * @private
		 * @returns {boolean}
		 */
        private _isDirty() {
            return !!(this.stack && !isEqual(this.stack.state, this.value));
        }

		/**
		 *
		 * @private
		 * @returns {boolean}
		 */
        private _hasNext() {
            return !!(this.stack && this.stack.next);
        }

		/**
		 * undo the current transaction
		 */
        public undo() {
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
        }

        

        getStart() {
            if (!this.stack) return false;

            var pointer = this.stack;

            while (pointer.prev) {
                pointer = pointer.prev;
            }
            return pointer;
        }

        contains(state:any) {
            if (!this.stack) return false;

            var pointer = this.getStart();

            while (pointer) {
                if (pointer === state) {
                    return true;
                }
                pointer = pointer.next;
            }

            return false;

        }

        jumpToState(stateToLoad:any) {
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

        }

        setState(state:any) {
            Vue.set(this,'value',state);// = state;
        }

        getState():any {
            return this.value;
        }
		/**
		 * redo last undone transaction
		 * is not save to call if canUndo returns false
		 */
        redo() {
            if (!this.canRedo) return;

            this.jumpToState(this.stack.next);

        }

		/**
		 *
		 * @param {string} [name] - string to show in history / idetify change
		 * @param {mixed} [group] - optional group to merge
		 * consecutive chagnes to one transaction
		 */
        startTransaction(name:string, group?:any) {
            let nextTransaction:any;

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
    
};
