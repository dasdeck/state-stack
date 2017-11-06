"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
function cloneDeep(data) {
    return data ? JSON.parse(JSON.stringify(data)) : data;
}
function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
var VueComp = /** @class */ (function () {
    function VueComp() {
        this.listeners = [];
    }
    VueComp.prototype.$emit = function (message, data) {
        this.listeners.forEach(function (listener) {
            if (listener.message === message) {
                listener.callback(data);
            }
        });
    };
    ;
    VueComp.prototype.$on = function (message, callback) {
        this.listeners.push({ message: message, callback: callback });
    };
    ;
    return VueComp;
}());
/**
 * state based undo/redo class
 * @class
 *
 */
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(value) {
        var _this = _super.call(this) || this;
        _this.stack = null;
        _this.pendingRedo = null;
        _this.value = null;
        _this.setState(value);
        return _this;
    }
    Object.defineProperty(default_1.prototype, "undoText", {
        /**
         * returns text of undoable action
         * @returns {string}
         */
        get: function () {
            if (this.canUndo) {
                if (this._isDirty()) {
                    return this.stack.name;
                }
                else if (this._hasPrevious()) {
                    return this.stack.prev.name;
                }
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "canRedo", {
        /**
         *
         * @returns {boolean}
         */
        get: function () {
            return !!(this.stack && this.stack.next && !this._isDirty());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "canUndo", {
        /**
         *
         * @returns {boolean}
         */
        get: function () {
            return !!(this._isDirty() || this._hasPrevious());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "redoText", {
        /**
         * returns text of redoable action
         * @returns {string}
         */
        get: function () {
            if (this.canRedo) {
                if (this.pendingRedo) {
                    return this.pendingRedo.name;
                }
                else {
                    return this.stack.name;
                }
            }
            else {
                return '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "redos", {
        get: function () {
            var res = [];
            var pointer = this.stack;
            if (!pointer)
                return [];
            while (pointer.next) {
                pointer = pointer.next;
                res.push(pointer);
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "undos", {
        get: function () {
            var res = [];
            var pointer = this.stack;
            if (!pointer)
                return [];
            if (this._isDirty()) {
                res.push(pointer);
            }
            while (pointer.prev) {
                pointer = pointer.prev;
                res.push(pointer);
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    default_1.prototype.clear = function () {
        this.stack = null;
    };
    /**
     * @private
     * @returns {boolean}
     */
    default_1.prototype._hasPrevious = function () {
        return !!(this.stack && this.stack.prev);
    };
    /**
     *
     * @private
     * @returns {boolean}
     */
    default_1.prototype._isDirty = function () {
        return !!(this.stack && !isEqual(this.stack.state, this.value));
    };
    /**
     *
     * @private
     * @returns {boolean}
     */
    default_1.prototype._hasNext = function () {
        return !!(this.stack && this.stack.next);
    };
    /**
     * undo the current transaction
     */
    default_1.prototype.undo = function () {
        if (!this.canUndo)
            return;
        if (!this._isDirty() && this._hasPrevious()) {
            this.stack = this.stack.prev;
        }
        if (!this.stack.next) {
            vue_1.default.set(this.stack, 'next', { prev: this.stack });
        }
        this.stack.next.state = cloneDeep(this.value);
        this.value = cloneDeep(this.stack.state);
        this.$emit('changed', this.value); //update v-model
        this.$emit('input', this.value); //update v-model
        this.$emit('update:value', this.value); //update value.sync in vue >= 2.2
    };
    default_1.prototype.getStart = function () {
        if (!this.stack)
            return false;
        var pointer = this.stack;
        while (pointer.prev) {
            pointer = pointer.prev;
        }
        return pointer;
    };
    default_1.prototype.contains = function (state) {
        if (!this.stack)
            return false;
        var pointer = this.getStart();
        while (pointer) {
            if (pointer === state) {
                return true;
            }
            pointer = pointer.next;
        }
        return false;
    };
    default_1.prototype.jumpToState = function (stateToLoad) {
        if (!this.stack)
            throw 'you can not jump to a state on an empty stack';
        if (!this.contains(stateToLoad))
            throw 'you can only jumpt to local states';
        if (this.pendingRedo) {
            this.stack.name = this.pendingRedo.name;
            this.stack.group = this.pendingRedo.group;
            delete this.pendingRedo;
        }
        if (this._isDirty()) {
            if (!this.stack.next)
                vue_1.default.set(this.stack, 'next', { prev: this.stack });
            this.stack.next.state = cloneDeep(this.value);
        }
        this.value = cloneDeep(stateToLoad.state);
        this.stack = stateToLoad;
        this.$emit('changed', this.value); //update v-model
        this.$emit('input', this.value); //update v-model
        this.$emit('update:value', this.value); //update value.sync in vue >= 2.2
    };
    default_1.prototype.setState = function (state) {
        vue_1.default.set(this, 'value', state); // = state;
    };
    default_1.prototype.getState = function () {
        return this.value;
    };
    /**
     * redo last undone transaction
     * is not save to call if canUndo returns false
     */
    default_1.prototype.redo = function () {
        if (!this.canRedo)
            return;
        this.jumpToState(this.stack.next);
    };
    /**
     *
     * @param {string} [name] - string to show in history / idetify change
     * @param {mixed} [group] - optional group to merge
     * consecutive chagnes to one transaction
     */
    default_1.prototype.startTransaction = function (name, group) {
        var nextTransaction;
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
            this.stack = nextTransaction; // this.stack = nextTransaction;
        }
        this.stack.name = name;
        this.stack.group = group;
    };
    return default_1;
}(VueComp));
exports.default = default_1;
;
