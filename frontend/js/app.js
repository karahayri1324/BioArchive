/* ============================================
   BioArchive - Ana Uygulama (Entry Point)
   ============================================ */

// ---- Baslat ----
document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(State.theme);
  loadFromStorage();
  initRouter();
  initSidebar();
  initChat();
  initCommunity();
  initModals();
  renderChatHistories();
  renderAuthState();

  // API baglantisini kontrol et
  checkApiConnection();
});

// ---- API Baglanti Kontrolu ----
async function checkApiConnection() {
  try {
    const response = await fetch(`${Config.API_URL}/health`);
    if (response.ok) {
      State.isOnline = true;
      console.log('[BioArchive] API baglantisi basarili');
      // Kullanici girisi varsa verileri cek
      if (State.user && Api.getToken()) {
        await loadServerData();
      }
    }
  } catch {
    State.isOnline = false;
    console.log('[BioArchive] API baglantisi yok, yerel mod aktif');
  }
}

// ---- Tema ----
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  State.theme = theme;
  localStorage.setItem(Config.STORAGE_KEYS.THEME, theme);
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
  });
}

function toggleTheme() {
  applyTheme(State.theme === 'dark' ? 'light' : 'dark');
}

// ---- Router ----
function initRouter() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(viewName) {
  State.currentView = viewName;

  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewName);
  });
  document.querySelectorAll('.mobile-tab[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewName);
  });

  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const view = document.getElementById(viewName + 'View');
  if (view) view.classList.add('active');

  const titles = { chat: 'BioArchive AI', community: 'Topluluk', saved: 'Kaydedilenler' };
  const mobileTitle = document.querySelector('.mobile-header-title');
  if (mobileTitle) mobileTitle.textContent = titles[viewName] || 'BioArchive';

  closeMobileSidebar();
  if (viewName === 'saved') renderSavedView();
}

// ---- Sidebar ----
function initSidebar() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('sidebarOverlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
      overlay.classList.add('visible');
    });
  }
  if (overlay) overlay.addEventListener('click', closeMobileSidebar);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  const newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      State.messages = [];
      State.currentChatId = null;
      State.currentConversationId = null;
      saveToStorage();
      renderChatMessages();
      switchView('chat');
    });
  }

  const postDetailBack = document.getElementById('postDetailBack');
  if (postDetailBack) postDetailBack.addEventListener('click', closePostDetail);
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

// ---- Global Fonksiyonlar (onclick handler'lari icin) ----
window.toggleLike = toggleLike;
window.toggleBookmark = toggleBookmark;
window.sharePost = sharePost;
window.openCreatePostModal = openCreatePostModal;
window.submitPost = submitPost;
window.prevFlashCard = prevFlashCard;
window.nextFlashCard = nextFlashCard;
window.selectFlashCardTopic = selectFlashCardTopic;
window.fcGoHome = fcGoHome;
window.fcOpenCreate = fcOpenCreate;
window.fcOpenStudy = fcOpenStudy;
window.fcSelectCount = fcSelectCount;
window.fcFillPrompt = fcFillPrompt;
window.fcGenerate = fcGenerate;
window.fcShuffle = fcShuffle;
window.fcDeleteUserSet = fcDeleteUserSet;
window.simulatePdfSummary = simulatePdfSummary;
window.simulateVideoSummary = simulateVideoSummary;
window.loadChatHistory = loadChatHistory;
window.clearUploadPreview = clearUploadPreview;
window.toggleTheme = toggleTheme;
window.State = State;
window.saveToStorage = saveToStorage;
window.renderChatMessages = renderChatMessages;
window.closeAllModals = closeAllModals;
window.removePostTag = removePostTag;
window.renderSavedView = renderSavedView;
window.openPostDetail = openPostDetail;
window.closePostDetail = closePostDetail;
window.toggleLikeDetail = toggleLikeDetail;
window.toggleBookmarkDetail = toggleBookmarkDetail;
window.submitDetailComment = submitDetailComment;
window.openModal = openModal;
window.handleLogout = handleLogout;
window.inlineFcPrev = inlineFcPrev;
window.inlineFcNext = inlineFcNext;
window.inlineFcShuffle = inlineFcShuffle;
window.activateFlashCardMode = activateFlashCardMode;
window.deactivateFlashCardMode = deactivateFlashCardMode;
