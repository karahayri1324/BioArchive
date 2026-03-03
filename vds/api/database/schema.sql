-- ============================================
-- BioArchive - Veritabani Semasi
-- PostgreSQL 14+
-- ============================================

-- UUID eklentisi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---- Kullanicilar ----
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(30) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(50) NOT NULL,
    avatar_color    VARCHAR(7) DEFAULT '#4DBAB0',
    bio             TEXT DEFAULT '',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ---- Paylasimlari (Posts) ----
CREATE TABLE IF NOT EXISTS posts (
    id              SERIAL PRIMARY KEY,
    author_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    body            TEXT NOT NULL,
    category        VARCHAR(20) NOT NULL CHECK (category IN ('article', 'research', 'note', 'question')),
    tags            JSONB DEFAULT '[]',
    likes_count     INTEGER DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- ---- Yorumlar ----
CREATE TABLE IF NOT EXISTS comments (
    id              SERIAL PRIMARY KEY,
    post_id         INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id);

-- ---- Begeniler ----
CREATE TABLE IF NOT EXISTS post_likes (
    id              SERIAL PRIMARY KEY,
    post_id         INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- ---- Kayitlar (Bookmarks) ----
CREATE TABLE IF NOT EXISTS bookmarks (
    id              SERIAL PRIMARY KEY,
    post_id         INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- ---- Konusmalar (AI Chat) ----
CREATE TABLE IF NOT EXISTS conversations (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) DEFAULT 'Yeni Sohbet',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);

-- ---- Chat Mesajlari ----
CREATE TABLE IF NOT EXISTS chat_messages (
    id              SERIAL PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role            VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    content         TEXT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conv ON chat_messages(conversation_id);

-- ---- Flash Kart Setleri ----
CREATE TABLE IF NOT EXISTS flashcard_sets (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(100) NOT NULL,
    topic           VARCHAR(50) NOT NULL,
    description     TEXT DEFAULT '',
    is_public       BOOLEAN DEFAULT true,
    created_by      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_flashcard_sets_topic ON flashcard_sets(topic);

-- ---- Flash Kartlar ----
CREATE TABLE IF NOT EXISTS flashcards (
    id              SERIAL PRIMARY KEY,
    set_id          INTEGER NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
    front           TEXT NOT NULL,
    back            TEXT NOT NULL,
    sort_order      INTEGER DEFAULT 0
);

CREATE INDEX idx_flashcards_set ON flashcards(set_id);

-- ---- Updated_at trigger ----
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
