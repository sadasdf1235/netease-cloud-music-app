<template>
  <main class="app-shell">
    <section class="release-panel">
      <p class="release-eyebrow">Netease Cloud Music</p>
      <h1>产品级音乐网站正在载入</h1>
      <p>发布入口已收敛，后续功能模块会在这条干净路径上逐步交付。</p>
    </section>
  </main>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: #f6f2ea;
  color: #171312;
}

.release-panel {
  max-width: 680px;
  padding: 36px;
  border: 1px solid #ded4c2;
  border-radius: 8px;
  background: #fffaf1;
  box-shadow: 0 18px 60px rgb(71 42 24 / 12%);
}

.release-eyebrow {
  margin: 0 0 12px;
  color: #b3261e;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 12px;
  font-size: clamp(32px, 6vw, 56px);
  line-height: 1.02;
}

p {
  margin: 0;
  color: #665b4e;
  font-size: 17px;
}
</style>
