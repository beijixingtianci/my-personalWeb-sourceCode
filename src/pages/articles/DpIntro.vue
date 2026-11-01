<template>
  <use-particles />

  <div class="dp-page" :class="{ 'is-embedded': embedded }">
    <div class="dp-inner">
      <RouterLink v-if="!embedded" to="/blog" class="back-link">← 返回博客列表</RouterLink>

      <h1 v-if="!embedded" class="dp-h1">动态规划（DP）入门：从斐波那契说起</h1>
      <p v-if="!embedded" class="dp-meta">2026-11-01 · # 算法 # DP</p>

      <h2>一、先别记定义，先听个比喻</h2>
      <p>想象你要去图书馆查一堆资料。第一次，你跑到书架前翻了十分钟，记下了答案。第二次又遇到<strong>同一个</strong>问题——如果你"聪明"，就把上次的结果记在小本本（备忘录）上，直接看一眼就走，<strong>不用再跑一趟</strong>。</p>
      <p>动态规划（Dynamic Programming，简称 <b>DP</b>）干的就是这件事：</p>
      <div class="card">
        <p style="margin:0">把大问题拆成<strong>会重复出现的小问题</strong>，把每个小问题的答案<strong>存起来</strong>，下次直接复用，而不是傻傻地重新算。省下的那部分"重新算"的功夫，就是 DP 的速度来源。</p>
      </div>

      <h2>二、DP 的两个核心特征</h2>
      <div class="feature">
        <div class="f">
          <span class="tag">特征 1</span>
          <h3>重叠子问题</h3>
          <p>同一个小问题被反复求解。比如算 <code>F(5)</code> 时，<code>F(2)</code> 会被算很多遍。DP 用"存结果"消灭这种浪费。</p>
        </div>
        <div class="f">
          <span class="tag">特征 2</span>
          <h3>最优子结构</h3>
          <p>大问题的最优解，能由小问题的最优解拼出来。斐波那契里 <code>F(n)=F(n-1)+F(n-2)</code> 就是最直白的一种。</p>
        </div>
      </div>
      <div class="tip"><b>重复的小问题，算一次就够了。</b></div>

      <h2>三、斐波那契：三种写法，差距惊人</h2>
      <p class="muted">定义：<code>F(0)=0</code>，<code>F(1)=1</code>，<code>F(n)=F(n-1)+F(n-2)</code>。下面三种写法结果一样，但时间复杂度的花费差值很大。</p>

      <h3>① 朴素递归</h3>
      <pre><span class="k">def</span> <span class="fn">f</span>(n):
    <span class="k">if</span> n &lt;= <span class="n">1</span>: <span class="k">return</span> n
    <span class="k">return</span> <span class="fn">f</span>(n-<span class="n">1</span>) + <span class="fn">f</span>(n-<span class="n">2</span>)</pre>
      <div class="warn">时间复杂度 <code>O(2ⁿ)</code>。算 <code>F(5)</code> 就要重复算很多遍 <code>F(2)</code>、<code>F(1)</code>。n 稍微大一点（比如 40+）就卡到怀疑人生。</div>

      <h3>② 记忆化递归（自顶向下，"边算边记"）</h3>
      <pre><span class="k">def</span> <span class="fn">f_memo</span>(n, memo={}):
    <span class="k">if</span> n <span class="k">in</span> memo: <span class="k">return</span> memo[n]   <span class="c"># 算过就直接取</span>
    <span class="k">if</span> n &lt;= <span class="n">1</span>: <span class="k">return</span> n
    memo[n] = <span class="fn">f_memo</span>(n-<span class="n">1</span>,memo) + <span class="fn">f_memo</span>(n-<span class="n">2</span>,memo)
    <span class="k">return</span> memo[n]</pre>
      <p class="muted">用了一个数组当笔记本，遇到已经算过的可以直接调用。每个 <code>F(k)</code> 只算一次，复杂度降到 <code>O(n)</code>。</p>

      <h3>③ 自底向上 DP（"先算小的，再往上推"）</h3>
      <pre><span class="k">def</span> <span class="fn">f_dp</span>(n):
    <span class="k">if</span> n &lt;= <span class="n">1</span>: <span class="k">return</span> n
    dp = [<span class="n">0</span>, <span class="n">1</span>]
    <span class="k">for</span> i <span class="k">in</span> <span class="fn">range</span>(<span class="n">2</span>, n+<span class="n">1</span>):
        dp.append(dp[i-<span class="n">1</span>] + dp[i-<span class="n">2</span>])
    <span class="k">return</span> dp[n]</pre>
      <div class="tip">这就是最标准的 DP 形态：开一张表（<code>dp</code>），从最小的问题开始，一格一格填到目标。没有递归，没有爆栈风险，空间还能压到 <code>O(1)</code>。</div>

      <h2>四、直观感受：朴素递归到底浪费了多少？</h2>
      <p>下面输入一个 n，看"朴素递归"要算多少次函数调用，而"DP"只需要几次。差距就是 DP 的意义。</p>
      <div class="ctrl">
        <label>n =</label>
        <input ref="nInput" type="number" value="10" min="1" max="40" />
        <button @click="runCompare">算给我看</button>
        <button class="ghost" @click="resetCompare">重置</button>
      </div>
      <div class="compare">
        <div class="col"><div class="big" ref="cNaive">—</div><div class="lab">朴素递归 · 函数调用次数</div></div>
        <div class="col"><div class="big" ref="cDp">—</div><div class="lab">DP · 计算步数</div></div>
        <div class="col"><div class="big" ref="cRatio">—</div><div class="lab">朴素是 DP 的多少倍</div></div>
      </div>
      <p class="muted" ref="cmpNote"></p>

      <h2>五、把"重叠"画出来：F(5) 的递归树</h2>
      <p>同一个值（比如 <code>F(2)</code>）在树里出现了好几次，每次都是<strong>重新算</strong>。颜色相同 = 同一个子问题被重复求解。</p>
      <div class="tree-box"><div ref="tree"></div></div>
      <div class="legend" ref="legend"></div>
      <div class="warn" ref="overlapNote"></div>

      <h2>六、一句话收尾</h2>
      <div class="card">
        <p style="margin:0">DP就是<strong>"别做重复劳动"</strong>的工程化版本：发现小问题会重复 → 把答案存起来 → 大问题靠小问题的答案拼出来。斐波那契是它最干净的例子，吃透这一个，后面背包、最长公共子序列都是同一个套路。</p>
      </div>

      <div v-if="!embedded" class="foot">本文为交互式博客文章 · 动态规划系列（一）</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UseParticles from '../../components/UseParticles.vue'

// embedded=true 时由 BlogPost.vue 嵌入渲染，隐藏自带标题栏
defineProps({
  embedded: { type: Boolean, default: false }
})

const nInput = ref(null)
const cNaive = ref(null)
const cDp = ref(null)
const cRatio = ref(null)
const cmpNote = ref(null)
const tree = ref(null)
const legend = ref(null)
const overlapNote = ref(null)

function fibVal(n) {
  let a = 0, b = 1
  if (n <= 1) return n
  for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t }
  return b
}

function runCompare() {
  const n = Math.max(1, Math.min(40, parseInt(nInput.value.value) || 10))
  let calls = 0
  function naive(k) { calls++; if (k <= 1) return k; return naive(k - 1) + naive(k - 2) }
  naive(n)
  const dpSteps = n + 1
  cNaive.value.textContent = calls.toLocaleString()
  cDp.value.textContent = dpSteps
  cRatio.value.textContent = (calls / dpSteps).toFixed(1) + '×'
  cmpNote.value.textContent =
    `F(${n}) = ${fibVal(n).toLocaleString()}。注意：朴素递归的调用次数随 n 指数爆炸，而 DP 只线性增长。`
}

function resetCompare() {
  cNaive.value.textContent = '—'
  cDp.value.textContent = '—'
  cRatio.value.textContent = '—'
  cmpNote.value.textContent = ''
}

const palette = ['#a1f2ea', '#7c73e6', '#ffd166', '#ff6b6b', '#5ee0a0', '#4cc9f0', '#f72585', '#fb8500']

function buildTree(n) {
  const node = { n, children: [] }
  if (n > 1) { node.children.push(buildTree(n - 1)); node.children.push(buildTree(n - 2)) }
  return node
}

function drawTree(N) {
  N = Math.max(2, Math.min(7, N || 5))
  const root = buildTree(N)
  let leaf = 0, maxDepth = 0
  ;(function layout(node, d) {
    node.depth = d; maxDepth = Math.max(maxDepth, d)
    if (node.children.length === 0) { node.x = leaf++ }
    else { node.children.forEach(c => layout(c, d + 1)); node.x = (node.children[0].x + node.children[node.children.length - 1].x) / 2 }
  })(root, 0)
  const dx = 46, dy = 58, padX = 24, padY = 24
  const w = leaf * dx + padX * 2
  const h = (maxDepth + 1) * dy + padY * 2
  const cnt = {}
  ;(function count(node) { cnt[node.n] = (cnt[node.n] || 0) + 1; node.children.forEach(count) })(root)
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('width', w); svg.setAttribute('height', h)
  const px = node => padX + node.x * dx + dx / 2
  const py = node => padY + node.depth * dy + dy / 2
  ;(function lines(node) {
    node.children.forEach(c => {
      const l = document.createElementNS(svgNS, 'line')
      l.setAttribute('x1', px(node)); l.setAttribute('y1', py(node))
      l.setAttribute('x2', px(c)); l.setAttribute('y2', py(c))
      l.setAttribute('stroke', '#3a4a6b'); l.setAttribute('stroke-width', '1.5')
      svg.appendChild(l); lines(c)
    })
  })(root)
  const colorOf = v => palette[v % palette.length]
  ;(function nodes(node) {
    const g = document.createElementNS(svgNS, 'g')
    const r = document.createElementNS(svgNS, 'circle')
    const overlap = cnt[node.n] > 1
    r.setAttribute('cx', px(node)); r.setAttribute('cy', py(node)); r.setAttribute('r', 17)
    r.setAttribute('fill', overlap ? colorOf(node.n) : '#1b2746')
    r.setAttribute('stroke', overlap ? '#fff' : '#3a4a6b')
    r.setAttribute('stroke-width', overlap ? '2' : '1.2')
    g.appendChild(r)
    const t = document.createElementNS(svgNS, 'text')
    t.setAttribute('x', px(node)); t.setAttribute('y', py(node) + 4)
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '12')
    t.setAttribute('fill', overlap ? '#0d1326' : '#e2e8f0')
    t.setAttribute('font-family', 'monospace'); t.textContent = 'F(' + node.n + ')'
    g.appendChild(t); svg.appendChild(g)
    node.children.forEach(nodes)
  })(root)
  tree.value.innerHTML = ''
  tree.value.appendChild(svg)
  legend.value.innerHTML = ''
  Object.keys(cnt).map(Number).sort((a, b) => a - b).forEach(v => {
    const s = document.createElement('span')
    const d = document.createElement('span'); d.className = 'dot'
    d.style.background = cnt[v] > 1 ? colorOf(v) : '#1b2746'
    d.style.border = cnt[v] > 1 ? '1px solid #fff' : '1px solid #3a4a6b'
    s.appendChild(d)
    s.appendChild(document.createTextNode(` F(${v}) 出现 ${cnt[v]} 次`))
    legend.value.appendChild(s)
  })
  const dup = Object.entries(cnt).filter(([, c]) => c > 1).map(([v, c]) => `F(${v})×${c}`).join('、')
  overlapNote.value.innerHTML = `朴素递归里，以下子问题被重复计算了：<b>${dup}</b>。DP 记住它们，每个只算一次——这就是速度差的全部来源。`
}

onMounted(() => {
  runCompare()
  drawTree(5)
})
</script>

<style scoped>
.dp-page {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 100px 20px 40px;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* 嵌入 BlogPost 时，让出背景与高度，露出壳子的统一背景 */
.dp-page.is-embedded {
  min-height: auto;
  padding: 0;
  margin: 0;
  background: none;
  background-image: none;
}
.dp-inner {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  color: #e2e8f0;
  line-height: 1.8;
}
.back-link { color: #a1f2ea; text-decoration: none; font-size: 14px; }
.dp-h1 {
  font-size: 30px; color: #fff; margin: 24px 0 8px;
  background: linear-gradient(90deg, #a1f2ea, #7c73e6);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.dp-meta { color: #cbd5e1; font-size: 14px; margin: 0 0 24px; }
h2 {
  font-size: 21px; margin: 42px 0 14px; color: #a1f2ea;
  border-left: 4px solid #534AB7; padding-left: 12px;
}
h3 { font-size: 16px; color: #7c73e6; margin: 22px 0 8px; }
p { margin: 12px 0; }
.muted { color: #9aa7c7; }
strong { color: #fff; }
.card {
  background: rgba(20, 29, 54, 0.82);
  border: 1px solid rgba(39, 50, 79, 0.9);
  border-radius: 14px; padding: 20px 22px; margin: 18px 0;
}
.feature { display: flex; gap: 16px; flex-wrap: wrap; margin: 18px 0; }
.feature .f {
  flex: 1 1 240px; background: rgba(20, 29, 54, 0.82);
  border: 1px solid rgba(39, 50, 79, 0.9); border-radius: 14px; padding: 18px 20px;
}
.feature .f .tag {
  display: inline-block; font-size: 12px; padding: 3px 10px; border-radius: 20px;
  background: #534AB7; color: #fff; margin-bottom: 10px;
}
.feature .f h3 { margin-top: 0; color: #a1f2ea; }
.feature .f p { margin: 0; }
code {
  background: #0a1020; color: #bfe9ff; padding: 2px 7px; border-radius: 6px;
  font-family: "JetBrains Mono", Consolas, monospace; font-size: 13.5px;
}
pre {
  background: #0a1020; border: 1px solid rgba(39, 50, 79, 0.9); border-radius: 12px;
  padding: 16px 18px; overflow: auto; margin: 14px 0;
  font-family: "JetBrains Mono", Consolas, monospace; font-size: 13px; line-height: 1.65;
}
pre .k { color: #7c73e6; } pre .fn { color: #a1f2ea; } pre .c { color: #6b7aa0; font-style: italic; } pre .n { color: #ffd166; }
.warn { border-left: 4px solid #ff6b6b; background: rgba(255, 107, 107, 0.1); padding: 12px 16px; border-radius: 8px; margin: 14px 0; }
.tip { border-left: 4px solid #5ee0a0; background: rgba(94, 224, 160, 0.1); padding: 12px 16px; border-radius: 8px; margin: 14px 0; }
.ctrl { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 14px 0; }
.ctrl input {
  width: 70px; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(39, 50, 79, 0.9);
  background: #0a1020; color: #e2e8f0; font-size: 15px;
}
button {
  background: linear-gradient(90deg, #534AB7, #7c73e6); color: #fff;
  border: none; padding: 9px 18px; border-radius: 9px; font-size: 14px; cursor: pointer;
}
button.ghost { background: transparent; border: 1px solid #7c73e6; color: #7c73e6; }
.compare { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0; }
.compare .col { background: rgba(20, 29, 54, 0.82); border: 1px solid rgba(39, 50, 79, 0.9); border-radius: 12px; padding: 14px; }
.compare .col .big { font-size: 26px; font-weight: 700; color: #a1f2ea; }
.compare .col .lab { font-size: 12px; color: #9aa7c7; }
.tree-box { overflow: auto; background: #0a1020; border: 1px solid rgba(39, 50, 79, 0.9); border-radius: 12px; padding: 14px; margin: 14px 0; }
.legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: #9aa7c7; margin: 8px 0; }
.legend .dot { width: 11px; height: 11px; border-radius: 3px; display: inline-block; }
.foot { text-align: center; color: #9aa7c7; font-size: 13px; margin-top: 50px; border-top: 1px solid rgba(39, 50, 79, 0.9); padding-top: 22px; }
@media (max-width: 680px) { .compare { grid-template-columns: 1fr; } }
</style>
