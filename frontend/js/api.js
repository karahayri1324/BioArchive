/* ============================================
   BioArchive - API Client
   Tum backend istekleri bu modul uzerinden yapilir
   ============================================ */

const Api = {
  // ---- Token Yonetimi ----
  getToken() {
    return localStorage.getItem(Config.STORAGE_KEYS.TOKEN);
  },

  setTokens(accessToken, refreshToken) {
    localStorage.setItem(Config.STORAGE_KEYS.TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(Config.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  clearTokens() {
    localStorage.removeItem(Config.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(Config.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(Config.STORAGE_KEYS.USER);
  },

  // ---- Temel HTTP Metotlari ----
  async request(endpoint, options = {}) {
    const url = `${Config.API_URL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Token suresi dolmus - yenilemeyi dene
      if (response.status === 401 && token) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.getToken()}`;
          const retryResponse = await fetch(url, { ...options, headers });
          return this.handleResponse(retryResponse);
        } else {
          this.clearTokens();
          State.user = null;
          showToast('Oturum suresi doldu. Lutfen tekrar giris yapin.');
          renderAuthState();
          throw new Error('Oturum suresi doldu');
        }
      }

      return this.handleResponse(response);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        console.warn('[API] Sunucuya ulasilamiyor, yerel mod aktif');
        return null;
      }
      throw err;
    }
  },

  async handleResponse(response) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(data?.error || 'Bir hata olustu');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem(Config.STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${Config.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  },

  // ---- Auth Endpointleri ----
  auth: {
    async register(username, email, password, displayName) {
      return Api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, displayName }),
      });
    },

    async login(login, password) {
      return Api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
      });
    },

    async me() {
      return Api.request('/auth/me');
    },
  },

  // ---- Chat Endpointleri ----
  chat: {
    async sendMessage(message, conversationId = null) {
      return Api.request('/chat/message', {
        method: 'POST',
        body: JSON.stringify({ message, conversationId }),
      });
    },

    async getConversations() {
      return Api.request('/chat/conversations');
    },

    async getConversation(id) {
      return Api.request(`/chat/conversations/${id}`);
    },

    async deleteConversation(id) {
      return Api.request(`/chat/conversations/${id}`, { method: 'DELETE' });
    },
  },

  // ---- Post Endpointleri ----
  posts: {
    async list(category = 'all', page = 1, sort = 'newest') {
      const params = new URLSearchParams({ page, limit: Config.POSTS_PER_PAGE, sort });
      if (category && category !== 'all') params.append('category', category);
      return Api.request(`/posts?${params}`);
    },

    async get(id) {
      return Api.request(`/posts/${id}`);
    },

    async create(title, body, category, tags) {
      return Api.request('/posts', {
        method: 'POST',
        body: JSON.stringify({ title, body, category, tags }),
      });
    },

    async update(id, data) {
      return Api.request(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return Api.request(`/posts/${id}`, { method: 'DELETE' });
    },

    async toggleLike(id) {
      return Api.request(`/posts/${id}/like`, { method: 'POST' });
    },

    async toggleBookmark(id) {
      return Api.request(`/posts/${id}/bookmark`, { method: 'POST' });
    },
  },

  // ---- Yorum Endpointleri ----
  comments: {
    async create(postId, content) {
      return Api.request('/comments', {
        method: 'POST',
        body: JSON.stringify({ postId, content }),
      });
    },

    async delete(id) {
      return Api.request(`/comments/${id}`, { method: 'DELETE' });
    },
  },

  // ---- Flashcard Endpointleri ----
  flashcards: {
    async getSets(topic = null) {
      const params = topic ? `?topic=${encodeURIComponent(topic)}` : '';
      return Api.request(`/flashcards${params}`);
    },

    async getCards(setId) {
      return Api.request(`/flashcards/${setId}/cards`);
    },

    async createSet(title, topic, description, cards, isPublic = true) {
      return Api.request('/flashcards', {
        method: 'POST',
        body: JSON.stringify({ title, topic, description, isPublic, cards }),
      });
    },
  },

  // ---- Kullanici Endpointleri ----
  users: {
    async getProfile(username) {
      return Api.request(`/users/${username}`);
    },

    async updateProfile(data) {
      return Api.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async getBookmarks() {
      return Api.request('/users/me/bookmarks');
    },
  },
};
