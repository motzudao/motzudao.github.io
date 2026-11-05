// ============================================================
// 活动定义 —— 以后每次新活动只改这个文件
// ============================================================
// 改哪里：
//   title      页面大标题
//   subtitle   副标题
//   intro      给学生看的说明（可多段）
//   fields     要学生填的栏位（顺序即显示顺序）
//   wall       投影墙上每张卡片显示哪个 field
//
// field 类型：
//   { id, label, hint, type: 'text' | 'textarea' | 'number' | 'select', options }
// ============================================================

window.ACTIVITY = {
  // 活动标识：不同活动用不同 id，数据不会串
  id: 'goalcard',

  title: '我的大事卡',
  subtitle: '统考结束了，方向不能跟着下课。',

  intro: [
    '考完试的第一周最舒服，第三周开始心里会空。这份卡是给那个「空」准备的：趁头脑还清醒，给自己定两件大事——一个三个月的，一个六个月的。',
    '规则只有一条：自己定的，自己认。交上来只是让你看见大家都有在想，不是打分。',
  ],

  // 是否收真名（false = 完全匿名，墙上只显示编号）
  // 以后需要点名叫人时改成 true，后台就能看到谁交了
  collectName: false,

  fields: [
    { id: 'num',   label: '我的编号',          hint: '抽一个 1-99 的编号，自己记得', type: 'text', short: true },
    { id: 'cls',   label: '班级',              hint: '例：高三信',                  type: 'text', short: true },

    { id: 'g3',    label: '三个月的大事',       hint: '一句话说得清',               type: 'textarea', group: '3' },
    { id: 'g3done',label: '怎么算做到了',       hint: '到期那天我拿得出什么？',      type: 'textarea', group: '3' },
    { id: 'g3why', label: '为什么是它',         hint: '我为什么想做这个？',          type: 'textarea', group: '3' },
    { id: 'g3step',label: '第一步',             hint: '这个星期内就能做的具体动作',  type: 'textarea', group: '3' },

    { id: 'g6',    label: '六个月的大事',       hint: '一句话说得清',               type: 'textarea', group: '6' },
    { id: 'g6done',label: '怎么算做到了',       hint: '到期那天我拿得出什么？',      type: 'textarea', group: '6' },
    { id: 'g6why', label: '为什么是它',         hint: '我为什么想学这个？',          type: 'textarea', group: '6' },
    { id: 'g6step',label: '第一步',             hint: '这个星期内就能做的具体动作',  type: 'textarea', group: '6' },
  ],

  // 分组标题（group 对应 fields 里的 group 值）
  groups: {
    '3': { title: '三个月的大事', due: '2027-02-02', note: '做出一样实质的东西' },
    '6': { title: '六个月的大事', due: '2027-05-02', note: '学会一样东西' },
  },

  // 投影墙上每张卡片显示什么（field id 数组）
  wall: ['g3', 'g6'],
  // 墙上每张卡片的小标签
  wallLabels: { g3: '三个月的大事', g6: '六个月的大事' },
};
