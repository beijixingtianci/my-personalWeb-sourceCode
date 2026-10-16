<template>
  <div class="resume-page">
    <!-- 粒子动画背景 -->
    <use-particles />

    <div class="resume-content">
      <!-- 标题区 -->
      <div class="resume-header">
        <div class="avatar-section">
          <div class="avatar-circle">
            <img src="/images/firstPhoto.jpg" alt="头像" class="avatar-img" />
          </div>
        </div>
        <div class="header-info">
          <h1 class="resume-name">유흠</h1>
          <p class="resume-name-en">202313537</p>
          <p class="resume-tagline">결국 평범하되어 평범하게 살지 않는다</p>
        </div>
      </div>

      <!-- 教育背景 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="fas fa-graduation-cap"></i> 교육 배경</h2>
        <div class="section-content">
          <div class="edu-item">
            <div class="item-header">
              <h3>건국대학교 (Konkuk University)</h3>
              <span class="item-period">재학생</span>
            </div>
            <p class="edu-detail">컴퓨터공학과 (computer science and engineering)</p>
          </div>
        </div>
      </section>

      <!-- 专业技能 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="fas fa-code"></i> 전공 기술</h2>
        <div class="section-content">
          <div class="skills-grid">
            <div class="skill-category">
              <h3>frontend</h3>
              <div class="skill-tags">
                <span class="skill-tag">Vue 3</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">HTML / CSS</span>
                <span class="skill-tag">Vite</span>
                <span class="skill-tag">Composition API</span>
              </div>
            </div>
            <div class="skill-category">
              <h3>backend</h3>
              <div class="skill-tags">
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">Express.js</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">FastAPI</span>
                <span class="skill-tag">PostgreSQL</span>
                <span class="skill-tag">Redis</span>
              </div>
            </div>
            <div class="skill-category">
              <h3>programming languages</h3>
              <div class="skill-tags">
                <span class="skill-tag">Java</span>
                <span class="skill-tag">C/C++</span>
                <span class="skill-tag">C#</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">Android/Kotlin</span>
              </div>
            </div>
            <div class="skill-category">
              <h3>tools & platforms</h3>
              <div class="skill-tags">
                <span class="skill-tag">Git / GitHub</span>
                <span class="skill-tag">Supabase</span>
                <span class="skill-tag">Render</span>
                <span class="skill-tag">Hadoop</span>
                <span class="skill-tag">Godot Engine</span>
                <span class="skill-tag">Unity (URP)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="fas fa-laptop-code"></i> 프로젝트 경험</h2>
        <div class="section-content">
            <div class="project-item">
            <div class="item-header">
              <h3>개인 웹사이트</h3>
              <span class="item-tech">Vue 3 · Vite · Supabase</span>
            </div>
            <p class="project-desc">
              Vue 3 + Vite 기반 개인 홈페이지로 GitHub Pages에 배포됨.
              AI 채팅 컴포넌트, 다중 시간대 표시, 파티클 애니메이션 효과 등을 통합.
              백엔드는 Express.js + PostgreSQL을 사용하여 DeepSeek API를 프록시 처리함.
            </p>
          </div>
          <div class="project-item">
            <div class="item-header">
              <h3>건국대학교 중국인 유학생회 공식 홈페이지</h3>
              <span class="item-tech">Vue 3 · Express.js · DeepSeek API</span>
            </div>
            <p class="project-desc">
              유학생회 공식 웹사이트로, AI 스마트 문의 컴포넌트(약 73개의 사전 정의 QA 세트)를 통합.
              동적 systemPrompt 전환을 지원하며 Express.js + PostgreSQL 백엔드를 사용함.
            </p>
          </div>
          <div class="project-item">
            <div class="item-header">
              <h3>Roguelike 게임 (졸업 작품)</h3>
              <span class="item-tech">Godot Engine · PCG</span>
            </div>
            <p class="project-desc">
              Godot 엔진으로 개발한 Roguelike 게임으로, 핵심 메커니즘은 PCG(절차적 콘텐츠 생성) 기반.
              요구사항 분석, 제안서 작성, PCG 메커니즘 설계 및 클라이언트 개발 전체 프로세스 담당.
            </p>
          </div>
          <div class="project-item">
            <div class="item-header">
              <h3>BurgerKingDom (VR 강의 프로젝트)</h3>
              <span class="item-tech">Unity · XR Toolkit · Meta Quest 3</span>
            </div>
            <p class="project-desc">
              Unity 2022.3 URP + XR Toolkit 2.6.5 기반으로 개발된 VR 애플리케이션.
              대상 플랫폼: Meta Quest 3 (Android ARM64), 3D 에셋 제작에는 Blender 4.0 사용.
            </p>
          </div>     
        </div>
      </section>

      <!-- 语言能力 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="fas fa-language"></i> 언어 능력</h2>
        <div class="section-content">
          <div class="lang-list">
            <div class="lang-item">
              <span class="lang-name">중국어</span>
              <span class="lang-level">모국어</span>
            </div>
            <div class="lang-item">
              <span class="lang-name">한국어</span>
              <span class="lang-level">Topik 5급</span>
            </div>
            <div class="lang-item">
              <span class="lang-name">영어</span>
              <span class="lang-level">기술 문서 읽기 및 작성</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="fas fa-envelope"></i> 연락처</h2>
        <div class="section-content">
          <div class="contact-list">
            <div class="contact-item">
              <i class="fab fa-github"></i>
              <span>github page: </span>
              <span><a href="https://github.com/beijixingtianci/beijixingtianci.github.io" target="_blank" rel="noopener">github.com/beijixingtianci</a></span>
            </div>
            <div class="contact-item">
              <i class="fab fa-github"></i>
              <span>github: </span>
              <span><a href="https://github.com/beijixingtianci" target="_blank" rel="noopener">github.com/beijixingtianci</a></span>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>학교 이메일: </span>
              <span>a1494920167@konuk.ac.kr</span>
            </div>
            <div class="contact-item">
              <i class="fab fa-weixin"></i>
              <span>위챗:</span>
              <span>A14949420167</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 返回首页 -->
      <div class="back-home">
        <router-link to="/" class="back-btn">
          <i class="fas fa-arrow-left"></i> 홈으로 돌아가기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Resume 页面组件
 * 功能: 个人简历 / 自我介绍页面（作业临时页面）
 * 技术: Vue 3 Composition API
 */
import UseParticles from '../components/UseParticles.vue'
</script>

<style scoped>
.resume-page {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 769px) {
  .resume-page { background-attachment: fixed; }
}
@media (max-width: 768px) {
  .resume-page { background-attachment: scroll; }
}

.resume-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 1.5rem 60px;
  box-sizing: border-box;
}

/* 头部区域 */
.resume-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 32px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.avatar-circle {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  overflow: hidden; flex-shrink: 0;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.header-info { flex: 1; }
.resume-name { font-size: 2rem; color: white; margin: 0 0 0.2rem; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
.resume-name-en { font-size: 1rem; color: #a1f2ea; margin: 0 0 0.5rem; font-weight: 500; letter-spacing: 1px; }
.resume-tagline { font-size: 1rem; color: #e0f2fe; margin: 0; font-style: italic; }

/* Section 通用 */
.resume-section {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}
.resume-section:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
.section-title { font-size: 1.3rem; color: #a1f2ea; margin: 0 0 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(161,242,234,0.2); }
.section-content { color: #e0f2fe; line-height: 1.8; }

/* 教育背景 */
.item-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.item-header h3 { color: white; margin: 0; font-size: 1.1rem; font-weight: 600; }
.item-period { color: #a1f2ea; font-size: 0.9rem; background: rgba(161,242,234,0.1); padding: 2px 10px; border-radius: 12px; border: 1px solid rgba(161,242,234,0.2); }
.edu-detail { margin: 0.3rem 0 0; color: #cbd5e1; font-size: 0.95rem; }

/* 技能 */
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.skill-category h3 { color: white; font-size: 1rem; margin: 0 0 0.5rem; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tag { background: rgba(161,242,234,0.1); color: #a1f2ea; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; border: 1px solid rgba(161,242,234,0.2); transition: all 0.3s; }
.skill-tag:hover { background: rgba(161,242,234,0.2); transform: translateY(-1px); }

/* 项目经历 */
.project-item { margin-bottom: 1.2rem; padding-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.project-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.item-tech { color: #a1f2ea; font-size: 0.85rem; background: rgba(161,242,234,0.1); padding: 2px 10px; border-radius: 12px; border: 1px solid rgba(161,242,234,0.2); }
.project-desc { margin: 0.5rem 0 0; color: #cbd5e1; font-size: 0.95rem; line-height: 1.7; }

/* 语言能力 */
.lang-list { display: flex; flex-direction: column; gap: 0.8rem; }
.lang-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; }
.lang-name { color: white; font-weight: 600; }
.lang-level { color: #a1f2ea; font-size: 0.9rem; }

/* 联系方式 */
.contact-list { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.contact-item { display: flex; align-items: center; gap: 0.6rem; color: #cbd5e1; font-size: 0.95rem; }
.contact-item i { color: #a1f2ea; font-size: 1.1rem; width: 20px; text-align: center; }
.contact-item a { color: #a1f2ea; text-decoration: none; transition: color 0.3s; }
.contact-item a:hover { color: white; }

/* 返回按钮 */
.back-home { text-align: center; margin-top: 2rem; }
.back-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 12px 30px; background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border-radius: 40px; text-decoration: none; color: white; font-weight: 600; border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s; }
.back-btn:hover { background: rgba(255,255,255,0.25); transform: translateY(-4px); }

/* 响应式 */
@media (max-width: 768px) {
  .resume-header { flex-direction: column; text-align: center; gap: 1rem; }
  .resume-name { font-size: 1.6rem; }
  .skills-grid, .contact-list { grid-template-columns: 1fr; }
  .resume-section { padding: 1.2rem 1.5rem; }
}
@media (max-width: 480px) {
  .resume-content { padding: 100px 1rem 40px; }
  .resume-name { font-size: 1.4rem; }
  .item-header { flex-direction: column; align-items: flex-start; }
}
</style>
