(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("events"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["events", "lodash"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("events"), require("lodash")) : factory(root["events"], root["lodash"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _lodash = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_EventEmitter) {
    _inherits(_class, _EventEmitter);

    function _class() {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.state = {};
        _this.stack = null;
        return _this;
    }

    _createClass(_class, [{
        key: '_hasPrevious',
        value: function _hasPrevious() {
            return !!(this.stack && this.stack.prev);
        }
    }, {
        key: '_isDirty',
        value: function _isDirty() {
            return !!(this.stack && !(0, _lodash.isEqual)(this.stack.state, this.getState()));
        }
    }, {
        key: '_hasNext',
        value: function _hasNext() {
            return !!(this.stack && this.stack.next);
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this.state;
        }
    }, {
        key: 'setState',
        value: function setState(state) {
            this.state = state;
            this.emit('changed');
        }
    }, {
        key: 'canRedo',
        value: function canRedo() {
            return !!(this.stack && this.stack.next && !this._isDirty());
        }
    }, {
        key: 'canUndo',
        value: function canUndo() {
            return !!(this._isDirty() || this._hasPrevious());
        }
    }, {
        key: 'getRedoText',
        value: function getRedoText() {
            if (this._hasNext()) {
                return this.stack.name;
            }
        }
    }, {
        key: 'getUndoText',
        value: function getUndoText() {
            if (this._isDirty()) {
                return this.stack.name;
            } else if (this._hasPrevious()) {
                return this.stack.prev.name;
            }
        }
    }, {
        key: 'undo',
        value: function undo() {
            if (!this._isDirty() && this._hasPrevious()) {
                this.stack = this.stack.prev;
            }
            if (!this.stack.next) {
                this.stack.next = { prev: this.stack };
            }

            this.stack.next.state = (0, _lodash.cloneDeep)(this.getState());

            this.setState((0, _lodash.cloneDeep)(this.stack.state));
        }
    }, {
        key: 'redo',
        value: function redo() {
            this.stack = this.stack.next;
            this.setState((0, _lodash.cloneDeep)(this.stack.state));
        }
    }, {
        key: 'startTransaction',
        value: function startTransaction(name) {
            var nextTransaction = void 0;
            if (this.stack && !this._isDirty()) {
                nextTransaction = this.stack;
            } else {
                nextTransaction = {
                    prev: this.stack
                };

                if (this.stack) {
                    this.stack.next = nextTransaction;
                }

                this.stack = nextTransaction;
            }

            nextTransaction.state = (0, _lodash.cloneDeep)(this.getState());
            nextTransaction.name = name;
        }
    }]);

    return _class;
}(_events.EventEmitter);

exports.default = _class;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ })
/******/ ]);
});
//# sourceMappingURL=state-stack.js.map