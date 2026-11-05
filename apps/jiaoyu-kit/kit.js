// ============================================================
// 教学内容收集 · 共用适配层
// student.html / wall.html / admin.html 共用
// ============================================================
// 统一接口：
//   Kit.init()                          初始化
//   Kit.submit(room, key, data)         提交一条（同 key 覆盖 = 可改）
//   Kit.loadAll(room)                   读整个房间的全部条目 {key: data}
//   Kit.onAll(room, cb)                 订阅房间实时变化
//   Kit.remove(room, key)               删一条（老师端纠错用）
//   Kit.newRoom()                       生成 4 位房间号
// ============================================================

const Kit = (() => {
  const cfg = window.KIT_CONFIG || { backend: 'local' };
  const mode = cfg.backend;

  // ---------- LOCAL：BroadcastChannel + localStorage ----------
  const localImpl = {
    mode: 'local',
    label: '单机模式（同一台电脑多标签页）',
    _chan: null,
    _cbs: [],

    async init() {
      this._chan = new BroadcastChannel('kit');
      this._chan.onmessage = (e) => {
        if (e.data.kind === 'change') {
          const all = this._read(e.data.room);
          this._cbs.forEach((c) => { if (c.room === e.data.room) c.cb(all); });
        }
      };
    },
    _key(room) { return 'kit_' + room; },
    _read(room) {
      try { return JSON.parse(localStorage.getItem(this._key(room)) || '{}'); }
      catch { return {}; }
    },
    async submit(room, key, data) {
      const all = this._read(room);
      all[key] = data;
      localStorage.setItem(this._key(room), JSON.stringify(all));
      this._chan.postMessage({ kind: 'change', room });
    },
    async loadAll(room) { return this._read(room); },
    onAll(room, cb) {
      this._cbs.push({ room, cb });
      cb(this._read(room));
    },
    async remove(room, key) {
      const all = this._read(room);
      delete all[key];
      localStorage.setItem(this._key(room), JSON.stringify(all));
      this._chan.postMessage({ kind: 'change', room });
    },
  };

  // ---------- FIREBASE Realtime Database（REST + SSE）----------
  // 不引 SDK：用 REST 写，用 EventSource 收实时推送。
  // 优点：零依赖、页面加载快、断线可重连。
  const firebaseImpl = {
    mode: 'firebase',
    label: 'Firebase 实时',
    _base: '',
    _streams: {},

    async init() {
      this._base = (cfg.firebase.databaseURL || '').replace(/\/$/, '');
      if (!this._base) throw new Error('config.js 里没有填 databaseURL');
    },
    _url(room, suffix = '') {
      return `${this._base}/rooms/${room}${suffix}.json`;
    },

    async submit(room, key, data) {
      const res = await fetch(this._url(room, '/' + encodeURIComponent(key)), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('提交失败 HTTP ' + res.status);
      return res.json();
    },

    async loadAll(room) {
      const res = await fetch(this._url(room));
      if (!res.ok) throw new Error('读取失败 HTTP ' + res.status);
      return (await res.json()) || {};
    },

    // EventSource 订阅整个房间
    onAll(room, cb) {
      // 先读一次，避免 EventSource 建立前空白
      this.loadAll(room).then(cb).catch(() => {});

      if (this._streams[room]) this._streams[room].close();
      const es = new EventSource(this._url(room));
      this._streams[room] = es;

      es.addEventListener('put', () => this.loadAll(room).then(cb).catch(() => {}));
      es.addEventListener('patch', () => this.loadAll(room).then(cb).catch(() => {}));
      // Firebase 的 SSE 事件名是 put/patch/keep-alive/cancel/auth_revoked
      es.onmessage = () => this.loadAll(room).then(cb).catch(() => {});
      es.onerror = () => {
        // 断开后浏览器会自动重连；不做特殊处理，避免重连风暴
      };
    },

    async remove(room, key) {
      const res = await fetch(this._url(room, '/' + encodeURIComponent(key)), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('删除失败 HTTP ' + res.status);
    },
  };

  const impl = mode === 'firebase' ? firebaseImpl : localImpl;

  return {
    get mode() { return impl.mode; },
    get label() { return impl.label; },
    init: () => impl.init(),
    submit: (room, key, data) => impl.submit(room, key, data),
    loadAll: (room) => impl.loadAll(room),
    onAll: (room, cb) => impl.onAll(room, cb),
    remove: (room, key) => impl.remove(room, key),

    // 生成 4 位房间号（1000-9999，避开易混数字）
    newRoom() {
      const bad = /[01]/;
      for (let i = 0; i < 50; i++) {
        const n = String(Math.floor(1000 + Math.random() * 9000));
        if (!bad.test(n)) return n;
      }
      return String(Math.floor(2000 + Math.random() * 8000));
    },

    // 匿名设备 ID（一人一条的依据，不含任何个人信息）
    deviceId() {
      let id = localStorage.getItem('kit_device');
      if (!id) {
        id = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
        localStorage.setItem('kit_device', id);
      }
      return id;
    },

    // 从 URL 取房间号：#/r/1234 或 ?r=1234
    roomFromUrl() {
      const m = location.hash.match(/\/r\/(\d{4})/);
      if (m) return m[1];
      const q = new URLSearchParams(location.search).get('r');
      if (q && /^\d{4}$/.test(q)) return q;
      return null;
    },
  };
})();
