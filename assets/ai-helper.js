/* BCM AI Helper — shared module for all BCMS pages
 * Provides: AIHelper.open(options), AIHelper.loadJSON(key, fallback), AIHelper.extractJSON(text)
 */
(function (global) {
  'use strict';

  const KEY_ENABLED = 'bcmsAiEnabled';
  const KEY_APIKEY  = 'bcmsApiKey';
  const API_URL     = 'https://api.anthropic.com/v1/messages';
  const MODEL       = 'claude-sonnet-4-20250514';

  /* ─── Helpers ─── */
  function isEnabled() { return localStorage.getItem(KEY_ENABLED) !== 'false'; }
  function setEnabled(v) { localStorage.setItem(KEY_ENABLED, v ? 'true' : 'false'); }

  function loadJSON(key, fallback) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch { return fallback; }
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g,
      m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function extractJSON(text) {
    /* 1) ```json ... ``` 코드 블록 */
    const block = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (block) { try { return JSON.parse(block[1].trim()); } catch {} }
    /* 2) 텍스트 내 첫 번째 { ... } */
    const s = text.indexOf('{'), e = text.lastIndexOf('}');
    if (s !== -1 && e > s) { try { return JSON.parse(text.slice(s, e + 1)); } catch {} }
    return null;
  }

  /* ─── CSS ─── */
  function injectCSS() {
    if (document.getElementById('ai-helper-style')) return;
    const st = document.createElement('style');
    st.id = 'ai-helper-style';
    st.textContent = `
.ai-modal{display:none;position:fixed;inset:0;z-index:9900;background:rgba(0,0,0,.48);align-items:center;justify-content:center;}
.ai-modal.open{display:flex;}
.ai-modal-box{background:var(--surface,#fff);border:0.5px solid var(--border,#e2e8f0);border-radius:12px;width:min(740px,95vw);max-height:90vh;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.2);animation:aiSlide .18s ease;}
@keyframes aiSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
.ai-modal-head{display:flex;align-items:center;gap:12px;padding:18px 22px 14px;border-bottom:0.5px solid var(--border,#e2e8f0);flex-shrink:0;}
.ai-modal-head h3{font-size:15px;font-weight:700;color:var(--text,#0f172a);flex:1;margin:0;}
.ai-modal-close-x{background:transparent!important;border:none!important;font-size:18px;cursor:pointer;color:var(--text-2,#64748b);padding:0 4px;line-height:1;flex-shrink:0;}
.ai-modal-body{padding:20px 22px;overflow-y:auto;flex:1;min-height:100px;}
.ai-modal-foot{padding:12px 22px;border-top:0.5px solid var(--border,#e2e8f0);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;flex-wrap:wrap;gap:10px;}
.ai-foot-left{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.ai-foot-right{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.ai-privacy{font-size:11px;color:var(--text-2,#64748b);line-height:1.5;max-width:300px;}
.ai-toggle-wrap{display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none;flex-shrink:0;}
.ai-toggle-label{font-size:12px;font-weight:600;color:var(--text-2,#64748b);white-space:nowrap;}
.ai-toggle-track{width:36px;height:20px;border-radius:10px;background:var(--border-strong,#cbd5e1);position:relative;transition:background .15s;flex-shrink:0;}
.ai-toggle-track.on{background:#0070f3;}
.ai-toggle-thumb{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:8px;background:#fff;transition:left .15s;box-shadow:0 1px 3px rgba(0,0,0,.22);}
.ai-toggle-track.on .ai-toggle-thumb{left:18px;}
.ai-loading{display:flex;align-items:center;gap:10px;color:var(--text-2,#64748b);font-size:13px;padding:10px 0;}
.ai-spinner{width:18px;height:18px;border:2px solid var(--border,#e2e8f0);border-top-color:#0070f3;border-radius:50%;animation:aiSpin .7s linear infinite;flex-shrink:0;}
@keyframes aiSpin{to{transform:rotate(360deg);}}
.ai-result{font-size:13px;color:var(--text,#0f172a);line-height:1.85;white-space:pre-wrap;word-break:break-word;}
.ai-no-key{padding:14px 16px;background:rgba(245,158,11,.08);border:0.5px solid rgba(245,158,11,.3);border-radius:8px;font-size:13px;color:#92400e;line-height:1.65;}
.ai-no-key code{font-family:monospace;background:rgba(0,0,0,.06);padding:1px 5px;border-radius:3px;font-size:12px;}
.ai-disabled-msg{padding:14px 16px;background:rgba(100,116,139,.07);border:0.5px solid rgba(100,116,139,.2);border-radius:8px;font-size:13px;color:var(--text-2,#64748b);line-height:1.6;}
.ai-error{padding:14px 16px;background:rgba(239,68,68,.07);border:0.5px solid rgba(239,68,68,.25);border-radius:8px;font-size:13px;color:#b91c1c;line-height:1.6;}
.ai-apply-hint{margin-top:10px;padding:8px 12px;background:rgba(0,112,243,.06);border:0.5px solid rgba(0,112,243,.2);border-radius:6px;font-size:11px;color:#0070f3;line-height:1.5;}
`;
    document.head.appendChild(st);
  }

  /* ─── Modal ─── */
  let modalEl = null;

  function ensureModal() {
    if (document.getElementById('ai-helper-modal')) {
      modalEl = document.getElementById('ai-helper-modal');
      return;
    }
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<div class="ai-modal" id="ai-helper-modal" role="dialog" aria-modal="true">
  <div class="ai-modal-box">
    <div class="ai-modal-head">
      <h3 id="ai-modal-title">🤖 AI 도우미</h3>
      <button type="button" class="ai-modal-close-x" id="ai-modal-close-x">✕</button>
    </div>
    <div class="ai-modal-body" id="ai-modal-body">
      <div class="ai-loading" id="ai-modal-loading" style="display:none">
        <div class="ai-spinner"></div>
        <span>Claude AI (Sonnet)가 분석 중입니다…</span>
      </div>
      <div id="ai-modal-content"></div>
    </div>
    <div class="ai-modal-foot">
      <div class="ai-foot-left">
        <label class="ai-toggle-wrap" id="ai-toggle-wrap" title="AI 기능 ON/OFF">
          <div class="ai-toggle-track" id="ai-toggle-track"><div class="ai-toggle-thumb"></div></div>
          <span class="ai-toggle-label" id="ai-toggle-label">AI ON</span>
        </label>
        <span class="ai-privacy">입력하신 데이터는 AI 분석 후 즉시 삭제되며<br>학습에 사용되지 않습니다.</span>
      </div>
      <div class="ai-foot-right">
        <button type="button" class="btn" id="ai-modal-copy" style="display:none;font-size:12px;padding:5px 12px;">📋 복사하기</button>
        <button type="button" class="btn primary" id="ai-modal-apply" style="display:none;font-size:12px;padding:5px 14px;">✅ 적용하기</button>
        <button type="button" class="btn" id="ai-modal-close" style="font-size:12px;padding:5px 14px;">닫기</button>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(wrap.firstElementChild);
    modalEl = document.getElementById('ai-helper-modal');

    /* Toggle */
    const track      = document.getElementById('ai-toggle-track');
    const label      = document.getElementById('ai-toggle-label');
    const syncToggle = () => {
      const on = isEnabled();
      track.classList.toggle('on', on);
      label.textContent = on ? 'AI ON' : 'AI OFF';
    };
    syncToggle();
    document.getElementById('ai-toggle-wrap').addEventListener('click', () => {
      setEnabled(!isEnabled()); syncToggle();
    });

    /* Close */
    const close = () => modalEl.classList.remove('open');
    document.getElementById('ai-modal-close-x').addEventListener('click', close);
    document.getElementById('ai-modal-close').addEventListener('click', close);
    modalEl.addEventListener('click', e => { if (e.target === modalEl) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalEl.classList.contains('open')) close();
    });
  }

  /* ─── Core open ─── */
  async function openModal(options) {
    injectCSS();
    ensureModal();

    const titleEl   = document.getElementById('ai-modal-title');
    const loading   = document.getElementById('ai-modal-loading');
    const content   = document.getElementById('ai-modal-content');
    const copyBtn   = document.getElementById('ai-modal-copy');
    const applyBtn  = document.getElementById('ai-modal-apply');

    /* Reset state */
    titleEl.textContent    = options.title || '🤖 AI 도우미';
    loading.style.display  = 'none';
    content.innerHTML      = '';
    copyBtn.style.display  = 'none';
    applyBtn.style.display = 'none';
    applyBtn.onclick       = null;
    applyBtn.textContent   = options.applyLabel || '✅ 적용하기';
    modalEl.classList.add('open');

    /* AI 비활성화 */
    if (!isEnabled()) {
      content.innerHTML = `<div class="ai-disabled-msg">🔕 AI 기능이 비활성화되어 있습니다.<br>하단 토글(AI OFF → AI ON)을 켜면 사용할 수 있습니다.</div>`;
      return;
    }

    /* API 키 확인 */
    const apiKey = localStorage.getItem(KEY_APIKEY) || '';
    if (!apiKey) {
      content.innerHTML = `
        <div class="ai-no-key">⚠️ Anthropic API 키가 설정되지 않았습니다.<br>
        설정 페이지에서 등록하거나 아래 버튼을 눌러 직접 입력하세요.<br>
        <code>localStorage.setItem('bcmsApiKey', 'sk-ant-...')</code></div>
        <div style="margin-top:12px">
          <button class="btn primary" id="ai-enter-key-btn" type="button" style="font-size:13px;">🔑 API 키 입력하기</button>
        </div>`;
      document.getElementById('ai-enter-key-btn').addEventListener('click', () => {
        const k = window.prompt('Anthropic API 키를 입력하세요 (sk-ant-로 시작):\n\n이 브라우저 localStorage에만 저장됩니다.');
        if (k && k.trim()) { localStorage.setItem(KEY_APIKEY, k.trim()); openModal(options); }
      });
      return;
    }

    /* 프롬프트 생성 */
    let prompt;
    try { prompt = options.buildPrompt(); }
    catch (e) {
      content.innerHTML = `<div class="ai-error">❌ 데이터 수집 오류: ${esc(e.message)}</div>`;
      return;
    }

    loading.style.display = 'flex';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 3000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      loading.style.display = 'none';

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        content.innerHTML = `<div class="ai-error">❌ API 오류 (${res.status}): ${esc(err?.error?.message || res.statusText)}</div>`;
        return;
      }

      const data = await res.json();
      const text = data?.content?.[0]?.text || '응답을 받지 못했습니다.';

      content.innerHTML = `<div class="ai-result">${esc(text)}</div>`;

      /* 복사 버튼 */
      copyBtn.style.display = 'inline-flex';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = '✅ 복사됨';
          setTimeout(() => { copyBtn.textContent = '📋 복사하기'; }, 2000);
        }).catch(() => {
          copyBtn.textContent = '❌ 실패';
          setTimeout(() => { copyBtn.textContent = '📋 복사하기'; }, 2000);
        });
      };

      /* 적용 버튼 */
      if (typeof options.onApply === 'function') {
        applyBtn.style.display = 'inline-flex';
        applyBtn.onclick = () => {
          try { options.onApply(text); }
          catch (e) { alert('적용 중 오류가 발생했습니다:\n' + e.message); }
        };
      }

    } catch (e) {
      loading.style.display = 'none';
      content.innerHTML = `<div class="ai-error">❌ 네트워크 오류: ${esc(e.message)}</div>`;
    }
  }

  /* ─── Public API ─── */
  global.AIHelper = {
    open:        openModal,
    loadJSON,
    isEnabled,
    extractJSON,
  };

})(window);
