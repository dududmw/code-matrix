'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by yaoyi on 2017/8/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function routeInList(route, list) {
    for (var i = 0; i < list.length; i++) {
        var rule = list[i];
        if (typeof rule == 'string' && ~route.indexOf(rule)) {
            return true;
        }
        if (rule != null && typeof rule.test == 'function' && rule.test(route)) {
            return true;
        }
    }
    return false;
}
function next(middlewares, now, resolve) {
    this.__now = now;
    if (now >= middlewares.length) {
        resolve(this);
        return;
    }

    var whiteList = this.whiteList,
        blackList = this.blackList;

    Array.isArray(whiteList) || (whiteList = []);
    Array.isArray(blackList) || (blackList = []);
    var nowMiddleware = middlewares[now];
    var route = nowMiddleware.route,
        cb = nowMiddleware.cb;

    var inWhiteList = routeInList(route, whiteList),
        inBlackList = routeInList(route, blackList);
    var nnext = next.bind(this, middlewares, now + 1, resolve);
    if (!inBlackList && inWhiteList) {
        var r = cb.call(this, nnext);
        if (!(r instanceof _es6Promise2.default) && this.__now == now) {
            resolve(this);
            return;
        }
    } else {
        nnext();
    }
}

var Router = function () {
    function Router() {
        _classCallCheck(this, Router);

        this.middlewares = [];
    }

    _createClass(Router, [{
        key: 'use',
        value: function use(route, cb) {
            if (typeof route == 'string' && typeof cb == 'function') {
                this.middlewares.push({ route: route, cb: cb });
            }
        }
    }, {
        key: 'send',
        value: function send(context) {
            var middlewares = this.middlewares;

            return new _es6Promise2.default(function (resolve, reject) {
                next.call(context, middlewares, 0, resolve);
            });
        }
    }]);

    return Router;
}();

exports.default = Router;