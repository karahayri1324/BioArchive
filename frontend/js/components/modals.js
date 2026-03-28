/* ============================================
   BioArchive - Modal Sistemi ve Flash Kartlar
   ============================================ */

// ---- Modal Yonetimi ----
function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  initTagInput();
  initAuthModal();
  loadUserFlashCardSets();
}

function openModal(id) {
  const backdrop = document.getElementById(id);
  if (backdrop) {
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(el => el.classList.remove('visible'));
  document.body.style.overflow = '';
}

// ============================================
// FLASH KART SISTEMI
// ============================================

let currentFlashCardSet = [];
let currentFlashCardIndex = 0;
let fcUserSets = [];
let fcCurrentView = 'home'; // home | create | study

function loadUserFlashCardSets() {
  try {
    const saved = localStorage.getItem('bioarchive_fc_sets');
    if (saved) fcUserSets = JSON.parse(saved);
  } catch { fcUserSets = []; }
}

function saveUserFlashCardSets() {
  localStorage.setItem('bioarchive_fc_sets', JSON.stringify(fcUserSets));
}

// ---- Modal Acilisi ----
function openFlashCardModal() {
  openModal('flashCardModal');
  fcGoHome();
}

function fcGoHome() {
  fcCurrentView = 'home';
  document.getElementById('fcModalTitle').textContent = 'Flash Kartlar';
  document.getElementById('fcBackBtn').style.display = 'none';
  renderFcHome();
}

// ---- ANA SAYFA ----
function renderFcHome() {
  const body = document.getElementById('fcModalBody');

  // Tum setler: hazir + kullanici olusturmalar
  const builtInSets = Object.keys(SampleData.flashCardSets);
  const builtInLabels = { biyoloji: 'Genel Biyoloji', genetik: 'Genetik' };
  const builtInColors = { biyoloji: '#3AA39A', genetik: '#8B6CC1' };

  let setsHtml = '';

  // Hazir setler
  builtInSets.forEach(key => {
    const count = SampleData.flashCardSets[key].length;
    const color = builtInColors[key] || '#4A90D9';
    setsHtml += `
      <button class="fc-set-card" onclick="fcOpenStudy('builtin', '${key}')">
        <div class="fc-set-icon" style="background:${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
        </div>
        <div class="fc-set-info">
          <span class="fc-set-name">${escapeHtml(builtInLabels[key] || key)}</span>
          <span class="fc-set-count">${count} kart</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fc-set-arrow"><path d="m9 18 6-6-6-6"/></svg>
      </button>`;
  });

  // Kullanici setleri
  fcUserSets.forEach((set, idx) => {
    setsHtml += `
      <button class="fc-set-card" onclick="fcOpenStudy('user', ${idx})">
        <div class="fc-set-icon" style="background:${set.color || '#E8853D'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </div>
        <div class="fc-set-info">
          <span class="fc-set-name">${escapeHtml(set.title)}</span>
          <span class="fc-set-count">${set.cards.length} kart</span>
        </div>
        <button class="fc-set-delete" onclick="event.stopPropagation();fcDeleteUserSet(${idx})" title="Sil">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </button>`;
  });

  body.innerHTML = `
    <div class="fc-home">
      <button class="fc-create-btn" onclick="fcOpenCreate()">
        <div class="fc-create-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </div>
        <div class="fc-create-text">
          <strong>AI ile Flash Kart Olustur</strong>
          <small>Bir konu girin, AI sizin icin kartlar olusursun</small>
        </div>
      </button>

      ${setsHtml ? `
        <div class="fc-section-title">Kart Setlerim</div>
        <div class="fc-sets-list">${setsHtml}</div>
      ` : ''}
    </div>`;
}

// ---- OLUSTURMA EKRANI ----
function fcOpenCreate() {
  fcCurrentView = 'create';
  document.getElementById('fcModalTitle').textContent = 'Yeni Flash Kart';
  document.getElementById('fcBackBtn').style.display = '';

  const body = document.getElementById('fcModalBody');
  body.innerHTML = `
    <div class="fc-create-view">
      <div class="form-group">
        <label class="form-label">Konu / Prompt</label>
        <textarea class="form-textarea fc-prompt-input" id="fcPromptInput" rows="3" placeholder="Ornegin: Hucre bolunmesi, DNA replikasyonu, Kedilerde bobrek hastaligi, Protein sentezi..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Kart Sayisi</label>
        <div class="fc-count-selector">
          <button class="fc-count-btn active" data-count="5" onclick="fcSelectCount(this)">5</button>
          <button class="fc-count-btn" data-count="8" onclick="fcSelectCount(this)">8</button>
          <button class="fc-count-btn" data-count="10" onclick="fcSelectCount(this)">10</button>
          <button class="fc-count-btn" data-count="15" onclick="fcSelectCount(this)">15</button>
        </div>
      </div>

      <div class="fc-example-topics">
        <div class="fc-example-title">Populer Konular</div>
        <div class="fc-example-chips">
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Kedilerde bobrek hastaligi</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Kedilerde hipertiroidizm</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">FIP hastaligi</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Kopeklerde kalp kurdu</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Kopeklerde kalca displazisi</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Kopeklerde diyabet</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Sigir solunum hastaliklari</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Sigir tuberkuloz</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">BVD hastaligi</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Hucre Biyolojisi</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">DNA ve RNA</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Genetik</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Fotosentez</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Evrim</button>
          <button class="fc-example-chip" onclick="fcFillPrompt(this.textContent)">Mikrobiyoloji</button>
        </div>
      </div>

      <button class="btn-primary btn-full fc-generate-btn" id="fcGenerateBtn" onclick="fcGenerate()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        Kartlari Olustur
      </button>

      <div class="fc-loading" id="fcLoading" style="display:none">
        <div class="fc-loading-spinner"></div>
        <div class="fc-loading-text">AI kartlari olusturuyor...</div>
        <div class="fc-loading-sub" id="fcLoadingSub">Konu analiz ediliyor</div>
      </div>
    </div>`;
}

function fcSelectCount(btn) {
  document.querySelectorAll('.fc-count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function fcFillPrompt(text) {
  const input = document.getElementById('fcPromptInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function fcGetSelectedCount() {
  const active = document.querySelector('.fc-count-btn.active');
  return active ? parseInt(active.dataset.count) : 5;
}

// ---- AI FLASH KART OLUSTURMA ----
async function fcGenerate() {
  const input = document.getElementById('fcPromptInput');
  const prompt = input ? input.value.trim() : '';
  if (!prompt) {
    showToast('Lutfen bir konu girin');
    return;
  }

  const count = fcGetSelectedCount();
  const generateBtn = document.getElementById('fcGenerateBtn');
  const loading = document.getElementById('fcLoading');

  // Loading goster
  generateBtn.style.display = 'none';
  loading.style.display = 'flex';

  const loadingSub = document.getElementById('fcLoadingSub');
  const steps = ['Konu analiz ediliyor', 'Bilgi tabani taraniyor', 'Kartlar hazirlaniyor', 'Son kontroller yapiliyor'];
  let step = 0;
  const stepInterval = setInterval(() => {
    step++;
    if (step < steps.length && loadingSub) loadingSub.textContent = steps[step];
  }, 600);

  // Gercekci bekleme
  await new Promise(r => setTimeout(r, 1800 + Math.random() * 1200));
  clearInterval(stepInterval);

  // Kartlari olustur
  const cards = generateAIFlashCards(prompt, count);

  if (!cards || cards.length === 0) {
    loading.style.display = 'none';
    generateBtn.style.display = '';
    showToast('Bu konu icin kart olusturulamadi, daha spesifik bir konu deneyin');
    return;
  }

  // Sete kaydet
  const colors = ['#3AA39A', '#8B6CC1', '#4A90D9', '#D94F7A', '#E8853D', '#3DAE85'];
  const newSet = {
    id: Date.now(),
    title: prompt,
    cards: cards,
    color: colors[Math.floor(Math.random() * colors.length)],
    createdAt: new Date().toISOString()
  };
  fcUserSets.unshift(newSet);
  saveUserFlashCardSets();

  showToast(`${cards.length} flash kart olusturuldu!`);

  // Direkt study moduna gec
  fcOpenStudyWithCards(newSet.title, cards);
}

// ---- AI KART URETICI ----
function generateAIFlashCards(prompt, count) {
  const q = prompt.toLowerCase()
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ş/g, 's')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i');

  let pool = [];

  // Konu eslestirme
  for (const [keywords, cards] of FlashCardBank) {
    if (keywords.some(kw => q.includes(kw))) {
      pool = pool.concat(cards);
    }
  }

  // Eger hic eslesen yoksa genel biyoloji havuzundan al
  if (pool.length === 0) {
    for (const [, cards] of FlashCardBank) {
      pool = pool.concat(cards);
    }
  }

  // Benzersizlestir
  const unique = [];
  const seen = new Set();
  for (const card of pool) {
    if (!seen.has(card.front)) {
      seen.add(card.front);
      unique.push(card);
    }
  }

  // Karistir ve sec
  const shuffled = unique.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ---- CALISMA EKRANI ----
function fcOpenStudy(type, key) {
  let cards, title;
  if (type === 'builtin') {
    const labels = { biyoloji: 'Genel Biyoloji', genetik: 'Genetik' };
    cards = SampleData.flashCardSets[key];
    title = labels[key] || key;
  } else {
    const set = fcUserSets[key];
    if (!set) return;
    cards = set.cards;
    title = set.title;
  }
  fcOpenStudyWithCards(title, cards);
}

function fcOpenStudyWithCards(title, cards) {
  fcCurrentView = 'study';
  currentFlashCardSet = [...cards];
  currentFlashCardIndex = 0;

  document.getElementById('fcModalTitle').textContent = title;
  document.getElementById('fcBackBtn').style.display = '';

  renderFlashCardStudy();
}

function renderFlashCardStudy() {
  const body = document.getElementById('fcModalBody');
  if (!body || currentFlashCardSet.length === 0) return;

  const card = currentFlashCardSet[currentFlashCardIndex];
  const total = currentFlashCardSet.length;
  const current = currentFlashCardIndex + 1;
  const progress = (current / total) * 100;

  // Generate dots (max 15 visible)
  let dotsHtml = '';
  if (total <= 15) {
    for (let i = 0; i < total; i++) {
      const cls = i === currentFlashCardIndex ? 'active' : (i < currentFlashCardIndex ? 'visited' : '');
      dotsHtml += `<span class="fc-dot ${cls}"></span>`;
    }
  }

  body.innerHTML = `
    <div class="fc-study-view">
      <div class="fc-progress-bar">
        <div class="fc-progress-fill" style="width:${progress}%"></div>
      </div>
      <div class="fc-progress-text">${current} / ${total}</div>

      <div class="flashcard-container">
        <div class="flashcard-stack">
          <div class="flashcard swipe-in" id="currentFlashCard" onclick="this.classList.toggle('flipped')">
            <div class="flashcard-face flashcard-front">
              <div class="fc-face-label">SORU</div>
              <div class="fc-face-text">${escapeHtml(card.front)}</div>
              <div class="fc-flip-hint">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              </div>
            </div>
            <div class="flashcard-face flashcard-back">
              <div class="fc-face-label">CEVAP</div>
              <div class="fc-face-text">${escapeHtml(card.back)}</div>
              <div class="fc-flip-hint">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${dotsHtml ? `<div class="fc-dots">${dotsHtml}</div>` : ''}

      <div class="flashcard-nav">
        <button class="flashcard-nav-btn" onclick="prevFlashCard()" ${currentFlashCardIndex === 0 ? 'disabled' : ''}>
          ${Icons.chevLeft}
        </button>
        <button class="fc-shuffle-btn" onclick="fcShuffle()" title="Karistir">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
        </button>
        <button class="flashcard-nav-btn" onclick="nextFlashCard()" ${currentFlashCardIndex === total - 1 ? 'disabled' : ''}>
          ${Icons.chevRight}
        </button>
      </div>

      <div class="fc-keyboard-hint">
        <span>Cevirmek icin tiklayin veya <kbd>Space</kbd></span>
        <span><kbd>&larr;</kbd> <kbd>&rarr;</kbd> ile gezin</span>
      </div>
    </div>`;
}

function prevFlashCard() {
  if (currentFlashCardIndex > 0) {
    const card = document.getElementById('currentFlashCard');
    if (card) {
      card.classList.remove('swipe-in');
      card.classList.add('swipe-right');
      setTimeout(() => {
        currentFlashCardIndex--;
        renderFlashCardStudy();
      }, 280);
    } else {
      currentFlashCardIndex--;
      renderFlashCardStudy();
    }
  }
}

function nextFlashCard() {
  if (currentFlashCardIndex < currentFlashCardSet.length - 1) {
    const card = document.getElementById('currentFlashCard');
    if (card) {
      card.classList.remove('swipe-in');
      card.classList.add('swipe-left');
      setTimeout(() => {
        currentFlashCardIndex++;
        renderFlashCardStudy();
      }, 280);
    } else {
      currentFlashCardIndex++;
      renderFlashCardStudy();
    }
  }
}

function fcShuffle() {
  currentFlashCardSet = currentFlashCardSet.sort(() => Math.random() - 0.5);
  currentFlashCardIndex = 0;
  renderFlashCardStudy();
  showToast('Kartlar karistirildi');
}

// Keyboard navigation for flash cards
document.addEventListener('keydown', (e) => {
  if (fcCurrentView !== 'study') return;
  const modal = document.getElementById('flashCardModal');
  if (!modal || !modal.classList.contains('visible')) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevFlashCard();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextFlashCard();
  } else if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    const card = document.getElementById('currentFlashCard');
    if (card) card.classList.toggle('flipped');
  }
});

function fcDeleteUserSet(idx) {
  fcUserSets.splice(idx, 1);
  saveUserFlashCardSets();
  renderFcHome();
  showToast('Set silindi');
}

// Geriye uyumluluk
function selectFlashCardTopic(topic) {
  fcOpenStudy('builtin', topic);
}

// ---- PDF & Video Modallari ----
function openPdfModal() { openModal('pdfModal'); }
function openVideoModal() { openModal('videoModal'); }

async function simulatePdfSummary() {
  const input = document.getElementById('pdfUrlInput');
  if (!input || !input.value.trim()) { showToast('Lutfen bir PDF linki girin'); return; }
  closeAllModals();

  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  State.messages.push({
    id: Date.now(), type: 'user',
    text: `PDF Ozetle: ${input.value.trim()}`,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  });
  renderChatMessages();
  scrollChatToBottom();

  showTypingIndicator();
  await new Promise(r => setTimeout(r, 1200));
  hideTypingIndicator();

  State.messages.push({
    id: Date.now(), type: 'ai',
    text: '**PDF Analizi**\n\nBu ozellik yakin zamanda aktif olacaktir. AI modelimiz PDF belgelerini analiz edebilecek ve detayli ozetler olusturabilecektir.\n\n**Desteklenen ozellikler:**\n- Bilimsel makale ozetleme\n- Anahtar kavram cikarimi\n- Referans analizi',
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  });
  saveToStorage();
  renderChatMessages();
  scrollChatToBottom();
  input.value = '';
  switchView('chat');
}

async function simulateVideoSummary() {
  const input = document.getElementById('videoUrlInput');
  if (!input || !input.value.trim()) { showToast('Lutfen bir video linki girin'); return; }
  closeAllModals();

  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  State.messages.push({
    id: Date.now(), type: 'user',
    text: `Video Ozetle: ${input.value.trim()}`,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  });
  renderChatMessages();
  scrollChatToBottom();

  showTypingIndicator();
  await new Promise(r => setTimeout(r, 1200));
  hideTypingIndicator();

  State.messages.push({
    id: Date.now(), type: 'ai',
    text: '**Video Analizi**\n\nBu ozellik yakin zamanda aktif olacaktir. AI modelimiz video iceriklerini analiz edebilecek ve ozetler olusturabilecektir.\n\n**Desteklenen platformlar:**\n- YouTube\n- Vimeo\n- Dogrudan video linkleri',
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  });
  saveToStorage();
  renderChatMessages();
  scrollChatToBottom();
  input.value = '';
  switchView('chat');
}
