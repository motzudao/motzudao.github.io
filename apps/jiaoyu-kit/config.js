// ============================================================
// 教学内容收集 · 后端配置
// ============================================================
// backend 三种值：
//   'local'    —— 零后端。同一浏览器多标签页实时同步。
//                 用途：开发验证、单机演示。学生手机连不上。
//   'firebase' —— 真实时（WebSocket）。填下面 databaseURL。
//
// ⚠️ databaseURL 是「公开地址」，设计上就放在前端。
//    安全靠 Realtime Database 的 Rules 把关，不靠藏地址。
// ============================================================

window.KIT_CONFIG = {
  backend: 'firebase',

  firebase: {
    // motzu 的 fenkeng-befa0 项目（asia-southeast1，离马来西亚最近）
    databaseURL: 'https://fenkeng-befa0-default-rtdb.asia-southeast1.firebasedatabase.app',
    apiKey: '',   // Realtime Database 不用 Auth，留空即可
  },
};
