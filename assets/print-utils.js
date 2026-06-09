/* ─────────────────────────────────────────────
   print-utils.js  —  BCMS 출력물 공통 유틸
   import: <script src="../assets/print-utils.js"></script>
   ───────────────────────────────────────────── */

/**
 * 출력물 상단 헤더 HTML 반환
 * @param {string} title  문서 제목
 */
function getPrintHeader(title) {
  const logo    = localStorage.getItem('bcmsCompanyLogo');
  const company = localStorage.getItem('bcmsCompany') || '';
  const logoHtml = logo
    ? `<img src="${logo}" style="height:48px;object-fit:contain;">`
    : `<span style="font-size:1.1rem;font-weight:700;">${company}</span>`;
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;
      border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:24px;">
      <div>${logoHtml}</div>
      <div style="font-size:1.25rem;font-weight:700;">${title}</div>
      <div style="font-size:.8rem;color:#666;">${company}</div>
    </div>`;
}

/**
 * 출력물 공통 CSS <style> 태그 문자열 반환
 */
function getPrintStyles() {
  return `
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', 'Nanum Gothic', sans-serif; font-size: 10pt; color: #000; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #000; padding: 6px 8px; }
      th { background: #f0f0f0; font-weight: 600; }
      .section-title { font-size: 11pt; font-weight: 700; margin: 16px 0 8px;
        border-left: 3px solid #000; padding-left: 8px; }
      .sign-row { display: flex; gap: 16px; margin-top: 32px; }
      .sign-box { flex: 1; border: 1px solid #000; padding: 12px; text-align: center; }
    </style>`;
}
