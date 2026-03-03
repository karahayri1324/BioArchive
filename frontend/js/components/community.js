/* ============================================
   BioArchive - Community (Topluluk) Modulu
   ============================================ */

function initCommunity() {
  renderPosts();

  // Kategori tab'lari
  document.querySelectorAll('.community-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.community-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPosts(tab.dataset.filter);
    });
  });
}

function renderPosts(filter = 'all') {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  let posts = State.posts;
  if (filter && filter !== 'all') {
    posts = posts.filter(p => p.category === filter);
  }

  const catLabels = { 'article': 'Makale', 'research': 'Arastirma', 'note': 'Not', 'question': 'Soru' };
  const catClasses = { 'article': 'cat-article', 'research': 'cat-research', 'note': 'cat-note', 'question': 'cat-question' };

  let html = '';
  posts.forEach((post, i) => {
    const author = post.author || {};
    const initials = author.initials || author.displayName?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
    const commentCount = post.comments ? post.comments.length : (post.commentCount || 0);
    const likesCount = post.likesCount !== undefined ? post.likesCount : (post.likes || 0);
    const catLabel = catLabels[post.category] || '';
    const catClass = catClasses[post.category] || '';
    const tags = post.tags || [];
    const dateStr = formatRelativeDate(post.createdAt) || post.date || '';

    html += `
      <article class="post-card" onclick="openPostDetail(${post.id})" style="animation-delay: ${i * 0.08}s">
        <div class="post-header">
          <div class="post-avatar" style="background: ${author.avatarColor || '#4DBAB0'}">${initials}</div>
          <div class="post-meta">
            <div class="post-author">${escapeHtml(author.displayName || author.name || 'Anonim')}</div>
            <div class="post-date">${dateStr}</div>
          </div>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-body"><p>${escapeHtml(post.body).substring(0, 200)}${post.body.length > 200 ? '...' : ''}</p></div>
        <div class="post-tags">
          ${catLabel ? `<span class="post-tag ${catClass}">${catLabel}</span>` : ''}
          ${(Array.isArray(tags) ? tags : []).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="post-actions" onclick="event.stopPropagation()">
          <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            ${post.liked ? Icons.heartFill : Icons.heart}
            <span>${likesCount}</span>
          </button>
          <button class="post-action-btn" onclick="openPostDetail(${post.id})">
            ${Icons.comment}
            <span>${commentCount}</span>
          </button>
          <button class="post-action-btn ${post.bookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${post.id})">
            ${post.bookmarked ? Icons.bookmarkFill : Icons.bookmark}
          </button>
          <button class="post-action-btn" onclick="sharePost(${post.id})">
            ${Icons.share}
          </button>
        </div>
      </article>`;
  });

  container.innerHTML = html || `
    <div class="saved-empty">
      <div class="saved-empty-icon">${Icons.edit}</div>
      <h3>Henuz paylasim yok</h3>
      <p>Bu kategoride henuz paylasim bulunmuyor.</p>
    </div>`;
}

async function toggleLike(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  // Onceki durumu sakla
  const wasLiked = post.liked;
  const prevCount = post.likesCount !== undefined ? post.likesCount : post.likes;

  // Optimistik guncelleme
  post.liked = !wasLiked;
  if (post.likesCount !== undefined) {
    post.likesCount += post.liked ? 1 : -1;
  } else {
    post.likes += post.liked ? 1 : -1;
  }
  saveToStorage();
  renderPosts(getCurrentFilter());

  // API'ye gonder
  if (State.isOnline && State.user) {
    try {
      await Api.posts.toggleLike(postId);
    } catch {
      // Geri al
      post.liked = wasLiked;
      if (post.likesCount !== undefined) post.likesCount = prevCount;
      else post.likes = prevCount;
      saveToStorage();
      renderPosts(getCurrentFilter());
    }
  }
}

async function toggleBookmark(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  post.bookmarked = !post.bookmarked;
  if (post.bookmarked) {
    if (!State.savedPosts.includes(postId)) State.savedPosts.push(postId);
    showToast('Kaydedildi');
  } else {
    State.savedPosts = State.savedPosts.filter(id => id !== postId);
    showToast('Kayit kaldirildi');
  }

  saveToStorage();
  renderPosts(getCurrentFilter());

  if (State.isOnline && State.user) {
    try { await Api.posts.toggleBookmark(postId); } catch { /* sessiz */ }
  }
}

function sharePost(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  const shareUrl = `https://bioarchive.com.tr/post/${postId}`;

  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.body.substring(0, 100) + '...',
      url: shareUrl,
    });
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link panoya kopyalandi');
    });
  }
}

function getCurrentFilter() {
  const active = document.querySelector('.community-tab.active');
  return active ? active.dataset.filter : 'all';
}

// ---- Post Detay ----
let previousView = 'community';

function openPostDetail(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  previousView = State.currentView;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const detailView = document.getElementById('postDetailView');
  if (detailView) detailView.classList.add('active');

  const mobileTitle = document.querySelector('.mobile-header-title');
  if (mobileTitle) mobileTitle.textContent = 'Paylasim';

  renderPostDetail(post);
}

function renderPostDetail(post) {
  const container = document.getElementById('postDetailContent');
  if (!container) return;

  const author = post.author || {};
  const initials = author.initials || author.displayName?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
  const catLabels = { 'article': 'Makale', 'research': 'Arastirma', 'note': 'Not', 'question': 'Soru' };
  const catClasses = { 'article': 'cat-article', 'research': 'cat-research', 'note': 'cat-note', 'question': 'cat-question' };
  const catLabel = catLabels[post.category] || '';
  const catClass = catClasses[post.category] || '';
  const comments = post.comments || [];
  const tags = post.tags || [];
  const likesCount = post.likesCount !== undefined ? post.likesCount : (post.likes || 0);

  let commentsHtml = '';
  if (comments.length === 0) {
    commentsHtml = '<div class="comments-empty">Henuz yorum yapilmamis. Ilk yorumu sen yap!</div>';
  } else {
    commentsHtml = comments.map(c => {
      const cAuthor = c.author || {};
      const cInitials = cAuthor.initials || cAuthor.displayName?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
      return `
        <div class="detail-comment">
          <div class="comment-avatar" style="background:${cAuthor.avatarColor || '#4DBAB0'}">${cInitials}</div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author">${escapeHtml(cAuthor.displayName || cAuthor.name || 'Anonim')}</span>
              <span class="comment-date">${formatRelativeDate(c.createdAt) || c.date || ''}</span>
            </div>
            <p class="comment-text">${escapeHtml(c.content || c.text || '')}</p>
          </div>
        </div>`;
    }).join('');
  }

  container.innerHTML = `
    <article class="post-detail-card">
      <div class="post-header">
        <div class="post-avatar" style="background:${author.avatarColor || '#4DBAB0'}">${initials}</div>
        <div class="post-meta">
          <div class="post-author">${escapeHtml(author.displayName || author.name || 'Anonim')}</div>
          <div class="post-date">${formatRelativeDate(post.createdAt) || post.date || ''}</div>
        </div>
      </div>
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <div class="post-body"><p>${escapeHtml(post.body)}</p></div>
      <div class="post-tags">
        ${catLabel ? `<span class="post-tag ${catClass}">${catLabel}</span>` : ''}
        ${(Array.isArray(tags) ? tags : []).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="post-actions">
        <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLikeDetail(${post.id})">
          ${post.liked ? Icons.heartFill : Icons.heart}
          <span>${likesCount}</span>
        </button>
        <button class="post-action-btn">
          ${Icons.comment}
          <span>${comments.length}</span>
        </button>
        <button class="post-action-btn ${post.bookmarked ? 'bookmarked' : ''}" onclick="toggleBookmarkDetail(${post.id})">
          ${post.bookmarked ? Icons.bookmarkFill : Icons.bookmark}
        </button>
        <button class="post-action-btn" onclick="sharePost(${post.id})">
          ${Icons.share}
        </button>
      </div>
    </article>
    <div class="detail-comments-section">
      <div class="detail-comments-title">
        Yorumlar <span class="count-badge">${comments.length}</span>
      </div>
      ${commentsHtml}
      <div class="detail-comment-input-row">
        <input type="text" class="detail-comment-input" id="detailCommentInput-${post.id}"
          placeholder="${State.user ? 'Yorum yaz...' : 'Yorum yapmak icin giris yapin'}"
          ${!State.user ? 'disabled' : ''}
          onkeydown="if(event.key==='Enter')submitDetailComment(${post.id})">
        <button class="detail-comment-submit" onclick="submitDetailComment(${post.id})"
          ${!State.user ? 'disabled' : ''}>Gonder</button>
      </div>
    </div>`;
}

function closePostDetail() {
  switchView(previousView || 'community');
}

async function toggleLikeDetail(postId) {
  await toggleLike(postId);
  const post = State.posts.find(p => p.id === postId);
  if (post) renderPostDetail(post);
}

async function toggleBookmarkDetail(postId) {
  await toggleBookmark(postId);
  const post = State.posts.find(p => p.id === postId);
  if (post) renderPostDetail(post);
}

async function submitDetailComment(postId) {
  const input = document.getElementById('detailCommentInput-' + postId);
  if (!input || !input.value.trim()) return;

  if (!State.user) {
    showToast('Yorum yapmak icin giris yapin');
    return;
  }

  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  const content = input.value.trim();

  // Yerel ekleme
  const newComment = {
    id: Date.now(),
    author: {
      displayName: State.user.displayName,
      initials: State.user.displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
      avatarColor: State.user.avatarColor || '#4DBAB0',
    },
    content: content,
    createdAt: new Date().toISOString(),
  };

  if (!post.comments) post.comments = [];
  post.comments.push(newComment);
  saveToStorage();
  renderPostDetail(post);
  showToast('Yorum eklendi');

  // API'ye gonder
  if (State.isOnline) {
    try { await Api.comments.create(postId, content); } catch { /* sessiz */ }
  }
}

// ---- Paylasim Olusturma ----
let postTags = [];

function openCreatePostModal() {
  if (!State.user) {
    showToast('Paylasim yapmak icin giris yapin');
    openModal('authModal');
    return;
  }
  openModal('createPostModal');
  const form = document.getElementById('createPostForm');
  if (form) form.reset();
  const tagsContainer = document.getElementById('postTagsContainer');
  if (tagsContainer) tagsContainer.innerHTML = '<input type="text" class="form-tag-input" id="postTagInput" placeholder="Etiket ekle...">';
  initTagInput();
}

function initTagInput() {
  const input = document.getElementById('postTagInput');
  if (!input) return;
  postTags = [];

  input.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      addPostTag(input.value.trim());
      input.value = '';
    }
    if (e.key === 'Backspace' && !input.value && postTags.length > 0) {
      removePostTag(postTags.length - 1);
    }
  });
}

function addPostTag(tag) {
  if (postTags.includes(tag) || postTags.length >= 5) return;
  postTags.push(tag);
  renderPostTags();
}

function removePostTag(index) {
  postTags.splice(index, 1);
  renderPostTags();
}

function renderPostTags() {
  const container = document.getElementById('postTagsContainer');
  if (!container) return;
  let html = postTags.map((tag, i) => `
    <span class="form-tag-chip">${escapeHtml(tag)}<button onclick="removePostTag(${i})">&times;</button></span>
  `).join('');
  html += '<input type="text" class="form-tag-input" id="postTagInput" placeholder="Etiket ekle...">';
  container.innerHTML = html;
  initTagInput();
}

async function submitPost() {
  const title = document.getElementById('postTitleInput').value.trim();
  const body = document.getElementById('postBodyInput').value.trim();
  const category = document.getElementById('postCategorySelect').value;

  if (!title || !body) {
    showToast('Lutfen baslik ve icerik girin');
    return;
  }

  const newPost = {
    id: Date.now(),
    author: {
      displayName: State.user ? State.user.displayName : 'Kullanici',
      initials: State.user
        ? State.user.displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : 'K',
      avatarColor: State.user ? State.user.avatarColor : '#4DBAB0',
    },
    title,
    body,
    tags: [...postTags],
    category,
    likesCount: 0,
    liked: false,
    bookmarked: false,
    createdAt: new Date().toISOString(),
    comments: [],
  };

  State.posts.unshift(newPost);
  saveToStorage();
  closeAllModals();
  renderPosts(getCurrentFilter());
  showToast('Paylasim olusturuldu!');

  // API'ye gonder
  if (State.isOnline && State.user) {
    try { await Api.posts.create(title, body, category, postTags); } catch { /* sessiz */ }
  }
}

// ---- Kaydedilenler ----
function renderSavedView() {
  const container = document.getElementById('savedContent');
  if (!container) return;

  const savedPosts = State.posts.filter(p => p.bookmarked);

  if (savedPosts.length === 0) {
    container.innerHTML = `
      <div class="saved-empty">
        <div class="saved-empty-icon">${Icons.bookmark}</div>
        <h3>Henuz kayit yok</h3>
        <p>Begendigniz paylasimlari kaydedin, burada gorunsun.</p>
      </div>`;
    return;
  }

  let html = '';
  savedPosts.forEach((post, i) => {
    const author = post.author || {};
    const initials = author.initials || author.displayName?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
    const likesCount = post.likesCount !== undefined ? post.likesCount : (post.likes || 0);

    html += `
      <article class="post-card" style="animation-delay: ${i * 0.08}s" onclick="openPostDetail(${post.id})">
        <div class="post-header">
          <div class="post-avatar" style="background: ${author.avatarColor || '#4DBAB0'}">${initials}</div>
          <div class="post-meta">
            <div class="post-author">${escapeHtml(author.displayName || author.name || 'Anonim')}</div>
            <div class="post-date">${formatRelativeDate(post.createdAt) || post.date || ''}</div>
          </div>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-body"><p>${escapeHtml(post.body).substring(0, 150)}...</p></div>
        <div class="post-actions" onclick="event.stopPropagation()">
          <button class="post-action-btn liked" onclick="toggleLike(${post.id})">
            ${Icons.heartFill}
            <span>${likesCount}</span>
          </button>
          <button class="post-action-btn bookmarked" onclick="toggleBookmark(${post.id}); setTimeout(renderSavedView, 100);">
            ${Icons.bookmarkFill}
          </button>
        </div>
      </article>`;
  });

  container.innerHTML = html;
}
