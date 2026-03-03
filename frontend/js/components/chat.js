/* ============================================
   BioArchive - Chat Modulu
   ============================================ */

function initChat() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const plusBtn = document.getElementById('plusBtn');
  const actionMenu = document.getElementById('actionMenu');

  // Textarea otomatik boyutlandirma
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    sendBtn.classList.toggle('active', input.value.trim().length > 0);
  });

  // Enter ile gonder (Shift+Enter yeni satir)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // + butonu toggle
  plusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    State.actionMenuOpen = !State.actionMenuOpen;
    actionMenu.classList.toggle('visible', State.actionMenuOpen);
    plusBtn.classList.toggle('active', State.actionMenuOpen);
  });

  // Dis tiklamada menu kapat
  document.addEventListener('click', () => {
    if (State.actionMenuOpen) {
      State.actionMenuOpen = false;
      actionMenu.classList.remove('visible');
      plusBtn.classList.remove('active');
    }
  });
  actionMenu.addEventListener('click', (e) => e.stopPropagation());

  // Aksiyon menu ogeler
  document.querySelectorAll('.action-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      State.actionMenuOpen = false;
      actionMenu.classList.remove('visible');
      plusBtn.classList.remove('active');
      handleAction(action);
    });
  });

  // Onerilen promptlar
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.textContent;
      input.dispatchEvent(new Event('input'));
      sendMessage();
    });
  });

  // Dosya yukleme
  const fileInput = document.getElementById('fileInput');
  if (fileInput) fileInput.addEventListener('change', handleFileUpload);

  renderChatMessages();
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text && !State.uploadedFile) return;

  // Karsilama ekranini gizle
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  // Kullanici mesaji
  const userMsg = {
    id: Date.now(),
    type: 'user',
    text: text,
    image: State.uploadedFile || null,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
  State.messages.push(userMsg);

  // Inputu temizle
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').classList.remove('active');
  clearUploadPreview();

  renderChatMessages();
  scrollChatToBottom();

  // AI yanitini al
  showTypingIndicator();

  try {
    let aiText = null;
    let isError = false;

    // Sunucu varsa API uzerinden gonder
    if (State.isOnline && State.user) {
      try {
        const response = await Api.chat.sendMessage(text, State.currentConversationId);
        if (response) {
          State.currentConversationId = response.conversationId;
          aiText = response.response;
        }
      } catch {
        // API basarisiz, yerel fallback kullan
        aiText = generateLocalAIResponse(text);
      }
    } else {
      // Offline mod - yerel yanit
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
      aiText = generateLocalAIResponse(text);
    }

    hideTypingIndicator();

    const aiMsg = {
      id: Date.now(),
      type: 'ai',
      text: aiText,
      error: isError,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    State.messages.push(aiMsg);
    saveToStorage();
    renderChatMessages();
    scrollChatToBottom();
  } catch {
    hideTypingIndicator();
    State.messages.push({
      id: Date.now(),
      type: 'ai',
      text: null,
      error: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });
    saveToStorage();
    renderChatMessages();
    scrollChatToBottom();
  }
}

function generateLocalAIResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('dna') || q.includes('replikasyon')) return SampleData.aiResponses['dna'];
  if (q.includes('fotosentez') || q.includes('bitki')) return SampleData.aiResponses['fotosentez'];
  if (q.includes('hucre') || q.includes('membran') || q.includes('zar')) return SampleData.aiResponses['hucre'];
  if (q.includes('evrim') || q.includes('darwin')) return SampleData.aiResponses['evrim'];
  return SampleData.aiResponses['default'];
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesInner');
  const welcome = document.getElementById('chatWelcome');

  if (State.messages.length === 0) {
    if (welcome) welcome.style.display = '';
    if (container) container.innerHTML = '';
    return;
  }

  if (welcome) welcome.style.display = 'none';

  const userName = State.user ? State.user.displayName : 'Sen';
  const userInitial = State.user
    ? State.user.displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'K';

  let html = '';
  State.messages.forEach((msg, i) => {
    const delay = i * 0.05;
    if (msg.type === 'user') {
      html += `
        <div class="message user" style="animation-delay: ${delay}s">
          <div class="message-avatar"><span>${userInitial}</span></div>
          <div class="message-content">
            <div class="message-sender">${escapeHtml(userName)}</div>
            ${msg.image ? `<img src="${msg.image}" class="message-image" alt="Yuklenen gorsel">` : ''}
            <div class="message-text">${escapeHtml(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    } else if (msg.error) {
      html += `
        <div class="message ai" style="animation-delay: ${delay}s">
          <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
          <div class="message-content">
            <div class="message-sender">BioArchive AI</div>
            <div class="message-error">
              <div class="error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <div class="error-text">
                <strong>Suanda yapay zeka modelimize ulasamiyoruz.</strong>
                <span>Lutfen daha sonra tekrar deneyin veya giris yapin.</span>
              </div>
            </div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    } else {
      html += `
        <div class="message ai" style="animation-delay: ${delay}s">
          <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
          <div class="message-content">
            <div class="message-sender">BioArchive AI</div>
            <div class="message-text">${formatMarkdown(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    }
  });

  if (container) container.innerHTML = html;
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessagesInner');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'message ai';
  el.id = 'typingIndicator';
  el.innerHTML = `
    <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
    <div class="message-content">
      <div class="message-sender">BioArchive AI</div>
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  container.appendChild(el);
  scrollChatToBottom();
}

function hideTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollChatToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) {
    setTimeout(() => container.scrollTop = container.scrollHeight, 50);
  }
}

function renderChatHistories() {
  const container = document.getElementById('chatHistoryList');
  if (!container) return;

  const histories = State.chatHistories.length > 0 ? State.chatHistories : SampleData.chatHistories;

  let html = '';
  histories.forEach(ch => {
    html += `
      <button class="chat-history-item" onclick="loadChatHistory('${ch.id}')">
        ${Icons.msgCircle}
        <span>${escapeHtml(ch.title)}</span>
      </button>`;
  });
  container.innerHTML = html;
}

async function loadChatHistory(id) {
  if (State.isOnline && State.user) {
    try {
      const data = await Api.chat.getConversation(id);
      if (data) {
        State.currentConversationId = id;
        State.messages = data.messages.map(m => ({
          id: m.id,
          type: m.role === 'user' ? 'user' : 'ai',
          text: m.content,
          time: new Date(m.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        }));
        renderChatMessages();
        scrollChatToBottom();
        switchView('chat');
        return;
      }
    } catch { /* fallback */ }
  }
  showToast('Sohbet gecmisi yuklendi');
  switchView('chat');
}

// ---- Dosya Islemleri ----
function handleAction(action) {
  switch(action) {
    case 'flashcard': openFlashCardModal(); break;
    case 'pdf': openPdfModal(); break;
    case 'video': openVideoModal(); break;
    case 'image': document.getElementById('fileInput').click(); break;
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > Config.MAX_FILE_SIZE) {
    showToast('Dosya boyutu 10MB\'dan kucuk olmalidir');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    State.uploadedFile = ev.target.result;
    showUploadPreview(file.name, file.size, ev.target.result);
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function showUploadPreview(name, size, src) {
  const preview = document.getElementById('uploadPreview');
  if (!preview) return;
  preview.classList.add('visible');
  preview.querySelector('.upload-preview-img').src = src;
  preview.querySelector('.upload-preview-name').textContent = name;
  preview.querySelector('.upload-preview-size').textContent = formatFileSize(size);
}

function clearUploadPreview() {
  State.uploadedFile = null;
  const preview = document.getElementById('uploadPreview');
  if (preview) preview.classList.remove('visible');
}
