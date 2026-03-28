/* ============================================
   BioArchive - Chat Modulu
   ============================================ */

// Chat modu: 'normal' veya 'flashcard'
let chatMode = 'normal';

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

  // Flash Kart toggle butonu
  const fcToggleBtn = document.getElementById('fcToggleBtn');
  if (fcToggleBtn) {
    fcToggleBtn.addEventListener('click', () => {
      if (chatMode === 'flashcard') deactivateFlashCardMode();
      else activateFlashCardMode();
    });
  }

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

// ---- Flash Kart Modu ----
function activateFlashCardMode() {
  chatMode = 'flashcard';
  const toggleBtn = document.getElementById('fcToggleBtn');
  const inputBox = document.querySelector('.input-box');
  const chatInput = document.getElementById('chatInput');
  if (toggleBtn) toggleBtn.classList.add('active');
  if (inputBox) inputBox.classList.add('fc-mode');
  if (chatInput) chatInput.placeholder = 'Flash kart konusu yazin... (ornegin: Kedilerde bobrek hastaligi)';
  if (chatInput) chatInput.focus();
}

function deactivateFlashCardMode() {
  chatMode = 'normal';
  const toggleBtn = document.getElementById('fcToggleBtn');
  const inputBox = document.querySelector('.input-box');
  const chatInput = document.getElementById('chatInput');
  if (toggleBtn) toggleBtn.classList.remove('active');
  if (inputBox) inputBox.classList.remove('fc-mode');
  if (chatInput) chatInput.placeholder = 'Mesajinizi yazin...';
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text && !State.uploadedFile) return;

  // Flash kart modundaysa flashcard olustur
  if (chatMode === 'flashcard') {
    await sendFlashCardMessage(text);
    return;
  }

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

    // Streaming efekti ile goster
    await streamAIResponse(aiMsg, aiText);
    saveToStorage();
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

// ---- Flash Kart Mesaj Gonderme ----
async function sendFlashCardMessage(text) {
  const input = document.getElementById('chatInput');
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').classList.remove('active');

  // Karsilama ekranini gizle
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  // Kullanici mesaji
  const userMsg = {
    id: Date.now(),
    type: 'user',
    text: '🃏 ' + text,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
  State.messages.push(userMsg);
  renderChatMessages();
  scrollChatToBottom();

  // Loading
  showTypingIndicator();
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  hideTypingIndicator();

  // Kartlari olustur (FlashCardBank'tan)
  const cards = generateAIFlashCards(text, 8);

  if (!cards || cards.length === 0) {
    State.messages.push({
      id: Date.now(),
      type: 'ai',
      text: 'Bu konu icin flash kart olusturulamadi. Daha spesifik bir konu deneyin.\n\n**Ornek konular:** Kedilerde bobrek hastaligi, Kopeklerde kalp kurdu, DNA replikasyonu, Hucre biyolojisi',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });
    renderChatMessages();
    scrollChatToBottom();
    saveToStorage();
    return;
  }

  // Sete kaydet
  const colors = ['#3AA39A', '#8B6CC1', '#4A90D9', '#D94F7A', '#E8853D', '#3DAE85'];
  const newSet = {
    id: Date.now(),
    title: text,
    cards: cards,
    color: colors[Math.floor(Math.random() * colors.length)],
    createdAt: new Date().toISOString()
  };
  fcUserSets.unshift(newSet);
  saveUserFlashCardSets();

  // Flashcard mesaji olarak ekle
  const fcMsg = {
    id: Date.now(),
    type: 'flashcard',
    cards: cards,
    title: text,
    currentIndex: 0,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
  State.messages.push(fcMsg);

  saveToStorage();
  renderChatMessages();
  scrollChatToBottom();

  showToast(`${cards.length} flash kart olusturuldu!`);
}

function generateLocalAIResponse(query) {
  const q = query.toLowerCase();
  // Veteriner - Kedi
  if ((q.includes('kedi') || q.includes('felin')) && (q.includes('bobrek') || q.includes('kidney') || q.includes('renal'))) return SampleData.aiResponses['kedi_bobrek'];
  if ((q.includes('kedi') || q.includes('felin')) && (q.includes('hipertiroidi') || q.includes('tiroid'))) return SampleData.aiResponses['kedi_hipertiroidi'];
  if (q.includes('fip') || ((q.includes('kedi') || q.includes('felin')) && q.includes('peritonit'))) return SampleData.aiResponses['kedi_fip'];
  // Veteriner - Kopek
  if ((q.includes('kopek') || q.includes('köpek')) && (q.includes('kalp kurdu') || q.includes('dirofilar') || q.includes('heartworm'))) return SampleData.aiResponses['kopek_kalp_kurdu'];
  if ((q.includes('kopek') || q.includes('köpek')) && (q.includes('kalca') || q.includes('displazi') || q.includes('hip'))) return SampleData.aiResponses['kopek_kalca_displazisi'];
  if ((q.includes('kopek') || q.includes('köpek')) && (q.includes('diyabet') || q.includes('diabet') || q.includes('seker'))) return SampleData.aiResponses['kopek_diyabet'];
  // Veteriner - Sigir
  if ((q.includes('sigir') || q.includes('sığır') || q.includes('bovine')) && (q.includes('solunum') || q.includes('respiratory') || q.includes('brd'))) return SampleData.aiResponses['sigir_solunum'];
  if ((q.includes('sigir') || q.includes('sığır') || q.includes('bovine')) && (q.includes('tuberkuloz') || q.includes('verem') || q.includes('tuberculosis'))) return SampleData.aiResponses['sigir_tuberkuloz'];
  if (q.includes('bvd') || ((q.includes('sigir') || q.includes('sığır') || q.includes('bovine')) && (q.includes('viral diyare') || q.includes('viral diarrhea')))) return SampleData.aiResponses['sigir_bvd'];
  // Biyoloji temel
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
    } else if (msg.type === 'flashcard') {
      const card = msg.cards[msg.currentIndex || 0];
      const total = msg.cards.length;
      const current = (msg.currentIndex || 0) + 1;
      const progress = (current / total) * 100;
      html += `
        <div class="message ai" style="animation-delay: ${delay}s">
          <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
          <div class="message-content">
            <div class="message-sender">BioArchive AI</div>
            <div class="inline-fc-container" data-msg-index="${i}">
              <div class="inline-fc-header">
                <span class="inline-fc-badge">&#x1F4DA; Flash Kart &middot; ${escapeHtml(msg.title)}</span>
              </div>
              <div class="inline-fc-study">
                <div class="inline-fc-progress">
                  <div class="inline-fc-progress-bar">
                    <div class="inline-fc-progress-fill" style="width:${progress}%"></div>
                  </div>
                  <span class="inline-fc-progress-text">${current} / ${total}</span>
                </div>
                <div class="inline-flashcard-container">
                  <div class="inline-flashcard-stack">
                    <div class="inline-flashcard swipe-in" onclick="this.classList.toggle('flipped')">
                      <div class="inline-flashcard-face inline-flashcard-front">
                        <div class="inline-fc-face-label">SORU</div>
                        <div class="inline-fc-face-text">${escapeHtml(card.front)}</div>
                      </div>
                      <div class="inline-flashcard-face inline-flashcard-back">
                        <div class="inline-fc-face-label">CEVAP</div>
                        <div class="inline-fc-face-text">${escapeHtml(card.back)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="inline-fc-nav">
                  <button class="inline-fc-nav-btn" onclick="inlineFcPrev(${i})" ${(msg.currentIndex || 0) === 0 ? 'disabled' : ''}>
                    ${Icons.chevLeft}
                  </button>
                  <button class="inline-fc-shuffle-btn" onclick="inlineFcShuffle(${i})" title="Karistir">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                  </button>
                  <button class="inline-fc-nav-btn" onclick="inlineFcNext(${i})" ${(msg.currentIndex || 0) === total - 1 ? 'disabled' : ''}>
                    ${Icons.chevRight}
                  </button>
                </div>
                <div class="inline-fc-hint">Cevirmek icin tiklayin</div>
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

// ---- Inline Flashcard Navigasyonu ----
function inlineFcPrev(msgIndex) {
  const msg = State.messages[msgIndex];
  if (!msg || msg.type !== 'flashcard') return;
  if ((msg.currentIndex || 0) > 0) {
    msg.currentIndex = (msg.currentIndex || 0) - 1;
    renderChatMessages();
    scrollChatToBottom();
  }
}

function inlineFcNext(msgIndex) {
  const msg = State.messages[msgIndex];
  if (!msg || msg.type !== 'flashcard') return;
  if ((msg.currentIndex || 0) < msg.cards.length - 1) {
    msg.currentIndex = (msg.currentIndex || 0) + 1;
    renderChatMessages();
    scrollChatToBottom();
  }
}

function inlineFcShuffle(msgIndex) {
  const msg = State.messages[msgIndex];
  if (!msg || msg.type !== 'flashcard') return;
  msg.cards = [...msg.cards].sort(() => Math.random() - 0.5);
  msg.currentIndex = 0;
  renderChatMessages();
  scrollChatToBottom();
  showToast('Kartlar karistirildi');
}

async function streamAIResponse(aiMsg, fullText) {
  const container = document.getElementById('chatMessagesInner');
  if (!container || !fullText) {
    renderChatMessages();
    scrollChatToBottom();
    return;
  }

  // Onceki mesajlari renderla (son AI mesaji haric)
  const prevMessages = State.messages.slice(0, -1);
  const userName = State.user ? State.user.displayName : 'Sen';
  const userInitial = State.user
    ? State.user.displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'K';

  let prevHtml = '';
  prevMessages.forEach((msg) => {
    if (msg.type === 'user') {
      prevHtml += `
        <div class="message user">
          <div class="message-avatar"><span>${userInitial}</span></div>
          <div class="message-content">
            <div class="message-sender">${escapeHtml(userName)}</div>
            ${msg.image ? `<img src="${msg.image}" class="message-image" alt="Yuklenen gorsel">` : ''}
            <div class="message-text">${escapeHtml(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    } else if (msg.error) {
      prevHtml += `
        <div class="message ai">
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
      prevHtml += `
        <div class="message ai">
          <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
          <div class="message-content">
            <div class="message-sender">BioArchive AI</div>
            <div class="message-text">${formatMarkdown(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    }
  });

  // Streaming mesaj balon
  container.innerHTML = prevHtml + `
    <div class="message ai" id="streamingMsg">
      <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
      <div class="message-content">
        <div class="message-sender">BioArchive AI</div>
        <div class="message-text" id="streamingText"><span class="streaming-cursor"></span></div>
        <div class="message-time">${aiMsg.time}</div>
      </div>
    </div>`;
  scrollChatToBottom();

  const streamEl = document.getElementById('streamingText');
  if (!streamEl) { renderChatMessages(); return; }

  // Kelime kelime stream et
  const words = fullText.split(/(\s+)/);
  let accumulated = '';
  const chunkSize = 3; // Her adimda 3 kelime
  const delay = 25; // ms

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join('');
    accumulated += chunk;
    streamEl.innerHTML = formatMarkdown(accumulated) + '<span class="streaming-cursor"></span>';
    scrollChatToBottom();
    await new Promise(r => setTimeout(r, delay));
  }

  // Bitince cursor'u kaldir ve final renderla
  streamEl.innerHTML = formatMarkdown(fullText);
  scrollChatToBottom();
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
      <button class="chat-history-item" onclick="loadChatHistory('${escapeHtml(String(ch.id))}')">
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
    case 'flashcard': activateFlashCardMode(); break;
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

  if (!Config.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    showToast('Sadece JPEG, PNG, GIF ve WebP dosyalari desteklenir');
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
