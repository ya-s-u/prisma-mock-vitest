var L = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function I(l) {
  for (var t = 0, e = 0, n = 0, i = 0, r = "", s = 0; s < l.length; s++) {
    var h = l[s];
    if (s > 0 && (r += ";"), h.length !== 0) {
      for (var o = 0, a = [], u = 0, d = h; u < d.length; u++) {
        var c = d[u], S = g(c[0] - o);
        o = c[0], c.length > 1 && (S += g(c[1] - t) + g(c[2] - e) + g(c[3] - n), t = c[1], e = c[2], n = c[3]), c.length === 5 && (S += g(c[4] - i), i = c[4]), a.push(S);
      }
      r += a.join(",");
    }
  }
  return r;
}
function g(l) {
  var t = "";
  l = l < 0 ? -l << 1 | 1 : l << 1;
  do {
    var e = l & 31;
    l >>>= 5, l > 0 && (e |= 32), t += L[e];
  } while (l > 0);
  return t;
}
class m {
  constructor(t) {
    this.bits = t instanceof m ? t.bits.slice() : [];
  }
  add(t) {
    this.bits[t >> 5] |= 1 << (t & 31);
  }
  has(t) {
    return !!(this.bits[t >> 5] & 1 << (t & 31));
  }
}
class w {
  constructor(t, e, n) {
    this.start = t, this.end = e, this.original = n, this.intro = "", this.outro = "", this.content = n, this.storeName = !1, this.edited = !1, this.previous = null, this.next = null;
  }
  appendLeft(t) {
    this.outro += t;
  }
  appendRight(t) {
    this.intro = this.intro + t;
  }
  clone() {
    const t = new w(this.start, this.end, this.original);
    return t.intro = this.intro, t.outro = this.outro, t.content = this.content, t.storeName = this.storeName, t.edited = this.edited, t;
  }
  contains(t) {
    return this.start < t && t < this.end;
  }
  eachNext(t) {
    let e = this;
    for (; e; )
      t(e), e = e.next;
  }
  eachPrevious(t) {
    let e = this;
    for (; e; )
      t(e), e = e.previous;
  }
  edit(t, e, n) {
    return this.content = t, n || (this.intro = "", this.outro = ""), this.storeName = e, this.edited = !0, this;
  }
  prependLeft(t) {
    this.outro = t + this.outro;
  }
  prependRight(t) {
    this.intro = t + this.intro;
  }
  split(t) {
    const e = t - this.start, n = this.original.slice(0, e), i = this.original.slice(e);
    this.original = n;
    const r = new w(t, this.end, i);
    return r.outro = this.outro, this.outro = "", this.end = t, this.edited ? (r.edit("", !1), this.content = "") : this.content = n, r.next = this.next, r.next && (r.next.previous = r), r.previous = this, this.next = r, r;
  }
  toString() {
    return this.intro + this.content + this.outro;
  }
  trimEnd(t) {
    if (this.outro = this.outro.replace(t, ""), this.outro.length)
      return !0;
    const e = this.content.replace(t, "");
    if (e.length)
      return e !== this.content && this.split(this.start + e.length).edit("", void 0, !0), !0;
    if (this.edit("", void 0, !0), this.intro = this.intro.replace(t, ""), this.intro.length)
      return !0;
  }
  trimStart(t) {
    if (this.intro = this.intro.replace(t, ""), this.intro.length)
      return !0;
    const e = this.content.replace(t, "");
    if (e.length)
      return e !== this.content && (this.split(this.end - e.length), this.edit("", void 0, !0)), !0;
    if (this.edit("", void 0, !0), this.outro = this.outro.replace(t, ""), this.outro.length)
      return !0;
  }
}
function O() {
  return typeof window < "u" && typeof window.btoa == "function" ? (l) => window.btoa(unescape(encodeURIComponent(l))) : typeof Buffer == "function" ? (l) => Buffer.from(l, "utf-8").toString("base64") : () => {
    throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
  };
}
const N = /* @__PURE__ */ O();
class v {
  constructor(t) {
    this.version = 3, this.file = t.file, this.sources = t.sources, this.sourcesContent = t.sourcesContent, this.names = t.names, this.mappings = I(t.mappings);
  }
  toString() {
    return JSON.stringify(this);
  }
  toUrl() {
    return "data:application/json;charset=utf-8;base64," + N(this.toString());
  }
}
function _(l) {
  const t = l.split(`
`), e = t.filter((r) => /^\t+/.test(r)), n = t.filter((r) => /^ {2,}/.test(r));
  if (e.length === 0 && n.length === 0)
    return null;
  if (e.length >= n.length)
    return "	";
  const i = n.reduce((r, s) => {
    const h = /^ +/.exec(s)[0].length;
    return Math.min(h, r);
  }, 1 / 0);
  return new Array(i + 1).join(" ");
}
function E(l, t) {
  const e = l.split(/[/\\]/), n = t.split(/[/\\]/);
  for (e.pop(); e[0] === n[0]; )
    e.shift(), n.shift();
  if (e.length) {
    let i = e.length;
    for (; i--; )
      e[i] = "..";
  }
  return e.concat(n).join("/");
}
const j = Object.prototype.toString;
function y(l) {
  return j.call(l) === "[object Object]";
}
function C(l) {
  const t = l.split(`
`), e = [];
  for (let n = 0, i = 0; n < t.length; n++)
    e.push(i), i += t[n].length + 1;
  return function(i) {
    let r = 0, s = e.length;
    for (; r < s; ) {
      const a = r + s >> 1;
      i < e[a] ? s = a : r = a + 1;
    }
    const h = r - 1, o = i - e[h];
    return { line: h, column: o };
  };
}
class k {
  constructor(t) {
    this.hires = t, this.generatedCodeLine = 0, this.generatedCodeColumn = 0, this.raw = [], this.rawSegments = this.raw[this.generatedCodeLine] = [], this.pending = null;
  }
  addEdit(t, e, n, i) {
    if (e.length) {
      const r = [this.generatedCodeColumn, t, n.line, n.column];
      i >= 0 && r.push(i), this.rawSegments.push(r);
    } else
      this.pending && this.rawSegments.push(this.pending);
    this.advance(e), this.pending = null;
  }
  addUneditedChunk(t, e, n, i, r) {
    let s = e.start, h = !0;
    for (; s < e.end; )
      (this.hires || h || r.has(s)) && this.rawSegments.push([this.generatedCodeColumn, t, i.line, i.column]), n[s] === `
` ? (i.line += 1, i.column = 0, this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, h = !0) : (i.column += 1, this.generatedCodeColumn += 1, h = !1), s += 1;
    this.pending = null;
  }
  advance(t) {
    if (!t)
      return;
    const e = t.split(`
`);
    if (e.length > 1) {
      for (let n = 0; n < e.length - 1; n++)
        this.generatedCodeLine++, this.raw[this.generatedCodeLine] = this.rawSegments = [];
      this.generatedCodeColumn = 0;
    }
    this.generatedCodeColumn += e[e.length - 1].length;
  }
}
const p = `
`, f = {
  insertLeft: !1,
  insertRight: !1,
  storeName: !1
};
class b {
  constructor(t, e = {}) {
    const n = new w(0, t.length, t);
    Object.defineProperties(this, {
      original: { writable: !0, value: t },
      outro: { writable: !0, value: "" },
      intro: { writable: !0, value: "" },
      firstChunk: { writable: !0, value: n },
      lastChunk: { writable: !0, value: n },
      lastSearchedChunk: { writable: !0, value: n },
      byStart: { writable: !0, value: {} },
      byEnd: { writable: !0, value: {} },
      filename: { writable: !0, value: e.filename },
      indentExclusionRanges: { writable: !0, value: e.indentExclusionRanges },
      sourcemapLocations: { writable: !0, value: new m() },
      storedNames: { writable: !0, value: {} },
      indentStr: { writable: !0, value: void 0 }
    }), this.byStart[0] = n, this.byEnd[t.length] = n;
  }
  addSourcemapLocation(t) {
    this.sourcemapLocations.add(t);
  }
  append(t) {
    if (typeof t != "string")
      throw new TypeError("outro content must be a string");
    return this.outro += t, this;
  }
  appendLeft(t, e) {
    if (typeof e != "string")
      throw new TypeError("inserted content must be a string");
    this._split(t);
    const n = this.byEnd[t];
    return n ? n.appendLeft(e) : this.intro += e, this;
  }
  appendRight(t, e) {
    if (typeof e != "string")
      throw new TypeError("inserted content must be a string");
    this._split(t);
    const n = this.byStart[t];
    return n ? n.appendRight(e) : this.outro += e, this;
  }
  clone() {
    const t = new b(this.original, { filename: this.filename });
    let e = this.firstChunk, n = t.firstChunk = t.lastSearchedChunk = e.clone();
    for (; e; ) {
      t.byStart[n.start] = n, t.byEnd[n.end] = n;
      const i = e.next, r = i && i.clone();
      r && (n.next = r, r.previous = n, n = r), e = i;
    }
    return t.lastChunk = n, this.indentExclusionRanges && (t.indentExclusionRanges = this.indentExclusionRanges.slice()), t.sourcemapLocations = new m(this.sourcemapLocations), t.intro = this.intro, t.outro = this.outro, t;
  }
  generateDecodedMap(t) {
    t = t || {};
    const e = 0, n = Object.keys(this.storedNames), i = new k(t.hires), r = C(this.original);
    return this.intro && i.advance(this.intro), this.firstChunk.eachNext((s) => {
      const h = r(s.start);
      s.intro.length && i.advance(s.intro), s.edited ? i.addEdit(
        e,
        s.content,
        h,
        s.storeName ? n.indexOf(s.original) : -1
      ) : i.addUneditedChunk(e, s, this.original, h, this.sourcemapLocations), s.outro.length && i.advance(s.outro);
    }), {
      file: t.file ? t.file.split(/[/\\]/).pop() : null,
      sources: [t.source ? E(t.file || "", t.source) : null],
      sourcesContent: t.includeContent ? [this.original] : [null],
      names: n,
      mappings: i.raw
    };
  }
  generateMap(t) {
    return new v(this.generateDecodedMap(t));
  }
  _ensureindentStr() {
    this.indentStr === void 0 && (this.indentStr = _(this.original));
  }
  _getRawIndentString() {
    return this._ensureindentStr(), this.indentStr;
  }
  getIndentString() {
    return this._ensureindentStr(), this.indentStr === null ? "	" : this.indentStr;
  }
  indent(t, e) {
    const n = /^[^\r\n]/gm;
    if (y(t) && (e = t, t = void 0), t === void 0 && (this._ensureindentStr(), t = this.indentStr || "	"), t === "")
      return this;
    e = e || {};
    const i = {};
    e.exclude && (typeof e.exclude[0] == "number" ? [e.exclude] : e.exclude).forEach((u) => {
      for (let d = u[0]; d < u[1]; d += 1)
        i[d] = !0;
    });
    let r = e.indentStart !== !1;
    const s = (a) => r ? `${t}${a}` : (r = !0, a);
    this.intro = this.intro.replace(n, s);
    let h = 0, o = this.firstChunk;
    for (; o; ) {
      const a = o.end;
      if (o.edited)
        i[h] || (o.content = o.content.replace(n, s), o.content.length && (r = o.content[o.content.length - 1] === `
`));
      else
        for (h = o.start; h < a; ) {
          if (!i[h]) {
            const u = this.original[h];
            u === `
` ? r = !0 : u !== "\r" && r && (r = !1, h === o.start || (this._splitChunk(o, h), o = o.next), o.prependRight(t));
          }
          h += 1;
        }
      h = o.end, o = o.next;
    }
    return this.outro = this.outro.replace(n, s), this;
  }
  insert() {
    throw new Error(
      "magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)"
    );
  }
  insertLeft(t, e) {
    return f.insertLeft || (console.warn(
      "magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"
    ), f.insertLeft = !0), this.appendLeft(t, e);
  }
  insertRight(t, e) {
    return f.insertRight || (console.warn(
      "magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"
    ), f.insertRight = !0), this.prependRight(t, e);
  }
  move(t, e, n) {
    if (n >= t && n <= e)
      throw new Error("Cannot move a selection inside itself");
    this._split(t), this._split(e), this._split(n);
    const i = this.byStart[t], r = this.byEnd[e], s = i.previous, h = r.next, o = this.byStart[n];
    if (!o && r === this.lastChunk)
      return this;
    const a = o ? o.previous : this.lastChunk;
    return s && (s.next = h), h && (h.previous = s), a && (a.next = i), o && (o.previous = r), i.previous || (this.firstChunk = r.next), r.next || (this.lastChunk = i.previous, this.lastChunk.next = null), i.previous = a, r.next = o || null, a || (this.firstChunk = i), o || (this.lastChunk = r), this;
  }
  overwrite(t, e, n, i) {
    return i = i || {}, this.update(t, e, n, { ...i, overwrite: !i.contentOnly });
  }
  update(t, e, n, i) {
    if (typeof n != "string")
      throw new TypeError("replacement content must be a string");
    for (; t < 0; )
      t += this.original.length;
    for (; e < 0; )
      e += this.original.length;
    if (e > this.original.length)
      throw new Error("end is out of bounds");
    if (t === e)
      throw new Error(
        "Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead"
      );
    this._split(t), this._split(e), i === !0 && (f.storeName || (console.warn(
      "The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"
    ), f.storeName = !0), i = { storeName: !0 });
    const r = i !== void 0 ? i.storeName : !1, s = i !== void 0 ? i.overwrite : !1;
    if (r) {
      const a = this.original.slice(t, e);
      Object.defineProperty(this.storedNames, a, {
        writable: !0,
        value: !0,
        enumerable: !0
      });
    }
    const h = this.byStart[t], o = this.byEnd[e];
    if (h) {
      let a = h;
      for (; a !== o; ) {
        if (a.next !== this.byStart[a.end])
          throw new Error("Cannot overwrite across a split point");
        a = a.next, a.edit("", !1);
      }
      h.edit(n, r, !s);
    } else {
      const a = new w(t, e, "").edit(n, r);
      o.next = a, a.previous = o;
    }
    return this;
  }
  prepend(t) {
    if (typeof t != "string")
      throw new TypeError("outro content must be a string");
    return this.intro = t + this.intro, this;
  }
  prependLeft(t, e) {
    if (typeof e != "string")
      throw new TypeError("inserted content must be a string");
    this._split(t);
    const n = this.byEnd[t];
    return n ? n.prependLeft(e) : this.intro = e + this.intro, this;
  }
  prependRight(t, e) {
    if (typeof e != "string")
      throw new TypeError("inserted content must be a string");
    this._split(t);
    const n = this.byStart[t];
    return n ? n.prependRight(e) : this.outro = e + this.outro, this;
  }
  remove(t, e) {
    for (; t < 0; )
      t += this.original.length;
    for (; e < 0; )
      e += this.original.length;
    if (t === e)
      return this;
    if (t < 0 || e > this.original.length)
      throw new Error("Character is out of bounds");
    if (t > e)
      throw new Error("end must be greater than start");
    this._split(t), this._split(e);
    let n = this.byStart[t];
    for (; n; )
      n.intro = "", n.outro = "", n.edit(""), n = e > n.end ? this.byStart[n.end] : null;
    return this;
  }
  lastChar() {
    if (this.outro.length)
      return this.outro[this.outro.length - 1];
    let t = this.lastChunk;
    do {
      if (t.outro.length)
        return t.outro[t.outro.length - 1];
      if (t.content.length)
        return t.content[t.content.length - 1];
      if (t.intro.length)
        return t.intro[t.intro.length - 1];
    } while (t = t.previous);
    return this.intro.length ? this.intro[this.intro.length - 1] : "";
  }
  lastLine() {
    let t = this.outro.lastIndexOf(p);
    if (t !== -1)
      return this.outro.substr(t + 1);
    let e = this.outro, n = this.lastChunk;
    do {
      if (n.outro.length > 0) {
        if (t = n.outro.lastIndexOf(p), t !== -1)
          return n.outro.substr(t + 1) + e;
        e = n.outro + e;
      }
      if (n.content.length > 0) {
        if (t = n.content.lastIndexOf(p), t !== -1)
          return n.content.substr(t + 1) + e;
        e = n.content + e;
      }
      if (n.intro.length > 0) {
        if (t = n.intro.lastIndexOf(p), t !== -1)
          return n.intro.substr(t + 1) + e;
        e = n.intro + e;
      }
    } while (n = n.previous);
    return t = this.intro.lastIndexOf(p), t !== -1 ? this.intro.substr(t + 1) + e : this.intro + e;
  }
  slice(t = 0, e = this.original.length) {
    for (; t < 0; )
      t += this.original.length;
    for (; e < 0; )
      e += this.original.length;
    let n = "", i = this.firstChunk;
    for (; i && (i.start > t || i.end <= t); ) {
      if (i.start < e && i.end >= e)
        return n;
      i = i.next;
    }
    if (i && i.edited && i.start !== t)
      throw new Error(`Cannot use replaced character ${t} as slice start anchor.`);
    const r = i;
    for (; i; ) {
      i.intro && (r !== i || i.start === t) && (n += i.intro);
      const s = i.start < e && i.end >= e;
      if (s && i.edited && i.end !== e)
        throw new Error(`Cannot use replaced character ${e} as slice end anchor.`);
      const h = r === i ? t - i.start : 0, o = s ? i.content.length + e - i.end : i.content.length;
      if (n += i.content.slice(h, o), i.outro && (!s || i.end === e) && (n += i.outro), s)
        break;
      i = i.next;
    }
    return n;
  }
  snip(t, e) {
    const n = this.clone();
    return n.remove(0, t), n.remove(e, n.original.length), n;
  }
  _split(t) {
    if (this.byStart[t] || this.byEnd[t])
      return;
    let e = this.lastSearchedChunk;
    const n = t > e.end;
    for (; e; ) {
      if (e.contains(t))
        return this._splitChunk(e, t);
      e = n ? this.byStart[e.end] : this.byEnd[e.start];
    }
  }
  _splitChunk(t, e) {
    if (t.edited && t.content.length) {
      const i = C(this.original)(e);
      throw new Error(
        `Cannot split a chunk that has already been edited (${i.line}:${i.column} \u2013 "${t.original}")`
      );
    }
    const n = t.split(e);
    return this.byEnd[e] = t, this.byStart[e] = n, this.byEnd[n.end] = n, t === this.lastChunk && (this.lastChunk = n), this.lastSearchedChunk = t, !0;
  }
  toString() {
    let t = this.intro, e = this.firstChunk;
    for (; e; )
      t += e.toString(), e = e.next;
    return t + this.outro;
  }
  isEmpty() {
    let t = this.firstChunk;
    do
      if (t.intro.length && t.intro.trim() || t.content.length && t.content.trim() || t.outro.length && t.outro.trim())
        return !1;
    while (t = t.next);
    return !0;
  }
  length() {
    let t = this.firstChunk, e = 0;
    do
      e += t.intro.length + t.content.length + t.outro.length;
    while (t = t.next);
    return e;
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(t) {
    return this.trimStart(t).trimEnd(t);
  }
  trimEndAborted(t) {
    const e = new RegExp((t || "\\s") + "+$");
    if (this.outro = this.outro.replace(e, ""), this.outro.length)
      return !0;
    let n = this.lastChunk;
    do {
      const i = n.end, r = n.trimEnd(e);
      if (n.end !== i && (this.lastChunk === n && (this.lastChunk = n.next), this.byEnd[n.end] = n, this.byStart[n.next.start] = n.next, this.byEnd[n.next.end] = n.next), r)
        return !0;
      n = n.previous;
    } while (n);
    return !1;
  }
  trimEnd(t) {
    return this.trimEndAborted(t), this;
  }
  trimStartAborted(t) {
    const e = new RegExp("^" + (t || "\\s") + "+");
    if (this.intro = this.intro.replace(e, ""), this.intro.length)
      return !0;
    let n = this.firstChunk;
    do {
      const i = n.end, r = n.trimStart(e);
      if (n.end !== i && (n === this.lastChunk && (this.lastChunk = n.next), this.byEnd[n.end] = n, this.byStart[n.next.start] = n.next, this.byEnd[n.next.end] = n.next), r)
        return !0;
      n = n.next;
    } while (n);
    return !1;
  }
  trimStart(t) {
    return this.trimStartAborted(t), this;
  }
  hasChanged() {
    return this.original !== this.toString();
  }
  _replaceRegexp(t, e) {
    function n(r, s) {
      return typeof e == "string" ? e.replace(/\$(\$|&|\d+)/g, (h, o) => o === "$" ? "$" : o === "&" ? r[0] : +o < r.length ? r[+o] : `$${o}`) : e(...r, r.index, s, r.groups);
    }
    function i(r, s) {
      let h;
      const o = [];
      for (; h = r.exec(s); )
        o.push(h);
      return o;
    }
    if (t.global)
      i(t, this.original).forEach((s) => {
        s.index != null && this.overwrite(
          s.index,
          s.index + s[0].length,
          n(s, this.original)
        );
      });
    else {
      const r = this.original.match(t);
      r && r.index != null && this.overwrite(
        r.index,
        r.index + r[0].length,
        n(r, this.original)
      );
    }
    return this;
  }
  _replaceString(t, e) {
    const { original: n } = this, i = n.indexOf(t);
    return i !== -1 && this.overwrite(i, i + t.length, e), this;
  }
  replace(t, e) {
    return typeof t == "string" ? this._replaceString(t, e) : this._replaceRegexp(t, e);
  }
  _replaceAllString(t, e) {
    const { original: n } = this, i = t.length;
    for (let r = n.indexOf(t); r !== -1; r = n.indexOf(t, r + i))
      this.overwrite(r, r + i, e);
    return this;
  }
  replaceAll(t, e) {
    if (typeof t == "string")
      return this._replaceAllString(t, e);
    if (!t.global)
      throw new TypeError(
        "MagicString.prototype.replaceAll called with a non-global RegExp argument"
      );
    return this._replaceRegexp(t, e);
  }
}
const x = Object.prototype.hasOwnProperty;
class R {
  constructor(t = {}) {
    this.intro = t.intro || "", this.separator = t.separator !== void 0 ? t.separator : `
`, this.sources = [], this.uniqueSources = [], this.uniqueSourceIndexByFilename = {};
  }
  addSource(t) {
    if (t instanceof b)
      return this.addSource({
        content: t,
        filename: t.filename,
        separator: this.separator
      });
    if (!y(t) || !t.content)
      throw new Error(
        "bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`"
      );
    if (["filename", "indentExclusionRanges", "separator"].forEach((e) => {
      x.call(t, e) || (t[e] = t.content[e]);
    }), t.separator === void 0 && (t.separator = this.separator), t.filename)
      if (!x.call(this.uniqueSourceIndexByFilename, t.filename))
        this.uniqueSourceIndexByFilename[t.filename] = this.uniqueSources.length, this.uniqueSources.push({ filename: t.filename, content: t.content.original });
      else {
        const e = this.uniqueSources[this.uniqueSourceIndexByFilename[t.filename]];
        if (t.content.original !== e.content)
          throw new Error(`Illegal source: same filename (${t.filename}), different contents`);
      }
    return this.sources.push(t), this;
  }
  append(t, e) {
    return this.addSource({
      content: new b(t),
      separator: e && e.separator || ""
    }), this;
  }
  clone() {
    const t = new R({
      intro: this.intro,
      separator: this.separator
    });
    return this.sources.forEach((e) => {
      t.addSource({
        filename: e.filename,
        content: e.content.clone(),
        separator: e.separator
      });
    }), t;
  }
  generateDecodedMap(t = {}) {
    const e = [];
    this.sources.forEach((i) => {
      Object.keys(i.content.storedNames).forEach((r) => {
        ~e.indexOf(r) || e.push(r);
      });
    });
    const n = new k(t.hires);
    return this.intro && n.advance(this.intro), this.sources.forEach((i, r) => {
      r > 0 && n.advance(this.separator);
      const s = i.filename ? this.uniqueSourceIndexByFilename[i.filename] : -1, h = i.content, o = C(h.original);
      h.intro && n.advance(h.intro), h.firstChunk.eachNext((a) => {
        const u = o(a.start);
        a.intro.length && n.advance(a.intro), i.filename ? a.edited ? n.addEdit(
          s,
          a.content,
          u,
          a.storeName ? e.indexOf(a.original) : -1
        ) : n.addUneditedChunk(
          s,
          a,
          h.original,
          u,
          h.sourcemapLocations
        ) : n.advance(a.content), a.outro.length && n.advance(a.outro);
      }), h.outro && n.advance(h.outro);
    }), {
      file: t.file ? t.file.split(/[/\\]/).pop() : null,
      sources: this.uniqueSources.map((i) => t.file ? E(t.file, i.filename) : i.filename),
      sourcesContent: this.uniqueSources.map((i) => t.includeContent ? i.content : null),
      names: e,
      mappings: n.raw
    };
  }
  generateMap(t) {
    return new v(this.generateDecodedMap(t));
  }
  getIndentString() {
    const t = {};
    return this.sources.forEach((e) => {
      const n = e.content._getRawIndentString();
      n !== null && (t[n] || (t[n] = 0), t[n] += 1);
    }), Object.keys(t).sort((e, n) => t[e] - t[n])[0] || "	";
  }
  indent(t) {
    if (arguments.length || (t = this.getIndentString()), t === "")
      return this;
    let e = !this.intro || this.intro.slice(-1) === `
`;
    return this.sources.forEach((n, i) => {
      const r = n.separator !== void 0 ? n.separator : this.separator, s = e || i > 0 && /\r?\n$/.test(r);
      n.content.indent(t, {
        exclude: n.indentExclusionRanges,
        indentStart: s
      }), e = n.content.lastChar() === `
`;
    }), this.intro && (this.intro = t + this.intro.replace(/^[^\n]/gm, (n, i) => i > 0 ? t + n : n)), this;
  }
  prepend(t) {
    return this.intro = t + this.intro, this;
  }
  toString() {
    const t = this.sources.map((e, n) => {
      const i = e.separator !== void 0 ? e.separator : this.separator;
      return (n > 0 ? i : "") + e.content.toString();
    }).join("");
    return this.intro + t;
  }
  isEmpty() {
    return !(this.intro.length && this.intro.trim() || this.sources.some((t) => !t.content.isEmpty()));
  }
  length() {
    return this.sources.reduce(
      (t, e) => t + e.content.length(),
      this.intro.length
    );
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(t) {
    return this.trimStart(t).trimEnd(t);
  }
  trimStart(t) {
    const e = new RegExp("^" + (t || "\\s") + "+");
    if (this.intro = this.intro.replace(e, ""), !this.intro) {
      let n, i = 0;
      do
        if (n = this.sources[i++], !n)
          break;
      while (!n.content.trimStartAborted(t));
    }
    return this;
  }
  trimEnd(t) {
    const e = new RegExp((t || "\\s") + "+$");
    let n, i = this.sources.length - 1;
    do
      if (n = this.sources[i--], !n) {
        this.intro = this.intro.replace(e, "");
        break;
      }
    while (!n.content.trimEndAborted(t));
    return this;
  }
}
export {
  R as Bundle,
  v as SourceMap,
  b as default
};
//# sourceMappingURL=chunk-magic-string.ffe2b171.486948a7.mjs.map
