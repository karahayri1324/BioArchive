/* ============================================
   BioArchive - Yardimci Fonksiyonlar
   ============================================ */

// ---- Toast Bildirimleri ----
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}

// ---- HTML Temizleme ----
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Markdown -> HTML ----
function formatMarkdown(text) {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let inTable = false;
  let inUl = false;
  let inOl = false;
  let inCode = false;
  let codeBlock = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      if (inCode) {
        html += '<pre><code>' + escapeHtml(codeBlock.trim()) + '</code></pre>';
        codeBlock = '';
        inCode = false;
      } else {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeBlock += line + '\n'; continue; }

    // Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      // Separator row
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) continue;
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      if (!inTable) {
        inTable = true;
        html += '<table><thead><tr>' + cells.map(c => '<th>' + inlineFormat(c) + '</th>').join('') + '</tr></thead><tbody>';
      } else {
        html += '<tr>' + cells.map(c => '<td>' + inlineFormat(c) + '</td>').join('') + '</tr>';
      }
      continue;
    } else if (inTable) {
      html += '</tbody></table>';
      inTable = false;
    }

    // Blank line
    if (line.trim() === '') {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      html += '<h4>' + inlineFormat(line.slice(4)) + '</h4>';
      continue;
    }
    if (line.startsWith('## ')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      html += '<h3>' + inlineFormat(line.slice(3)) + '</h3>';
      continue;
    }
    if (line.startsWith('# ')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      html += '<h2>' + inlineFormat(line.slice(2)) + '</h2>';
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      html += '<hr>';
      continue;
    }

    // Unordered list
    if (/^[\s]*[-*] /.test(line)) {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (!inUl) { html += '<ul>'; inUl = true; }
      html += '<li>' + inlineFormat(line.replace(/^[\s]*[-*] /, '')) + '</li>';
      continue;
    }

    // Ordered list
    if (/^[\s]*\d+\. /.test(line)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol>'; inOl = true; }
      html += '<li>' + inlineFormat(line.replace(/^[\s]*\d+\. /, '')) + '</li>';
      continue;
    }

    // Normal paragraph
    if (inUl) { html += '</ul>'; inUl = false; }
    if (inOl) { html += '</ol>'; inOl = false; }
    html += '<p>' + inlineFormat(line) + '</p>';
  }

  if (inUl) html += '</ul>';
  if (inOl) html += '</ol>';
  if (inTable) html += '</tbody></table>';
  if (inCode) html += '<pre><code>' + escapeHtml(codeBlock.trim()) + '</code></pre>';

  return html;
}

function inlineFormat(text) {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  s = s.replace(/`(.*?)`/g, '<code>$1</code>');
  // Links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

// ---- Dosya Boyutu Formatlama ----
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ---- Tarih Formatlama ----
function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Simdi';
  if (diffMins < 60) return `${diffMins} dk once`;
  if (diffHours < 24) return `${diffHours} saat once`;
  if (diffDays < 7) return `${diffDays} gun once`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta once`;
  return date.toLocaleDateString('tr-TR');
}
