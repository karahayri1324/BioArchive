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

// ---- Flash Kartlar ----
let currentFlashCardSet = [];
let currentFlashCardIndex = 0;

function openFlashCardModal() {
  openModal('flashCardModal');
  currentFlashCardSet = SampleData.flashCardSets['biyoloji'];
  currentFlashCardIndex = 0;
  renderFlashCard();
}

function renderFlashCard() {
  const container = document.getElementById('flashCardContent');
  if (!container || currentFlashCardSet.length === 0) return;

  const card = currentFlashCardSet[currentFlashCardIndex];
  container.innerHTML = `
    <div class="flashcard-container">
      <div class="flashcard" id="currentFlashCard" onclick="this.classList.toggle('flipped')">
        <div class="flashcard-face flashcard-front">${card.front}</div>
        <div class="flashcard-face flashcard-back">${card.back}</div>
      </div>
    </div>
    <div class="flashcard-nav">
      <button class="flashcard-nav-btn" onclick="prevFlashCard()">${Icons.chevLeft}</button>
      <span class="flashcard-counter">${currentFlashCardIndex + 1} / ${currentFlashCardSet.length}</span>
      <button class="flashcard-nav-btn" onclick="nextFlashCard()">${Icons.chevRight}</button>
    </div>
    <p style="text-align:center;margin-top:12px;font-size:0.75rem;color:var(--text-tertiary)">Cevirmek icin karta tiklayin</p>`;
}

function prevFlashCard() {
  if (currentFlashCardIndex > 0) { currentFlashCardIndex--; renderFlashCard(); }
}

function nextFlashCard() {
  if (currentFlashCardIndex < currentFlashCardSet.length - 1) { currentFlashCardIndex++; renderFlashCard(); }
}

function selectFlashCardTopic(topic) {
  currentFlashCardSet = SampleData.flashCardSets[topic] || SampleData.flashCardSets['biyoloji'];
  currentFlashCardIndex = 0;
  renderFlashCard();
  document.querySelectorAll('.fc-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.topic === topic));
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
