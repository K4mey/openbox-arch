// Copyright Google Inc. All Rights Reserved.
(function() {
    'use strict';
    var f, g = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            for (var d in b)
                if (Object.defineProperties) {
                    var e = Object.getOwnPropertyDescriptor(b, d);
                    e && Object.defineProperty(a, d, e)
                } else a[d] = b[d]
        },
        aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
            if (c.get || c.set) throw new TypeError("ES3 does not support getters and setters.");
            a != Array.prototype && a != Object.prototype && (a[b] = c.value)
        },
        h = "undefined" != typeof window &&
        window === this ? this : "undefined" != typeof global && null != global ? global : this,
        ba = function() {
            ba = function() {};
            h.Symbol || (h.Symbol = ca)
        },
        da = 0,
        ca = function(a) {
            return "jscomp_symbol_" + (a || "") + da++
        },
        fa = function() {
            ba();
            var a = h.Symbol.iterator;
            a || (a = h.Symbol.iterator = h.Symbol("iterator"));
            "function" != typeof Array.prototype[a] && aa(Array.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return ea(this)
                }
            });
            fa = function() {}
        },
        ea = function(a) {
            var b = 0;
            return ga(function() {
                return b < a.length ? {
                    done: !1,
                    value: a[b++]
                } : {
                    done: !0
                }
            })
        },
        ga = function(a) {
            fa();
            a = {
                next: a
            };
            a[h.Symbol.iterator] = function() {
                return this
            };
            return a
        },
        ha = function(a) {
            fa();
            var b = a[Symbol.iterator];
            return b ? b.call(a) : ea(a)
        },
        k = this,
        m = function() {},
        ia = function(a) {
            var b = typeof a;
            if ("object" == b)
                if (a) {
                    if (a instanceof Array) return "array";
                    if (a instanceof Object) return b;
                    var c = Object.prototype.toString.call(a);
                    if ("[object Window]" == c) return "object";
                    if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable &&
                        !a.propertyIsEnumerable("splice")) return "array";
                    if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
                } else return "null";
            else if ("function" == b && "undefined" == typeof a.call) return "object";
            return b
        },
        ja = function(a) {
            var b = ia(a);
            return "array" == b || "object" == b && "number" == typeof a.length
        },
        n = function(a) {
            return "function" == ia(a)
        },
        ka = function(a, b, c) {
            return a.call.apply(a.bind, arguments)
        },
        la = function(a, b, c) {
            if (!a) throw Error();
            if (2 < arguments.length) {
                var d = Array.prototype.slice.call(arguments, 2);
                return function() {
                    var c = Array.prototype.slice.call(arguments);
                    Array.prototype.unshift.apply(c, d);
                    return a.apply(b, c)
                }
            }
            return function() {
                return a.apply(b, arguments)
            }
        },
        r = function(a, b, c) {
            r = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ka : la;
            return r.apply(null, arguments)
        },
        ma = Date.now || function() {
            return +new Date
        },
        t = function(a, b) {
            a = a.split(".");
            var c = k;
            a[0] in c || !c.execScript || c.execScript("var " +
                a[0]);
            for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c = c[d] ? c[d] : c[d] = {} : c[d] = b
        },
        u = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.Qb = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            a.Pb = function(a, c, p) {
                for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) d[e - 2] = arguments[e];
                return b.prototype[c].apply(a, d)
            }
        };
    var v = function(a) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, v);
        else {
            var b = Error().stack;
            b && (this.stack = b)
        }
        a && (this.message = String(a))
    };
    u(v, Error);
    v.prototype.name = "CustomError";
    var na = function(a, b) {
            for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
            return d + c.join("%s")
        },
        oa = String.prototype.trim ? function(a) {
            return a.trim()
        } : function(a) {
            return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
        },
        pa = function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0
        };
    var qa = function(a, b) {
        b.unshift(a);
        v.call(this, na.apply(null, b));
        b.shift()
    };
    u(qa, v);
    qa.prototype.name = "AssertionError";
    var ra = function(a, b) {
        throw new qa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
    };
    var w;
    a: {
        var sa = k.navigator;
        if (sa) {
            var ta = sa.userAgent;
            if (ta) {
                w = ta;
                break a
            }
        }
        w = ""
    }
    var x = function(a) {
        return -1 != w.indexOf(a)
    };
    var va = function(a, b) {
        var c = ua;
        return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a)
    };
    var wa = x("Opera"),
        y = x("Trident") || x("MSIE"),
        xa = x("Edge"),
        ya = x("Gecko") && !(-1 != w.toLowerCase().indexOf("webkit") && !x("Edge")) && !(x("Trident") || x("MSIE")) && !x("Edge"),
        za = -1 != w.toLowerCase().indexOf("webkit") && !x("Edge"),
        Aa;
    a: {
        var Ba = "",
            Ca = function() {
                var a = w;
                if (ya) return /rv\:([^\);]+)(\)|;)/.exec(a);
                if (xa) return /Edge\/([\d\.]+)/.exec(a);
                if (y) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
                if (za) return /WebKit\/(\S+)/.exec(a);
                if (wa) return /(?:Version)[ \/]?(\S+)/.exec(a)
            }();
        Ca && (Ba = Ca ? Ca[1] : "");
        if (y) {
            var z, Da = k.document;
            z = Da ? Da.documentMode : void 0;
            if (null != z && z > parseFloat(Ba)) {
                Aa = String(z);
                break a
            }
        }
        Aa = Ba
    }
    var Ea = Aa,
        ua = {},
        A = function(a) {
            return va(a, function() {
                for (var b = 0, c = oa(String(Ea)).split("."), d = oa(String(a)).split("."), e = Math.max(c.length, d.length), p = 0; 0 == b && p < e; p++) {
                    var l = c[p] || "",
                        q = d[p] || "";
                    do {
                        l = /(\d*)(\D*)(.*)/.exec(l) || ["", "", "", ""];
                        q = /(\d*)(\D*)(.*)/.exec(q) || ["", "", "", ""];
                        if (0 == l[0].length && 0 == q[0].length) break;
                        b = pa(0 == l[1].length ? 0 : parseInt(l[1], 10), 0 == q[1].length ? 0 : parseInt(q[1], 10)) || pa(0 == l[2].length, 0 == q[2].length) || pa(l[2], q[2]);
                        l = l[3];
                        q = q[3]
                    } while (0 == b)
                }
                return 0 <= b
            })
        };
    var B = function(a, b, c, d, e) {
        this.reset(a, b, c, d, e)
    };
    B.prototype.ga = null;
    var Fa = 0;
    B.prototype.reset = function(a, b, c, d, e) {
        "number" == typeof e || Fa++;
        this.Sa = d || ma();
        this.w = a;
        this.Ha = b;
        this.Ea = c;
        delete this.ga
    };
    B.prototype.va = function(a) {
        this.w = a
    };
    var C = function(a) {
            this.Ia = a;
            this.M = this.fa = this.w = this.j = null
        },
        D = function(a, b) {
            this.name = a;
            this.value = b
        };
    D.prototype.toString = function() {
        return this.name
    };
    var Ga = new D("SHOUT", 1200),
        Ha = new D("SEVERE", 1E3),
        Ia = new D("WARNING", 900),
        Ja = new D("INFO", 800),
        Ka = new D("CONFIG", 700),
        La = [new D("OFF", Infinity), Ga, Ha, Ia, Ja, Ka, new D("FINE", 500), new D("FINER", 400), new D("FINEST", 300), new D("ALL", 0)],
        E = null,
        Ma = function(a) {
            if (!E) {
                E = {};
                for (var b = 0, c; c = La[b]; b++) E[c.value] = c, E[c.name] = c
            }
            if (a in E) return E[a];
            for (b = 0; b < La.length; ++b)
                if (c = La[b], c.value <= a) return c;
            return null
        };
    C.prototype.getName = function() {
        return this.Ia
    };
    C.prototype.getParent = function() {
        return this.j
    };
    C.prototype.va = function(a) {
        this.w = a
    };
    var Na = function(a) {
        if (a.w) return a.w;
        if (a.j) return Na(a.j);
        ra("Root logger has no level set.");
        return null
    };
    C.prototype.log = function(a, b, c) {
        if (a.value >= Na(this).value)
            for (n(b) && (b = b()), a = new B(a, String(b), this.Ia), c && (a.ga = c), c = "log:" + a.Ha, k.console && (k.console.timeStamp ? k.console.timeStamp(c) : k.console.markTimeline && k.console.markTimeline(c)), k.msWriteProfilerMark && k.msWriteProfilerMark(c), c = this; c;) {
                var d = c,
                    e = a;
                if (d.M)
                    for (var p = 0; b = d.M[p]; p++) b(e);
                c = c.getParent()
            }
    };
    C.prototype.info = function(a, b) {
        this.log(Ja, a, b)
    };
    var Oa = {},
        F = null,
        Pa = function() {
            F || (F = new C(""), Oa[""] = F, F.va(Ka))
        },
        Qa = function() {
            Pa();
            return F
        },
        G = function(a) {
            Pa();
            var b;
            if (!(b = Oa[a])) {
                b = new C(a);
                var c = a.lastIndexOf("."),
                    d = a.substr(c + 1),
                    c = G(a.substr(0, c));
                c.fa || (c.fa = {});
                c.fa[d] = b;
                b.j = c;
                Oa[a] = b
            }
            return b
        };
    var H = function(a) {
        var b = Ra;
        b && b.log(Ia, a, void 0)
    };
    var I = function() {
            this.Ma = ma()
        },
        Sa = new I;
    I.prototype.set = function(a) {
        this.Ma = a
    };
    I.prototype.reset = function() {
        this.set(ma())
    };
    I.prototype.get = function() {
        return this.Ma
    };
    var Ta = function(a) {
        this.Ab = a || "";
        this.Lb = Sa
    };
    f = Ta.prototype;
    f.xa = !0;
    f.Qa = !0;
    f.Jb = !0;
    f.Ib = !0;
    f.Ra = !1;
    f.Kb = !1;
    var J = function(a) {
            return 10 > a ? "0" + a : String(a)
        },
        Ua = function(a, b) {
            a = (a.Sa - b) / 1E3;
            b = a.toFixed(3);
            var c = 0;
            if (1 > a) c = 2;
            else
                for (; 100 > a;) c++, a *= 10;
            for (; 0 < c--;) b = " " + b;
            return b
        },
        Va = function(a) {
            Ta.call(this, a)
        };
    u(Va, Ta);
    var Wa = function() {
        this.Bb = r(this.Ta, this);
        this.V = new Va;
        this.V.Qa = !1;
        this.V.Ra = !1;
        this.Da = this.V.xa = !1;
        this.bb = {}
    };
    Wa.prototype.Ta = function(a) {
        if (!this.bb[a.Ea]) {
            var b;
            b = this.V;
            var c = [];
            c.push(b.Ab, " ");
            if (b.Qa) {
                var d = new Date(a.Sa);
                c.push("[", J(d.getFullYear() - 2E3) + J(d.getMonth() + 1) + J(d.getDate()) + " " + J(d.getHours()) + ":" + J(d.getMinutes()) + ":" + J(d.getSeconds()) + "." + J(Math.floor(d.getMilliseconds() / 10)), "] ")
            }
            b.Jb && c.push("[", Ua(a, b.Lb.get()), "s] ");
            b.Ib && c.push("[", a.Ea, "] ");
            b.Kb && c.push("[", a.w.name, "] ");
            c.push(a.Ha);
            b.Ra && (d = a.ga) && c.push("\n", d instanceof Error ? d.message : d.toString());
            b.xa && c.push("\n");
            b = c.join("");
            if (c = Xa) switch (a.w) {
                case Ga:
                    L(c, "info", b);
                    break;
                case Ha:
                    L(c, "error", b);
                    break;
                case Ia:
                    L(c, "warn", b);
                    break;
                default:
                    L(c, "debug", b)
            }
        }
    };
    var M = null,
        Xa = k.console,
        L = function(a, b, c) {
            if (a[b]) a[b](c);
            else a.log(c)
        };
    var N = function(a, b, c) {
        this.pb = c;
        this.Xa = a;
        this.Eb = b;
        this.aa = 0;
        this.Y = null
    };
    N.prototype.get = function() {
        var a;
        0 < this.aa ? (this.aa--, a = this.Y, this.Y = a.next, a.next = null) : a = this.Xa();
        return a
    };
    N.prototype.put = function(a) {
        this.Eb(a);
        this.aa < this.pb && (this.aa++, a.next = this.Y, this.Y = a)
    };
    var Ya = function(a) {
            k.setTimeout(function() {
                throw a;
            }, 0)
        },
        Za, $a = function() {
            var a = k.MessageChannel;
            "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !x("Presto") && (a = function() {
                var a = document.createElement("IFRAME");
                a.style.display = "none";
                a.src = "";
                document.documentElement.appendChild(a);
                var b = a.contentWindow,
                    a = b.document;
                a.open();
                a.write("");
                a.close();
                var c = "callImmediate" + Math.random(),
                    d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host,
                    a = r(function(a) {
                        if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage()
                    }, this);
                b.addEventListener("message", a, !1);
                this.port1 = {};
                this.port2 = {
                    postMessage: function() {
                        b.postMessage(c, d)
                    }
                }
            });
            if ("undefined" !== typeof a && !x("Trident") && !x("MSIE")) {
                var b = new a,
                    c = {},
                    d = c;
                b.port1.onmessage = function() {
                    if (void 0 !== c.next) {
                        c = c.next;
                        var a = c.ya;
                        c.ya = null;
                        a()
                    }
                };
                return function(a) {
                    d.next = {
                        ya: a
                    };
                    d = d.next;
                    b.port2.postMessage(0)
                }
            }
            return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ?
                function(a) {
                    var b = document.createElement("SCRIPT");
                    b.onreadystatechange = function() {
                        b.onreadystatechange = null;
                        b.parentNode.removeChild(b);
                        b = null;
                        a();
                        a = null
                    };
                    document.documentElement.appendChild(b)
                } : function(a) {
                    k.setTimeout(a, 0)
                }
        };
    var ab = function() {
            this.ca = this.K = null
        },
        cb = new N(function() {
            return new bb
        }, function(a) {
            a.reset()
        }, 100);
    ab.prototype.add = function(a, b) {
        var c = cb.get();
        c.set(a, b);
        this.ca ? this.ca.next = c : this.K = c;
        this.ca = c
    };
    ab.prototype.remove = function() {
        var a = null;
        this.K && (a = this.K, this.K = this.K.next, this.K || (this.ca = null), a.next = null);
        return a
    };
    var bb = function() {
        this.next = this.scope = this.ia = null
    };
    bb.prototype.set = function(a, b) {
        this.ia = a;
        this.scope = b;
        this.next = null
    };
    bb.prototype.reset = function() {
        this.next = this.scope = this.ia = null
    };
    var hb = function(a, b) {
            db || eb();
            fb || (db(), fb = !0);
            gb.add(a, b)
        },
        db, eb = function() {
            var a = k.Promise;
            if (-1 != String(a).indexOf("[native code]")) {
                var b = a.resolve(void 0);
                db = function() {
                    b.then(ib)
                }
            } else db = function() {
                var a = ib;
                !n(k.setImmediate) || k.Window && k.Window.prototype && !x("Edge") && k.Window.prototype.setImmediate == k.setImmediate ? (Za || (Za = $a()), Za(a)) : k.setImmediate(a)
            }
        },
        fb = !1,
        gb = new ab,
        ib = function() {
            for (var a; a = gb.remove();) {
                try {
                    a.ia.call(a.scope)
                } catch (b) {
                    Ya(b)
                }
                cb.put(a)
            }
            fb = !1
        };
    var Q = function(a, b) {
            this.g = 0;
            this.Na = void 0;
            this.B = this.m = this.j = null;
            this.X = this.ha = !1;
            if (a != m) try {
                var c = this;
                a.call(b, function(a) {
                    O(c, 2, a)
                }, function(a) {
                    if (!(a instanceof P)) try {
                        if (a instanceof Error) throw a;
                        throw Error("Promise rejected.");
                    } catch (e) {}
                    O(c, 3, a)
                })
            } catch (d) {
                O(this, 3, d)
            }
        },
        jb = function() {
            this.next = this.context = this.F = this.O = this.v = null;
            this.T = !1
        };
    jb.prototype.reset = function() {
        this.context = this.F = this.O = this.v = null;
        this.T = !1
    };
    var kb = new N(function() {
            return new jb
        }, function(a) {
            a.reset()
        }, 100),
        lb = function(a, b, c) {
            var d = kb.get();
            d.O = a;
            d.F = b;
            d.context = c;
            return d
        },
        R = function() {
            var a, b, c = new Q(function(c, e) {
                a = c;
                b = e
            });
            return new mb(c, a, b)
        };
    Q.prototype.then = function(a, b, c) {
        return nb(this, n(a) ? a : null, n(b) ? b : null, c)
    };
    Q.prototype.then = Q.prototype.then;
    Q.prototype.$goog_Thenable = !0;
    Q.prototype.cancel = function(a) {
        0 == this.g && hb(function() {
            var b = new P(a);
            ob(this, b)
        }, this)
    };
    var ob = function(a, b) {
            if (0 == a.g)
                if (a.j) {
                    var c = a.j;
                    if (c.m) {
                        for (var d = 0, e = null, p = null, l = c.m; l && (l.T || (d++, l.v == a && (e = l), !(e && 1 < d))); l = l.next) e || (p = l);
                        e && (0 == c.g && 1 == d ? ob(c, b) : (p ? (d = p, d.next == c.B && (c.B = d), d.next = d.next.next) : pb(c), qb(c, e, 3, b)))
                    }
                    a.j = null
                } else O(a, 3, b)
        },
        sb = function(a, b) {
            a.m || 2 != a.g && 3 != a.g || rb(a);
            a.B ? a.B.next = b : a.m = b;
            a.B = b
        },
        nb = function(a, b, c, d) {
            var e = lb(null, null, null);
            e.v = new Q(function(a, l) {
                e.O = b ? function(c) {
                    try {
                        var e = b.call(d, c);
                        a(e)
                    } catch (K) {
                        l(K)
                    }
                } : a;
                e.F = c ? function(b) {
                    try {
                        var e = c.call(d,
                            b);
                        void 0 === e && b instanceof P ? l(b) : a(e)
                    } catch (K) {
                        l(K)
                    }
                } : l
            });
            e.v.j = a;
            sb(a, e);
            return e.v
        };
    Q.prototype.Mb = function(a) {
        this.g = 0;
        O(this, 2, a)
    };
    Q.prototype.Nb = function(a) {
        this.g = 0;
        O(this, 3, a)
    };
    var O = function(a, b, c) {
            if (0 == a.g) {
                a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
                a.g = 1;
                var d;
                a: {
                    var e = c,
                        p = a.Mb,
                        l = a.Nb;
                    if (e instanceof Q) sb(e, lb(p || m, l || null, a)), d = !0;
                    else {
                        var q;
                        if (e) try {
                            q = !!e.$goog_Thenable
                        } catch (K) {
                            q = !1
                        } else q = !1;
                        if (q) e.then(p, l, a), d = !0;
                        else {
                            q = typeof e;
                            if ("object" == q && null != e || "function" == q) try {
                                var Z = e.then;
                                if (n(Z)) {
                                    tb(e, Z, p, l, a);
                                    d = !0;
                                    break a
                                }
                            } catch (K) {
                                l.call(a, K);
                                d = !0;
                                break a
                            }
                            d = !1
                        }
                    }
                }
                d || (a.Na = c, a.g = b, a.j = null, rb(a), 3 != b || c instanceof P || ub(a, c))
            }
        },
        tb = function(a,
            b, c, d, e) {
            var p = !1,
                l = function(a) {
                    p || (p = !0, c.call(e, a))
                },
                q = function(a) {
                    p || (p = !0, d.call(e, a))
                };
            try {
                b.call(a, l, q)
            } catch (Z) {
                q(Z)
            }
        },
        rb = function(a) {
            a.ha || (a.ha = !0, hb(a.$a, a))
        },
        pb = function(a) {
            var b = null;
            a.m && (b = a.m, a.m = b.next, b.next = null);
            a.m || (a.B = null);
            return b
        };
    Q.prototype.$a = function() {
        for (var a; a = pb(this);) qb(this, a, this.g, this.Na);
        this.ha = !1
    };
    var qb = function(a, b, c, d) {
            if (3 == c && b.F && !b.T)
                for (; a && a.X; a = a.j) a.X = !1;
            if (b.v) b.v.j = null, vb(b, c, d);
            else try {
                b.T ? b.O.call(b.context) : vb(b, c, d)
            } catch (e) {
                wb.call(null, e)
            }
            kb.put(b)
        },
        vb = function(a, b, c) {
            2 == b ? a.O.call(a.context, c) : a.F && a.F.call(a.context, c)
        },
        ub = function(a, b) {
            a.X = !0;
            hb(function() {
                a.X && wb.call(null, b)
            })
        },
        wb = Ya,
        P = function(a) {
            v.call(this, a)
        };
    u(P, v);
    P.prototype.name = "cancel";
    var mb = function(a, b, c) {
        this.I = a;
        this.resolve = b;
        this.reject = c
    };
    var xb = function() {
        this.Aa = this.Aa;
        this.xb = this.xb
    };
    xb.prototype.Aa = !1;
    y && A("9");
    !za || A("528");
    ya && A("1.9b") || y && A("8") || wa && A("9.5") || za && A("528");
    ya && !A("8") || y && A("9");
    var yb = function(a, b, c) {
        xb.call(this);
        this.qb = null != c ? r(a, c) : a;
        this.ob = b;
        this.Wa = r(this.zb, this);
        this.ea = []
    };
    u(yb, xb);
    f = yb.prototype;
    f.J = !1;
    f.P = 0;
    f.A = null;
    f.cb = function(a) {
        this.ea = arguments;
        this.A || this.P ? this.J = !0 : zb(this)
    };
    f.stop = function() {
        this.A && (k.clearTimeout(this.A), this.A = null, this.J = !1, this.ea = [])
    };
    f.pause = function() {
        this.P++
    };
    f.resume = function() {
        this.P--;
        this.P || !this.J || this.A || (this.J = !1, zb(this))
    };
    f.zb = function() {
        this.A = null;
        this.J && !this.P && (this.J = !1, zb(this))
    };
    var zb = function(a) {
        var b;
        b = a.Wa;
        var c = a.ob;
        if (!n(b))
            if (b && "function" == typeof b.handleEvent) b = r(b.handleEvent, b);
            else throw Error("Invalid listener argument");
        b = 2147483647 < Number(c) ? -1 : k.setTimeout(b, c || 0);
        a.A = b;
        a.qb.apply(null, a.ea)
    };
    var S = function(a) {
        a.controller = this;
        this.a = a;
        this.s = this.c = this.b = null;
        this.Ka = this.yb.bind(this);
        this.C = this.sb.bind(this);
        this.D = this.tb.bind(this);
        this.l = 0;
        this.Ob = new yb(this.ab, 200, this)
    };
    f = S.prototype;
    f.ra = function() {
        this.c && (this.l++, this.a.isPaused = !this.a.isPaused, this.a.isPaused ? this.c.pause(null, this.D, this.C) : this.c.play(null, this.D, this.C))
    };
    f.stop = function() {
        this.c && (this.l++, this.c.stop(null, this.D, this.C))
    };
    f.seek = function() {
        if (this.c) {
            this.s && (clearTimeout(this.s), this.s = null);
            this.l++;
            var a = new chrome.cast.media.SeekRequest;
            a.currentTime = this.a.currentTime;
            this.c.seek(a, this.D, this.C)
        }
    };
    f.pa = function() {
        this.l++;
        this.a.isMuted = !this.a.isMuted;
        this.b.setReceiverMuted(this.a.isMuted, this.D, this.C)
    };
    f.wa = function() {
        this.Ob.cb()
    };
    f.ab = function() {
        this.l++;
        this.b.setReceiverVolumeLevel(this.a.volumeLevel, this.D, this.C)
    };
    f.tb = function() {
        this.l--;
        this.u()
    };
    f.sb = function() {
        this.l--;
        this.c && this.c.getStatus(null, m, m)
    };
    f.yb = function() {
        this.c && (this.a.currentTime = this.c.getEstimatedTime(), this.s = setTimeout(this.Ka, 1E3))
    };
    f.u = function(a) {
        if (!(0 < this.l))
            if (this.b) {
                this.a.displayName = this.b.displayName || "";
                var b = this.b.statusText || "";
                this.a.displayStatus = b != this.a.displayName ? b : "";
                !a && this.b.receiver && (a = this.b.receiver.volume) && (null != a.muted && (this.a.isMuted = a.muted), null != a.level && (this.a.volumeLevel = a.level));
                this.c ? (this.a.isMediaLoaded = this.c.playerState != chrome.cast.media.PlayerState.IDLE, this.a.isPaused = this.c.playerState == chrome.cast.media.PlayerState.PAUSED, this.a.canPause = 0 <= this.c.supportedMediaCommands.indexOf(chrome.cast.media.MediaCommand.PAUSE),
                    this.S(this.c.media), this.a.canSeek = 0 <= this.c.supportedMediaCommands.indexOf(chrome.cast.media.MediaCommand.SEEK) && 0 != this.a.duration, this.a.currentTime = this.c.getEstimatedTime(), this.s && (clearTimeout(this.s), this.s = null), this.c.playerState == chrome.cast.media.PlayerState.PLAYING && (this.s = setTimeout(this.Ka, 1E3))) : this.S(null)
            } else this.a.displayName = "", this.a.displayStatus = "", this.S(null)
    };
    f.S = function(a) {
        a ? (this.a.duration = a.duration || 0, a.metadata && a.metadata.title && (this.a.displayStatus = a.metadata.title)) : (this.a.isMediaLoaded = !1, this.a.canPause = !1, this.a.canSeek = !1, this.a.currentTime = 0, this.a.duration = 0)
    };
    var Ab = function(a) {
            if (!a.c)
                for (var b = 0, c = a.b.media; b < c.length; b++){
                    a.c = c[b];
                    a.c.addUpdateListener(a.rb.bind(a));
                }
        },
        Bb = function(a, b) {
            a.b = b;
            b.addMediaListener(a.Fa.bind(a));
            b.addUpdateListener(a.ua.bind(a));
            Ab(a);
            a.u()
        };
    f = S.prototype;
    f.ua = function(a) {
        a || (this.c = this.b = null);
        this.u()
    };
    f.Fa = function() {
        Ab(this);
        this.u(!0)
    };
    f.rb = function(a) {
        a || (this.c = null);
        this.u(!0)
    };
    f.ka = function(a, b) {
        return b ? 100 * a / b : 0
    };
    f.la = function(a, b) {
        return b ? a * b / 100 : 0
    };
    f.ja = function(a) {
        return 0 > a ? "" : [("0" + Math.floor(a / 3600)).substr(-2), ("0" + Math.floor(a / 60) % 60).substr(-2), ("0" + Math.floor(a) % 60).substr(-2)].join(":")
    };
    t("cast.framework.VERSION", "1.0.01");
    t("cast.framework.LoggerLevel", {
        DEBUG: 0,
        INFO: 800,
        WARNING: 900,
        ERROR: 1E3,
        NONE: 1500
    });
    t("cast.framework.CastState", {
        NO_DEVICES_AVAILABLE: "NO_DEVICES_AVAILABLE",
        NOT_CONNECTED: "NOT_CONNECTED",
        CONNECTING: "CONNECTING",
        CONNECTED: "CONNECTED"
    });
    t("cast.framework.SessionState", {
        NO_SESSION: "NO_SESSION",
        SESSION_STARTING: "SESSION_STARTING",
        SESSION_STARTED: "SESSION_STARTED",
        SESSION_START_FAILED: "SESSION_START_FAILED",
        SESSION_ENDING: "SESSION_ENDING",
        SESSION_ENDED: "SESSION_ENDED",
        SESSION_RESUMED: "SESSION_RESUMED"
    });
    t("cast.framework.CastContextEventType", {
        CAST_STATE_CHANGED: "caststatechanged",
        SESSION_STATE_CHANGED: "sessionstatechanged"
    });
    t("cast.framework.SessionEventType", {
        APPLICATION_STATUS_CHANGED: "applicationstatuschanged",
        APPLICATION_METADATA_CHANGED: "applicationmetadatachanged",
        ACTIVE_INPUT_STATE_CHANGED: "activeinputstatechanged",
        VOLUME_CHANGED: "volumechanged",
        MEDIA_SESSION: "mediasession"
    });
    t("cast.framework.RemotePlayerEventType", {
        ANY_CHANGE: "anyChanged",
        IS_CONNECTED_CHANGED: "isConnectedChanged",
        IS_MEDIA_LOADED_CHANGED: "isMediaLoadedChanged",
        DURATION_CHANGED: "durationChanged",
        CURRENT_TIME_CHANGED: "currentTimeChanged",
        IS_PAUSED_CHANGED: "isPausedChanged",
        VOLUME_LEVEL_CHANGED: "volumeLevelChanged",
        IS_MUTED_CHANGED: "isMutedChanged",
        CAN_PAUSE_CHANGED: "canPauseChanged",
        CAN_SEEK_CHANGED: "canSeekChanged",
        DISPLAY_NAME_CHANGED: "displayNameChanged",
        STATUS_TEXT_CHANGED: "statusTextChanged",
        TITLE_CHANGED: "titleChanged",
        DISPLAY_STATUS_CHANGED: "displayStatusChanged",
        MEDIA_INFO_CHANGED: "mediaInfoChanged",
        IMAGE_URL_CHANGED: "imageUrlChanged",
        PLAYER_STATE_CHANGED: "playerStateChanged"
    });
    t("cast.framework.ActiveInputState", {
        ACTIVE_INPUT_STATE_UNKNOWN: -1,
        ACTIVE_INPUT_STATE_NO: 0,
        ACTIVE_INPUT_STATE_YES: 1
    });
    var Cb = function(a) {
        Qa().va(Ma(a))
    };
    t("cast.framework.setLoggerLevel", Cb);
    M || (M = new Wa);
    if (M) {
        var Db = M;
        if (1 != Db.Da) {
            var Eb = Qa(),
                Fb = Db.Bb;
            Eb.M || (Eb.M = []);
            Eb.M.push(Fb);
            Db.Da = !0
        }
    }
    Cb(1E3);
    var T = function(a) {
        this.type = a
    };
    t("cast.framework.EventData", T);
    var U = function() {
        this.N = {}
    };
    U.prototype.addEventListener = function(a, b) {
        a in this.N || (this.N[a] = []);
        a = this.N[a];
        a.includes(b) || a.push(b)
    };
    U.prototype.removeEventListener = function(a, b) {
        a = this.N[a] || [];
        b = a.indexOf(b);
        0 <= b && a.splice(b, 1)
    };
    U.prototype.dispatchEvent = function(a) {
        a && a.type && (this.N[a.type] || []).forEach(function(b) {
            try {
                b(a)
            } catch (c) {
                (b = Gb) && b.log(Ha, "Handler for " + a.type + " event failed: " + c, c)
            }
        })
    };
    var Gb = G("cast.framework.EventTarget");
    var Hb = function(a) {
        this.applicationId = a.appId;
        this.name = a.displayName;
        this.images = a.appImages;
        this.namespaces = this.qa(a.namespaces || [])
    };
    t("cast.framework.ApplicationMetadata", Hb);
    Hb.prototype.qa = function(a) {
        return a.map(function(a) {
            return a.name
        })
    };
    var Ib = function(a) {
        this.type = "applicationstatuschanged";
        this.status = a
    };
    g(Ib, T);
    t("cast.framework.ApplicationStatusEventData", Ib);
    var Jb = function(a) {
        this.type = "applicationmetadatachanged";
        this.metadata = a
    };
    g(Jb, T);
    t("cast.framework.ApplicationMetadataEventData", Jb);
    var Kb = function(a) {
        this.type = "activeinputstatechanged";
        this.activeInputState = a
    };
    g(Kb, T);
    t("cast.framework.ActiveInputStateEventData", Kb);
    var Lb = function(a) {
        this.type = "mediasession";
        this.mediaSession = a
    };
    g(Lb, T);
    t("cast.framework.MediaSessionEventData", Lb);
    var Mb = function(a, b) {
        this.type = "volumechanged";
        this.volume = a;
        this.isMute = b
    };
    g(Mb, T);
    t("cast.framework.VolumeEventData", Mb);
    var V = function(a, b) {
        this.h = new U;
        this.g = b;
        this.f = a;
        this.Oa = a.sessionId;
        this.R = a.statusText;
        this.La = a.receiver;
        this.i = a.receiver.volume;
        this.$ = new Hb(a);
        this.Z = a.receiver.isActiveInput;
        a: {
            a = this.f;
            if (a.media)
                for (a = ha(a.media), b = a.next(); !b.done; b = a.next())
                    if (b = b.value, !b.idleReason) {
                        a = b;
                        break a
                    }
            a = null
        }
        this.oa = a;
        this.f.addMediaListener(this.Ga.bind(this))
    };
    t("cast.framework.CastSession", V);
    V.prototype.addEventListener = function(a, b) {
        this.h.addEventListener(a, b)
    };
    V.prototype.addEventListener = V.prototype.addEventListener;
    V.prototype.removeEventListener = function(a, b) {
        this.h.removeEventListener(a, b)
    };
    V.prototype.removeEventListener = V.prototype.removeEventListener;
    var Ob = function(a, b) {
        a.La = b;
        !b.volume || a.i && a.i.muted == b.volume.muted && a.i.level == b.volume.level || (a.i = b.volume, a.h.dispatchEvent(new Mb(a.i.level, a.i.muted)));
        a.Z != b.isActiveInput && (a.Z = b.isActiveInput, a.h.dispatchEvent(new Kb(Nb(a.Z))))
    };
    V.prototype.mb = function() {
        return this.f
    };
    V.prototype.getSessionObj = V.prototype.mb;
    V.prototype.lb = function() {
        return this.Oa
    };
    V.prototype.getSessionId = V.prototype.lb;
    V.prototype.ma = function() {
        return this.g
    };
    V.prototype.getSessionState = V.prototype.ma;
    V.prototype.hb = function() {
        return this.La
    };
    V.prototype.getCastDevice = V.prototype.hb;
    V.prototype.fb = function() {
        return this.$
    };
    V.prototype.getApplicationMetadata = V.prototype.fb;
    V.prototype.gb = function() {
        return this.R
    };
    V.prototype.getApplicationStatus = V.prototype.gb;
    V.prototype.eb = function() {
        return Nb(this.Z)
    };
    V.prototype.getActiveInputState = V.prototype.eb;
    V.prototype.Ba = function(a) {
        "SESSION_ENDED" != this.g && (a ? this.f.stop(m, m) : this.f.leave(m, m))
    };
    V.prototype.endSession = V.prototype.Ba;
    V.prototype.setVolume = function(a) {
        var b = R(),
            c = Promise.resolve(b.I);
        this.i && (this.i.level = a, this.i.muted = !1);
        this.f.setReceiverVolumeLevel(a, function() {
            return b.resolve()
        }, function(a) {
            return b.reject(a.code)
        });
        return c
    };
    V.prototype.setVolume = V.prototype.setVolume;
    V.prototype.nb = function() {
        return this.i ? this.i.level : null
    };
    V.prototype.getVolume = V.prototype.nb;
    V.prototype.Gb = function(a) {
        var b = R(),
            c = Promise.resolve(b.I);
        this.i && (this.i.muted = a);
        this.f.setReceiverMuted(a, function() {
            return b.resolve()
        }, function(a) {
            return b.reject(a.code)
        });
        return c
    };
    V.prototype.setMute = V.prototype.Gb;
    V.prototype.isMute = function() {
        return this.i ? this.i.muted : null
    };
    V.prototype.isMute = V.prototype.isMute;
    V.prototype.sendMessage = function(a, b) {
        var c = R(),
            d = Promise.resolve(c.I);
        this.f.sendMessage(a, b, function() {
            return c.resolve()
        }, function(a) {
            return c.reject(a.code)
        });
        return d
    };
    V.prototype.sendMessage = V.prototype.sendMessage;
    V.prototype.addMessageListener = function(a, b) {
        this.f.addMessageListener(a, b)
    };
    V.prototype.addMessageListener = V.prototype.addMessageListener;
    V.prototype.removeMessageListener = function(a, b) {
        this.f.removeMessageListener(a, b)
    };
    V.prototype.removeMessageListener = V.prototype.removeMessageListener;
    V.prototype.loadMedia = function(a) {
        var b = this,
            c = R(),
            d = Promise.resolve(c.I);
        this.f.loadMedia(a, function(a) {
            b.Ga(a);
            c.resolve()
        }, function(a) {
            c.reject(a.code)
        });
        return d
    };
    V.prototype.loadMedia = V.prototype.loadMedia;
    V.prototype.kb = function() {
        return this.oa
    };
    V.prototype.getMediaSession = V.prototype.kb;
    V.prototype.Ga = function(a) {
        a.media && (this.oa = a, this.h.dispatchEvent(new Lb(a)))
    };
    var Nb = function(a) {
        return null == a ? -1 : a ? 1 : 0
    };
    V.prototype.qa = function(a) {
        return a.map(function(a, c) {
            return c.name
        })
    };
    G("cast.framework.CastSession");
    var Pb = function(a) {
        this.type = "caststatechanged";
        this.castState = a
    };
    g(Pb, T);
    t("cast.framework.CastStateEventData", Pb);
    var Qb = function(a, b, c) {
        this.type = "sessionstatechanged";
        this.session = a;
        this.sessionState = b;
        this.errorCode = void 0 !== c ? c : null
    };
    g(Qb, T);
    t("cast.framework.SessionStateEventData", Qb);
    var Rb = function(a) {
        a = a || {};
        this.receiverApplicationId = a.receiverApplicationId || null;
        this.resumeSavedSession = void 0 !== a.resumeSavedSession ? a.resumeSavedSession : !0;
        this.autoJoinPolicy = void 0 !== a.autoJoinPolicy ? a.autoJoinPolicy : chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;
        this.language = a.language || null
    };
    t("cast.framework.CastOptions", Rb);
    var W = function() {
        this.h = new U;
        this.na = !1;
        this.G = null;
        this.ta = !1;
        this.L = "NO_DEVICES_AVAILABLE";
        this.o = "NO_SESSION";
        this.ba = this.b = null
    };
    t("cast.framework.CastContext", W);
    W.prototype.addEventListener = function(a, b) {
        this.h.addEventListener(a, b)
    };
    W.prototype.addEventListener = W.prototype.addEventListener;
    W.prototype.removeEventListener = function(a, b) {
        this.h.removeEventListener(a, b)
    };
    W.prototype.removeEventListener = W.prototype.removeEventListener;
    W.prototype.Hb = function(a) {
        if (this.na) H("CastContext already initialized, new options are ignored");
        else {
            this.G = new Rb(a);
            if (!this.G || !this.G.receiverApplicationId) throw Error("Missing application id in cast options");
            a = new chrome.cast.SessionRequest(this.G.receiverApplicationId);
            a = new chrome.cast.ApiConfig(a, this.Pa.bind(this), this.Db.bind(this), this.G.autoJoinPolicy);
            chrome.cast.initialize(a, m, m);
            chrome.cast.addReceiverActionListener(this.Cb.bind(this));
            this.na = !0
        }
    };
    W.prototype.setOptions = W.prototype.Hb;
    W.prototype.ib = function() {
        return this.L
    };
    W.prototype.getCastState = W.prototype.ib;
    W.prototype.ma = function() {
        return this.o
    };
    W.prototype.getSessionState = W.prototype.ma;
    W.prototype.requestSession = function() {
        var a = this;
        if (!this.na) throw Error("Cannot start session before cast options are provided");
        var b = R(),
            c = Promise.resolve(b.I);
        nb(b.I, null, m, void 0);
        c.catch(m);
        var d = "NOT_CONNECTED" == this.L;
        chrome.cast.requestSession(function(c) {
            a.Pa(c);
            b.resolve(null)
        }, function(c) {
            d && X(a, "SESSION_START_FAILED", c ? c.code : void 0);
            b.reject(c.code)
        });
        return c
    };
    W.prototype.requestSession = W.prototype.requestSession;
    W.prototype.jb = function() {
        return this.b
    };
    W.prototype.getCurrentSession = W.prototype.jb;
    W.prototype.Za = function(a) {
        this.b && this.b.Ba(a)
    };
    W.prototype.endCurrentSession = W.prototype.Za;
    W.prototype.Db = function(a) {
        (this.ta = a == chrome.cast.ReceiverAvailability.AVAILABLE) && !this.b && this.ba && this.G.resumeSavedSession && chrome.cast.requestSessionById(this.ba);
        Sb(this)
    };
    W.prototype.Cb = function(a, b) {
        this.b || b != chrome.cast.ReceiverAction.CAST ? this.b && b == chrome.cast.ReceiverAction.STOP ? X(this, "SESSION_ENDING") : a && Ob(this.b, a) : X(this, "SESSION_STARTING")
    };
    W.prototype.Pa = function(a) {
        var b = "SESSION_STARTING" == this.o ? "SESSION_STARTED" : "SESSION_RESUMED";
        this.ba = null;
        this.b = new V(a, b);
        a.addUpdateListener(this.ua.bind(this));
        X(this, b)
    };
    W.prototype.ua = function() {
        if (this.b) switch (this.b.f.status) {
            case chrome.cast.SessionStatus.DISCONNECTED:
            case chrome.cast.SessionStatus.STOPPED:
                X(this, "SESSION_ENDED");
                this.ba = this.b.Oa;
                this.b = null;
                break;
            case chrome.cast.SessionStatus.CONNECTED:
                var a = this.b,
                    b = a.$,
                    c = a.f,
                    d;
                if (!(d = b.applicationId != c.appId || b.name != c.displayName)) {
                    a: if (d = b.namespaces, b = b.qa(c.namespaces || []), ja(d) && ja(b) && d.length == b.length) {
                        for (var c = d.length, e = 0; e < c; e++)
                            if (d[e] !== b[e]) {
                                d = !1;
                                break a
                            }
                        d = !0
                    } else d = !1;d = !d
                }
                d && (a.$ = new Hb(a.f),
                    a.h.dispatchEvent(new Jb(a.$)));
                Ob(a, a.f.receiver);
                a.R != a.f.statusText && (a.R = a.f.statusText, a.h.dispatchEvent(new Ib(a.R)));
                break;
            default:
                H("Unknown session status " + this.b.f.status)
        } else H("Received session update event without known session")
    };
    var X = function(a, b, c) {
            b != a.o && (a.o = b, a.b && (a.b.g = a.o), a.h.dispatchEvent(new Qb(a.b, a.o, c)), Sb(a))
        },
        Sb = function(a) {
            var b = "NO_DEVICES_AVAILABLE";
            switch (a.o) {
                case "SESSION_STARTING":
                case "SESSION_ENDING":
                    b = "CONNECTING";
                    break;
                case "SESSION_STARTED":
                case "SESSION_RESUMED":
                    b = "CONNECTED";
                    break;
                case "NO_SESSION":
                case "SESSION_ENDED":
                case "SESSION_START_FAILED":
                    b = a.ta ? "NOT_CONNECTED" : "NO_DEVICES_AVAILABLE";
                    break;
                default:
                    H("Unexpected session state: " + a.o)
            }
            b !== a.L && (a.L = b, a.h.dispatchEvent(new Pb(b)))
        };
    W.W = function() {
        return W.Ca ? W.Ca : W.Ca = new W
    };
    W.getInstance = W.W;
    var Ra = G("cast.framework.CastContext");
    var Tb = function() {
        return HTMLButtonElement.call(this) || this
    };
    g(Tb, HTMLButtonElement);
    f = Tb.prototype;
    f.createdCallback = function() {
        this.createShadowRoot().innerHTML = '<style>.connected {fill:var(--connected-color,#4285F4);}.disconnected {fill:var(--disconnected-color,#7D7D7D);}.hidden {opacity:0;}</style><svg id "svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24"><g><path id="arch0" class="disconnected" d="M1,18 L1,21 L4,21 C4,19.34 2.66,18 1,18 L1,18 Z"/><path id="arch1" class="disconnected" d="M1,14 L1,16 C3.76,16 6,18.24 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path id="arch2" class="disconnected" d="M1,10 L1,12 C5.97,12 10,16.03 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path id="box" class="disconnected" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path id="boxfill" class="hidden" d="M5,7 L5,8.63 C8,8.63 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>'
    };
    f.attachedCallback = function() {
        this.U = W.W();
        this.vb = this.wb.bind(this);
        this.Ja = this.ub.bind(this);
        this.da = [];
        for (var a = 0; 3 > a; a++) this.da.push(this.shadowRoot.getElementById("arch" + a));
        this.Ua = this.shadowRoot.getElementById("box");
        this.Va = this.shadowRoot.getElementById("boxfill");
        this.sa = 0;
        this.H = null;
        this.Ya = window.getComputedStyle(this, null).display;
        this.g = this.U.L;
        Ub(this);
        this.addEventListener("click", this.vb);
        this.U.addEventListener("caststatechanged", this.Ja)
    };
    f.detachedCallback = function() {
        this.U.removeEventListener("caststatechanged", this.Ja);
        null !== this.H && (window.clearTimeout(this.H), this.H = null)
    };
    f.wb = function() {
        this.U.requestSession()
    };
    f.ub = function(a) {
        this.g = a.castState;
        Ub(this)
    };
    var Ub = function(a) {
        if ("NO_DEVICES_AVAILABLE" == a.g) a.style.display = "none";
        else switch (a.style.display = a.Ya, a.g) {
            case "NOT_CONNECTED":
                Vb(a, !1, "hidden");
                break;
            case "CONNECTING":
                Vb(a, !1, "hidden");
                a.H || a.za();
                break;
            case "CONNECTED":
                Vb(a, !0, "connected")
        }
    };
    Tb.prototype.za = function() {
        this.H = null;
        if ("CONNECTING" == this.g) {
            for (var a = 0; 3 > a; a++) Wb(this.da[a], a == this.sa);
            this.sa = (this.sa + 1) % 3;
            this.H = window.setTimeout(this.za.bind(this), 300)
        }
    };
    var Vb = function(a, b, c) {
            for (var d = ha(a.da), e = d.next(); !e.done; e = d.next()) Wb(e.value, b);
            Wb(a.Ua, b);
            a.Va.setAttribute("class", c)
        },
        Wb = function(a, b) {
            a.setAttribute("class", b ? "connected" : "disconnected")
        };
    G("cast.framework.CastButton");
    document.registerElement("google-cast-button", {
        prototype: Tb.prototype,
        extends: "button"
    });
    t("cast.framework.RemotePlayer", function() {
        this.isMediaLoaded = this.isConnected = !1;
        this.currentTime = this.duration = 0;
        this.volumeLevel = 1;
        this.canSeek = this.canPause = this.isMuted = this.isPaused = !1;
        this.displayStatus = this.title = this.statusText = this.displayName = "";
        this.controller = this.savedPlayerState = this.playerState = this.imageUrl = this.mediaInfo = null
    });
    var Xb = function(a, b, c) {
        this.type = a;
        this.field = b;
        this.value = c
    };
    g(Xb, T);
    t("cast.framework.RemotePlayerChangedEvent", Xb);
    var Y = function(a) {
        var b = new U;
        S.call(this, Yb(a, b));
        this.h = b;
        a = W.W();
        a.addEventListener("sessionstatechanged", this.Fb.bind(this));
        (a = a.b) ? Bb(this, a.f): this.u()
    };
    g(Y, S);
    t("cast.framework.RemotePlayerController", Y);
    var Yb = function(a, b) {
        return new window.Proxy(a, {
            set: function(a, d, e) {
                if (e === a[d]) return !0;
                a[d] = e;
                b.dispatchEvent(new Xb(d + "Changed", d, e));
                b.dispatchEvent(new Xb("anyChanged", d, e));
                return !0
            }
        })
    };
    Y.prototype.addEventListener = function(a, b) {
        this.h.addEventListener(a, b)
    };
    Y.prototype.addEventListener = Y.prototype.addEventListener;
    Y.prototype.removeEventListener = function(a, b) {
        this.h.removeEventListener(a, b)
    };
    Y.prototype.removeEventListener = Y.prototype.removeEventListener;
    Y.prototype.Fb = function(a) {
        switch (a.sessionState) {
            case "SESSION_STARTED":
            case "SESSION_RESUMED":
                this.a.isConnected = !0;
                var b = a.session && a.session.f;
                b && (Bb(this, b), a.session.addEventListener("mediasession", this.Fa.bind(this)))
        }
    };
    Y.prototype.u = function(a) {
        var b = W.W().b;
        b ? this.a.savedPlayerState = null : this.a.isConnected && (this.a.savedPlayerState = {
            mediaInfo: this.a.mediaInfo,
            currentTime: this.a.currentTime,
            isPaused: this.a.isPaused
        });
        S.prototype.u.call(this, a);
        this.a.isConnected = !!b;
        this.a.statusText = b && b.R || "";
        a = b && b.oa;
        this.a.playerState = a && a.playerState || null
    };
    Y.prototype.S = function(a) {
        S.prototype.S.call(this, a);
        var b = (this.a.mediaInfo = a) && a.metadata;
        a = null;
        var c = "";
        b && (c = b.title || "", (b = b.images) && 0 < b.length && (a = b[0].url));
        this.a.title = c;
        this.a.imageUrl = a
    };
    Y.prototype.ra = function() {
        S.prototype.ra.call(this)
    };
    Y.prototype.playOrPause = Y.prototype.ra;
    Y.prototype.stop = function() {
        S.prototype.stop.call(this)
    };
    Y.prototype.stop = Y.prototype.stop;
    Y.prototype.seek = function() {
        S.prototype.seek.call(this)
    };
    Y.prototype.seek = Y.prototype.seek;
    Y.prototype.pa = function() {
        S.prototype.pa.call(this)
    };
    Y.prototype.muteOrUnmute = Y.prototype.pa;
    Y.prototype.wa = function() {
        S.prototype.wa.call(this)
    };
    Y.prototype.setVolumeLevel = Y.prototype.wa;
    Y.prototype.ja = function(a) {
        return S.prototype.ja.call(this, a)
    };
    Y.prototype.getFormattedTime = Y.prototype.ja;
    Y.prototype.ka = function(a, b) {
        return S.prototype.ka.call(this, a, b)
    };
    Y.prototype.getSeekPosition = Y.prototype.ka;
    Y.prototype.la = function(a, b) {
        return S.prototype.la.call(this, a, b)
    };
    Y.prototype.getSeekTime = Y.prototype.la;
}).call(window);
