import {
  S as W,
  p as D,
  r as p,
  s as E,
  a as O,
  n as q,
  i as I,
  b as U,
  t as z,
  f as V,
  c as $,
  d as k,
  e as H,
  g as m,
  u as K,
  j as h,
} from './index-Cec-sxZn.js'
var X = class extends W {
  constructor(e, t) {
    super(),
      (this.options = t),
      (this.#s = e),
      (this.#r = null),
      (this.#i = D()),
      this.options.experimental_prefetchInRender ||
        this.#i.reject(new Error('experimental_prefetchInRender feature flag is not enabled')),
      this.bindMethods(),
      this.setOptions(t)
  }
  #s
  #e = void 0
  #p = void 0
  #t = void 0
  #n
  #l
  #i
  #r
  #m
  #u
  #d
  #o
  #h
  #a
  #f = new Set()
  bindMethods() {
    this.refetch = this.refetch.bind(this)
  }
  onSubscribe() {
    this.listeners.size === 1 &&
      (this.#e.addObserver(this),
      M(this.#e, this.options) ? this.#c() : this.updateResult(),
      this.#b())
  }
  onUnsubscribe() {
    this.hasListeners() || this.destroy()
  }
  shouldFetchOnReconnect() {
    return T(this.#e, this.options, this.options.refetchOnReconnect)
  }
  shouldFetchOnWindowFocus() {
    return T(this.#e, this.options, this.options.refetchOnWindowFocus)
  }
  destroy() {
    ;(this.listeners = new Set()), this.#R(), this.#x(), this.#e.removeObserver(this)
  }
  setOptions(e, t) {
    const s = this.options,
      r = this.#e
    if (
      ((this.options = this.#s.defaultQueryOptions(e)),
      this.options.enabled !== void 0 &&
        typeof this.options.enabled != 'boolean' &&
        typeof this.options.enabled != 'function' &&
        typeof p(this.options.enabled, this.#e) != 'boolean')
    )
      throw new Error('Expected enabled to be a boolean or a callback that returns a boolean')
    this.#O(),
      this.#e.setOptions(this.options),
      s._defaulted &&
        !E(this.options, s) &&
        this.#s
          .getQueryCache()
          .notify({ type: 'observerOptionsUpdated', query: this.#e, observer: this })
    const n = this.hasListeners()
    n && L(this.#e, r, this.options, s) && this.#c(),
      this.updateResult(t),
      n &&
        (this.#e !== r ||
          p(this.options.enabled, this.#e) !== p(s.enabled, this.#e) ||
          O(this.options.staleTime, this.#e) !== O(s.staleTime, this.#e)) &&
        this.#g()
    const l = this.#v()
    n &&
      (this.#e !== r ||
        p(this.options.enabled, this.#e) !== p(s.enabled, this.#e) ||
        l !== this.#a) &&
      this.#y(l)
  }
  getOptimisticResult(e) {
    const t = this.#s.getQueryCache().build(this.#s, e),
      s = this.createResult(t, e)
    return J(this, s) && ((this.#t = s), (this.#l = this.options), (this.#n = this.#e.state)), s
  }
  getCurrentResult() {
    return this.#t
  }
  trackResult(e, t) {
    const s = {}
    return (
      Object.keys(e).forEach((r) => {
        Object.defineProperty(s, r, {
          configurable: !1,
          enumerable: !0,
          get: () => (this.trackProp(r), t?.(r), e[r]),
        })
      }),
      s
    )
  }
  trackProp(e) {
    this.#f.add(e)
  }
  getCurrentQuery() {
    return this.#e
  }
  refetch({ ...e } = {}) {
    return this.fetch({ ...e })
  }
  fetchOptimistic(e) {
    const t = this.#s.defaultQueryOptions(e),
      s = this.#s.getQueryCache().build(this.#s, t)
    return s.fetch().then(() => this.createResult(s, t))
  }
  fetch(e) {
    return this.#c({ ...e, cancelRefetch: e.cancelRefetch ?? !0 }).then(
      () => (this.updateResult(), this.#t),
    )
  }
  #c(e) {
    this.#O()
    let t = this.#e.fetch(this.options, e)
    return e?.throwOnError || (t = t.catch(q)), t
  }
  #g() {
    this.#R()
    const e = O(this.options.staleTime, this.#e)
    if (I || this.#t.isStale || !U(e)) return
    const s = z(this.#t.dataUpdatedAt, e) + 1
    this.#o = setTimeout(() => {
      this.#t.isStale || this.updateResult()
    }, s)
  }
  #v() {
    return (
      (typeof this.options.refetchInterval == 'function'
        ? this.options.refetchInterval(this.#e)
        : this.options.refetchInterval) ?? !1
    )
  }
  #y(e) {
    this.#x(),
      (this.#a = e),
      !(I || p(this.options.enabled, this.#e) === !1 || !U(this.#a) || this.#a === 0) &&
        (this.#h = setInterval(() => {
          ;(this.options.refetchIntervalInBackground || V.isFocused()) && this.#c()
        }, this.#a))
  }
  #b() {
    this.#g(), this.#y(this.#v())
  }
  #R() {
    this.#o && (clearTimeout(this.#o), (this.#o = void 0))
  }
  #x() {
    this.#h && (clearInterval(this.#h), (this.#h = void 0))
  }
  createResult(e, t) {
    const s = this.#e,
      r = this.options,
      n = this.#t,
      l = this.#n,
      i = this.#l,
      o = e !== s ? e.state : this.#p,
      { state: u } = e
    let a = { ...u },
      R = !1,
      d
    if (t._optimisticResults) {
      const c = this.hasListeners(),
        v = !c && M(e, t),
        y = c && L(e, s, t, r)
      ;(v || y) && (a = { ...a, ...$(u.data, e.options) }),
        t._optimisticResults === 'isRestoring' && (a.fetchStatus = 'idle')
    }
    let { error: j, errorUpdatedAt: F, status: g } = a
    if (t.select && a.data !== void 0)
      if (n && a.data === l?.data && t.select === this.#m) d = this.#u
      else
        try {
          ;(this.#m = t.select),
            (d = t.select(a.data)),
            (d = k(n?.data, d, t)),
            (this.#u = d),
            (this.#r = null)
        } catch (c) {
          this.#r = c
        }
    else d = a.data
    if (t.placeholderData !== void 0 && d === void 0 && g === 'pending') {
      let c
      if (n?.isPlaceholderData && t.placeholderData === i?.placeholderData) c = n.data
      else if (
        ((c =
          typeof t.placeholderData == 'function'
            ? t.placeholderData(this.#d?.state.data, this.#d)
            : t.placeholderData),
        t.select && c !== void 0)
      )
        try {
          ;(c = t.select(c)), (this.#r = null)
        } catch (v) {
          this.#r = v
        }
      c !== void 0 && ((g = 'success'), (d = k(n?.data, c, t)), (R = !0))
    }
    this.#r && ((j = this.#r), (d = this.#u), (F = Date.now()), (g = 'error'))
    const S = a.fetchStatus === 'fetching',
      C = g === 'pending',
      w = g === 'error',
      N = C && S,
      P = d !== void 0,
      f = {
        status: g,
        fetchStatus: a.fetchStatus,
        isPending: C,
        isSuccess: g === 'success',
        isError: w,
        isInitialLoading: N,
        isLoading: N,
        data: d,
        dataUpdatedAt: a.dataUpdatedAt,
        error: j,
        errorUpdatedAt: F,
        failureCount: a.fetchFailureCount,
        failureReason: a.fetchFailureReason,
        errorUpdateCount: a.errorUpdateCount,
        isFetched: a.dataUpdateCount > 0 || a.errorUpdateCount > 0,
        isFetchedAfterMount:
          a.dataUpdateCount > o.dataUpdateCount || a.errorUpdateCount > o.errorUpdateCount,
        isFetching: S,
        isRefetching: S && !C,
        isLoadingError: w && !P,
        isPaused: a.fetchStatus === 'paused',
        isPlaceholderData: R,
        isRefetchError: w && P,
        isStale: Q(e, t),
        refetch: this.refetch,
        promise: this.#i,
      }
    if (this.options.experimental_prefetchInRender) {
      const c = (x) => {
          f.status === 'error' ? x.reject(f.error) : f.data !== void 0 && x.resolve(f.data)
        },
        v = () => {
          const x = (this.#i = f.promise = D())
          c(x)
        },
        y = this.#i
      switch (y.status) {
        case 'pending':
          e.queryHash === s.queryHash && c(y)
          break
        case 'fulfilled':
          ;(f.status === 'error' || f.data !== y.value) && v()
          break
        case 'rejected':
          ;(f.status !== 'error' || f.error !== y.reason) && v()
          break
      }
    }
    return f
  }
  updateResult(e) {
    const t = this.#t,
      s = this.createResult(this.#e, this.options)
    if (
      ((this.#n = this.#e.state),
      (this.#l = this.options),
      this.#n.data !== void 0 && (this.#d = this.#e),
      E(s, t))
    )
      return
    this.#t = s
    const r = {},
      n = () => {
        if (!t) return !0
        const { notifyOnChangeProps: l } = this.options,
          i = typeof l == 'function' ? l() : l
        if (i === 'all' || (!i && !this.#f.size)) return !0
        const b = new Set(i ?? this.#f)
        return (
          this.options.throwOnError && b.add('error'),
          Object.keys(this.#t).some((o) => {
            const u = o
            return this.#t[u] !== t[u] && b.has(u)
          })
        )
      }
    e?.listeners !== !1 && n() && (r.listeners = !0), this.#S({ ...r, ...e })
  }
  #O() {
    const e = this.#s.getQueryCache().build(this.#s, this.options)
    if (e === this.#e) return
    const t = this.#e
    ;(this.#e = e),
      (this.#p = e.state),
      this.hasListeners() && (t?.removeObserver(this), e.addObserver(this))
  }
  onQueryUpdate() {
    this.updateResult(), this.hasListeners() && this.#b()
  }
  #S(e) {
    H.batch(() => {
      e.listeners &&
        this.listeners.forEach((t) => {
          t(this.#t)
        }),
        this.#s.getQueryCache().notify({ query: this.#e, type: 'observerResultsUpdated' })
    })
  }
}
function G(e, t) {
  return (
    p(t.enabled, e) !== !1 &&
    e.state.data === void 0 &&
    !(e.state.status === 'error' && t.retryOnMount === !1)
  )
}
function M(e, t) {
  return G(e, t) || (e.state.data !== void 0 && T(e, t, t.refetchOnMount))
}
function T(e, t, s) {
  if (p(t.enabled, e) !== !1) {
    const r = typeof s == 'function' ? s(e) : s
    return r === 'always' || (r !== !1 && Q(e, t))
  }
  return !1
}
function L(e, t, s, r) {
  return (
    (e !== t || p(r.enabled, e) === !1) && (!s.suspense || e.state.status !== 'error') && Q(e, s)
  )
}
function Q(e, t) {
  return p(t.enabled, e) !== !1 && e.isStaleByTime(O(t.staleTime, e))
}
function J(e, t) {
  return !E(e.getCurrentResult(), t)
}
var A = m.createContext(!1),
  Y = () => m.useContext(A)
A.Provider
function Z() {
  let e = !1
  return {
    clearReset: () => {
      e = !1
    },
    reset: () => {
      e = !0
    },
    isReset: () => e,
  }
}
var ee = m.createContext(Z()),
  te = () => m.useContext(ee)
function se(e, t) {
  return typeof e == 'function' ? e(...t) : !!e
}
function _() {}
var re = (e, t) => {
    ;(e.suspense || e.throwOnError || e.experimental_prefetchInRender) &&
      (t.isReset() || (e.retryOnMount = !1))
  },
  ie = (e) => {
    m.useEffect(() => {
      e.clearReset()
    }, [e])
  },
  ae = ({ result: e, errorResetBoundary: t, throwOnError: s, query: r, suspense: n }) =>
    e.isError &&
    !t.isReset() &&
    !e.isFetching &&
    r &&
    ((n && e.data === void 0) || se(s, [e.error, r])),
  ne = (e) => {
    const t = e.staleTime
    e.suspense &&
      ((e.staleTime =
        typeof t == 'function' ? (...s) => Math.max(t(...s), 1e3) : Math.max(t ?? 1e3, 1e3)),
      typeof e.gcTime == 'number' && (e.gcTime = Math.max(e.gcTime, 1e3)))
  },
  oe = (e, t) => e.isLoading && e.isFetching && !t,
  he = (e, t) => e?.suspense && t.isPending,
  B = (e, t, s) =>
    t.fetchOptimistic(e).catch(() => {
      s.clearReset()
    })
function ce(e, t, s) {
  const r = K(),
    n = Y(),
    l = te(),
    i = r.defaultQueryOptions(e)
  r.getDefaultOptions().queries?._experimental_beforeQuery?.(i),
    (i._optimisticResults = n ? 'isRestoring' : 'optimistic'),
    ne(i),
    re(i, l),
    ie(l)
  const b = !r.getQueryCache().get(i.queryHash),
    [o] = m.useState(() => new t(r, i)),
    u = o.getOptimisticResult(i),
    a = !n && e.subscribed !== !1
  if (
    (m.useSyncExternalStore(
      m.useCallback(
        (R) => {
          const d = a ? o.subscribe(H.batchCalls(R)) : _
          return o.updateResult(), d
        },
        [o, a],
      ),
      () => o.getCurrentResult(),
      () => o.getCurrentResult(),
    ),
    m.useEffect(() => {
      o.setOptions(i, { listeners: !1 })
    }, [i, o]),
    he(i, u))
  )
    throw B(i, o, l)
  if (
    ae({
      result: u,
      errorResetBoundary: l,
      throwOnError: i.throwOnError,
      query: r.getQueryCache().get(i.queryHash),
      suspense: i.suspense,
    })
  )
    throw u.error
  return (
    r.getDefaultOptions().queries?._experimental_afterQuery?.(i, u),
    i.experimental_prefetchInRender &&
      !I &&
      oe(u, n) &&
      (b ? B(i, o, l) : r.getQueryCache().get(i.queryHash)?.promise)?.catch(_).finally(() => {
        o.updateResult()
      }),
    i.notifyOnChangeProps ? u : o.trackResult(u)
  )
}
function le(e, t) {
  return ce(e, X)
}
const fe = function () {
  const t = le({
    queryKey: ['serverPing'],
    queryFn: async () => {
      try {
        const s = await fetch('http://localhost:9157/trpc/ping')
        if (!s.ok) throw new Error(`HTTP error! Status: ${s.status}`)
        return {
          success: !0,
          message: (await s.json()).result?.data || 'pong',
          timestamp: new Date().toISOString(),
        }
      } catch (s) {
        return (
          console.error('Fetch error:', s),
          {
            success: !1,
            message: 'Could not connect to server',
            timestamp: new Date().toISOString(),
          }
        )
      }
    },
    refetchOnWindowFocus: !1,
  })
  return h.jsxs('div', {
    className: 'p-2',
    children: [
      h.jsx('div', { className: 'text-lg', children: 'Welcome Home!' }),
      h.jsx('hr', { className: 'my-2' }),
      h.jsx('a', {
        href: '/dashboard/posts/3',
        className: 'py-1 px-2 text-xs bg-blue-500 text-white rounded-full',
        children: '1 New Invoice',
      }),
      h.jsxs('div', {
        className: 'my-4 p-4 border rounded bg-gray-50',
        children: [
          h.jsx('h2', { className: 'text-lg font-semibold mb-2', children: 'Ping Server Status:' }),
          t.isLoading
            ? h.jsx('div', { className: 'text-gray-500', children: 'Loading server status...' })
            : t.isError
            ? h.jsxs('div', { className: 'text-red-500', children: ['Error: ', t.error.message] })
            : h.jsxs('div', {
                className: 'space-y-2',
                children: [
                  h.jsxs('div', {
                    className: `font-medium ${t.data?.success ? 'text-green-600' : 'text-red-600'}`,
                    children: ['Status: ', t.data?.success ? 'Online' : 'Offline'],
                  }),
                  h.jsxs('div', {
                    children: ['Message: ', t.data?.message || 'No message available'],
                  }),
                  h.jsxs('div', {
                    className: 'text-sm text-gray-500',
                    children: ['Timestamp: ', t.data?.timestamp || new Date().toISOString()],
                  }),
                ],
              }),
        ],
      }),
      h.jsx('hr', { className: 'my-2' }),
      h.jsxs('div', {
        className: 'max-w-xl',
        children: [
          'As you navigate around take note of the UX. It should feel suspense-like, where routes are only rendered once all of their data and elements are ready.',
          h.jsx('hr', { className: 'my-2' }),
          'To exaggerate async effects, play with the artificial request delay slider in the bottom-left corner.',
          h.jsx('hr', { className: 'my-2' }),
          'The last 2 sliders determine if link-hover preloading is enabled (and how long those preloads stick around) and also whether to cache rendered route data (and for how long). Both of these default to 0 (or off).',
        ],
      }),
    ],
  })
}
export { fe as component }
