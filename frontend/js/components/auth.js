/* ============================================
   BioArchive - Auth (Kimlik Dogrulama) Modulu
   ============================================ */

function renderAuthState() {
  const userInfo = document.querySelector('.user-info');
  const userAvatar = document.querySelector('.user-avatar');
  const sidebarFooter = document.querySelector('.sidebar-footer');

  if (State.user) {
    const initials = State.user.displayName
      .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    if (userAvatar) {
      userAvatar.textContent = initials;
      userAvatar.style.background = State.user.avatarColor || '#4DBAB0';
    }
    if (userInfo) {
      userInfo.querySelector('.user-name').textContent = State.user.displayName;
      userInfo.querySelector('.user-status').textContent = 'Cevrimici';
    }

    // Auth butonlarini guncelle
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
      authBtn.innerHTML = `${Icons.logout} <span>Cikis Yap</span>`;
      authBtn.onclick = handleLogout;
    }
  } else {
    if (userAvatar) userAvatar.textContent = 'G';
    if (userInfo) {
      userInfo.querySelector('.user-name').textContent = 'Misafir';
      userInfo.querySelector('.user-status').textContent = 'Giris yap';
    }

    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
      authBtn.innerHTML = `${Icons.login} <span>Giris Yap</span>`;
      authBtn.onclick = () => openModal('authModal');
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const loginInput = document.getElementById('loginInput').value.trim();
  const passwordInput = document.getElementById('loginPasswordInput').value;

  if (!loginInput || !passwordInput) {
    showToast('Kullanici adi ve sifre gerekli');
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Giris yapiliyor...';

  try {
    const data = await Api.auth.login(loginInput, passwordInput);
    if (data) {
      Api.setTokens(data.accessToken, data.refreshToken);
      State.user = data.user;
      saveToStorage();
      closeAllModals();
      renderAuthState();
      showToast('Giris basarili! Hos geldiniz, ' + data.user.displayName);
      // Verileri sunucudan cek
      await loadServerData();
    }
  } catch (err) {
    showToast(err.message || 'Giris basarisiz');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Giris Yap';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const displayName = document.getElementById('registerDisplayName').value.trim();
  const password = document.getElementById('registerPassword').value;
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

  if (!username || !email || !displayName || !password) {
    showToast('Tum alanlar zorunludur');
    return;
  }

  if (password !== passwordConfirm) {
    showToast('Sifreler eslesmyor');
    return;
  }

  if (password.length < 6) {
    showToast('Sifre en az 6 karakter olmalidir');
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Kayit yapiliyor...';

  try {
    const data = await Api.auth.register(username, email, password, displayName);
    if (data) {
      Api.setTokens(data.accessToken, data.refreshToken);
      State.user = data.user;
      saveToStorage();
      closeAllModals();
      renderAuthState();
      showToast('Kayit basarili! Hos geldiniz, ' + data.user.displayName);
    }
  } catch (err) {
    showToast(err.message || 'Kayit basarisiz');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Kayit Ol';
  }
}

function handleLogout() {
  Api.clearTokens();
  State.user = null;
  State.messages = [];
  saveToStorage();
  renderAuthState();
  showToast('Cikis yapildi');
}

async function loadServerData() {
  try {
    // Postlari sunucudan cek
    const postsData = await Api.posts.list();
    if (postsData && postsData.posts) {
      State.posts = postsData.posts;
      saveToStorage();
      renderPosts(getCurrentFilter());
    }

    // Konusmalari cek
    if (State.user) {
      const convData = await Api.chat.getConversations();
      if (convData && convData.conversations) {
        State.chatHistories = convData.conversations.map(c => ({
          id: c.id,
          title: c.title,
          date: formatRelativeDate(c.updated_at),
        }));
        renderChatHistories();
      }
    }
  } catch {
    // Sunucuya erisilemiyorsa sessizce devam et
    State.isOnline = false;
  }
}

function initAuthModal() {
  const tabBtns = document.querySelectorAll('.auth-tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
}
