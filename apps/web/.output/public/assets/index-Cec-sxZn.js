;(function () {
  const u = document.createElement('link').relList
  if (u && u.supports && u.supports('modulepreload')) return
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o)
  new MutationObserver((o) => {
    for (const f of o)
      if (f.type === 'childList')
        for (const d of f.addedNodes) d.tagName === 'LINK' && d.rel === 'modulepreload' && r(d)
  }).observe(document, { childList: !0, subtree: !0 })
  function i(o) {
    const f = {}
    return (
      o.integrity && (f.integrity = o.integrity),
      o.referrerPolicy && (f.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === 'use-credentials'
        ? (f.credentials = 'include')
        : o.crossOrigin === 'anonymous'
        ? (f.credentials = 'omit')
        : (f.credentials = 'same-origin'),
      f
    )
  }
  function r(o) {
    if (o.ep) return
    o.ep = !0
    const f = i(o)
    fetch(o.href, f)
  }
})()
function Yy(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, 'default') ? a.default : a
}
var Ac = { exports: {} },
  vi = {}
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ey
function $0() {
  if (ey) return vi
  ey = 1
  var a = Symbol.for('react.transitional.element'),
    u = Symbol.for('react.fragment')
  function i(r, o, f) {
    var d = null
    if ((f !== void 0 && (d = '' + f), o.key !== void 0 && (d = '' + o.key), 'key' in o)) {
      f = {}
      for (var y in o) y !== 'key' && (f[y] = o[y])
    } else f = o
    return (o = f.ref), { $$typeof: a, type: r, key: d, ref: o !== void 0 ? o : null, props: f }
  }
  return (vi.Fragment = u), (vi.jsx = i), (vi.jsxs = i), vi
}
var ny
function W0() {
  return ny || ((ny = 1), (Ac.exports = $0())), Ac.exports
}
var k = W0(),
  Dc = { exports: {} },
  mt = {}
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ly
function I0() {
  if (ly) return mt
  ly = 1
  var a = Symbol.for('react.transitional.element'),
    u = Symbol.for('react.portal'),
    i = Symbol.for('react.fragment'),
    r = Symbol.for('react.strict_mode'),
    o = Symbol.for('react.profiler'),
    f = Symbol.for('react.consumer'),
    d = Symbol.for('react.context'),
    y = Symbol.for('react.forward_ref'),
    m = Symbol.for('react.suspense'),
    v = Symbol.for('react.memo'),
    g = Symbol.for('react.lazy'),
    S = Symbol.iterator
  function T(_) {
    return _ === null || typeof _ != 'object'
      ? null
      : ((_ = (S && _[S]) || _['@@iterator']), typeof _ == 'function' ? _ : null)
  }
  var D = {
      isMounted: function () {
        return !1
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    w = Object.assign,
    U = {}
  function Z(_, N, F) {
    ;(this.props = _), (this.context = N), (this.refs = U), (this.updater = F || D)
  }
  ;(Z.prototype.isReactComponent = {}),
    (Z.prototype.setState = function (_, N) {
      if (typeof _ != 'object' && typeof _ != 'function' && _ != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        )
      this.updater.enqueueSetState(this, _, N, 'setState')
    }),
    (Z.prototype.forceUpdate = function (_) {
      this.updater.enqueueForceUpdate(this, _, 'forceUpdate')
    })
  function G() {}
  G.prototype = Z.prototype
  function X(_, N, F) {
    ;(this.props = _), (this.context = N), (this.refs = U), (this.updater = F || D)
  }
  var nt = (X.prototype = new G())
  ;(nt.constructor = X), w(nt, Z.prototype), (nt.isPureReactComponent = !0)
  var yt = Array.isArray,
    Q = { H: null, A: null, T: null, S: null },
    $ = Object.prototype.hasOwnProperty
  function ct(_, N, F, J, V, ut) {
    return (F = ut.ref), { $$typeof: a, type: _, key: N, ref: F !== void 0 ? F : null, props: ut }
  }
  function L(_, N) {
    return ct(_.type, N, void 0, void 0, void 0, _.props)
  }
  function R(_) {
    return typeof _ == 'object' && _ !== null && _.$$typeof === a
  }
  function j(_) {
    var N = { '=': '=0', ':': '=2' }
    return (
      '$' +
      _.replace(/[=:]/g, function (F) {
        return N[F]
      })
    )
  }
  var Y = /\/+/g
  function K(_, N) {
    return typeof _ == 'object' && _ !== null && _.key != null ? j('' + _.key) : N.toString(36)
  }
  function lt() {}
  function vt(_) {
    switch (_.status) {
      case 'fulfilled':
        return _.value
      case 'rejected':
        throw _.reason
      default:
        switch (
          (typeof _.status == 'string'
            ? _.then(lt, lt)
            : ((_.status = 'pending'),
              _.then(
                function (N) {
                  _.status === 'pending' && ((_.status = 'fulfilled'), (_.value = N))
                },
                function (N) {
                  _.status === 'pending' && ((_.status = 'rejected'), (_.reason = N))
                },
              )),
          _.status)
        ) {
          case 'fulfilled':
            return _.value
          case 'rejected':
            throw _.reason
        }
    }
    throw _
  }
  function rt(_, N, F, J, V) {
    var ut = typeof _
    ;(ut === 'undefined' || ut === 'boolean') && (_ = null)
    var I = !1
    if (_ === null) I = !0
    else
      switch (ut) {
        case 'bigint':
        case 'string':
        case 'number':
          I = !0
          break
        case 'object':
          switch (_.$$typeof) {
            case a:
            case u:
              I = !0
              break
            case g:
              return (I = _._init), rt(I(_._payload), N, F, J, V)
          }
      }
    if (I)
      return (
        (V = V(_)),
        (I = J === '' ? '.' + K(_, 0) : J),
        yt(V)
          ? ((F = ''),
            I != null && (F = I.replace(Y, '$&/') + '/'),
            rt(V, N, F, '', function (_t) {
              return _t
            }))
          : V != null &&
            (R(V) &&
              (V = L(
                V,
                F +
                  (V.key == null || (_ && _.key === V.key)
                    ? ''
                    : ('' + V.key).replace(Y, '$&/') + '/') +
                  I,
              )),
            N.push(V)),
        1
      )
    I = 0
    var Ct = J === '' ? '.' : J + ':'
    if (yt(_))
      for (var it = 0; it < _.length; it++)
        (J = _[it]), (ut = Ct + K(J, it)), (I += rt(J, N, F, ut, V))
    else if (((it = T(_)), typeof it == 'function'))
      for (_ = it.call(_), it = 0; !(J = _.next()).done; )
        (J = J.value), (ut = Ct + K(J, it++)), (I += rt(J, N, F, ut, V))
    else if (ut === 'object') {
      if (typeof _.then == 'function') return rt(vt(_), N, F, J, V)
      throw (
        ((N = String(_)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (N === '[object Object]' ? 'object with keys {' + Object.keys(_).join(', ') + '}' : N) +
            '). If you meant to render a collection of children, use an array instead.',
        ))
      )
    }
    return I
  }
  function B(_, N, F) {
    if (_ == null) return _
    var J = [],
      V = 0
    return (
      rt(_, J, '', '', function (ut) {
        return N.call(F, ut, V++)
      }),
      J
    )
  }
  function P(_) {
    if (_._status === -1) {
      var N = _._result
      ;(N = N()),
        N.then(
          function (F) {
            ;(_._status === 0 || _._status === -1) && ((_._status = 1), (_._result = F))
          },
          function (F) {
            ;(_._status === 0 || _._status === -1) && ((_._status = 2), (_._result = F))
          },
        ),
        _._status === -1 && ((_._status = 0), (_._result = N))
    }
    if (_._status === 1) return _._result.default
    throw _._result
  }
  var tt =
    typeof reportError == 'function'
      ? reportError
      : function (_) {
          if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
            var N = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof _ == 'object' && _ !== null && typeof _.message == 'string'
                  ? String(_.message)
                  : String(_),
              error: _,
            })
            if (!window.dispatchEvent(N)) return
          } else if (typeof process == 'object' && typeof process.emit == 'function') {
            process.emit('uncaughtException', _)
            return
          }
          console.error(_)
        }
  function dt() {}
  return (
    (mt.Children = {
      map: B,
      forEach: function (_, N, F) {
        B(
          _,
          function () {
            N.apply(this, arguments)
          },
          F,
        )
      },
      count: function (_) {
        var N = 0
        return (
          B(_, function () {
            N++
          }),
          N
        )
      },
      toArray: function (_) {
        return (
          B(_, function (N) {
            return N
          }) || []
        )
      },
      only: function (_) {
        if (!R(_))
          throw Error('React.Children.only expected to receive a single React element child.')
        return _
      },
    }),
    (mt.Component = Z),
    (mt.Fragment = i),
    (mt.Profiler = o),
    (mt.PureComponent = X),
    (mt.StrictMode = r),
    (mt.Suspense = m),
    (mt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Q),
    (mt.act = function () {
      throw Error('act(...) is not supported in production builds of React.')
    }),
    (mt.cache = function (_) {
      return function () {
        return _.apply(null, arguments)
      }
    }),
    (mt.cloneElement = function (_, N, F) {
      if (_ == null) throw Error('The argument must be a React element, but you passed ' + _ + '.')
      var J = w({}, _.props),
        V = _.key,
        ut = void 0
      if (N != null)
        for (I in (N.ref !== void 0 && (ut = void 0), N.key !== void 0 && (V = '' + N.key), N))
          !$.call(N, I) ||
            I === 'key' ||
            I === '__self' ||
            I === '__source' ||
            (I === 'ref' && N.ref === void 0) ||
            (J[I] = N[I])
      var I = arguments.length - 2
      if (I === 1) J.children = F
      else if (1 < I) {
        for (var Ct = Array(I), it = 0; it < I; it++) Ct[it] = arguments[it + 2]
        J.children = Ct
      }
      return ct(_.type, V, void 0, void 0, ut, J)
    }),
    (mt.createContext = function (_) {
      return (
        (_ = {
          $$typeof: d,
          _currentValue: _,
          _currentValue2: _,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (_.Provider = _),
        (_.Consumer = { $$typeof: f, _context: _ }),
        _
      )
    }),
    (mt.createElement = function (_, N, F) {
      var J,
        V = {},
        ut = null
      if (N != null)
        for (J in (N.key !== void 0 && (ut = '' + N.key), N))
          $.call(N, J) && J !== 'key' && J !== '__self' && J !== '__source' && (V[J] = N[J])
      var I = arguments.length - 2
      if (I === 1) V.children = F
      else if (1 < I) {
        for (var Ct = Array(I), it = 0; it < I; it++) Ct[it] = arguments[it + 2]
        V.children = Ct
      }
      if (_ && _.defaultProps) for (J in ((I = _.defaultProps), I)) V[J] === void 0 && (V[J] = I[J])
      return ct(_, ut, void 0, void 0, null, V)
    }),
    (mt.createRef = function () {
      return { current: null }
    }),
    (mt.forwardRef = function (_) {
      return { $$typeof: y, render: _ }
    }),
    (mt.isValidElement = R),
    (mt.lazy = function (_) {
      return { $$typeof: g, _payload: { _status: -1, _result: _ }, _init: P }
    }),
    (mt.memo = function (_, N) {
      return { $$typeof: v, type: _, compare: N === void 0 ? null : N }
    }),
    (mt.startTransition = function (_) {
      var N = Q.T,
        F = {}
      Q.T = F
      try {
        var J = _(),
          V = Q.S
        V !== null && V(F, J),
          typeof J == 'object' && J !== null && typeof J.then == 'function' && J.then(dt, tt)
      } catch (ut) {
        tt(ut)
      } finally {
        Q.T = N
      }
    }),
    (mt.unstable_useCacheRefresh = function () {
      return Q.H.useCacheRefresh()
    }),
    (mt.use = function (_) {
      return Q.H.use(_)
    }),
    (mt.useActionState = function (_, N, F) {
      return Q.H.useActionState(_, N, F)
    }),
    (mt.useCallback = function (_, N) {
      return Q.H.useCallback(_, N)
    }),
    (mt.useContext = function (_) {
      return Q.H.useContext(_)
    }),
    (mt.useDebugValue = function () {}),
    (mt.useDeferredValue = function (_, N) {
      return Q.H.useDeferredValue(_, N)
    }),
    (mt.useEffect = function (_, N) {
      return Q.H.useEffect(_, N)
    }),
    (mt.useId = function () {
      return Q.H.useId()
    }),
    (mt.useImperativeHandle = function (_, N, F) {
      return Q.H.useImperativeHandle(_, N, F)
    }),
    (mt.useInsertionEffect = function (_, N) {
      return Q.H.useInsertionEffect(_, N)
    }),
    (mt.useLayoutEffect = function (_, N) {
      return Q.H.useLayoutEffect(_, N)
    }),
    (mt.useMemo = function (_, N) {
      return Q.H.useMemo(_, N)
    }),
    (mt.useOptimistic = function (_, N) {
      return Q.H.useOptimistic(_, N)
    }),
    (mt.useReducer = function (_, N, F) {
      return Q.H.useReducer(_, N, F)
    }),
    (mt.useRef = function (_) {
      return Q.H.useRef(_)
    }),
    (mt.useState = function (_) {
      return Q.H.useState(_)
    }),
    (mt.useSyncExternalStore = function (_, N, F) {
      return Q.H.useSyncExternalStore(_, N, F)
    }),
    (mt.useTransition = function () {
      return Q.H.useTransition()
    }),
    (mt.version = '19.0.0'),
    mt
  )
}
var ay
function Ni() {
  return ay || ((ay = 1), (Dc.exports = I0())), Dc.exports
}
var ft = Ni()
const tp = Yy(ft)
var Cc = { exports: {} },
  pi = {},
  wc = { exports: {} },
  xc = {}
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var iy
function ep() {
  return (
    iy ||
      ((iy = 1),
      (function (a) {
        function u(B, P) {
          var tt = B.length
          B.push(P)
          t: for (; 0 < tt; ) {
            var dt = (tt - 1) >>> 1,
              _ = B[dt]
            if (0 < o(_, P)) (B[dt] = P), (B[tt] = _), (tt = dt)
            else break t
          }
        }
        function i(B) {
          return B.length === 0 ? null : B[0]
        }
        function r(B) {
          if (B.length === 0) return null
          var P = B[0],
            tt = B.pop()
          if (tt !== P) {
            B[0] = tt
            t: for (var dt = 0, _ = B.length, N = _ >>> 1; dt < N; ) {
              var F = 2 * (dt + 1) - 1,
                J = B[F],
                V = F + 1,
                ut = B[V]
              if (0 > o(J, tt))
                V < _ && 0 > o(ut, J)
                  ? ((B[dt] = ut), (B[V] = tt), (dt = V))
                  : ((B[dt] = J), (B[F] = tt), (dt = F))
              else if (V < _ && 0 > o(ut, tt)) (B[dt] = ut), (B[V] = tt), (dt = V)
              else break t
            }
          }
          return P
        }
        function o(B, P) {
          var tt = B.sortIndex - P.sortIndex
          return tt !== 0 ? tt : B.id - P.id
        }
        if (
          ((a.unstable_now = void 0),
          typeof performance == 'object' && typeof performance.now == 'function')
        ) {
          var f = performance
          a.unstable_now = function () {
            return f.now()
          }
        } else {
          var d = Date,
            y = d.now()
          a.unstable_now = function () {
            return d.now() - y
          }
        }
        var m = [],
          v = [],
          g = 1,
          S = null,
          T = 3,
          D = !1,
          w = !1,
          U = !1,
          Z = typeof setTimeout == 'function' ? setTimeout : null,
          G = typeof clearTimeout == 'function' ? clearTimeout : null,
          X = typeof setImmediate < 'u' ? setImmediate : null
        function nt(B) {
          for (var P = i(v); P !== null; ) {
            if (P.callback === null) r(v)
            else if (P.startTime <= B) r(v), (P.sortIndex = P.expirationTime), u(m, P)
            else break
            P = i(v)
          }
        }
        function yt(B) {
          if (((U = !1), nt(B), !w))
            if (i(m) !== null) (w = !0), vt()
            else {
              var P = i(v)
              P !== null && rt(yt, P.startTime - B)
            }
        }
        var Q = !1,
          $ = -1,
          ct = 5,
          L = -1
        function R() {
          return !(a.unstable_now() - L < ct)
        }
        function j() {
          if (Q) {
            var B = a.unstable_now()
            L = B
            var P = !0
            try {
              t: {
                ;(w = !1), U && ((U = !1), G($), ($ = -1)), (D = !0)
                var tt = T
                try {
                  e: {
                    for (nt(B), S = i(m); S !== null && !(S.expirationTime > B && R()); ) {
                      var dt = S.callback
                      if (typeof dt == 'function') {
                        ;(S.callback = null), (T = S.priorityLevel)
                        var _ = dt(S.expirationTime <= B)
                        if (((B = a.unstable_now()), typeof _ == 'function')) {
                          ;(S.callback = _), nt(B), (P = !0)
                          break e
                        }
                        S === i(m) && r(m), nt(B)
                      } else r(m)
                      S = i(m)
                    }
                    if (S !== null) P = !0
                    else {
                      var N = i(v)
                      N !== null && rt(yt, N.startTime - B), (P = !1)
                    }
                  }
                  break t
                } finally {
                  ;(S = null), (T = tt), (D = !1)
                }
                P = void 0
              }
            } finally {
              P ? Y() : (Q = !1)
            }
          }
        }
        var Y
        if (typeof X == 'function')
          Y = function () {
            X(j)
          }
        else if (typeof MessageChannel < 'u') {
          var K = new MessageChannel(),
            lt = K.port2
          ;(K.port1.onmessage = j),
            (Y = function () {
              lt.postMessage(null)
            })
        } else
          Y = function () {
            Z(j, 0)
          }
        function vt() {
          Q || ((Q = !0), Y())
        }
        function rt(B, P) {
          $ = Z(function () {
            B(a.unstable_now())
          }, P)
        }
        ;(a.unstable_IdlePriority = 5),
          (a.unstable_ImmediatePriority = 1),
          (a.unstable_LowPriority = 4),
          (a.unstable_NormalPriority = 3),
          (a.unstable_Profiling = null),
          (a.unstable_UserBlockingPriority = 2),
          (a.unstable_cancelCallback = function (B) {
            B.callback = null
          }),
          (a.unstable_continueExecution = function () {
            w || D || ((w = !0), vt())
          }),
          (a.unstable_forceFrameRate = function (B) {
            0 > B || 125 < B
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (ct = 0 < B ? Math.floor(1e3 / B) : 5)
          }),
          (a.unstable_getCurrentPriorityLevel = function () {
            return T
          }),
          (a.unstable_getFirstCallbackNode = function () {
            return i(m)
          }),
          (a.unstable_next = function (B) {
            switch (T) {
              case 1:
              case 2:
              case 3:
                var P = 3
                break
              default:
                P = T
            }
            var tt = T
            T = P
            try {
              return B()
            } finally {
              T = tt
            }
          }),
          (a.unstable_pauseExecution = function () {}),
          (a.unstable_requestPaint = function () {}),
          (a.unstable_runWithPriority = function (B, P) {
            switch (B) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break
              default:
                B = 3
            }
            var tt = T
            T = B
            try {
              return P()
            } finally {
              T = tt
            }
          }),
          (a.unstable_scheduleCallback = function (B, P, tt) {
            var dt = a.unstable_now()
            switch (
              (typeof tt == 'object' && tt !== null
                ? ((tt = tt.delay), (tt = typeof tt == 'number' && 0 < tt ? dt + tt : dt))
                : (tt = dt),
              B)
            ) {
              case 1:
                var _ = -1
                break
              case 2:
                _ = 250
                break
              case 5:
                _ = 1073741823
                break
              case 4:
                _ = 1e4
                break
              default:
                _ = 5e3
            }
            return (
              (_ = tt + _),
              (B = {
                id: g++,
                callback: P,
                priorityLevel: B,
                startTime: tt,
                expirationTime: _,
                sortIndex: -1,
              }),
              tt > dt
                ? ((B.sortIndex = tt),
                  u(v, B),
                  i(m) === null && B === i(v) && (U ? (G($), ($ = -1)) : (U = !0), rt(yt, tt - dt)))
                : ((B.sortIndex = _), u(m, B), w || D || ((w = !0), vt())),
              B
            )
          }),
          (a.unstable_shouldYield = R),
          (a.unstable_wrapCallback = function (B) {
            var P = T
            return function () {
              var tt = T
              T = P
              try {
                return B.apply(this, arguments)
              } finally {
                T = tt
              }
            }
          })
      })(xc)),
    xc
  )
}
var uy
function np() {
  return uy || ((uy = 1), (wc.exports = ep())), wc.exports
}
var zc = { exports: {} },
  le = {}
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var sy
function lp() {
  if (sy) return le
  sy = 1
  var a = Ni()
  function u(m) {
    var v = 'https://react.dev/errors/' + m
    if (1 < arguments.length) {
      v += '?args[]=' + encodeURIComponent(arguments[1])
      for (var g = 2; g < arguments.length; g++) v += '&args[]=' + encodeURIComponent(arguments[g])
    }
    return (
      'Minified React error #' +
      m +
      '; visit ' +
      v +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    )
  }
  function i() {}
  var r = {
      d: {
        f: i,
        r: function () {
          throw Error(u(522))
        },
        D: i,
        C: i,
        L: i,
        m: i,
        X: i,
        S: i,
        M: i,
      },
      p: 0,
      findDOMNode: null,
    },
    o = Symbol.for('react.portal')
  function f(m, v, g) {
    var S = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null
    return {
      $$typeof: o,
      key: S == null ? null : '' + S,
      children: m,
      containerInfo: v,
      implementation: g,
    }
  }
  var d = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  function y(m, v) {
    if (m === 'font') return ''
    if (typeof v == 'string') return v === 'use-credentials' ? v : ''
  }
  return (
    (le.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
    (le.createPortal = function (m, v) {
      var g = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null
      if (!v || (v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)) throw Error(u(299))
      return f(m, v, null, g)
    }),
    (le.flushSync = function (m) {
      var v = d.T,
        g = r.p
      try {
        if (((d.T = null), (r.p = 2), m)) return m()
      } finally {
        ;(d.T = v), (r.p = g), r.d.f()
      }
    }),
    (le.preconnect = function (m, v) {
      typeof m == 'string' &&
        (v
          ? ((v = v.crossOrigin),
            (v = typeof v == 'string' ? (v === 'use-credentials' ? v : '') : void 0))
          : (v = null),
        r.d.C(m, v))
    }),
    (le.prefetchDNS = function (m) {
      typeof m == 'string' && r.d.D(m)
    }),
    (le.preinit = function (m, v) {
      if (typeof m == 'string' && v && typeof v.as == 'string') {
        var g = v.as,
          S = y(g, v.crossOrigin),
          T = typeof v.integrity == 'string' ? v.integrity : void 0,
          D = typeof v.fetchPriority == 'string' ? v.fetchPriority : void 0
        g === 'style'
          ? r.d.S(m, typeof v.precedence == 'string' ? v.precedence : void 0, {
              crossOrigin: S,
              integrity: T,
              fetchPriority: D,
            })
          : g === 'script' &&
            r.d.X(m, {
              crossOrigin: S,
              integrity: T,
              fetchPriority: D,
              nonce: typeof v.nonce == 'string' ? v.nonce : void 0,
            })
      }
    }),
    (le.preinitModule = function (m, v) {
      if (typeof m == 'string')
        if (typeof v == 'object' && v !== null) {
          if (v.as == null || v.as === 'script') {
            var g = y(v.as, v.crossOrigin)
            r.d.M(m, {
              crossOrigin: g,
              integrity: typeof v.integrity == 'string' ? v.integrity : void 0,
              nonce: typeof v.nonce == 'string' ? v.nonce : void 0,
            })
          }
        } else v == null && r.d.M(m)
    }),
    (le.preload = function (m, v) {
      if (typeof m == 'string' && typeof v == 'object' && v !== null && typeof v.as == 'string') {
        var g = v.as,
          S = y(g, v.crossOrigin)
        r.d.L(m, g, {
          crossOrigin: S,
          integrity: typeof v.integrity == 'string' ? v.integrity : void 0,
          nonce: typeof v.nonce == 'string' ? v.nonce : void 0,
          type: typeof v.type == 'string' ? v.type : void 0,
          fetchPriority: typeof v.fetchPriority == 'string' ? v.fetchPriority : void 0,
          referrerPolicy: typeof v.referrerPolicy == 'string' ? v.referrerPolicy : void 0,
          imageSrcSet: typeof v.imageSrcSet == 'string' ? v.imageSrcSet : void 0,
          imageSizes: typeof v.imageSizes == 'string' ? v.imageSizes : void 0,
          media: typeof v.media == 'string' ? v.media : void 0,
        })
      }
    }),
    (le.preloadModule = function (m, v) {
      if (typeof m == 'string')
        if (v) {
          var g = y(v.as, v.crossOrigin)
          r.d.m(m, {
            as: typeof v.as == 'string' && v.as !== 'script' ? v.as : void 0,
            crossOrigin: g,
            integrity: typeof v.integrity == 'string' ? v.integrity : void 0,
          })
        } else r.d.m(m)
    }),
    (le.requestFormReset = function (m) {
      r.d.r(m)
    }),
    (le.unstable_batchedUpdates = function (m, v) {
      return m(v)
    }),
    (le.useFormState = function (m, v, g) {
      return d.H.useFormState(m, v, g)
    }),
    (le.useFormStatus = function () {
      return d.H.useHostTransitionStatus()
    }),
    (le.version = '19.0.0'),
    le
  )
}
var ry
function ap() {
  if (ry) return zc.exports
  ry = 1
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)
      } catch (u) {
        console.error(u)
      }
  }
  return a(), (zc.exports = lp()), zc.exports
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var cy
function ip() {
  if (cy) return pi
  cy = 1
  var a = np(),
    u = Ni(),
    i = ap()
  function r(t) {
    var e = 'https://react.dev/errors/' + t
    if (1 < arguments.length) {
      e += '?args[]=' + encodeURIComponent(arguments[1])
      for (var n = 2; n < arguments.length; n++) e += '&args[]=' + encodeURIComponent(arguments[n])
    }
    return (
      'Minified React error #' +
      t +
      '; visit ' +
      e +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    )
  }
  function o(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
  }
  var f = Symbol.for('react.element'),
    d = Symbol.for('react.transitional.element'),
    y = Symbol.for('react.portal'),
    m = Symbol.for('react.fragment'),
    v = Symbol.for('react.strict_mode'),
    g = Symbol.for('react.profiler'),
    S = Symbol.for('react.provider'),
    T = Symbol.for('react.consumer'),
    D = Symbol.for('react.context'),
    w = Symbol.for('react.forward_ref'),
    U = Symbol.for('react.suspense'),
    Z = Symbol.for('react.suspense_list'),
    G = Symbol.for('react.memo'),
    X = Symbol.for('react.lazy'),
    nt = Symbol.for('react.offscreen'),
    yt = Symbol.for('react.memo_cache_sentinel'),
    Q = Symbol.iterator
  function $(t) {
    return t === null || typeof t != 'object'
      ? null
      : ((t = (Q && t[Q]) || t['@@iterator']), typeof t == 'function' ? t : null)
  }
  var ct = Symbol.for('react.client.reference')
  function L(t) {
    if (t == null) return null
    if (typeof t == 'function') return t.$$typeof === ct ? null : t.displayName || t.name || null
    if (typeof t == 'string') return t
    switch (t) {
      case m:
        return 'Fragment'
      case y:
        return 'Portal'
      case g:
        return 'Profiler'
      case v:
        return 'StrictMode'
      case U:
        return 'Suspense'
      case Z:
        return 'SuspenseList'
    }
    if (typeof t == 'object')
      switch (t.$$typeof) {
        case D:
          return (t.displayName || 'Context') + '.Provider'
        case T:
          return (t._context.displayName || 'Context') + '.Consumer'
        case w:
          var e = t.render
          return (
            (t = t.displayName),
            t ||
              ((t = e.displayName || e.name || ''),
              (t = t !== '' ? 'ForwardRef(' + t + ')' : 'ForwardRef')),
            t
          )
        case G:
          return (e = t.displayName || null), e !== null ? e : L(t.type) || 'Memo'
        case X:
          ;(e = t._payload), (t = t._init)
          try {
            return L(t(e))
          } catch {}
      }
    return null
  }
  var R = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    j = Object.assign,
    Y,
    K
  function lt(t) {
    if (Y === void 0)
      try {
        throw Error()
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/)
        ;(Y = (e && e[1]) || ''),
          (K =
            -1 <
            n.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < n.stack.indexOf('@')
              ? '@unknown:0:0'
              : '')
      }
    return (
      `
` +
      Y +
      t +
      K
    )
  }
  var vt = !1
  function rt(t, e) {
    if (!t || vt) return ''
    vt = !0
    var n = Error.prepareStackTrace
    Error.prepareStackTrace = void 0
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var H = function () {
                throw Error()
              }
              if (
                (Object.defineProperty(H.prototype, 'props', {
                  set: function () {
                    throw Error()
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(H, [])
                } catch (x) {
                  var C = x
                }
                Reflect.construct(t, [], H)
              } else {
                try {
                  H.call()
                } catch (x) {
                  C = x
                }
                t.call(H.prototype)
              }
            } else {
              try {
                throw Error()
              } catch (x) {
                C = x
              }
              ;(H = t()) && typeof H.catch == 'function' && H.catch(function () {})
            }
          } catch (x) {
            if (x && C && typeof x.stack == 'string') return [x.stack, C.stack]
          }
          return [null, null]
        },
      }
      l.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot'
      var s = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, 'name')
      s &&
        s.configurable &&
        Object.defineProperty(l.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        })
      var c = l.DetermineComponentFrameRoot(),
        h = c[0],
        p = c[1]
      if (h && p) {
        var b = h.split(`
`),
          O = p.split(`
`)
        for (s = l = 0; l < b.length && !b[l].includes('DetermineComponentFrameRoot'); ) l++
        for (; s < O.length && !O[s].includes('DetermineComponentFrameRoot'); ) s++
        if (l === b.length || s === O.length)
          for (l = b.length - 1, s = O.length - 1; 1 <= l && 0 <= s && b[l] !== O[s]; ) s--
        for (; 1 <= l && 0 <= s; l--, s--)
          if (b[l] !== O[s]) {
            if (l !== 1 || s !== 1)
              do
                if ((l--, s--, 0 > s || b[l] !== O[s])) {
                  var z =
                    `
` + b[l].replace(' at new ', ' at ')
                  return (
                    t.displayName &&
                      z.includes('<anonymous>') &&
                      (z = z.replace('<anonymous>', t.displayName)),
                    z
                  )
                }
              while (1 <= l && 0 <= s)
            break
          }
      }
    } finally {
      ;(vt = !1), (Error.prepareStackTrace = n)
    }
    return (n = t ? t.displayName || t.name : '') ? lt(n) : ''
  }
  function B(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return lt(t.type)
      case 16:
        return lt('Lazy')
      case 13:
        return lt('Suspense')
      case 19:
        return lt('SuspenseList')
      case 0:
      case 15:
        return (t = rt(t.type, !1)), t
      case 11:
        return (t = rt(t.type.render, !1)), t
      case 1:
        return (t = rt(t.type, !0)), t
      default:
        return ''
    }
  }
  function P(t) {
    try {
      var e = ''
      do (e += B(t)), (t = t.return)
      while (t)
      return e
    } catch (n) {
      return (
        `
Error generating stack: ` +
        n.message +
        `
` +
        n.stack
      )
    }
  }
  function tt(t) {
    var e = t,
      n = t
    if (t.alternate) for (; e.return; ) e = e.return
    else {
      t = e
      do (e = t), (e.flags & 4098) !== 0 && (n = e.return), (t = e.return)
      while (t)
    }
    return e.tag === 3 ? n : null
  }
  function dt(t) {
    if (t.tag === 13) {
      var e = t.memoizedState
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
        return e.dehydrated
    }
    return null
  }
  function _(t) {
    if (tt(t) !== t) throw Error(r(188))
  }
  function N(t) {
    var e = t.alternate
    if (!e) {
      if (((e = tt(t)), e === null)) throw Error(r(188))
      return e !== t ? null : t
    }
    for (var n = t, l = e; ; ) {
      var s = n.return
      if (s === null) break
      var c = s.alternate
      if (c === null) {
        if (((l = s.return), l !== null)) {
          n = l
          continue
        }
        break
      }
      if (s.child === c.child) {
        for (c = s.child; c; ) {
          if (c === n) return _(s), t
          if (c === l) return _(s), e
          c = c.sibling
        }
        throw Error(r(188))
      }
      if (n.return !== l.return) (n = s), (l = c)
      else {
        for (var h = !1, p = s.child; p; ) {
          if (p === n) {
            ;(h = !0), (n = s), (l = c)
            break
          }
          if (p === l) {
            ;(h = !0), (l = s), (n = c)
            break
          }
          p = p.sibling
        }
        if (!h) {
          for (p = c.child; p; ) {
            if (p === n) {
              ;(h = !0), (n = c), (l = s)
              break
            }
            if (p === l) {
              ;(h = !0), (l = c), (n = s)
              break
            }
            p = p.sibling
          }
          if (!h) throw Error(r(189))
        }
      }
      if (n.alternate !== l) throw Error(r(190))
    }
    if (n.tag !== 3) throw Error(r(188))
    return n.stateNode.current === n ? t : e
  }
  function F(t) {
    var e = t.tag
    if (e === 5 || e === 26 || e === 27 || e === 6) return t
    for (t = t.child; t !== null; ) {
      if (((e = F(t)), e !== null)) return e
      t = t.sibling
    }
    return null
  }
  var J = Array.isArray,
    V = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ut = { pending: !1, data: null, method: null, action: null },
    I = [],
    Ct = -1
  function it(t) {
    return { current: t }
  }
  function _t(t) {
    0 > Ct || ((t.current = I[Ct]), (I[Ct] = null), Ct--)
  }
  function Rt(t, e) {
    Ct++, (I[Ct] = t.current), (t.current = e)
  }
  var kt = it(null),
    Xe = it(null),
    ie = it(null),
    Nt = it(null)
  function ye(t, e) {
    switch ((Rt(ie, e), Rt(Xe, t), Rt(kt, null), (t = e.nodeType), t)) {
      case 9:
      case 11:
        e = (e = e.documentElement) && (e = e.namespaceURI) ? wh(e) : 0
        break
      default:
        if (((t = t === 8 ? e.parentNode : e), (e = t.tagName), (t = t.namespaceURI)))
          (t = wh(t)), (e = xh(t, e))
        else
          switch (e) {
            case 'svg':
              e = 1
              break
            case 'math':
              e = 2
              break
            default:
              e = 0
          }
    }
    _t(kt), Rt(kt, e)
  }
  function Bt() {
    _t(kt), _t(Xe), _t(ie)
  }
  function Fn(t) {
    t.memoizedState !== null && Rt(Nt, t)
    var e = kt.current,
      n = xh(e, t.type)
    e !== n && (Rt(Xe, t), Rt(kt, n))
  }
  function Jn(t) {
    Xe.current === t && (_t(kt), _t(Xe)), Nt.current === t && (_t(Nt), (fi._currentValue = ut))
  }
  var va = Object.prototype.hasOwnProperty,
    pa = a.unstable_scheduleCallback,
    ga = a.unstable_cancelCallback,
    Sa = a.unstable_shouldYield,
    wm = a.unstable_requestPaint,
    Ke = a.unstable_now,
    xm = a.unstable_getCurrentPriorityLevel,
    go = a.unstable_ImmediatePriority,
    So = a.unstable_UserBlockingPriority,
    Li = a.unstable_NormalPriority,
    zm = a.unstable_LowPriority,
    bo = a.unstable_IdlePriority,
    Um = a.log,
    Nm = a.unstable_setDisableYieldValue,
    ba = null,
    me = null
  function Lm(t) {
    if (me && typeof me.onCommitFiberRoot == 'function')
      try {
        me.onCommitFiberRoot(ba, t, void 0, (t.current.flags & 128) === 128)
      } catch {}
  }
  function En(t) {
    if ((typeof Um == 'function' && Nm(t), me && typeof me.setStrictMode == 'function'))
      try {
        me.setStrictMode(ba, t)
      } catch {}
  }
  var ve = Math.clz32 ? Math.clz32 : Hm,
    qm = Math.log,
    jm = Math.LN2
  function Hm(t) {
    return (t >>>= 0), t === 0 ? 32 : (31 - ((qm(t) / jm) | 0)) | 0
  }
  var qi = 128,
    ji = 4194304
  function Pn(t) {
    var e = t & 42
    if (e !== 0) return e
    switch (t & -t) {
      case 1:
        return 1
      case 2:
        return 2
      case 4:
        return 4
      case 8:
        return 8
      case 16:
        return 16
      case 32:
        return 32
      case 64:
        return 64
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194176
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560
      case 67108864:
        return 67108864
      case 134217728:
        return 134217728
      case 268435456:
        return 268435456
      case 536870912:
        return 536870912
      case 1073741824:
        return 0
      default:
        return t
    }
  }
  function Hi(t, e) {
    var n = t.pendingLanes
    if (n === 0) return 0
    var l = 0,
      s = t.suspendedLanes,
      c = t.pingedLanes,
      h = t.warmLanes
    t = t.finishedLanes !== 0
    var p = n & 134217727
    return (
      p !== 0
        ? ((n = p & ~s),
          n !== 0
            ? (l = Pn(n))
            : ((c &= p), c !== 0 ? (l = Pn(c)) : t || ((h = p & ~h), h !== 0 && (l = Pn(h)))))
        : ((p = n & ~s),
          p !== 0
            ? (l = Pn(p))
            : c !== 0
            ? (l = Pn(c))
            : t || ((h = n & ~h), h !== 0 && (l = Pn(h)))),
      l === 0
        ? 0
        : e !== 0 &&
          e !== l &&
          (e & s) === 0 &&
          ((s = l & -l), (h = e & -e), s >= h || (s === 32 && (h & 4194176) !== 0))
        ? e
        : l
    )
  }
  function _a(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0
  }
  function Bm(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
        return e + 250
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1
      default:
        return -1
    }
  }
  function _o() {
    var t = qi
    return (qi <<= 1), (qi & 4194176) === 0 && (qi = 128), t
  }
  function Eo() {
    var t = ji
    return (ji <<= 1), (ji & 62914560) === 0 && (ji = 4194304), t
  }
  function Es(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t)
    return e
  }
  function Ea(t, e) {
    ;(t.pendingLanes |= e),
      e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0))
  }
  function Qm(t, e, n, l, s, c) {
    var h = t.pendingLanes
    ;(t.pendingLanes = n),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= n),
      (t.entangledLanes &= n),
      (t.errorRecoveryDisabledLanes &= n),
      (t.shellSuspendCounter = 0)
    var p = t.entanglements,
      b = t.expirationTimes,
      O = t.hiddenUpdates
    for (n = h & ~n; 0 < n; ) {
      var z = 31 - ve(n),
        H = 1 << z
      ;(p[z] = 0), (b[z] = -1)
      var C = O[z]
      if (C !== null)
        for (O[z] = null, z = 0; z < C.length; z++) {
          var x = C[z]
          x !== null && (x.lane &= -536870913)
        }
      n &= ~H
    }
    l !== 0 && Oo(t, l, 0), c !== 0 && s === 0 && t.tag !== 0 && (t.suspendedLanes |= c & ~(h & ~e))
  }
  function Oo(t, e, n) {
    ;(t.pendingLanes |= e), (t.suspendedLanes &= ~e)
    var l = 31 - ve(e)
    ;(t.entangledLanes |= e), (t.entanglements[l] = t.entanglements[l] | 1073741824 | (n & 4194218))
  }
  function To(t, e) {
    var n = (t.entangledLanes |= e)
    for (t = t.entanglements; n; ) {
      var l = 31 - ve(n),
        s = 1 << l
      ;(s & e) | (t[l] & e) && (t[l] |= e), (n &= ~s)
    }
  }
  function Ro(t) {
    return (t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
  }
  function Mo() {
    var t = V.p
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : Jh(t.type))
  }
  function Gm(t, e) {
    var n = V.p
    try {
      return (V.p = t), e()
    } finally {
      V.p = n
    }
  }
  var On = Math.random().toString(36).slice(2),
    ee = '__reactFiber$' + On,
    oe = '__reactProps$' + On,
    Tl = '__reactContainer$' + On,
    Os = '__reactEvents$' + On,
    Ym = '__reactListeners$' + On,
    Vm = '__reactHandles$' + On,
    Ao = '__reactResources$' + On,
    Oa = '__reactMarker$' + On
  function Ts(t) {
    delete t[ee], delete t[oe], delete t[Os], delete t[Ym], delete t[Vm]
  }
  function $n(t) {
    var e = t[ee]
    if (e) return e
    for (var n = t.parentNode; n; ) {
      if ((e = n[Tl] || n[ee])) {
        if (((n = e.alternate), e.child !== null || (n !== null && n.child !== null)))
          for (t = Nh(t); t !== null; ) {
            if ((n = t[ee])) return n
            t = Nh(t)
          }
        return e
      }
      ;(t = n), (n = t.parentNode)
    }
    return null
  }
  function Rl(t) {
    if ((t = t[ee] || t[Tl])) {
      var e = t.tag
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3) return t
    }
    return null
  }
  function Ta(t) {
    var e = t.tag
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode
    throw Error(r(33))
  }
  function Ml(t) {
    var e = t[Ao]
    return e || (e = t[Ao] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e
  }
  function Ft(t) {
    t[Oa] = !0
  }
  var Do = new Set(),
    Co = {}
  function Wn(t, e) {
    Al(t, e), Al(t + 'Capture', e)
  }
  function Al(t, e) {
    for (Co[t] = e, t = 0; t < e.length; t++) Do.add(e[t])
  }
  var Ie = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    Xm = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
    ),
    wo = {},
    xo = {}
  function Km(t) {
    return va.call(xo, t)
      ? !0
      : va.call(wo, t)
      ? !1
      : Xm.test(t)
      ? (xo[t] = !0)
      : ((wo[t] = !0), !1)
  }
  function Bi(t, e, n) {
    if (Km(e))
      if (n === null) t.removeAttribute(e)
      else {
        switch (typeof n) {
          case 'undefined':
          case 'function':
          case 'symbol':
            t.removeAttribute(e)
            return
          case 'boolean':
            var l = e.toLowerCase().slice(0, 5)
            if (l !== 'data-' && l !== 'aria-') {
              t.removeAttribute(e)
              return
            }
        }
        t.setAttribute(e, '' + n)
      }
  }
  function Qi(t, e, n) {
    if (n === null) t.removeAttribute(e)
    else {
      switch (typeof n) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(e)
          return
      }
      t.setAttribute(e, '' + n)
    }
  }
  function tn(t, e, n, l) {
    if (l === null) t.removeAttribute(n)
    else {
      switch (typeof l) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(n)
          return
      }
      t.setAttributeNS(e, n, '' + l)
    }
  }
  function Ee(t) {
    switch (typeof t) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return t
      case 'object':
        return t
      default:
        return ''
    }
  }
  function zo(t) {
    var e = t.type
    return (t = t.nodeName) && t.toLowerCase() === 'input' && (e === 'checkbox' || e === 'radio')
  }
  function Zm(t) {
    var e = zo(t) ? 'checked' : 'value',
      n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
      l = '' + t[e]
    if (
      !t.hasOwnProperty(e) &&
      typeof n < 'u' &&
      typeof n.get == 'function' &&
      typeof n.set == 'function'
    ) {
      var s = n.get,
        c = n.set
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return s.call(this)
          },
          set: function (h) {
            ;(l = '' + h), c.call(this, h)
          },
        }),
        Object.defineProperty(t, e, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return l
          },
          setValue: function (h) {
            l = '' + h
          },
          stopTracking: function () {
            ;(t._valueTracker = null), delete t[e]
          },
        }
      )
    }
  }
  function Gi(t) {
    t._valueTracker || (t._valueTracker = Zm(t))
  }
  function Uo(t) {
    if (!t) return !1
    var e = t._valueTracker
    if (!e) return !0
    var n = e.getValue(),
      l = ''
    return (
      t && (l = zo(t) ? (t.checked ? 'true' : 'false') : t.value),
      (t = l),
      t !== n ? (e.setValue(t), !0) : !1
    )
  }
  function Yi(t) {
    if (((t = t || (typeof document < 'u' ? document : void 0)), typeof t > 'u')) return null
    try {
      return t.activeElement || t.body
    } catch {
      return t.body
    }
  }
  var km = /[\n"\\]/g
  function Oe(t) {
    return t.replace(km, function (e) {
      return '\\' + e.charCodeAt(0).toString(16) + ' '
    })
  }
  function Rs(t, e, n, l, s, c, h, p) {
    ;(t.name = ''),
      h != null && typeof h != 'function' && typeof h != 'symbol' && typeof h != 'boolean'
        ? (t.type = h)
        : t.removeAttribute('type'),
      e != null
        ? h === 'number'
          ? ((e === 0 && t.value === '') || t.value != e) && (t.value = '' + Ee(e))
          : t.value !== '' + Ee(e) && (t.value = '' + Ee(e))
        : (h !== 'submit' && h !== 'reset') || t.removeAttribute('value'),
      e != null
        ? Ms(t, h, Ee(e))
        : n != null
        ? Ms(t, h, Ee(n))
        : l != null && t.removeAttribute('value'),
      s == null && c != null && (t.defaultChecked = !!c),
      s != null && (t.checked = s && typeof s != 'function' && typeof s != 'symbol'),
      p != null && typeof p != 'function' && typeof p != 'symbol' && typeof p != 'boolean'
        ? (t.name = '' + Ee(p))
        : t.removeAttribute('name')
  }
  function No(t, e, n, l, s, c, h, p) {
    if (
      (c != null &&
        typeof c != 'function' &&
        typeof c != 'symbol' &&
        typeof c != 'boolean' &&
        (t.type = c),
      e != null || n != null)
    ) {
      if (!((c !== 'submit' && c !== 'reset') || e != null)) return
      ;(n = n != null ? '' + Ee(n) : ''),
        (e = e != null ? '' + Ee(e) : n),
        p || e === t.value || (t.value = e),
        (t.defaultValue = e)
    }
    ;(l = l ?? s),
      (l = typeof l != 'function' && typeof l != 'symbol' && !!l),
      (t.checked = p ? t.checked : !!l),
      (t.defaultChecked = !!l),
      h != null &&
        typeof h != 'function' &&
        typeof h != 'symbol' &&
        typeof h != 'boolean' &&
        (t.name = h)
  }
  function Ms(t, e, n) {
    ;(e === 'number' && Yi(t.ownerDocument) === t) ||
      t.defaultValue === '' + n ||
      (t.defaultValue = '' + n)
  }
  function Dl(t, e, n, l) {
    if (((t = t.options), e)) {
      e = {}
      for (var s = 0; s < n.length; s++) e['$' + n[s]] = !0
      for (n = 0; n < t.length; n++)
        (s = e.hasOwnProperty('$' + t[n].value)),
          t[n].selected !== s && (t[n].selected = s),
          s && l && (t[n].defaultSelected = !0)
    } else {
      for (n = '' + Ee(n), e = null, s = 0; s < t.length; s++) {
        if (t[s].value === n) {
          ;(t[s].selected = !0), l && (t[s].defaultSelected = !0)
          return
        }
        e !== null || t[s].disabled || (e = t[s])
      }
      e !== null && (e.selected = !0)
    }
  }
  function Lo(t, e, n) {
    if (e != null && ((e = '' + Ee(e)), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e)
      return
    }
    t.defaultValue = n != null ? '' + Ee(n) : ''
  }
  function qo(t, e, n, l) {
    if (e == null) {
      if (l != null) {
        if (n != null) throw Error(r(92))
        if (J(l)) {
          if (1 < l.length) throw Error(r(93))
          l = l[0]
        }
        n = l
      }
      n == null && (n = ''), (e = n)
    }
    ;(n = Ee(e)),
      (t.defaultValue = n),
      (l = t.textContent),
      l === n && l !== '' && l !== null && (t.value = l)
  }
  function Cl(t, e) {
    if (e) {
      var n = t.firstChild
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e
        return
      }
    }
    t.textContent = e
  }
  var Fm = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' ',
    ),
  )
  function jo(t, e, n) {
    var l = e.indexOf('--') === 0
    n == null || typeof n == 'boolean' || n === ''
      ? l
        ? t.setProperty(e, '')
        : e === 'float'
        ? (t.cssFloat = '')
        : (t[e] = '')
      : l
      ? t.setProperty(e, n)
      : typeof n != 'number' || n === 0 || Fm.has(e)
      ? e === 'float'
        ? (t.cssFloat = n)
        : (t[e] = ('' + n).trim())
      : (t[e] = n + 'px')
  }
  function Ho(t, e, n) {
    if (e != null && typeof e != 'object') throw Error(r(62))
    if (((t = t.style), n != null)) {
      for (var l in n)
        !n.hasOwnProperty(l) ||
          (e != null && e.hasOwnProperty(l)) ||
          (l.indexOf('--') === 0
            ? t.setProperty(l, '')
            : l === 'float'
            ? (t.cssFloat = '')
            : (t[l] = ''))
      for (var s in e) (l = e[s]), e.hasOwnProperty(s) && n[s] !== l && jo(t, s, l)
    } else for (var c in e) e.hasOwnProperty(c) && jo(t, c, e[c])
  }
  function As(t) {
    if (t.indexOf('-') === -1) return !1
    switch (t) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1
      default:
        return !0
    }
  }
  var Jm = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    Pm =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i
  function Vi(t) {
    return Pm.test('' + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t
  }
  var Ds = null
  function Cs(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    )
  }
  var wl = null,
    xl = null
  function Bo(t) {
    var e = Rl(t)
    if (e && (t = e.stateNode)) {
      var n = t[oe] || null
      t: switch (((t = e.stateNode), e.type)) {
        case 'input':
          if (
            (Rs(
              t,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (e = n.name),
            n.type === 'radio' && e != null)
          ) {
            for (n = t; n.parentNode; ) n = n.parentNode
            for (
              n = n.querySelectorAll('input[name="' + Oe('' + e) + '"][type="radio"]'), e = 0;
              e < n.length;
              e++
            ) {
              var l = n[e]
              if (l !== t && l.form === t.form) {
                var s = l[oe] || null
                if (!s) throw Error(r(90))
                Rs(
                  l,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name,
                )
              }
            }
            for (e = 0; e < n.length; e++) (l = n[e]), l.form === t.form && Uo(l)
          }
          break t
        case 'textarea':
          Lo(t, n.value, n.defaultValue)
          break t
        case 'select':
          ;(e = n.value), e != null && Dl(t, !!n.multiple, e, !1)
      }
    }
  }
  var ws = !1
  function Qo(t, e, n) {
    if (ws) return t(e, n)
    ws = !0
    try {
      var l = t(e)
      return l
    } finally {
      if (
        ((ws = !1),
        (wl !== null || xl !== null) &&
          (Mu(), wl && ((e = wl), (t = xl), (xl = wl = null), Bo(e), t)))
      )
        for (e = 0; e < t.length; e++) Bo(t[e])
    }
  }
  function Ra(t, e) {
    var n = t.stateNode
    if (n === null) return null
    var l = n[oe] || null
    if (l === null) return null
    n = l[e]
    t: switch (e) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ;(l = !l.disabled) ||
          ((t = t.type),
          (l = !(t === 'button' || t === 'input' || t === 'select' || t === 'textarea'))),
          (t = !l)
        break t
      default:
        t = !1
    }
    if (t) return null
    if (n && typeof n != 'function') throw Error(r(231, e, typeof n))
    return n
  }
  var xs = !1
  if (Ie)
    try {
      var Ma = {}
      Object.defineProperty(Ma, 'passive', {
        get: function () {
          xs = !0
        },
      }),
        window.addEventListener('test', Ma, Ma),
        window.removeEventListener('test', Ma, Ma)
    } catch {
      xs = !1
    }
  var Tn = null,
    zs = null,
    Xi = null
  function Go() {
    if (Xi) return Xi
    var t,
      e = zs,
      n = e.length,
      l,
      s = 'value' in Tn ? Tn.value : Tn.textContent,
      c = s.length
    for (t = 0; t < n && e[t] === s[t]; t++);
    var h = n - t
    for (l = 1; l <= h && e[n - l] === s[c - l]; l++);
    return (Xi = s.slice(t, 1 < l ? 1 - l : void 0))
  }
  function Ki(t) {
    var e = t.keyCode
    return (
      'charCode' in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    )
  }
  function Zi() {
    return !0
  }
  function Yo() {
    return !1
  }
  function fe(t) {
    function e(n, l, s, c, h) {
      ;(this._reactName = n),
        (this._targetInst = s),
        (this.type = l),
        (this.nativeEvent = c),
        (this.target = h),
        (this.currentTarget = null)
      for (var p in t) t.hasOwnProperty(p) && ((n = t[p]), (this[p] = n ? n(c) : c[p]))
      return (
        (this.isDefaultPrevented = (
          c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1
        )
          ? Zi
          : Yo),
        (this.isPropagationStopped = Yo),
        this
      )
    }
    return (
      j(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0
          var n = this.nativeEvent
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
            (this.isDefaultPrevented = Zi))
        },
        stopPropagation: function () {
          var n = this.nativeEvent
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
            (this.isPropagationStopped = Zi))
        },
        persist: function () {},
        isPersistent: Zi,
      }),
      e
    )
  }
  var In = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now()
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    ki = fe(In),
    Aa = j({}, In, { view: 0, detail: 0 }),
    $m = fe(Aa),
    Us,
    Ns,
    Da,
    Fi = j({}, Aa, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: qs,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget
      },
      movementX: function (t) {
        return 'movementX' in t
          ? t.movementX
          : (t !== Da &&
              (Da && t.type === 'mousemove'
                ? ((Us = t.screenX - Da.screenX), (Ns = t.screenY - Da.screenY))
                : (Ns = Us = 0),
              (Da = t)),
            Us)
      },
      movementY: function (t) {
        return 'movementY' in t ? t.movementY : Ns
      },
    }),
    Vo = fe(Fi),
    Wm = j({}, Fi, { dataTransfer: 0 }),
    Im = fe(Wm),
    tv = j({}, Aa, { relatedTarget: 0 }),
    Ls = fe(tv),
    ev = j({}, In, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    nv = fe(ev),
    lv = j({}, In, {
      clipboardData: function (t) {
        return 'clipboardData' in t ? t.clipboardData : window.clipboardData
      },
    }),
    av = fe(lv),
    iv = j({}, In, { data: 0 }),
    Xo = fe(iv),
    uv = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    sv = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    rv = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' }
  function cv(t) {
    var e = this.nativeEvent
    return e.getModifierState ? e.getModifierState(t) : (t = rv[t]) ? !!e[t] : !1
  }
  function qs() {
    return cv
  }
  var ov = j({}, Aa, {
      key: function (t) {
        if (t.key) {
          var e = uv[t.key] || t.key
          if (e !== 'Unidentified') return e
        }
        return t.type === 'keypress'
          ? ((t = Ki(t)), t === 13 ? 'Enter' : String.fromCharCode(t))
          : t.type === 'keydown' || t.type === 'keyup'
          ? sv[t.keyCode] || 'Unidentified'
          : ''
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: qs,
      charCode: function (t) {
        return t.type === 'keypress' ? Ki(t) : 0
      },
      keyCode: function (t) {
        return t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0
      },
      which: function (t) {
        return t.type === 'keypress'
          ? Ki(t)
          : t.type === 'keydown' || t.type === 'keyup'
          ? t.keyCode
          : 0
      },
    }),
    fv = fe(ov),
    dv = j({}, Fi, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Ko = fe(dv),
    hv = j({}, Aa, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: qs,
    }),
    yv = fe(hv),
    mv = j({}, In, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    vv = fe(mv),
    pv = j({}, Fi, {
      deltaX: function (t) {
        return 'deltaX' in t ? t.deltaX : 'wheelDeltaX' in t ? -t.wheelDeltaX : 0
      },
      deltaY: function (t) {
        return 'deltaY' in t
          ? t.deltaY
          : 'wheelDeltaY' in t
          ? -t.wheelDeltaY
          : 'wheelDelta' in t
          ? -t.wheelDelta
          : 0
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    gv = fe(pv),
    Sv = j({}, In, { newState: 0, oldState: 0 }),
    bv = fe(Sv),
    _v = [9, 13, 27, 32],
    js = Ie && 'CompositionEvent' in window,
    Ca = null
  Ie && 'documentMode' in document && (Ca = document.documentMode)
  var Ev = Ie && 'TextEvent' in window && !Ca,
    Zo = Ie && (!js || (Ca && 8 < Ca && 11 >= Ca)),
    ko = ' ',
    Fo = !1
  function Jo(t, e) {
    switch (t) {
      case 'keyup':
        return _v.indexOf(e.keyCode) !== -1
      case 'keydown':
        return e.keyCode !== 229
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0
      default:
        return !1
    }
  }
  function Po(t) {
    return (t = t.detail), typeof t == 'object' && 'data' in t ? t.data : null
  }
  var zl = !1
  function Ov(t, e) {
    switch (t) {
      case 'compositionend':
        return Po(e)
      case 'keypress':
        return e.which !== 32 ? null : ((Fo = !0), ko)
      case 'textInput':
        return (t = e.data), t === ko && Fo ? null : t
      default:
        return null
    }
  }
  function Tv(t, e) {
    if (zl)
      return t === 'compositionend' || (!js && Jo(t, e))
        ? ((t = Go()), (Xi = zs = Tn = null), (zl = !1), t)
        : null
    switch (t) {
      case 'paste':
        return null
      case 'keypress':
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char
          if (e.which) return String.fromCharCode(e.which)
        }
        return null
      case 'compositionend':
        return Zo && e.locale !== 'ko' ? null : e.data
      default:
        return null
    }
  }
  var Rv = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  }
  function $o(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase()
    return e === 'input' ? !!Rv[t.type] : e === 'textarea'
  }
  function Wo(t, e, n, l) {
    wl ? (xl ? xl.push(l) : (xl = [l])) : (wl = l),
      (e = xu(e, 'onChange')),
      0 < e.length &&
        ((n = new ki('onChange', 'change', null, n, l)), t.push({ event: n, listeners: e }))
  }
  var wa = null,
    xa = null
  function Mv(t) {
    Rh(t, 0)
  }
  function Ji(t) {
    var e = Ta(t)
    if (Uo(e)) return t
  }
  function Io(t, e) {
    if (t === 'change') return e
  }
  var tf = !1
  if (Ie) {
    var Hs
    if (Ie) {
      var Bs = 'oninput' in document
      if (!Bs) {
        var ef = document.createElement('div')
        ef.setAttribute('oninput', 'return;'), (Bs = typeof ef.oninput == 'function')
      }
      Hs = Bs
    } else Hs = !1
    tf = Hs && (!document.documentMode || 9 < document.documentMode)
  }
  function nf() {
    wa && (wa.detachEvent('onpropertychange', lf), (xa = wa = null))
  }
  function lf(t) {
    if (t.propertyName === 'value' && Ji(xa)) {
      var e = []
      Wo(e, xa, t, Cs(t)), Qo(Mv, e)
    }
  }
  function Av(t, e, n) {
    t === 'focusin'
      ? (nf(), (wa = e), (xa = n), wa.attachEvent('onpropertychange', lf))
      : t === 'focusout' && nf()
  }
  function Dv(t) {
    if (t === 'selectionchange' || t === 'keyup' || t === 'keydown') return Ji(xa)
  }
  function Cv(t, e) {
    if (t === 'click') return Ji(e)
  }
  function wv(t, e) {
    if (t === 'input' || t === 'change') return Ji(e)
  }
  function xv(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e)
  }
  var pe = typeof Object.is == 'function' ? Object.is : xv
  function za(t, e) {
    if (pe(t, e)) return !0
    if (typeof t != 'object' || t === null || typeof e != 'object' || e === null) return !1
    var n = Object.keys(t),
      l = Object.keys(e)
    if (n.length !== l.length) return !1
    for (l = 0; l < n.length; l++) {
      var s = n[l]
      if (!va.call(e, s) || !pe(t[s], e[s])) return !1
    }
    return !0
  }
  function af(t) {
    for (; t && t.firstChild; ) t = t.firstChild
    return t
  }
  function uf(t, e) {
    var n = af(t)
    t = 0
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (((l = t + n.textContent.length), t <= e && l >= e)) return { node: n, offset: e - t }
        t = l
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling
            break t
          }
          n = n.parentNode
        }
        n = void 0
      }
      n = af(n)
    }
  }
  function sf(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
        ? !1
        : e && e.nodeType === 3
        ? sf(t, e.parentNode)
        : 'contains' in t
        ? t.contains(e)
        : t.compareDocumentPosition
        ? !!(t.compareDocumentPosition(e) & 16)
        : !1
      : !1
  }
  function rf(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window
    for (var e = Yi(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == 'string'
      } catch {
        n = !1
      }
      if (n) t = e.contentWindow
      else break
      e = Yi(t.document)
    }
    return e
  }
  function Qs(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase()
    return (
      e &&
      ((e === 'input' &&
        (t.type === 'text' ||
          t.type === 'search' ||
          t.type === 'tel' ||
          t.type === 'url' ||
          t.type === 'password')) ||
        e === 'textarea' ||
        t.contentEditable === 'true')
    )
  }
  function zv(t, e) {
    var n = rf(e)
    e = t.focusedElem
    var l = t.selectionRange
    if (n !== e && e && e.ownerDocument && sf(e.ownerDocument.documentElement, e)) {
      if (l !== null && Qs(e)) {
        if (((t = l.start), (n = l.end), n === void 0 && (n = t), 'selectionStart' in e))
          (e.selectionStart = t), (e.selectionEnd = Math.min(n, e.value.length))
        else if (
          ((n = ((t = e.ownerDocument || document) && t.defaultView) || window), n.getSelection)
        ) {
          n = n.getSelection()
          var s = e.textContent.length,
            c = Math.min(l.start, s)
          ;(l = l.end === void 0 ? c : Math.min(l.end, s)),
            !n.extend && c > l && ((s = l), (l = c), (c = s)),
            (s = uf(e, c))
          var h = uf(e, l)
          s &&
            h &&
            (n.rangeCount !== 1 ||
              n.anchorNode !== s.node ||
              n.anchorOffset !== s.offset ||
              n.focusNode !== h.node ||
              n.focusOffset !== h.offset) &&
            ((t = t.createRange()),
            t.setStart(s.node, s.offset),
            n.removeAllRanges(),
            c > l
              ? (n.addRange(t), n.extend(h.node, h.offset))
              : (t.setEnd(h.node, h.offset), n.addRange(t)))
        }
      }
      for (t = [], n = e; (n = n.parentNode); )
        n.nodeType === 1 && t.push({ element: n, left: n.scrollLeft, top: n.scrollTop })
      for (typeof e.focus == 'function' && e.focus(), e = 0; e < t.length; e++)
        (n = t[e]), (n.element.scrollLeft = n.left), (n.element.scrollTop = n.top)
    }
  }
  var Uv = Ie && 'documentMode' in document && 11 >= document.documentMode,
    Ul = null,
    Gs = null,
    Ua = null,
    Ys = !1
  function cf(t, e, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument
    Ys ||
      Ul == null ||
      Ul !== Yi(l) ||
      ((l = Ul),
      'selectionStart' in l && Qs(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      (Ua && za(Ua, l)) ||
        ((Ua = l),
        (l = xu(Gs, 'onSelect')),
        0 < l.length &&
          ((e = new ki('onSelect', 'select', null, e, n)),
          t.push({ event: e, listeners: l }),
          (e.target = Ul))))
  }
  function tl(t, e) {
    var n = {}
    return (
      (n[t.toLowerCase()] = e.toLowerCase()),
      (n['Webkit' + t] = 'webkit' + e),
      (n['Moz' + t] = 'moz' + e),
      n
    )
  }
  var Nl = {
      animationend: tl('Animation', 'AnimationEnd'),
      animationiteration: tl('Animation', 'AnimationIteration'),
      animationstart: tl('Animation', 'AnimationStart'),
      transitionrun: tl('Transition', 'TransitionRun'),
      transitionstart: tl('Transition', 'TransitionStart'),
      transitioncancel: tl('Transition', 'TransitionCancel'),
      transitionend: tl('Transition', 'TransitionEnd'),
    },
    Vs = {},
    of = {}
  Ie &&
    ((of = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete Nl.animationend.animation,
      delete Nl.animationiteration.animation,
      delete Nl.animationstart.animation),
    'TransitionEvent' in window || delete Nl.transitionend.transition)
  function el(t) {
    if (Vs[t]) return Vs[t]
    if (!Nl[t]) return t
    var e = Nl[t],
      n
    for (n in e) if (e.hasOwnProperty(n) && n in of) return (Vs[t] = e[n])
    return t
  }
  var ff = el('animationend'),
    df = el('animationiteration'),
    hf = el('animationstart'),
    Nv = el('transitionrun'),
    Lv = el('transitionstart'),
    qv = el('transitioncancel'),
    yf = el('transitionend'),
    mf = new Map(),
    vf =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel'.split(
        ' ',
      )
  function He(t, e) {
    mf.set(t, e), Wn(e, [t])
  }
  var Te = [],
    Ll = 0,
    Xs = 0
  function Pi() {
    for (var t = Ll, e = (Xs = Ll = 0); e < t; ) {
      var n = Te[e]
      Te[e++] = null
      var l = Te[e]
      Te[e++] = null
      var s = Te[e]
      Te[e++] = null
      var c = Te[e]
      if (((Te[e++] = null), l !== null && s !== null)) {
        var h = l.pending
        h === null ? (s.next = s) : ((s.next = h.next), (h.next = s)), (l.pending = s)
      }
      c !== 0 && pf(n, s, c)
    }
  }
  function $i(t, e, n, l) {
    ;(Te[Ll++] = t),
      (Te[Ll++] = e),
      (Te[Ll++] = n),
      (Te[Ll++] = l),
      (Xs |= l),
      (t.lanes |= l),
      (t = t.alternate),
      t !== null && (t.lanes |= l)
  }
  function Ks(t, e, n, l) {
    return $i(t, e, n, l), Wi(t)
  }
  function Rn(t, e) {
    return $i(t, null, null, e), Wi(t)
  }
  function pf(t, e, n) {
    t.lanes |= n
    var l = t.alternate
    l !== null && (l.lanes |= n)
    for (var s = !1, c = t.return; c !== null; )
      (c.childLanes |= n),
        (l = c.alternate),
        l !== null && (l.childLanes |= n),
        c.tag === 22 && ((t = c.stateNode), t === null || t._visibility & 1 || (s = !0)),
        (t = c),
        (c = c.return)
    s &&
      e !== null &&
      t.tag === 3 &&
      ((c = t.stateNode),
      (s = 31 - ve(n)),
      (c = c.hiddenUpdates),
      (t = c[s]),
      t === null ? (c[s] = [e]) : t.push(e),
      (e.lane = n | 536870912))
  }
  function Wi(t) {
    if (50 < ai) throw ((ai = 0), ($r = null), Error(r(185)))
    for (var e = t.return; e !== null; ) (t = e), (e = t.return)
    return t.tag === 3 ? t.stateNode : null
  }
  var ql = {},
    gf = new WeakMap()
  function Re(t, e) {
    if (typeof t == 'object' && t !== null) {
      var n = gf.get(t)
      return n !== void 0 ? n : ((e = { value: t, source: e, stack: P(e) }), gf.set(t, e), e)
    }
    return { value: t, source: e, stack: P(e) }
  }
  var jl = [],
    Hl = 0,
    Ii = null,
    tu = 0,
    Me = [],
    Ae = 0,
    nl = null,
    en = 1,
    nn = ''
  function ll(t, e) {
    ;(jl[Hl++] = tu), (jl[Hl++] = Ii), (Ii = t), (tu = e)
  }
  function Sf(t, e, n) {
    ;(Me[Ae++] = en), (Me[Ae++] = nn), (Me[Ae++] = nl), (nl = t)
    var l = en
    t = nn
    var s = 32 - ve(l) - 1
    ;(l &= ~(1 << s)), (n += 1)
    var c = 32 - ve(e) + s
    if (30 < c) {
      var h = s - (s % 5)
      ;(c = (l & ((1 << h) - 1)).toString(32)),
        (l >>= h),
        (s -= h),
        (en = (1 << (32 - ve(e) + s)) | (n << s) | l),
        (nn = c + t)
    } else (en = (1 << c) | (n << s) | l), (nn = t)
  }
  function Zs(t) {
    t.return !== null && (ll(t, 1), Sf(t, 1, 0))
  }
  function ks(t) {
    for (; t === Ii; ) (Ii = jl[--Hl]), (jl[Hl] = null), (tu = jl[--Hl]), (jl[Hl] = null)
    for (; t === nl; )
      (nl = Me[--Ae]),
        (Me[Ae] = null),
        (nn = Me[--Ae]),
        (Me[Ae] = null),
        (en = Me[--Ae]),
        (Me[Ae] = null)
  }
  var ue = null,
    Wt = null,
    Ot = !1,
    Be = null,
    Ze = !1,
    Fs = Error(r(519))
  function al(t) {
    var e = Error(r(418, ''))
    throw (qa(Re(e, t)), Fs)
  }
  function bf(t) {
    var e = t.stateNode,
      n = t.type,
      l = t.memoizedProps
    switch (((e[ee] = t), (e[oe] = l), n)) {
      case 'dialog':
        bt('cancel', e), bt('close', e)
        break
      case 'iframe':
      case 'object':
      case 'embed':
        bt('load', e)
        break
      case 'video':
      case 'audio':
        for (n = 0; n < ui.length; n++) bt(ui[n], e)
        break
      case 'source':
        bt('error', e)
        break
      case 'img':
      case 'image':
      case 'link':
        bt('error', e), bt('load', e)
        break
      case 'details':
        bt('toggle', e)
        break
      case 'input':
        bt('invalid', e),
          No(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0),
          Gi(e)
        break
      case 'select':
        bt('invalid', e)
        break
      case 'textarea':
        bt('invalid', e), qo(e, l.value, l.defaultValue, l.children), Gi(e)
    }
    ;(n = l.children),
      (typeof n != 'string' && typeof n != 'number' && typeof n != 'bigint') ||
      e.textContent === '' + n ||
      l.suppressHydrationWarning === !0 ||
      Ch(e.textContent, n)
        ? (l.popover != null && (bt('beforetoggle', e), bt('toggle', e)),
          l.onScroll != null && bt('scroll', e),
          l.onScrollEnd != null && bt('scrollend', e),
          l.onClick != null && (e.onclick = zu),
          (e = !0))
        : (e = !1),
      e || al(t)
  }
  function _f(t) {
    for (ue = t.return; ue; )
      switch (ue.tag) {
        case 3:
        case 27:
          Ze = !0
          return
        case 5:
        case 13:
          Ze = !1
          return
        default:
          ue = ue.return
      }
  }
  function Na(t) {
    if (t !== ue) return !1
    if (!Ot) return _f(t), (Ot = !0), !1
    var e = !1,
      n
    if (
      ((n = t.tag !== 3 && t.tag !== 27) &&
        ((n = t.tag === 5) &&
          ((n = t.type), (n = !(n !== 'form' && n !== 'button') || yc(t.type, t.memoizedProps))),
        (n = !n)),
      n && (e = !0),
      e && Wt && al(t),
      _f(t),
      t.tag === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(r(317))
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (((n = t.data), n === '/$')) {
              if (e === 0) {
                Wt = Ge(t.nextSibling)
                break t
              }
              e--
            } else (n !== '$' && n !== '$!' && n !== '$?') || e++
          t = t.nextSibling
        }
        Wt = null
      }
    } else Wt = ue ? Ge(t.stateNode.nextSibling) : null
    return !0
  }
  function La() {
    ;(Wt = ue = null), (Ot = !1)
  }
  function qa(t) {
    Be === null ? (Be = [t]) : Be.push(t)
  }
  var ja = Error(r(460)),
    Ef = Error(r(474)),
    Js = { then: function () {} }
  function Of(t) {
    return (t = t.status), t === 'fulfilled' || t === 'rejected'
  }
  function eu() {}
  function Tf(t, e, n) {
    switch (
      ((n = t[n]), n === void 0 ? t.push(e) : n !== e && (e.then(eu, eu), (e = n)), e.status)
    ) {
      case 'fulfilled':
        return e.value
      case 'rejected':
        throw ((t = e.reason), t === ja ? Error(r(483)) : t)
      default:
        if (typeof e.status == 'string') e.then(eu, eu)
        else {
          if (((t = wt), t !== null && 100 < t.shellSuspendCounter)) throw Error(r(482))
          ;(t = e),
            (t.status = 'pending'),
            t.then(
              function (l) {
                if (e.status === 'pending') {
                  var s = e
                  ;(s.status = 'fulfilled'), (s.value = l)
                }
              },
              function (l) {
                if (e.status === 'pending') {
                  var s = e
                  ;(s.status = 'rejected'), (s.reason = l)
                }
              },
            )
        }
        switch (e.status) {
          case 'fulfilled':
            return e.value
          case 'rejected':
            throw ((t = e.reason), t === ja ? Error(r(483)) : t)
        }
        throw ((Ha = e), ja)
    }
  }
  var Ha = null
  function Rf() {
    if (Ha === null) throw Error(r(459))
    var t = Ha
    return (Ha = null), t
  }
  var Bl = null,
    Ba = 0
  function nu(t) {
    var e = Ba
    return (Ba += 1), Bl === null && (Bl = []), Tf(Bl, t, e)
  }
  function Qa(t, e) {
    ;(e = e.props.ref), (t.ref = e !== void 0 ? e : null)
  }
  function lu(t, e) {
    throw e.$$typeof === f
      ? Error(r(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(
          r(
            31,
            t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t,
          ),
        ))
  }
  function Mf(t) {
    var e = t._init
    return e(t._payload)
  }
  function Af(t) {
    function e(M, E) {
      if (t) {
        var A = M.deletions
        A === null ? ((M.deletions = [E]), (M.flags |= 16)) : A.push(E)
      }
    }
    function n(M, E) {
      if (!t) return null
      for (; E !== null; ) e(M, E), (E = E.sibling)
      return null
    }
    function l(M) {
      for (var E = new Map(); M !== null; )
        M.key !== null ? E.set(M.key, M) : E.set(M.index, M), (M = M.sibling)
      return E
    }
    function s(M, E) {
      return (M = jn(M, E)), (M.index = 0), (M.sibling = null), M
    }
    function c(M, E, A) {
      return (
        (M.index = A),
        t
          ? ((A = M.alternate),
            A !== null
              ? ((A = A.index), A < E ? ((M.flags |= 33554434), E) : A)
              : ((M.flags |= 33554434), E))
          : ((M.flags |= 1048576), E)
      )
    }
    function h(M) {
      return t && M.alternate === null && (M.flags |= 33554434), M
    }
    function p(M, E, A, q) {
      return E === null || E.tag !== 6
        ? ((E = Vr(A, M.mode, q)), (E.return = M), E)
        : ((E = s(E, A)), (E.return = M), E)
    }
    function b(M, E, A, q) {
      var W = A.type
      return W === m
        ? z(M, E, A.props.children, q, A.key)
        : E !== null &&
          (E.elementType === W ||
            (typeof W == 'object' && W !== null && W.$$typeof === X && Mf(W) === E.type))
        ? ((E = s(E, A.props)), Qa(E, A), (E.return = M), E)
        : ((E = _u(A.type, A.key, A.props, null, M.mode, q)), Qa(E, A), (E.return = M), E)
    }
    function O(M, E, A, q) {
      return E === null ||
        E.tag !== 4 ||
        E.stateNode.containerInfo !== A.containerInfo ||
        E.stateNode.implementation !== A.implementation
        ? ((E = Xr(A, M.mode, q)), (E.return = M), E)
        : ((E = s(E, A.children || [])), (E.return = M), E)
    }
    function z(M, E, A, q, W) {
      return E === null || E.tag !== 7
        ? ((E = yl(A, M.mode, q, W)), (E.return = M), E)
        : ((E = s(E, A)), (E.return = M), E)
    }
    function H(M, E, A) {
      if ((typeof E == 'string' && E !== '') || typeof E == 'number' || typeof E == 'bigint')
        return (E = Vr('' + E, M.mode, A)), (E.return = M), E
      if (typeof E == 'object' && E !== null) {
        switch (E.$$typeof) {
          case d:
            return (A = _u(E.type, E.key, E.props, null, M.mode, A)), Qa(A, E), (A.return = M), A
          case y:
            return (E = Xr(E, M.mode, A)), (E.return = M), E
          case X:
            var q = E._init
            return (E = q(E._payload)), H(M, E, A)
        }
        if (J(E) || $(E)) return (E = yl(E, M.mode, A, null)), (E.return = M), E
        if (typeof E.then == 'function') return H(M, nu(E), A)
        if (E.$$typeof === D) return H(M, gu(M, E), A)
        lu(M, E)
      }
      return null
    }
    function C(M, E, A, q) {
      var W = E !== null ? E.key : null
      if ((typeof A == 'string' && A !== '') || typeof A == 'number' || typeof A == 'bigint')
        return W !== null ? null : p(M, E, '' + A, q)
      if (typeof A == 'object' && A !== null) {
        switch (A.$$typeof) {
          case d:
            return A.key === W ? b(M, E, A, q) : null
          case y:
            return A.key === W ? O(M, E, A, q) : null
          case X:
            return (W = A._init), (A = W(A._payload)), C(M, E, A, q)
        }
        if (J(A) || $(A)) return W !== null ? null : z(M, E, A, q, null)
        if (typeof A.then == 'function') return C(M, E, nu(A), q)
        if (A.$$typeof === D) return C(M, E, gu(M, A), q)
        lu(M, A)
      }
      return null
    }
    function x(M, E, A, q, W) {
      if ((typeof q == 'string' && q !== '') || typeof q == 'number' || typeof q == 'bigint')
        return (M = M.get(A) || null), p(E, M, '' + q, W)
      if (typeof q == 'object' && q !== null) {
        switch (q.$$typeof) {
          case d:
            return (M = M.get(q.key === null ? A : q.key) || null), b(E, M, q, W)
          case y:
            return (M = M.get(q.key === null ? A : q.key) || null), O(E, M, q, W)
          case X:
            var gt = q._init
            return (q = gt(q._payload)), x(M, E, A, q, W)
        }
        if (J(q) || $(q)) return (M = M.get(A) || null), z(E, M, q, W, null)
        if (typeof q.then == 'function') return x(M, E, A, nu(q), W)
        if (q.$$typeof === D) return x(M, E, A, gu(E, q), W)
        lu(E, q)
      }
      return null
    }
    function et(M, E, A, q) {
      for (
        var W = null, gt = null, at = E, st = (E = 0), $t = null;
        at !== null && st < A.length;
        st++
      ) {
        at.index > st ? (($t = at), (at = null)) : ($t = at.sibling)
        var Tt = C(M, at, A[st], q)
        if (Tt === null) {
          at === null && (at = $t)
          break
        }
        t && at && Tt.alternate === null && e(M, at),
          (E = c(Tt, E, st)),
          gt === null ? (W = Tt) : (gt.sibling = Tt),
          (gt = Tt),
          (at = $t)
      }
      if (st === A.length) return n(M, at), Ot && ll(M, st), W
      if (at === null) {
        for (; st < A.length; st++)
          (at = H(M, A[st], q)),
            at !== null &&
              ((E = c(at, E, st)), gt === null ? (W = at) : (gt.sibling = at), (gt = at))
        return Ot && ll(M, st), W
      }
      for (at = l(at); st < A.length; st++)
        ($t = x(at, M, st, A[st], q)),
          $t !== null &&
            (t && $t.alternate !== null && at.delete($t.key === null ? st : $t.key),
            (E = c($t, E, st)),
            gt === null ? (W = $t) : (gt.sibling = $t),
            (gt = $t))
      return (
        t &&
          at.forEach(function (Xn) {
            return e(M, Xn)
          }),
        Ot && ll(M, st),
        W
      )
    }
    function ot(M, E, A, q) {
      if (A == null) throw Error(r(151))
      for (
        var W = null, gt = null, at = E, st = (E = 0), $t = null, Tt = A.next();
        at !== null && !Tt.done;
        st++, Tt = A.next()
      ) {
        at.index > st ? (($t = at), (at = null)) : ($t = at.sibling)
        var Xn = C(M, at, Tt.value, q)
        if (Xn === null) {
          at === null && (at = $t)
          break
        }
        t && at && Xn.alternate === null && e(M, at),
          (E = c(Xn, E, st)),
          gt === null ? (W = Xn) : (gt.sibling = Xn),
          (gt = Xn),
          (at = $t)
      }
      if (Tt.done) return n(M, at), Ot && ll(M, st), W
      if (at === null) {
        for (; !Tt.done; st++, Tt = A.next())
          (Tt = H(M, Tt.value, q)),
            Tt !== null &&
              ((E = c(Tt, E, st)), gt === null ? (W = Tt) : (gt.sibling = Tt), (gt = Tt))
        return Ot && ll(M, st), W
      }
      for (at = l(at); !Tt.done; st++, Tt = A.next())
        (Tt = x(at, M, st, Tt.value, q)),
          Tt !== null &&
            (t && Tt.alternate !== null && at.delete(Tt.key === null ? st : Tt.key),
            (E = c(Tt, E, st)),
            gt === null ? (W = Tt) : (gt.sibling = Tt),
            (gt = Tt))
      return (
        t &&
          at.forEach(function (P0) {
            return e(M, P0)
          }),
        Ot && ll(M, st),
        W
      )
    }
    function jt(M, E, A, q) {
      if (
        (typeof A == 'object' &&
          A !== null &&
          A.type === m &&
          A.key === null &&
          (A = A.props.children),
        typeof A == 'object' && A !== null)
      ) {
        switch (A.$$typeof) {
          case d:
            t: {
              for (var W = A.key; E !== null; ) {
                if (E.key === W) {
                  if (((W = A.type), W === m)) {
                    if (E.tag === 7) {
                      n(M, E.sibling), (q = s(E, A.props.children)), (q.return = M), (M = q)
                      break t
                    }
                  } else if (
                    E.elementType === W ||
                    (typeof W == 'object' && W !== null && W.$$typeof === X && Mf(W) === E.type)
                  ) {
                    n(M, E.sibling), (q = s(E, A.props)), Qa(q, A), (q.return = M), (M = q)
                    break t
                  }
                  n(M, E)
                  break
                } else e(M, E)
                E = E.sibling
              }
              A.type === m
                ? ((q = yl(A.props.children, M.mode, q, A.key)), (q.return = M), (M = q))
                : ((q = _u(A.type, A.key, A.props, null, M.mode, q)),
                  Qa(q, A),
                  (q.return = M),
                  (M = q))
            }
            return h(M)
          case y:
            t: {
              for (W = A.key; E !== null; ) {
                if (E.key === W)
                  if (
                    E.tag === 4 &&
                    E.stateNode.containerInfo === A.containerInfo &&
                    E.stateNode.implementation === A.implementation
                  ) {
                    n(M, E.sibling), (q = s(E, A.children || [])), (q.return = M), (M = q)
                    break t
                  } else {
                    n(M, E)
                    break
                  }
                else e(M, E)
                E = E.sibling
              }
              ;(q = Xr(A, M.mode, q)), (q.return = M), (M = q)
            }
            return h(M)
          case X:
            return (W = A._init), (A = W(A._payload)), jt(M, E, A, q)
        }
        if (J(A)) return et(M, E, A, q)
        if ($(A)) {
          if (((W = $(A)), typeof W != 'function')) throw Error(r(150))
          return (A = W.call(A)), ot(M, E, A, q)
        }
        if (typeof A.then == 'function') return jt(M, E, nu(A), q)
        if (A.$$typeof === D) return jt(M, E, gu(M, A), q)
        lu(M, A)
      }
      return (typeof A == 'string' && A !== '') || typeof A == 'number' || typeof A == 'bigint'
        ? ((A = '' + A),
          E !== null && E.tag === 6
            ? (n(M, E.sibling), (q = s(E, A)), (q.return = M), (M = q))
            : (n(M, E), (q = Vr(A, M.mode, q)), (q.return = M), (M = q)),
          h(M))
        : n(M, E)
    }
    return function (M, E, A, q) {
      try {
        Ba = 0
        var W = jt(M, E, A, q)
        return (Bl = null), W
      } catch (at) {
        if (at === ja) throw at
        var gt = xe(29, at, null, M.mode)
        return (gt.lanes = q), (gt.return = M), gt
      } finally {
      }
    }
  }
  var il = Af(!0),
    Df = Af(!1),
    Ql = it(null),
    au = it(0)
  function Cf(t, e) {
    ;(t = yn), Rt(au, t), Rt(Ql, e), (yn = t | e.baseLanes)
  }
  function Ps() {
    Rt(au, yn), Rt(Ql, Ql.current)
  }
  function $s() {
    ;(yn = au.current), _t(Ql), _t(au)
  }
  var De = it(null),
    ke = null
  function Mn(t) {
    var e = t.alternate
    Rt(Kt, Kt.current & 1),
      Rt(De, t),
      ke === null && (e === null || Ql.current !== null || e.memoizedState !== null) && (ke = t)
  }
  function wf(t) {
    if (t.tag === 22) {
      if ((Rt(Kt, Kt.current), Rt(De, t), ke === null)) {
        var e = t.alternate
        e !== null && e.memoizedState !== null && (ke = t)
      }
    } else An()
  }
  function An() {
    Rt(Kt, Kt.current), Rt(De, De.current)
  }
  function ln(t) {
    _t(De), ke === t && (ke = null), _t(Kt)
  }
  var Kt = it(0)
  function iu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState
        if (n !== null && ((n = n.dehydrated), n === null || n.data === '$?' || n.data === '$!'))
          return e
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
        if ((e.flags & 128) !== 0) return e
      } else if (e.child !== null) {
        ;(e.child.return = e), (e = e.child)
        continue
      }
      if (e === t) break
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null
        e = e.return
      }
      ;(e.sibling.return = e.return), (e = e.sibling)
    }
    return null
  }
  var jv =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (n, l) {
                  t.push(l)
                },
              })
            this.abort = function () {
              ;(e.aborted = !0),
                t.forEach(function (n) {
                  return n()
                })
            }
          },
    Hv = a.unstable_scheduleCallback,
    Bv = a.unstable_NormalPriority,
    Zt = {
      $$typeof: D,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    }
  function Ws() {
    return { controller: new jv(), data: new Map(), refCount: 0 }
  }
  function Ga(t) {
    t.refCount--,
      t.refCount === 0 &&
        Hv(Bv, function () {
          t.controller.abort()
        })
  }
  var Ya = null,
    Is = 0,
    Gl = 0,
    Yl = null
  function Qv(t, e) {
    if (Ya === null) {
      var n = (Ya = [])
      ;(Is = 0),
        (Gl = ic()),
        (Yl = {
          status: 'pending',
          value: void 0,
          then: function (l) {
            n.push(l)
          },
        })
    }
    return Is++, e.then(xf, xf), e
  }
  function xf() {
    if (--Is === 0 && Ya !== null) {
      Yl !== null && (Yl.status = 'fulfilled')
      var t = Ya
      ;(Ya = null), (Gl = 0), (Yl = null)
      for (var e = 0; e < t.length; e++) (0, t[e])()
    }
  }
  function Gv(t, e) {
    var n = [],
      l = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (s) {
          n.push(s)
        },
      }
    return (
      t.then(
        function () {
          ;(l.status = 'fulfilled'), (l.value = e)
          for (var s = 0; s < n.length; s++) (0, n[s])(e)
        },
        function (s) {
          for (l.status = 'rejected', l.reason = s, s = 0; s < n.length; s++) (0, n[s])(void 0)
        },
      ),
      l
    )
  }
  var zf = R.S
  R.S = function (t, e) {
    typeof e == 'object' && e !== null && typeof e.then == 'function' && Qv(t, e),
      zf !== null && zf(t, e)
  }
  var ul = it(null)
  function tr() {
    var t = ul.current
    return t !== null ? t : wt.pooledCache
  }
  function uu(t, e) {
    e === null ? Rt(ul, ul.current) : Rt(ul, e.pool)
  }
  function Uf() {
    var t = tr()
    return t === null ? null : { parent: Zt._currentValue, pool: t }
  }
  var Dn = 0,
    pt = null,
    Mt = null,
    Gt = null,
    su = !1,
    Vl = !1,
    sl = !1,
    ru = 0,
    Va = 0,
    Xl = null,
    Yv = 0
  function Qt() {
    throw Error(r(321))
  }
  function er(t, e) {
    if (e === null) return !1
    for (var n = 0; n < e.length && n < t.length; n++) if (!pe(t[n], e[n])) return !1
    return !0
  }
  function nr(t, e, n, l, s, c) {
    return (
      (Dn = c),
      (pt = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (R.H = t === null || t.memoizedState === null ? rl : Cn),
      (sl = !1),
      (c = n(l, s)),
      (sl = !1),
      Vl && (c = Lf(e, n, l, s)),
      Nf(t),
      c
    )
  }
  function Nf(t) {
    R.H = Fe
    var e = Mt !== null && Mt.next !== null
    if (((Dn = 0), (Gt = Mt = pt = null), (su = !1), (Va = 0), (Xl = null), e)) throw Error(r(300))
    t === null || Jt || ((t = t.dependencies), t !== null && pu(t) && (Jt = !0))
  }
  function Lf(t, e, n, l) {
    pt = t
    var s = 0
    do {
      if ((Vl && (Xl = null), (Va = 0), (Vl = !1), 25 <= s)) throw Error(r(301))
      if (((s += 1), (Gt = Mt = null), t.updateQueue != null)) {
        var c = t.updateQueue
        ;(c.lastEffect = null),
          (c.events = null),
          (c.stores = null),
          c.memoCache != null && (c.memoCache.index = 0)
      }
      ;(R.H = cl), (c = e(n, l))
    } while (Vl)
    return c
  }
  function Vv() {
    var t = R.H,
      e = t.useState()[0]
    return (
      (e = typeof e.then == 'function' ? Xa(e) : e),
      (t = t.useState()[0]),
      (Mt !== null ? Mt.memoizedState : null) !== t && (pt.flags |= 1024),
      e
    )
  }
  function lr() {
    var t = ru !== 0
    return (ru = 0), t
  }
  function ar(t, e, n) {
    ;(e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~n)
  }
  function ir(t) {
    if (su) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue
        e !== null && (e.pending = null), (t = t.next)
      }
      su = !1
    }
    ;(Dn = 0), (Gt = Mt = pt = null), (Vl = !1), (Va = ru = 0), (Xl = null)
  }
  function de() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null }
    return Gt === null ? (pt.memoizedState = Gt = t) : (Gt = Gt.next = t), Gt
  }
  function Yt() {
    if (Mt === null) {
      var t = pt.alternate
      t = t !== null ? t.memoizedState : null
    } else t = Mt.next
    var e = Gt === null ? pt.memoizedState : Gt.next
    if (e !== null) (Gt = e), (Mt = t)
    else {
      if (t === null) throw pt.alternate === null ? Error(r(467)) : Error(r(310))
      ;(Mt = t),
        (t = {
          memoizedState: Mt.memoizedState,
          baseState: Mt.baseState,
          baseQueue: Mt.baseQueue,
          queue: Mt.queue,
          next: null,
        }),
        Gt === null ? (pt.memoizedState = Gt = t) : (Gt = Gt.next = t)
    }
    return Gt
  }
  var cu
  cu = function () {
    return { lastEffect: null, events: null, stores: null, memoCache: null }
  }
  function Xa(t) {
    var e = Va
    return (
      (Va += 1),
      Xl === null && (Xl = []),
      (t = Tf(Xl, t, e)),
      (e = pt),
      (Gt === null ? e.memoizedState : Gt.next) === null &&
        ((e = e.alternate), (R.H = e === null || e.memoizedState === null ? rl : Cn)),
      t
    )
  }
  function ou(t) {
    if (t !== null && typeof t == 'object') {
      if (typeof t.then == 'function') return Xa(t)
      if (t.$$typeof === D) return ne(t)
    }
    throw Error(r(438, String(t)))
  }
  function ur(t) {
    var e = null,
      n = pt.updateQueue
    if ((n !== null && (e = n.memoCache), e == null)) {
      var l = pt.alternate
      l !== null &&
        ((l = l.updateQueue),
        l !== null &&
          ((l = l.memoCache),
          l != null &&
            (e = {
              data: l.data.map(function (s) {
                return s.slice()
              }),
              index: 0,
            })))
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      n === null && ((n = cu()), (pt.updateQueue = n)),
      (n.memoCache = e),
      (n = e.data[e.index]),
      n === void 0)
    )
      for (n = e.data[e.index] = Array(t), l = 0; l < t; l++) n[l] = yt
    return e.index++, n
  }
  function an(t, e) {
    return typeof e == 'function' ? e(t) : e
  }
  function fu(t) {
    var e = Yt()
    return sr(e, Mt, t)
  }
  function sr(t, e, n) {
    var l = t.queue
    if (l === null) throw Error(r(311))
    l.lastRenderedReducer = n
    var s = t.baseQueue,
      c = l.pending
    if (c !== null) {
      if (s !== null) {
        var h = s.next
        ;(s.next = c.next), (c.next = h)
      }
      ;(e.baseQueue = s = c), (l.pending = null)
    }
    if (((c = t.baseState), s === null)) t.memoizedState = c
    else {
      e = s.next
      var p = (h = null),
        b = null,
        O = e,
        z = !1
      do {
        var H = O.lane & -536870913
        if (H !== O.lane ? (Et & H) === H : (Dn & H) === H) {
          var C = O.revertLane
          if (C === 0)
            b !== null &&
              (b = b.next =
                {
                  lane: 0,
                  revertLane: 0,
                  action: O.action,
                  hasEagerState: O.hasEagerState,
                  eagerState: O.eagerState,
                  next: null,
                }),
              H === Gl && (z = !0)
          else if ((Dn & C) === C) {
            ;(O = O.next), C === Gl && (z = !0)
            continue
          } else
            (H = {
              lane: 0,
              revertLane: O.revertLane,
              action: O.action,
              hasEagerState: O.hasEagerState,
              eagerState: O.eagerState,
              next: null,
            }),
              b === null ? ((p = b = H), (h = c)) : (b = b.next = H),
              (pt.lanes |= C),
              (Hn |= C)
          ;(H = O.action), sl && n(c, H), (c = O.hasEagerState ? O.eagerState : n(c, H))
        } else
          (C = {
            lane: H,
            revertLane: O.revertLane,
            action: O.action,
            hasEagerState: O.hasEagerState,
            eagerState: O.eagerState,
            next: null,
          }),
            b === null ? ((p = b = C), (h = c)) : (b = b.next = C),
            (pt.lanes |= H),
            (Hn |= H)
        O = O.next
      } while (O !== null && O !== e)
      if (
        (b === null ? (h = c) : (b.next = p),
        !pe(c, t.memoizedState) && ((Jt = !0), z && ((n = Yl), n !== null)))
      )
        throw n
      ;(t.memoizedState = c), (t.baseState = h), (t.baseQueue = b), (l.lastRenderedState = c)
    }
    return s === null && (l.lanes = 0), [t.memoizedState, l.dispatch]
  }
  function rr(t) {
    var e = Yt(),
      n = e.queue
    if (n === null) throw Error(r(311))
    n.lastRenderedReducer = t
    var l = n.dispatch,
      s = n.pending,
      c = e.memoizedState
    if (s !== null) {
      n.pending = null
      var h = (s = s.next)
      do (c = t(c, h.action)), (h = h.next)
      while (h !== s)
      pe(c, e.memoizedState) || (Jt = !0),
        (e.memoizedState = c),
        e.baseQueue === null && (e.baseState = c),
        (n.lastRenderedState = c)
    }
    return [c, l]
  }
  function qf(t, e, n) {
    var l = pt,
      s = Yt(),
      c = Ot
    if (c) {
      if (n === void 0) throw Error(r(407))
      n = n()
    } else n = e()
    var h = !pe((Mt || s).memoizedState, n)
    if (
      (h && ((s.memoizedState = n), (Jt = !0)),
      (s = s.queue),
      fr(Bf.bind(null, l, s, t), [t]),
      s.getSnapshot !== e || h || (Gt !== null && Gt.memoizedState.tag & 1))
    ) {
      if (
        ((l.flags |= 2048),
        Kl(9, Hf.bind(null, l, s, n, e), { destroy: void 0 }, null),
        wt === null)
      )
        throw Error(r(349))
      c || (Dn & 60) !== 0 || jf(l, e, n)
    }
    return n
  }
  function jf(t, e, n) {
    ;(t.flags |= 16384),
      (t = { getSnapshot: e, value: n }),
      (e = pt.updateQueue),
      e === null
        ? ((e = cu()), (pt.updateQueue = e), (e.stores = [t]))
        : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t))
  }
  function Hf(t, e, n, l) {
    ;(e.value = n), (e.getSnapshot = l), Qf(e) && Gf(t)
  }
  function Bf(t, e, n) {
    return n(function () {
      Qf(e) && Gf(t)
    })
  }
  function Qf(t) {
    var e = t.getSnapshot
    t = t.value
    try {
      var n = e()
      return !pe(t, n)
    } catch {
      return !0
    }
  }
  function Gf(t) {
    var e = Rn(t, 2)
    e !== null && se(e, t, 2)
  }
  function cr(t) {
    var e = de()
    if (typeof t == 'function') {
      var n = t
      if (((t = n()), sl)) {
        En(!0)
        try {
          n()
        } finally {
          En(!1)
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: an,
        lastRenderedState: t,
      }),
      e
    )
  }
  function Yf(t, e, n, l) {
    return (t.baseState = n), sr(t, Mt, typeof l == 'function' ? l : an)
  }
  function Xv(t, e, n, l, s) {
    if (yu(t)) throw Error(r(485))
    if (((t = e.action), t !== null)) {
      var c = {
        payload: s,
        action: t,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (h) {
          c.listeners.push(h)
        },
      }
      R.T !== null ? n(!0) : (c.isTransition = !1),
        l(c),
        (n = e.pending),
        n === null
          ? ((c.next = e.pending = c), Vf(e, c))
          : ((c.next = n.next), (e.pending = n.next = c))
    }
  }
  function Vf(t, e) {
    var n = e.action,
      l = e.payload,
      s = t.state
    if (e.isTransition) {
      var c = R.T,
        h = {}
      R.T = h
      try {
        var p = n(s, l),
          b = R.S
        b !== null && b(h, p), Xf(t, e, p)
      } catch (O) {
        or(t, e, O)
      } finally {
        R.T = c
      }
    } else
      try {
        ;(c = n(s, l)), Xf(t, e, c)
      } catch (O) {
        or(t, e, O)
      }
  }
  function Xf(t, e, n) {
    n !== null && typeof n == 'object' && typeof n.then == 'function'
      ? n.then(
          function (l) {
            Kf(t, e, l)
          },
          function (l) {
            return or(t, e, l)
          },
        )
      : Kf(t, e, n)
  }
  function Kf(t, e, n) {
    ;(e.status = 'fulfilled'),
      (e.value = n),
      Zf(e),
      (t.state = n),
      (e = t.pending),
      e !== null &&
        ((n = e.next), n === e ? (t.pending = null) : ((n = n.next), (e.next = n), Vf(t, n)))
  }
  function or(t, e, n) {
    var l = t.pending
    if (((t.pending = null), l !== null)) {
      l = l.next
      do (e.status = 'rejected'), (e.reason = n), Zf(e), (e = e.next)
      while (e !== l)
    }
    t.action = null
  }
  function Zf(t) {
    t = t.listeners
    for (var e = 0; e < t.length; e++) (0, t[e])()
  }
  function kf(t, e) {
    return e
  }
  function Ff(t, e) {
    if (Ot) {
      var n = wt.formState
      if (n !== null) {
        t: {
          var l = pt
          if (Ot) {
            if (Wt) {
              e: {
                for (var s = Wt, c = Ze; s.nodeType !== 8; ) {
                  if (!c) {
                    s = null
                    break e
                  }
                  if (((s = Ge(s.nextSibling)), s === null)) {
                    s = null
                    break e
                  }
                }
                ;(c = s.data), (s = c === 'F!' || c === 'F' ? s : null)
              }
              if (s) {
                ;(Wt = Ge(s.nextSibling)), (l = s.data === 'F!')
                break t
              }
            }
            al(l)
          }
          l = !1
        }
        l && (e = n[0])
      }
    }
    return (
      (n = de()),
      (n.memoizedState = n.baseState = e),
      (l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: kf,
        lastRenderedState: e,
      }),
      (n.queue = l),
      (n = dd.bind(null, pt, l)),
      (l.dispatch = n),
      (l = cr(!1)),
      (c = vr.bind(null, pt, !1, l.queue)),
      (l = de()),
      (s = { state: e, dispatch: null, action: t, pending: null }),
      (l.queue = s),
      (n = Xv.bind(null, pt, s, c, n)),
      (s.dispatch = n),
      (l.memoizedState = t),
      [e, n, !1]
    )
  }
  function Jf(t) {
    var e = Yt()
    return Pf(e, Mt, t)
  }
  function Pf(t, e, n) {
    ;(e = sr(t, e, kf)[0]),
      (t = fu(an)[0]),
      (e = typeof e == 'object' && e !== null && typeof e.then == 'function' ? Xa(e) : e)
    var l = Yt(),
      s = l.queue,
      c = s.dispatch
    return (
      n !== l.memoizedState &&
        ((pt.flags |= 2048), Kl(9, Kv.bind(null, s, n), { destroy: void 0 }, null)),
      [e, c, t]
    )
  }
  function Kv(t, e) {
    t.action = e
  }
  function $f(t) {
    var e = Yt(),
      n = Mt
    if (n !== null) return Pf(e, n, t)
    Yt(), (e = e.memoizedState), (n = Yt())
    var l = n.queue.dispatch
    return (n.memoizedState = t), [e, l, !1]
  }
  function Kl(t, e, n, l) {
    return (
      (t = { tag: t, create: e, inst: n, deps: l, next: null }),
      (e = pt.updateQueue),
      e === null && ((e = cu()), (pt.updateQueue = e)),
      (n = e.lastEffect),
      n === null
        ? (e.lastEffect = t.next = t)
        : ((l = n.next), (n.next = t), (t.next = l), (e.lastEffect = t)),
      t
    )
  }
  function Wf() {
    return Yt().memoizedState
  }
  function du(t, e, n, l) {
    var s = de()
    ;(pt.flags |= t), (s.memoizedState = Kl(1 | e, n, { destroy: void 0 }, l === void 0 ? null : l))
  }
  function hu(t, e, n, l) {
    var s = Yt()
    l = l === void 0 ? null : l
    var c = s.memoizedState.inst
    Mt !== null && l !== null && er(l, Mt.memoizedState.deps)
      ? (s.memoizedState = Kl(e, n, c, l))
      : ((pt.flags |= t), (s.memoizedState = Kl(1 | e, n, c, l)))
  }
  function If(t, e) {
    du(8390656, 8, t, e)
  }
  function fr(t, e) {
    hu(2048, 8, t, e)
  }
  function td(t, e) {
    return hu(4, 2, t, e)
  }
  function ed(t, e) {
    return hu(4, 4, t, e)
  }
  function nd(t, e) {
    if (typeof e == 'function') {
      t = t()
      var n = e(t)
      return function () {
        typeof n == 'function' ? n() : e(null)
      }
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null
        }
      )
  }
  function ld(t, e, n) {
    ;(n = n != null ? n.concat([t]) : null), hu(4, 4, nd.bind(null, e, t), n)
  }
  function dr() {}
  function ad(t, e) {
    var n = Yt()
    e = e === void 0 ? null : e
    var l = n.memoizedState
    return e !== null && er(e, l[1]) ? l[0] : ((n.memoizedState = [t, e]), t)
  }
  function id(t, e) {
    var n = Yt()
    e = e === void 0 ? null : e
    var l = n.memoizedState
    if (e !== null && er(e, l[1])) return l[0]
    if (((l = t()), sl)) {
      En(!0)
      try {
        t()
      } finally {
        En(!1)
      }
    }
    return (n.memoizedState = [l, e]), l
  }
  function hr(t, e, n) {
    return n === void 0 || (Dn & 1073741824) !== 0
      ? (t.memoizedState = e)
      : ((t.memoizedState = n), (t = sh()), (pt.lanes |= t), (Hn |= t), n)
  }
  function ud(t, e, n, l) {
    return pe(n, e)
      ? n
      : Ql.current !== null
      ? ((t = hr(t, n, l)), pe(t, e) || (Jt = !0), t)
      : (Dn & 42) === 0
      ? ((Jt = !0), (t.memoizedState = n))
      : ((t = sh()), (pt.lanes |= t), (Hn |= t), e)
  }
  function sd(t, e, n, l, s) {
    var c = V.p
    V.p = c !== 0 && 8 > c ? c : 8
    var h = R.T,
      p = {}
    ;(R.T = p), vr(t, !1, e, n)
    try {
      var b = s(),
        O = R.S
      if (
        (O !== null && O(p, b), b !== null && typeof b == 'object' && typeof b.then == 'function')
      ) {
        var z = Gv(b, l)
        Ka(t, e, z, _e(t))
      } else Ka(t, e, l, _e(t))
    } catch (H) {
      Ka(t, e, { then: function () {}, status: 'rejected', reason: H }, _e())
    } finally {
      ;(V.p = c), (R.T = h)
    }
  }
  function Zv() {}
  function yr(t, e, n, l) {
    if (t.tag !== 5) throw Error(r(476))
    var s = rd(t).queue
    sd(
      t,
      s,
      e,
      ut,
      n === null
        ? Zv
        : function () {
            return cd(t), n(l)
          },
    )
  }
  function rd(t) {
    var e = t.memoizedState
    if (e !== null) return e
    e = {
      memoizedState: ut,
      baseState: ut,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: an,
        lastRenderedState: ut,
      },
      next: null,
    }
    var n = {}
    return (
      (e.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: an,
          lastRenderedState: n,
        },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    )
  }
  function cd(t) {
    var e = rd(t).next.queue
    Ka(t, e, {}, _e())
  }
  function mr() {
    return ne(fi)
  }
  function od() {
    return Yt().memoizedState
  }
  function fd() {
    return Yt().memoizedState
  }
  function kv(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = _e()
          t = zn(n)
          var l = Un(e, t, n)
          l !== null && (se(l, e, n), Fa(l, e, n)), (e = { cache: Ws() }), (t.payload = e)
          return
      }
      e = e.return
    }
  }
  function Fv(t, e, n) {
    var l = _e()
    ;(n = { lane: l, revertLane: 0, action: n, hasEagerState: !1, eagerState: null, next: null }),
      yu(t) ? hd(e, n) : ((n = Ks(t, e, n, l)), n !== null && (se(n, t, l), yd(n, e, l)))
  }
  function dd(t, e, n) {
    var l = _e()
    Ka(t, e, n, l)
  }
  function Ka(t, e, n, l) {
    var s = { lane: l, revertLane: 0, action: n, hasEagerState: !1, eagerState: null, next: null }
    if (yu(t)) hd(e, s)
    else {
      var c = t.alternate
      if (
        t.lanes === 0 &&
        (c === null || c.lanes === 0) &&
        ((c = e.lastRenderedReducer), c !== null)
      )
        try {
          var h = e.lastRenderedState,
            p = c(h, n)
          if (((s.hasEagerState = !0), (s.eagerState = p), pe(p, h)))
            return $i(t, e, s, 0), wt === null && Pi(), !1
        } catch {
        } finally {
        }
      if (((n = Ks(t, e, s, l)), n !== null)) return se(n, t, l), yd(n, e, l), !0
    }
    return !1
  }
  function vr(t, e, n, l) {
    if (
      ((l = {
        lane: 2,
        revertLane: ic(),
        action: l,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      yu(t))
    ) {
      if (e) throw Error(r(479))
    } else (e = Ks(t, n, l, 2)), e !== null && se(e, t, 2)
  }
  function yu(t) {
    var e = t.alternate
    return t === pt || (e !== null && e === pt)
  }
  function hd(t, e) {
    Vl = su = !0
    var n = t.pending
    n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)), (t.pending = e)
  }
  function yd(t, e, n) {
    if ((n & 4194176) !== 0) {
      var l = e.lanes
      ;(l &= t.pendingLanes), (n |= l), (e.lanes = n), To(t, n)
    }
  }
  var Fe = {
    readContext: ne,
    use: ou,
    useCallback: Qt,
    useContext: Qt,
    useEffect: Qt,
    useImperativeHandle: Qt,
    useLayoutEffect: Qt,
    useInsertionEffect: Qt,
    useMemo: Qt,
    useReducer: Qt,
    useRef: Qt,
    useState: Qt,
    useDebugValue: Qt,
    useDeferredValue: Qt,
    useTransition: Qt,
    useSyncExternalStore: Qt,
    useId: Qt,
  }
  ;(Fe.useCacheRefresh = Qt),
    (Fe.useMemoCache = Qt),
    (Fe.useHostTransitionStatus = Qt),
    (Fe.useFormState = Qt),
    (Fe.useActionState = Qt),
    (Fe.useOptimistic = Qt)
  var rl = {
    readContext: ne,
    use: ou,
    useCallback: function (t, e) {
      return (de().memoizedState = [t, e === void 0 ? null : e]), t
    },
    useContext: ne,
    useEffect: If,
    useImperativeHandle: function (t, e, n) {
      ;(n = n != null ? n.concat([t]) : null), du(4194308, 4, nd.bind(null, e, t), n)
    },
    useLayoutEffect: function (t, e) {
      return du(4194308, 4, t, e)
    },
    useInsertionEffect: function (t, e) {
      du(4, 2, t, e)
    },
    useMemo: function (t, e) {
      var n = de()
      e = e === void 0 ? null : e
      var l = t()
      if (sl) {
        En(!0)
        try {
          t()
        } finally {
          En(!1)
        }
      }
      return (n.memoizedState = [l, e]), l
    },
    useReducer: function (t, e, n) {
      var l = de()
      if (n !== void 0) {
        var s = n(e)
        if (sl) {
          En(!0)
          try {
            n(e)
          } finally {
            En(!1)
          }
        }
      } else s = e
      return (
        (l.memoizedState = l.baseState = s),
        (t = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: t,
          lastRenderedState: s,
        }),
        (l.queue = t),
        (t = t.dispatch = Fv.bind(null, pt, t)),
        [l.memoizedState, t]
      )
    },
    useRef: function (t) {
      var e = de()
      return (t = { current: t }), (e.memoizedState = t)
    },
    useState: function (t) {
      t = cr(t)
      var e = t.queue,
        n = dd.bind(null, pt, e)
      return (e.dispatch = n), [t.memoizedState, n]
    },
    useDebugValue: dr,
    useDeferredValue: function (t, e) {
      var n = de()
      return hr(n, t, e)
    },
    useTransition: function () {
      var t = cr(!1)
      return (t = sd.bind(null, pt, t.queue, !0, !1)), (de().memoizedState = t), [!1, t]
    },
    useSyncExternalStore: function (t, e, n) {
      var l = pt,
        s = de()
      if (Ot) {
        if (n === void 0) throw Error(r(407))
        n = n()
      } else {
        if (((n = e()), wt === null)) throw Error(r(349))
        ;(Et & 60) !== 0 || jf(l, e, n)
      }
      s.memoizedState = n
      var c = { value: n, getSnapshot: e }
      return (
        (s.queue = c),
        If(Bf.bind(null, l, c, t), [t]),
        (l.flags |= 2048),
        Kl(9, Hf.bind(null, l, c, n, e), { destroy: void 0 }, null),
        n
      )
    },
    useId: function () {
      var t = de(),
        e = wt.identifierPrefix
      if (Ot) {
        var n = nn,
          l = en
        ;(n = (l & ~(1 << (32 - ve(l) - 1))).toString(32) + n),
          (e = ':' + e + 'R' + n),
          (n = ru++),
          0 < n && (e += 'H' + n.toString(32)),
          (e += ':')
      } else (n = Yv++), (e = ':' + e + 'r' + n.toString(32) + ':')
      return (t.memoizedState = e)
    },
    useCacheRefresh: function () {
      return (de().memoizedState = kv.bind(null, pt))
    },
  }
  ;(rl.useMemoCache = ur),
    (rl.useHostTransitionStatus = mr),
    (rl.useFormState = Ff),
    (rl.useActionState = Ff),
    (rl.useOptimistic = function (t) {
      var e = de()
      e.memoizedState = e.baseState = t
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null,
      }
      return (e.queue = n), (e = vr.bind(null, pt, !0, n)), (n.dispatch = e), [t, e]
    })
  var Cn = {
    readContext: ne,
    use: ou,
    useCallback: ad,
    useContext: ne,
    useEffect: fr,
    useImperativeHandle: ld,
    useInsertionEffect: td,
    useLayoutEffect: ed,
    useMemo: id,
    useReducer: fu,
    useRef: Wf,
    useState: function () {
      return fu(an)
    },
    useDebugValue: dr,
    useDeferredValue: function (t, e) {
      var n = Yt()
      return ud(n, Mt.memoizedState, t, e)
    },
    useTransition: function () {
      var t = fu(an)[0],
        e = Yt().memoizedState
      return [typeof t == 'boolean' ? t : Xa(t), e]
    },
    useSyncExternalStore: qf,
    useId: od,
  }
  ;(Cn.useCacheRefresh = fd),
    (Cn.useMemoCache = ur),
    (Cn.useHostTransitionStatus = mr),
    (Cn.useFormState = Jf),
    (Cn.useActionState = Jf),
    (Cn.useOptimistic = function (t, e) {
      var n = Yt()
      return Yf(n, Mt, t, e)
    })
  var cl = {
    readContext: ne,
    use: ou,
    useCallback: ad,
    useContext: ne,
    useEffect: fr,
    useImperativeHandle: ld,
    useInsertionEffect: td,
    useLayoutEffect: ed,
    useMemo: id,
    useReducer: rr,
    useRef: Wf,
    useState: function () {
      return rr(an)
    },
    useDebugValue: dr,
    useDeferredValue: function (t, e) {
      var n = Yt()
      return Mt === null ? hr(n, t, e) : ud(n, Mt.memoizedState, t, e)
    },
    useTransition: function () {
      var t = rr(an)[0],
        e = Yt().memoizedState
      return [typeof t == 'boolean' ? t : Xa(t), e]
    },
    useSyncExternalStore: qf,
    useId: od,
  }
  ;(cl.useCacheRefresh = fd),
    (cl.useMemoCache = ur),
    (cl.useHostTransitionStatus = mr),
    (cl.useFormState = $f),
    (cl.useActionState = $f),
    (cl.useOptimistic = function (t, e) {
      var n = Yt()
      return Mt !== null ? Yf(n, Mt, t, e) : ((n.baseState = t), [t, n.queue.dispatch])
    })
  function pr(t, e, n, l) {
    ;(e = t.memoizedState),
      (n = n(l, e)),
      (n = n == null ? e : j({}, e, n)),
      (t.memoizedState = n),
      t.lanes === 0 && (t.updateQueue.baseState = n)
  }
  var gr = {
    isMounted: function (t) {
      return (t = t._reactInternals) ? tt(t) === t : !1
    },
    enqueueSetState: function (t, e, n) {
      t = t._reactInternals
      var l = _e(),
        s = zn(l)
      ;(s.payload = e),
        n != null && (s.callback = n),
        (e = Un(t, s, l)),
        e !== null && (se(e, t, l), Fa(e, t, l))
    },
    enqueueReplaceState: function (t, e, n) {
      t = t._reactInternals
      var l = _e(),
        s = zn(l)
      ;(s.tag = 1),
        (s.payload = e),
        n != null && (s.callback = n),
        (e = Un(t, s, l)),
        e !== null && (se(e, t, l), Fa(e, t, l))
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals
      var n = _e(),
        l = zn(n)
      ;(l.tag = 2),
        e != null && (l.callback = e),
        (e = Un(t, l, n)),
        e !== null && (se(e, t, n), Fa(e, t, n))
    },
  }
  function md(t, e, n, l, s, c, h) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == 'function'
        ? t.shouldComponentUpdate(l, c, h)
        : e.prototype && e.prototype.isPureReactComponent
        ? !za(n, l) || !za(s, c)
        : !0
    )
  }
  function vd(t, e, n, l) {
    ;(t = e.state),
      typeof e.componentWillReceiveProps == 'function' && e.componentWillReceiveProps(n, l),
      typeof e.UNSAFE_componentWillReceiveProps == 'function' &&
        e.UNSAFE_componentWillReceiveProps(n, l),
      e.state !== t && gr.enqueueReplaceState(e, e.state, null)
  }
  function ol(t, e) {
    var n = e
    if ('ref' in e) {
      n = {}
      for (var l in e) l !== 'ref' && (n[l] = e[l])
    }
    if ((t = t.defaultProps)) {
      n === e && (n = j({}, n))
      for (var s in t) n[s] === void 0 && (n[s] = t[s])
    }
    return n
  }
  var mu =
    typeof reportError == 'function'
      ? reportError
      : function (t) {
          if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
            var e = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof t == 'object' && t !== null && typeof t.message == 'string'
                  ? String(t.message)
                  : String(t),
              error: t,
            })
            if (!window.dispatchEvent(e)) return
          } else if (typeof process == 'object' && typeof process.emit == 'function') {
            process.emit('uncaughtException', t)
            return
          }
          console.error(t)
        }
  function pd(t) {
    mu(t)
  }
  function gd(t) {
    console.error(t)
  }
  function Sd(t) {
    mu(t)
  }
  function vu(t, e) {
    try {
      var n = t.onUncaughtError
      n(e.value, { componentStack: e.stack })
    } catch (l) {
      setTimeout(function () {
        throw l
      })
    }
  }
  function bd(t, e, n) {
    try {
      var l = t.onCaughtError
      l(n.value, { componentStack: n.stack, errorBoundary: e.tag === 1 ? e.stateNode : null })
    } catch (s) {
      setTimeout(function () {
        throw s
      })
    }
  }
  function Sr(t, e, n) {
    return (
      (n = zn(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        vu(t, e)
      }),
      n
    )
  }
  function _d(t) {
    return (t = zn(t)), (t.tag = 3), t
  }
  function Ed(t, e, n, l) {
    var s = n.type.getDerivedStateFromError
    if (typeof s == 'function') {
      var c = l.value
      ;(t.payload = function () {
        return s(c)
      }),
        (t.callback = function () {
          bd(e, n, l)
        })
    }
    var h = n.stateNode
    h !== null &&
      typeof h.componentDidCatch == 'function' &&
      (t.callback = function () {
        bd(e, n, l), typeof s != 'function' && (Bn === null ? (Bn = new Set([this])) : Bn.add(this))
        var p = l.stack
        this.componentDidCatch(l.value, { componentStack: p !== null ? p : '' })
      })
  }
  function Jv(t, e, n, l, s) {
    if (((n.flags |= 32768), l !== null && typeof l == 'object' && typeof l.then == 'function')) {
      if (((e = n.alternate), e !== null && ka(e, n, s, !0), (n = De.current), n !== null)) {
        switch (n.tag) {
          case 13:
            return (
              ke === null ? tc() : n.alternate === null && qt === 0 && (qt = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = s),
              l === Js
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null ? (n.updateQueue = new Set([l])) : e.add(l),
                  nc(t, l, s)),
              !1
            )
          case 22:
            return (
              (n.flags |= 65536),
              l === Js
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null
                    ? ((e = { transitions: null, markerInstances: null, retryQueue: new Set([l]) }),
                      (n.updateQueue = e))
                    : ((n = e.retryQueue), n === null ? (e.retryQueue = new Set([l])) : n.add(l)),
                  nc(t, l, s)),
              !1
            )
        }
        throw Error(r(435, n.tag))
      }
      return nc(t, l, s), tc(), !1
    }
    if (Ot)
      return (
        (e = De.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = s),
            l !== Fs && ((t = Error(r(422), { cause: l })), qa(Re(t, n))))
          : (l !== Fs && ((e = Error(r(423), { cause: l })), qa(Re(e, n))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (s &= -s),
            (t.lanes |= s),
            (l = Re(l, n)),
            (s = Sr(t.stateNode, l, s)),
            Nr(t, s),
            qt !== 4 && (qt = 2)),
        !1
      )
    var c = Error(r(520), { cause: l })
    if (((c = Re(c, n)), ni === null ? (ni = [c]) : ni.push(c), qt !== 4 && (qt = 2), e === null))
      return !0
    ;(l = Re(l, n)), (n = e)
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (t = s & -s),
            (n.lanes |= t),
            (t = Sr(n.stateNode, l, t)),
            Nr(n, t),
            !1
          )
        case 1:
          if (
            ((e = n.type),
            (c = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == 'function' ||
                (c !== null &&
                  typeof c.componentDidCatch == 'function' &&
                  (Bn === null || !Bn.has(c)))))
          )
            return (
              (n.flags |= 65536),
              (s &= -s),
              (n.lanes |= s),
              (s = _d(s)),
              Ed(s, t, n, l),
              Nr(n, s),
              !1
            )
      }
      n = n.return
    } while (n !== null)
    return !1
  }
  var Od = Error(r(461)),
    Jt = !1
  function It(t, e, n, l) {
    e.child = t === null ? Df(e, null, n, l) : il(e, t.child, n, l)
  }
  function Td(t, e, n, l, s) {
    n = n.render
    var c = e.ref
    if ('ref' in l) {
      var h = {}
      for (var p in l) p !== 'ref' && (h[p] = l[p])
    } else h = l
    return (
      dl(e),
      (l = nr(t, e, n, h, c, s)),
      (p = lr()),
      t !== null && !Jt
        ? (ar(t, e, s), un(t, e, s))
        : (Ot && p && Zs(e), (e.flags |= 1), It(t, e, l, s), e.child)
    )
  }
  function Rd(t, e, n, l, s) {
    if (t === null) {
      var c = n.type
      return typeof c == 'function' && !Yr(c) && c.defaultProps === void 0 && n.compare === null
        ? ((e.tag = 15), (e.type = c), Md(t, e, c, l, s))
        : ((t = _u(n.type, null, l, e, e.mode, s)), (t.ref = e.ref), (t.return = e), (e.child = t))
    }
    if (((c = t.child), !Dr(t, s))) {
      var h = c.memoizedProps
      if (((n = n.compare), (n = n !== null ? n : za), n(h, l) && t.ref === e.ref))
        return un(t, e, s)
    }
    return (e.flags |= 1), (t = jn(c, l)), (t.ref = e.ref), (t.return = e), (e.child = t)
  }
  function Md(t, e, n, l, s) {
    if (t !== null) {
      var c = t.memoizedProps
      if (za(c, l) && t.ref === e.ref)
        if (((Jt = !1), (e.pendingProps = l = c), Dr(t, s))) (t.flags & 131072) !== 0 && (Jt = !0)
        else return (e.lanes = t.lanes), un(t, e, s)
    }
    return br(t, e, n, l, s)
  }
  function Ad(t, e, n) {
    var l = e.pendingProps,
      s = l.children,
      c = (e.stateNode._pendingVisibility & 2) !== 0,
      h = t !== null ? t.memoizedState : null
    if ((Za(t, e), l.mode === 'hidden' || c)) {
      if ((e.flags & 128) !== 0) {
        if (((l = h !== null ? h.baseLanes | n : n), t !== null)) {
          for (s = e.child = t.child, c = 0; s !== null; )
            (c = c | s.lanes | s.childLanes), (s = s.sibling)
          e.childLanes = c & ~l
        } else (e.childLanes = 0), (e.child = null)
        return Dd(t, e, l, n)
      }
      if ((n & 536870912) !== 0)
        (e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && uu(e, h !== null ? h.cachePool : null),
          h !== null ? Cf(e, h) : Ps(),
          wf(e)
      else
        return (e.lanes = e.childLanes = 536870912), Dd(t, e, h !== null ? h.baseLanes | n : n, n)
    } else
      h !== null
        ? (uu(e, h.cachePool), Cf(e, h), An(), (e.memoizedState = null))
        : (t !== null && uu(e, null), Ps(), An())
    return It(t, e, s, n), e.child
  }
  function Dd(t, e, n, l) {
    var s = tr()
    return (
      (s = s === null ? null : { parent: Zt._currentValue, pool: s }),
      (e.memoizedState = { baseLanes: n, cachePool: s }),
      t !== null && uu(e, null),
      Ps(),
      wf(e),
      t !== null && ka(t, e, l, !0),
      null
    )
  }
  function Za(t, e) {
    var n = e.ref
    if (n === null) t !== null && t.ref !== null && (e.flags |= 2097664)
    else {
      if (typeof n != 'function' && typeof n != 'object') throw Error(r(284))
      ;(t === null || t.ref !== n) && (e.flags |= 2097664)
    }
  }
  function br(t, e, n, l, s) {
    return (
      dl(e),
      (n = nr(t, e, n, l, void 0, s)),
      (l = lr()),
      t !== null && !Jt
        ? (ar(t, e, s), un(t, e, s))
        : (Ot && l && Zs(e), (e.flags |= 1), It(t, e, n, s), e.child)
    )
  }
  function Cd(t, e, n, l, s, c) {
    return (
      dl(e),
      (e.updateQueue = null),
      (n = Lf(e, l, n, s)),
      Nf(t),
      (l = lr()),
      t !== null && !Jt
        ? (ar(t, e, c), un(t, e, c))
        : (Ot && l && Zs(e), (e.flags |= 1), It(t, e, n, c), e.child)
    )
  }
  function wd(t, e, n, l, s) {
    if ((dl(e), e.stateNode === null)) {
      var c = ql,
        h = n.contextType
      typeof h == 'object' && h !== null && (c = ne(h)),
        (c = new n(l, c)),
        (e.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null),
        (c.updater = gr),
        (e.stateNode = c),
        (c._reactInternals = e),
        (c = e.stateNode),
        (c.props = l),
        (c.state = e.memoizedState),
        (c.refs = {}),
        zr(e),
        (h = n.contextType),
        (c.context = typeof h == 'object' && h !== null ? ne(h) : ql),
        (c.state = e.memoizedState),
        (h = n.getDerivedStateFromProps),
        typeof h == 'function' && (pr(e, n, h, l), (c.state = e.memoizedState)),
        typeof n.getDerivedStateFromProps == 'function' ||
          typeof c.getSnapshotBeforeUpdate == 'function' ||
          (typeof c.UNSAFE_componentWillMount != 'function' &&
            typeof c.componentWillMount != 'function') ||
          ((h = c.state),
          typeof c.componentWillMount == 'function' && c.componentWillMount(),
          typeof c.UNSAFE_componentWillMount == 'function' && c.UNSAFE_componentWillMount(),
          h !== c.state && gr.enqueueReplaceState(c, c.state, null),
          Pa(e, l, c, s),
          Ja(),
          (c.state = e.memoizedState)),
        typeof c.componentDidMount == 'function' && (e.flags |= 4194308),
        (l = !0)
    } else if (t === null) {
      c = e.stateNode
      var p = e.memoizedProps,
        b = ol(n, p)
      c.props = b
      var O = c.context,
        z = n.contextType
      ;(h = ql), typeof z == 'object' && z !== null && (h = ne(z))
      var H = n.getDerivedStateFromProps
      ;(z = typeof H == 'function' || typeof c.getSnapshotBeforeUpdate == 'function'),
        (p = e.pendingProps !== p),
        z ||
          (typeof c.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof c.componentWillReceiveProps != 'function') ||
          ((p || O !== h) && vd(e, c, l, h)),
        (xn = !1)
      var C = e.memoizedState
      ;(c.state = C),
        Pa(e, l, c, s),
        Ja(),
        (O = e.memoizedState),
        p || C !== O || xn
          ? (typeof H == 'function' && (pr(e, n, H, l), (O = e.memoizedState)),
            (b = xn || md(e, n, b, l, C, O, h))
              ? (z ||
                  (typeof c.UNSAFE_componentWillMount != 'function' &&
                    typeof c.componentWillMount != 'function') ||
                  (typeof c.componentWillMount == 'function' && c.componentWillMount(),
                  typeof c.UNSAFE_componentWillMount == 'function' &&
                    c.UNSAFE_componentWillMount()),
                typeof c.componentDidMount == 'function' && (e.flags |= 4194308))
              : (typeof c.componentDidMount == 'function' && (e.flags |= 4194308),
                (e.memoizedProps = l),
                (e.memoizedState = O)),
            (c.props = l),
            (c.state = O),
            (c.context = h),
            (l = b))
          : (typeof c.componentDidMount == 'function' && (e.flags |= 4194308), (l = !1))
    } else {
      ;(c = e.stateNode),
        Ur(t, e),
        (h = e.memoizedProps),
        (z = ol(n, h)),
        (c.props = z),
        (H = e.pendingProps),
        (C = c.context),
        (O = n.contextType),
        (b = ql),
        typeof O == 'object' && O !== null && (b = ne(O)),
        (p = n.getDerivedStateFromProps),
        (O = typeof p == 'function' || typeof c.getSnapshotBeforeUpdate == 'function') ||
          (typeof c.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof c.componentWillReceiveProps != 'function') ||
          ((h !== H || C !== b) && vd(e, c, l, b)),
        (xn = !1),
        (C = e.memoizedState),
        (c.state = C),
        Pa(e, l, c, s),
        Ja()
      var x = e.memoizedState
      h !== H || C !== x || xn || (t !== null && t.dependencies !== null && pu(t.dependencies))
        ? (typeof p == 'function' && (pr(e, n, p, l), (x = e.memoizedState)),
          (z =
            xn ||
            md(e, n, z, l, C, x, b) ||
            (t !== null && t.dependencies !== null && pu(t.dependencies)))
            ? (O ||
                (typeof c.UNSAFE_componentWillUpdate != 'function' &&
                  typeof c.componentWillUpdate != 'function') ||
                (typeof c.componentWillUpdate == 'function' && c.componentWillUpdate(l, x, b),
                typeof c.UNSAFE_componentWillUpdate == 'function' &&
                  c.UNSAFE_componentWillUpdate(l, x, b)),
              typeof c.componentDidUpdate == 'function' && (e.flags |= 4),
              typeof c.getSnapshotBeforeUpdate == 'function' && (e.flags |= 1024))
            : (typeof c.componentDidUpdate != 'function' ||
                (h === t.memoizedProps && C === t.memoizedState) ||
                (e.flags |= 4),
              typeof c.getSnapshotBeforeUpdate != 'function' ||
                (h === t.memoizedProps && C === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = l),
              (e.memoizedState = x)),
          (c.props = l),
          (c.state = x),
          (c.context = b),
          (l = z))
        : (typeof c.componentDidUpdate != 'function' ||
            (h === t.memoizedProps && C === t.memoizedState) ||
            (e.flags |= 4),
          typeof c.getSnapshotBeforeUpdate != 'function' ||
            (h === t.memoizedProps && C === t.memoizedState) ||
            (e.flags |= 1024),
          (l = !1))
    }
    return (
      (c = l),
      Za(t, e),
      (l = (e.flags & 128) !== 0),
      c || l
        ? ((c = e.stateNode),
          (n = l && typeof n.getDerivedStateFromError != 'function' ? null : c.render()),
          (e.flags |= 1),
          t !== null && l
            ? ((e.child = il(e, t.child, null, s)), (e.child = il(e, null, n, s)))
            : It(t, e, n, s),
          (e.memoizedState = c.state),
          (t = e.child))
        : (t = un(t, e, s)),
      t
    )
  }
  function xd(t, e, n, l) {
    return La(), (e.flags |= 256), It(t, e, n, l), e.child
  }
  var _r = { dehydrated: null, treeContext: null, retryLane: 0 }
  function Er(t) {
    return { baseLanes: t, cachePool: Uf() }
  }
  function Or(t, e, n) {
    return (t = t !== null ? t.childLanes & ~n : 0), e && (t |= ze), t
  }
  function zd(t, e, n) {
    var l = e.pendingProps,
      s = !1,
      c = (e.flags & 128) !== 0,
      h
    if (
      ((h = c) || (h = t !== null && t.memoizedState === null ? !1 : (Kt.current & 2) !== 0),
      h && ((s = !0), (e.flags &= -129)),
      (h = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (Ot) {
        if ((s ? Mn(e) : An(), Ot)) {
          var p = Wt,
            b
          if ((b = p)) {
            t: {
              for (b = p, p = Ze; b.nodeType !== 8; ) {
                if (!p) {
                  p = null
                  break t
                }
                if (((b = Ge(b.nextSibling)), b === null)) {
                  p = null
                  break t
                }
              }
              p = b
            }
            p !== null
              ? ((e.memoizedState = {
                  dehydrated: p,
                  treeContext: nl !== null ? { id: en, overflow: nn } : null,
                  retryLane: 536870912,
                }),
                (b = xe(18, null, null, 0)),
                (b.stateNode = p),
                (b.return = e),
                (e.child = b),
                (ue = e),
                (Wt = null),
                (b = !0))
              : (b = !1)
          }
          b || al(e)
        }
        if (((p = e.memoizedState), p !== null && ((p = p.dehydrated), p !== null)))
          return p.data === '$!' ? (e.lanes = 16) : (e.lanes = 536870912), null
        ln(e)
      }
      return (
        (p = l.children),
        (l = l.fallback),
        s
          ? (An(),
            (s = e.mode),
            (p = Rr({ mode: 'hidden', children: p }, s)),
            (l = yl(l, s, n, null)),
            (p.return = e),
            (l.return = e),
            (p.sibling = l),
            (e.child = p),
            (s = e.child),
            (s.memoizedState = Er(n)),
            (s.childLanes = Or(t, h, n)),
            (e.memoizedState = _r),
            l)
          : (Mn(e), Tr(e, p))
      )
    }
    if (((b = t.memoizedState), b !== null && ((p = b.dehydrated), p !== null))) {
      if (c)
        e.flags & 256
          ? (Mn(e), (e.flags &= -257), (e = Mr(t, e, n)))
          : e.memoizedState !== null
          ? (An(), (e.child = t.child), (e.flags |= 128), (e = null))
          : (An(),
            (s = l.fallback),
            (p = e.mode),
            (l = Rr({ mode: 'visible', children: l.children }, p)),
            (s = yl(s, p, n, null)),
            (s.flags |= 2),
            (l.return = e),
            (s.return = e),
            (l.sibling = s),
            (e.child = l),
            il(e, t.child, null, n),
            (l = e.child),
            (l.memoizedState = Er(n)),
            (l.childLanes = Or(t, h, n)),
            (e.memoizedState = _r),
            (e = s))
      else if ((Mn(e), p.data === '$!')) {
        if (((h = p.nextSibling && p.nextSibling.dataset), h)) var O = h.dgst
        ;(h = O),
          (l = Error(r(419))),
          (l.stack = ''),
          (l.digest = h),
          qa({ value: l, source: null, stack: null }),
          (e = Mr(t, e, n))
      } else if ((Jt || ka(t, e, n, !1), (h = (n & t.childLanes) !== 0), Jt || h)) {
        if (((h = wt), h !== null)) {
          if (((l = n & -n), (l & 42) !== 0)) l = 1
          else
            switch (l) {
              case 2:
                l = 1
                break
              case 8:
                l = 4
                break
              case 32:
                l = 16
                break
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
                l = 64
                break
              case 268435456:
                l = 134217728
                break
              default:
                l = 0
            }
          if (((l = (l & (h.suspendedLanes | n)) !== 0 ? 0 : l), l !== 0 && l !== b.retryLane))
            throw ((b.retryLane = l), Rn(t, l), se(h, t, l), Od)
        }
        p.data === '$?' || tc(), (e = Mr(t, e, n))
      } else
        p.data === '$?'
          ? ((e.flags |= 128),
            (e.child = t.child),
            (e = o0.bind(null, t)),
            (p._reactRetry = e),
            (e = null))
          : ((t = b.treeContext),
            (Wt = Ge(p.nextSibling)),
            (ue = e),
            (Ot = !0),
            (Be = null),
            (Ze = !1),
            t !== null &&
              ((Me[Ae++] = en),
              (Me[Ae++] = nn),
              (Me[Ae++] = nl),
              (en = t.id),
              (nn = t.overflow),
              (nl = e)),
            (e = Tr(e, l.children)),
            (e.flags |= 4096))
      return e
    }
    return s
      ? (An(),
        (s = l.fallback),
        (p = e.mode),
        (b = t.child),
        (O = b.sibling),
        (l = jn(b, { mode: 'hidden', children: l.children })),
        (l.subtreeFlags = b.subtreeFlags & 31457280),
        O !== null ? (s = jn(O, s)) : ((s = yl(s, p, n, null)), (s.flags |= 2)),
        (s.return = e),
        (l.return = e),
        (l.sibling = s),
        (e.child = l),
        (l = s),
        (s = e.child),
        (p = t.child.memoizedState),
        p === null
          ? (p = Er(n))
          : ((b = p.cachePool),
            b !== null
              ? ((O = Zt._currentValue), (b = b.parent !== O ? { parent: O, pool: O } : b))
              : (b = Uf()),
            (p = { baseLanes: p.baseLanes | n, cachePool: b })),
        (s.memoizedState = p),
        (s.childLanes = Or(t, h, n)),
        (e.memoizedState = _r),
        l)
      : (Mn(e),
        (n = t.child),
        (t = n.sibling),
        (n = jn(n, { mode: 'visible', children: l.children })),
        (n.return = e),
        (n.sibling = null),
        t !== null &&
          ((h = e.deletions), h === null ? ((e.deletions = [t]), (e.flags |= 16)) : h.push(t)),
        (e.child = n),
        (e.memoizedState = null),
        n)
  }
  function Tr(t, e) {
    return (e = Rr({ mode: 'visible', children: e }, t.mode)), (e.return = t), (t.child = e)
  }
  function Rr(t, e) {
    return ah(t, e, 0, null)
  }
  function Mr(t, e, n) {
    return (
      il(e, t.child, null, n),
      (t = Tr(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    )
  }
  function Ud(t, e, n) {
    t.lanes |= e
    var l = t.alternate
    l !== null && (l.lanes |= e), wr(t.return, e, n)
  }
  function Ar(t, e, n, l, s) {
    var c = t.memoizedState
    c === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: l,
          tail: n,
          tailMode: s,
        })
      : ((c.isBackwards = e),
        (c.rendering = null),
        (c.renderingStartTime = 0),
        (c.last = l),
        (c.tail = n),
        (c.tailMode = s))
  }
  function Nd(t, e, n) {
    var l = e.pendingProps,
      s = l.revealOrder,
      c = l.tail
    if ((It(t, e, l.children, n), (l = Kt.current), (l & 2) !== 0))
      (l = (l & 1) | 2), (e.flags |= 128)
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13) t.memoizedState !== null && Ud(t, n, e)
          else if (t.tag === 19) Ud(t, n, e)
          else if (t.child !== null) {
            ;(t.child.return = t), (t = t.child)
            continue
          }
          if (t === e) break t
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) break t
            t = t.return
          }
          ;(t.sibling.return = t.return), (t = t.sibling)
        }
      l &= 1
    }
    switch ((Rt(Kt, l), s)) {
      case 'forwards':
        for (n = e.child, s = null; n !== null; )
          (t = n.alternate), t !== null && iu(t) === null && (s = n), (n = n.sibling)
        ;(n = s),
          n === null ? ((s = e.child), (e.child = null)) : ((s = n.sibling), (n.sibling = null)),
          Ar(e, !1, s, n, c)
        break
      case 'backwards':
        for (n = null, s = e.child, e.child = null; s !== null; ) {
          if (((t = s.alternate), t !== null && iu(t) === null)) {
            e.child = s
            break
          }
          ;(t = s.sibling), (s.sibling = n), (n = s), (s = t)
        }
        Ar(e, !0, n, null, c)
        break
      case 'together':
        Ar(e, !1, null, null, void 0)
        break
      default:
        e.memoizedState = null
    }
    return e.child
  }
  function un(t, e, n) {
    if (
      (t !== null && (e.dependencies = t.dependencies), (Hn |= e.lanes), (n & e.childLanes) === 0)
    )
      if (t !== null) {
        if ((ka(t, e, n, !1), (n & e.childLanes) === 0)) return null
      } else return null
    if (t !== null && e.child !== t.child) throw Error(r(153))
    if (e.child !== null) {
      for (t = e.child, n = jn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        (t = t.sibling), (n = n.sibling = jn(t, t.pendingProps)), (n.return = e)
      n.sibling = null
    }
    return e.child
  }
  function Dr(t, e) {
    return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && pu(t)))
  }
  function Pv(t, e, n) {
    switch (e.tag) {
      case 3:
        ye(e, e.stateNode.containerInfo), wn(e, Zt, t.memoizedState.cache), La()
        break
      case 27:
      case 5:
        Fn(e)
        break
      case 4:
        ye(e, e.stateNode.containerInfo)
        break
      case 10:
        wn(e, e.type, e.memoizedProps.value)
        break
      case 13:
        var l = e.memoizedState
        if (l !== null)
          return l.dehydrated !== null
            ? (Mn(e), (e.flags |= 128), null)
            : (n & e.child.childLanes) !== 0
            ? zd(t, e, n)
            : (Mn(e), (t = un(t, e, n)), t !== null ? t.sibling : null)
        Mn(e)
        break
      case 19:
        var s = (t.flags & 128) !== 0
        if (
          ((l = (n & e.childLanes) !== 0),
          l || (ka(t, e, n, !1), (l = (n & e.childLanes) !== 0)),
          s)
        ) {
          if (l) return Nd(t, e, n)
          e.flags |= 128
        }
        if (
          ((s = e.memoizedState),
          s !== null && ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
          Rt(Kt, Kt.current),
          l)
        )
          break
        return null
      case 22:
      case 23:
        return (e.lanes = 0), Ad(t, e, n)
      case 24:
        wn(e, Zt, t.memoizedState.cache)
    }
    return un(t, e, n)
  }
  function Ld(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) Jt = !0
      else {
        if (!Dr(t, n) && (e.flags & 128) === 0) return (Jt = !1), Pv(t, e, n)
        Jt = (t.flags & 131072) !== 0
      }
    else (Jt = !1), Ot && (e.flags & 1048576) !== 0 && Sf(e, tu, e.index)
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          t = e.pendingProps
          var l = e.elementType,
            s = l._init
          if (((l = s(l._payload)), (e.type = l), typeof l == 'function'))
            Yr(l)
              ? ((t = ol(l, t)), (e.tag = 1), (e = wd(null, e, l, t, n)))
              : ((e.tag = 0), (e = br(null, e, l, t, n)))
          else {
            if (l != null) {
              if (((s = l.$$typeof), s === w)) {
                ;(e.tag = 11), (e = Td(null, e, l, t, n))
                break t
              } else if (s === G) {
                ;(e.tag = 14), (e = Rd(null, e, l, t, n))
                break t
              }
            }
            throw ((e = L(l) || l), Error(r(306, e, '')))
          }
        }
        return e
      case 0:
        return br(t, e, e.type, e.pendingProps, n)
      case 1:
        return (l = e.type), (s = ol(l, e.pendingProps)), wd(t, e, l, s, n)
      case 3:
        t: {
          if ((ye(e, e.stateNode.containerInfo), t === null)) throw Error(r(387))
          var c = e.pendingProps
          ;(s = e.memoizedState), (l = s.element), Ur(t, e), Pa(e, c, null, n)
          var h = e.memoizedState
          if (
            ((c = h.cache),
            wn(e, Zt, c),
            c !== s.cache && xr(e, [Zt], n, !0),
            Ja(),
            (c = h.element),
            s.isDehydrated)
          )
            if (
              ((s = { element: c, isDehydrated: !1, cache: h.cache }),
              (e.updateQueue.baseState = s),
              (e.memoizedState = s),
              e.flags & 256)
            ) {
              e = xd(t, e, c, n)
              break t
            } else if (c !== l) {
              ;(l = Re(Error(r(424)), e)), qa(l), (e = xd(t, e, c, n))
              break t
            } else
              for (
                Wt = Ge(e.stateNode.containerInfo.firstChild),
                  ue = e,
                  Ot = !0,
                  Be = null,
                  Ze = !0,
                  n = Df(e, null, c, n),
                  e.child = n;
                n;

              )
                (n.flags = (n.flags & -3) | 4096), (n = n.sibling)
          else {
            if ((La(), c === l)) {
              e = un(t, e, n)
              break t
            }
            It(t, e, c, n)
          }
          e = e.child
        }
        return e
      case 26:
        return (
          Za(t, e),
          t === null
            ? (n = Hh(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = n)
              : Ot ||
                ((n = e.type),
                (t = e.pendingProps),
                (l = Uu(ie.current).createElement(n)),
                (l[ee] = e),
                (l[oe] = t),
                te(l, n, t),
                Ft(l),
                (e.stateNode = l))
            : (e.memoizedState = Hh(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
          null
        )
      case 27:
        return (
          Fn(e),
          t === null &&
            Ot &&
            ((l = e.stateNode = Lh(e.type, e.pendingProps, ie.current)),
            (ue = e),
            (Ze = !0),
            (Wt = Ge(l.firstChild))),
          (l = e.pendingProps.children),
          t !== null || Ot ? It(t, e, l, n) : (e.child = il(e, null, l, n)),
          Za(t, e),
          e.child
        )
      case 5:
        return (
          t === null &&
            Ot &&
            ((s = l = Wt) &&
              ((l = M0(l, e.type, e.pendingProps, Ze)),
              l !== null
                ? ((e.stateNode = l), (ue = e), (Wt = Ge(l.firstChild)), (Ze = !1), (s = !0))
                : (s = !1)),
            s || al(e)),
          Fn(e),
          (s = e.type),
          (c = e.pendingProps),
          (h = t !== null ? t.memoizedProps : null),
          (l = c.children),
          yc(s, c) ? (l = null) : h !== null && yc(s, h) && (e.flags |= 32),
          e.memoizedState !== null && ((s = nr(t, e, Vv, null, null, n)), (fi._currentValue = s)),
          Za(t, e),
          It(t, e, l, n),
          e.child
        )
      case 6:
        return (
          t === null &&
            Ot &&
            ((t = n = Wt) &&
              ((n = A0(n, e.pendingProps, Ze)),
              n !== null ? ((e.stateNode = n), (ue = e), (Wt = null), (t = !0)) : (t = !1)),
            t || al(e)),
          null
        )
      case 13:
        return zd(t, e, n)
      case 4:
        return (
          ye(e, e.stateNode.containerInfo),
          (l = e.pendingProps),
          t === null ? (e.child = il(e, null, l, n)) : It(t, e, l, n),
          e.child
        )
      case 11:
        return Td(t, e, e.type, e.pendingProps, n)
      case 7:
        return It(t, e, e.pendingProps, n), e.child
      case 8:
        return It(t, e, e.pendingProps.children, n), e.child
      case 12:
        return It(t, e, e.pendingProps.children, n), e.child
      case 10:
        return (l = e.pendingProps), wn(e, e.type, l.value), It(t, e, l.children, n), e.child
      case 9:
        return (
          (s = e.type._context),
          (l = e.pendingProps.children),
          dl(e),
          (s = ne(s)),
          (l = l(s)),
          (e.flags |= 1),
          It(t, e, l, n),
          e.child
        )
      case 14:
        return Rd(t, e, e.type, e.pendingProps, n)
      case 15:
        return Md(t, e, e.type, e.pendingProps, n)
      case 19:
        return Nd(t, e, n)
      case 22:
        return Ad(t, e, n)
      case 24:
        return (
          dl(e),
          (l = ne(Zt)),
          t === null
            ? ((s = tr()),
              s === null &&
                ((s = wt),
                (c = Ws()),
                (s.pooledCache = c),
                c.refCount++,
                c !== null && (s.pooledCacheLanes |= n),
                (s = c)),
              (e.memoizedState = { parent: l, cache: s }),
              zr(e),
              wn(e, Zt, s))
            : ((t.lanes & n) !== 0 && (Ur(t, e), Pa(e, null, null, n), Ja()),
              (s = t.memoizedState),
              (c = e.memoizedState),
              s.parent !== l
                ? ((s = { parent: l, cache: l }),
                  (e.memoizedState = s),
                  e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = s),
                  wn(e, Zt, l))
                : ((l = c.cache), wn(e, Zt, l), l !== s.cache && xr(e, [Zt], n, !0))),
          It(t, e, e.pendingProps.children, n),
          e.child
        )
      case 29:
        throw e.pendingProps
    }
    throw Error(r(156, e.tag))
  }
  var Cr = it(null),
    fl = null,
    sn = null
  function wn(t, e, n) {
    Rt(Cr, e._currentValue), (e._currentValue = n)
  }
  function rn(t) {
    ;(t._currentValue = Cr.current), _t(Cr)
  }
  function wr(t, e, n) {
    for (; t !== null; ) {
      var l = t.alternate
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), l !== null && (l.childLanes |= e))
          : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e),
        t === n)
      )
        break
      t = t.return
    }
  }
  function xr(t, e, n, l) {
    var s = t.child
    for (s !== null && (s.return = t); s !== null; ) {
      var c = s.dependencies
      if (c !== null) {
        var h = s.child
        c = c.firstContext
        t: for (; c !== null; ) {
          var p = c
          c = s
          for (var b = 0; b < e.length; b++)
            if (p.context === e[b]) {
              ;(c.lanes |= n),
                (p = c.alternate),
                p !== null && (p.lanes |= n),
                wr(c.return, n, t),
                l || (h = null)
              break t
            }
          c = p.next
        }
      } else if (s.tag === 18) {
        if (((h = s.return), h === null)) throw Error(r(341))
        ;(h.lanes |= n), (c = h.alternate), c !== null && (c.lanes |= n), wr(h, n, t), (h = null)
      } else h = s.child
      if (h !== null) h.return = s
      else
        for (h = s; h !== null; ) {
          if (h === t) {
            h = null
            break
          }
          if (((s = h.sibling), s !== null)) {
            ;(s.return = h.return), (h = s)
            break
          }
          h = h.return
        }
      s = h
    }
  }
  function ka(t, e, n, l) {
    t = null
    for (var s = e, c = !1; s !== null; ) {
      if (!c) {
        if ((s.flags & 524288) !== 0) c = !0
        else if ((s.flags & 262144) !== 0) break
      }
      if (s.tag === 10) {
        var h = s.alternate
        if (h === null) throw Error(r(387))
        if (((h = h.memoizedProps), h !== null)) {
          var p = s.type
          pe(s.pendingProps.value, h.value) || (t !== null ? t.push(p) : (t = [p]))
        }
      } else if (s === Nt.current) {
        if (((h = s.alternate), h === null)) throw Error(r(387))
        h.memoizedState.memoizedState !== s.memoizedState.memoizedState &&
          (t !== null ? t.push(fi) : (t = [fi]))
      }
      s = s.return
    }
    t !== null && xr(e, t, n, l), (e.flags |= 262144)
  }
  function pu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!pe(t.context._currentValue, t.memoizedValue)) return !0
      t = t.next
    }
    return !1
  }
  function dl(t) {
    ;(fl = t), (sn = null), (t = t.dependencies), t !== null && (t.firstContext = null)
  }
  function ne(t) {
    return qd(fl, t)
  }
  function gu(t, e) {
    return fl === null && dl(t), qd(t, e)
  }
  function qd(t, e) {
    var n = e._currentValue
    if (((e = { context: e, memoizedValue: n, next: null }), sn === null)) {
      if (t === null) throw Error(r(308))
      ;(sn = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288)
    } else sn = sn.next = e
    return n
  }
  var xn = !1
  function zr(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    }
  }
  function Ur(t, e) {
    ;(t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        })
  }
  function zn(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null }
  }
  function Un(t, e, n) {
    var l = t.updateQueue
    if (l === null) return null
    if (((l = l.shared), (Ut & 2) !== 0)) {
      var s = l.pending
      return (
        s === null ? (e.next = e) : ((e.next = s.next), (s.next = e)),
        (l.pending = e),
        (e = Wi(t)),
        pf(t, null, n),
        e
      )
    }
    return $i(t, l, e, n), Wi(t)
  }
  function Fa(t, e, n) {
    if (((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194176) !== 0))) {
      var l = e.lanes
      ;(l &= t.pendingLanes), (n |= l), (e.lanes = n), To(t, n)
    }
  }
  function Nr(t, e) {
    var n = t.updateQueue,
      l = t.alternate
    if (l !== null && ((l = l.updateQueue), n === l)) {
      var s = null,
        c = null
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var h = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null }
          c === null ? (s = c = h) : (c = c.next = h), (n = n.next)
        } while (n !== null)
        c === null ? (s = c = e) : (c = c.next = e)
      } else s = c = e
      ;(n = {
        baseState: l.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: c,
        shared: l.shared,
        callbacks: l.callbacks,
      }),
        (t.updateQueue = n)
      return
    }
    ;(t = n.lastBaseUpdate),
      t === null ? (n.firstBaseUpdate = e) : (t.next = e),
      (n.lastBaseUpdate = e)
  }
  var Lr = !1
  function Ja() {
    if (Lr) {
      var t = Yl
      if (t !== null) throw t
    }
  }
  function Pa(t, e, n, l) {
    Lr = !1
    var s = t.updateQueue
    xn = !1
    var c = s.firstBaseUpdate,
      h = s.lastBaseUpdate,
      p = s.shared.pending
    if (p !== null) {
      s.shared.pending = null
      var b = p,
        O = b.next
      ;(b.next = null), h === null ? (c = O) : (h.next = O), (h = b)
      var z = t.alternate
      z !== null &&
        ((z = z.updateQueue),
        (p = z.lastBaseUpdate),
        p !== h && (p === null ? (z.firstBaseUpdate = O) : (p.next = O), (z.lastBaseUpdate = b)))
    }
    if (c !== null) {
      var H = s.baseState
      ;(h = 0), (z = O = b = null), (p = c)
      do {
        var C = p.lane & -536870913,
          x = C !== p.lane
        if (x ? (Et & C) === C : (l & C) === C) {
          C !== 0 && C === Gl && (Lr = !0),
            z !== null &&
              (z = z.next = { lane: 0, tag: p.tag, payload: p.payload, callback: null, next: null })
          t: {
            var et = t,
              ot = p
            C = e
            var jt = n
            switch (ot.tag) {
              case 1:
                if (((et = ot.payload), typeof et == 'function')) {
                  H = et.call(jt, H, C)
                  break t
                }
                H = et
                break t
              case 3:
                et.flags = (et.flags & -65537) | 128
              case 0:
                if (
                  ((et = ot.payload),
                  (C = typeof et == 'function' ? et.call(jt, H, C) : et),
                  C == null)
                )
                  break t
                H = j({}, H, C)
                break t
              case 2:
                xn = !0
            }
          }
          ;(C = p.callback),
            C !== null &&
              ((t.flags |= 64),
              x && (t.flags |= 8192),
              (x = s.callbacks),
              x === null ? (s.callbacks = [C]) : x.push(C))
        } else
          (x = { lane: C, tag: p.tag, payload: p.payload, callback: p.callback, next: null }),
            z === null ? ((O = z = x), (b = H)) : (z = z.next = x),
            (h |= C)
        if (((p = p.next), p === null)) {
          if (((p = s.shared.pending), p === null)) break
          ;(x = p), (p = x.next), (x.next = null), (s.lastBaseUpdate = x), (s.shared.pending = null)
        }
      } while (!0)
      z === null && (b = H),
        (s.baseState = b),
        (s.firstBaseUpdate = O),
        (s.lastBaseUpdate = z),
        c === null && (s.shared.lanes = 0),
        (Hn |= h),
        (t.lanes = h),
        (t.memoizedState = H)
    }
  }
  function jd(t, e) {
    if (typeof t != 'function') throw Error(r(191, t))
    t.call(e)
  }
  function Hd(t, e) {
    var n = t.callbacks
    if (n !== null) for (t.callbacks = null, t = 0; t < n.length; t++) jd(n[t], e)
  }
  function $a(t, e) {
    try {
      var n = e.updateQueue,
        l = n !== null ? n.lastEffect : null
      if (l !== null) {
        var s = l.next
        n = s
        do {
          if ((n.tag & t) === t) {
            l = void 0
            var c = n.create,
              h = n.inst
            ;(l = c()), (h.destroy = l)
          }
          n = n.next
        } while (n !== s)
      }
    } catch (p) {
      Dt(e, e.return, p)
    }
  }
  function Nn(t, e, n) {
    try {
      var l = e.updateQueue,
        s = l !== null ? l.lastEffect : null
      if (s !== null) {
        var c = s.next
        l = c
        do {
          if ((l.tag & t) === t) {
            var h = l.inst,
              p = h.destroy
            if (p !== void 0) {
              ;(h.destroy = void 0), (s = e)
              var b = n
              try {
                p()
              } catch (O) {
                Dt(s, b, O)
              }
            }
          }
          l = l.next
        } while (l !== c)
      }
    } catch (O) {
      Dt(e, e.return, O)
    }
  }
  function Bd(t) {
    var e = t.updateQueue
    if (e !== null) {
      var n = t.stateNode
      try {
        Hd(e, n)
      } catch (l) {
        Dt(t, t.return, l)
      }
    }
  }
  function Qd(t, e, n) {
    ;(n.props = ol(t.type, t.memoizedProps)), (n.state = t.memoizedState)
    try {
      n.componentWillUnmount()
    } catch (l) {
      Dt(t, e, l)
    }
  }
  function hl(t, e) {
    try {
      var n = t.ref
      if (n !== null) {
        var l = t.stateNode
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var s = l
            break
          default:
            s = l
        }
        typeof n == 'function' ? (t.refCleanup = n(s)) : (n.current = s)
      }
    } catch (c) {
      Dt(t, e, c)
    }
  }
  function ge(t, e) {
    var n = t.ref,
      l = t.refCleanup
    if (n !== null)
      if (typeof l == 'function')
        try {
          l()
        } catch (s) {
          Dt(t, e, s)
        } finally {
          ;(t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null)
        }
      else if (typeof n == 'function')
        try {
          n(null)
        } catch (s) {
          Dt(t, e, s)
        }
      else n.current = null
  }
  function Gd(t) {
    var e = t.type,
      n = t.memoizedProps,
      l = t.stateNode
    try {
      t: switch (e) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          n.autoFocus && l.focus()
          break t
        case 'img':
          n.src ? (l.src = n.src) : n.srcSet && (l.srcset = n.srcSet)
      }
    } catch (s) {
      Dt(t, t.return, s)
    }
  }
  function Yd(t, e, n) {
    try {
      var l = t.stateNode
      _0(l, t.type, n, e), (l[oe] = e)
    } catch (s) {
      Dt(t, t.return, s)
    }
  }
  function Vd(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 || t.tag === 4
  }
  function qr(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Vd(t.return)) return null
        t = t.return
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 27 && t.tag !== 18;

      ) {
        if (t.flags & 2 || t.child === null || t.tag === 4) continue t
        ;(t.child.return = t), (t = t.child)
      }
      if (!(t.flags & 2)) return t.stateNode
    }
  }
  function jr(t, e, n) {
    var l = t.tag
    if (l === 5 || l === 6)
      (t = t.stateNode),
        e
          ? n.nodeType === 8
            ? n.parentNode.insertBefore(t, e)
            : n.insertBefore(t, e)
          : (n.nodeType === 8
              ? ((e = n.parentNode), e.insertBefore(t, n))
              : ((e = n), e.appendChild(t)),
            (n = n._reactRootContainer),
            n != null || e.onclick !== null || (e.onclick = zu))
    else if (l !== 4 && l !== 27 && ((t = t.child), t !== null))
      for (jr(t, e, n), t = t.sibling; t !== null; ) jr(t, e, n), (t = t.sibling)
  }
  function Su(t, e, n) {
    var l = t.tag
    if (l === 5 || l === 6) (t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t)
    else if (l !== 4 && l !== 27 && ((t = t.child), t !== null))
      for (Su(t, e, n), t = t.sibling; t !== null; ) Su(t, e, n), (t = t.sibling)
  }
  var cn = !1,
    Lt = !1,
    Hr = !1,
    Xd = typeof WeakSet == 'function' ? WeakSet : Set,
    Pt = null,
    Kd = !1
  function $v(t, e) {
    if (((t = t.containerInfo), (dc = Bu), (t = rf(t)), Qs(t))) {
      if ('selectionStart' in t) var n = { start: t.selectionStart, end: t.selectionEnd }
      else
        t: {
          n = ((n = t.ownerDocument) && n.defaultView) || window
          var l = n.getSelection && n.getSelection()
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode
            var s = l.anchorOffset,
              c = l.focusNode
            l = l.focusOffset
            try {
              n.nodeType, c.nodeType
            } catch {
              n = null
              break t
            }
            var h = 0,
              p = -1,
              b = -1,
              O = 0,
              z = 0,
              H = t,
              C = null
            e: for (;;) {
              for (
                var x;
                H !== n || (s !== 0 && H.nodeType !== 3) || (p = h + s),
                  H !== c || (l !== 0 && H.nodeType !== 3) || (b = h + l),
                  H.nodeType === 3 && (h += H.nodeValue.length),
                  (x = H.firstChild) !== null;

              )
                (C = H), (H = x)
              for (;;) {
                if (H === t) break e
                if (
                  (C === n && ++O === s && (p = h),
                  C === c && ++z === l && (b = h),
                  (x = H.nextSibling) !== null)
                )
                  break
                ;(H = C), (C = H.parentNode)
              }
              H = x
            }
            n = p === -1 || b === -1 ? null : { start: p, end: b }
          } else n = null
        }
      n = n || { start: 0, end: 0 }
    } else n = null
    for (hc = { focusedElem: t, selectionRange: n }, Bu = !1, Pt = e; Pt !== null; )
      if (((e = Pt), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null))
        (t.return = e), (Pt = t)
      else
        for (; Pt !== null; ) {
          switch (((e = Pt), (c = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              break
            case 11:
            case 15:
              break
            case 1:
              if ((t & 1024) !== 0 && c !== null) {
                ;(t = void 0),
                  (n = e),
                  (s = c.memoizedProps),
                  (c = c.memoizedState),
                  (l = n.stateNode)
                try {
                  var et = ol(n.type, s, n.elementType === n.type)
                  ;(t = l.getSnapshotBeforeUpdate(et, c)),
                    (l.__reactInternalSnapshotBeforeUpdate = t)
                } catch (ot) {
                  Dt(n, n.return, ot)
                }
              }
              break
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = e.stateNode.containerInfo), (n = t.nodeType), n === 9)) pc(t)
                else if (n === 1)
                  switch (t.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      pc(t)
                      break
                    default:
                      t.textContent = ''
                  }
              }
              break
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break
            default:
              if ((t & 1024) !== 0) throw Error(r(163))
          }
          if (((t = e.sibling), t !== null)) {
            ;(t.return = e.return), (Pt = t)
            break
          }
          Pt = e.return
        }
    return (et = Kd), (Kd = !1), et
  }
  function Zd(t, e, n) {
    var l = n.flags
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        fn(t, n), l & 4 && $a(5, n)
        break
      case 1:
        if ((fn(t, n), l & 4))
          if (((t = n.stateNode), e === null))
            try {
              t.componentDidMount()
            } catch (p) {
              Dt(n, n.return, p)
            }
          else {
            var s = ol(n.type, e.memoizedProps)
            e = e.memoizedState
            try {
              t.componentDidUpdate(s, e, t.__reactInternalSnapshotBeforeUpdate)
            } catch (p) {
              Dt(n, n.return, p)
            }
          }
        l & 64 && Bd(n), l & 512 && hl(n, n.return)
        break
      case 3:
        if ((fn(t, n), l & 64 && ((l = n.updateQueue), l !== null))) {
          if (((t = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode
                break
              case 1:
                t = n.child.stateNode
            }
          try {
            Hd(l, t)
          } catch (p) {
            Dt(n, n.return, p)
          }
        }
        break
      case 26:
        fn(t, n), l & 512 && hl(n, n.return)
        break
      case 27:
      case 5:
        fn(t, n), e === null && l & 4 && Gd(n), l & 512 && hl(n, n.return)
        break
      case 12:
        fn(t, n)
        break
      case 13:
        fn(t, n), l & 4 && Jd(t, n)
        break
      case 22:
        if (((s = n.memoizedState !== null || cn), !s)) {
          e = (e !== null && e.memoizedState !== null) || Lt
          var c = cn,
            h = Lt
          ;(cn = s),
            (Lt = e) && !h ? Ln(t, n, (n.subtreeFlags & 8772) !== 0) : fn(t, n),
            (cn = c),
            (Lt = h)
        }
        l & 512 && (n.memoizedProps.mode === 'manual' ? hl(n, n.return) : ge(n, n.return))
        break
      default:
        fn(t, n)
    }
  }
  function kd(t) {
    var e = t.alternate
    e !== null && ((t.alternate = null), kd(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && Ts(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null)
  }
  var Vt = null,
    Se = !1
  function on(t, e, n) {
    for (n = n.child; n !== null; ) Fd(t, e, n), (n = n.sibling)
  }
  function Fd(t, e, n) {
    if (me && typeof me.onCommitFiberUnmount == 'function')
      try {
        me.onCommitFiberUnmount(ba, n)
      } catch {}
    switch (n.tag) {
      case 26:
        Lt || ge(n, e),
          on(t, e, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n))
        break
      case 27:
        Lt || ge(n, e)
        var l = Vt,
          s = Se
        for (Vt = n.stateNode, on(t, e, n), n = n.stateNode, e = n.attributes; e.length; )
          n.removeAttributeNode(e[0])
        Ts(n), (Vt = l), (Se = s)
        break
      case 5:
        Lt || ge(n, e)
      case 6:
        s = Vt
        var c = Se
        if (((Vt = null), on(t, e, n), (Vt = s), (Se = c), Vt !== null))
          if (Se)
            try {
              ;(t = Vt),
                (l = n.stateNode),
                t.nodeType === 8 ? t.parentNode.removeChild(l) : t.removeChild(l)
            } catch (h) {
              Dt(n, e, h)
            }
          else
            try {
              Vt.removeChild(n.stateNode)
            } catch (h) {
              Dt(n, e, h)
            }
        break
      case 18:
        Vt !== null &&
          (Se
            ? ((e = Vt),
              (n = n.stateNode),
              e.nodeType === 8 ? vc(e.parentNode, n) : e.nodeType === 1 && vc(e, n),
              mi(e))
            : vc(Vt, n.stateNode))
        break
      case 4:
        ;(l = Vt),
          (s = Se),
          (Vt = n.stateNode.containerInfo),
          (Se = !0),
          on(t, e, n),
          (Vt = l),
          (Se = s)
        break
      case 0:
      case 11:
      case 14:
      case 15:
        Lt || Nn(2, n, e), Lt || Nn(4, n, e), on(t, e, n)
        break
      case 1:
        Lt ||
          (ge(n, e), (l = n.stateNode), typeof l.componentWillUnmount == 'function' && Qd(n, e, l)),
          on(t, e, n)
        break
      case 21:
        on(t, e, n)
        break
      case 22:
        Lt || ge(n, e), (Lt = (l = Lt) || n.memoizedState !== null), on(t, e, n), (Lt = l)
        break
      default:
        on(t, e, n)
    }
  }
  function Jd(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate),
      t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        mi(t)
      } catch (n) {
        Dt(e, e.return, n)
      }
  }
  function Wv(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode
        return e === null && (e = t.stateNode = new Xd()), e
      case 22:
        return (
          (t = t.stateNode), (e = t._retryCache), e === null && (e = t._retryCache = new Xd()), e
        )
      default:
        throw Error(r(435, t.tag))
    }
  }
  function Br(t, e) {
    var n = Wv(t)
    e.forEach(function (l) {
      var s = f0.bind(null, t, l)
      n.has(l) || (n.add(l), l.then(s, s))
    })
  }
  function Ce(t, e) {
    var n = e.deletions
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var s = n[l],
          c = t,
          h = e,
          p = h
        t: for (; p !== null; ) {
          switch (p.tag) {
            case 27:
            case 5:
              ;(Vt = p.stateNode), (Se = !1)
              break t
            case 3:
              ;(Vt = p.stateNode.containerInfo), (Se = !0)
              break t
            case 4:
              ;(Vt = p.stateNode.containerInfo), (Se = !0)
              break t
          }
          p = p.return
        }
        if (Vt === null) throw Error(r(160))
        Fd(c, h, s),
          (Vt = null),
          (Se = !1),
          (c = s.alternate),
          c !== null && (c.return = null),
          (s.return = null)
      }
    if (e.subtreeFlags & 13878) for (e = e.child; e !== null; ) Pd(e, t), (e = e.sibling)
  }
  var Qe = null
  function Pd(t, e) {
    var n = t.alternate,
      l = t.flags
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Ce(e, t), we(t), l & 4 && (Nn(3, t, t.return), $a(3, t), Nn(5, t, t.return))
        break
      case 1:
        Ce(e, t),
          we(t),
          l & 512 && (Lt || n === null || ge(n, n.return)),
          l & 64 &&
            cn &&
            ((t = t.updateQueue),
            t !== null &&
              ((l = t.callbacks),
              l !== null &&
                ((n = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = n === null ? l : n.concat(l)))))
        break
      case 26:
        var s = Qe
        if ((Ce(e, t), we(t), l & 512 && (Lt || n === null || ge(n, n.return)), l & 4)) {
          var c = n !== null ? n.memoizedState : null
          if (((l = t.memoizedState), n === null))
            if (l === null)
              if (t.stateNode === null) {
                t: {
                  ;(l = t.type), (n = t.memoizedProps), (s = s.ownerDocument || s)
                  e: switch (l) {
                    case 'title':
                      ;(c = s.getElementsByTagName('title')[0]),
                        (!c ||
                          c[Oa] ||
                          c[ee] ||
                          c.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          c.hasAttribute('itemprop')) &&
                          ((c = s.createElement(l)),
                          s.head.insertBefore(c, s.querySelector('head > title'))),
                        te(c, l, n),
                        (c[ee] = t),
                        Ft(c),
                        (l = c)
                      break t
                    case 'link':
                      var h = Gh('link', 'href', s).get(l + (n.href || ''))
                      if (h) {
                        for (var p = 0; p < h.length; p++)
                          if (
                            ((c = h[p]),
                            c.getAttribute('href') === (n.href == null ? null : n.href) &&
                              c.getAttribute('rel') === (n.rel == null ? null : n.rel) &&
                              c.getAttribute('title') === (n.title == null ? null : n.title) &&
                              c.getAttribute('crossorigin') ===
                                (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            h.splice(p, 1)
                            break e
                          }
                      }
                      ;(c = s.createElement(l)), te(c, l, n), s.head.appendChild(c)
                      break
                    case 'meta':
                      if ((h = Gh('meta', 'content', s).get(l + (n.content || '')))) {
                        for (p = 0; p < h.length; p++)
                          if (
                            ((c = h[p]),
                            c.getAttribute('content') ===
                              (n.content == null ? null : '' + n.content) &&
                              c.getAttribute('name') === (n.name == null ? null : n.name) &&
                              c.getAttribute('property') ===
                                (n.property == null ? null : n.property) &&
                              c.getAttribute('http-equiv') ===
                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                              c.getAttribute('charset') === (n.charSet == null ? null : n.charSet))
                          ) {
                            h.splice(p, 1)
                            break e
                          }
                      }
                      ;(c = s.createElement(l)), te(c, l, n), s.head.appendChild(c)
                      break
                    default:
                      throw Error(r(468, l))
                  }
                  ;(c[ee] = t), Ft(c), (l = c)
                }
                t.stateNode = l
              } else Yh(s, t.type, t.stateNode)
            else t.stateNode = Qh(s, l, t.memoizedProps)
          else
            c !== l
              ? (c === null
                  ? n.stateNode !== null && ((n = n.stateNode), n.parentNode.removeChild(n))
                  : c.count--,
                l === null ? Yh(s, t.type, t.stateNode) : Qh(s, l, t.memoizedProps))
              : l === null && t.stateNode !== null && Yd(t, t.memoizedProps, n.memoizedProps)
        }
        break
      case 27:
        if (l & 4 && t.alternate === null) {
          ;(s = t.stateNode), (c = t.memoizedProps)
          try {
            for (var b = s.firstChild; b; ) {
              var O = b.nextSibling,
                z = b.nodeName
              b[Oa] ||
                z === 'HEAD' ||
                z === 'BODY' ||
                z === 'SCRIPT' ||
                z === 'STYLE' ||
                (z === 'LINK' && b.rel.toLowerCase() === 'stylesheet') ||
                s.removeChild(b),
                (b = O)
            }
            for (var H = t.type, C = s.attributes; C.length; ) s.removeAttributeNode(C[0])
            te(s, H, c), (s[ee] = t), (s[oe] = c)
          } catch (et) {
            Dt(t, t.return, et)
          }
        }
      case 5:
        if ((Ce(e, t), we(t), l & 512 && (Lt || n === null || ge(n, n.return)), t.flags & 32)) {
          s = t.stateNode
          try {
            Cl(s, '')
          } catch (et) {
            Dt(t, t.return, et)
          }
        }
        l & 4 &&
          t.stateNode != null &&
          ((s = t.memoizedProps), Yd(t, s, n !== null ? n.memoizedProps : s)),
          l & 1024 && (Hr = !0)
        break
      case 6:
        if ((Ce(e, t), we(t), l & 4)) {
          if (t.stateNode === null) throw Error(r(162))
          ;(l = t.memoizedProps), (n = t.stateNode)
          try {
            n.nodeValue = l
          } catch (et) {
            Dt(t, t.return, et)
          }
        }
        break
      case 3:
        if (
          ((qu = null),
          (s = Qe),
          (Qe = Nu(e.containerInfo)),
          Ce(e, t),
          (Qe = s),
          we(t),
          l & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            mi(e.containerInfo)
          } catch (et) {
            Dt(t, t.return, et)
          }
        Hr && ((Hr = !1), $d(t))
        break
      case 4:
        ;(l = Qe), (Qe = Nu(t.stateNode.containerInfo)), Ce(e, t), we(t), (Qe = l)
        break
      case 12:
        Ce(e, t), we(t)
        break
      case 13:
        Ce(e, t),
          we(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) != (n !== null && n.memoizedState !== null) &&
            (Fr = Ke()),
          l & 4 && ((l = t.updateQueue), l !== null && ((t.updateQueue = null), Br(t, l)))
        break
      case 22:
        if (
          (l & 512 && (Lt || n === null || ge(n, n.return)),
          (b = t.memoizedState !== null),
          (O = n !== null && n.memoizedState !== null),
          (z = cn),
          (H = Lt),
          (cn = z || b),
          (Lt = H || O),
          Ce(e, t),
          (Lt = H),
          (cn = z),
          we(t),
          (e = t.stateNode),
          (e._current = t),
          (e._visibility &= -3),
          (e._visibility |= e._pendingVisibility & 2),
          l & 8192 &&
            ((e._visibility = b ? e._visibility & -2 : e._visibility | 1),
            b && ((e = cn || Lt), n === null || O || e || Zl(t)),
            t.memoizedProps === null || t.memoizedProps.mode !== 'manual'))
        )
          t: for (n = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26 || e.tag === 27) {
              if (n === null) {
                O = n = e
                try {
                  if (((s = O.stateNode), b))
                    (c = s.style),
                      typeof c.setProperty == 'function'
                        ? c.setProperty('display', 'none', 'important')
                        : (c.display = 'none')
                  else {
                    ;(h = O.stateNode), (p = O.memoizedProps.style)
                    var x = p != null && p.hasOwnProperty('display') ? p.display : null
                    h.style.display = x == null || typeof x == 'boolean' ? '' : ('' + x).trim()
                  }
                } catch (et) {
                  Dt(O, O.return, et)
                }
              }
            } else if (e.tag === 6) {
              if (n === null) {
                O = e
                try {
                  O.stateNode.nodeValue = b ? '' : O.memoizedProps
                } catch (et) {
                  Dt(O, O.return, et)
                }
              }
            } else if (
              ((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === t) &&
              e.child !== null
            ) {
              ;(e.child.return = e), (e = e.child)
              continue
            }
            if (e === t) break t
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t
              n === e && (n = null), (e = e.return)
            }
            n === e && (n = null), (e.sibling.return = e.return), (e = e.sibling)
          }
        l & 4 &&
          ((l = t.updateQueue),
          l !== null && ((n = l.retryQueue), n !== null && ((l.retryQueue = null), Br(t, n))))
        break
      case 19:
        Ce(e, t),
          we(t),
          l & 4 && ((l = t.updateQueue), l !== null && ((t.updateQueue = null), Br(t, l)))
        break
      case 21:
        break
      default:
        Ce(e, t), we(t)
    }
  }
  function we(t) {
    var e = t.flags
    if (e & 2) {
      try {
        if (t.tag !== 27) {
          t: {
            for (var n = t.return; n !== null; ) {
              if (Vd(n)) {
                var l = n
                break t
              }
              n = n.return
            }
            throw Error(r(160))
          }
          switch (l.tag) {
            case 27:
              var s = l.stateNode,
                c = qr(t)
              Su(t, c, s)
              break
            case 5:
              var h = l.stateNode
              l.flags & 32 && (Cl(h, ''), (l.flags &= -33))
              var p = qr(t)
              Su(t, p, h)
              break
            case 3:
            case 4:
              var b = l.stateNode.containerInfo,
                O = qr(t)
              jr(t, O, b)
              break
            default:
              throw Error(r(161))
          }
        }
      } catch (z) {
        Dt(t, t.return, z)
      }
      t.flags &= -3
    }
    e & 4096 && (t.flags &= -4097)
  }
  function $d(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t
        $d(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling)
      }
  }
  function fn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; ) Zd(t, e.alternate, e), (e = e.sibling)
  }
  function Zl(t) {
    for (t = t.child; t !== null; ) {
      var e = t
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Nn(4, e, e.return), Zl(e)
          break
        case 1:
          ge(e, e.return)
          var n = e.stateNode
          typeof n.componentWillUnmount == 'function' && Qd(e, e.return, n), Zl(e)
          break
        case 26:
        case 27:
        case 5:
          ge(e, e.return), Zl(e)
          break
        case 22:
          ge(e, e.return), e.memoizedState === null && Zl(e)
          break
        default:
          Zl(e)
      }
      t = t.sibling
    }
  }
  function Ln(t, e, n) {
    for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var l = e.alternate,
        s = t,
        c = e,
        h = c.flags
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Ln(s, c, n), $a(4, c)
          break
        case 1:
          if ((Ln(s, c, n), (l = c), (s = l.stateNode), typeof s.componentDidMount == 'function'))
            try {
              s.componentDidMount()
            } catch (O) {
              Dt(l, l.return, O)
            }
          if (((l = c), (s = l.updateQueue), s !== null)) {
            var p = l.stateNode
            try {
              var b = s.shared.hiddenCallbacks
              if (b !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < b.length; s++) jd(b[s], p)
            } catch (O) {
              Dt(l, l.return, O)
            }
          }
          n && h & 64 && Bd(c), hl(c, c.return)
          break
        case 26:
        case 27:
        case 5:
          Ln(s, c, n), n && l === null && h & 4 && Gd(c), hl(c, c.return)
          break
        case 12:
          Ln(s, c, n)
          break
        case 13:
          Ln(s, c, n), n && h & 4 && Jd(s, c)
          break
        case 22:
          c.memoizedState === null && Ln(s, c, n), hl(c, c.return)
          break
        default:
          Ln(s, c, n)
      }
      e = e.sibling
    }
  }
  function Qr(t, e) {
    var n = null
    t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (n = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (t = e.memoizedState.cachePool.pool),
      t !== n && (t != null && t.refCount++, n != null && Ga(n))
  }
  function Gr(t, e) {
    ;(t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && Ga(t))
  }
  function qn(t, e, n, l) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) Wd(t, e, n, l), (e = e.sibling)
  }
  function Wd(t, e, n, l) {
    var s = e.flags
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        qn(t, e, n, l), s & 2048 && $a(9, e)
        break
      case 3:
        qn(t, e, n, l),
          s & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && Ga(t)))
        break
      case 12:
        if (s & 2048) {
          qn(t, e, n, l), (t = e.stateNode)
          try {
            var c = e.memoizedProps,
              h = c.id,
              p = c.onPostCommit
            typeof p == 'function' &&
              p(h, e.alternate === null ? 'mount' : 'update', t.passiveEffectDuration, -0)
          } catch (b) {
            Dt(e, e.return, b)
          }
        } else qn(t, e, n, l)
        break
      case 23:
        break
      case 22:
        ;(c = e.stateNode),
          e.memoizedState !== null
            ? c._visibility & 4
              ? qn(t, e, n, l)
              : Wa(t, e)
            : c._visibility & 4
            ? qn(t, e, n, l)
            : ((c._visibility |= 4), kl(t, e, n, l, (e.subtreeFlags & 10256) !== 0)),
          s & 2048 && Qr(e.alternate, e)
        break
      case 24:
        qn(t, e, n, l), s & 2048 && Gr(e.alternate, e)
        break
      default:
        qn(t, e, n, l)
    }
  }
  function kl(t, e, n, l, s) {
    for (s = s && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var c = t,
        h = e,
        p = n,
        b = l,
        O = h.flags
      switch (h.tag) {
        case 0:
        case 11:
        case 15:
          kl(c, h, p, b, s), $a(8, h)
          break
        case 23:
          break
        case 22:
          var z = h.stateNode
          h.memoizedState !== null
            ? z._visibility & 4
              ? kl(c, h, p, b, s)
              : Wa(c, h)
            : ((z._visibility |= 4), kl(c, h, p, b, s)),
            s && O & 2048 && Qr(h.alternate, h)
          break
        case 24:
          kl(c, h, p, b, s), s && O & 2048 && Gr(h.alternate, h)
          break
        default:
          kl(c, h, p, b, s)
      }
      e = e.sibling
    }
  }
  function Wa(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t,
          l = e,
          s = l.flags
        switch (l.tag) {
          case 22:
            Wa(n, l), s & 2048 && Qr(l.alternate, l)
            break
          case 24:
            Wa(n, l), s & 2048 && Gr(l.alternate, l)
            break
          default:
            Wa(n, l)
        }
        e = e.sibling
      }
  }
  var Ia = 8192
  function Fl(t) {
    if (t.subtreeFlags & Ia) for (t = t.child; t !== null; ) Id(t), (t = t.sibling)
  }
  function Id(t) {
    switch (t.tag) {
      case 26:
        Fl(t), t.flags & Ia && t.memoizedState !== null && Q0(Qe, t.memoizedState, t.memoizedProps)
        break
      case 5:
        Fl(t)
        break
      case 3:
      case 4:
        var e = Qe
        ;(Qe = Nu(t.stateNode.containerInfo)), Fl(t), (Qe = e)
        break
      case 22:
        t.memoizedState === null &&
          ((e = t.alternate),
          e !== null && e.memoizedState !== null
            ? ((e = Ia), (Ia = 16777216), Fl(t), (Ia = e))
            : Fl(t))
        break
      default:
        Fl(t)
    }
  }
  function th(t) {
    var e = t.alternate
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null
      do (e = t.sibling), (t.sibling = null), (t = e)
      while (t !== null)
    }
  }
  function ti(t) {
    var e = t.deletions
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var l = e[n]
          ;(Pt = l), nh(l, t)
        }
      th(t)
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) eh(t), (t = t.sibling)
  }
  function eh(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        ti(t), t.flags & 2048 && Nn(9, t, t.return)
        break
      case 3:
        ti(t)
        break
      case 12:
        ti(t)
        break
      case 22:
        var e = t.stateNode
        t.memoizedState !== null && e._visibility & 4 && (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -5), bu(t))
          : ti(t)
        break
      default:
        ti(t)
    }
  }
  function bu(t) {
    var e = t.deletions
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var l = e[n]
          ;(Pt = l), nh(l, t)
        }
      th(t)
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          Nn(8, e, e.return), bu(e)
          break
        case 22:
          ;(n = e.stateNode), n._visibility & 4 && ((n._visibility &= -5), bu(e))
          break
        default:
          bu(e)
      }
      t = t.sibling
    }
  }
  function nh(t, e) {
    for (; Pt !== null; ) {
      var n = Pt
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Nn(8, n, e)
          break
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool
            l != null && l.refCount++
          }
          break
        case 24:
          Ga(n.memoizedState.cache)
      }
      if (((l = n.child), l !== null)) (l.return = n), (Pt = l)
      else
        t: for (n = t; Pt !== null; ) {
          l = Pt
          var s = l.sibling,
            c = l.return
          if ((kd(l), l === n)) {
            Pt = null
            break t
          }
          if (s !== null) {
            ;(s.return = c), (Pt = s)
            break t
          }
          Pt = c
        }
    }
  }
  function Iv(t, e, n, l) {
    ;(this.tag = t),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null)
  }
  function xe(t, e, n, l) {
    return new Iv(t, e, n, l)
  }
  function Yr(t) {
    return (t = t.prototype), !(!t || !t.isReactComponent)
  }
  function jn(t, e) {
    var n = t.alternate
    return (
      n === null
        ? ((n = xe(t.tag, e, t.key, t.mode)),
          (n.elementType = t.elementType),
          (n.type = t.type),
          (n.stateNode = t.stateNode),
          (n.alternate = t),
          (t.alternate = n))
        : ((n.pendingProps = e),
          (n.type = t.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = t.flags & 31457280),
      (n.childLanes = t.childLanes),
      (n.lanes = t.lanes),
      (n.child = t.child),
      (n.memoizedProps = t.memoizedProps),
      (n.memoizedState = t.memoizedState),
      (n.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (n.sibling = t.sibling),
      (n.index = t.index),
      (n.ref = t.ref),
      (n.refCleanup = t.refCleanup),
      n
    )
  }
  function lh(t, e) {
    t.flags &= 31457282
    var n = t.alternate
    return (
      n === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = n.childLanes),
          (t.lanes = n.lanes),
          (t.child = n.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = n.memoizedProps),
          (t.memoizedState = n.memoizedState),
          (t.updateQueue = n.updateQueue),
          (t.type = n.type),
          (e = n.dependencies),
          (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    )
  }
  function _u(t, e, n, l, s, c) {
    var h = 0
    if (((l = t), typeof t == 'function')) Yr(t) && (h = 1)
    else if (typeof t == 'string')
      h = H0(t, n, kt.current) ? 26 : t === 'html' || t === 'head' || t === 'body' ? 27 : 5
    else
      t: switch (t) {
        case m:
          return yl(n.children, s, c, e)
        case v:
          ;(h = 8), (s |= 24)
          break
        case g:
          return (t = xe(12, n, e, s | 2)), (t.elementType = g), (t.lanes = c), t
        case U:
          return (t = xe(13, n, e, s)), (t.elementType = U), (t.lanes = c), t
        case Z:
          return (t = xe(19, n, e, s)), (t.elementType = Z), (t.lanes = c), t
        case nt:
          return ah(n, s, c, e)
        default:
          if (typeof t == 'object' && t !== null)
            switch (t.$$typeof) {
              case S:
              case D:
                h = 10
                break t
              case T:
                h = 9
                break t
              case w:
                h = 11
                break t
              case G:
                h = 14
                break t
              case X:
                ;(h = 16), (l = null)
                break t
            }
          ;(h = 29), (n = Error(r(130, t === null ? 'null' : typeof t, ''))), (l = null)
      }
    return (e = xe(h, n, e, s)), (e.elementType = t), (e.type = l), (e.lanes = c), e
  }
  function yl(t, e, n, l) {
    return (t = xe(7, t, l, e)), (t.lanes = n), t
  }
  function ah(t, e, n, l) {
    ;(t = xe(22, t, l, e)), (t.elementType = nt), (t.lanes = n)
    var s = {
      _visibility: 1,
      _pendingVisibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null,
      _current: null,
      detach: function () {
        var c = s._current
        if (c === null) throw Error(r(456))
        if ((s._pendingVisibility & 2) === 0) {
          var h = Rn(c, 2)
          h !== null && ((s._pendingVisibility |= 2), se(h, c, 2))
        }
      },
      attach: function () {
        var c = s._current
        if (c === null) throw Error(r(456))
        if ((s._pendingVisibility & 2) !== 0) {
          var h = Rn(c, 2)
          h !== null && ((s._pendingVisibility &= -3), se(h, c, 2))
        }
      },
    }
    return (t.stateNode = s), t
  }
  function Vr(t, e, n) {
    return (t = xe(6, t, null, e)), (t.lanes = n), t
  }
  function Xr(t, e, n) {
    return (
      (e = xe(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = n),
      (e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      e
    )
  }
  function dn(t) {
    t.flags |= 4
  }
  function ih(t, e) {
    if (e.type !== 'stylesheet' || (e.state.loading & 4) !== 0) t.flags &= -16777217
    else if (((t.flags |= 16777216), !Vh(e))) {
      if (
        ((e = De.current),
        e !== null &&
          ((Et & 4194176) === Et
            ? ke !== null
            : ((Et & 62914560) !== Et && (Et & 536870912) === 0) || e !== ke))
      )
        throw ((Ha = Js), Ef)
      t.flags |= 8192
    }
  }
  function Eu(t, e) {
    e !== null && (t.flags |= 4),
      t.flags & 16384 && ((e = t.tag !== 22 ? Eo() : 536870912), (t.lanes |= e), (Pl |= e))
  }
  function ei(t, e) {
    if (!Ot)
      switch (t.tailMode) {
        case 'hidden':
          e = t.tail
          for (var n = null; e !== null; ) e.alternate !== null && (n = e), (e = e.sibling)
          n === null ? (t.tail = null) : (n.sibling = null)
          break
        case 'collapsed':
          n = t.tail
          for (var l = null; n !== null; ) n.alternate !== null && (l = n), (n = n.sibling)
          l === null
            ? e || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (l.sibling = null)
      }
  }
  function zt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      n = 0,
      l = 0
    if (e)
      for (var s = t.child; s !== null; )
        (n |= s.lanes | s.childLanes),
          (l |= s.subtreeFlags & 31457280),
          (l |= s.flags & 31457280),
          (s.return = t),
          (s = s.sibling)
    else
      for (s = t.child; s !== null; )
        (n |= s.lanes | s.childLanes),
          (l |= s.subtreeFlags),
          (l |= s.flags),
          (s.return = t),
          (s = s.sibling)
    return (t.subtreeFlags |= l), (t.childLanes = n), e
  }
  function t0(t, e, n) {
    var l = e.pendingProps
    switch ((ks(e), e.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return zt(e), null
      case 1:
        return zt(e), null
      case 3:
        return (
          (n = e.stateNode),
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          rn(Zt),
          Bt(),
          n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
          (t === null || t.child === null) &&
            (Na(e)
              ? dn(e)
              : t === null ||
                (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                ((e.flags |= 1024), Be !== null && (Wr(Be), (Be = null)))),
          zt(e),
          null
        )
      case 26:
        return (
          (n = e.memoizedState),
          t === null
            ? (dn(e), n !== null ? (zt(e), ih(e, n)) : (zt(e), (e.flags &= -16777217)))
            : n
            ? n !== t.memoizedState
              ? (dn(e), zt(e), ih(e, n))
              : (zt(e), (e.flags &= -16777217))
            : (t.memoizedProps !== l && dn(e), zt(e), (e.flags &= -16777217)),
          null
        )
      case 27:
        Jn(e), (n = ie.current)
        var s = e.type
        if (t !== null && e.stateNode != null) t.memoizedProps !== l && dn(e)
        else {
          if (!l) {
            if (e.stateNode === null) throw Error(r(166))
            return zt(e), null
          }
          ;(t = kt.current), Na(e) ? bf(e) : ((t = Lh(s, l, n)), (e.stateNode = t), dn(e))
        }
        return zt(e), null
      case 5:
        if ((Jn(e), (n = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== l && dn(e)
        else {
          if (!l) {
            if (e.stateNode === null) throw Error(r(166))
            return zt(e), null
          }
          if (((t = kt.current), Na(e))) bf(e)
          else {
            switch (((s = Uu(ie.current)), t)) {
              case 1:
                t = s.createElementNS('http://www.w3.org/2000/svg', n)
                break
              case 2:
                t = s.createElementNS('http://www.w3.org/1998/Math/MathML', n)
                break
              default:
                switch (n) {
                  case 'svg':
                    t = s.createElementNS('http://www.w3.org/2000/svg', n)
                    break
                  case 'math':
                    t = s.createElementNS('http://www.w3.org/1998/Math/MathML', n)
                    break
                  case 'script':
                    ;(t = s.createElement('div')),
                      (t.innerHTML = '<script></script>'),
                      (t = t.removeChild(t.firstChild))
                    break
                  case 'select':
                    ;(t =
                      typeof l.is == 'string'
                        ? s.createElement('select', { is: l.is })
                        : s.createElement('select')),
                      l.multiple ? (t.multiple = !0) : l.size && (t.size = l.size)
                    break
                  default:
                    t =
                      typeof l.is == 'string'
                        ? s.createElement(n, { is: l.is })
                        : s.createElement(n)
                }
            }
            ;(t[ee] = e), (t[oe] = l)
            t: for (s = e.child; s !== null; ) {
              if (s.tag === 5 || s.tag === 6) t.appendChild(s.stateNode)
              else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                ;(s.child.return = s), (s = s.child)
                continue
              }
              if (s === e) break t
              for (; s.sibling === null; ) {
                if (s.return === null || s.return === e) break t
                s = s.return
              }
              ;(s.sibling.return = s.return), (s = s.sibling)
            }
            e.stateNode = t
            t: switch ((te(t, n, l), n)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                t = !!l.autoFocus
                break t
              case 'img':
                t = !0
                break t
              default:
                t = !1
            }
            t && dn(e)
          }
        }
        return zt(e), (e.flags &= -16777217), null
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== l && dn(e)
        else {
          if (typeof l != 'string' && e.stateNode === null) throw Error(r(166))
          if (((t = ie.current), Na(e))) {
            if (((t = e.stateNode), (n = e.memoizedProps), (l = null), (s = ue), s !== null))
              switch (s.tag) {
                case 27:
                case 5:
                  l = s.memoizedProps
              }
            ;(t[ee] = e),
              (t = !!(
                t.nodeValue === n ||
                (l !== null && l.suppressHydrationWarning === !0) ||
                Ch(t.nodeValue, n)
              )),
              t || al(e)
          } else (t = Uu(t).createTextNode(l)), (t[ee] = e), (e.stateNode = t)
        }
        return zt(e), null
      case 13:
        if (
          ((l = e.memoizedState),
          t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((s = Na(e)), l !== null && l.dehydrated !== null)) {
            if (t === null) {
              if (!s) throw Error(r(318))
              if (((s = e.memoizedState), (s = s !== null ? s.dehydrated : null), !s))
                throw Error(r(317))
              s[ee] = e
            } else La(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4)
            zt(e), (s = !1)
          } else Be !== null && (Wr(Be), (Be = null)), (s = !0)
          if (!s) return e.flags & 256 ? (ln(e), e) : (ln(e), null)
        }
        if ((ln(e), (e.flags & 128) !== 0)) return (e.lanes = n), e
        if (((n = l !== null), (t = t !== null && t.memoizedState !== null), n)) {
          ;(l = e.child),
            (s = null),
            l.alternate !== null &&
              l.alternate.memoizedState !== null &&
              l.alternate.memoizedState.cachePool !== null &&
              (s = l.alternate.memoizedState.cachePool.pool)
          var c = null
          l.memoizedState !== null &&
            l.memoizedState.cachePool !== null &&
            (c = l.memoizedState.cachePool.pool),
            c !== s && (l.flags |= 2048)
        }
        return n !== t && n && (e.child.flags |= 8192), Eu(e, e.updateQueue), zt(e), null
      case 4:
        return Bt(), t === null && cc(e.stateNode.containerInfo), zt(e), null
      case 10:
        return rn(e.type), zt(e), null
      case 19:
        if ((_t(Kt), (s = e.memoizedState), s === null)) return zt(e), null
        if (((l = (e.flags & 128) !== 0), (c = s.rendering), c === null))
          if (l) ei(s, !1)
          else {
            if (qt !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((c = iu(t)), c !== null)) {
                  for (
                    e.flags |= 128,
                      ei(s, !1),
                      t = c.updateQueue,
                      e.updateQueue = t,
                      Eu(e, t),
                      e.subtreeFlags = 0,
                      t = n,
                      n = e.child;
                    n !== null;

                  )
                    lh(n, t), (n = n.sibling)
                  return Rt(Kt, (Kt.current & 1) | 2), e.child
                }
                t = t.sibling
              }
            s.tail !== null &&
              Ke() > Ou &&
              ((e.flags |= 128), (l = !0), ei(s, !1), (e.lanes = 4194304))
          }
        else {
          if (!l)
            if (((t = iu(c)), t !== null)) {
              if (
                ((e.flags |= 128),
                (l = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                Eu(e, t),
                ei(s, !0),
                s.tail === null && s.tailMode === 'hidden' && !c.alternate && !Ot)
              )
                return zt(e), null
            } else
              2 * Ke() - s.renderingStartTime > Ou &&
                n !== 536870912 &&
                ((e.flags |= 128), (l = !0), ei(s, !1), (e.lanes = 4194304))
          s.isBackwards
            ? ((c.sibling = e.child), (e.child = c))
            : ((t = s.last), t !== null ? (t.sibling = c) : (e.child = c), (s.last = c))
        }
        return s.tail !== null
          ? ((e = s.tail),
            (s.rendering = e),
            (s.tail = e.sibling),
            (s.renderingStartTime = Ke()),
            (e.sibling = null),
            (t = Kt.current),
            Rt(Kt, l ? (t & 1) | 2 : t & 1),
            e)
          : (zt(e), null)
      case 22:
      case 23:
        return (
          ln(e),
          $s(),
          (l = e.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== l && (e.flags |= 8192)
            : l && (e.flags |= 8192),
          l
            ? (n & 536870912) !== 0 &&
              (e.flags & 128) === 0 &&
              (zt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : zt(e),
          (n = e.updateQueue),
          n !== null && Eu(e, n.retryQueue),
          (n = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (n = t.memoizedState.cachePool.pool),
          (l = null),
          e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (l = e.memoizedState.cachePool.pool),
          l !== n && (e.flags |= 2048),
          t !== null && _t(ul),
          null
        )
      case 24:
        return (
          (n = null),
          t !== null && (n = t.memoizedState.cache),
          e.memoizedState.cache !== n && (e.flags |= 2048),
          rn(Zt),
          zt(e),
          null
        )
      case 25:
        return null
    }
    throw Error(r(156, e.tag))
  }
  function e0(t, e) {
    switch ((ks(e), e.tag)) {
      case 1:
        return (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
      case 3:
        return (
          rn(Zt),
          Bt(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
        )
      case 26:
      case 27:
      case 5:
        return Jn(e), null
      case 13:
        if ((ln(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
          if (e.alternate === null) throw Error(r(340))
          La()
        }
        return (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
      case 19:
        return _t(Kt), null
      case 4:
        return Bt(), null
      case 10:
        return rn(e.type), null
      case 22:
      case 23:
        return (
          ln(e),
          $s(),
          t !== null && _t(ul),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        )
      case 24:
        return rn(Zt), null
      case 25:
        return null
      default:
        return null
    }
  }
  function uh(t, e) {
    switch ((ks(e), e.tag)) {
      case 3:
        rn(Zt), Bt()
        break
      case 26:
      case 27:
      case 5:
        Jn(e)
        break
      case 4:
        Bt()
        break
      case 13:
        ln(e)
        break
      case 19:
        _t(Kt)
        break
      case 10:
        rn(e.type)
        break
      case 22:
      case 23:
        ln(e), $s(), t !== null && _t(ul)
        break
      case 24:
        rn(Zt)
    }
  }
  var n0 = {
      getCacheForType: function (t) {
        var e = ne(Zt),
          n = e.data.get(t)
        return n === void 0 && ((n = t()), e.data.set(t, n)), n
      },
    },
    l0 = typeof WeakMap == 'function' ? WeakMap : Map,
    Ut = 0,
    wt = null,
    St = null,
    Et = 0,
    xt = 0,
    be = null,
    hn = !1,
    Jl = !1,
    Kr = !1,
    yn = 0,
    qt = 0,
    Hn = 0,
    ml = 0,
    Zr = 0,
    ze = 0,
    Pl = 0,
    ni = null,
    Je = null,
    kr = !1,
    Fr = 0,
    Ou = 1 / 0,
    Tu = null,
    Bn = null,
    Ru = !1,
    vl = null,
    li = 0,
    Jr = 0,
    Pr = null,
    ai = 0,
    $r = null
  function _e() {
    if ((Ut & 2) !== 0 && Et !== 0) return Et & -Et
    if (R.T !== null) {
      var t = Gl
      return t !== 0 ? t : ic()
    }
    return Mo()
  }
  function sh() {
    ze === 0 && (ze = (Et & 536870912) === 0 || Ot ? _o() : 536870912)
    var t = De.current
    return t !== null && (t.flags |= 32), ze
  }
  function se(t, e, n) {
    ;((t === wt && xt === 2) || t.cancelPendingCommit !== null) && ($l(t, 0), mn(t, Et, ze, !1)),
      Ea(t, n),
      ((Ut & 2) === 0 || t !== wt) &&
        (t === wt && ((Ut & 2) === 0 && (ml |= n), qt === 4 && mn(t, Et, ze, !1)), Pe(t))
  }
  function rh(t, e, n) {
    if ((Ut & 6) !== 0) throw Error(r(327))
    var l = (!n && (e & 60) === 0 && (e & t.expiredLanes) === 0) || _a(t, e),
      s = l ? u0(t, e) : ec(t, e, !0),
      c = l
    do {
      if (s === 0) {
        Jl && !l && mn(t, e, 0, !1)
        break
      } else if (s === 6) mn(t, e, 0, !hn)
      else {
        if (((n = t.current.alternate), c && !a0(n))) {
          ;(s = ec(t, e, !1)), (c = !1)
          continue
        }
        if (s === 2) {
          if (((c = e), t.errorRecoveryDisabledLanes & c)) var h = 0
          else (h = t.pendingLanes & -536870913), (h = h !== 0 ? h : h & 536870912 ? 536870912 : 0)
          if (h !== 0) {
            e = h
            t: {
              var p = t
              s = ni
              var b = p.current.memoizedState.isDehydrated
              if ((b && ($l(p, h).flags |= 256), (h = ec(p, h, !1)), h !== 2)) {
                if (Kr && !b) {
                  ;(p.errorRecoveryDisabledLanes |= c), (ml |= c), (s = 4)
                  break t
                }
                ;(c = Je), (Je = s), c !== null && Wr(c)
              }
              s = h
            }
            if (((c = !1), s !== 2)) continue
          }
        }
        if (s === 1) {
          $l(t, 0), mn(t, e, 0, !0)
          break
        }
        t: {
          switch (((l = t), s)) {
            case 0:
            case 1:
              throw Error(r(345))
            case 4:
              if ((e & 4194176) === e) {
                mn(l, e, ze, !hn)
                break t
              }
              break
            case 2:
              Je = null
              break
            case 3:
            case 5:
              break
            default:
              throw Error(r(329))
          }
          if (
            ((l.finishedWork = n),
            (l.finishedLanes = e),
            (e & 62914560) === e && ((c = Fr + 300 - Ke()), 10 < c))
          ) {
            if ((mn(l, e, ze, !hn), Hi(l, 0) !== 0)) break t
            l.timeoutHandle = zh(ch.bind(null, l, n, Je, Tu, kr, e, ze, ml, Pl, hn, 2, -0, 0), c)
            break t
          }
          ch(l, n, Je, Tu, kr, e, ze, ml, Pl, hn, 0, -0, 0)
        }
      }
      break
    } while (!0)
    Pe(t)
  }
  function Wr(t) {
    Je === null ? (Je = t) : Je.push.apply(Je, t)
  }
  function ch(t, e, n, l, s, c, h, p, b, O, z, H, C) {
    var x = e.subtreeFlags
    if (
      (x & 8192 || (x & 16785408) === 16785408) &&
      ((oi = { stylesheets: null, count: 0, unsuspend: B0 }), Id(e), (e = G0()), e !== null)
    ) {
      ;(t.cancelPendingCommit = e(vh.bind(null, t, n, l, s, h, p, b, 1, H, C))), mn(t, c, h, !O)
      return
    }
    vh(t, n, l, s, h, p, b, z, H, C)
  }
  function a0(t) {
    for (var e = t; ; ) {
      var n = e.tag
      if (
        (n === 0 || n === 11 || n === 15) &&
        e.flags & 16384 &&
        ((n = e.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var l = 0; l < n.length; l++) {
          var s = n[l],
            c = s.getSnapshot
          s = s.value
          try {
            if (!pe(c(), s)) return !1
          } catch {
            return !1
          }
        }
      if (((n = e.child), e.subtreeFlags & 16384 && n !== null)) (n.return = e), (e = n)
      else {
        if (e === t) break
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0
          e = e.return
        }
        ;(e.sibling.return = e.return), (e = e.sibling)
      }
    }
    return !0
  }
  function mn(t, e, n, l) {
    ;(e &= ~Zr),
      (e &= ~ml),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      l && (t.warmLanes |= e),
      (l = t.expirationTimes)
    for (var s = e; 0 < s; ) {
      var c = 31 - ve(s),
        h = 1 << c
      ;(l[c] = -1), (s &= ~h)
    }
    n !== 0 && Oo(t, n, e)
  }
  function Mu() {
    return (Ut & 6) === 0 ? (ii(0), !1) : !0
  }
  function Ir() {
    if (St !== null) {
      if (xt === 0) var t = St.return
      else (t = St), (sn = fl = null), ir(t), (Bl = null), (Ba = 0), (t = St)
      for (; t !== null; ) uh(t.alternate, t), (t = t.return)
      St = null
    }
  }
  function $l(t, e) {
    ;(t.finishedWork = null), (t.finishedLanes = 0)
    var n = t.timeoutHandle
    n !== -1 && ((t.timeoutHandle = -1), O0(n)),
      (n = t.cancelPendingCommit),
      n !== null && ((t.cancelPendingCommit = null), n()),
      Ir(),
      (wt = t),
      (St = n = jn(t.current, null)),
      (Et = e),
      (xt = 0),
      (be = null),
      (hn = !1),
      (Jl = _a(t, e)),
      (Kr = !1),
      (Pl = ze = Zr = ml = Hn = qt = 0),
      (Je = ni = null),
      (kr = !1),
      (e & 8) !== 0 && (e |= e & 32)
    var l = t.entangledLanes
    if (l !== 0)
      for (t = t.entanglements, l &= e; 0 < l; ) {
        var s = 31 - ve(l),
          c = 1 << s
        ;(e |= t[s]), (l &= ~c)
      }
    return (yn = e), Pi(), n
  }
  function oh(t, e) {
    ;(pt = null),
      (R.H = Fe),
      e === ja
        ? ((e = Rf()), (xt = 3))
        : e === Ef
        ? ((e = Rf()), (xt = 4))
        : (xt =
            e === Od
              ? 8
              : e !== null && typeof e == 'object' && typeof e.then == 'function'
              ? 6
              : 1),
      (be = e),
      St === null && ((qt = 1), vu(t, Re(e, t.current)))
  }
  function fh() {
    var t = R.H
    return (R.H = Fe), t === null ? Fe : t
  }
  function dh() {
    var t = R.A
    return (R.A = n0), t
  }
  function tc() {
    ;(qt = 4),
      hn || ((Et & 4194176) !== Et && De.current !== null) || (Jl = !0),
      ((Hn & 134217727) === 0 && (ml & 134217727) === 0) || wt === null || mn(wt, Et, ze, !1)
  }
  function ec(t, e, n) {
    var l = Ut
    Ut |= 2
    var s = fh(),
      c = dh()
    ;(wt !== t || Et !== e) && ((Tu = null), $l(t, e)), (e = !1)
    var h = qt
    t: do
      try {
        if (xt !== 0 && St !== null) {
          var p = St,
            b = be
          switch (xt) {
            case 8:
              Ir(), (h = 6)
              break t
            case 3:
            case 2:
            case 6:
              De.current === null && (e = !0)
              var O = xt
              if (((xt = 0), (be = null), Wl(t, p, b, O), n && Jl)) {
                h = 0
                break t
              }
              break
            default:
              ;(O = xt), (xt = 0), (be = null), Wl(t, p, b, O)
          }
        }
        i0(), (h = qt)
        break
      } catch (z) {
        oh(t, z)
      }
    while (!0)
    return (
      e && t.shellSuspendCounter++,
      (sn = fl = null),
      (Ut = l),
      (R.H = s),
      (R.A = c),
      St === null && ((wt = null), (Et = 0), Pi()),
      h
    )
  }
  function i0() {
    for (; St !== null; ) hh(St)
  }
  function u0(t, e) {
    var n = Ut
    Ut |= 2
    var l = fh(),
      s = dh()
    wt !== t || Et !== e ? ((Tu = null), (Ou = Ke() + 500), $l(t, e)) : (Jl = _a(t, e))
    t: do
      try {
        if (xt !== 0 && St !== null) {
          e = St
          var c = be
          e: switch (xt) {
            case 1:
              ;(xt = 0), (be = null), Wl(t, e, c, 1)
              break
            case 2:
              if (Of(c)) {
                ;(xt = 0), (be = null), yh(e)
                break
              }
              ;(e = function () {
                xt === 2 && wt === t && (xt = 7), Pe(t)
              }),
                c.then(e, e)
              break t
            case 3:
              xt = 7
              break t
            case 4:
              xt = 5
              break t
            case 7:
              Of(c) ? ((xt = 0), (be = null), yh(e)) : ((xt = 0), (be = null), Wl(t, e, c, 7))
              break
            case 5:
              var h = null
              switch (St.tag) {
                case 26:
                  h = St.memoizedState
                case 5:
                case 27:
                  var p = St
                  if (!h || Vh(h)) {
                    ;(xt = 0), (be = null)
                    var b = p.sibling
                    if (b !== null) St = b
                    else {
                      var O = p.return
                      O !== null ? ((St = O), Au(O)) : (St = null)
                    }
                    break e
                  }
              }
              ;(xt = 0), (be = null), Wl(t, e, c, 5)
              break
            case 6:
              ;(xt = 0), (be = null), Wl(t, e, c, 6)
              break
            case 8:
              Ir(), (qt = 6)
              break t
            default:
              throw Error(r(462))
          }
        }
        s0()
        break
      } catch (z) {
        oh(t, z)
      }
    while (!0)
    return (
      (sn = fl = null),
      (R.H = l),
      (R.A = s),
      (Ut = n),
      St !== null ? 0 : ((wt = null), (Et = 0), Pi(), qt)
    )
  }
  function s0() {
    for (; St !== null && !Sa(); ) hh(St)
  }
  function hh(t) {
    var e = Ld(t.alternate, t, yn)
    ;(t.memoizedProps = t.pendingProps), e === null ? Au(t) : (St = e)
  }
  function yh(t) {
    var e = t,
      n = e.alternate
    switch (e.tag) {
      case 15:
      case 0:
        e = Cd(n, e, e.pendingProps, e.type, void 0, Et)
        break
      case 11:
        e = Cd(n, e, e.pendingProps, e.type.render, e.ref, Et)
        break
      case 5:
        ir(e)
      default:
        uh(n, e), (e = St = lh(e, yn)), (e = Ld(n, e, yn))
    }
    ;(t.memoizedProps = t.pendingProps), e === null ? Au(t) : (St = e)
  }
  function Wl(t, e, n, l) {
    ;(sn = fl = null), ir(e), (Bl = null), (Ba = 0)
    var s = e.return
    try {
      if (Jv(t, s, e, n, Et)) {
        ;(qt = 1), vu(t, Re(n, t.current)), (St = null)
        return
      }
    } catch (c) {
      if (s !== null) throw ((St = s), c)
      ;(qt = 1), vu(t, Re(n, t.current)), (St = null)
      return
    }
    e.flags & 32768
      ? (Ot || l === 1
          ? (t = !0)
          : Jl || (Et & 536870912) !== 0
          ? (t = !1)
          : ((hn = t = !0),
            (l === 2 || l === 3 || l === 6) &&
              ((l = De.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
        mh(e, t))
      : Au(e)
  }
  function Au(t) {
    var e = t
    do {
      if ((e.flags & 32768) !== 0) {
        mh(e, hn)
        return
      }
      t = e.return
      var n = t0(e.alternate, e, yn)
      if (n !== null) {
        St = n
        return
      }
      if (((e = e.sibling), e !== null)) {
        St = e
        return
      }
      St = e = t
    } while (e !== null)
    qt === 0 && (qt = 5)
  }
  function mh(t, e) {
    do {
      var n = e0(t.alternate, t)
      if (n !== null) {
        ;(n.flags &= 32767), (St = n)
        return
      }
      if (
        ((n = t.return),
        n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        St = t
        return
      }
      St = t = n
    } while (t !== null)
    ;(qt = 6), (St = null)
  }
  function vh(t, e, n, l, s, c, h, p, b, O) {
    var z = R.T,
      H = V.p
    try {
      ;(V.p = 2), (R.T = null), r0(t, e, n, l, H, s, c, h, p, b, O)
    } finally {
      ;(R.T = z), (V.p = H)
    }
  }
  function r0(t, e, n, l, s, c, h, p) {
    do Il()
    while (vl !== null)
    if ((Ut & 6) !== 0) throw Error(r(327))
    var b = t.finishedWork
    if (((l = t.finishedLanes), b === null)) return null
    if (((t.finishedWork = null), (t.finishedLanes = 0), b === t.current)) throw Error(r(177))
    ;(t.callbackNode = null), (t.callbackPriority = 0), (t.cancelPendingCommit = null)
    var O = b.lanes | b.childLanes
    if (
      ((O |= Xs),
      Qm(t, l, O, c, h, p),
      t === wt && ((St = wt = null), (Et = 0)),
      ((b.subtreeFlags & 10256) === 0 && (b.flags & 10256) === 0) ||
        Ru ||
        ((Ru = !0),
        (Jr = O),
        (Pr = n),
        d0(Li, function () {
          return Il(), null
        })),
      (n = (b.flags & 15990) !== 0),
      (b.subtreeFlags & 15990) !== 0 || n
        ? ((n = R.T),
          (R.T = null),
          (c = V.p),
          (V.p = 2),
          (h = Ut),
          (Ut |= 4),
          $v(t, b),
          Pd(b, t),
          zv(hc, t.containerInfo),
          (Bu = !!dc),
          (hc = dc = null),
          (t.current = b),
          Zd(t, b.alternate, b),
          wm(),
          (Ut = h),
          (V.p = c),
          (R.T = n))
        : (t.current = b),
      Ru ? ((Ru = !1), (vl = t), (li = l)) : ph(t, O),
      (O = t.pendingLanes),
      O === 0 && (Bn = null),
      Lm(b.stateNode),
      Pe(t),
      e !== null)
    )
      for (s = t.onRecoverableError, b = 0; b < e.length; b++)
        (O = e[b]), s(O.value, { componentStack: O.stack })
    return (
      (li & 3) !== 0 && Il(),
      (O = t.pendingLanes),
      (l & 4194218) !== 0 && (O & 42) !== 0 ? (t === $r ? ai++ : ((ai = 0), ($r = t))) : (ai = 0),
      ii(0),
      null
    )
  }
  function ph(t, e) {
    ;(t.pooledCacheLanes &= e) === 0 &&
      ((e = t.pooledCache), e != null && ((t.pooledCache = null), Ga(e)))
  }
  function Il() {
    if (vl !== null) {
      var t = vl,
        e = Jr
      Jr = 0
      var n = Ro(li),
        l = R.T,
        s = V.p
      try {
        if (((V.p = 32 > n ? 32 : n), (R.T = null), vl === null)) var c = !1
        else {
          ;(n = Pr), (Pr = null)
          var h = vl,
            p = li
          if (((vl = null), (li = 0), (Ut & 6) !== 0)) throw Error(r(331))
          var b = Ut
          if (
            ((Ut |= 4),
            eh(h.current),
            Wd(h, h.current, p, n),
            (Ut = b),
            ii(0, !1),
            me && typeof me.onPostCommitFiberRoot == 'function')
          )
            try {
              me.onPostCommitFiberRoot(ba, h)
            } catch {}
          c = !0
        }
        return c
      } finally {
        ;(V.p = s), (R.T = l), ph(t, e)
      }
    }
    return !1
  }
  function gh(t, e, n) {
    ;(e = Re(n, e)), (e = Sr(t.stateNode, e, 2)), (t = Un(t, e, 2)), t !== null && (Ea(t, 2), Pe(t))
  }
  function Dt(t, e, n) {
    if (t.tag === 3) gh(t, t, n)
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          gh(e, t, n)
          break
        } else if (e.tag === 1) {
          var l = e.stateNode
          if (
            typeof e.type.getDerivedStateFromError == 'function' ||
            (typeof l.componentDidCatch == 'function' && (Bn === null || !Bn.has(l)))
          ) {
            ;(t = Re(n, t)),
              (n = _d(2)),
              (l = Un(e, n, 2)),
              l !== null && (Ed(n, l, e, t), Ea(l, 2), Pe(l))
            break
          }
        }
        e = e.return
      }
  }
  function nc(t, e, n) {
    var l = t.pingCache
    if (l === null) {
      l = t.pingCache = new l0()
      var s = new Set()
      l.set(e, s)
    } else (s = l.get(e)), s === void 0 && ((s = new Set()), l.set(e, s))
    s.has(n) || ((Kr = !0), s.add(n), (t = c0.bind(null, t, e, n)), e.then(t, t))
  }
  function c0(t, e, n) {
    var l = t.pingCache
    l !== null && l.delete(e),
      (t.pingedLanes |= t.suspendedLanes & n),
      (t.warmLanes &= ~n),
      wt === t &&
        (Et & n) === n &&
        (qt === 4 || (qt === 3 && (Et & 62914560) === Et && 300 > Ke() - Fr)
          ? (Ut & 2) === 0 && $l(t, 0)
          : (Zr |= n),
        Pl === Et && (Pl = 0)),
      Pe(t)
  }
  function Sh(t, e) {
    e === 0 && (e = Eo()), (t = Rn(t, e)), t !== null && (Ea(t, e), Pe(t))
  }
  function o0(t) {
    var e = t.memoizedState,
      n = 0
    e !== null && (n = e.retryLane), Sh(t, n)
  }
  function f0(t, e) {
    var n = 0
    switch (t.tag) {
      case 13:
        var l = t.stateNode,
          s = t.memoizedState
        s !== null && (n = s.retryLane)
        break
      case 19:
        l = t.stateNode
        break
      case 22:
        l = t.stateNode._retryCache
        break
      default:
        throw Error(r(314))
    }
    l !== null && l.delete(e), Sh(t, n)
  }
  function d0(t, e) {
    return pa(t, e)
  }
  var Du = null,
    ta = null,
    lc = !1,
    Cu = !1,
    ac = !1,
    pl = 0
  function Pe(t) {
    t !== ta && t.next === null && (ta === null ? (Du = ta = t) : (ta = ta.next = t)),
      (Cu = !0),
      lc || ((lc = !0), y0(h0))
  }
  function ii(t, e) {
    if (!ac && Cu) {
      ac = !0
      do
        for (var n = !1, l = Du; l !== null; ) {
          if (t !== 0) {
            var s = l.pendingLanes
            if (s === 0) var c = 0
            else {
              var h = l.suspendedLanes,
                p = l.pingedLanes
              ;(c = (1 << (31 - ve(42 | t) + 1)) - 1),
                (c &= s & ~(h & ~p)),
                (c = c & 201326677 ? (c & 201326677) | 1 : c ? c | 2 : 0)
            }
            c !== 0 && ((n = !0), Eh(l, c))
          } else
            (c = Et),
              (c = Hi(l, l === wt ? c : 0)),
              (c & 3) === 0 || _a(l, c) || ((n = !0), Eh(l, c))
          l = l.next
        }
      while (n)
      ac = !1
    }
  }
  function h0() {
    Cu = lc = !1
    var t = 0
    pl !== 0 && (E0() && (t = pl), (pl = 0))
    for (var e = Ke(), n = null, l = Du; l !== null; ) {
      var s = l.next,
        c = bh(l, e)
      c === 0
        ? ((l.next = null), n === null ? (Du = s) : (n.next = s), s === null && (ta = n))
        : ((n = l), (t !== 0 || (c & 3) !== 0) && (Cu = !0)),
        (l = s)
    }
    ii(t)
  }
  function bh(t, e) {
    for (
      var n = t.suspendedLanes,
        l = t.pingedLanes,
        s = t.expirationTimes,
        c = t.pendingLanes & -62914561;
      0 < c;

    ) {
      var h = 31 - ve(c),
        p = 1 << h,
        b = s[h]
      b === -1
        ? ((p & n) === 0 || (p & l) !== 0) && (s[h] = Bm(p, e))
        : b <= e && (t.expiredLanes |= p),
        (c &= ~p)
    }
    if (
      ((e = wt),
      (n = Et),
      (n = Hi(t, t === e ? n : 0)),
      (l = t.callbackNode),
      n === 0 || (t === e && xt === 2) || t.cancelPendingCommit !== null)
    )
      return l !== null && l !== null && ga(l), (t.callbackNode = null), (t.callbackPriority = 0)
    if ((n & 3) === 0 || _a(t, n)) {
      if (((e = n & -n), e === t.callbackPriority)) return e
      switch ((l !== null && ga(l), Ro(n))) {
        case 2:
        case 8:
          n = So
          break
        case 32:
          n = Li
          break
        case 268435456:
          n = bo
          break
        default:
          n = Li
      }
      return (
        (l = _h.bind(null, t)), (n = pa(n, l)), (t.callbackPriority = e), (t.callbackNode = n), e
      )
    }
    return l !== null && l !== null && ga(l), (t.callbackPriority = 2), (t.callbackNode = null), 2
  }
  function _h(t, e) {
    var n = t.callbackNode
    if (Il() && t.callbackNode !== n) return null
    var l = Et
    return (
      (l = Hi(t, t === wt ? l : 0)),
      l === 0
        ? null
        : (rh(t, l, e),
          bh(t, Ke()),
          t.callbackNode != null && t.callbackNode === n ? _h.bind(null, t) : null)
    )
  }
  function Eh(t, e) {
    if (Il()) return null
    rh(t, e, !0)
  }
  function y0(t) {
    T0(function () {
      ;(Ut & 6) !== 0 ? pa(go, t) : t()
    })
  }
  function ic() {
    return pl === 0 && (pl = _o()), pl
  }
  function Oh(t) {
    return t == null || typeof t == 'symbol' || typeof t == 'boolean'
      ? null
      : typeof t == 'function'
      ? t
      : Vi('' + t)
  }
  function Th(t, e) {
    var n = e.ownerDocument.createElement('input')
    return (
      (n.name = e.name),
      (n.value = e.value),
      t.id && n.setAttribute('form', t.id),
      e.parentNode.insertBefore(n, e),
      (t = new FormData(t)),
      n.parentNode.removeChild(n),
      t
    )
  }
  function m0(t, e, n, l, s) {
    if (e === 'submit' && n && n.stateNode === s) {
      var c = Oh((s[oe] || null).action),
        h = l.submitter
      h &&
        ((e = (e = h[oe] || null) ? Oh(e.formAction) : h.getAttribute('formAction')),
        e !== null && ((c = e), (h = null)))
      var p = new ki('action', 'action', null, l, s)
      t.push({
        event: p,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (l.defaultPrevented) {
                if (pl !== 0) {
                  var b = h ? Th(s, h) : new FormData(s)
                  yr(n, { pending: !0, data: b, method: s.method, action: c }, null, b)
                }
              } else
                typeof c == 'function' &&
                  (p.preventDefault(),
                  (b = h ? Th(s, h) : new FormData(s)),
                  yr(n, { pending: !0, data: b, method: s.method, action: c }, c, b))
            },
            currentTarget: s,
          },
        ],
      })
    }
  }
  for (var uc = 0; uc < vf.length; uc++) {
    var sc = vf[uc],
      v0 = sc.toLowerCase(),
      p0 = sc[0].toUpperCase() + sc.slice(1)
    He(v0, 'on' + p0)
  }
  He(ff, 'onAnimationEnd'),
    He(df, 'onAnimationIteration'),
    He(hf, 'onAnimationStart'),
    He('dblclick', 'onDoubleClick'),
    He('focusin', 'onFocus'),
    He('focusout', 'onBlur'),
    He(Nv, 'onTransitionRun'),
    He(Lv, 'onTransitionStart'),
    He(qv, 'onTransitionCancel'),
    He(yf, 'onTransitionEnd'),
    Al('onMouseEnter', ['mouseout', 'mouseover']),
    Al('onMouseLeave', ['mouseout', 'mouseover']),
    Al('onPointerEnter', ['pointerout', 'pointerover']),
    Al('onPointerLeave', ['pointerout', 'pointerover']),
    Wn('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Wn(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    Wn('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Wn('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Wn(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    Wn(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    )
  var ui =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    g0 = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(ui),
    )
  function Rh(t, e) {
    e = (e & 4) !== 0
    for (var n = 0; n < t.length; n++) {
      var l = t[n],
        s = l.event
      l = l.listeners
      t: {
        var c = void 0
        if (e)
          for (var h = l.length - 1; 0 <= h; h--) {
            var p = l[h],
              b = p.instance,
              O = p.currentTarget
            if (((p = p.listener), b !== c && s.isPropagationStopped())) break t
            ;(c = p), (s.currentTarget = O)
            try {
              c(s)
            } catch (z) {
              mu(z)
            }
            ;(s.currentTarget = null), (c = b)
          }
        else
          for (h = 0; h < l.length; h++) {
            if (
              ((p = l[h]),
              (b = p.instance),
              (O = p.currentTarget),
              (p = p.listener),
              b !== c && s.isPropagationStopped())
            )
              break t
            ;(c = p), (s.currentTarget = O)
            try {
              c(s)
            } catch (z) {
              mu(z)
            }
            ;(s.currentTarget = null), (c = b)
          }
      }
    }
  }
  function bt(t, e) {
    var n = e[Os]
    n === void 0 && (n = e[Os] = new Set())
    var l = t + '__bubble'
    n.has(l) || (Mh(e, t, 2, !1), n.add(l))
  }
  function rc(t, e, n) {
    var l = 0
    e && (l |= 4), Mh(n, t, l, e)
  }
  var wu = '_reactListening' + Math.random().toString(36).slice(2)
  function cc(t) {
    if (!t[wu]) {
      ;(t[wu] = !0),
        Do.forEach(function (n) {
          n !== 'selectionchange' && (g0.has(n) || rc(n, !1, t), rc(n, !0, t))
        })
      var e = t.nodeType === 9 ? t : t.ownerDocument
      e === null || e[wu] || ((e[wu] = !0), rc('selectionchange', !1, e))
    }
  }
  function Mh(t, e, n, l) {
    switch (Jh(e)) {
      case 2:
        var s = X0
        break
      case 8:
        s = K0
        break
      default:
        s = Ec
    }
    ;(n = s.bind(null, e, n, t)),
      (s = void 0),
      !xs || (e !== 'touchstart' && e !== 'touchmove' && e !== 'wheel') || (s = !0),
      l
        ? s !== void 0
          ? t.addEventListener(e, n, { capture: !0, passive: s })
          : t.addEventListener(e, n, !0)
        : s !== void 0
        ? t.addEventListener(e, n, { passive: s })
        : t.addEventListener(e, n, !1)
  }
  function oc(t, e, n, l, s) {
    var c = l
    if ((e & 1) === 0 && (e & 2) === 0 && l !== null)
      t: for (;;) {
        if (l === null) return
        var h = l.tag
        if (h === 3 || h === 4) {
          var p = l.stateNode.containerInfo
          if (p === s || (p.nodeType === 8 && p.parentNode === s)) break
          if (h === 4)
            for (h = l.return; h !== null; ) {
              var b = h.tag
              if (
                (b === 3 || b === 4) &&
                ((b = h.stateNode.containerInfo),
                b === s || (b.nodeType === 8 && b.parentNode === s))
              )
                return
              h = h.return
            }
          for (; p !== null; ) {
            if (((h = $n(p)), h === null)) return
            if (((b = h.tag), b === 5 || b === 6 || b === 26 || b === 27)) {
              l = c = h
              continue t
            }
            p = p.parentNode
          }
        }
        l = l.return
      }
    Qo(function () {
      var O = c,
        z = Cs(n),
        H = []
      t: {
        var C = mf.get(t)
        if (C !== void 0) {
          var x = ki,
            et = t
          switch (t) {
            case 'keypress':
              if (Ki(n) === 0) break t
            case 'keydown':
            case 'keyup':
              x = fv
              break
            case 'focusin':
              ;(et = 'focus'), (x = Ls)
              break
            case 'focusout':
              ;(et = 'blur'), (x = Ls)
              break
            case 'beforeblur':
            case 'afterblur':
              x = Ls
              break
            case 'click':
              if (n.button === 2) break t
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              x = Vo
              break
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              x = Im
              break
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              x = yv
              break
            case ff:
            case df:
            case hf:
              x = nv
              break
            case yf:
              x = vv
              break
            case 'scroll':
            case 'scrollend':
              x = $m
              break
            case 'wheel':
              x = gv
              break
            case 'copy':
            case 'cut':
            case 'paste':
              x = av
              break
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              x = Ko
              break
            case 'toggle':
            case 'beforetoggle':
              x = bv
          }
          var ot = (e & 4) !== 0,
            jt = !ot && (t === 'scroll' || t === 'scrollend'),
            M = ot ? (C !== null ? C + 'Capture' : null) : C
          ot = []
          for (var E = O, A; E !== null; ) {
            var q = E
            if (
              ((A = q.stateNode),
              (q = q.tag),
              (q !== 5 && q !== 26 && q !== 27) ||
                A === null ||
                M === null ||
                ((q = Ra(E, M)), q != null && ot.push(si(E, q, A))),
              jt)
            )
              break
            E = E.return
          }
          0 < ot.length && ((C = new x(C, et, null, n, z)), H.push({ event: C, listeners: ot }))
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((C = t === 'mouseover' || t === 'pointerover'),
            (x = t === 'mouseout' || t === 'pointerout'),
            C && n !== Ds && (et = n.relatedTarget || n.fromElement) && ($n(et) || et[Tl]))
          )
            break t
          if (
            (x || C) &&
            ((C =
              z.window === z
                ? z
                : (C = z.ownerDocument)
                ? C.defaultView || C.parentWindow
                : window),
            x
              ? ((et = n.relatedTarget || n.toElement),
                (x = O),
                (et = et ? $n(et) : null),
                et !== null &&
                  ((jt = tt(et)),
                  (ot = et.tag),
                  et !== jt || (ot !== 5 && ot !== 27 && ot !== 6)) &&
                  (et = null))
              : ((x = null), (et = O)),
            x !== et)
          ) {
            if (
              ((ot = Vo),
              (q = 'onMouseLeave'),
              (M = 'onMouseEnter'),
              (E = 'mouse'),
              (t === 'pointerout' || t === 'pointerover') &&
                ((ot = Ko), (q = 'onPointerLeave'), (M = 'onPointerEnter'), (E = 'pointer')),
              (jt = x == null ? C : Ta(x)),
              (A = et == null ? C : Ta(et)),
              (C = new ot(q, E + 'leave', x, n, z)),
              (C.target = jt),
              (C.relatedTarget = A),
              (q = null),
              $n(z) === O &&
                ((ot = new ot(M, E + 'enter', et, n, z)),
                (ot.target = A),
                (ot.relatedTarget = jt),
                (q = ot)),
              (jt = q),
              x && et)
            )
              e: {
                for (ot = x, M = et, E = 0, A = ot; A; A = ea(A)) E++
                for (A = 0, q = M; q; q = ea(q)) A++
                for (; 0 < E - A; ) (ot = ea(ot)), E--
                for (; 0 < A - E; ) (M = ea(M)), A--
                for (; E--; ) {
                  if (ot === M || (M !== null && ot === M.alternate)) break e
                  ;(ot = ea(ot)), (M = ea(M))
                }
                ot = null
              }
            else ot = null
            x !== null && Ah(H, C, x, ot, !1), et !== null && jt !== null && Ah(H, jt, et, ot, !0)
          }
        }
        t: {
          if (
            ((C = O ? Ta(O) : window),
            (x = C.nodeName && C.nodeName.toLowerCase()),
            x === 'select' || (x === 'input' && C.type === 'file'))
          )
            var W = Io
          else if ($o(C))
            if (tf) W = wv
            else {
              W = Dv
              var gt = Av
            }
          else
            (x = C.nodeName),
              !x || x.toLowerCase() !== 'input' || (C.type !== 'checkbox' && C.type !== 'radio')
                ? O && As(O.elementType) && (W = Io)
                : (W = Cv)
          if (W && (W = W(t, O))) {
            Wo(H, W, n, z)
            break t
          }
          gt && gt(t, C, O),
            t === 'focusout' &&
              O &&
              C.type === 'number' &&
              O.memoizedProps.value != null &&
              Ms(C, 'number', C.value)
        }
        switch (((gt = O ? Ta(O) : window), t)) {
          case 'focusin':
            ;($o(gt) || gt.contentEditable === 'true') && ((Ul = gt), (Gs = O), (Ua = null))
            break
          case 'focusout':
            Ua = Gs = Ul = null
            break
          case 'mousedown':
            Ys = !0
            break
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ;(Ys = !1), cf(H, n, z)
            break
          case 'selectionchange':
            if (Uv) break
          case 'keydown':
          case 'keyup':
            cf(H, n, z)
        }
        var at
        if (js)
          t: {
            switch (t) {
              case 'compositionstart':
                var st = 'onCompositionStart'
                break t
              case 'compositionend':
                st = 'onCompositionEnd'
                break t
              case 'compositionupdate':
                st = 'onCompositionUpdate'
                break t
            }
            st = void 0
          }
        else
          zl
            ? Jo(t, n) && (st = 'onCompositionEnd')
            : t === 'keydown' && n.keyCode === 229 && (st = 'onCompositionStart')
        st &&
          (Zo &&
            n.locale !== 'ko' &&
            (zl || st !== 'onCompositionStart'
              ? st === 'onCompositionEnd' && zl && (at = Go())
              : ((Tn = z), (zs = 'value' in Tn ? Tn.value : Tn.textContent), (zl = !0))),
          (gt = xu(O, st)),
          0 < gt.length &&
            ((st = new Xo(st, t, null, n, z)),
            H.push({ event: st, listeners: gt }),
            at ? (st.data = at) : ((at = Po(n)), at !== null && (st.data = at)))),
          (at = Ev ? Ov(t, n) : Tv(t, n)) &&
            ((st = xu(O, 'onBeforeInput')),
            0 < st.length &&
              ((gt = new Xo('onBeforeInput', 'beforeinput', null, n, z)),
              H.push({ event: gt, listeners: st }),
              (gt.data = at))),
          m0(H, t, O, n, z)
      }
      Rh(H, e)
    })
  }
  function si(t, e, n) {
    return { instance: t, listener: e, currentTarget: n }
  }
  function xu(t, e) {
    for (var n = e + 'Capture', l = []; t !== null; ) {
      var s = t,
        c = s.stateNode
      ;(s = s.tag),
        (s !== 5 && s !== 26 && s !== 27) ||
          c === null ||
          ((s = Ra(t, n)),
          s != null && l.unshift(si(t, s, c)),
          (s = Ra(t, e)),
          s != null && l.push(si(t, s, c))),
        (t = t.return)
    }
    return l
  }
  function ea(t) {
    if (t === null) return null
    do t = t.return
    while (t && t.tag !== 5 && t.tag !== 27)
    return t || null
  }
  function Ah(t, e, n, l, s) {
    for (var c = e._reactName, h = []; n !== null && n !== l; ) {
      var p = n,
        b = p.alternate,
        O = p.stateNode
      if (((p = p.tag), b !== null && b === l)) break
      ;(p !== 5 && p !== 26 && p !== 27) ||
        O === null ||
        ((b = O),
        s
          ? ((O = Ra(n, c)), O != null && h.unshift(si(n, O, b)))
          : s || ((O = Ra(n, c)), O != null && h.push(si(n, O, b)))),
        (n = n.return)
    }
    h.length !== 0 && t.push({ event: e, listeners: h })
  }
  var S0 = /\r\n?/g,
    b0 = /\u0000|\uFFFD/g
  function Dh(t) {
    return (typeof t == 'string' ? t : '' + t)
      .replace(
        S0,
        `
`,
      )
      .replace(b0, '')
  }
  function Ch(t, e) {
    return (e = Dh(e)), Dh(t) === e
  }
  function zu() {}
  function At(t, e, n, l, s, c) {
    switch (n) {
      case 'children':
        typeof l == 'string'
          ? e === 'body' || (e === 'textarea' && l === '') || Cl(t, l)
          : (typeof l == 'number' || typeof l == 'bigint') && e !== 'body' && Cl(t, '' + l)
        break
      case 'className':
        Qi(t, 'class', l)
        break
      case 'tabIndex':
        Qi(t, 'tabindex', l)
        break
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Qi(t, n, l)
        break
      case 'style':
        Ho(t, l, c)
        break
      case 'data':
        if (e !== 'object') {
          Qi(t, 'data', l)
          break
        }
      case 'src':
      case 'href':
        if (l === '' && (e !== 'a' || n !== 'href')) {
          t.removeAttribute(n)
          break
        }
        if (l == null || typeof l == 'function' || typeof l == 'symbol' || typeof l == 'boolean') {
          t.removeAttribute(n)
          break
        }
        ;(l = Vi('' + l)), t.setAttribute(n, l)
        break
      case 'action':
      case 'formAction':
        if (typeof l == 'function') {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          )
          break
        } else
          typeof c == 'function' &&
            (n === 'formAction'
              ? (e !== 'input' && At(t, e, 'name', s.name, s, null),
                At(t, e, 'formEncType', s.formEncType, s, null),
                At(t, e, 'formMethod', s.formMethod, s, null),
                At(t, e, 'formTarget', s.formTarget, s, null))
              : (At(t, e, 'encType', s.encType, s, null),
                At(t, e, 'method', s.method, s, null),
                At(t, e, 'target', s.target, s, null)))
        if (l == null || typeof l == 'symbol' || typeof l == 'boolean') {
          t.removeAttribute(n)
          break
        }
        ;(l = Vi('' + l)), t.setAttribute(n, l)
        break
      case 'onClick':
        l != null && (t.onclick = zu)
        break
      case 'onScroll':
        l != null && bt('scroll', t)
        break
      case 'onScrollEnd':
        l != null && bt('scrollend', t)
        break
      case 'dangerouslySetInnerHTML':
        if (l != null) {
          if (typeof l != 'object' || !('__html' in l)) throw Error(r(61))
          if (((n = l.__html), n != null)) {
            if (s.children != null) throw Error(r(60))
            t.innerHTML = n
          }
        }
        break
      case 'multiple':
        t.multiple = l && typeof l != 'function' && typeof l != 'symbol'
        break
      case 'muted':
        t.muted = l && typeof l != 'function' && typeof l != 'symbol'
        break
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break
      case 'autoFocus':
        break
      case 'xlinkHref':
        if (l == null || typeof l == 'function' || typeof l == 'boolean' || typeof l == 'symbol') {
          t.removeAttribute('xlink:href')
          break
        }
        ;(n = Vi('' + l)), t.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', n)
        break
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        l != null && typeof l != 'function' && typeof l != 'symbol'
          ? t.setAttribute(n, '' + l)
          : t.removeAttribute(n)
        break
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        l && typeof l != 'function' && typeof l != 'symbol'
          ? t.setAttribute(n, '')
          : t.removeAttribute(n)
        break
      case 'capture':
      case 'download':
        l === !0
          ? t.setAttribute(n, '')
          : l !== !1 && l != null && typeof l != 'function' && typeof l != 'symbol'
          ? t.setAttribute(n, l)
          : t.removeAttribute(n)
        break
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        l != null && typeof l != 'function' && typeof l != 'symbol' && !isNaN(l) && 1 <= l
          ? t.setAttribute(n, l)
          : t.removeAttribute(n)
        break
      case 'rowSpan':
      case 'start':
        l == null || typeof l == 'function' || typeof l == 'symbol' || isNaN(l)
          ? t.removeAttribute(n)
          : t.setAttribute(n, l)
        break
      case 'popover':
        bt('beforetoggle', t), bt('toggle', t), Bi(t, 'popover', l)
        break
      case 'xlinkActuate':
        tn(t, 'http://www.w3.org/1999/xlink', 'xlink:actuate', l)
        break
      case 'xlinkArcrole':
        tn(t, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', l)
        break
      case 'xlinkRole':
        tn(t, 'http://www.w3.org/1999/xlink', 'xlink:role', l)
        break
      case 'xlinkShow':
        tn(t, 'http://www.w3.org/1999/xlink', 'xlink:show', l)
        break
      case 'xlinkTitle':
        tn(t, 'http://www.w3.org/1999/xlink', 'xlink:title', l)
        break
      case 'xlinkType':
        tn(t, 'http://www.w3.org/1999/xlink', 'xlink:type', l)
        break
      case 'xmlBase':
        tn(t, 'http://www.w3.org/XML/1998/namespace', 'xml:base', l)
        break
      case 'xmlLang':
        tn(t, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', l)
        break
      case 'xmlSpace':
        tn(t, 'http://www.w3.org/XML/1998/namespace', 'xml:space', l)
        break
      case 'is':
        Bi(t, 'is', l)
        break
      case 'innerText':
      case 'textContent':
        break
      default:
        ;(!(2 < n.length) || (n[0] !== 'o' && n[0] !== 'O') || (n[1] !== 'n' && n[1] !== 'N')) &&
          ((n = Jm.get(n) || n), Bi(t, n, l))
    }
  }
  function fc(t, e, n, l, s, c) {
    switch (n) {
      case 'style':
        Ho(t, l, c)
        break
      case 'dangerouslySetInnerHTML':
        if (l != null) {
          if (typeof l != 'object' || !('__html' in l)) throw Error(r(61))
          if (((n = l.__html), n != null)) {
            if (s.children != null) throw Error(r(60))
            t.innerHTML = n
          }
        }
        break
      case 'children':
        typeof l == 'string'
          ? Cl(t, l)
          : (typeof l == 'number' || typeof l == 'bigint') && Cl(t, '' + l)
        break
      case 'onScroll':
        l != null && bt('scroll', t)
        break
      case 'onScrollEnd':
        l != null && bt('scrollend', t)
        break
      case 'onClick':
        l != null && (t.onclick = zu)
        break
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        break
      case 'innerText':
      case 'textContent':
        break
      default:
        if (!Co.hasOwnProperty(n))
          t: {
            if (
              n[0] === 'o' &&
              n[1] === 'n' &&
              ((s = n.endsWith('Capture')),
              (e = n.slice(2, s ? n.length - 7 : void 0)),
              (c = t[oe] || null),
              (c = c != null ? c[n] : null),
              typeof c == 'function' && t.removeEventListener(e, c, s),
              typeof l == 'function')
            ) {
              typeof c != 'function' &&
                c !== null &&
                (n in t ? (t[n] = null) : t.hasAttribute(n) && t.removeAttribute(n)),
                t.addEventListener(e, l, s)
              break t
            }
            n in t ? (t[n] = l) : l === !0 ? t.setAttribute(n, '') : Bi(t, n, l)
          }
    }
  }
  function te(t, e, n) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break
      case 'img':
        bt('error', t), bt('load', t)
        var l = !1,
          s = !1,
          c
        for (c in n)
          if (n.hasOwnProperty(c)) {
            var h = n[c]
            if (h != null)
              switch (c) {
                case 'src':
                  l = !0
                  break
                case 'srcSet':
                  s = !0
                  break
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(r(137, e))
                default:
                  At(t, e, c, h, n, null)
              }
          }
        s && At(t, e, 'srcSet', n.srcSet, n, null), l && At(t, e, 'src', n.src, n, null)
        return
      case 'input':
        bt('invalid', t)
        var p = (c = h = s = null),
          b = null,
          O = null
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var z = n[l]
            if (z != null)
              switch (l) {
                case 'name':
                  s = z
                  break
                case 'type':
                  h = z
                  break
                case 'checked':
                  b = z
                  break
                case 'defaultChecked':
                  O = z
                  break
                case 'value':
                  c = z
                  break
                case 'defaultValue':
                  p = z
                  break
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (z != null) throw Error(r(137, e))
                  break
                default:
                  At(t, e, l, z, n, null)
              }
          }
        No(t, c, p, b, O, h, s, !1), Gi(t)
        return
      case 'select':
        bt('invalid', t), (l = h = c = null)
        for (s in n)
          if (n.hasOwnProperty(s) && ((p = n[s]), p != null))
            switch (s) {
              case 'value':
                c = p
                break
              case 'defaultValue':
                h = p
                break
              case 'multiple':
                l = p
              default:
                At(t, e, s, p, n, null)
            }
        ;(e = c),
          (n = h),
          (t.multiple = !!l),
          e != null ? Dl(t, !!l, e, !1) : n != null && Dl(t, !!l, n, !0)
        return
      case 'textarea':
        bt('invalid', t), (c = s = l = null)
        for (h in n)
          if (n.hasOwnProperty(h) && ((p = n[h]), p != null))
            switch (h) {
              case 'value':
                l = p
                break
              case 'defaultValue':
                s = p
                break
              case 'children':
                c = p
                break
              case 'dangerouslySetInnerHTML':
                if (p != null) throw Error(r(91))
                break
              default:
                At(t, e, h, p, n, null)
            }
        qo(t, l, s, c), Gi(t)
        return
      case 'option':
        for (b in n)
          if (n.hasOwnProperty(b) && ((l = n[b]), l != null))
            switch (b) {
              case 'selected':
                t.selected = l && typeof l != 'function' && typeof l != 'symbol'
                break
              default:
                At(t, e, b, l, n, null)
            }
        return
      case 'dialog':
        bt('cancel', t), bt('close', t)
        break
      case 'iframe':
      case 'object':
        bt('load', t)
        break
      case 'video':
      case 'audio':
        for (l = 0; l < ui.length; l++) bt(ui[l], t)
        break
      case 'image':
        bt('error', t), bt('load', t)
        break
      case 'details':
        bt('toggle', t)
        break
      case 'embed':
      case 'source':
      case 'link':
        bt('error', t), bt('load', t)
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (O in n)
          if (n.hasOwnProperty(O) && ((l = n[O]), l != null))
            switch (O) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(r(137, e))
              default:
                At(t, e, O, l, n, null)
            }
        return
      default:
        if (As(e)) {
          for (z in n)
            n.hasOwnProperty(z) && ((l = n[z]), l !== void 0 && fc(t, e, z, l, n, void 0))
          return
        }
    }
    for (p in n) n.hasOwnProperty(p) && ((l = n[p]), l != null && At(t, e, p, l, n, null))
  }
  function _0(t, e, n, l) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break
      case 'input':
        var s = null,
          c = null,
          h = null,
          p = null,
          b = null,
          O = null,
          z = null
        for (x in n) {
          var H = n[x]
          if (n.hasOwnProperty(x) && H != null)
            switch (x) {
              case 'checked':
                break
              case 'value':
                break
              case 'defaultValue':
                b = H
              default:
                l.hasOwnProperty(x) || At(t, e, x, null, l, H)
            }
        }
        for (var C in l) {
          var x = l[C]
          if (((H = n[C]), l.hasOwnProperty(C) && (x != null || H != null)))
            switch (C) {
              case 'type':
                c = x
                break
              case 'name':
                s = x
                break
              case 'checked':
                O = x
                break
              case 'defaultChecked':
                z = x
                break
              case 'value':
                h = x
                break
              case 'defaultValue':
                p = x
                break
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (x != null) throw Error(r(137, e))
                break
              default:
                x !== H && At(t, e, C, x, l, H)
            }
        }
        Rs(t, h, p, b, O, z, c, s)
        return
      case 'select':
        x = h = p = C = null
        for (c in n)
          if (((b = n[c]), n.hasOwnProperty(c) && b != null))
            switch (c) {
              case 'value':
                break
              case 'multiple':
                x = b
              default:
                l.hasOwnProperty(c) || At(t, e, c, null, l, b)
            }
        for (s in l)
          if (((c = l[s]), (b = n[s]), l.hasOwnProperty(s) && (c != null || b != null)))
            switch (s) {
              case 'value':
                C = c
                break
              case 'defaultValue':
                p = c
                break
              case 'multiple':
                h = c
              default:
                c !== b && At(t, e, s, c, l, b)
            }
        ;(e = p),
          (n = h),
          (l = x),
          C != null
            ? Dl(t, !!n, C, !1)
            : !!l != !!n && (e != null ? Dl(t, !!n, e, !0) : Dl(t, !!n, n ? [] : '', !1))
        return
      case 'textarea':
        x = C = null
        for (p in n)
          if (((s = n[p]), n.hasOwnProperty(p) && s != null && !l.hasOwnProperty(p)))
            switch (p) {
              case 'value':
                break
              case 'children':
                break
              default:
                At(t, e, p, null, l, s)
            }
        for (h in l)
          if (((s = l[h]), (c = n[h]), l.hasOwnProperty(h) && (s != null || c != null)))
            switch (h) {
              case 'value':
                C = s
                break
              case 'defaultValue':
                x = s
                break
              case 'children':
                break
              case 'dangerouslySetInnerHTML':
                if (s != null) throw Error(r(91))
                break
              default:
                s !== c && At(t, e, h, s, l, c)
            }
        Lo(t, C, x)
        return
      case 'option':
        for (var et in n)
          if (((C = n[et]), n.hasOwnProperty(et) && C != null && !l.hasOwnProperty(et)))
            switch (et) {
              case 'selected':
                t.selected = !1
                break
              default:
                At(t, e, et, null, l, C)
            }
        for (b in l)
          if (((C = l[b]), (x = n[b]), l.hasOwnProperty(b) && C !== x && (C != null || x != null)))
            switch (b) {
              case 'selected':
                t.selected = C && typeof C != 'function' && typeof C != 'symbol'
                break
              default:
                At(t, e, b, C, l, x)
            }
        return
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var ot in n)
          (C = n[ot]),
            n.hasOwnProperty(ot) && C != null && !l.hasOwnProperty(ot) && At(t, e, ot, null, l, C)
        for (O in l)
          if (((C = l[O]), (x = n[O]), l.hasOwnProperty(O) && C !== x && (C != null || x != null)))
            switch (O) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (C != null) throw Error(r(137, e))
                break
              default:
                At(t, e, O, C, l, x)
            }
        return
      default:
        if (As(e)) {
          for (var jt in n)
            (C = n[jt]),
              n.hasOwnProperty(jt) &&
                C !== void 0 &&
                !l.hasOwnProperty(jt) &&
                fc(t, e, jt, void 0, l, C)
          for (z in l)
            (C = l[z]),
              (x = n[z]),
              !l.hasOwnProperty(z) ||
                C === x ||
                (C === void 0 && x === void 0) ||
                fc(t, e, z, C, l, x)
          return
        }
    }
    for (var M in n)
      (C = n[M]),
        n.hasOwnProperty(M) && C != null && !l.hasOwnProperty(M) && At(t, e, M, null, l, C)
    for (H in l)
      (C = l[H]),
        (x = n[H]),
        !l.hasOwnProperty(H) || C === x || (C == null && x == null) || At(t, e, H, C, l, x)
  }
  var dc = null,
    hc = null
  function Uu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument
  }
  function wh(t) {
    switch (t) {
      case 'http://www.w3.org/2000/svg':
        return 1
      case 'http://www.w3.org/1998/Math/MathML':
        return 2
      default:
        return 0
    }
  }
  function xh(t, e) {
    if (t === 0)
      switch (e) {
        case 'svg':
          return 1
        case 'math':
          return 2
        default:
          return 0
      }
    return t === 1 && e === 'foreignObject' ? 0 : t
  }
  function yc(t, e) {
    return (
      t === 'textarea' ||
      t === 'noscript' ||
      typeof e.children == 'string' ||
      typeof e.children == 'number' ||
      typeof e.children == 'bigint' ||
      (typeof e.dangerouslySetInnerHTML == 'object' &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    )
  }
  var mc = null
  function E0() {
    var t = window.event
    return t && t.type === 'popstate' ? (t === mc ? !1 : ((mc = t), !0)) : ((mc = null), !1)
  }
  var zh = typeof setTimeout == 'function' ? setTimeout : void 0,
    O0 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    Uh = typeof Promise == 'function' ? Promise : void 0,
    T0 =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof Uh < 'u'
        ? function (t) {
            return Uh.resolve(null).then(t).catch(R0)
          }
        : zh
  function R0(t) {
    setTimeout(function () {
      throw t
    })
  }
  function vc(t, e) {
    var n = e,
      l = 0
    do {
      var s = n.nextSibling
      if ((t.removeChild(n), s && s.nodeType === 8))
        if (((n = s.data), n === '/$')) {
          if (l === 0) {
            t.removeChild(s), mi(e)
            return
          }
          l--
        } else (n !== '$' && n !== '$?' && n !== '$!') || l++
      n = s
    } while (n)
    mi(e)
  }
  function pc(t) {
    var e = t.firstChild
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e
      switch (((e = e.nextSibling), n.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          pc(n), Ts(n)
          continue
        case 'SCRIPT':
        case 'STYLE':
          continue
        case 'LINK':
          if (n.rel.toLowerCase() === 'stylesheet') continue
      }
      t.removeChild(n)
    }
  }
  function M0(t, e, n, l) {
    for (; t.nodeType === 1; ) {
      var s = n
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!l && (t.nodeName !== 'INPUT' || t.type !== 'hidden')) break
      } else if (l) {
        if (!t[Oa])
          switch (e) {
            case 'meta':
              if (!t.hasAttribute('itemprop')) break
              return t
            case 'link':
              if (
                ((c = t.getAttribute('rel')),
                c === 'stylesheet' && t.hasAttribute('data-precedence'))
              )
                break
              if (
                c !== s.rel ||
                t.getAttribute('href') !== (s.href == null ? null : s.href) ||
                t.getAttribute('crossorigin') !== (s.crossOrigin == null ? null : s.crossOrigin) ||
                t.getAttribute('title') !== (s.title == null ? null : s.title)
              )
                break
              return t
            case 'style':
              if (t.hasAttribute('data-precedence')) break
              return t
            case 'script':
              if (
                ((c = t.getAttribute('src')),
                (c !== (s.src == null ? null : s.src) ||
                  t.getAttribute('type') !== (s.type == null ? null : s.type) ||
                  t.getAttribute('crossorigin') !==
                    (s.crossOrigin == null ? null : s.crossOrigin)) &&
                  c &&
                  t.hasAttribute('async') &&
                  !t.hasAttribute('itemprop'))
              )
                break
              return t
            default:
              return t
          }
      } else if (e === 'input' && t.type === 'hidden') {
        var c = s.name == null ? null : '' + s.name
        if (s.type === 'hidden' && t.getAttribute('name') === c) return t
      } else return t
      if (((t = Ge(t.nextSibling)), t === null)) break
    }
    return null
  }
  function A0(t, e, n) {
    if (e === '') return null
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !n) ||
        ((t = Ge(t.nextSibling)), t === null)
      )
        return null
    return t
  }
  function Ge(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType
      if (e === 1 || e === 3) break
      if (e === 8) {
        if (((e = t.data), e === '$' || e === '$!' || e === '$?' || e === 'F!' || e === 'F')) break
        if (e === '/$') return null
      }
    }
    return t
  }
  function Nh(t) {
    t = t.previousSibling
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data
        if (n === '$' || n === '$!' || n === '$?') {
          if (e === 0) return t
          e--
        } else n === '/$' && e++
      }
      t = t.previousSibling
    }
    return null
  }
  function Lh(t, e, n) {
    switch (((e = Uu(n)), t)) {
      case 'html':
        if (((t = e.documentElement), !t)) throw Error(r(452))
        return t
      case 'head':
        if (((t = e.head), !t)) throw Error(r(453))
        return t
      case 'body':
        if (((t = e.body), !t)) throw Error(r(454))
        return t
      default:
        throw Error(r(451))
    }
  }
  var Ue = new Map(),
    qh = new Set()
  function Nu(t) {
    return typeof t.getRootNode == 'function' ? t.getRootNode() : t.ownerDocument
  }
  var vn = V.d
  V.d = { f: D0, r: C0, D: w0, C: x0, L: z0, m: U0, X: L0, S: N0, M: q0 }
  function D0() {
    var t = vn.f(),
      e = Mu()
    return t || e
  }
  function C0(t) {
    var e = Rl(t)
    e !== null && e.tag === 5 && e.type === 'form' ? cd(e) : vn.r(t)
  }
  var na = typeof document > 'u' ? null : document
  function jh(t, e, n) {
    var l = na
    if (l && typeof e == 'string' && e) {
      var s = Oe(e)
      ;(s = 'link[rel="' + t + '"][href="' + s + '"]'),
        typeof n == 'string' && (s += '[crossorigin="' + n + '"]'),
        qh.has(s) ||
          (qh.add(s),
          (t = { rel: t, crossOrigin: n, href: e }),
          l.querySelector(s) === null &&
            ((e = l.createElement('link')), te(e, 'link', t), Ft(e), l.head.appendChild(e)))
    }
  }
  function w0(t) {
    vn.D(t), jh('dns-prefetch', t, null)
  }
  function x0(t, e) {
    vn.C(t, e), jh('preconnect', t, e)
  }
  function z0(t, e, n) {
    vn.L(t, e, n)
    var l = na
    if (l && t && e) {
      var s = 'link[rel="preload"][as="' + Oe(e) + '"]'
      e === 'image' && n && n.imageSrcSet
        ? ((s += '[imagesrcset="' + Oe(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == 'string' && (s += '[imagesizes="' + Oe(n.imageSizes) + '"]'))
        : (s += '[href="' + Oe(t) + '"]')
      var c = s
      switch (e) {
        case 'style':
          c = la(t)
          break
        case 'script':
          c = aa(t)
      }
      Ue.has(c) ||
        ((t = j(
          { rel: 'preload', href: e === 'image' && n && n.imageSrcSet ? void 0 : t, as: e },
          n,
        )),
        Ue.set(c, t),
        l.querySelector(s) !== null ||
          (e === 'style' && l.querySelector(ri(c))) ||
          (e === 'script' && l.querySelector(ci(c))) ||
          ((e = l.createElement('link')), te(e, 'link', t), Ft(e), l.head.appendChild(e)))
    }
  }
  function U0(t, e) {
    vn.m(t, e)
    var n = na
    if (n && t) {
      var l = e && typeof e.as == 'string' ? e.as : 'script',
        s = 'link[rel="modulepreload"][as="' + Oe(l) + '"][href="' + Oe(t) + '"]',
        c = s
      switch (l) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          c = aa(t)
      }
      if (
        !Ue.has(c) &&
        ((t = j({ rel: 'modulepreload', href: t }, e)), Ue.set(c, t), n.querySelector(s) === null)
      ) {
        switch (l) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (n.querySelector(ci(c))) return
        }
        ;(l = n.createElement('link')), te(l, 'link', t), Ft(l), n.head.appendChild(l)
      }
    }
  }
  function N0(t, e, n) {
    vn.S(t, e, n)
    var l = na
    if (l && t) {
      var s = Ml(l).hoistableStyles,
        c = la(t)
      e = e || 'default'
      var h = s.get(c)
      if (!h) {
        var p = { loading: 0, preload: null }
        if ((h = l.querySelector(ri(c)))) p.loading = 5
        else {
          ;(t = j({ rel: 'stylesheet', href: t, 'data-precedence': e }, n)),
            (n = Ue.get(c)) && gc(t, n)
          var b = (h = l.createElement('link'))
          Ft(b),
            te(b, 'link', t),
            (b._p = new Promise(function (O, z) {
              ;(b.onload = O), (b.onerror = z)
            })),
            b.addEventListener('load', function () {
              p.loading |= 1
            }),
            b.addEventListener('error', function () {
              p.loading |= 2
            }),
            (p.loading |= 4),
            Lu(h, e, l)
        }
        ;(h = { type: 'stylesheet', instance: h, count: 1, state: p }), s.set(c, h)
      }
    }
  }
  function L0(t, e) {
    vn.X(t, e)
    var n = na
    if (n && t) {
      var l = Ml(n).hoistableScripts,
        s = aa(t),
        c = l.get(s)
      c ||
        ((c = n.querySelector(ci(s))),
        c ||
          ((t = j({ src: t, async: !0 }, e)),
          (e = Ue.get(s)) && Sc(t, e),
          (c = n.createElement('script')),
          Ft(c),
          te(c, 'link', t),
          n.head.appendChild(c)),
        (c = { type: 'script', instance: c, count: 1, state: null }),
        l.set(s, c))
    }
  }
  function q0(t, e) {
    vn.M(t, e)
    var n = na
    if (n && t) {
      var l = Ml(n).hoistableScripts,
        s = aa(t),
        c = l.get(s)
      c ||
        ((c = n.querySelector(ci(s))),
        c ||
          ((t = j({ src: t, async: !0, type: 'module' }, e)),
          (e = Ue.get(s)) && Sc(t, e),
          (c = n.createElement('script')),
          Ft(c),
          te(c, 'link', t),
          n.head.appendChild(c)),
        (c = { type: 'script', instance: c, count: 1, state: null }),
        l.set(s, c))
    }
  }
  function Hh(t, e, n, l) {
    var s = (s = ie.current) ? Nu(s) : null
    if (!s) throw Error(r(446))
    switch (t) {
      case 'meta':
      case 'title':
        return null
      case 'style':
        return typeof n.precedence == 'string' && typeof n.href == 'string'
          ? ((e = la(n.href)),
            (n = Ml(s).hoistableStyles),
            (l = n.get(e)),
            l || ((l = { type: 'style', instance: null, count: 0, state: null }), n.set(e, l)),
            l)
          : { type: 'void', instance: null, count: 0, state: null }
      case 'link':
        if (
          n.rel === 'stylesheet' &&
          typeof n.href == 'string' &&
          typeof n.precedence == 'string'
        ) {
          t = la(n.href)
          var c = Ml(s).hoistableStyles,
            h = c.get(t)
          if (
            (h ||
              ((s = s.ownerDocument || s),
              (h = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              c.set(t, h),
              (c = s.querySelector(ri(t))) && !c._p && ((h.instance = c), (h.state.loading = 5)),
              Ue.has(t) ||
                ((n = {
                  rel: 'preload',
                  as: 'style',
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                Ue.set(t, n),
                c || j0(s, t, n, h.state))),
            e && l === null)
          )
            throw Error(r(528, ''))
          return h
        }
        if (e && l !== null) throw Error(r(529, ''))
        return null
      case 'script':
        return (
          (e = n.async),
          (n = n.src),
          typeof n == 'string' && e && typeof e != 'function' && typeof e != 'symbol'
            ? ((e = aa(n)),
              (n = Ml(s).hoistableScripts),
              (l = n.get(e)),
              l || ((l = { type: 'script', instance: null, count: 0, state: null }), n.set(e, l)),
              l)
            : { type: 'void', instance: null, count: 0, state: null }
        )
      default:
        throw Error(r(444, t))
    }
  }
  function la(t) {
    return 'href="' + Oe(t) + '"'
  }
  function ri(t) {
    return 'link[rel="stylesheet"][' + t + ']'
  }
  function Bh(t) {
    return j({}, t, { 'data-precedence': t.precedence, precedence: null })
  }
  function j0(t, e, n, l) {
    t.querySelector('link[rel="preload"][as="style"][' + e + ']')
      ? (l.loading = 1)
      : ((e = t.createElement('link')),
        (l.preload = e),
        e.addEventListener('load', function () {
          return (l.loading |= 1)
        }),
        e.addEventListener('error', function () {
          return (l.loading |= 2)
        }),
        te(e, 'link', n),
        Ft(e),
        t.head.appendChild(e))
  }
  function aa(t) {
    return '[src="' + Oe(t) + '"]'
  }
  function ci(t) {
    return 'script[async]' + t
  }
  function Qh(t, e, n) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case 'style':
          var l = t.querySelector('style[data-href~="' + Oe(n.href) + '"]')
          if (l) return (e.instance = l), Ft(l), l
          var s = j({}, n, {
            'data-href': n.href,
            'data-precedence': n.precedence,
            href: null,
            precedence: null,
          })
          return (
            (l = (t.ownerDocument || t).createElement('style')),
            Ft(l),
            te(l, 'style', s),
            Lu(l, n.precedence, t),
            (e.instance = l)
          )
        case 'stylesheet':
          s = la(n.href)
          var c = t.querySelector(ri(s))
          if (c) return (e.state.loading |= 4), (e.instance = c), Ft(c), c
          ;(l = Bh(n)),
            (s = Ue.get(s)) && gc(l, s),
            (c = (t.ownerDocument || t).createElement('link')),
            Ft(c)
          var h = c
          return (
            (h._p = new Promise(function (p, b) {
              ;(h.onload = p), (h.onerror = b)
            })),
            te(c, 'link', l),
            (e.state.loading |= 4),
            Lu(c, n.precedence, t),
            (e.instance = c)
          )
        case 'script':
          return (
            (c = aa(n.src)),
            (s = t.querySelector(ci(c)))
              ? ((e.instance = s), Ft(s), s)
              : ((l = n),
                (s = Ue.get(c)) && ((l = j({}, n)), Sc(l, s)),
                (t = t.ownerDocument || t),
                (s = t.createElement('script')),
                Ft(s),
                te(s, 'link', l),
                t.head.appendChild(s),
                (e.instance = s))
          )
        case 'void':
          return null
        default:
          throw Error(r(443, e.type))
      }
    else
      e.type === 'stylesheet' &&
        (e.state.loading & 4) === 0 &&
        ((l = e.instance), (e.state.loading |= 4), Lu(l, n.precedence, t))
    return e.instance
  }
  function Lu(t, e, n) {
    for (
      var l = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        s = l.length ? l[l.length - 1] : null,
        c = s,
        h = 0;
      h < l.length;
      h++
    ) {
      var p = l[h]
      if (p.dataset.precedence === e) c = p
      else if (c !== s) break
    }
    c
      ? c.parentNode.insertBefore(t, c.nextSibling)
      : ((e = n.nodeType === 9 ? n.head : n), e.insertBefore(t, e.firstChild))
  }
  function gc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title)
  }
  function Sc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity)
  }
  var qu = null
  function Gh(t, e, n) {
    if (qu === null) {
      var l = new Map(),
        s = (qu = new Map())
      s.set(n, l)
    } else (s = qu), (l = s.get(n)), l || ((l = new Map()), s.set(n, l))
    if (l.has(t)) return l
    for (l.set(t, null), n = n.getElementsByTagName(t), s = 0; s < n.length; s++) {
      var c = n[s]
      if (
        !(c[Oa] || c[ee] || (t === 'link' && c.getAttribute('rel') === 'stylesheet')) &&
        c.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var h = c.getAttribute(e) || ''
        h = t + h
        var p = l.get(h)
        p ? p.push(c) : l.set(h, [c])
      }
    }
    return l
  }
  function Yh(t, e, n) {
    ;(t = t.ownerDocument || t),
      t.head.insertBefore(n, e === 'title' ? t.querySelector('head > title') : null)
  }
  function H0(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1
    switch (t) {
      case 'meta':
      case 'title':
        return !0
      case 'style':
        if (typeof e.precedence != 'string' || typeof e.href != 'string' || e.href === '') break
        return !0
      case 'link':
        if (
          typeof e.rel != 'string' ||
          typeof e.href != 'string' ||
          e.href === '' ||
          e.onLoad ||
          e.onError
        )
          break
        switch (e.rel) {
          case 'stylesheet':
            return (t = e.disabled), typeof e.precedence == 'string' && t == null
          default:
            return !0
        }
      case 'script':
        if (
          e.async &&
          typeof e.async != 'function' &&
          typeof e.async != 'symbol' &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == 'string'
        )
          return !0
    }
    return !1
  }
  function Vh(t) {
    return !(t.type === 'stylesheet' && (t.state.loading & 3) === 0)
  }
  var oi = null
  function B0() {}
  function Q0(t, e, n) {
    if (oi === null) throw Error(r(475))
    var l = oi
    if (
      e.type === 'stylesheet' &&
      (typeof n.media != 'string' || matchMedia(n.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var s = la(n.href),
          c = t.querySelector(ri(s))
        if (c) {
          ;(t = c._p),
            t !== null &&
              typeof t == 'object' &&
              typeof t.then == 'function' &&
              (l.count++, (l = ju.bind(l)), t.then(l, l)),
            (e.state.loading |= 4),
            (e.instance = c),
            Ft(c)
          return
        }
        ;(c = t.ownerDocument || t),
          (n = Bh(n)),
          (s = Ue.get(s)) && gc(n, s),
          (c = c.createElement('link')),
          Ft(c)
        var h = c
        ;(h._p = new Promise(function (p, b) {
          ;(h.onload = p), (h.onerror = b)
        })),
          te(c, 'link', n),
          (e.instance = c)
      }
      l.stylesheets === null && (l.stylesheets = new Map()),
        l.stylesheets.set(e, t),
        (t = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (l.count++,
          (e = ju.bind(l)),
          t.addEventListener('load', e),
          t.addEventListener('error', e))
    }
  }
  function G0() {
    if (oi === null) throw Error(r(475))
    var t = oi
    return (
      t.stylesheets && t.count === 0 && bc(t, t.stylesheets),
      0 < t.count
        ? function (e) {
            var n = setTimeout(function () {
              if ((t.stylesheets && bc(t, t.stylesheets), t.unsuspend)) {
                var l = t.unsuspend
                ;(t.unsuspend = null), l()
              }
            }, 6e4)
            return (
              (t.unsuspend = e),
              function () {
                ;(t.unsuspend = null), clearTimeout(n)
              }
            )
          }
        : null
    )
  }
  function ju() {
    if ((this.count--, this.count === 0)) {
      if (this.stylesheets) bc(this, this.stylesheets)
      else if (this.unsuspend) {
        var t = this.unsuspend
        ;(this.unsuspend = null), t()
      }
    }
  }
  var Hu = null
  function bc(t, e) {
    ;(t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++, (Hu = new Map()), e.forEach(Y0, t), (Hu = null), ju.call(t))
  }
  function Y0(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Hu.get(t)
      if (n) var l = n.get(null)
      else {
        ;(n = new Map()), Hu.set(t, n)
        for (
          var s = t.querySelectorAll('link[data-precedence],style[data-precedence]'), c = 0;
          c < s.length;
          c++
        ) {
          var h = s[c]
          ;(h.nodeName === 'LINK' || h.getAttribute('media') !== 'not all') &&
            (n.set(h.dataset.precedence, h), (l = h))
        }
        l && n.set(null, l)
      }
      ;(s = e.instance),
        (h = s.getAttribute('data-precedence')),
        (c = n.get(h) || l),
        c === l && n.set(null, s),
        n.set(h, s),
        this.count++,
        (l = ju.bind(this)),
        s.addEventListener('load', l),
        s.addEventListener('error', l),
        c
          ? c.parentNode.insertBefore(s, c.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(s, t.firstChild)),
        (e.state.loading |= 4)
    }
  }
  var fi = {
    $$typeof: D,
    Provider: null,
    Consumer: null,
    _currentValue: ut,
    _currentValue2: ut,
    _threadCount: 0,
  }
  function V0(t, e, n, l, s, c, h, p) {
    ;(this.tag = 1),
      (this.containerInfo = t),
      (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Es(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.finishedLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Es(0)),
      (this.hiddenUpdates = Es(null)),
      (this.identifierPrefix = l),
      (this.onUncaughtError = s),
      (this.onCaughtError = c),
      (this.onRecoverableError = h),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = p),
      (this.incompleteTransitions = new Map())
  }
  function Xh(t, e, n, l, s, c, h, p, b, O, z, H) {
    return (
      (t = new V0(t, e, n, h, p, b, O, H)),
      (e = 1),
      c === !0 && (e |= 24),
      (c = xe(3, null, null, e)),
      (t.current = c),
      (c.stateNode = t),
      (e = Ws()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (c.memoizedState = { element: l, isDehydrated: n, cache: e }),
      zr(c),
      t
    )
  }
  function Kh(t) {
    return t ? ((t = ql), t) : ql
  }
  function Zh(t, e, n, l, s, c) {
    ;(s = Kh(s)),
      l.context === null ? (l.context = s) : (l.pendingContext = s),
      (l = zn(e)),
      (l.payload = { element: n }),
      (c = c === void 0 ? null : c),
      c !== null && (l.callback = c),
      (n = Un(t, l, e)),
      n !== null && (se(n, t, e), Fa(n, t, e))
  }
  function kh(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var n = t.retryLane
      t.retryLane = n !== 0 && n < e ? n : e
    }
  }
  function _c(t, e) {
    kh(t, e), (t = t.alternate) && kh(t, e)
  }
  function Fh(t) {
    if (t.tag === 13) {
      var e = Rn(t, 67108864)
      e !== null && se(e, t, 67108864), _c(t, 67108864)
    }
  }
  var Bu = !0
  function X0(t, e, n, l) {
    var s = R.T
    R.T = null
    var c = V.p
    try {
      ;(V.p = 2), Ec(t, e, n, l)
    } finally {
      ;(V.p = c), (R.T = s)
    }
  }
  function K0(t, e, n, l) {
    var s = R.T
    R.T = null
    var c = V.p
    try {
      ;(V.p = 8), Ec(t, e, n, l)
    } finally {
      ;(V.p = c), (R.T = s)
    }
  }
  function Ec(t, e, n, l) {
    if (Bu) {
      var s = Oc(l)
      if (s === null) oc(t, e, l, Qu, n), Ph(t, l)
      else if (k0(s, t, e, n, l)) l.stopPropagation()
      else if ((Ph(t, l), e & 4 && -1 < Z0.indexOf(t))) {
        for (; s !== null; ) {
          var c = Rl(s)
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (((c = c.stateNode), c.current.memoizedState.isDehydrated)) {
                  var h = Pn(c.pendingLanes)
                  if (h !== 0) {
                    var p = c
                    for (p.pendingLanes |= 2, p.entangledLanes |= 2; h; ) {
                      var b = 1 << (31 - ve(h))
                      ;(p.entanglements[1] |= b), (h &= ~b)
                    }
                    Pe(c), (Ut & 6) === 0 && ((Ou = Ke() + 500), ii(0))
                  }
                }
                break
              case 13:
                ;(p = Rn(c, 2)), p !== null && se(p, c, 2), Mu(), _c(c, 2)
            }
          if (((c = Oc(l)), c === null && oc(t, e, l, Qu, n), c === s)) break
          s = c
        }
        s !== null && l.stopPropagation()
      } else oc(t, e, l, null, n)
    }
  }
  function Oc(t) {
    return (t = Cs(t)), Tc(t)
  }
  var Qu = null
  function Tc(t) {
    if (((Qu = null), (t = $n(t)), t !== null)) {
      var e = tt(t)
      if (e === null) t = null
      else {
        var n = e.tag
        if (n === 13) {
          if (((t = dt(e)), t !== null)) return t
          t = null
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null
          t = null
        } else e !== t && (t = null)
      }
    }
    return (Qu = t), null
  }
  function Jh(t) {
    switch (t) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8
      case 'message':
        switch (xm()) {
          case go:
            return 2
          case So:
            return 8
          case Li:
          case zm:
            return 32
          case bo:
            return 268435456
          default:
            return 32
        }
      default:
        return 32
    }
  }
  var Rc = !1,
    Qn = null,
    Gn = null,
    Yn = null,
    di = new Map(),
    hi = new Map(),
    Vn = [],
    Z0 =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' ',
      )
  function Ph(t, e) {
    switch (t) {
      case 'focusin':
      case 'focusout':
        Qn = null
        break
      case 'dragenter':
      case 'dragleave':
        Gn = null
        break
      case 'mouseover':
      case 'mouseout':
        Yn = null
        break
      case 'pointerover':
      case 'pointerout':
        di.delete(e.pointerId)
        break
      case 'gotpointercapture':
      case 'lostpointercapture':
        hi.delete(e.pointerId)
    }
  }
  function yi(t, e, n, l, s, c) {
    return t === null || t.nativeEvent !== c
      ? ((t = {
          blockedOn: e,
          domEventName: n,
          eventSystemFlags: l,
          nativeEvent: c,
          targetContainers: [s],
        }),
        e !== null && ((e = Rl(e)), e !== null && Fh(e)),
        t)
      : ((t.eventSystemFlags |= l),
        (e = t.targetContainers),
        s !== null && e.indexOf(s) === -1 && e.push(s),
        t)
  }
  function k0(t, e, n, l, s) {
    switch (e) {
      case 'focusin':
        return (Qn = yi(Qn, t, e, n, l, s)), !0
      case 'dragenter':
        return (Gn = yi(Gn, t, e, n, l, s)), !0
      case 'mouseover':
        return (Yn = yi(Yn, t, e, n, l, s)), !0
      case 'pointerover':
        var c = s.pointerId
        return di.set(c, yi(di.get(c) || null, t, e, n, l, s)), !0
      case 'gotpointercapture':
        return (c = s.pointerId), hi.set(c, yi(hi.get(c) || null, t, e, n, l, s)), !0
    }
    return !1
  }
  function $h(t) {
    var e = $n(t.target)
    if (e !== null) {
      var n = tt(e)
      if (n !== null) {
        if (((e = n.tag), e === 13)) {
          if (((e = dt(n)), e !== null)) {
            ;(t.blockedOn = e),
              Gm(t.priority, function () {
                if (n.tag === 13) {
                  var l = _e(),
                    s = Rn(n, l)
                  s !== null && se(s, n, l), _c(n, l)
                }
              })
            return
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null
          return
        }
      }
    }
    t.blockedOn = null
  }
  function Gu(t) {
    if (t.blockedOn !== null) return !1
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = Oc(t.nativeEvent)
      if (n === null) {
        n = t.nativeEvent
        var l = new n.constructor(n.type, n)
        ;(Ds = l), n.target.dispatchEvent(l), (Ds = null)
      } else return (e = Rl(n)), e !== null && Fh(e), (t.blockedOn = n), !1
      e.shift()
    }
    return !0
  }
  function Wh(t, e, n) {
    Gu(t) && n.delete(e)
  }
  function F0() {
    ;(Rc = !1),
      Qn !== null && Gu(Qn) && (Qn = null),
      Gn !== null && Gu(Gn) && (Gn = null),
      Yn !== null && Gu(Yn) && (Yn = null),
      di.forEach(Wh),
      hi.forEach(Wh)
  }
  function Yu(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null),
      Rc || ((Rc = !0), a.unstable_scheduleCallback(a.unstable_NormalPriority, F0)))
  }
  var Vu = null
  function Ih(t) {
    Vu !== t &&
      ((Vu = t),
      a.unstable_scheduleCallback(a.unstable_NormalPriority, function () {
        Vu === t && (Vu = null)
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e],
            l = t[e + 1],
            s = t[e + 2]
          if (typeof l != 'function') {
            if (Tc(l || n) === null) continue
            break
          }
          var c = Rl(n)
          c !== null &&
            (t.splice(e, 3),
            (e -= 3),
            yr(c, { pending: !0, data: s, method: n.method, action: l }, l, s))
        }
      }))
  }
  function mi(t) {
    function e(b) {
      return Yu(b, t)
    }
    Qn !== null && Yu(Qn, t),
      Gn !== null && Yu(Gn, t),
      Yn !== null && Yu(Yn, t),
      di.forEach(e),
      hi.forEach(e)
    for (var n = 0; n < Vn.length; n++) {
      var l = Vn[n]
      l.blockedOn === t && (l.blockedOn = null)
    }
    for (; 0 < Vn.length && ((n = Vn[0]), n.blockedOn === null); )
      $h(n), n.blockedOn === null && Vn.shift()
    if (((n = (t.ownerDocument || t).$$reactFormReplay), n != null))
      for (l = 0; l < n.length; l += 3) {
        var s = n[l],
          c = n[l + 1],
          h = s[oe] || null
        if (typeof c == 'function') h || Ih(n)
        else if (h) {
          var p = null
          if (c && c.hasAttribute('formAction')) {
            if (((s = c), (h = c[oe] || null))) p = h.formAction
            else if (Tc(s) !== null) continue
          } else p = h.action
          typeof p == 'function' ? (n[l + 1] = p) : (n.splice(l, 3), (l -= 3)), Ih(n)
        }
      }
  }
  function Mc(t) {
    this._internalRoot = t
  }
  ;(Xu.prototype.render = Mc.prototype.render =
    function (t) {
      var e = this._internalRoot
      if (e === null) throw Error(r(409))
      var n = e.current,
        l = _e()
      Zh(n, l, t, e, null, null)
    }),
    (Xu.prototype.unmount = Mc.prototype.unmount =
      function () {
        var t = this._internalRoot
        if (t !== null) {
          this._internalRoot = null
          var e = t.containerInfo
          t.tag === 0 && Il(), Zh(t.current, 2, null, t, null, null), Mu(), (e[Tl] = null)
        }
      })
  function Xu(t) {
    this._internalRoot = t
  }
  Xu.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = Mo()
      t = { blockedOn: null, target: t, priority: e }
      for (var n = 0; n < Vn.length && e !== 0 && e < Vn[n].priority; n++);
      Vn.splice(n, 0, t), n === 0 && $h(t)
    }
  }
  var ty = u.version
  if (ty !== '19.0.0') throw Error(r(527, ty, '19.0.0'))
  V.findDOMNode = function (t) {
    var e = t._reactInternals
    if (e === void 0)
      throw typeof t.render == 'function'
        ? Error(r(188))
        : ((t = Object.keys(t).join(',')), Error(r(268, t)))
    return (t = N(e)), (t = t !== null ? F(t) : null), (t = t === null ? null : t.stateNode), t
  }
  var J0 = {
    bundleType: 0,
    version: '19.0.0',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: R,
    findFiberByHostInstance: $n,
    reconcilerVersion: '19.0.0',
  }
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var Ku = __REACT_DEVTOOLS_GLOBAL_HOOK__
    if (!Ku.isDisabled && Ku.supportsFiber)
      try {
        ;(ba = Ku.inject(J0)), (me = Ku)
      } catch {}
  }
  return (
    (pi.createRoot = function (t, e) {
      if (!o(t)) throw Error(r(299))
      var n = !1,
        l = '',
        s = pd,
        c = gd,
        h = Sd,
        p = null
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (n = !0),
          e.identifierPrefix !== void 0 && (l = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (s = e.onUncaughtError),
          e.onCaughtError !== void 0 && (c = e.onCaughtError),
          e.onRecoverableError !== void 0 && (h = e.onRecoverableError),
          e.unstable_transitionCallbacks !== void 0 && (p = e.unstable_transitionCallbacks)),
        (e = Xh(t, 1, !1, null, null, n, l, s, c, h, p, null)),
        (t[Tl] = e.current),
        cc(t.nodeType === 8 ? t.parentNode : t),
        new Mc(e)
      )
    }),
    (pi.hydrateRoot = function (t, e, n) {
      if (!o(t)) throw Error(r(299))
      var l = !1,
        s = '',
        c = pd,
        h = gd,
        p = Sd,
        b = null,
        O = null
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (l = !0),
          n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (c = n.onUncaughtError),
          n.onCaughtError !== void 0 && (h = n.onCaughtError),
          n.onRecoverableError !== void 0 && (p = n.onRecoverableError),
          n.unstable_transitionCallbacks !== void 0 && (b = n.unstable_transitionCallbacks),
          n.formState !== void 0 && (O = n.formState)),
        (e = Xh(t, 1, !0, e, n ?? null, l, s, c, h, p, b, O)),
        (e.context = Kh(null)),
        (n = e.current),
        (l = _e()),
        (s = zn(l)),
        (s.callback = null),
        Un(n, s, l),
        (e.current.lanes = l),
        Ea(e, l),
        Pe(e),
        (t[Tl] = e.current),
        cc(t),
        new Xu(e)
      )
    }),
    (pi.version = '19.0.0'),
    pi
  )
}
var oy
function up() {
  if (oy) return Cc.exports
  oy = 1
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)
      } catch (u) {
        console.error(u)
      }
  }
  return a(), (Cc.exports = ip()), Cc.exports
}
var sp = up()
const rp = Yy(sp)
var cp = 'Invariant failed'
function Ve(a, u) {
  if (!a) throw new Error(cp)
}
function oa(a) {
  const u = a.resolvedLocation,
    i = a.location,
    r = u?.pathname !== i.pathname,
    o = u?.href !== i.href,
    f = u?.hash !== i.hash
  return { fromLocation: u, toLocation: i, pathChanged: r, hrefChanged: o, hashChanged: f }
}
function ra(a) {
  return a[a.length - 1]
}
function op(a) {
  return typeof a == 'function'
}
function gi(a, u) {
  return op(a) ? a(u) : a
}
function $c(a, u) {
  return u.reduce((i, r) => ((i[r] = a[r]), i), {})
}
function qe(a, u) {
  if (a === u) return a
  const i = u,
    r = dy(a) && dy(i)
  if (r || (es(a) && es(i))) {
    const o = r ? a : Object.keys(a),
      f = o.length,
      d = r ? i : Object.keys(i),
      y = d.length,
      m = r ? [] : {}
    let v = 0
    for (let g = 0; g < y; g++) {
      const S = r ? g : d[g]
      ;((!r && o.includes(S)) || r) && a[S] === void 0 && i[S] === void 0
        ? ((m[S] = void 0), v++)
        : ((m[S] = qe(a[S], i[S])), m[S] === a[S] && a[S] !== void 0 && v++)
    }
    return f === y && v === f ? a : m
  }
  return i
}
function es(a) {
  if (!fy(a)) return !1
  const u = a.constructor
  if (typeof u > 'u') return !0
  const i = u.prototype
  return !(!fy(i) || !i.hasOwnProperty('isPrototypeOf'))
}
function fy(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}
function dy(a) {
  return Array.isArray(a) && a.length === Object.keys(a).length
}
function hy(a, u) {
  let i = Object.keys(a)
  return u && (i = i.filter((r) => a[r] !== void 0)), i
}
function Ai(a, u, i) {
  if (a === u) return !0
  if (typeof a != typeof u) return !1
  if (es(a) && es(u)) {
    const r = i?.ignoreUndefined ?? !0,
      o = hy(a, r),
      f = hy(u, r)
    return !i?.partial && o.length !== f.length ? !1 : f.every((d) => Ai(a[d], u[d], i))
  }
  return Array.isArray(a) && Array.isArray(u)
    ? a.length !== u.length
      ? !1
      : !a.some((r, o) => !Ai(r, u[o], i))
    : !1
}
function ua(a) {
  let u, i
  const r = new Promise((o, f) => {
    ;(u = o), (i = f)
  })
  return (
    (r.status = 'pending'),
    (r.resolve = (o) => {
      ;(r.status = 'resolved'), (r.value = o), u(o), a?.(o)
    }),
    (r.reject = (o) => {
      ;(r.status = 'rejected'), i(o)
    }),
    r
  )
}
function fp(a) {
  return /%[0-9A-Fa-f]{2}/.test(a)
}
function pn(a) {
  return ys(a.filter((u) => u !== void 0).join('/'))
}
function ys(a) {
  return a.replace(/\/{2,}/g, '/')
}
function ro(a) {
  return a === '/' ? a : a.replace(/^\/{1,}/, '')
}
function Sl(a) {
  return a === '/' ? a : a.replace(/\/{1,}$/, '')
}
function dp(a) {
  return Sl(ro(a))
}
function hp({ basepath: a, base: u, to: i, trailingSlash: r = 'never', caseSensitive: o }) {
  var f, d
  ;(u = ns(a, u, o)), (i = ns(a, i, o))
  let y = ha(u)
  const m = ha(i)
  y.length > 1 && ((f = ra(y)) == null ? void 0 : f.value) === '/' && y.pop(),
    m.forEach((g, S) => {
      g.value === '/'
        ? S
          ? S === m.length - 1 && y.push(g)
          : (y = [g])
        : g.value === '..'
        ? y.pop()
        : g.value === '.' || y.push(g)
    }),
    y.length > 1 &&
      (((d = ra(y)) == null ? void 0 : d.value) === '/'
        ? r === 'never' && y.pop()
        : r === 'always' && y.push({ type: 'pathname', value: '/' }))
  const v = pn([a, ...y.map((g) => g.value)])
  return ys(v)
}
function ha(a) {
  if (!a) return []
  a = ys(a)
  const u = []
  if (
    (a.slice(0, 1) === '/' && ((a = a.substring(1)), u.push({ type: 'pathname', value: '/' })), !a)
  )
    return u
  const i = a.split('/').filter(Boolean)
  return (
    u.push(
      ...i.map((r) =>
        r === '$' || r === '*'
          ? { type: 'wildcard', value: r }
          : r.charAt(0) === '$'
          ? { type: 'param', value: r }
          : {
              type: 'pathname',
              value: r.includes('%25')
                ? r
                    .split('%25')
                    .map((o) => decodeURI(o))
                    .join('%25')
                : decodeURI(r),
            },
      ),
    ),
    a.slice(-1) === '/' && ((a = a.substring(1)), u.push({ type: 'pathname', value: '/' })),
    u
  )
}
function Zu({ path: a, params: u, leaveWildcards: i, leaveParams: r, decodeCharMap: o }) {
  const f = ha(a)
  function d(v) {
    const g = u[v],
      S = typeof g == 'string'
    return ['*', '_splat'].includes(v) ? (S ? encodeURI(g) : g) : S ? yp(g, o) : g
  }
  const y = {},
    m = pn(
      f.map((v) => {
        if (v.type === 'wildcard') {
          y._splat = u._splat
          const g = d('_splat')
          return i ? `${v.value}${g ?? ''}` : g
        }
        if (v.type === 'param') {
          const g = v.value.substring(1)
          if (((y[g] = u[g]), r)) {
            const S = d(v.value)
            return `${v.value}${S ?? ''}`
          }
          return d(g) ?? 'undefined'
        }
        return v.value
      }),
    )
  return { usedParams: y, interpolatedPath: m }
}
function yp(a, u) {
  let i = encodeURIComponent(a)
  if (u) for (const [r, o] of u) i = i.replaceAll(r, o)
  return i
}
function ku(a, u, i) {
  const r = mp(a, u, i)
  if (!(i.to && !r)) return r ?? {}
}
function ns(a, u, i = !1) {
  const r = i ? a : a.toLowerCase(),
    o = i ? u : u.toLowerCase()
  switch (!0) {
    case r === '/':
      return u
    case o === r:
      return ''
    case u.length < a.length:
      return u
    case o[r.length] !== '/':
      return u
    case o.startsWith(r):
      return u.slice(a.length)
    default:
      return u
  }
}
function mp(a, u, i) {
  if (a !== '/' && !u.startsWith(a)) return
  u = ns(a, u, i.caseSensitive)
  const r = ns(a, `${i.to ?? '$'}`, i.caseSensitive),
    o = ha(u),
    f = ha(r)
  u.startsWith('/') || o.unshift({ type: 'pathname', value: '/' }),
    r.startsWith('/') || f.unshift({ type: 'pathname', value: '/' })
  const d = {}
  return (() => {
    for (let m = 0; m < Math.max(o.length, f.length); m++) {
      const v = o[m],
        g = f[m],
        S = m >= o.length - 1,
        T = m >= f.length - 1
      if (g) {
        if (g.type === 'wildcard') {
          const D = decodeURI(pn(o.slice(m).map((w) => w.value)))
          return (d['*'] = D), (d._splat = D), !0
        }
        if (g.type === 'pathname') {
          if (g.value === '/' && !v?.value) return !0
          if (v) {
            if (i.caseSensitive) {
              if (g.value !== v.value) return !1
            } else if (g.value.toLowerCase() !== v.value.toLowerCase()) return !1
          }
        }
        if (!v) return !1
        if (g.type === 'param') {
          if (v.value === '/') return !1
          v.value.charAt(0) !== '$' && (d[g.value.substring(1)] = decodeURIComponent(v.value))
        }
      }
      if (!S && T)
        return (d['**'] = pn(o.slice(m + 1).map((D) => D.value))), !!i.fuzzy && g?.value !== '/'
    }
    return !0
  })()
    ? d
    : void 0
}
function vp(a, u) {
  let i,
    r,
    o,
    f = ''
  for (i in a)
    if ((o = a[i]) !== void 0)
      if (Array.isArray(o))
        for (r = 0; r < o.length; r++)
          f && (f += '&'), (f += encodeURIComponent(i) + '=' + encodeURIComponent(o[r]))
      else f && (f += '&'), (f += encodeURIComponent(i) + '=' + encodeURIComponent(o))
  return '' + f
}
function yy(a) {
  if (!a) return ''
  const u = fp(a) ? decodeURIComponent(a) : decodeURIComponent(encodeURIComponent(a))
  return u === 'false' ? !1 : u === 'true' ? !0 : +u * 0 === 0 && +u + '' === u ? +u : u
}
function pp(a, u) {
  let i, r
  const o = {},
    f = a.split('&')
  for (; (i = f.shift()); ) {
    const d = i.indexOf('=')
    if (d !== -1) {
      ;(r = i.slice(0, d)), (r = decodeURIComponent(r))
      const y = i.slice(d + 1)
      o[r] !== void 0 ? (o[r] = [].concat(o[r], yy(y))) : (o[r] = yy(y))
    } else (r = i), (r = decodeURIComponent(r)), (o[r] = '')
  }
  return o
}
const he = '__root__',
  gp = bp(JSON.parse),
  Sp = _p(JSON.stringify, JSON.parse)
function bp(a) {
  return (u) => {
    u.substring(0, 1) === '?' && (u = u.substring(1))
    const i = pp(u)
    for (const r in i) {
      const o = i[r]
      if (typeof o == 'string')
        try {
          i[r] = a(o)
        } catch {}
    }
    return i
  }
}
function _p(a, u) {
  function i(r) {
    if (typeof r == 'object' && r !== null)
      try {
        return a(r)
      } catch {}
    else if (typeof r == 'string' && typeof u == 'function')
      try {
        return u(r), a(r)
      } catch {}
    return r
  }
  return (r) => {
    ;(r = { ...r }),
      Object.keys(r).forEach((f) => {
        const d = r[f]
        typeof d > 'u' || d === void 0 ? delete r[f] : (r[f] = i(d))
      })
    const o = vp(r).toString()
    return o ? `?${o}` : ''
  }
}
const kn = '__TSR_index',
  my = 'popstate',
  vy = 'beforeunload'
function Vy(a) {
  let u = a.getLocation()
  const i = new Set(),
    r = (d) => {
      ;(u = a.getLocation()), i.forEach((y) => y({ location: u, action: d }))
    },
    o = (d) => {
      a.notifyOnIndexChange ?? !0 ? r(d) : (u = a.getLocation())
    },
    f = async ({ task: d, navigateOpts: y, ...m }) => {
      var v, g
      if (y?.ignoreBlocker ?? !1) {
        d()
        return
      }
      const T = ((v = a.getBlockers) == null ? void 0 : v.call(a)) ?? [],
        D = m.type === 'PUSH' || m.type === 'REPLACE'
      if (typeof document < 'u' && T.length && D)
        for (const w of T) {
          const U = Ci(m.path, m.state)
          if (await w.blockerFn({ currentLocation: u, nextLocation: U, action: m.type })) {
            ;(g = a.onBlocked) == null || g.call(a)
            return
          }
        }
      d()
    }
  return {
    get location() {
      return u
    },
    get length() {
      return a.getLength()
    },
    subscribers: i,
    subscribe: (d) => (
      i.add(d),
      () => {
        i.delete(d)
      }
    ),
    push: (d, y, m) => {
      const v = u.state[kn]
      ;(y = Wc(v + 1, y)),
        f({
          task: () => {
            a.pushState(d, y), r({ type: 'PUSH' })
          },
          navigateOpts: m,
          type: 'PUSH',
          path: d,
          state: y,
        })
    },
    replace: (d, y, m) => {
      const v = u.state[kn]
      ;(y = Wc(v, y)),
        f({
          task: () => {
            a.replaceState(d, y), r({ type: 'REPLACE' })
          },
          navigateOpts: m,
          type: 'REPLACE',
          path: d,
          state: y,
        })
    },
    go: (d, y) => {
      f({
        task: () => {
          a.go(d), o({ type: 'GO', index: d })
        },
        navigateOpts: y,
        type: 'GO',
      })
    },
    back: (d) => {
      f({
        task: () => {
          a.back(d?.ignoreBlocker ?? !1), o({ type: 'BACK' })
        },
        navigateOpts: d,
        type: 'BACK',
      })
    },
    forward: (d) => {
      f({
        task: () => {
          a.forward(d?.ignoreBlocker ?? !1), o({ type: 'FORWARD' })
        },
        navigateOpts: d,
        type: 'FORWARD',
      })
    },
    canGoBack: () => u.state[kn] !== 0,
    createHref: (d) => a.createHref(d),
    block: (d) => {
      var y
      if (!a.setBlockers) return () => {}
      const m = ((y = a.getBlockers) == null ? void 0 : y.call(a)) ?? []
      return (
        a.setBlockers([...m, d]),
        () => {
          var v, g
          const S = ((v = a.getBlockers) == null ? void 0 : v.call(a)) ?? []
          ;(g = a.setBlockers) == null ||
            g.call(
              a,
              S.filter((T) => T !== d),
            )
        }
      )
    },
    flush: () => {
      var d
      return (d = a.flush) == null ? void 0 : d.call(a)
    },
    destroy: () => {
      var d
      return (d = a.destroy) == null ? void 0 : d.call(a)
    },
    notify: r,
  }
}
function Wc(a, u) {
  return u || (u = {}), { ...u, key: co(), [kn]: a }
}
function Ep(a) {
  var u
  const i = typeof document < 'u' ? window : void 0,
    r = i.history.pushState,
    o = i.history.replaceState
  let f = []
  const d = () => f,
    y = (R) => (f = R),
    m = (R) => R,
    v = () => Ci(`${i.location.pathname}${i.location.search}${i.location.hash}`, i.history.state)
  ;((u = i.history.state) != null && u.key) || i.history.replaceState({ [kn]: 0, key: co() }, '')
  let g = v(),
    S,
    T = !1,
    D = !1,
    w = !1,
    U = !1
  const Z = () => g
  let G, X
  const nt = () => {
      G &&
        ((L._ignoreSubscribers = !0),
        (G.isPush ? i.history.pushState : i.history.replaceState)(G.state, '', G.href),
        (L._ignoreSubscribers = !1),
        (G = void 0),
        (X = void 0),
        (S = void 0))
    },
    yt = (R, j, Y) => {
      const K = m(j)
      X || (S = g),
        (g = Ci(j, Y)),
        (G = { href: K, state: Y, isPush: G?.isPush || R === 'push' }),
        X || (X = Promise.resolve().then(() => nt()))
    },
    Q = (R) => {
      ;(g = v()), L.notify({ type: R })
    },
    $ = async () => {
      if (D) {
        D = !1
        return
      }
      const R = v(),
        j = R.state[kn] - g.state[kn],
        Y = j === 1,
        K = j === -1,
        lt = (!Y && !K) || T
      T = !1
      const vt = lt ? 'GO' : K ? 'BACK' : 'FORWARD',
        rt = lt ? { type: 'GO', index: j } : { type: K ? 'BACK' : 'FORWARD' }
      if (w) w = !1
      else {
        const B = d()
        if (typeof document < 'u' && B.length) {
          for (const P of B)
            if (await P.blockerFn({ currentLocation: g, nextLocation: R, action: vt })) {
              ;(D = !0), i.history.go(1), L.notify(rt)
              return
            }
        }
      }
      ;(g = v()), L.notify(rt)
    },
    ct = (R) => {
      if (U) {
        U = !1
        return
      }
      let j = !1
      const Y = d()
      if (typeof document < 'u' && Y.length)
        for (const K of Y) {
          const lt = K.enableBeforeUnload ?? !0
          if (lt === !0) {
            j = !0
            break
          }
          if (typeof lt == 'function' && lt() === !0) {
            j = !0
            break
          }
        }
      if (j) return R.preventDefault(), (R.returnValue = '')
    },
    L = Vy({
      getLocation: Z,
      getLength: () => i.history.length,
      pushState: (R, j) => yt('push', R, j),
      replaceState: (R, j) => yt('replace', R, j),
      back: (R) => (R && (w = !0), (U = !0), i.history.back()),
      forward: (R) => {
        R && (w = !0), (U = !0), i.history.forward()
      },
      go: (R) => {
        ;(T = !0), i.history.go(R)
      },
      createHref: (R) => m(R),
      flush: nt,
      destroy: () => {
        ;(i.history.pushState = r),
          (i.history.replaceState = o),
          i.removeEventListener(vy, ct, { capture: !0 }),
          i.removeEventListener(my, $)
      },
      onBlocked: () => {
        S && g !== S && (g = S)
      },
      getBlockers: d,
      setBlockers: y,
      notifyOnIndexChange: !1,
    })
  return (
    i.addEventListener(vy, ct, { capture: !0 }),
    i.addEventListener(my, $),
    (i.history.pushState = function (...R) {
      const j = r.apply(i.history, R)
      return L._ignoreSubscribers || Q('PUSH'), j
    }),
    (i.history.replaceState = function (...R) {
      const j = o.apply(i.history, R)
      return L._ignoreSubscribers || Q('REPLACE'), j
    }),
    L
  )
}
function Op(a = { initialEntries: ['/'] }) {
  const u = a.initialEntries
  let i = a.initialIndex ? Math.min(Math.max(a.initialIndex, 0), u.length - 1) : u.length - 1
  const r = u.map((f, d) => Wc(d, void 0))
  return Vy({
    getLocation: () => Ci(u[i], r[i]),
    getLength: () => u.length,
    pushState: (f, d) => {
      i < u.length - 1 && (u.splice(i + 1), r.splice(i + 1)),
        r.push(d),
        u.push(f),
        (i = Math.max(u.length - 1, 0))
    },
    replaceState: (f, d) => {
      ;(r[i] = d), (u[i] = f)
    },
    back: () => {
      i = Math.max(i - 1, 0)
    },
    forward: () => {
      i = Math.min(i + 1, u.length - 1)
    },
    go: (f) => {
      i = Math.min(Math.max(i + f, 0), u.length - 1)
    },
    createHref: (f) => f,
  })
}
function Ci(a, u) {
  const i = a.indexOf('#'),
    r = a.indexOf('?')
  return {
    href: a,
    pathname: a.substring(0, i > 0 ? (r > 0 ? Math.min(i, r) : i) : r > 0 ? r : a.length),
    hash: i > -1 ? a.substring(i) : '',
    search: r > -1 ? a.slice(r, i === -1 ? void 0 : i) : '',
    state: u || { [kn]: 0, key: co() },
  }
}
function co() {
  return (Math.random() + 1).toString(36).substring(7)
}
function oo(a) {
  const u = a.errorComponent ?? ms
  return k.jsx(Tp, {
    getResetKey: a.getResetKey,
    onCatch: a.onCatch,
    children: ({ error: i, reset: r }) =>
      i ? ft.createElement(u, { error: i, reset: r }) : a.children,
  })
}
class Tp extends ft.Component {
  constructor() {
    super(...arguments), (this.state = { error: null })
  }
  static getDerivedStateFromProps(u) {
    return { resetKey: u.getResetKey() }
  }
  static getDerivedStateFromError(u) {
    return { error: u }
  }
  reset() {
    this.setState({ error: null })
  }
  componentDidUpdate(u, i) {
    i.error && i.resetKey !== this.state.resetKey && this.reset()
  }
  componentDidCatch(u, i) {
    this.props.onCatch && this.props.onCatch(u, i)
  }
  render() {
    return this.props.children({
      error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
      reset: () => {
        this.reset()
      },
    })
  }
}
function ms({ error: a }) {
  const [u, i] = ft.useState(!1)
  return k.jsxs('div', {
    style: { padding: '.5rem', maxWidth: '100%' },
    children: [
      k.jsxs('div', {
        style: { display: 'flex', alignItems: 'center', gap: '.5rem' },
        children: [
          k.jsx('strong', { style: { fontSize: '1rem' }, children: 'Something went wrong!' }),
          k.jsx('button', {
            style: {
              appearance: 'none',
              fontSize: '.6em',
              border: '1px solid currentColor',
              padding: '.1rem .2rem',
              fontWeight: 'bold',
              borderRadius: '.25rem',
            },
            onClick: () => i((r) => !r),
            children: u ? 'Hide Error' : 'Show Error',
          }),
        ],
      }),
      k.jsx('div', { style: { height: '.25rem' } }),
      u
        ? k.jsx('div', {
            children: k.jsx('pre', {
              style: {
                fontSize: '.7em',
                border: '1px solid red',
                borderRadius: '.25rem',
                padding: '.3rem',
                color: 'red',
                overflow: 'auto',
              },
              children: a.message ? k.jsx('code', { children: a.message }) : null,
            }),
          })
        : null,
    ],
  })
}
var Uc = { exports: {} },
  Nc = {},
  Lc = { exports: {} },
  qc = {}
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var py
function Rp() {
  if (py) return qc
  py = 1
  var a = Ni()
  function u(S, T) {
    return (S === T && (S !== 0 || 1 / S === 1 / T)) || (S !== S && T !== T)
  }
  var i = typeof Object.is == 'function' ? Object.is : u,
    r = a.useState,
    o = a.useEffect,
    f = a.useLayoutEffect,
    d = a.useDebugValue
  function y(S, T) {
    var D = T(),
      w = r({ inst: { value: D, getSnapshot: T } }),
      U = w[0].inst,
      Z = w[1]
    return (
      f(
        function () {
          ;(U.value = D), (U.getSnapshot = T), m(U) && Z({ inst: U })
        },
        [S, D, T],
      ),
      o(
        function () {
          return (
            m(U) && Z({ inst: U }),
            S(function () {
              m(U) && Z({ inst: U })
            })
          )
        },
        [S],
      ),
      d(D),
      D
    )
  }
  function m(S) {
    var T = S.getSnapshot
    S = S.value
    try {
      var D = T()
      return !i(S, D)
    } catch {
      return !0
    }
  }
  function v(S, T) {
    return T()
  }
  var g =
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
      ? v
      : y
  return (
    (qc.useSyncExternalStore = a.useSyncExternalStore !== void 0 ? a.useSyncExternalStore : g), qc
  )
}
var gy
function Mp() {
  return gy || ((gy = 1), (Lc.exports = Rp())), Lc.exports
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Sy
function Ap() {
  if (Sy) return Nc
  Sy = 1
  var a = Ni(),
    u = Mp()
  function i(v, g) {
    return (v === g && (v !== 0 || 1 / v === 1 / g)) || (v !== v && g !== g)
  }
  var r = typeof Object.is == 'function' ? Object.is : i,
    o = u.useSyncExternalStore,
    f = a.useRef,
    d = a.useEffect,
    y = a.useMemo,
    m = a.useDebugValue
  return (
    (Nc.useSyncExternalStoreWithSelector = function (v, g, S, T, D) {
      var w = f(null)
      if (w.current === null) {
        var U = { hasValue: !1, value: null }
        w.current = U
      } else U = w.current
      w = y(
        function () {
          function G($) {
            if (!X) {
              if (((X = !0), (nt = $), ($ = T($)), D !== void 0 && U.hasValue)) {
                var ct = U.value
                if (D(ct, $)) return (yt = ct)
              }
              return (yt = $)
            }
            if (((ct = yt), r(nt, $))) return ct
            var L = T($)
            return D !== void 0 && D(ct, L) ? ((nt = $), ct) : ((nt = $), (yt = L))
          }
          var X = !1,
            nt,
            yt,
            Q = S === void 0 ? null : S
          return [
            function () {
              return G(g())
            },
            Q === null
              ? void 0
              : function () {
                  return G(Q())
                },
          ]
        },
        [g, S, T, D],
      )
      var Z = o(v, w[0], w[1])
      return (
        d(
          function () {
            ;(U.hasValue = !0), (U.value = Z)
          },
          [Z],
        ),
        m(Z),
        Z
      )
    }),
    Nc
  )
}
var by
function Dp() {
  return by || ((by = 1), (Uc.exports = Ap())), Uc.exports
}
var Cp = Dp()
const fa = new WeakMap(),
  Wu = new WeakMap(),
  ls = { current: [] }
let jc = !1,
  Di = 0
const Si = new Set(),
  Fu = new Map()
function Xy(a) {
  const u = Array.from(a).sort((i, r) =>
    i instanceof da && i.options.deps.includes(r)
      ? 1
      : r instanceof da && r.options.deps.includes(i)
      ? -1
      : 0,
  )
  for (const i of u) {
    if (ls.current.includes(i)) continue
    ls.current.push(i), i.recompute()
    const r = Wu.get(i)
    if (r)
      for (const o of r) {
        const f = fa.get(o)
        f && Xy(f)
      }
  }
}
function wp(a) {
  a.listeners.forEach((u) => u({ prevVal: a.prevState, currentVal: a.state }))
}
function xp(a) {
  a.listeners.forEach((u) => u({ prevVal: a.prevState, currentVal: a.state }))
}
function Ky(a) {
  if ((Di > 0 && !Fu.has(a) && Fu.set(a, a.prevState), Si.add(a), !(Di > 0) && !jc))
    try {
      for (jc = !0; Si.size > 0; ) {
        const u = Array.from(Si)
        Si.clear()
        for (const i of u) {
          const r = Fu.get(i) ?? i.prevState
          ;(i.prevState = r), wp(i)
        }
        for (const i of u) {
          const r = fa.get(i)
          r && (ls.current.push(i), Xy(r))
        }
        for (const i of u) {
          const r = fa.get(i)
          if (r) for (const o of r) xp(o)
        }
      }
    } finally {
      ;(jc = !1), (ls.current = []), Fu.clear()
    }
}
function Hc(a) {
  Di++
  try {
    a()
  } finally {
    if ((Di--, Di === 0)) {
      const u = Array.from(Si)[0]
      u && Ky(u)
    }
  }
}
class Ic {
  constructor(u, i) {
    ;(this.listeners = new Set()),
      (this.subscribe = (r) => {
        var o, f
        this.listeners.add(r)
        const d =
          (f = (o = this.options) == null ? void 0 : o.onSubscribe) == null
            ? void 0
            : f.call(o, r, this)
        return () => {
          this.listeners.delete(r), d?.()
        }
      }),
      (this.setState = (r) => {
        var o, f, d
        ;(this.prevState = this.state),
          (this.state =
            (o = this.options) != null && o.updateFn
              ? this.options.updateFn(this.prevState)(r)
              : r(this.prevState)),
          (d = (f = this.options) == null ? void 0 : f.onUpdate) == null || d.call(f),
          Ky(this)
      }),
      (this.prevState = u),
      (this.state = u),
      (this.options = i)
  }
}
class da {
  constructor(u) {
    ;(this.listeners = new Set()),
      (this._subscriptions = []),
      (this.lastSeenDepValues = []),
      (this.getDepVals = () => {
        const i = [],
          r = []
        for (const o of this.options.deps) i.push(o.prevState), r.push(o.state)
        return (
          (this.lastSeenDepValues = r),
          { prevDepVals: i, currDepVals: r, prevVal: this.prevState ?? void 0 }
        )
      }),
      (this.recompute = () => {
        var i, r
        this.prevState = this.state
        const { prevDepVals: o, currDepVals: f, prevVal: d } = this.getDepVals()
        ;(this.state = this.options.fn({ prevDepVals: o, currDepVals: f, prevVal: d })),
          (r = (i = this.options).onUpdate) == null || r.call(i)
      }),
      (this.checkIfRecalculationNeededDeeply = () => {
        for (const f of this.options.deps) f instanceof da && f.checkIfRecalculationNeededDeeply()
        let i = !1
        const r = this.lastSeenDepValues,
          { currDepVals: o } = this.getDepVals()
        for (let f = 0; f < o.length; f++)
          if (o[f] !== r[f]) {
            i = !0
            break
          }
        i && this.recompute()
      }),
      (this.mount = () => (
        this.registerOnGraph(),
        this.checkIfRecalculationNeededDeeply(),
        () => {
          this.unregisterFromGraph()
          for (const i of this._subscriptions) i()
        }
      )),
      (this.subscribe = (i) => {
        var r, o
        this.listeners.add(i)
        const f = (o = (r = this.options).onSubscribe) == null ? void 0 : o.call(r, i, this)
        return () => {
          this.listeners.delete(i), f?.()
        }
      }),
      (this.options = u),
      (this.state = u.fn({
        prevDepVals: void 0,
        prevVal: void 0,
        currDepVals: this.getDepVals().currDepVals,
      }))
  }
  registerOnGraph(u = this.options.deps) {
    for (const i of u)
      if (i instanceof da) i.registerOnGraph(), this.registerOnGraph(i.options.deps)
      else if (i instanceof Ic) {
        let r = fa.get(i)
        r || ((r = new Set()), fa.set(i, r)), r.add(this)
        let o = Wu.get(this)
        o || ((o = new Set()), Wu.set(this, o)), o.add(i)
      }
  }
  unregisterFromGraph(u = this.options.deps) {
    for (const i of u)
      if (i instanceof da) this.unregisterFromGraph(i.options.deps)
      else if (i instanceof Ic) {
        const r = fa.get(i)
        r && r.delete(this)
        const o = Wu.get(this)
        o && o.delete(i)
      }
  }
}
function zp(a, u = (i) => i) {
  return Cp.useSyncExternalStoreWithSelector(
    a.subscribe,
    () => a.state,
    () => a.state,
    u,
    Up,
  )
}
function Up(a, u) {
  if (Object.is(a, u)) return !0
  if (typeof a != 'object' || a === null || typeof u != 'object' || u === null) return !1
  if (a instanceof Map && u instanceof Map) {
    if (a.size !== u.size) return !1
    for (const [r, o] of a) if (!u.has(r) || !Object.is(o, u.get(r))) return !1
    return !0
  }
  if (a instanceof Set && u instanceof Set) {
    if (a.size !== u.size) return !1
    for (const r of a) if (!u.has(r)) return !1
    return !0
  }
  const i = Object.keys(a)
  if (i.length !== Object.keys(u).length) return !1
  for (let r = 0; r < i.length; r++)
    if (!Object.prototype.hasOwnProperty.call(u, i[r]) || !Object.is(a[i[r]], u[i[r]])) return !1
  return !0
}
const Bc = ft.createContext(null)
function Zy() {
  return typeof document > 'u'
    ? Bc
    : window.__TSR_ROUTER_CONTEXT__
    ? window.__TSR_ROUTER_CONTEXT__
    : ((window.__TSR_ROUTER_CONTEXT__ = Bc), Bc)
}
function We(a) {
  const u = ft.useContext(Zy())
  return a?.warn, u
}
function ce(a) {
  const u = We({ warn: a?.router === void 0 }),
    i = a?.router || u,
    r = ft.useRef(void 0)
  return zp(i.__store, (o) => {
    if (a?.select) {
      if (a.structuralSharing ?? i.options.defaultStructuralSharing) {
        const f = qe(r.current, a.select(o))
        return (r.current = f), f
      }
      return a.select(o)
    }
    return o
  })
}
const vs = ft.createContext(void 0),
  Np = ft.createContext(void 0)
function ya(a) {
  const u = ft.useContext(a.from ? Np : vs)
  return ce({
    select: (r) => {
      const o = r.matches.find((f) => (a.from ? a.from === f.routeId : f.id === u))
      if (
        (Ve(
          !((a.shouldThrow ?? !0) && !o),
          `Could not find ${a.from ? `an active match from "${a.from}"` : 'a nearest match!'}`,
        ),
        o !== void 0)
      )
        return a.select ? a.select(o) : o
    },
    structuralSharing: a.structuralSharing,
  })
}
function Lp(a) {
  return ya({
    from: a.from,
    strict: a.strict,
    structuralSharing: a.structuralSharing,
    select: (u) => (a.select ? a.select(u.loaderData) : u.loaderData),
  })
}
function qp(a) {
  const { select: u, ...i } = a
  return ya({ ...i, select: (r) => (u ? u(r.loaderDeps) : r.loaderDeps) })
}
function jp(a) {
  return ya({
    from: a.from,
    strict: a.strict,
    shouldThrow: a.shouldThrow,
    structuralSharing: a.structuralSharing,
    select: (u) => (a.select ? a.select(u.params) : u.params),
  })
}
function Hp(a) {
  return ya({
    from: a.from,
    strict: a.strict,
    shouldThrow: a.shouldThrow,
    structuralSharing: a.structuralSharing,
    select: (u) => (a.select ? a.select(u.search) : u.search),
  })
}
function je(a) {
  return !!a?.isNotFound
}
function Bp(a) {
  const u = ce({ select: (i) => `not-found-${i.location.pathname}-${i.status}` })
  return k.jsx(oo, {
    getResetKey: () => u,
    onCatch: (i, r) => {
      var o
      if (je(i)) (o = a.onCatch) == null || o.call(a, i, r)
      else throw i
    },
    errorComponent: ({ error: i }) => {
      var r
      if (je(i)) return (r = a.fallback) == null ? void 0 : r.call(a, i)
      throw i
    },
    children: a.children,
  })
}
function Qp() {
  return k.jsx('p', { children: 'Not Found' })
}
function Gp(a) {
  const { navigate: u } = We()
  return ft.useCallback((i) => u({ from: a?.from, ...i }), [a?.from, u])
}
let ky = class {
  constructor(u) {
    ;(this.init = (i) => {
      var r, o
      this.originalIndex = i.originalIndex
      const f = this.options,
        d = !f?.path && !f?.id
      ;(this.parentRoute = (o = (r = this.options).getParentRoute) == null ? void 0 : o.call(r)),
        d ? (this._path = he) : Ve(this.parentRoute)
      let y = d ? he : f.path
      y && y !== '/' && (y = ro(y))
      const m = f?.id || y
      let v = d ? he : pn([this.parentRoute.id === he ? '' : this.parentRoute.id, m])
      y === he && (y = '/'), v !== he && (v = pn(['/', v]))
      const g = v === he ? '/' : pn([this.parentRoute.fullPath, y])
      ;(this._path = y),
        (this._id = v),
        (this._fullPath = g),
        (this._to = g),
        (this._ssr = f?.ssr ?? i.defaultSsr ?? !0)
    }),
      (this.addChildren = (i) => this._addFileChildren(i)),
      (this._addFileChildren = (i) => (
        Array.isArray(i) && (this.children = i),
        typeof i == 'object' && i !== null && (this.children = Object.values(i)),
        this
      )),
      (this._addFileTypes = () => this),
      (this.updateLoader = (i) => (Object.assign(this.options, i), this)),
      (this.update = (i) => (Object.assign(this.options, i), this)),
      (this.lazy = (i) => ((this.lazyFn = i), this)),
      (this.useMatch = (i) =>
        ya({ select: i?.select, from: this.id, structuralSharing: i?.structuralSharing })),
      (this.useRouteContext = (i) =>
        ya({ ...i, from: this.id, select: (r) => (i?.select ? i.select(r.context) : r.context) })),
      (this.useSearch = (i) =>
        Hp({ select: i?.select, structuralSharing: i?.structuralSharing, from: this.id })),
      (this.useParams = (i) =>
        jp({ select: i?.select, structuralSharing: i?.structuralSharing, from: this.id })),
      (this.useLoaderDeps = (i) => qp({ ...i, from: this.id })),
      (this.useLoaderData = (i) => Lp({ ...i, from: this.id })),
      (this.useNavigate = () => Gp({ from: this.fullPath })),
      (this.options = u || {}),
      (this.isRoot = !u?.getParentRoute),
      Ve(!(u?.id && u?.path)),
      (this.$$typeof = Symbol.for('react.memo'))
  }
  get to() {
    return this._to
  }
  get id() {
    return this._id
  }
  get path() {
    return this._path
  }
  get fullPath() {
    return this._fullPath
  }
  get ssr() {
    return this._ssr
  }
}
function Yp(a) {
  return new ky(a)
}
function Vp() {
  return (a) => Kp(a)
}
class Xp extends ky {
  constructor(u) {
    super(u)
  }
}
function Kp(a) {
  return new Xp(a)
}
function Zp(a) {
  return new kp(a, { silent: !0 }).createRoute
}
class kp {
  constructor(u, i) {
    ;(this.path = u),
      (this.createRoute = (r) => {
        this.silent
        const o = Yp(r)
        return (o.isRoot = !1), o
      }),
      (this.silent = i?.silent)
  }
}
function gl(a) {
  return !!a?.isRedirect
}
function Qc(a) {
  return !!a?.isRedirect && a.href
}
function Iu(a) {
  return k.jsx(k.Fragment, { children: a.children })
}
function Fy(a, u, i) {
  return u.options.notFoundComponent
    ? k.jsx(u.options.notFoundComponent, { data: i })
    : a.options.defaultNotFoundComponent
    ? k.jsx(a.options.defaultNotFoundComponent, { data: i })
    : k.jsx(Qp, {})
}
var Gc, _y
function Fp() {
  if (_y) return Gc
  _y = 1
  const a = {},
    u = a.hasOwnProperty,
    i = (L, R) => {
      for (const j in L) u.call(L, j) && R(j, L[j])
    },
    r = (L, R) => (
      R &&
        i(R, (j, Y) => {
          L[j] = Y
        }),
      L
    ),
    o = (L, R) => {
      const j = L.length
      let Y = -1
      for (; ++Y < j; ) R(L[Y])
    },
    f = (L) => '\\u' + ('0000' + L).slice(-4),
    d = (L, R) => {
      let j = L.toString(16)
      return R ? j : j.toUpperCase()
    },
    y = a.toString,
    m = Array.isArray,
    v = (L) => typeof Buffer == 'function' && Buffer.isBuffer(L),
    g = (L) => y.call(L) == '[object Object]',
    S = (L) => typeof L == 'string' || y.call(L) == '[object String]',
    T = (L) => typeof L == 'number' || y.call(L) == '[object Number]',
    D = (L) => typeof L == 'bigint',
    w = (L) => typeof L == 'function',
    U = (L) => y.call(L) == '[object Map]',
    Z = (L) => y.call(L) == '[object Set]',
    G = { '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '	': '\\t' },
    X = /[\\\b\f\n\r\t]/,
    nt = /[0-9]/,
    yt = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/,
    Q = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g,
    $ = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g,
    ct = (L, R) => {
      const j = () => {
          ;(P = B), ++R.indentLevel, (B = R.indent.repeat(R.indentLevel))
        },
        Y = {
          escapeEverything: !1,
          minimal: !1,
          isScriptContext: !1,
          quotes: 'single',
          wrap: !1,
          es6: !1,
          json: !1,
          compact: !0,
          lowercaseHex: !1,
          numbers: 'decimal',
          indent: '	',
          indentLevel: 0,
          __inline1__: !1,
          __inline2__: !1,
        },
        K = R && R.json
      K && ((Y.quotes = 'double'), (Y.wrap = !0)),
        (R = r(Y, R)),
        R.quotes != 'single' &&
          R.quotes != 'double' &&
          R.quotes != 'backtick' &&
          (R.quotes = 'single')
      const lt = R.quotes == 'double' ? '"' : R.quotes == 'backtick' ? '`' : "'",
        vt = R.compact,
        rt = R.lowercaseHex
      let B = R.indent.repeat(R.indentLevel),
        P = ''
      const tt = R.__inline1__,
        dt = R.__inline2__,
        _ = vt
          ? ''
          : `
`
      let N,
        F = !0
      const J = R.numbers == 'binary',
        V = R.numbers == 'octal',
        ut = R.numbers == 'decimal',
        I = R.numbers == 'hexadecimal'
      if ((K && L && w(L.toJSON) && (L = L.toJSON()), !S(L))) {
        if (U(L))
          return L.size == 0
            ? 'new Map()'
            : (vt || ((R.__inline1__ = !0), (R.__inline2__ = !1)),
              'new Map(' + ct(Array.from(L), R) + ')')
        if (Z(L)) return L.size == 0 ? 'new Set()' : 'new Set(' + ct(Array.from(L), R) + ')'
        if (v(L))
          return L.length == 0 ? 'Buffer.from([])' : 'Buffer.from(' + ct(Array.from(L), R) + ')'
        if (m(L))
          return (
            (N = []),
            (R.wrap = !0),
            tt && ((R.__inline1__ = !1), (R.__inline2__ = !0)),
            dt || j(),
            o(L, (it) => {
              ;(F = !1), dt && (R.__inline2__ = !1), N.push((vt || dt ? '' : B) + ct(it, R))
            }),
            F
              ? '[]'
              : dt
              ? '[' + N.join(', ') + ']'
              : '[' + _ + N.join(',' + _) + _ + (vt ? '' : P) + ']'
          )
        if (T(L) || D(L)) {
          if (K) return JSON.stringify(Number(L))
          let it
          if (ut) it = String(L)
          else if (I) {
            let _t = L.toString(16)
            rt || (_t = _t.toUpperCase()), (it = '0x' + _t)
          } else J ? (it = '0b' + L.toString(2)) : V && (it = '0o' + L.toString(8))
          return D(L) ? it + 'n' : it
        } else
          return D(L)
            ? K
              ? JSON.stringify(Number(L))
              : L + 'n'
            : g(L)
            ? ((N = []),
              (R.wrap = !0),
              j(),
              i(L, (it, _t) => {
                ;(F = !1), N.push((vt ? '' : B) + ct(it, R) + ':' + (vt ? '' : ' ') + ct(_t, R))
              }),
              F ? '{}' : '{' + _ + N.join(',' + _) + _ + (vt ? '' : P) + '}')
            : K
            ? JSON.stringify(L) || 'null'
            : String(L)
      }
      const Ct = R.escapeEverything ? Q : $
      return (
        (N = L.replace(Ct, (it, _t, Rt, kt, Xe, ie) => {
          if (_t) {
            if (R.minimal) return _t
            const ye = _t.charCodeAt(0),
              Bt = _t.charCodeAt(1)
            if (R.es6) {
              const Fn = (ye - 55296) * 1024 + Bt - 56320 + 65536
              return '\\u{' + d(Fn, rt) + '}'
            }
            return f(d(ye, rt)) + f(d(Bt, rt))
          }
          if (Rt) return f(d(Rt.charCodeAt(0), rt))
          if (it == '\0' && !K && !nt.test(ie.charAt(Xe + 1))) return '\\0'
          if (kt) return kt == lt || R.escapeEverything ? '\\' + kt : kt
          if (X.test(it)) return G[it]
          if (R.minimal && !yt.test(it)) return it
          const Nt = d(it.charCodeAt(0), rt)
          return K || Nt.length > 2 ? f(Nt) : '\\x' + ('00' + Nt).slice(-2)
        })),
        lt == '`' && (N = N.replace(/\$\{/g, '\\${')),
        R.isScriptContext &&
          (N = N.replace(/<\/(script|style)/gi, '<\\/$1').replace(
            /<!--/g,
            K ? '\\u003C!--' : '\\x3C!--',
          )),
        R.wrap && (N = lt + N + lt),
        N
      )
    }
  return (ct.version = '3.0.2'), (Gc = ct), Gc
}
Fp()
function Jp({ children: a, log: u }) {
  return typeof document < 'u'
    ? null
    : k.jsx('script', {
        className: 'tsr-once',
        dangerouslySetInnerHTML: {
          __html: [
            a,
            '',
            'if (typeof __TSR_SSR__ !== "undefined") __TSR_SSR__.cleanScripts()',
          ].filter(Boolean).join(`
`),
        },
      })
}
const as = 'tsr-scroll-restoration-v1_3'
let Jy = !1
try {
  Jy = typeof window < 'u' && typeof window.sessionStorage == 'object'
} catch {}
const Pp = (a, u) => {
    let i
    return (...r) => {
      i ||
        (i = setTimeout(() => {
          a(...r), (i = null)
        }, u))
    }
  },
  ca = Jy
    ? {
        state: JSON.parse(window.sessionStorage.getItem(as) || 'null') || {},
        set: (u) => (
          (ca.state = gi(u, ca.state) || ca.state),
          window.sessionStorage.setItem(as, JSON.stringify(ca.state))
        ),
      }
    : void 0,
  to = (a) => a.state.key || a.href
function $p(a) {
  const u = []
  let i
  for (; (i = a.parentNode); )
    u.unshift(`${a.tagName}:nth-child(${[].indexOf.call(i.children, a) + 1})`), (a = i)
  return `${u.join(' > ')}`.toLowerCase()
}
let is = !1
function Py(a, u, i, r, o, f) {
  var d
  let y
  try {
    y = JSON.parse(sessionStorage.getItem(u) || '{}')
  } catch (g) {
    console.error(g)
    return
  }
  const m = i || ((d = window.history.state) == null ? void 0 : d.key),
    v = y[m]
  ;(is = !0),
    (() => {
      if (o && v) {
        for (const S in v) {
          const T = v[S]
          if (S === 'window') window.scrollTo({ top: T.scrollY, left: T.scrollX, behavior: r })
          else if (S) {
            const D = document.querySelector(S)
            D && ((D.scrollLeft = T.scrollX), (D.scrollTop = T.scrollY))
          }
        }
        return
      }
      const g = a.location.hash.split('#')[1]
      if (g) {
        const S = (window.history.state || {}).__hashScrollIntoViewOptions ?? !0
        if (S) {
          const T = document.getElementById(g)
          T && T.scrollIntoView(S)
        }
        return
      }
      ;['window', ...(f?.filter((S) => S !== 'window') ?? [])].forEach((S) => {
        const T = S === 'window' ? window : document.querySelector(S)
        T && T.scrollTo({ top: 0, left: 0, behavior: r })
      })
    })(),
    (is = !1)
}
function Wp(a, u) {
  if (
    ((a.options.scrollRestoration ?? !1) && (a.isScrollRestoring = !0),
    typeof document > 'u' || a.isScrollRestorationSetup)
  )
    return
  ;(a.isScrollRestorationSetup = !0), (is = !1)
  const r = a.options.getScrollRestorationKey || to
  window.history.scrollRestoration = 'manual'
  const o = (f) => {
    if (is || !a.isScrollRestoring) return
    let d = ''
    if (f.target === document || f.target === window) d = 'window'
    else {
      const m = f.target.getAttribute('data-scroll-restoration-id')
      m ? (d = `[data-scroll-restoration-id="${m}"]`) : (d = $p(f.target))
    }
    const y = r(a.state.location)
    ca.set((m) => {
      const v = (m[y] = m[y] || {}),
        g = (v[d] = v[d] || {})
      if (d === 'window') (g.scrollX = window.scrollX || 0), (g.scrollY = window.scrollY || 0)
      else if (d) {
        const S = document.querySelector(d)
        S && ((g.scrollX = S.scrollLeft || 0), (g.scrollY = S.scrollTop || 0))
      }
      return m
    })
  }
  typeof document < 'u' && document.addEventListener('scroll', Pp(o, 100), !0),
    a.subscribe('onRendered', (f) => {
      const d = r(f.toLocation)
      if (!a.resetNextScroll) {
        a.resetNextScroll = !0
        return
      }
      Py(
        a.history,
        as,
        d,
        a.options.scrollRestorationBehavior,
        a.isScrollRestoring,
        a.options.scrollToTopSelectors,
      ),
        a.isScrollRestoring && ca.set((y) => ((y[d] = y[d] || {}), y))
    })
}
function Ip() {
  const a = We(),
    i = (a.options.getScrollRestorationKey || to)(a.latestLocation),
    r = i !== to(a.latestLocation) ? i : null
  return !a.isScrollRestoring || !a.isServer
    ? null
    : k.jsx(Jp, {
        children: `(${Py.toString()})(${JSON.stringify(as)},${JSON.stringify(r)}, undefined, true)`,
        log: !1,
      })
}
const $y = ft.memo(function ({ matchId: u }) {
  var i, r
  const o = We(),
    f = ce({
      select: (G) => {
        var X
        return (X = G.matches.find((nt) => nt.id === u)) == null ? void 0 : X.routeId
      },
    })
  Ve(f)
  const d = o.routesById[f],
    y = d.options.pendingComponent ?? o.options.defaultPendingComponent,
    m = y ? k.jsx(y, {}) : null,
    v = d.options.errorComponent ?? o.options.defaultErrorComponent,
    g = d.options.onCatch ?? o.options.defaultOnCatch,
    S = d.isRoot
      ? d.options.notFoundComponent ??
        ((i = o.options.notFoundRoute) == null ? void 0 : i.options.component)
      : d.options.notFoundComponent,
    T =
      (!d.isRoot || d.options.wrapInSuspense) &&
      (d.options.wrapInSuspense ??
        y ??
        ((r = d.options.errorComponent) == null ? void 0 : r.preload))
        ? ft.Suspense
        : Iu,
    D = v ? oo : Iu,
    w = S ? Bp : Iu,
    U = ce({ select: (G) => G.loadedAt }),
    Z = ce({
      select: (G) => {
        var X
        const nt = G.matches.findIndex((yt) => yt.id === u)
        return (X = G.matches[nt - 1]) == null ? void 0 : X.routeId
      },
    })
  return k.jsxs(k.Fragment, {
    children: [
      k.jsx(vs.Provider, {
        value: u,
        children: k.jsx(T, {
          fallback: m,
          children: k.jsx(D, {
            getResetKey: () => U,
            errorComponent: v || ms,
            onCatch: (G, X) => {
              if (je(G)) throw G
              g?.(G, X)
            },
            children: k.jsx(w, {
              fallback: (G) => {
                if (!S || (G.routeId && G.routeId !== f) || (!G.routeId && !d.isRoot)) throw G
                return ft.createElement(S, G)
              },
              children: k.jsx(eg, { matchId: u }),
            }),
          }),
        }),
      }),
      Z === he && o.options.scrollRestoration
        ? k.jsxs(k.Fragment, { children: [k.jsx(tg, {}), k.jsx(Ip, {})] })
        : null,
    ],
  })
})
function tg() {
  var a
  const u = We(),
    i = ft.useRef(void 0)
  return k.jsx(
    'script',
    {
      suppressHydrationWarning: !0,
      ref: (r) => {
        var o
        r &&
          (i.current === void 0 ||
            i.current.href !== ((o = u.state.resolvedLocation) == null ? void 0 : o.href)) &&
          (u.emit({ type: 'onRendered', ...oa(u.state) }), (i.current = u.state.resolvedLocation))
      },
    },
    (a = u.state.resolvedLocation) == null ? void 0 : a.state.key,
  )
}
const eg = ft.memo(function ({ matchId: u }) {
    var i, r, o
    const f = We(),
      {
        match: d,
        key: y,
        routeId: m,
      } = ce({
        select: (T) => {
          const D = T.matches.findIndex((nt) => nt.id === u),
            w = T.matches[D],
            U = w.routeId,
            Z = f.routesById[U].options.remountDeps ?? f.options.defaultRemountDeps,
            G = Z?.({
              routeId: U,
              loaderDeps: w.loaderDeps,
              params: w._strictParams,
              search: w._strictSearch,
            })
          return {
            key: G ? JSON.stringify(G) : void 0,
            routeId: U,
            match: $c(w, ['id', 'status', 'error']),
          }
        },
        structuralSharing: !0,
      }),
      v = f.routesById[m],
      g = ft.useMemo(() => {
        const T = v.options.component ?? f.options.defaultComponent
        return T ? k.jsx(T, {}, y) : k.jsx(fo, {})
      }, [y, v.options.component, f.options.defaultComponent]),
      S = (v.options.errorComponent ?? f.options.defaultErrorComponent) || ms
    if (d.status === 'notFound') return Ve(je(d.error)), Fy(f, v, d.error)
    if (d.status === 'redirected')
      throw (Ve(gl(d.error)), (i = f.getMatch(d.id)) == null ? void 0 : i.loadPromise)
    if (d.status === 'error') {
      if (f.isServer)
        return k.jsx(S, { error: d.error, reset: void 0, info: { componentStack: '' } })
      throw d.error
    }
    if (d.status === 'pending') {
      const T = v.options.pendingMinMs ?? f.options.defaultPendingMinMs
      if (T && !((r = f.getMatch(d.id)) != null && r.minPendingPromise) && !f.isServer) {
        const D = ua()
        Promise.resolve().then(() => {
          f.updateMatch(d.id, (w) => ({ ...w, minPendingPromise: D }))
        }),
          setTimeout(() => {
            D.resolve(), f.updateMatch(d.id, (w) => ({ ...w, minPendingPromise: void 0 }))
          }, T)
      }
      throw (o = f.getMatch(d.id)) == null ? void 0 : o.loadPromise
    }
    return g
  }),
  fo = ft.memo(function () {
    const u = We(),
      i = ft.useContext(vs),
      r = ce({
        select: (v) => {
          var g
          return (g = v.matches.find((S) => S.id === i)) == null ? void 0 : g.routeId
        },
      }),
      o = u.routesById[r],
      f = ce({
        select: (v) => {
          const S = v.matches.find((T) => T.id === i)
          return Ve(S), S.globalNotFound
        },
      }),
      d = ce({
        select: (v) => {
          var g
          const S = v.matches,
            T = S.findIndex((D) => D.id === i)
          return (g = S[T + 1]) == null ? void 0 : g.id
        },
      })
    if (f) return Fy(u, o, void 0)
    if (!d) return null
    const y = k.jsx($y, { matchId: d }),
      m = u.options.defaultPendingComponent ? k.jsx(u.options.defaultPendingComponent, {}) : null
    return i === he ? k.jsx(ft.Suspense, { fallback: m, children: y }) : y
  })
function ng(a) {
  return typeof a?.message != 'string'
    ? !1
    : a.message.startsWith('Failed to fetch dynamically imported module') ||
        a.message.startsWith('error loading dynamically imported module') ||
        a.message.startsWith('Importing a module script failed')
}
function lg({ children: a, fallback: u = null }) {
  return ig() ? k.jsx(k.Fragment, { children: a }) : k.jsx(k.Fragment, { children: u })
}
function ag() {
  return () => {}
}
function ig() {
  return ft.useSyncExternalStore(
    ag,
    () => !0,
    () => !1,
  )
}
function ug(a, u, i) {
  let r, o, f, d
  const y = () =>
      typeof document > 'u' && i?.() === !1
        ? ((o = () => null), Promise.resolve())
        : (r ||
            (r = a()
              .then((v) => {
                ;(r = void 0), (o = v[u])
              })
              .catch((v) => {
                if (
                  ((f = v),
                  ng(f) && f instanceof Error && typeof window < 'u' && typeof sessionStorage < 'u')
                ) {
                  const g = `tanstack_router_reload:${f.message}`
                  sessionStorage.getItem(g) || (sessionStorage.setItem(g, '1'), (d = !0))
                }
              })),
          r),
    m = function (g) {
      if (d) throw (window.location.reload(), new Promise(() => {}))
      if (f) throw f
      if (!o) throw y()
      return i?.() === !1
        ? k.jsx(lg, { fallback: k.jsx(fo, {}), children: ft.createElement(o, g) })
        : ft.createElement(o, g)
    }
  return (m.preload = y), m
}
const Ju = typeof window < 'u' ? ft.useLayoutEffect : ft.useEffect
function Yc(a) {
  const u = ft.useRef({ value: a, prev: null }),
    i = u.current.value
  return a !== i && (u.current = { value: a, prev: i }), u.current.prev
}
function sg() {
  const a = We(),
    u = ft.useRef({ router: a, mounted: !1 }),
    i = ce({ select: ({ isLoading: S }) => S }),
    [r, o] = ft.useState(!1),
    f = ce({ select: (S) => S.matches.some((T) => T.status === 'pending'), structuralSharing: !0 }),
    d = Yc(i),
    y = i || r || f,
    m = Yc(y),
    v = i || f,
    g = Yc(v)
  return (
    a.isServer ||
      (a.startTransition = (S) => {
        o(!0),
          ft.startTransition(() => {
            S(), o(!1)
          })
      }),
    ft.useEffect(() => {
      const S = a.history.subscribe(a.load),
        T = a.buildLocation({
          to: a.latestLocation.pathname,
          search: !0,
          params: !0,
          hash: !0,
          state: !0,
          _includeValidateSearch: !0,
        })
      return (
        Sl(a.latestLocation.href) !== Sl(T.href) && a.commitLocation({ ...T, replace: !0 }),
        () => {
          S()
        }
      )
    }, [a, a.history]),
    Ju(() => {
      if ((typeof window < 'u' && a.clientSsr) || (u.current.router === a && u.current.mounted))
        return
      ;(u.current = { router: a, mounted: !0 }),
        (async () => {
          try {
            await a.load()
          } catch (T) {
            console.error(T)
          }
        })()
    }, [a]),
    Ju(() => {
      d && !i && a.emit({ type: 'onLoad', ...oa(a.state) })
    }, [d, a, i]),
    Ju(() => {
      g && !v && a.emit({ type: 'onBeforeRouteMount', ...oa(a.state) })
    }, [v, g, a]),
    Ju(() => {
      m &&
        !y &&
        (a.emit({ type: 'onResolved', ...oa(a.state) }),
        a.__store.setState((S) => ({ ...S, status: 'idle', resolvedLocation: S.location })))
    }, [y, m, a]),
    null
  )
}
function rg() {
  const a = We(),
    u = a.options.defaultPendingComponent ? k.jsx(a.options.defaultPendingComponent, {}) : null,
    i = a.isServer || (typeof document < 'u' && a.clientSsr) ? Iu : ft.Suspense,
    r = k.jsxs(i, { fallback: u, children: [k.jsx(sg, {}), k.jsx(cg, {})] })
  return a.options.InnerWrap ? k.jsx(a.options.InnerWrap, { children: r }) : r
}
function cg() {
  const a = ce({
      select: (i) => {
        var r
        return (r = i.matches[0]) == null ? void 0 : r.id
      },
    }),
    u = ce({ select: (i) => i.loadedAt })
  return k.jsx(vs.Provider, {
    value: a,
    children: k.jsx(oo, {
      getResetKey: () => u,
      errorComponent: ms,
      onCatch: (i) => {
        i.message || i.toString()
      },
      children: a ? k.jsx($y, { matchId: a }) : null,
    }),
  })
}
const Wy = ['component', 'errorComponent', 'pendingComponent', 'notFoundComponent']
function og(a) {
  var u
  for (const i of Wy) if ((u = a.options[i]) != null && u.preload) return !0
  return !1
}
function Vc(a, u) {
  if (a == null) return {}
  if ('~standard' in a) {
    const i = a['~standard'].validate(u)
    if (i instanceof Promise) throw new us('Async validation not supported')
    if (i.issues) throw new us(JSON.stringify(i.issues, void 0, 2), { cause: i })
    return i.value
  }
  return 'parse' in a ? a.parse(u) : typeof a == 'function' ? a(u) : {}
}
function fg(a) {
  return new dg(a)
}
class dg {
  constructor(u) {
    ;(this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`),
      (this.resetNextScroll = !0),
      (this.shouldViewTransition = void 0),
      (this.isViewTransitionTypesSupported = void 0),
      (this.subscribers = new Set()),
      (this.isScrollRestoring = !1),
      (this.isScrollRestorationSetup = !1),
      (this.startTransition = (i) => i()),
      (this.update = (i) => {
        var r
        i.notFoundRoute &&
          console.warn(
            'The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.',
          )
        const o = this.options
        ;(this.options = { ...this.options, ...i }),
          (this.isServer = this.options.isServer ?? typeof document > 'u'),
          (this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters
            ? new Map(
                this.options.pathParamsAllowedCharacters.map((f) => [encodeURIComponent(f), f]),
              )
            : void 0),
          (!this.basepath || (i.basepath && i.basepath !== o.basepath)) &&
            (i.basepath === void 0 || i.basepath === '' || i.basepath === '/'
              ? (this.basepath = '/')
              : (this.basepath = `/${dp(i.basepath)}`)),
          (!this.history || (this.options.history && this.options.history !== this.history)) &&
            ((this.history =
              this.options.history ??
              (this.isServer ? Op({ initialEntries: [this.basepath || '/'] }) : Ep())),
            (this.latestLocation = this.parseLocation())),
          this.options.routeTree !== this.routeTree &&
            ((this.routeTree = this.options.routeTree), this.buildRouteTree()),
          this.__store ||
            ((this.__store = new Ic(yg(this.latestLocation), {
              onUpdate: () => {
                this.__store.state = {
                  ...this.state,
                  cachedMatches: this.state.cachedMatches.filter(
                    (f) => !['redirected'].includes(f.status),
                  ),
                }
              },
            })),
            Wp(this)),
          typeof window < 'u' &&
            'CSS' in window &&
            typeof ((r = window.CSS) == null ? void 0 : r.supports) == 'function' &&
            (this.isViewTransitionTypesSupported = window.CSS.supports(
              'selector(:active-view-transition-type(a)',
            ))
      }),
      (this.buildRouteTree = () => {
        ;(this.routesById = {}), (this.routesByPath = {})
        const i = this.options.notFoundRoute
        i &&
          (i.init({ originalIndex: 99999999999, defaultSsr: this.options.defaultSsr }),
          (this.routesById[i.id] = i))
        const r = (d) => {
          d.forEach((y, m) => {
            y.init({ originalIndex: m, defaultSsr: this.options.defaultSsr })
            const v = this.routesById[y.id]
            if (
              (Ve(!v, `Duplicate routes found with id: ${String(y.id)}`),
              (this.routesById[y.id] = y),
              !y.isRoot && y.path)
            ) {
              const S = Sl(y.fullPath)
              ;(!this.routesByPath[S] || y.fullPath.endsWith('/')) && (this.routesByPath[S] = y)
            }
            const g = y.children
            g?.length && r(g)
          })
        }
        r([this.routeTree])
        const o = []
        Object.values(this.routesById).forEach((d, y) => {
          var m
          if (d.isRoot || !d.path) return
          const v = ro(d.fullPath),
            g = ha(v)
          for (; g.length > 1 && ((m = g[0]) == null ? void 0 : m.value) === '/'; ) g.shift()
          const S = g.map((T) =>
            T.value === '/' ? 0.75 : T.type === 'param' ? 0.5 : T.type === 'wildcard' ? 0.25 : 1,
          )
          o.push({ child: d, trimmed: v, parsed: g, index: y, scores: S })
        }),
          (this.flatRoutes = o
            .sort((d, y) => {
              const m = Math.min(d.scores.length, y.scores.length)
              for (let v = 0; v < m; v++)
                if (d.scores[v] !== y.scores[v]) return y.scores[v] - d.scores[v]
              if (d.scores.length !== y.scores.length) return y.scores.length - d.scores.length
              for (let v = 0; v < m; v++)
                if (d.parsed[v].value !== y.parsed[v].value)
                  return d.parsed[v].value > y.parsed[v].value ? 1 : -1
              return d.index - y.index
            })
            .map((d, y) => ((d.child.rank = y), d.child)))
      }),
      (this.subscribe = (i, r) => {
        const o = { eventType: i, fn: r }
        return (
          this.subscribers.add(o),
          () => {
            this.subscribers.delete(o)
          }
        )
      }),
      (this.emit = (i) => {
        this.subscribers.forEach((r) => {
          r.eventType === i.type && r.fn(i)
        })
      }),
      (this.parseLocation = (i, r) => {
        const o = ({ pathname: m, search: v, hash: g, state: S }) => {
            const T = this.options.parseSearch(v),
              D = this.options.stringifySearch(T)
            return {
              pathname: m,
              searchStr: D,
              search: qe(i?.search, T),
              hash: g.split('#').reverse()[0] ?? '',
              href: `${m}${D}${g}`,
              state: qe(i?.state, S),
            }
          },
          f = o(r ?? this.history.location),
          { __tempLocation: d, __tempKey: y } = f.state
        if (d && (!y || y === this.tempLocationKey)) {
          const m = o(d)
          return (
            (m.state.key = f.state.key), delete m.state.__tempLocation, { ...m, maskedLocation: f }
          )
        }
        return f
      }),
      (this.resolvePathWithBase = (i, r) =>
        hp({
          basepath: this.basepath,
          base: i,
          to: ys(r),
          trailingSlash: this.options.trailingSlash,
          caseSensitive: this.options.caseSensitive,
        })),
      (this.matchRoutes = (i, r, o) =>
        typeof i == 'string'
          ? this.matchRoutesInternal({ pathname: i, search: r }, o)
          : this.matchRoutesInternal(i, r)),
      (this.getMatchedRoutes = (i, r) => {
        let o = {}
        const f = Sl(i.pathname),
          d = (g) =>
            ku(this.basepath, f, {
              to: g.fullPath,
              caseSensitive: g.options.caseSensitive ?? this.options.caseSensitive,
              fuzzy: !0,
            })
        let y = r?.to !== void 0 ? this.routesByPath[r.to] : void 0
        y
          ? (o = d(y))
          : (y = this.flatRoutes.find((g) => {
              const S = d(g)
              return S ? ((o = S), !0) : !1
            }))
        let m = y || this.routesById[he]
        const v = [m]
        for (; m.parentRoute; ) (m = m.parentRoute), v.unshift(m)
        return { matchedRoutes: v, routeParams: o, foundRoute: y }
      }),
      (this.cancelMatch = (i) => {
        const r = this.getMatch(i)
        r && (r.abortController.abort(), clearTimeout(r.pendingTimeout))
      }),
      (this.cancelMatches = () => {
        var i
        ;(i = this.state.pendingMatches) == null ||
          i.forEach((r) => {
            this.cancelMatch(r.id)
          })
      }),
      (this.buildLocation = (i) => {
        const r = (f = {}, d) => {
            var y, m, v, g, S, T, D
            const w = f._fromLocation
                ? this.matchRoutes(f._fromLocation, { _buildLocation: !0 })
                : this.state.matches,
              U =
                f.from != null
                  ? w.find((K) =>
                      ku(this.basepath, Sl(K.pathname), {
                        to: f.from,
                        caseSensitive: !1,
                        fuzzy: !1,
                      }),
                    )
                  : void 0,
              Z = U?.pathname || this.latestLocation.pathname
            Ve(f.from == null || U != null, 'Could not find match for from: ' + f.from)
            const G =
                (y = this.state.pendingMatches) != null && y.length
                  ? (m = ra(this.state.pendingMatches)) == null
                    ? void 0
                    : m.search
                  : ((v = ra(w)) == null ? void 0 : v.search) || this.latestLocation.search,
              X = d?.matchedRoutes.filter((K) => w.find((lt) => lt.routeId === K.id))
            let nt
            if (f.to) {
              const K =
                U?.fullPath ||
                ((g = ra(w)) == null ? void 0 : g.fullPath) ||
                this.latestLocation.pathname
              nt = this.resolvePathWithBase(K, `${f.to}`)
            } else {
              const K =
                this.routesById[
                  (S = X?.find((lt) => {
                    const vt = Zu({
                      path: lt.fullPath,
                      params: d?.routeParams ?? {},
                      decodeCharMap: this.pathParamsDecodeCharMap,
                    }).interpolatedPath
                    return pn([this.basepath, vt]) === Z
                  })) == null
                    ? void 0
                    : S.id
                ]
              nt = this.resolvePathWithBase(Z, K?.to ?? Z)
            }
            const yt = { ...((T = ra(w)) == null ? void 0 : T.params) }
            let Q = (f.params ?? !0) === !0 ? yt : { ...yt, ...gi(f.params, yt) }
            Object.keys(Q).length > 0 &&
              d?.matchedRoutes
                .map((K) => {
                  var lt
                  return (
                    ((lt = K.options.params) == null ? void 0 : lt.stringify) ??
                    K.options.stringifyParams
                  )
                })
                .filter(Boolean)
                .forEach((K) => {
                  Q = { ...Q, ...K(Q) }
                }),
              (nt = Zu({
                path: nt,
                params: Q ?? {},
                leaveWildcards: !1,
                leaveParams: i.leaveParams,
                decodeCharMap: this.pathParamsDecodeCharMap,
              }).interpolatedPath)
            let $ = G
            if (i._includeValidateSearch && (D = this.options.search) != null && D.strict) {
              let K = {}
              d?.matchedRoutes.forEach((lt) => {
                try {
                  lt.options.validateSearch &&
                    (K = { ...K, ...(Vc(lt.options.validateSearch, { ...K, ...$ }) ?? {}) })
                } catch {}
              }),
                ($ = K)
            }
            ;($ = ((K) => {
              const lt =
                  d?.matchedRoutes.reduce((B, P) => {
                    var tt
                    const dt = []
                    if ('search' in P.options)
                      (tt = P.options.search) != null &&
                        tt.middlewares &&
                        dt.push(...P.options.search.middlewares)
                    else if (P.options.preSearchFilters || P.options.postSearchFilters) {
                      const _ = ({ search: N, next: F }) => {
                        let J = N
                        'preSearchFilters' in P.options &&
                          P.options.preSearchFilters &&
                          (J = P.options.preSearchFilters.reduce((ut, I) => I(ut), N))
                        const V = F(J)
                        return 'postSearchFilters' in P.options && P.options.postSearchFilters
                          ? P.options.postSearchFilters.reduce((ut, I) => I(ut), V)
                          : V
                      }
                      dt.push(_)
                    }
                    if (i._includeValidateSearch && P.options.validateSearch) {
                      const _ = ({ search: N, next: F }) => {
                        const J = F(N)
                        try {
                          return { ...J, ...(Vc(P.options.validateSearch, J) ?? {}) }
                        } catch {
                          return J
                        }
                      }
                      dt.push(_)
                    }
                    return B.concat(dt)
                  }, []) ?? [],
                vt = ({ search: B }) => (f.search ? (f.search === !0 ? B : gi(f.search, B)) : {})
              lt.push(vt)
              const rt = (B, P) => {
                if (B >= lt.length) return P
                const tt = lt[B]
                return tt({ search: P, next: (_) => rt(B + 1, _) })
              }
              return rt(0, K)
            })($)),
              ($ = qe(G, $))
            const L = this.options.stringifySearch($),
              R =
                f.hash === !0
                  ? this.latestLocation.hash
                  : f.hash
                  ? gi(f.hash, this.latestLocation.hash)
                  : void 0,
              j = R ? `#${R}` : ''
            let Y =
              f.state === !0
                ? this.latestLocation.state
                : f.state
                ? gi(f.state, this.latestLocation.state)
                : {}
            return (
              (Y = qe(this.latestLocation.state, Y)),
              {
                pathname: nt,
                search: $,
                searchStr: L,
                state: Y,
                hash: R ?? '',
                href: `${nt}${L}${j}`,
                unmaskOnReload: f.unmaskOnReload,
              }
            )
          },
          o = (f = {}, d) => {
            var y
            const m = r(f)
            let v = d ? r(d) : void 0
            if (!v) {
              let T = {}
              const D =
                (y = this.options.routeMasks) == null
                  ? void 0
                  : y.find((w) => {
                      const U = ku(this.basepath, m.pathname, {
                        to: w.from,
                        caseSensitive: !1,
                        fuzzy: !1,
                      })
                      return U ? ((T = U), !0) : !1
                    })
              if (D) {
                const { from: w, ...U } = D
                ;(d = { ...$c(i, ['from']), ...U, params: T }), (v = r(d))
              }
            }
            const g = this.getMatchedRoutes(m, f),
              S = r(f, g)
            if (v) {
              const T = this.getMatchedRoutes(v, d),
                D = r(d, T)
              S.maskedLocation = D
            }
            return S
          }
        return i.mask ? o(i, { ...$c(i, ['from']), ...i.mask }) : o(i)
      }),
      (this.commitLocation = ({ viewTransition: i, ignoreBlocker: r, ...o }) => {
        const f = () => {
            const m = ['key', '__TSR_index', '__hashScrollIntoViewOptions']
            m.forEach((g) => {
              o.state[g] = this.latestLocation.state[g]
            })
            const v = Ai(o.state, this.latestLocation.state)
            return (
              m.forEach((g) => {
                delete o.state[g]
              }),
              v
            )
          },
          d = this.latestLocation.href === o.href,
          y = this.commitLocationPromise
        if (
          ((this.commitLocationPromise = ua(() => {
            y?.resolve()
          })),
          d && f())
        )
          this.load()
        else {
          let { maskedLocation: m, hashScrollIntoView: v, ...g } = o
          m &&
            ((g = {
              ...m,
              state: {
                ...m.state,
                __tempKey: void 0,
                __tempLocation: {
                  ...g,
                  search: g.searchStr,
                  state: { ...g.state, __tempKey: void 0, __tempLocation: void 0, key: void 0 },
                },
              },
            }),
            (g.unmaskOnReload ?? this.options.unmaskOnReload ?? !1) &&
              (g.state.__tempKey = this.tempLocationKey)),
            (g.state.__hashScrollIntoViewOptions =
              v ?? this.options.defaultHashScrollIntoView ?? !0),
            (this.shouldViewTransition = i),
            this.history[o.replace ? 'replace' : 'push'](g.href, g.state, { ignoreBlocker: r })
        }
        return (
          (this.resetNextScroll = o.resetScroll ?? !0),
          this.history.subscribers.size || this.load(),
          this.commitLocationPromise
        )
      }),
      (this.buildAndCommitLocation = ({
        replace: i,
        resetScroll: r,
        hashScrollIntoView: o,
        viewTransition: f,
        ignoreBlocker: d,
        href: y,
        ...m
      } = {}) => {
        if (y) {
          const g = this.history.location.state.__TSR_index,
            S = Ci(y, { __TSR_index: i ? g : g + 1 })
          ;(m.to = S.pathname),
            (m.search = this.options.parseSearch(S.search)),
            (m.hash = S.hash.slice(1))
        }
        const v = this.buildLocation({ ...m, _includeValidateSearch: !0 })
        return this.commitLocation({
          ...v,
          viewTransition: f,
          replace: i,
          resetScroll: r,
          hashScrollIntoView: o,
          ignoreBlocker: d,
        })
      }),
      (this.navigate = ({ to: i, reloadDocument: r, href: o, ...f }) => {
        if (r) {
          if (!o) {
            const d = this.buildLocation({ to: i, ...f })
            o = this.history.createHref(d.href)
          }
          f.replace ? window.location.replace(o) : (window.location.href = o)
          return
        }
        return this.buildAndCommitLocation({ ...f, href: o, to: i })
      }),
      (this.load = async (i) => {
        this.latestLocation = this.parseLocation(this.latestLocation)
        let r, o, f
        for (
          f = new Promise((d) => {
            this.startTransition(async () => {
              var y
              try {
                const m = this.latestLocation,
                  v = this.state.resolvedLocation
                this.cancelMatches()
                let g
                Hc(() => {
                  ;(g = this.matchRoutes(m)),
                    this.__store.setState((S) => ({
                      ...S,
                      status: 'pending',
                      isLoading: !0,
                      location: m,
                      pendingMatches: g,
                      cachedMatches: S.cachedMatches.filter((T) => !g.find((D) => D.id === T.id)),
                    }))
                }),
                  this.state.redirect ||
                    this.emit({
                      type: 'onBeforeNavigate',
                      ...oa({ resolvedLocation: v, location: m }),
                    }),
                  this.emit({ type: 'onBeforeLoad', ...oa({ resolvedLocation: v, location: m }) }),
                  await this.loadMatches({
                    sync: i?.sync,
                    matches: g,
                    location: m,
                    onReady: async () => {
                      this.startViewTransition(async () => {
                        let S, T, D
                        Hc(() => {
                          this.__store.setState((w) => {
                            const U = w.matches,
                              Z = w.pendingMatches || w.matches
                            return (
                              (S = U.filter((G) => !Z.find((X) => X.id === G.id))),
                              (T = Z.filter((G) => !U.find((X) => X.id === G.id))),
                              (D = U.filter((G) => Z.find((X) => X.id === G.id))),
                              {
                                ...w,
                                isLoading: !1,
                                loadedAt: Date.now(),
                                matches: Z,
                                pendingMatches: void 0,
                                cachedMatches: [
                                  ...w.cachedMatches,
                                  ...S.filter((G) => G.status !== 'error'),
                                ],
                              }
                            )
                          }),
                            this.clearExpiredCache()
                        }),
                          [
                            [S, 'onLeave'],
                            [T, 'onEnter'],
                            [D, 'onStay'],
                          ].forEach(([w, U]) => {
                            w.forEach((Z) => {
                              var G, X
                              ;(X = (G = this.looseRoutesById[Z.routeId].options)[U]) == null ||
                                X.call(G, Z)
                            })
                          })
                      })
                    },
                  })
              } catch (m) {
                Qc(m)
                  ? ((r = m),
                    this.isServer || this.navigate({ ...r, replace: !0, ignoreBlocker: !0 }))
                  : je(m) && (o = m),
                  this.__store.setState((v) => ({
                    ...v,
                    statusCode: r
                      ? r.statusCode
                      : o
                      ? 404
                      : v.matches.some((g) => g.status === 'error')
                      ? 500
                      : 200,
                    redirect: r,
                  }))
              }
              this.latestLoadPromise === f &&
                ((y = this.commitLocationPromise) == null || y.resolve(),
                (this.latestLoadPromise = void 0),
                (this.commitLocationPromise = void 0)),
                d()
            })
          }),
            this.latestLoadPromise = f,
            await f;
          this.latestLoadPromise && f !== this.latestLoadPromise;

        )
          await this.latestLoadPromise
        this.hasNotFoundMatch() && this.__store.setState((d) => ({ ...d, statusCode: 404 }))
      }),
      (this.startViewTransition = (i) => {
        const r = this.shouldViewTransition ?? this.options.defaultViewTransition
        if (
          (delete this.shouldViewTransition,
          r &&
            typeof document < 'u' &&
            'startViewTransition' in document &&
            typeof document.startViewTransition == 'function')
        ) {
          let o
          typeof r == 'object' && this.isViewTransitionTypesSupported
            ? (o = { update: i, types: r.types })
            : (o = i),
            document.startViewTransition(o)
        } else i()
      }),
      (this.updateMatch = (i, r) => {
        var o
        let f
        const d = (o = this.state.pendingMatches) == null ? void 0 : o.find((g) => g.id === i),
          y = this.state.matches.find((g) => g.id === i),
          m = this.state.cachedMatches.find((g) => g.id === i),
          v = d ? 'pendingMatches' : y ? 'matches' : m ? 'cachedMatches' : ''
        return (
          v &&
            this.__store.setState((g) => {
              var S
              return {
                ...g,
                [v]: (S = g[v]) == null ? void 0 : S.map((T) => (T.id === i ? (f = r(T)) : T)),
              }
            }),
          f
        )
      }),
      (this.getMatch = (i) =>
        [
          ...this.state.cachedMatches,
          ...(this.state.pendingMatches ?? []),
          ...this.state.matches,
        ].find((r) => r.id === i)),
      (this.loadMatches = async ({
        location: i,
        matches: r,
        preload: o,
        onReady: f,
        updateMatch: d = this.updateMatch,
        sync: y,
      }) => {
        let m,
          v = !1
        const g = async () => {
            v || ((v = !0), await f?.())
          },
          S = (D) => !!(o && !this.state.matches.find((w) => w.id === D))
        !this.isServer && !this.state.matches.length && g()
        const T = (D, w) => {
          var U, Z, G, X
          if (Qc(w) && !w.reloadDocument) throw w
          if (gl(w) || je(w)) {
            if (
              (d(D.id, (nt) => ({
                ...nt,
                status: gl(w) ? 'redirected' : je(w) ? 'notFound' : 'error',
                isFetching: !1,
                error: w,
                beforeLoadPromise: void 0,
                loaderPromise: void 0,
              })),
              w.routeId || (w.routeId = D.routeId),
              (U = D.beforeLoadPromise) == null || U.resolve(),
              (Z = D.loaderPromise) == null || Z.resolve(),
              (G = D.loadPromise) == null || G.resolve(),
              gl(w))
            )
              throw ((v = !0), (w = this.resolveRedirect({ ...w, _fromLocation: i })), w)
            if (je(w))
              throw (
                (this._handleNotFound(r, w, { updateMatch: d }),
                (X = this.serverSsr) == null ||
                  X.onMatchSettled({ router: this, match: this.getMatch(D.id) }),
                w)
              )
          }
        }
        try {
          await new Promise((D, w) => {
            ;(async () => {
              var U, Z, G
              try {
                const X = (Q, $, ct) => {
                  var L, R
                  const { id: j, routeId: Y } = r[Q],
                    K = this.looseRoutesById[Y]
                  if ($ instanceof Promise) throw $
                  ;($.routerCode = ct), (m = m ?? Q), T(this.getMatch(j), $)
                  try {
                    ;(R = (L = K.options).onError) == null || R.call(L, $)
                  } catch (lt) {
                    ;($ = lt), T(this.getMatch(j), $)
                  }
                  d(j, (lt) => {
                    var vt, rt
                    return (
                      (vt = lt.beforeLoadPromise) == null || vt.resolve(),
                      (rt = lt.loadPromise) == null || rt.resolve(),
                      {
                        ...lt,
                        error: $,
                        status: 'error',
                        isFetching: !1,
                        updatedAt: Date.now(),
                        abortController: new AbortController(),
                        beforeLoadPromise: void 0,
                      }
                    )
                  })
                }
                for (const [Q, { id: $, routeId: ct }] of r.entries()) {
                  const L = this.getMatch($),
                    R = (U = r[Q - 1]) == null ? void 0 : U.id,
                    j = this.looseRoutesById[ct],
                    Y = j.options.pendingMs ?? this.options.defaultPendingMs,
                    K = !!(
                      f &&
                      !this.isServer &&
                      !S($) &&
                      (j.options.loader || j.options.beforeLoad) &&
                      typeof Y == 'number' &&
                      Y !== 1 / 0 &&
                      (j.options.pendingComponent ?? this.options.defaultPendingComponent)
                    )
                  let lt = !0
                  if (
                    ((L.beforeLoadPromise || L.loaderPromise) &&
                      (K &&
                        setTimeout(() => {
                          try {
                            g()
                          } catch {}
                        }, Y),
                      await L.beforeLoadPromise,
                      (lt = this.getMatch($).status !== 'success')),
                    lt)
                  ) {
                    try {
                      d($, (I) => {
                        const Ct = I.loadPromise
                        return {
                          ...I,
                          loadPromise: ua(() => {
                            Ct?.resolve()
                          }),
                          beforeLoadPromise: ua(),
                        }
                      })
                      const vt = new AbortController()
                      let rt
                      K &&
                        (rt = setTimeout(() => {
                          try {
                            g()
                          } catch {}
                        }, Y))
                      const { paramsError: B, searchError: P } = this.getMatch($)
                      B && X(Q, B, 'PARSE_PARAMS'), P && X(Q, P, 'VALIDATE_SEARCH')
                      const tt = () => (R ? this.getMatch(R).context : this.options.context ?? {})
                      d($, (I) => ({
                        ...I,
                        isFetching: 'beforeLoad',
                        fetchCount: I.fetchCount + 1,
                        abortController: vt,
                        pendingTimeout: rt,
                        context: { ...tt(), ...I.__routeContext },
                      }))
                      const { search: dt, params: _, context: N, cause: F } = this.getMatch($),
                        J = S($),
                        V = {
                          search: dt,
                          abortController: vt,
                          params: _,
                          preload: J,
                          context: N,
                          location: i,
                          navigate: (I) => this.navigate({ ...I, _fromLocation: i }),
                          buildLocation: this.buildLocation,
                          cause: J ? 'preload' : F,
                          matches: r,
                        },
                        ut =
                          (await ((G = (Z = j.options).beforeLoad) == null
                            ? void 0
                            : G.call(Z, V))) ?? {}
                      ;(gl(ut) || je(ut)) && X(Q, ut, 'BEFORE_LOAD'),
                        d($, (I) => ({
                          ...I,
                          __beforeLoadContext: ut,
                          context: { ...tt(), ...I.__routeContext, ...ut },
                          abortController: vt,
                        }))
                    } catch (vt) {
                      X(Q, vt, 'BEFORE_LOAD')
                    }
                    d($, (vt) => {
                      var rt
                      return (
                        (rt = vt.beforeLoadPromise) == null || rt.resolve(),
                        { ...vt, beforeLoadPromise: void 0, isFetching: !1 }
                      )
                    })
                  }
                }
                const nt = r.slice(0, m),
                  yt = []
                nt.forEach(({ id: Q, routeId: $ }, ct) => {
                  yt.push(
                    (async () => {
                      const { loaderPromise: L } = this.getMatch(Q)
                      let R = !1,
                        j = !1
                      if (L) {
                        await L
                        const Y = this.getMatch(Q)
                        Y.error && T(Y, Y.error)
                      } else {
                        const Y = yt[ct - 1],
                          K = this.looseRoutesById[$],
                          lt = () => {
                            const {
                                params: F,
                                loaderDeps: J,
                                abortController: V,
                                context: ut,
                                cause: I,
                              } = this.getMatch(Q),
                              Ct = S(Q)
                            return {
                              params: F,
                              deps: J,
                              preload: !!Ct,
                              parentMatchPromise: Y,
                              abortController: V,
                              context: ut,
                              location: i,
                              navigate: (it) => this.navigate({ ...it, _fromLocation: i }),
                              cause: Ct ? 'preload' : I,
                              route: K,
                            }
                          },
                          vt = Date.now() - this.getMatch(Q).updatedAt,
                          rt = S(Q),
                          B = rt
                            ? K.options.preloadStaleTime ??
                              this.options.defaultPreloadStaleTime ??
                              3e4
                            : K.options.staleTime ?? this.options.defaultStaleTime ?? 0,
                          P = K.options.shouldReload,
                          tt = typeof P == 'function' ? P(lt()) : P
                        d(Q, (F) => ({
                          ...F,
                          loaderPromise: ua(),
                          preload: !!rt && !this.state.matches.find((J) => J.id === Q),
                        }))
                        const dt = async () => {
                            var F, J, V, ut, I, Ct, it, _t, Rt, kt, Xe
                            try {
                              const ie = async () => {
                                const Nt = this.getMatch(Q)
                                Nt.minPendingPromise && (await Nt.minPendingPromise)
                              }
                              try {
                                this.loadRouteChunk(K),
                                  d(Q, (Sa) => ({ ...Sa, isFetching: 'loader' }))
                                const Nt = await ((J = (F = K.options).loader) == null
                                  ? void 0
                                  : J.call(F, lt()))
                                T(this.getMatch(Q), Nt), await K._lazyPromise, await ie()
                                const ye = {
                                    matches: r,
                                    match: this.getMatch(Q),
                                    params: this.getMatch(Q).params,
                                    loaderData: Nt,
                                  },
                                  Bt =
                                    (ut = (V = K.options).head) == null ? void 0 : ut.call(V, ye),
                                  Fn = Bt?.meta,
                                  Jn = Bt?.links,
                                  va = Bt?.scripts,
                                  pa =
                                    (Ct = (I = K.options).scripts) == null
                                      ? void 0
                                      : Ct.call(I, ye),
                                  ga =
                                    (_t = (it = K.options).headers) == null
                                      ? void 0
                                      : _t.call(it, { loaderData: Nt })
                                d(Q, (Sa) => ({
                                  ...Sa,
                                  error: void 0,
                                  status: 'success',
                                  isFetching: !1,
                                  updatedAt: Date.now(),
                                  loaderData: Nt,
                                  meta: Fn,
                                  links: Jn,
                                  headScripts: va,
                                  headers: ga,
                                  scripts: pa,
                                }))
                              } catch (Nt) {
                                let ye = Nt
                                await ie(), T(this.getMatch(Q), Nt)
                                try {
                                  ;(kt = (Rt = K.options).onError) == null || kt.call(Rt, Nt)
                                } catch (Bt) {
                                  ;(ye = Bt), T(this.getMatch(Q), Bt)
                                }
                                d(Q, (Bt) => ({
                                  ...Bt,
                                  error: ye,
                                  status: 'error',
                                  isFetching: !1,
                                }))
                              }
                              ;(Xe = this.serverSsr) == null ||
                                Xe.onMatchSettled({ router: this, match: this.getMatch(Q) }),
                                await K._componentsPromise
                            } catch (ie) {
                              d(Q, (Nt) => ({ ...Nt, loaderPromise: void 0 })),
                                T(this.getMatch(Q), ie)
                            }
                          },
                          { status: _, invalid: N } = this.getMatch(Q)
                        ;(R = _ === 'success' && (N || (tt ?? vt > B))),
                          (rt && K.options.preload === !1) ||
                            (R && !y
                              ? ((j = !0),
                                (async () => {
                                  try {
                                    await dt()
                                    const { loaderPromise: F, loadPromise: J } = this.getMatch(Q)
                                    F?.resolve(),
                                      J?.resolve(),
                                      d(Q, (V) => ({ ...V, loaderPromise: void 0 }))
                                  } catch (F) {
                                    Qc(F) && (await this.navigate(F))
                                  }
                                })())
                              : (_ !== 'success' || (R && y)) && (await dt()))
                      }
                      if (!j) {
                        const { loaderPromise: Y, loadPromise: K } = this.getMatch(Q)
                        Y?.resolve(), K?.resolve()
                      }
                      return (
                        d(Q, (Y) => ({
                          ...Y,
                          isFetching: j ? Y.isFetching : !1,
                          loaderPromise: j ? Y.loaderPromise : void 0,
                          invalid: !1,
                        })),
                        this.getMatch(Q)
                      )
                    })(),
                  )
                }),
                  await Promise.all(yt),
                  D()
              } catch (X) {
                w(X)
              }
            })()
          }),
            await g()
        } catch (D) {
          if (gl(D) || je(D)) throw (je(D) && !o && (await g()), D)
        }
        return r
      }),
      (this.invalidate = (i) => {
        const r = (o) => {
          var f
          return ((f = i?.filter) == null ? void 0 : f.call(i, o)) ?? !0
            ? {
                ...o,
                invalid: !0,
                ...(o.status === 'error' ? { status: 'pending', error: void 0 } : {}),
              }
            : o
        }
        return (
          this.__store.setState((o) => {
            var f
            return {
              ...o,
              matches: o.matches.map(r),
              cachedMatches: o.cachedMatches.map(r),
              pendingMatches: (f = o.pendingMatches) == null ? void 0 : f.map(r),
            }
          }),
          this.load({ sync: i?.sync })
        )
      }),
      (this.resolveRedirect = (i) => {
        const r = i
        return r.href || (r.href = this.buildLocation(r).href), r
      }),
      (this.clearCache = (i) => {
        const r = i?.filter
        r !== void 0
          ? this.__store.setState((o) => ({
              ...o,
              cachedMatches: o.cachedMatches.filter((f) => !r(f)),
            }))
          : this.__store.setState((o) => ({ ...o, cachedMatches: [] }))
      }),
      (this.clearExpiredCache = () => {
        const i = (r) => {
          const o = this.looseRoutesById[r.routeId]
          if (!o.options.loader) return !0
          const f =
            (r.preload
              ? o.options.preloadGcTime ?? this.options.defaultPreloadGcTime
              : o.options.gcTime ?? this.options.defaultGcTime) ?? 5 * 60 * 1e3
          return !(r.status !== 'error' && Date.now() - r.updatedAt < f)
        }
        this.clearCache({ filter: i })
      }),
      (this.loadRouteChunk = (i) => (
        i._lazyPromise === void 0 &&
          (i.lazyFn
            ? (i._lazyPromise = i.lazyFn().then((r) => {
                const { id: o, ...f } = r.options
                Object.assign(i.options, f)
              }))
            : (i._lazyPromise = Promise.resolve())),
        i._componentsPromise === void 0 &&
          (i._componentsPromise = i._lazyPromise.then(() =>
            Promise.all(
              Wy.map(async (r) => {
                const o = i.options[r]
                o?.preload && (await o.preload())
              }),
            ),
          )),
        i._componentsPromise
      )),
      (this.preloadRoute = async (i) => {
        const r = this.buildLocation(i)
        let o = this.matchRoutes(r, { throwOnError: !0, preload: !0, dest: i })
        const f = new Set(
            [...this.state.matches, ...(this.state.pendingMatches ?? [])].map((y) => y.id),
          ),
          d = new Set([...f, ...this.state.cachedMatches.map((y) => y.id)])
        Hc(() => {
          o.forEach((y) => {
            d.has(y.id) ||
              this.__store.setState((m) => ({ ...m, cachedMatches: [...m.cachedMatches, y] }))
          })
        })
        try {
          return (
            (o = await this.loadMatches({
              matches: o,
              location: r,
              preload: !0,
              updateMatch: (y, m) => {
                f.has(y) ? (o = o.map((v) => (v.id === y ? m(v) : v))) : this.updateMatch(y, m)
              },
            })),
            o
          )
        } catch (y) {
          if (gl(y))
            return y.reloadDocument ? void 0 : await this.preloadRoute({ ...y, _fromLocation: r })
          je(y) || console.error(y)
          return
        }
      }),
      (this.matchRoute = (i, r) => {
        const o = {
            ...i,
            to: i.to ? this.resolvePathWithBase(i.from || '', i.to) : void 0,
            params: i.params || {},
            leaveParams: !0,
          },
          f = this.buildLocation(o)
        if (r?.pending && this.state.status !== 'pending') return !1
        const y = (r?.pending === void 0 ? !this.state.isLoading : r.pending)
            ? this.latestLocation
            : this.state.resolvedLocation || this.state.location,
          m = ku(this.basepath, y.pathname, { ...r, to: f.pathname })
        return !m || (i.params && !Ai(m, i.params, { partial: !0 }))
          ? !1
          : m && (r?.includeSearch ?? !0)
          ? Ai(y.search, f.search, { partial: !0 })
            ? m
            : !1
          : m
      }),
      (this._handleNotFound = (i, r, { updateMatch: o = this.updateMatch } = {}) => {
        const f = Object.fromEntries(i.map((m) => [m.routeId, m]))
        let d =
          (r.global ? this.looseRoutesById[he] : this.looseRoutesById[r.routeId]) ||
          this.looseRoutesById[he]
        for (
          ;
          !d.options.notFoundComponent && !this.options.defaultNotFoundComponent && d.id !== he;

        )
          (d = d.parentRoute), Ve(d)
        const y = f[d.id]
        Ve(y, 'Could not find match for route: ' + d.id),
          o(y.id, (m) => ({ ...m, status: 'notFound', error: r, isFetching: !1 })),
          r.routerCode === 'BEFORE_LOAD' &&
            d.parentRoute &&
            ((r.routeId = d.parentRoute.id), this._handleNotFound(i, r, { updateMatch: o }))
      }),
      (this.hasNotFoundMatch = () =>
        this.__store.state.matches.some((i) => i.status === 'notFound' || i.globalNotFound)),
      this.update({
        defaultPreloadDelay: 50,
        defaultPendingMs: 1e3,
        defaultPendingMinMs: 500,
        context: void 0,
        ...u,
        caseSensitive: u.caseSensitive ?? !1,
        notFoundMode: u.notFoundMode ?? 'fuzzy',
        stringifySearch: u.stringifySearch ?? Sp,
        parseSearch: u.parseSearch ?? gp,
      }),
      typeof document < 'u' && (window.__TSR_ROUTER__ = this)
  }
  get state() {
    return this.__store.state
  }
  get looseRoutesById() {
    return this.routesById
  }
  matchRoutesInternal(u, i) {
    const { foundRoute: r, matchedRoutes: o, routeParams: f } = this.getMatchedRoutes(u, i?.dest)
    let d = !1
    ;(r ? r.path !== '/' && f['**'] : Sl(u.pathname)) &&
      (this.options.notFoundRoute ? o.push(this.options.notFoundRoute) : (d = !0))
    const y = (() => {
        if (d) {
          if (this.options.notFoundMode !== 'root')
            for (let S = o.length - 1; S >= 0; S--) {
              const T = o[S]
              if (T.children) return T.id
            }
          return he
        }
      })(),
      m = o.map((S) => {
        var T
        let D
        const w = ((T = S.options.params) == null ? void 0 : T.parse) ?? S.options.parseParams
        if (w)
          try {
            const U = w(f)
            Object.assign(f, U)
          } catch (U) {
            if (((D = new hg(U.message, { cause: U })), i?.throwOnError)) throw D
            return D
          }
      }),
      v = [],
      g = (S) => (S?.id ? S.context ?? this.options.context ?? {} : this.options.context ?? {})
    return (
      o.forEach((S, T) => {
        var D, w
        const U = v[T - 1],
          [Z, G, X] = (() => {
            const lt = U?.search ?? u.search,
              vt = U?._strictSearch ?? {}
            try {
              const rt = Vc(S.options.validateSearch, { ...lt }) ?? {}
              return [{ ...lt, ...rt }, { ...vt, ...rt }, void 0]
            } catch (rt) {
              let B = rt
              if ((rt instanceof us || (B = new us(rt.message, { cause: rt })), i?.throwOnError))
                throw B
              return [lt, {}, B]
            }
          })(),
          nt = ((w = (D = S.options).loaderDeps) == null ? void 0 : w.call(D, { search: Z })) ?? '',
          yt = nt ? JSON.stringify(nt) : '',
          { usedParams: Q, interpolatedPath: $ } = Zu({
            path: S.fullPath,
            params: f,
            decodeCharMap: this.pathParamsDecodeCharMap,
          }),
          ct =
            Zu({
              path: S.id,
              params: f,
              leaveWildcards: !0,
              decodeCharMap: this.pathParamsDecodeCharMap,
            }).interpolatedPath + yt,
          L = this.getMatch(ct),
          R = this.state.matches.find((lt) => lt.routeId === S.id),
          j = R ? 'stay' : 'enter'
        let Y
        if (L)
          Y = {
            ...L,
            cause: j,
            params: R ? qe(R.params, f) : f,
            _strictParams: Q,
            search: qe(R ? R.search : L.search, Z),
            _strictSearch: G,
          }
        else {
          const lt =
            S.options.loader || S.options.beforeLoad || S.lazyFn || og(S) ? 'pending' : 'success'
          Y = {
            id: ct,
            index: T,
            routeId: S.id,
            params: R ? qe(R.params, f) : f,
            _strictParams: Q,
            pathname: pn([this.basepath, $]),
            updatedAt: Date.now(),
            search: R ? qe(R.search, Z) : Z,
            _strictSearch: G,
            searchError: void 0,
            status: lt,
            isFetching: !1,
            error: void 0,
            paramsError: m[T],
            __routeContext: {},
            __beforeLoadContext: {},
            context: {},
            abortController: new AbortController(),
            fetchCount: 0,
            cause: j,
            loaderDeps: R ? qe(R.loaderDeps, nt) : nt,
            invalid: !1,
            preload: !1,
            links: void 0,
            scripts: void 0,
            headScripts: void 0,
            meta: void 0,
            staticData: S.options.staticData || {},
            loadPromise: ua(),
            fullPath: S.fullPath,
          }
        }
        i?.preload || (Y.globalNotFound = y === S.id), (Y.searchError = X)
        const K = g(U)
        ;(Y.context = { ...K, ...Y.__routeContext, ...Y.__beforeLoadContext }), v.push(Y)
      }),
      v.forEach((S, T) => {
        var D, w, U, Z, G, X, nt, yt
        const Q = this.looseRoutesById[S.routeId]
        if (!this.getMatch(S.id) && i?._buildLocation !== !0) {
          const ct = v[T - 1],
            L = g(ct),
            R = {
              deps: S.loaderDeps,
              params: S.params,
              context: L,
              location: u,
              navigate: (j) => this.navigate({ ...j, _fromLocation: u }),
              buildLocation: this.buildLocation,
              cause: S.cause,
              abortController: S.abortController,
              preload: !!S.preload,
              matches: v,
            }
          ;(S.__routeContext =
            ((w = (D = Q.options).context) == null ? void 0 : w.call(D, R)) ?? {}),
            (S.context = { ...L, ...S.__routeContext, ...S.__beforeLoadContext })
        }
        if (S.status === 'success') {
          S.headers =
            (Z = (U = Q.options).headers) == null ? void 0 : Z.call(U, { loaderData: S.loaderData })
          const ct = { matches: v, match: S, params: S.params, loaderData: S.loaderData },
            L = (X = (G = Q.options).head) == null ? void 0 : X.call(G, ct)
          ;(S.links = L?.links),
            (S.headScripts = L?.scripts),
            (S.meta = L?.meta),
            (S.scripts = (yt = (nt = Q.options).scripts) == null ? void 0 : yt.call(nt, ct))
        }
      }),
      v
    )
  }
}
class us extends Error {}
class hg extends Error {}
function yg(a) {
  return {
    loadedAt: 0,
    isLoading: !1,
    isTransitioning: !1,
    status: 'idle',
    resolvedLocation: void 0,
    location: a,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200,
  }
}
function mg({ router: a, children: u, ...i }) {
  a.update({ ...a.options, ...i, context: { ...a.options.context, ...i.context } })
  const r = Zy(),
    o = k.jsx(r.Provider, { value: a, children: u })
  return a.options.Wrap ? k.jsx(a.options.Wrap, { children: o }) : o
}
function vg({ router: a, ...u }) {
  return k.jsx(mg, { router: a, ...u, children: k.jsx(rg, {}) })
}
var ps = class {
    constructor() {
      ;(this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this))
    }
    subscribe(a) {
      return (
        this.listeners.add(a),
        this.onSubscribe(),
        () => {
          this.listeners.delete(a), this.onUnsubscribe()
        }
      )
    }
    hasListeners() {
      return this.listeners.size > 0
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  gs = typeof window > 'u' || 'Deno' in globalThis
function Ye() {}
function pg(a, u) {
  return typeof a == 'function' ? a(u) : a
}
function gg(a) {
  return typeof a == 'number' && a >= 0 && a !== 1 / 0
}
function Sg(a, u) {
  return Math.max(a + (u || 0) - Date.now(), 0)
}
function Ey(a, u) {
  return typeof a == 'function' ? a(u) : a
}
function bg(a, u) {
  return typeof a == 'function' ? a(u) : a
}
function Oy(a, u) {
  const { type: i = 'all', exact: r, fetchStatus: o, predicate: f, queryKey: d, stale: y } = a
  if (d) {
    if (r) {
      if (u.queryHash !== ho(d, u.options)) return !1
    } else if (!xi(u.queryKey, d)) return !1
  }
  if (i !== 'all') {
    const m = u.isActive()
    if ((i === 'active' && !m) || (i === 'inactive' && m)) return !1
  }
  return !(
    (typeof y == 'boolean' && u.isStale() !== y) ||
    (o && o !== u.state.fetchStatus) ||
    (f && !f(u))
  )
}
function Ty(a, u) {
  const { exact: i, status: r, predicate: o, mutationKey: f } = a
  if (f) {
    if (!u.options.mutationKey) return !1
    if (i) {
      if (wi(u.options.mutationKey) !== wi(f)) return !1
    } else if (!xi(u.options.mutationKey, f)) return !1
  }
  return !((r && u.state.status !== r) || (o && !o(u)))
}
function ho(a, u) {
  return (u?.queryKeyHashFn || wi)(a)
}
function wi(a) {
  return JSON.stringify(a, (u, i) =>
    eo(i)
      ? Object.keys(i)
          .sort()
          .reduce((r, o) => ((r[o] = i[o]), r), {})
      : i,
  )
}
function xi(a, u) {
  return a === u
    ? !0
    : typeof a != typeof u
    ? !1
    : a && u && typeof a == 'object' && typeof u == 'object'
    ? !Object.keys(u).some((i) => !xi(a[i], u[i]))
    : !1
}
function Iy(a, u) {
  if (a === u) return a
  const i = Ry(a) && Ry(u)
  if (i || (eo(a) && eo(u))) {
    const r = i ? a : Object.keys(a),
      o = r.length,
      f = i ? u : Object.keys(u),
      d = f.length,
      y = i ? [] : {}
    let m = 0
    for (let v = 0; v < d; v++) {
      const g = i ? v : f[v]
      ;((!i && r.includes(g)) || i) && a[g] === void 0 && u[g] === void 0
        ? ((y[g] = void 0), m++)
        : ((y[g] = Iy(a[g], u[g])), y[g] === a[g] && a[g] !== void 0 && m++)
    }
    return o === d && m === o ? a : y
  }
  return u
}
function jb(a, u) {
  if (!u || Object.keys(a).length !== Object.keys(u).length) return !1
  for (const i in a) if (a[i] !== u[i]) return !1
  return !0
}
function Ry(a) {
  return Array.isArray(a) && a.length === Object.keys(a).length
}
function eo(a) {
  if (!My(a)) return !1
  const u = a.constructor
  if (u === void 0) return !0
  const i = u.prototype
  return !(
    !My(i) ||
    !i.hasOwnProperty('isPrototypeOf') ||
    Object.getPrototypeOf(a) !== Object.prototype
  )
}
function My(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}
function _g(a) {
  return new Promise((u) => {
    setTimeout(u, a)
  })
}
function Eg(a, u, i) {
  return typeof i.structuralSharing == 'function'
    ? i.structuralSharing(a, u)
    : i.structuralSharing !== !1
    ? Iy(a, u)
    : u
}
function Og(a, u, i = 0) {
  const r = [...a, u]
  return i && r.length > i ? r.slice(1) : r
}
function Tg(a, u, i = 0) {
  const r = [u, ...a]
  return i && r.length > i ? r.slice(0, -1) : r
}
var Sn = Symbol()
function tm(a, u) {
  return !a.queryFn && u?.initialPromise
    ? () => u.initialPromise
    : !a.queryFn || a.queryFn === Sn
    ? () => Promise.reject(new Error(`Missing queryFn: '${a.queryHash}'`))
    : a.queryFn
}
var Rg = class extends ps {
    #t
    #e
    #n
    constructor() {
      super(),
        (this.#n = (a) => {
          if (!gs && window.addEventListener) {
            const u = () => a()
            return (
              window.addEventListener('visibilitychange', u, !1),
              () => {
                window.removeEventListener('visibilitychange', u)
              }
            )
          }
        })
    }
    onSubscribe() {
      this.#e || this.setEventListener(this.#n)
    }
    onUnsubscribe() {
      this.hasListeners() || (this.#e?.(), (this.#e = void 0))
    }
    setEventListener(a) {
      ;(this.#n = a),
        this.#e?.(),
        (this.#e = a((u) => {
          typeof u == 'boolean' ? this.setFocused(u) : this.onFocus()
        }))
    }
    setFocused(a) {
      this.#t !== a && ((this.#t = a), this.onFocus())
    }
    onFocus() {
      const a = this.isFocused()
      this.listeners.forEach((u) => {
        u(a)
      })
    }
    isFocused() {
      return typeof this.#t == 'boolean'
        ? this.#t
        : globalThis.document?.visibilityState !== 'hidden'
    }
  },
  em = new Rg(),
  Mg = class extends ps {
    #t = !0
    #e
    #n
    constructor() {
      super(),
        (this.#n = (a) => {
          if (!gs && window.addEventListener) {
            const u = () => a(!0),
              i = () => a(!1)
            return (
              window.addEventListener('online', u, !1),
              window.addEventListener('offline', i, !1),
              () => {
                window.removeEventListener('online', u), window.removeEventListener('offline', i)
              }
            )
          }
        })
    }
    onSubscribe() {
      this.#e || this.setEventListener(this.#n)
    }
    onUnsubscribe() {
      this.hasListeners() || (this.#e?.(), (this.#e = void 0))
    }
    setEventListener(a) {
      ;(this.#n = a), this.#e?.(), (this.#e = a(this.setOnline.bind(this)))
    }
    setOnline(a) {
      this.#t !== a &&
        ((this.#t = a),
        this.listeners.forEach((i) => {
          i(a)
        }))
    }
    isOnline() {
      return this.#t
    }
  },
  ss = new Mg()
function Ag() {
  let a, u
  const i = new Promise((o, f) => {
    ;(a = o), (u = f)
  })
  ;(i.status = 'pending'), i.catch(() => {})
  function r(o) {
    Object.assign(i, o), delete i.resolve, delete i.reject
  }
  return (
    (i.resolve = (o) => {
      r({ status: 'fulfilled', value: o }), a(o)
    }),
    (i.reject = (o) => {
      r({ status: 'rejected', reason: o }), u(o)
    }),
    i
  )
}
function Dg(a) {
  return Math.min(1e3 * 2 ** a, 3e4)
}
function nm(a) {
  return (a ?? 'online') === 'online' ? ss.isOnline() : !0
}
var lm = class extends Error {
  constructor(a) {
    super('CancelledError'), (this.revert = a?.revert), (this.silent = a?.silent)
  }
}
function Xc(a) {
  return a instanceof lm
}
function am(a) {
  let u = !1,
    i = 0,
    r = !1,
    o
  const f = Ag(),
    d = (U) => {
      r || (T(new lm(U)), a.abort?.())
    },
    y = () => {
      u = !0
    },
    m = () => {
      u = !1
    },
    v = () => em.isFocused() && (a.networkMode === 'always' || ss.isOnline()) && a.canRun(),
    g = () => nm(a.networkMode) && a.canRun(),
    S = (U) => {
      r || ((r = !0), a.onSuccess?.(U), o?.(), f.resolve(U))
    },
    T = (U) => {
      r || ((r = !0), a.onError?.(U), o?.(), f.reject(U))
    },
    D = () =>
      new Promise((U) => {
        ;(o = (Z) => {
          ;(r || v()) && U(Z)
        }),
          a.onPause?.()
      }).then(() => {
        ;(o = void 0), r || a.onContinue?.()
      }),
    w = () => {
      if (r) return
      let U
      const Z = i === 0 ? a.initialPromise : void 0
      try {
        U = Z ?? a.fn()
      } catch (G) {
        U = Promise.reject(G)
      }
      Promise.resolve(U)
        .then(S)
        .catch((G) => {
          if (r) return
          const X = a.retry ?? (gs ? 0 : 3),
            nt = a.retryDelay ?? Dg,
            yt = typeof nt == 'function' ? nt(i, G) : nt,
            Q = X === !0 || (typeof X == 'number' && i < X) || (typeof X == 'function' && X(i, G))
          if (u || !Q) {
            T(G)
            return
          }
          i++,
            a.onFail?.(i, G),
            _g(yt)
              .then(() => (v() ? void 0 : D()))
              .then(() => {
                u ? T(G) : w()
              })
        })
    }
  return {
    promise: f,
    cancel: d,
    continue: () => (o?.(), f),
    cancelRetry: y,
    continueRetry: m,
    canStart: g,
    start: () => (g() ? w() : D().then(w), f),
  }
}
function Cg() {
  let a = [],
    u = 0,
    i = (y) => {
      y()
    },
    r = (y) => {
      y()
    },
    o = (y) => setTimeout(y, 0)
  const f = (y) => {
      u
        ? a.push(y)
        : o(() => {
            i(y)
          })
    },
    d = () => {
      const y = a
      ;(a = []),
        y.length &&
          o(() => {
            r(() => {
              y.forEach((m) => {
                i(m)
              })
            })
          })
    }
  return {
    batch: (y) => {
      let m
      u++
      try {
        m = y()
      } finally {
        u--, u || d()
      }
      return m
    },
    batchCalls:
      (y) =>
      (...m) => {
        f(() => {
          y(...m)
        })
      },
    schedule: f,
    setNotifyFunction: (y) => {
      i = y
    },
    setBatchNotifyFunction: (y) => {
      r = y
    },
    setScheduler: (y) => {
      o = y
    },
  }
}
var re = Cg(),
  im = class {
    #t
    destroy() {
      this.clearGcTimeout()
    }
    scheduleGc() {
      this.clearGcTimeout(),
        gg(this.gcTime) &&
          (this.#t = setTimeout(() => {
            this.optionalRemove()
          }, this.gcTime))
    }
    updateGcTime(a) {
      this.gcTime = Math.max(this.gcTime || 0, a ?? (gs ? 1 / 0 : 5 * 60 * 1e3))
    }
    clearGcTimeout() {
      this.#t && (clearTimeout(this.#t), (this.#t = void 0))
    }
  },
  wg = class extends im {
    #t
    #e
    #n
    #a
    #l
    #u
    #s
    constructor(a) {
      super(),
        (this.#s = !1),
        (this.#u = a.defaultOptions),
        this.setOptions(a.options),
        (this.observers = []),
        (this.#a = a.client),
        (this.#n = this.#a.getQueryCache()),
        (this.queryKey = a.queryKey),
        (this.queryHash = a.queryHash),
        (this.#t = zg(this.options)),
        (this.state = a.state ?? this.#t),
        this.scheduleGc()
    }
    get meta() {
      return this.options.meta
    }
    get promise() {
      return this.#l?.promise
    }
    setOptions(a) {
      ;(this.options = { ...this.#u, ...a }), this.updateGcTime(this.options.gcTime)
    }
    optionalRemove() {
      !this.observers.length && this.state.fetchStatus === 'idle' && this.#n.remove(this)
    }
    setData(a, u) {
      const i = Eg(this.state.data, a, this.options)
      return (
        this.#i({ data: i, type: 'success', dataUpdatedAt: u?.updatedAt, manual: u?.manual }), i
      )
    }
    setState(a, u) {
      this.#i({ type: 'setState', state: a, setStateOptions: u })
    }
    cancel(a) {
      const u = this.#l?.promise
      return this.#l?.cancel(a), u ? u.then(Ye).catch(Ye) : Promise.resolve()
    }
    destroy() {
      super.destroy(), this.cancel({ silent: !0 })
    }
    reset() {
      this.destroy(), this.setState(this.#t)
    }
    isActive() {
      return this.observers.some((a) => bg(a.options.enabled, this) !== !1)
    }
    isDisabled() {
      return this.getObserversCount() > 0
        ? !this.isActive()
        : this.options.queryFn === Sn ||
            this.state.dataUpdateCount + this.state.errorUpdateCount === 0
    }
    isStale() {
      return this.state.isInvalidated
        ? !0
        : this.getObserversCount() > 0
        ? this.observers.some((a) => a.getCurrentResult().isStale)
        : this.state.data === void 0
    }
    isStaleByTime(a = 0) {
      return (
        this.state.isInvalidated || this.state.data === void 0 || !Sg(this.state.dataUpdatedAt, a)
      )
    }
    onFocus() {
      this.observers.find((u) => u.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: !1 }),
        this.#l?.continue()
    }
    onOnline() {
      this.observers.find((u) => u.shouldFetchOnReconnect())?.refetch({ cancelRefetch: !1 }),
        this.#l?.continue()
    }
    addObserver(a) {
      this.observers.includes(a) ||
        (this.observers.push(a),
        this.clearGcTimeout(),
        this.#n.notify({ type: 'observerAdded', query: this, observer: a }))
    }
    removeObserver(a) {
      this.observers.includes(a) &&
        ((this.observers = this.observers.filter((u) => u !== a)),
        this.observers.length ||
          (this.#l && (this.#s ? this.#l.cancel({ revert: !0 }) : this.#l.cancelRetry()),
          this.scheduleGc()),
        this.#n.notify({ type: 'observerRemoved', query: this, observer: a }))
    }
    getObserversCount() {
      return this.observers.length
    }
    invalidate() {
      this.state.isInvalidated || this.#i({ type: 'invalidate' })
    }
    fetch(a, u) {
      if (this.state.fetchStatus !== 'idle') {
        if (this.state.data !== void 0 && u?.cancelRefetch) this.cancel({ silent: !0 })
        else if (this.#l) return this.#l.continueRetry(), this.#l.promise
      }
      if ((a && this.setOptions(a), !this.options.queryFn)) {
        const y = this.observers.find((m) => m.options.queryFn)
        y && this.setOptions(y.options)
      }
      const i = new AbortController(),
        r = (y) => {
          Object.defineProperty(y, 'signal', {
            enumerable: !0,
            get: () => ((this.#s = !0), i.signal),
          })
        },
        o = () => {
          const y = tm(this.options, u),
            m = { client: this.#a, queryKey: this.queryKey, meta: this.meta }
          return (
            r(m), (this.#s = !1), this.options.persister ? this.options.persister(y, m, this) : y(m)
          )
        },
        f = {
          fetchOptions: u,
          options: this.options,
          queryKey: this.queryKey,
          client: this.#a,
          state: this.state,
          fetchFn: o,
        }
      r(f),
        this.options.behavior?.onFetch(f, this),
        (this.#e = this.state),
        (this.state.fetchStatus === 'idle' || this.state.fetchMeta !== f.fetchOptions?.meta) &&
          this.#i({ type: 'fetch', meta: f.fetchOptions?.meta })
      const d = (y) => {
        ;(Xc(y) && y.silent) || this.#i({ type: 'error', error: y }),
          Xc(y) ||
            (this.#n.config.onError?.(y, this),
            this.#n.config.onSettled?.(this.state.data, y, this)),
          this.scheduleGc()
      }
      return (
        (this.#l = am({
          initialPromise: u?.initialPromise,
          fn: f.fetchFn,
          abort: i.abort.bind(i),
          onSuccess: (y) => {
            if (y === void 0) {
              d(new Error(`${this.queryHash} data is undefined`))
              return
            }
            try {
              this.setData(y)
            } catch (m) {
              d(m)
              return
            }
            this.#n.config.onSuccess?.(y, this),
              this.#n.config.onSettled?.(y, this.state.error, this),
              this.scheduleGc()
          },
          onError: d,
          onFail: (y, m) => {
            this.#i({ type: 'failed', failureCount: y, error: m })
          },
          onPause: () => {
            this.#i({ type: 'pause' })
          },
          onContinue: () => {
            this.#i({ type: 'continue' })
          },
          retry: f.options.retry,
          retryDelay: f.options.retryDelay,
          networkMode: f.options.networkMode,
          canRun: () => !0,
        })),
        this.#l.start()
      )
    }
    #i(a) {
      const u = (i) => {
        switch (a.type) {
          case 'failed':
            return { ...i, fetchFailureCount: a.failureCount, fetchFailureReason: a.error }
          case 'pause':
            return { ...i, fetchStatus: 'paused' }
          case 'continue':
            return { ...i, fetchStatus: 'fetching' }
          case 'fetch':
            return { ...i, ...xg(i.data, this.options), fetchMeta: a.meta ?? null }
          case 'success':
            return {
              ...i,
              data: a.data,
              dataUpdateCount: i.dataUpdateCount + 1,
              dataUpdatedAt: a.dataUpdatedAt ?? Date.now(),
              error: null,
              isInvalidated: !1,
              status: 'success',
              ...(!a.manual && {
                fetchStatus: 'idle',
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            }
          case 'error':
            const r = a.error
            return Xc(r) && r.revert && this.#e
              ? { ...this.#e, fetchStatus: 'idle' }
              : {
                  ...i,
                  error: r,
                  errorUpdateCount: i.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: i.fetchFailureCount + 1,
                  fetchFailureReason: r,
                  fetchStatus: 'idle',
                  status: 'error',
                }
          case 'invalidate':
            return { ...i, isInvalidated: !0 }
          case 'setState':
            return { ...i, ...a.state }
        }
      }
      ;(this.state = u(this.state)),
        re.batch(() => {
          this.observers.forEach((i) => {
            i.onQueryUpdate()
          }),
            this.#n.notify({ query: this, type: 'updated', action: a })
        })
    }
  }
function xg(a, u) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: nm(u.networkMode) ? 'fetching' : 'paused',
    ...(a === void 0 && { error: null, status: 'pending' }),
  }
}
function zg(a) {
  const u = typeof a.initialData == 'function' ? a.initialData() : a.initialData,
    i = u !== void 0,
    r = i
      ? typeof a.initialDataUpdatedAt == 'function'
        ? a.initialDataUpdatedAt()
        : a.initialDataUpdatedAt
      : 0
  return {
    data: u,
    dataUpdateCount: 0,
    dataUpdatedAt: i ? r ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: i ? 'success' : 'pending',
    fetchStatus: 'idle',
  }
}
var Ug = class extends ps {
    constructor(a = {}) {
      super(), (this.config = a), (this.#t = new Map())
    }
    #t
    build(a, u, i) {
      const r = u.queryKey,
        o = u.queryHash ?? ho(r, u)
      let f = this.get(o)
      return (
        f ||
          ((f = new wg({
            client: a,
            queryKey: r,
            queryHash: o,
            options: a.defaultQueryOptions(u),
            state: i,
            defaultOptions: a.getQueryDefaults(r),
          })),
          this.add(f)),
        f
      )
    }
    add(a) {
      this.#t.has(a.queryHash) ||
        (this.#t.set(a.queryHash, a), this.notify({ type: 'added', query: a }))
    }
    remove(a) {
      const u = this.#t.get(a.queryHash)
      u &&
        (a.destroy(),
        u === a && this.#t.delete(a.queryHash),
        this.notify({ type: 'removed', query: a }))
    }
    clear() {
      re.batch(() => {
        this.getAll().forEach((a) => {
          this.remove(a)
        })
      })
    }
    get(a) {
      return this.#t.get(a)
    }
    getAll() {
      return [...this.#t.values()]
    }
    find(a) {
      const u = { exact: !0, ...a }
      return this.getAll().find((i) => Oy(u, i))
    }
    findAll(a = {}) {
      const u = this.getAll()
      return Object.keys(a).length > 0 ? u.filter((i) => Oy(a, i)) : u
    }
    notify(a) {
      re.batch(() => {
        this.listeners.forEach((u) => {
          u(a)
        })
      })
    }
    onFocus() {
      re.batch(() => {
        this.getAll().forEach((a) => {
          a.onFocus()
        })
      })
    }
    onOnline() {
      re.batch(() => {
        this.getAll().forEach((a) => {
          a.onOnline()
        })
      })
    }
  },
  Ng = class extends im {
    #t
    #e
    #n
    constructor(a) {
      super(),
        (this.mutationId = a.mutationId),
        (this.#e = a.mutationCache),
        (this.#t = []),
        (this.state = a.state || Lg()),
        this.setOptions(a.options),
        this.scheduleGc()
    }
    setOptions(a) {
      ;(this.options = a), this.updateGcTime(this.options.gcTime)
    }
    get meta() {
      return this.options.meta
    }
    addObserver(a) {
      this.#t.includes(a) ||
        (this.#t.push(a),
        this.clearGcTimeout(),
        this.#e.notify({ type: 'observerAdded', mutation: this, observer: a }))
    }
    removeObserver(a) {
      ;(this.#t = this.#t.filter((u) => u !== a)),
        this.scheduleGc(),
        this.#e.notify({ type: 'observerRemoved', mutation: this, observer: a })
    }
    optionalRemove() {
      this.#t.length || (this.state.status === 'pending' ? this.scheduleGc() : this.#e.remove(this))
    }
    continue() {
      return this.#n?.continue() ?? this.execute(this.state.variables)
    }
    async execute(a) {
      this.#n = am({
        fn: () =>
          this.options.mutationFn
            ? this.options.mutationFn(a)
            : Promise.reject(new Error('No mutationFn found')),
        onFail: (r, o) => {
          this.#a({ type: 'failed', failureCount: r, error: o })
        },
        onPause: () => {
          this.#a({ type: 'pause' })
        },
        onContinue: () => {
          this.#a({ type: 'continue' })
        },
        retry: this.options.retry ?? 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode,
        canRun: () => this.#e.canRun(this),
      })
      const u = this.state.status === 'pending',
        i = !this.#n.canStart()
      try {
        if (!u) {
          this.#a({ type: 'pending', variables: a, isPaused: i }),
            await this.#e.config.onMutate?.(a, this)
          const o = await this.options.onMutate?.(a)
          o !== this.state.context &&
            this.#a({ type: 'pending', context: o, variables: a, isPaused: i })
        }
        const r = await this.#n.start()
        return (
          await this.#e.config.onSuccess?.(r, a, this.state.context, this),
          await this.options.onSuccess?.(r, a, this.state.context),
          await this.#e.config.onSettled?.(r, null, this.state.variables, this.state.context, this),
          await this.options.onSettled?.(r, null, a, this.state.context),
          this.#a({ type: 'success', data: r }),
          r
        )
      } catch (r) {
        try {
          throw (
            (await this.#e.config.onError?.(r, a, this.state.context, this),
            await this.options.onError?.(r, a, this.state.context),
            await this.#e.config.onSettled?.(
              void 0,
              r,
              this.state.variables,
              this.state.context,
              this,
            ),
            await this.options.onSettled?.(void 0, r, a, this.state.context),
            r)
          )
        } finally {
          this.#a({ type: 'error', error: r })
        }
      } finally {
        this.#e.runNext(this)
      }
    }
    #a(a) {
      const u = (i) => {
        switch (a.type) {
          case 'failed':
            return { ...i, failureCount: a.failureCount, failureReason: a.error }
          case 'pause':
            return { ...i, isPaused: !0 }
          case 'continue':
            return { ...i, isPaused: !1 }
          case 'pending':
            return {
              ...i,
              context: a.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: a.isPaused,
              status: 'pending',
              variables: a.variables,
              submittedAt: Date.now(),
            }
          case 'success':
            return {
              ...i,
              data: a.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: 'success',
              isPaused: !1,
            }
          case 'error':
            return {
              ...i,
              data: void 0,
              error: a.error,
              failureCount: i.failureCount + 1,
              failureReason: a.error,
              isPaused: !1,
              status: 'error',
            }
        }
      }
      ;(this.state = u(this.state)),
        re.batch(() => {
          this.#t.forEach((i) => {
            i.onMutationUpdate(a)
          }),
            this.#e.notify({ mutation: this, type: 'updated', action: a })
        })
    }
  }
function Lg() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: 'idle',
    variables: void 0,
    submittedAt: 0,
  }
}
var qg = class extends ps {
  constructor(a = {}) {
    super(), (this.config = a), (this.#t = new Set()), (this.#e = new Map()), (this.#n = 0)
  }
  #t
  #e
  #n
  build(a, u, i) {
    const r = new Ng({
      mutationCache: this,
      mutationId: ++this.#n,
      options: a.defaultMutationOptions(u),
      state: i,
    })
    return this.add(r), r
  }
  add(a) {
    this.#t.add(a)
    const u = Pu(a)
    if (typeof u == 'string') {
      const i = this.#e.get(u)
      i ? i.push(a) : this.#e.set(u, [a])
    }
    this.notify({ type: 'added', mutation: a })
  }
  remove(a) {
    if (this.#t.delete(a)) {
      const u = Pu(a)
      if (typeof u == 'string') {
        const i = this.#e.get(u)
        if (i)
          if (i.length > 1) {
            const r = i.indexOf(a)
            r !== -1 && i.splice(r, 1)
          } else i[0] === a && this.#e.delete(u)
      }
    }
    this.notify({ type: 'removed', mutation: a })
  }
  canRun(a) {
    const u = Pu(a)
    if (typeof u == 'string') {
      const r = this.#e.get(u)?.find((o) => o.state.status === 'pending')
      return !r || r === a
    } else return !0
  }
  runNext(a) {
    const u = Pu(a)
    return typeof u == 'string'
      ? this.#e
          .get(u)
          ?.find((r) => r !== a && r.state.isPaused)
          ?.continue() ?? Promise.resolve()
      : Promise.resolve()
  }
  clear() {
    re.batch(() => {
      this.#t.forEach((a) => {
        this.notify({ type: 'removed', mutation: a })
      }),
        this.#t.clear(),
        this.#e.clear()
    })
  }
  getAll() {
    return Array.from(this.#t)
  }
  find(a) {
    const u = { exact: !0, ...a }
    return this.getAll().find((i) => Ty(u, i))
  }
  findAll(a = {}) {
    return this.getAll().filter((u) => Ty(a, u))
  }
  notify(a) {
    re.batch(() => {
      this.listeners.forEach((u) => {
        u(a)
      })
    })
  }
  resumePausedMutations() {
    const a = this.getAll().filter((u) => u.state.isPaused)
    return re.batch(() => Promise.all(a.map((u) => u.continue().catch(Ye))))
  }
}
function Pu(a) {
  return a.options.scope?.id
}
function Ay(a) {
  return {
    onFetch: (u, i) => {
      const r = u.options,
        o = u.fetchOptions?.meta?.fetchMore?.direction,
        f = u.state.data?.pages || [],
        d = u.state.data?.pageParams || []
      let y = { pages: [], pageParams: [] },
        m = 0
      const v = async () => {
        let g = !1
        const S = (w) => {
            Object.defineProperty(w, 'signal', {
              enumerable: !0,
              get: () => (
                u.signal.aborted
                  ? (g = !0)
                  : u.signal.addEventListener('abort', () => {
                      g = !0
                    }),
                u.signal
              ),
            })
          },
          T = tm(u.options, u.fetchOptions),
          D = async (w, U, Z) => {
            if (g) return Promise.reject()
            if (U == null && w.pages.length) return Promise.resolve(w)
            const G = {
              client: u.client,
              queryKey: u.queryKey,
              pageParam: U,
              direction: Z ? 'backward' : 'forward',
              meta: u.options.meta,
            }
            S(G)
            const X = await T(G),
              { maxPages: nt } = u.options,
              yt = Z ? Tg : Og
            return { pages: yt(w.pages, X, nt), pageParams: yt(w.pageParams, U, nt) }
          }
        if (o && f.length) {
          const w = o === 'backward',
            U = w ? jg : Dy,
            Z = { pages: f, pageParams: d },
            G = U(r, Z)
          y = await D(Z, G, w)
        } else {
          const w = a ?? f.length
          do {
            const U = m === 0 ? d[0] ?? r.initialPageParam : Dy(r, y)
            if (m > 0 && U == null) break
            ;(y = await D(y, U)), m++
          } while (m < w)
        }
        return y
      }
      u.options.persister
        ? (u.fetchFn = () =>
            u.options.persister?.(
              v,
              { client: u.client, queryKey: u.queryKey, meta: u.options.meta, signal: u.signal },
              i,
            ))
        : (u.fetchFn = v)
    },
  }
}
function Dy(a, { pages: u, pageParams: i }) {
  const r = u.length - 1
  return u.length > 0 ? a.getNextPageParam(u[r], u, i[r], i) : void 0
}
function jg(a, { pages: u, pageParams: i }) {
  return u.length > 0 ? a.getPreviousPageParam?.(u[0], u, i[0], i) : void 0
}
var Hg = class {
    #t
    #e
    #n
    #a
    #l
    #u
    #s
    #i
    constructor(a = {}) {
      ;(this.#t = a.queryCache || new Ug()),
        (this.#e = a.mutationCache || new qg()),
        (this.#n = a.defaultOptions || {}),
        (this.#a = new Map()),
        (this.#l = new Map()),
        (this.#u = 0)
    }
    mount() {
      this.#u++,
        this.#u === 1 &&
          ((this.#s = em.subscribe(async (a) => {
            a && (await this.resumePausedMutations(), this.#t.onFocus())
          })),
          (this.#i = ss.subscribe(async (a) => {
            a && (await this.resumePausedMutations(), this.#t.onOnline())
          })))
    }
    unmount() {
      this.#u--, this.#u === 0 && (this.#s?.(), (this.#s = void 0), this.#i?.(), (this.#i = void 0))
    }
    isFetching(a) {
      return this.#t.findAll({ ...a, fetchStatus: 'fetching' }).length
    }
    isMutating(a) {
      return this.#e.findAll({ ...a, status: 'pending' }).length
    }
    getQueryData(a) {
      const u = this.defaultQueryOptions({ queryKey: a })
      return this.#t.get(u.queryHash)?.state.data
    }
    ensureQueryData(a) {
      const u = this.defaultQueryOptions(a),
        i = this.#t.build(this, u),
        r = i.state.data
      return r === void 0
        ? this.fetchQuery(a)
        : (a.revalidateIfStale && i.isStaleByTime(Ey(u.staleTime, i)) && this.prefetchQuery(u),
          Promise.resolve(r))
    }
    getQueriesData(a) {
      return this.#t.findAll(a).map(({ queryKey: u, state: i }) => {
        const r = i.data
        return [u, r]
      })
    }
    setQueryData(a, u, i) {
      const r = this.defaultQueryOptions({ queryKey: a }),
        f = this.#t.get(r.queryHash)?.state.data,
        d = pg(u, f)
      if (d !== void 0) return this.#t.build(this, r).setData(d, { ...i, manual: !0 })
    }
    setQueriesData(a, u, i) {
      return re.batch(() =>
        this.#t.findAll(a).map(({ queryKey: r }) => [r, this.setQueryData(r, u, i)]),
      )
    }
    getQueryState(a) {
      const u = this.defaultQueryOptions({ queryKey: a })
      return this.#t.get(u.queryHash)?.state
    }
    removeQueries(a) {
      const u = this.#t
      re.batch(() => {
        u.findAll(a).forEach((i) => {
          u.remove(i)
        })
      })
    }
    resetQueries(a, u) {
      const i = this.#t
      return re.batch(
        () => (
          i.findAll(a).forEach((r) => {
            r.reset()
          }),
          this.refetchQueries({ type: 'active', ...a }, u)
        ),
      )
    }
    cancelQueries(a, u = {}) {
      const i = { revert: !0, ...u },
        r = re.batch(() => this.#t.findAll(a).map((o) => o.cancel(i)))
      return Promise.all(r).then(Ye).catch(Ye)
    }
    invalidateQueries(a, u = {}) {
      return re.batch(
        () => (
          this.#t.findAll(a).forEach((i) => {
            i.invalidate()
          }),
          a?.refetchType === 'none'
            ? Promise.resolve()
            : this.refetchQueries({ ...a, type: a?.refetchType ?? a?.type ?? 'active' }, u)
        ),
      )
    }
    refetchQueries(a, u = {}) {
      const i = { ...u, cancelRefetch: u.cancelRefetch ?? !0 },
        r = re.batch(() =>
          this.#t
            .findAll(a)
            .filter((o) => !o.isDisabled())
            .map((o) => {
              let f = o.fetch(void 0, i)
              return (
                i.throwOnError || (f = f.catch(Ye)),
                o.state.fetchStatus === 'paused' ? Promise.resolve() : f
              )
            }),
        )
      return Promise.all(r).then(Ye)
    }
    fetchQuery(a) {
      const u = this.defaultQueryOptions(a)
      u.retry === void 0 && (u.retry = !1)
      const i = this.#t.build(this, u)
      return i.isStaleByTime(Ey(u.staleTime, i)) ? i.fetch(u) : Promise.resolve(i.state.data)
    }
    prefetchQuery(a) {
      return this.fetchQuery(a).then(Ye).catch(Ye)
    }
    fetchInfiniteQuery(a) {
      return (a.behavior = Ay(a.pages)), this.fetchQuery(a)
    }
    prefetchInfiniteQuery(a) {
      return this.fetchInfiniteQuery(a).then(Ye).catch(Ye)
    }
    ensureInfiniteQueryData(a) {
      return (a.behavior = Ay(a.pages)), this.ensureQueryData(a)
    }
    resumePausedMutations() {
      return ss.isOnline() ? this.#e.resumePausedMutations() : Promise.resolve()
    }
    getQueryCache() {
      return this.#t
    }
    getMutationCache() {
      return this.#e
    }
    getDefaultOptions() {
      return this.#n
    }
    setDefaultOptions(a) {
      this.#n = a
    }
    setQueryDefaults(a, u) {
      this.#a.set(wi(a), { queryKey: a, defaultOptions: u })
    }
    getQueryDefaults(a) {
      const u = [...this.#a.values()],
        i = {}
      return (
        u.forEach((r) => {
          xi(a, r.queryKey) && Object.assign(i, r.defaultOptions)
        }),
        i
      )
    }
    setMutationDefaults(a, u) {
      this.#l.set(wi(a), { mutationKey: a, defaultOptions: u })
    }
    getMutationDefaults(a) {
      const u = [...this.#l.values()],
        i = {}
      return (
        u.forEach((r) => {
          xi(a, r.mutationKey) && Object.assign(i, r.defaultOptions)
        }),
        i
      )
    }
    defaultQueryOptions(a) {
      if (a._defaulted) return a
      const u = { ...this.#n.queries, ...this.getQueryDefaults(a.queryKey), ...a, _defaulted: !0 }
      return (
        u.queryHash || (u.queryHash = ho(u.queryKey, u)),
        u.refetchOnReconnect === void 0 && (u.refetchOnReconnect = u.networkMode !== 'always'),
        u.throwOnError === void 0 && (u.throwOnError = !!u.suspense),
        !u.networkMode && u.persister && (u.networkMode = 'offlineFirst'),
        u.queryFn === Sn && (u.enabled = !1),
        u
      )
    }
    defaultMutationOptions(a) {
      return a?._defaulted
        ? a
        : {
            ...this.#n.mutations,
            ...(a?.mutationKey && this.getMutationDefaults(a.mutationKey)),
            ...a,
            _defaulted: !0,
          }
    }
    clear() {
      this.#t.clear(), this.#e.clear()
    }
  },
  um = ft.createContext(void 0),
  Hb = (a) => {
    const u = ft.useContext(um)
    if (!u) throw new Error('No QueryClient set, use QueryClientProvider to set one')
    return u
  },
  Bg = ({ client: a, children: u }) => (
    ft.useEffect(
      () => (
        a.mount(),
        () => {
          a.unmount()
        }
      ),
      [a],
    ),
    k.jsx(um.Provider, { value: a, children: u })
  )
function Qg(a) {
  return a
}
function Gg(a) {
  return a.length === 0
    ? Qg
    : a.length === 1
    ? a[0]
    : function (i) {
        return a.reduce((r, o) => o(r), i)
      }
}
function sm(a) {
  const u = {
    subscribe(i) {
      let r = null,
        o = !1,
        f = !1,
        d = !1
      function y() {
        if (r === null) {
          d = !0
          return
        }
        f || ((f = !0), typeof r == 'function' ? r() : r && r.unsubscribe())
      }
      return (
        (r = a({
          next(m) {
            o || i.next?.(m)
          },
          error(m) {
            o || ((o = !0), i.error?.(m), y())
          },
          complete() {
            o || ((o = !0), i.complete?.(), y())
          },
        })),
        d && y(),
        { unsubscribe: y }
      )
    },
    pipe(...i) {
      return Gg(i)(u)
    },
  }
  return u
}
function Yg(a) {
  return (u) => {
    let i = 0,
      r = null
    const o = []
    function f() {
      r ||
        (r = u.subscribe({
          next(y) {
            for (const m of o) m.next?.(y)
          },
          error(y) {
            for (const m of o) m.error?.(y)
          },
          complete() {
            for (const y of o) y.complete?.()
          },
        }))
    }
    function d() {
      if (i === 0 && r) {
        const y = r
        ;(r = null), y.unsubscribe()
      }
    }
    return {
      subscribe(y) {
        return (
          i++,
          o.push(y),
          f(),
          {
            unsubscribe() {
              i--, d()
              const m = o.findIndex((v) => v === y)
              m > -1 && o.splice(m, 1)
            },
          }
        )
      },
    }
  }
}
class yo extends Error {
  constructor(u) {
    super(u), (this.name = 'ObservableAbortError'), Object.setPrototypeOf(this, yo.prototype)
  }
}
function Vg(a) {
  let u
  return {
    promise: new Promise((r, o) => {
      let f = !1
      function d() {
        f || ((f = !0), o(new yo('This operation was aborted.')), y.unsubscribe())
      }
      const y = a.subscribe({
        next(m) {
          ;(f = !0), r(m), d()
        },
        error(m) {
          ;(f = !0), o(m), d()
        },
        complete() {
          ;(f = !0), d()
        },
      })
      u = d
    }),
    abort: u,
  }
}
function Xg(a) {
  return sm((u) => {
    function i(o = 0, f = a.op) {
      const d = a.links[o]
      if (!d) throw new Error('No more links to execute - did you forget to add an ending link?')
      return d({
        op: f,
        next(m) {
          return i(o + 1, m)
        },
      })
    }
    return i().subscribe(u)
  })
}
function rm(a) {
  const u = Object.create(null)
  for (const i in a) {
    const r = a[i]
    u[r] = i
  }
  return u
}
const cm = {
  PARSE_ERROR: -32700,
  BAD_REQUEST: -32600,
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,
  UNAUTHORIZED: -32001,
  FORBIDDEN: -32003,
  NOT_FOUND: -32004,
  METHOD_NOT_SUPPORTED: -32005,
  TIMEOUT: -32008,
  CONFLICT: -32009,
  PRECONDITION_FAILED: -32012,
  PAYLOAD_TOO_LARGE: -32013,
  UNPROCESSABLE_CONTENT: -32022,
  TOO_MANY_REQUESTS: -32029,
  CLIENT_CLOSED_REQUEST: -32099,
}
rm(cm)
rm(cm)
function Kg(a) {
  return !!a && !Array.isArray(a) && typeof a == 'object'
}
let Zg = class extends Error {}
function kg(a) {
  if (a instanceof Error) return a
  const u = typeof a
  if (!(u === 'undefined' || u === 'function' || a === null)) {
    if (u !== 'object') return new Error(String(a))
    if (Kg(a)) {
      const i = new Zg()
      for (const r in a) i[r] = a[r]
      return i
    }
  }
}
function rs(a) {
  return !!a && !Array.isArray(a) && typeof a == 'object'
}
function Fg(a, u) {
  if ('error' in a) {
    const r = u.transformer.deserialize(a.error)
    return { ok: !1, error: { ...a, error: r } }
  }
  return {
    ok: !0,
    result: {
      ...a.result,
      ...((!a.result.type || a.result.type === 'data') && {
        type: 'data',
        data: u.transformer.deserialize(a.result.data),
      }),
    },
  }
}
class Kc extends Error {
  constructor() {
    super('Unable to transform response from server')
  }
}
function Jg(a, u) {
  let i
  try {
    i = Fg(a, u)
  } catch {
    throw new Kc()
  }
  if (!i.ok && (!rs(i.error.error) || typeof i.error.error.code != 'number')) throw new Kc()
  if (i.ok && !rs(i.result)) throw new Kc()
  return i
}
function Pg(a) {
  return a instanceof $e || (a instanceof Error && a.name === 'TRPCClientError')
}
function $g(a) {
  return (
    rs(a) && rs(a.error) && typeof a.error.code == 'number' && typeof a.error.message == 'string'
  )
}
class $e extends Error {
  static from(u, i = {}) {
    const r = u
    return Pg(r)
      ? (i.meta && (r.meta = { ...r.meta, ...i.meta }), r)
      : $g(r)
      ? new $e(r.error.message, { ...i, result: r })
      : r instanceof Error
      ? new $e(r.message, { ...i, cause: kg(r) })
      : new $e('Unknown error', { ...i, cause: r })
  }
  constructor(u, i) {
    const r = i?.cause
    super(u, { cause: r }),
      (this.meta = i?.meta),
      (this.cause = r),
      (this.shape = i?.result?.error),
      (this.data = i?.result?.error.data),
      (this.name = 'TRPCClientError'),
      Object.setPrototypeOf(this, $e.prototype)
  }
}
const Cy = (a) => typeof a == 'function'
function Wg(a) {
  if (a) return a
  if (typeof window < 'u' && Cy(window.fetch)) return window.fetch
  if (typeof globalThis < 'u' && Cy(globalThis.fetch)) return globalThis.fetch
  throw new Error('No fetch implementation found')
}
function Ig(a) {
  return (
    a ||
    (typeof window < 'u' && window.AbortController
      ? window.AbortController
      : typeof globalThis < 'u' && globalThis.AbortController
      ? globalThis.AbortController
      : null)
  )
}
function tS(a) {
  return {
    url: a.url.toString().replace(/\/$/, ''),
    fetch: a.fetch,
    AbortController: Ig(a.AbortController),
  }
}
function eS(a) {
  const u = {}
  for (let i = 0; i < a.length; i++) {
    const r = a[i]
    u[i] = r
  }
  return u
}
const nS = { query: 'GET', mutation: 'POST' }
function om(a) {
  return 'input' in a
    ? a.runtime.transformer.serialize(a.input)
    : eS(a.inputs.map((u) => a.runtime.transformer.serialize(u)))
}
const fm = (a) => {
    let u = a.url + '/' + a.path
    const i = []
    if (('inputs' in a && i.push('batch=1'), a.type === 'query')) {
      const r = om(a)
      r !== void 0 && i.push(`input=${encodeURIComponent(JSON.stringify(r))}`)
    }
    return i.length && (u += '?' + i.join('&')), u
  },
  lS = (a) => {
    if (a.type === 'query') return
    const u = om(a)
    return u !== void 0 ? JSON.stringify(u) : void 0
  },
  aS = (a) => uS({ ...a, contentTypeHeader: 'application/json', getUrl: fm, getBody: lS })
async function iS(a, u) {
  const i = a.getUrl(a),
    r = a.getBody(a),
    { type: o } = a,
    f = await a.headers()
  /* istanbul ignore if -- @preserve */ if (o === 'subscription')
    throw new Error('Subscriptions should use wsLink')
  const d = {
    ...(a.contentTypeHeader ? { 'content-type': a.contentTypeHeader } : {}),
    ...(a.batchModeHeader ? { 'trpc-batch-mode': a.batchModeHeader } : {}),
    ...f,
  }
  return Wg(a.fetch)(i, { method: nS[o], signal: u?.signal, body: r, headers: d })
}
function uS(a) {
  const u = a.AbortController ? new a.AbortController() : null,
    i = {}
  let r = !1
  return {
    promise: new Promise((d, y) => {
      iS(a, u)
        .then((m) => ((i.response = m), (r = !0), m.json()))
        .then((m) => {
          ;(i.responseJSON = m), d({ json: m, meta: i })
        })
        .catch((m) => {
          ;(r = !0), y($e.from(m, { meta: i }))
        })
    }),
    cancel: () => {
      r || u?.abort()
    },
  }
}
const Zc = () => {
  throw new Error(
    'Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new',
  )
}
function kc(a) {
  let u = null,
    i = null
  const r = () => {
    clearTimeout(i), (i = null), (u = null)
  }
  function o(y) {
    const m = [[]]
    let v = 0
    for (;;) {
      const g = y[v]
      if (!g) break
      const S = m[m.length - 1]
      if (g.aborted) {
        g.reject?.(new Error('Aborted')), v++
        continue
      }
      if (a.validate(S.concat(g).map((D) => D.key))) {
        S.push(g), v++
        continue
      }
      if (S.length === 0) {
        g.reject?.(new Error('Input is too big for a single dispatch')), v++
        continue
      }
      m.push([])
    }
    return m
  }
  function f() {
    const y = o(u)
    r()
    for (const m of y) {
      if (!m.length) continue
      const v = { items: m, cancel: Zc }
      for (const D of m) D.batch = v
      const g = (D, w) => {
          const U = v.items[D]
          U.resolve?.(w), (U.batch = null), (U.reject = null), (U.resolve = null)
        },
        { promise: S, cancel: T } = a.fetch(
          v.items.map((D) => D.key),
          g,
        )
      ;(v.cancel = T),
        S.then((D) => {
          for (let w = 0; w < D.length; w++) {
            const U = D[w]
            g(w, U)
          }
          for (const w of v.items) w.reject?.(new Error('Missing result')), (w.batch = null)
        }).catch((D) => {
          for (const w of v.items) w.reject?.(D), (w.batch = null)
        })
    }
  }
  function d(y) {
    const m = { aborted: !1, key: y, batch: null, resolve: Zc, reject: Zc },
      v = new Promise((S, T) => {
        ;(m.reject = T), (m.resolve = S), u || (u = []), u.push(m)
      })
    return (
      i || (i = setTimeout(f)),
      {
        promise: v,
        cancel: () => {
          ;(m.aborted = !0),
            m.batch?.items.every((S) => S.aborted) && (m.batch.cancel(), (m.batch = null))
        },
      }
    )
  }
  return { load: d }
}
function sS(a) {
  return function (i) {
    const r = tS(i),
      o = i.maxURLLength ?? 1 / 0
    return (f) => {
      const d = (S) => {
          const T = (w) => {
              if (o === 1 / 0) return !0
              const U = w.map((X) => X.path).join(','),
                Z = w.map((X) => X.input)
              return fm({ ...r, runtime: f, type: S, path: U, inputs: Z }).length <= o
            },
            D = a({ ...r, runtime: f, type: S, opts: i })
          return { validate: T, fetch: D }
        },
        y = kc(d('query')),
        m = kc(d('mutation')),
        v = kc(d('subscription')),
        g = { query: y, subscription: v, mutation: m }
      return ({ op: S }) =>
        sm((T) => {
          const D = g[S.type],
            { promise: w, cancel: U } = D.load(S)
          let Z
          return (
            w
              .then((G) => {
                Z = G
                const X = Jg(G.json, f)
                if (!X.ok) {
                  T.error($e.from(X.error, { meta: G.meta }))
                  return
                }
                T.next({ context: G.meta, result: X.result }), T.complete()
              })
              .catch((G) => {
                T.error($e.from(G, { meta: Z?.meta }))
              }),
            () => {
              U()
            }
          )
        })
    }
  }
}
const rS = (a) => (u) => {
    const i = u.map((d) => d.path).join(','),
      r = u.map((d) => d.input),
      { promise: o, cancel: f } = aS({
        ...a,
        path: i,
        inputs: r,
        headers() {
          return a.opts.headers
            ? typeof a.opts.headers == 'function'
              ? a.opts.headers({ opList: u })
              : a.opts.headers
            : {}
        },
      })
    return {
      promise: o.then((d) =>
        (Array.isArray(d.json) ? d.json : u.map(() => d.json)).map((v) => ({
          meta: d.meta,
          json: v,
        })),
      ),
      cancel: f,
    }
  },
  cS = sS(rS)
class dm {
  $request({ type: u, input: i, path: r, context: o = {} }) {
    return Xg({
      links: this.links,
      op: { id: ++this.requestId, type: u, path: r, input: i, context: o },
    }).pipe(Yg())
  }
  requestAsPromise(u) {
    const i = this.$request(u),
      { promise: r, abort: o } = Vg(i)
    return new Promise((d, y) => {
      u.signal?.addEventListener('abort', o),
        r
          .then((m) => {
            d(m.result.data)
          })
          .catch((m) => {
            y($e.from(m))
          })
    })
  }
  query(u, i, r) {
    return this.requestAsPromise({
      type: 'query',
      path: u,
      input: i,
      context: r?.context,
      signal: r?.signal,
    })
  }
  mutation(u, i, r) {
    return this.requestAsPromise({
      type: 'mutation',
      path: u,
      input: i,
      context: r?.context,
      signal: r?.signal,
    })
  }
  subscription(u, i, r) {
    return this.$request({
      type: 'subscription',
      path: u,
      input: i,
      context: r?.context,
    }).subscribe({
      next(f) {
        f.result.type === 'started'
          ? r.onStarted?.()
          : f.result.type === 'stopped'
          ? r.onStopped?.()
          : r.onData?.(f.result.data)
      },
      error(f) {
        r.onError?.(f)
      },
      complete() {
        r.onComplete?.()
      },
    })
  }
  constructor(u) {
    this.requestId = 0
    const i = (() => {
      const r = u.transformer
      return r
        ? 'input' in r
          ? u.transformer
          : { input: r, output: r }
        : {
            input: { serialize: (o) => o, deserialize: (o) => o },
            output: { serialize: (o) => o, deserialize: (o) => o },
          }
    })()
    ;(this.runtime = {
      transformer: {
        serialize: (r) => i.input.serialize(r),
        deserialize: (r) => i.output.deserialize(r),
      },
      combinedTransformer: i,
    }),
      (this.links = u.links.map((r) => r(this.runtime)))
  }
}
function oS(a) {
  return new dm(a)
}
function fS(a) {
  return a.__untypedClient
}
const dS = () => {},
  wy = (a) => {
    Object.freeze && Object.freeze(a)
  }
function hm(a, u, i) {
  var r, o
  const f = u.join('.')
  return (
    (r = i)[(o = f)] ??
      (r[o] = new Proxy(dS, {
        get(d, y) {
          if (!(typeof y != 'string' || y === 'then')) return hm(a, [...u, y], i)
        },
        apply(d, y, m) {
          const v = u[u.length - 1]
          let g = { args: m, path: u }
          return (
            v === 'call'
              ? (g = { args: m.length >= 2 ? [m[1]] : [], path: u.slice(0, -1) })
              : v === 'apply' && (g = { args: m.length >= 2 ? m[1] : [], path: u.slice(0, -1) }),
            wy(g.args),
            wy(g.path),
            a(g)
          )
        },
      })),
    i[f]
  )
}
const hS = (a) => hm(a, [], Object.create(null))
function mo(a) {
  return !!a && !Array.isArray(a) && typeof a == 'object'
}
function yS(a) {
  return typeof a == 'function'
}
const mS = typeof Symbol == 'function' && !!Symbol.asyncIterator
function vS(a) {
  return mS && mo(a) && Symbol.asyncIterator in a
}
function xy(a, u, i) {
  return (
    u in a
      ? Object.defineProperty(a, u, { value: i, enumerable: !0, configurable: !0, writable: !0 })
      : (a[u] = i),
    a
  )
}
class pS extends Error {}
function gS(a) {
  if (a instanceof Error) return a
  const u = typeof a
  if (!(u === 'undefined' || u === 'function' || a === null)) {
    if (u !== 'object') return new Error(String(a))
    if (mo(a)) {
      const i = new pS()
      for (const r in a) i[r] = a[r]
      return i
    }
  }
}
class zy extends Error {
  constructor(u) {
    const i = gS(u.cause),
      r = u.message ?? i?.message ?? u.code
    super(r, { cause: i }),
      xy(this, 'cause', void 0),
      xy(this, 'code', void 0),
      (this.code = u.code),
      (this.name = 'TRPCError'),
      this.cause || (this.cause = i)
  }
}
function SS(a) {
  return typeof a == 'function'
}
async function bS(a, u) {
  const { _def: i } = a
  let r = i.procedures[u]
  for (; !r; ) {
    const o = Object.keys(i.lazy).find((d) => u.startsWith(d))
    if (!o) return null
    await i.lazy[o].load(), (r = i.procedures[u])
  }
  return r
}
async function _S(a) {
  const { type: u, path: i } = a,
    r = await bS(a.router, i)
  if (!r || !SS(r) || (r._def.type !== u && !a.allowMethodOverride))
    throw new zy({ code: 'NOT_FOUND', message: `No "${u}"-procedure on path "${i}"` })
  /* istanbul ignore if -- @preserve */ if (
    r._def.type !== u &&
    a.allowMethodOverride &&
    r._def.type === 'subscription'
  )
    throw new zy({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'Method override is not supported for subscriptions',
    })
  return r(a)
}
var Uy, Ny
;(Uy = Symbol).dispose ?? (Uy.dispose = Symbol())
;(Ny = Symbol).asyncDispose ?? (Ny.asyncDispose = Symbol())
typeof window > 'u' ||
  'Deno' in window ||
  globalThis.process?.env?.NODE_ENV === 'test' ||
  globalThis.process?.env?.JEST_WORKER_ID ||
  globalThis.process?.env?.VITEST_WORKER_ID
function Ss(a) {
  return { path: a.path.join('.') }
}
function vo(a, u, i) {
  const r = a[0]
  let o = a[1]?.input
  return (
    i &&
      (o = {
        ...(o ?? {}),
        ...(i.pageParam ? { cursor: i.pageParam } : {}),
        direction: i.direction,
      }),
    [r.join('.'), o, u?.trpc]
  )
}
async function ES(a, u, i) {
  const o = u.getQueryCache().build(u, { queryKey: i })
  o.setState({ data: [], status: 'success' })
  const f = []
  for await (const d of a) f.push(d), o.setState({ data: [...f] })
  return f
}
function OS(a, u, i) {
  const r = a.flatMap((o) => o.split('.'))
  if (!u && (!i || i === 'any')) return r.length ? [r] : []
  if (i === 'infinite' && mo(u) && ('direction' in u || 'cursor' in u)) {
    const { cursor: o, direction: f, ...d } = u
    return [r, { input: d, type: 'infinite' }]
  }
  return [
    r,
    { ...(typeof u < 'u' && u !== Sn && { input: u }), ...(i && i !== 'any' && { type: i }) },
  ]
}
function ym(a) {
  const u = a.flatMap((i) => i.split('.'))
  return u.length ? [u] : []
}
function po(a) {
  return yS(a) ? a() : a
}
function TS(a) {
  const { query: u, path: i, queryKey: r, opts: o } = a,
    f = r[1]?.input === Sn
  return Object.assign(
    {
      ...o,
      queryKey: r,
      queryFn: f
        ? Sn
        : async (y) => {
            const m = {
              ...o,
              trpc: {
                ...o?.trpc,
                ...(o?.trpc?.abortOnUnmount ? { signal: y.signal } : { signal: null }),
              },
            }
            return await u(...vo(r, m, { direction: y.direction, pageParam: y.pageParam }))
          },
      initialPageParam: o?.initialCursor ?? null,
    },
    { trpc: Ss({ path: i }) },
  )
}
function RS(a) {
  const { mutate: u, path: i, opts: r, overrides: o } = a,
    f = po(a.queryClient),
    d = ym(i),
    y = f.defaultMutationOptions(f.getMutationDefaults(d)),
    m = o?.onSuccess ?? ((g) => g.originalFn())
  return {
    ...r,
    mutationKey: d,
    mutationFn: async (g) => await u(...vo([i, { input: g }], r)),
    onSuccess(...g) {
      return m({
        originalFn: () => r?.onSuccess?.(...g) ?? y?.onSuccess?.(...g),
        queryClient: f,
        meta: r?.meta ?? y?.meta ?? {},
      })
    },
    trpc: Ss({ path: i }),
  }
}
function MS(a) {
  const { query: u, path: i, queryKey: r, opts: o } = a,
    f = po(a.queryClient),
    d = r[1]?.input === Sn
  return Object.assign(
    {
      ...o,
      queryKey: r,
      queryFn: d
        ? Sn
        : async (m) => {
            const v = {
                ...o,
                trpc: {
                  ...o?.trpc,
                  ...(o?.trpc?.abortOnUnmount ? { signal: m.signal } : { signal: null }),
                },
              },
              g = await u(...vo(r, v))
            return vS(g) ? ES(g, f, r) : g
          },
    },
    { trpc: Ss({ path: i }) },
  )
}
const AS = (a) => {
  const { subscribe: u, path: i, queryKey: r, opts: o } = a,
    f = r[1]?.input,
    d = 'enabled' in o ? !!o.enabled : f !== Sn
  return {
    ...o,
    enabled: d,
    subscribe: (m) => u(i.join('.'), f ?? void 0, m),
    queryKey: r,
    trpc: Ss({ path: i }),
  }
}
function DS(a) {
  return {
    queryOptions: 'query',
    infiniteQueryOptions: 'infinite',
    subscriptionOptions: 'any',
    mutationOptions: 'any',
  }[a]
}
function CS(a) {
  const u = (i) => (r, o, f) =>
    'router' in a
      ? Promise.resolve(po(a.ctx)).then((y) =>
          _S({
            router: a.router,
            path: r,
            getRawInput: async () => o,
            ctx: y,
            type: i,
            signal: void 0,
          }),
        )
      : (a.client instanceof dm ? a.client : fS(a.client))[i](r, o, f)
  return hS(({ args: i, path: r }) => {
    const o = [...r],
      f = o.pop(),
      [d, y] = i
    function m() {
      const g = DS(f)
      return OS(o, d, g ?? 'any')
    }
    return {
      '~types': void 0,
      mutationKey: () => ym(o),
      queryKey: () => m(),
      queryFilter: () => ({ ...y, queryKey: m() }),
      infiniteQueryOptions: () => TS({ opts: y, path: o, queryKey: m(), query: u('query') }),
      queryOptions: () =>
        MS({ opts: y, path: o, queryClient: a.queryClient, queryKey: m(), query: u('query') }),
      mutationOptions: () =>
        RS({
          opts: d,
          path: o,
          queryClient: a.queryClient,
          mutate: u('mutation'),
          overrides: a.overrides?.mutations,
        }),
      subscriptionOptions: () =>
        AS({ opts: y, path: o, queryKey: m(), subscribe: u('subscription') }),
    }[f]()
  })
}
const wS = 'modulepreload',
  xS = function (a) {
    return '/' + a
  },
  Ly = {},
  mm = function (u, i, r) {
    let o = Promise.resolve()
    if (i && i.length > 0) {
      document.getElementsByTagName('link')
      const d = document.querySelector('meta[property=csp-nonce]'),
        y = d?.nonce || d?.getAttribute('nonce')
      o = Promise.allSettled(
        i.map((m) => {
          if (((m = xS(m)), m in Ly)) return
          Ly[m] = !0
          const v = m.endsWith('.css'),
            g = v ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${m}"]${g}`)) return
          const S = document.createElement('link')
          if (
            ((S.rel = v ? 'stylesheet' : wS),
            v || (S.as = 'script'),
            (S.crossOrigin = ''),
            (S.href = m),
            y && S.setAttribute('nonce', y),
            document.head.appendChild(S),
            v)
          )
            return new Promise((T, D) => {
              S.addEventListener('load', T),
                S.addEventListener('error', () => D(new Error(`Unable to preload CSS for ${m}`)))
            })
        }),
      )
    }
    function f(d) {
      const y = new Event('vite:preloadError', { cancelable: !0 })
      if (((y.payload = d), window.dispatchEvent(y), !y.defaultPrevented)) throw d
    }
    return o.then((d) => {
      for (const y of d || []) y.status === 'rejected' && f(y.reason)
      return u().catch(f)
    })
  },
  ht = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return qy(this.context.count)
    },
    getNextContextId() {
      return qy(this.context.count++)
    },
  }
function qy(a) {
  const u = String(a),
    i = u.length - 1
  return ht.context.id + (i ? String.fromCharCode(96 + i) : '') + u
}
function bi(a) {
  ht.context = a
}
const vm = !1,
  zS = (a, u) => a === u,
  cs = Symbol('solid-proxy'),
  pm = typeof Proxy == 'function',
  os = { equals: zS }
let gm = Em
const _n = 1,
  fs = 2,
  Sm = { owned: null, cleanups: null, context: null, owner: null },
  Fc = {}
var Xt = null
let Jc = null,
  US = null,
  Ht = null,
  ae = null,
  gn = null,
  bs = 0
function NS(a, u) {
  const i = Ht,
    r = Xt,
    o = a.length === 0,
    f = u === void 0 ? r : u,
    d = o ? Sm : { owned: null, cleanups: null, context: f ? f.context : null, owner: f },
    y = o ? a : () => a(() => bn(() => zi(d)))
  ;(Xt = d), (Ht = null)
  try {
    return El(y, !0)
  } finally {
    ;(Ht = i), (Xt = r)
  }
}
function Zn(a, u) {
  u = u ? Object.assign({}, os, u) : os
  const i = { value: a, observers: null, observerSlots: null, comparator: u.equals || void 0 },
    r = (o) => (typeof o == 'function' && (o = o(i.value)), _m(i, o))
  return [bm.bind(i), r]
}
function LS(a, u, i) {
  const r = _s(a, u, !0, _n)
  ma(r)
}
function bl(a, u, i) {
  const r = _s(a, u, !1, _n)
  ma(r)
}
function Qb(a, u, i) {
  gm = YS
  const r = _s(a, u, !1, _n)
  ;(!i || !i.render) && (r.user = !0), gn ? gn.push(r) : ma(r)
}
function _l(a, u, i) {
  i = i ? Object.assign({}, os, i) : os
  const r = _s(a, u, !0, 0)
  return (
    (r.observers = null),
    (r.observerSlots = null),
    (r.comparator = i.equals || void 0),
    ma(r),
    bm.bind(r)
  )
}
function qS(a) {
  return a && typeof a == 'object' && 'then' in a
}
function jS(a, u, i) {
  let r, o, f
  ;(r = !0), (o = a), (f = {})
  let d = null,
    y = Fc,
    m = null,
    v = !1,
    g = 'initialValue' in f,
    S = typeof r == 'function' && _l(r)
  const T = new Set(),
    [D, w] = (f.storage || Zn)(f.initialValue),
    [U, Z] = Zn(void 0),
    [G, X] = Zn(void 0, { equals: !1 }),
    [nt, yt] = Zn(g ? 'ready' : 'unresolved')
  ht.context &&
    ((m = ht.getNextContextId()),
    f.ssrLoadFrom === 'initial' ? (y = f.initialValue) : ht.load && ht.has(m) && (y = ht.load(m)))
  function Q(R, j, Y, K) {
    return (
      d === R &&
        ((d = null),
        K !== void 0 && (g = !0),
        (R === y || j === y) && f.onHydrated && queueMicrotask(() => f.onHydrated(K, { value: j })),
        (y = Fc),
        $(j, Y)),
      j
    )
  }
  function $(R, j) {
    El(() => {
      j === void 0 && w(() => R), yt(j !== void 0 ? 'errored' : g ? 'ready' : 'unresolved'), Z(j)
      for (const Y of T.keys()) Y.decrement()
      T.clear()
    }, !1)
  }
  function ct() {
    const R = BS,
      j = D(),
      Y = U()
    if (Y !== void 0 && !d) throw Y
    return Ht && Ht.user, j
  }
  function L(R = !0) {
    if (R !== !1 && v) return
    v = !1
    const j = S ? S() : r
    if (j == null || j === !1) {
      Q(d, bn(D))
      return
    }
    const Y = y !== Fc ? y : bn(() => o(j, { value: D(), refetching: R }))
    return qS(Y)
      ? ((d = Y),
        'value' in Y
          ? (Y.status === 'success' ? Q(d, Y.value, void 0, j) : Q(d, void 0, no(Y.value), j), Y)
          : ((v = !0),
            queueMicrotask(() => (v = !1)),
            El(() => {
              yt(g ? 'refreshing' : 'pending'), X()
            }, !1),
            Y.then(
              (K) => Q(Y, K, void 0, j),
              (K) => Q(Y, void 0, no(K), j),
            )))
      : (Q(d, Y, void 0, j), Y)
  }
  return (
    Object.defineProperties(ct, {
      state: { get: () => nt() },
      error: { get: () => U() },
      loading: {
        get() {
          const R = nt()
          return R === 'pending' || R === 'refreshing'
        },
      },
      latest: {
        get() {
          if (!g) return ct()
          const R = U()
          if (R && !d) throw R
          return D()
        },
      },
    }),
    S ? LS(() => L(!1)) : L(!1),
    [ct, { refetch: L, mutate: w }]
  )
}
function bn(a) {
  if (Ht === null) return a()
  const u = Ht
  Ht = null
  try {
    return a()
  } finally {
    Ht = u
  }
}
const [Gb, Yb] = Zn(!1)
function Vb(a, u) {
  const i = Symbol('context')
  return { id: i, Provider: VS(i), defaultValue: a }
}
function Xb(a) {
  let u
  return Xt && Xt.context && (u = Xt.context[a.id]) !== void 0 ? u : a.defaultValue
}
function HS(a) {
  const u = _l(a),
    i = _l(() => lo(u()))
  return (
    (i.toArray = () => {
      const r = i()
      return Array.isArray(r) ? r : r != null ? [r] : []
    }),
    i
  )
}
let BS
function bm() {
  if (this.sources && this.state)
    if (this.state === _n) ma(this)
    else {
      const a = ae
      ;(ae = null), El(() => hs(this), !1), (ae = a)
    }
  if (Ht) {
    const a = this.observers ? this.observers.length : 0
    Ht.sources
      ? (Ht.sources.push(this), Ht.sourceSlots.push(a))
      : ((Ht.sources = [this]), (Ht.sourceSlots = [a])),
      this.observers
        ? (this.observers.push(Ht), this.observerSlots.push(Ht.sources.length - 1))
        : ((this.observers = [Ht]), (this.observerSlots = [Ht.sources.length - 1]))
  }
  return this.value
}
function _m(a, u, i) {
  let r = a.value
  return (
    (!a.comparator || !a.comparator(r, u)) &&
      ((a.value = u),
      a.observers &&
        a.observers.length &&
        El(() => {
          for (let o = 0; o < a.observers.length; o += 1) {
            const f = a.observers[o],
              d = Jc && Jc.running
            d && Jc.disposed.has(f),
              (d ? !f.tState : !f.state) &&
                (f.pure ? ae.push(f) : gn.push(f), f.observers && Om(f)),
              d || (f.state = _n)
          }
          if (ae.length > 1e6) throw ((ae = []), new Error())
        }, !1)),
    u
  )
}
function ma(a) {
  if (!a.fn) return
  zi(a)
  const u = bs
  QS(a, a.value, u)
}
function QS(a, u, i) {
  let r
  const o = Xt,
    f = Ht
  Ht = Xt = a
  try {
    r = a.fn(u)
  } catch (d) {
    return (
      a.pure && ((a.state = _n), a.owned && a.owned.forEach(zi), (a.owned = null)),
      (a.updatedAt = i + 1),
      Tm(d)
    )
  } finally {
    ;(Ht = f), (Xt = o)
  }
  ;(!a.updatedAt || a.updatedAt <= i) &&
    (a.updatedAt != null && 'observers' in a ? _m(a, r) : (a.value = r), (a.updatedAt = i))
}
function _s(a, u, i, r = _n, o) {
  const f = {
    fn: a,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: u,
    owner: Xt,
    context: Xt ? Xt.context : null,
    pure: i,
  }
  return Xt === null || (Xt !== Sm && (Xt.owned ? Xt.owned.push(f) : (Xt.owned = [f]))), f
}
function ds(a) {
  if (a.state === 0) return
  if (a.state === fs) return hs(a)
  if (a.suspense && bn(a.suspense.inFallback)) return a.suspense.effects.push(a)
  const u = [a]
  for (; (a = a.owner) && (!a.updatedAt || a.updatedAt < bs); ) a.state && u.push(a)
  for (let i = u.length - 1; i >= 0; i--)
    if (((a = u[i]), a.state === _n)) ma(a)
    else if (a.state === fs) {
      const r = ae
      ;(ae = null), El(() => hs(a, u[0]), !1), (ae = r)
    }
}
function El(a, u) {
  if (ae) return a()
  let i = !1
  u || (ae = []), gn ? (i = !0) : (gn = []), bs++
  try {
    const r = a()
    return GS(i), r
  } catch (r) {
    i || (gn = null), (ae = null), Tm(r)
  }
}
function GS(a) {
  if ((ae && (Em(ae), (ae = null)), a)) return
  const u = gn
  ;(gn = null), u.length && El(() => gm(u), !1)
}
function Em(a) {
  for (let u = 0; u < a.length; u++) ds(a[u])
}
function YS(a) {
  let u,
    i = 0
  for (u = 0; u < a.length; u++) {
    const r = a[u]
    r.user ? (a[i++] = r) : ds(r)
  }
  if (ht.context) {
    if (ht.count) {
      ht.effects || (ht.effects = []), ht.effects.push(...a.slice(0, i))
      return
    }
    bi()
  }
  for (
    ht.effects &&
      (ht.done || !ht.count) &&
      ((a = [...ht.effects, ...a]), (i += ht.effects.length), delete ht.effects),
      u = 0;
    u < i;
    u++
  )
    ds(a[u])
}
function hs(a, u) {
  a.state = 0
  for (let i = 0; i < a.sources.length; i += 1) {
    const r = a.sources[i]
    if (r.sources) {
      const o = r.state
      o === _n ? r !== u && (!r.updatedAt || r.updatedAt < bs) && ds(r) : o === fs && hs(r, u)
    }
  }
}
function Om(a) {
  for (let u = 0; u < a.observers.length; u += 1) {
    const i = a.observers[u]
    i.state || ((i.state = fs), i.pure ? ae.push(i) : gn.push(i), i.observers && Om(i))
  }
}
function zi(a) {
  let u
  if (a.sources)
    for (; a.sources.length; ) {
      const i = a.sources.pop(),
        r = a.sourceSlots.pop(),
        o = i.observers
      if (o && o.length) {
        const f = o.pop(),
          d = i.observerSlots.pop()
        r < o.length && ((f.sourceSlots[d] = r), (o[r] = f), (i.observerSlots[r] = d))
      }
    }
  if (a.tOwned) {
    for (u = a.tOwned.length - 1; u >= 0; u--) zi(a.tOwned[u])
    delete a.tOwned
  }
  if (a.owned) {
    for (u = a.owned.length - 1; u >= 0; u--) zi(a.owned[u])
    a.owned = null
  }
  if (a.cleanups) {
    for (u = a.cleanups.length - 1; u >= 0; u--) a.cleanups[u]()
    a.cleanups = null
  }
  a.state = 0
}
function no(a) {
  return a instanceof Error
    ? a
    : new Error(typeof a == 'string' ? a : 'Unknown error', { cause: a })
}
function Tm(a, u = Xt) {
  throw no(a)
}
function lo(a) {
  if (typeof a == 'function' && !a.length) return lo(a())
  if (Array.isArray(a)) {
    const u = []
    for (let i = 0; i < a.length; i++) {
      const r = lo(a[i])
      Array.isArray(r) ? u.push.apply(u, r) : u.push(r)
    }
    return u
  }
  return a
}
function VS(a, u) {
  return function (r) {
    let o
    return (
      bl(
        () =>
          (o = bn(() => ((Xt.context = { ...Xt.context, [a]: r.value }), HS(() => r.children)))),
        void 0,
      ),
      o
    )
  }
}
function XS(a, u) {
  return bn(() => a(u || {}))
}
function $u() {
  return !0
}
const ao = {
  get(a, u, i) {
    return u === cs ? i : a.get(u)
  },
  has(a, u) {
    return u === cs ? !0 : a.has(u)
  },
  set: $u,
  deleteProperty: $u,
  getOwnPropertyDescriptor(a, u) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return a.get(u)
      },
      set: $u,
      deleteProperty: $u,
    }
  },
  ownKeys(a) {
    return a.keys()
  },
}
function Pc(a) {
  return (a = typeof a == 'function' ? a() : a) ? a : {}
}
function KS() {
  for (let a = 0, u = this.length; a < u; ++a) {
    const i = this[a]()
    if (i !== void 0) return i
  }
}
function Kb(...a) {
  let u = !1
  for (let d = 0; d < a.length; d++) {
    const y = a[d]
    ;(u = u || (!!y && cs in y)), (a[d] = typeof y == 'function' ? ((u = !0), _l(y)) : y)
  }
  if (pm && u)
    return new Proxy(
      {
        get(d) {
          for (let y = a.length - 1; y >= 0; y--) {
            const m = Pc(a[y])[d]
            if (m !== void 0) return m
          }
        },
        has(d) {
          for (let y = a.length - 1; y >= 0; y--) if (d in Pc(a[y])) return !0
          return !1
        },
        keys() {
          const d = []
          for (let y = 0; y < a.length; y++) d.push(...Object.keys(Pc(a[y])))
          return [...new Set(d)]
        },
      },
      ao,
    )
  const i = {},
    r = Object.create(null)
  for (let d = a.length - 1; d >= 0; d--) {
    const y = a[d]
    if (!y) continue
    const m = Object.getOwnPropertyNames(y)
    for (let v = m.length - 1; v >= 0; v--) {
      const g = m[v]
      if (g === '__proto__' || g === 'constructor') continue
      const S = Object.getOwnPropertyDescriptor(y, g)
      if (!r[g])
        r[g] = S.get
          ? { enumerable: !0, configurable: !0, get: KS.bind((i[g] = [S.get.bind(y)])) }
          : S.value !== void 0
          ? S
          : void 0
      else {
        const T = i[g]
        T && (S.get ? T.push(S.get.bind(y)) : S.value !== void 0 && T.push(() => S.value))
      }
    }
  }
  const o = {},
    f = Object.keys(r)
  for (let d = f.length - 1; d >= 0; d--) {
    const y = f[d],
      m = r[y]
    m && m.get ? Object.defineProperty(o, y, m) : (o[y] = m ? m.value : void 0)
  }
  return o
}
function ZS(a, ...u) {
  if (pm && cs in a) {
    const o = new Set(u.length > 1 ? u.flat() : u[0]),
      f = u.map(
        (d) =>
          new Proxy(
            {
              get(y) {
                return d.includes(y) ? a[y] : void 0
              },
              has(y) {
                return d.includes(y) && y in a
              },
              keys() {
                return d.filter((y) => y in a)
              },
            },
            ao,
          ),
      )
    return (
      f.push(
        new Proxy(
          {
            get(d) {
              return o.has(d) ? void 0 : a[d]
            },
            has(d) {
              return o.has(d) ? !1 : d in a
            },
            keys() {
              return Object.keys(a).filter((d) => !o.has(d))
            },
          },
          ao,
        ),
      ),
      f
    )
  }
  const i = {},
    r = u.map(() => ({}))
  for (const o of Object.getOwnPropertyNames(a)) {
    const f = Object.getOwnPropertyDescriptor(a, o),
      d = !f.get && !f.set && f.enumerable && f.writable && f.configurable
    let y = !1,
      m = 0
    for (const v of u)
      v.includes(o) && ((y = !0), d ? (r[m][o] = f.value) : Object.defineProperty(r[m], o, f)), ++m
    y || (d ? (i[o] = f.value) : Object.defineProperty(i, o, f))
  }
  return [...r, i]
}
function kS(a) {
  let u, i
  const r = (o) => {
    const f = ht.context
    if (f) {
      const [y, m] = Zn()
      ht.count || (ht.count = 0),
        ht.count++,
        (i || (i = a())).then((v) => {
          !ht.done && bi(f), ht.count--, m(() => v.default), bi()
        }),
        (u = y)
    } else if (!u) {
      const [y] = jS(() => (i || (i = a())).then((m) => m.default))
      u = y
    }
    let d
    return _l(() =>
      (d = u())
        ? bn(() => {
            if (!f || ht.done) return d(o)
            const y = ht.context
            bi(f)
            const m = d(o)
            return bi(y), m
          })
        : '',
    )
  }
  return (r.preload = () => i || ((i = a()).then((o) => (u = () => o.default)), i)), r
}
let FS = 0
function Zb() {
  return ht.context ? ht.getNextContextId() : `cl-${FS++}`
}
const JS = [
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'disabled',
    'formnovalidate',
    'hidden',
    'indeterminate',
    'inert',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'seamless',
    'selected',
  ],
  PS = new Set([
    'className',
    'value',
    'readOnly',
    'formNoValidate',
    'isMap',
    'noModule',
    'playsInline',
    ...JS,
  ]),
  $S = new Set(['innerHTML', 'textContent', 'innerText', 'children']),
  WS = Object.assign(Object.create(null), { className: 'class', htmlFor: 'for' }),
  IS = Object.assign(Object.create(null), {
    class: 'className',
    formnovalidate: { $: 'formNoValidate', BUTTON: 1, INPUT: 1 },
    ismap: { $: 'isMap', IMG: 1 },
    nomodule: { $: 'noModule', SCRIPT: 1 },
    playsinline: { $: 'playsInline', VIDEO: 1 },
    readonly: { $: 'readOnly', INPUT: 1, TEXTAREA: 1 },
  })
function tb(a, u) {
  const i = IS[a]
  return typeof i == 'object' ? (i[u] ? i.$ : void 0) : i
}
const eb = new Set([
    'beforeinput',
    'click',
    'dblclick',
    'contextmenu',
    'focusin',
    'focusout',
    'input',
    'keydown',
    'keyup',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'pointerdown',
    'pointermove',
    'pointerout',
    'pointerover',
    'pointerup',
    'touchend',
    'touchmove',
    'touchstart',
  ]),
  nb = new Set([
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'color-profile',
    'cursor',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feDropShadow',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'hkern',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'missing-glyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'set',
    'stop',
    'svg',
    'switch',
    'symbol',
    'text',
    'textPath',
    'tref',
    'tspan',
    'use',
    'view',
    'vkern',
  ]),
  lb = { xlink: 'http://www.w3.org/1999/xlink', xml: 'http://www.w3.org/XML/1998/namespace' }
function ab(a, u, i) {
  let r = i.length,
    o = u.length,
    f = r,
    d = 0,
    y = 0,
    m = u[o - 1].nextSibling,
    v = null
  for (; d < o || y < f; ) {
    if (u[d] === i[y]) {
      d++, y++
      continue
    }
    for (; u[o - 1] === i[f - 1]; ) o--, f--
    if (o === d) {
      const g = f < r ? (y ? i[y - 1].nextSibling : i[f - y]) : m
      for (; y < f; ) a.insertBefore(i[y++], g)
    } else if (f === y) for (; d < o; ) (!v || !v.has(u[d])) && u[d].remove(), d++
    else if (u[d] === i[f - 1] && i[y] === u[o - 1]) {
      const g = u[--o].nextSibling
      a.insertBefore(i[y++], u[d++].nextSibling), a.insertBefore(i[--f], g), (u[o] = i[f])
    } else {
      if (!v) {
        v = new Map()
        let S = y
        for (; S < f; ) v.set(i[S], S++)
      }
      const g = v.get(u[d])
      if (g != null)
        if (y < g && g < f) {
          let S = d,
            T = 1,
            D
          for (; ++S < o && S < f && !((D = v.get(u[S])) == null || D !== g + T); ) T++
          if (T > g - y) {
            const w = u[d]
            for (; y < g; ) a.insertBefore(i[y++], w)
          } else a.replaceChild(i[y++], u[d++])
        } else d++
      else u[d++].remove()
    }
  }
}
const jy = '_$DX_DELEGATE'
function ib(a, u, i, r = {}) {
  let o
  return (
    NS((f) => {
      ;(o = f), u === document ? a() : mb(u, a(), u.firstChild ? null : void 0, i)
    }, r.owner),
    () => {
      o(), (u.textContent = '')
    }
  )
}
function kb(a, u, i, r) {
  let o
  const f = () => {
      const y = document.createElement('template')
      return (y.innerHTML = a), y.content.firstChild
    },
    d = () => (o || (o = f())).cloneNode(!0)
  return (d.cloneNode = d), d
}
function ub(a, u = window.document) {
  const i = u[jy] || (u[jy] = new Set())
  for (let r = 0, o = a.length; r < o; r++) {
    const f = a[r]
    i.has(f) || (i.add(f), u.addEventListener(f, Sb))
  }
}
function io(a, u, i) {
  Ol(a) || (i == null ? a.removeAttribute(u) : a.setAttribute(u, i))
}
function sb(a, u, i, r) {
  Ol(a) || (r == null ? a.removeAttributeNS(u, i) : a.setAttributeNS(u, i, r))
}
function rb(a, u, i) {
  Ol(a) || (i ? a.setAttribute(u, '') : a.removeAttribute(u))
}
function cb(a, u) {
  Ol(a) || (u == null ? a.removeAttribute('class') : (a.className = u))
}
function ob(a, u, i, r) {
  if (r) Array.isArray(i) ? ((a[`$$${u}`] = i[0]), (a[`$$${u}Data`] = i[1])) : (a[`$$${u}`] = i)
  else if (Array.isArray(i)) {
    const o = i[0]
    a.addEventListener(u, (i[0] = (f) => o.call(a, i[1], f)))
  } else a.addEventListener(u, i, typeof i != 'function' && i)
}
function fb(a, u, i = {}) {
  const r = Object.keys(u || {}),
    o = Object.keys(i)
  let f, d
  for (f = 0, d = o.length; f < d; f++) {
    const y = o[f]
    !y || y === 'undefined' || u[y] || (Hy(a, y, !1), delete i[y])
  }
  for (f = 0, d = r.length; f < d; f++) {
    const y = r[f],
      m = !!u[y]
    !y || y === 'undefined' || i[y] === m || !m || (Hy(a, y, !0), (i[y] = m))
  }
  return i
}
function db(a, u, i) {
  if (!u) return i ? io(a, 'style') : u
  const r = a.style
  if (typeof u == 'string') return (r.cssText = u)
  typeof i == 'string' && (r.cssText = i = void 0), i || (i = {}), u || (u = {})
  let o, f
  for (f in i) u[f] == null && r.removeProperty(f), delete i[f]
  for (f in u) (o = u[f]), o !== i[f] && (r.setProperty(f, o), (i[f] = o))
  return i
}
function hb(a, u = {}, i, r) {
  const o = {}
  return (
    r || bl(() => (o.children = Ui(a, u.children, o.children))),
    bl(() => typeof u.ref == 'function' && yb(u.ref, a)),
    bl(() => vb(a, u, i, !0, o, !0)),
    o
  )
}
function yb(a, u, i) {
  return bn(() => a(u, i))
}
function mb(a, u, i, r) {
  if ((i !== void 0 && !r && (r = []), typeof u != 'function')) return Ui(a, u, r, i)
  bl((o) => Ui(a, u(), o, i), r)
}
function vb(a, u, i, r, o = {}, f = !1) {
  u || (u = {})
  for (const d in o)
    if (!(d in u)) {
      if (d === 'children') continue
      o[d] = By(a, d, null, o[d], i, f, u)
    }
  for (const d in u) {
    if (d === 'children') continue
    const y = u[d]
    o[d] = By(a, d, y, o[d], i, f, u)
  }
}
function pb(a) {
  let u, i
  return !Ol() || !(u = ht.registry.get((i = bb())))
    ? a()
    : (ht.completed && ht.completed.add(u), ht.registry.delete(i), u)
}
function Ol(a) {
  return !!ht.context && !ht.done && (!a || a.isConnected)
}
function gb(a) {
  return a.toLowerCase().replace(/-([a-z])/g, (u, i) => i.toUpperCase())
}
function Hy(a, u, i) {
  const r = u.trim().split(/\s+/)
  for (let o = 0, f = r.length; o < f; o++) a.classList.toggle(r[o], i)
}
function By(a, u, i, r, o, f, d) {
  let y, m, v, g, S
  if (u === 'style') return db(a, i, r)
  if (u === 'classList') return fb(a, i, r)
  if (i === r) return r
  if (u === 'ref') f || i(a)
  else if (u.slice(0, 3) === 'on:') {
    const T = u.slice(3)
    r && a.removeEventListener(T, r, typeof r != 'function' && r),
      i && a.addEventListener(T, i, typeof i != 'function' && i)
  } else if (u.slice(0, 10) === 'oncapture:') {
    const T = u.slice(10)
    r && a.removeEventListener(T, r, !0), i && a.addEventListener(T, i, !0)
  } else if (u.slice(0, 2) === 'on') {
    const T = u.slice(2).toLowerCase(),
      D = eb.has(T)
    if (!D && r) {
      const w = Array.isArray(r) ? r[0] : r
      a.removeEventListener(T, w)
    }
    ;(D || i) && (ob(a, T, i, D), D && ub([T]))
  } else if (u.slice(0, 5) === 'attr:') io(a, u.slice(5), i)
  else if (u.slice(0, 5) === 'bool:') rb(a, u.slice(5), i)
  else if (
    (S = u.slice(0, 5) === 'prop:') ||
    (v = $S.has(u)) ||
    (!o && ((g = tb(u, a.tagName)) || (m = PS.has(u)))) ||
    (y = a.nodeName.includes('-') || 'is' in d)
  ) {
    if (S) (u = u.slice(5)), (m = !0)
    else if (Ol(a)) return i
    u === 'class' || u === 'className' ? cb(a, i) : y && !m && !v ? (a[gb(u)] = i) : (a[g || u] = i)
  } else {
    const T = o && u.indexOf(':') > -1 && lb[u.split(':')[0]]
    T ? sb(a, T, u, i) : io(a, WS[u] || u, i)
  }
  return i
}
function Sb(a) {
  if (ht.registry && ht.events && ht.events.find(([m, v]) => v === a)) return
  let u = a.target
  const i = `$$${a.type}`,
    r = a.target,
    o = a.currentTarget,
    f = (m) => Object.defineProperty(a, 'target', { configurable: !0, value: m }),
    d = () => {
      const m = u[i]
      if (m && !u.disabled) {
        const v = u[`${i}Data`]
        if ((v !== void 0 ? m.call(u, v, a) : m.call(u, a), a.cancelBubble)) return
      }
      return (
        u.host && typeof u.host != 'string' && !u.host._$host && u.contains(a.target) && f(u.host),
        !0
      )
    },
    y = () => {
      for (; d() && (u = u._$host || u.parentNode || u.host); );
    }
  if (
    (Object.defineProperty(a, 'currentTarget', {
      configurable: !0,
      get() {
        return u || document
      },
    }),
    ht.registry && !ht.done && (ht.done = _$HY.done = !0),
    a.composedPath)
  ) {
    const m = a.composedPath()
    f(m[0])
    for (let v = 0; v < m.length - 2 && ((u = m[v]), !!d()); v++) {
      if (u._$host) {
        ;(u = u._$host), y()
        break
      }
      if (u.parentNode === o) break
    }
  } else y()
  f(r)
}
function Ui(a, u, i, r, o) {
  const f = Ol(a)
  if (f) {
    !i && (i = [...a.childNodes])
    let m = []
    for (let v = 0; v < i.length; v++) {
      const g = i[v]
      g.nodeType === 8 && g.data.slice(0, 2) === '!$' ? g.remove() : m.push(g)
    }
    i = m
  }
  for (; typeof i == 'function'; ) i = i()
  if (u === i) return i
  const d = typeof u,
    y = r !== void 0
  if (((a = (y && i[0] && i[0].parentNode) || a), d === 'string' || d === 'number')) {
    if (f || (d === 'number' && ((u = u.toString()), u === i))) return i
    if (y) {
      let m = i[0]
      m && m.nodeType === 3 ? m.data !== u && (m.data = u) : (m = document.createTextNode(u)),
        (i = ia(a, i, r, m))
    } else i !== '' && typeof i == 'string' ? (i = a.firstChild.data = u) : (i = a.textContent = u)
  } else if (u == null || d === 'boolean') {
    if (f) return i
    i = ia(a, i, r)
  } else {
    if (d === 'function')
      return (
        bl(() => {
          let m = u()
          for (; typeof m == 'function'; ) m = m()
          i = Ui(a, m, i, r)
        }),
        () => i
      )
    if (Array.isArray(u)) {
      const m = [],
        v = i && Array.isArray(i)
      if (uo(m, u, i, o)) return bl(() => (i = Ui(a, m, i, r, !0))), () => i
      if (f) {
        if (!m.length) return i
        if (r === void 0) return (i = [...a.childNodes])
        let g = m[0]
        if (g.parentNode !== a) return i
        const S = [g]
        for (; (g = g.nextSibling) !== r; ) S.push(g)
        return (i = S)
      }
      if (m.length === 0) {
        if (((i = ia(a, i, r)), y)) return i
      } else v ? (i.length === 0 ? Qy(a, m, r) : ab(a, i, m)) : (i && ia(a), Qy(a, m))
      i = m
    } else if (u.nodeType) {
      if (f && u.parentNode) return (i = y ? [u] : u)
      if (Array.isArray(i)) {
        if (y) return (i = ia(a, i, r, u))
        ia(a, i, null, u)
      } else
        i == null || i === '' || !a.firstChild ? a.appendChild(u) : a.replaceChild(u, a.firstChild)
      i = u
    }
  }
  return i
}
function uo(a, u, i, r) {
  let o = !1
  for (let f = 0, d = u.length; f < d; f++) {
    let y = u[f],
      m = i && i[a.length],
      v
    if (!(y == null || y === !0 || y === !1))
      if ((v = typeof y) == 'object' && y.nodeType) a.push(y)
      else if (Array.isArray(y)) o = uo(a, y, m) || o
      else if (v === 'function')
        if (r) {
          for (; typeof y == 'function'; ) y = y()
          o = uo(a, Array.isArray(y) ? y : [y], Array.isArray(m) ? m : [m]) || o
        } else a.push(y), (o = !0)
      else {
        const g = String(y)
        m && m.nodeType === 3 && m.data === g ? a.push(m) : a.push(document.createTextNode(g))
      }
  }
  return o
}
function Qy(a, u, i = null) {
  for (let r = 0, o = u.length; r < o; r++) a.insertBefore(u[r], i)
}
function ia(a, u, i, r) {
  if (i === void 0) return (a.textContent = '')
  const o = r || document.createTextNode('')
  if (u.length) {
    let f = !1
    for (let d = u.length - 1; d >= 0; d--) {
      const y = u[d]
      if (o !== y) {
        const m = y.parentNode === a
        !f && !d ? (m ? a.replaceChild(o, y) : a.insertBefore(o, i)) : m && y.remove()
      } else f = !0
    }
  } else a.insertBefore(o, i)
  return [o]
}
function bb() {
  return ht.getNextContextId()
}
const _b = 'http://www.w3.org/2000/svg'
function Eb(a, u = !1) {
  return u ? document.createElementNS(_b, a) : document.createElement(a)
}
function Ob(a, u) {
  const i = _l(a)
  return _l(() => {
    const r = i()
    switch (typeof r) {
      case 'function':
        return bn(() => r(u))
      case 'string':
        const o = nb.has(r),
          f = ht.context ? pb() : Eb(r, o)
        return hb(f, u, o), f
    }
  })
}
function Fb(a) {
  const [, u] = ZS(a, ['component'])
  return Ob(() => a.component, u)
}
var Rm = (a) => {
    throw TypeError(a)
  },
  Mm = (a, u, i) => u.has(a) || Rm('Cannot ' + i),
  Ne = (a, u, i) => (Mm(a, u, 'read from private field'), u.get(a)),
  Kn = (a, u, i) =>
    u.has(a)
      ? Rm('Cannot add the same private member more than once')
      : u instanceof WeakSet
      ? u.add(a)
      : u.set(a, i),
  Le = (a, u, i, r) => (Mm(a, u, 'write to private field'), u.set(a, i), i),
  _i,
  Ei,
  Oi,
  Ti,
  Ri,
  sa,
  Mi,
  ts
class Tb {
  constructor(u) {
    Kn(this, _i),
      Kn(this, Ei),
      Kn(this, Oi),
      Kn(this, Ti),
      Kn(this, Ri),
      Kn(this, sa, !1),
      Kn(this, Mi),
      Kn(this, ts)
    const { router: i, routerState: r, position: o, initialIsOpen: f, shadowDOMTarget: d } = u
    Le(this, _i, Zn(i)),
      Le(this, Ei, Zn(r)),
      Le(this, Oi, o ?? 'bottom-left'),
      Le(this, Ti, f ?? !1),
      Le(this, Ri, d)
  }
  mount(u) {
    if (Ne(this, sa)) throw new Error('Devtools is already mounted')
    const i = ib(() => {
      const [r] = Ne(this, _i),
        [o] = Ne(this, Ei),
        f = Ne(this, Oi),
        d = Ne(this, Ti),
        y = Ne(this, Ri)
      let m
      return (
        Ne(this, Mi)
          ? (m = Ne(this, Mi))
          : ((m = kS(() => mm(() => import('./FloatingTanStackRouterDevtools-Cjlvtpdg.js'), []))),
            Le(this, Mi, m)),
        XS(m, { position: f, initialIsOpen: d, shadowDOMTarget: y, router: r, routerState: o })
      )
    }, u)
    Le(this, sa, !0), Le(this, ts, i)
  }
  unmount() {
    var u
    if (!Ne(this, sa)) throw new Error('Devtools is not mounted')
    ;(u = Ne(this, ts)) == null || u.call(this), Le(this, sa, !1)
  }
  setRouter(u) {
    Ne(this, _i)[1](u)
  }
  setRouterState(u) {
    Ne(this, Ei)[1](u)
  }
  setOptions(u) {
    u.position !== void 0 && Le(this, Oi, u.position),
      u.initialIsOpen !== void 0 && Le(this, Ti, u.initialIsOpen),
      u.shadowDOMTarget !== void 0 && Le(this, Ri, u.shadowDOMTarget)
  }
}
_i = new WeakMap()
Ei = new WeakMap()
Oi = new WeakMap()
Ti = new WeakMap()
Ri = new WeakMap()
sa = new WeakMap()
Mi = new WeakMap()
ts = new WeakMap()
function Rb(a) {
  const {
      initialIsOpen: u,
      panelProps: i,
      closeButtonProps: r,
      toggleButtonProps: o,
      position: f,
      containerElement: d,
      shadowDOMTarget: y,
      router: m,
    } = a,
    v = We({ warn: m !== void 0 }),
    g = m ?? v,
    S = ce({ router: g }),
    T = ft.useRef(null),
    [D] = ft.useState(
      () =>
        new Tb({
          initialIsOpen: u,
          panelProps: i,
          closeButtonProps: r,
          toggleButtonProps: o,
          position: f,
          containerElement: d,
          shadowDOMTarget: y,
          router: g,
          routerState: S,
        }),
    )
  return (
    ft.useEffect(() => {
      D.setRouter(g)
    }, [D, g]),
    ft.useEffect(() => {
      D.setRouterState(S)
    }, [D, S]),
    ft.useEffect(() => {
      D.setOptions({
        initialIsOpen: u,
        panelProps: i,
        closeButtonProps: r,
        toggleButtonProps: o,
        position: f,
        containerElement: d,
        shadowDOMTarget: y,
      })
    }, [D, u, i, r, o, f, d, y]),
    ft.useEffect(
      () => (
        T.current && D.mount(T.current),
        () => {
          D.unmount()
        }
      ),
      [D],
    ),
    k.jsx(ft.Fragment, { children: k.jsx('div', { ref: T }) })
  )
}
const Mb = Rb
console.warn(
  '[@tanstack/router-devtools] This package has moved to @tanstack/react-router-devtools. Please switch to the new package at your earliest convenience, as this package will be dropped in the next major version release.',
)
var Ab = function () {
  return null
}
function Am() {
  return k.jsx('div', { className: 'inline-block animate-spin px-3', children: '⍥' })
}
const Dm = Vp()({ component: Db })
function Db() {
  const a = ce({ select: (u) => u.isLoading })
  return k.jsxs(k.Fragment, {
    children: [
      k.jsxs('div', {
        className: 'min-h-screen flex flex-col',
        children: [
          k.jsxs('div', {
            className: 'flex items-center border-b gap-2',
            children: [
              k.jsx('h1', { className: 'text-3xl p-2', children: 'With tRPC + TanStack Query' }),
              k.jsx('div', {
                className: `text-3xl duration-300 delay-0 opacity-0 ${
                  a ? ' duration-1000 opacity-40' : ''
                }`,
                children: k.jsx(Am, {}),
              }),
            ],
          }),
          k.jsxs('div', {
            className: 'flex-1 flex',
            children: [
              k.jsx('div', {
                className: 'divide-y w-56',
                children: [
                  ['/', 'Home'],
                  ['/dashboard', 'Dashboard'],
                ].map(([u, i]) =>
                  k.jsx(
                    'div',
                    { children: k.jsx('a', { href: u, className: 'nav-link', children: i }) },
                    u,
                  ),
                ),
              }),
              k.jsx('div', {
                className: 'flex-1 border-l border-gray-200',
                children: ft.createElement(fo),
              }),
            ],
          }),
        ],
      }),
      ft.createElement(Mb, { position: 'bottom-left' }),
      ft.createElement(Ab, { position: 'bottom', buttonPosition: 'bottom-right' }),
    ],
  })
}
const Cb = () => mm(() => import('./index-B0E86zfj.js'), []),
  Cm = Zp('/')({ component: ug(Cb, 'component', () => Cm.ssr) }),
  wb = Cm.update({ id: '/', path: '/', getParentRoute: () => Dm }),
  xb = { IndexRoute: wb },
  zb = Dm._addFileChildren(xb)._addFileTypes(),
  so = new Hg(),
  Ub = CS({ client: oS({ links: [cS({ url: 'http://localhost:9157/trpc' })] }), queryClient: so })
function Nb() {
  return fg({
    routeTree: zb,
    scrollRestoration: !0,
    defaultPreload: 'intent',
    context: { trpc: Ub, queryClient: so },
    defaultPendingComponent: () =>
      k.jsx('div', { className: 'p-2 text-2xl', children: k.jsx(Am, {}) }),
    Wrap: function ({ children: i }) {
      return k.jsx(Bg, { client: so, children: i })
    },
  })
}
const Lb = Nb(),
  Gy = document.getElementById('root')
Gy.innerHTML ||
  rp.createRoot(Gy).render(k.jsx(tp.StrictMode, { children: k.jsx(vg, { router: Lb }) }))
export {
  Kb as A,
  ub as B,
  Ve as C,
  hb as D,
  ob as E,
  he as F,
  dp as G,
  Zb as H,
  Fb as I,
  ps as S,
  Ey as a,
  gg as b,
  xg as c,
  Eg as d,
  re as e,
  em as f,
  ft as g,
  Vb as h,
  gs as i,
  k as j,
  Xb as k,
  Zn as l,
  Qb as m,
  Ye as n,
  bl as o,
  Ag as p,
  _l as q,
  bg as r,
  jb as s,
  Sg as t,
  Hb as u,
  kb as v,
  mb as w,
  XS as x,
  cb as y,
  io as z,
}
