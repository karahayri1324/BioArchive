-- ============================================
-- BioArchive - Ornek Veri (Seed)
-- ============================================

-- Ornek kullanicilar (sifre: "bioarchive123" - bcrypt hash)
INSERT INTO users (username, email, password_hash, display_name, avatar_color, bio) VALUES
('drayse', 'ayse@bioarchive.com.tr', '$2a$12$LJ3Jx6d4Y5m9F8k5h8K4qOY5b2F9.mQ8Z0n3r1p4s5t6u7v8w9x0y', 'Dr. Ayse Kaya', '#4DBAB0', 'Genetik ve molekuler biyoloji uzmani. Istanbul Universitesi.'),
('profburak', 'burak@bioarchive.com.tr', '$2a$12$LJ3Jx6d4Y5m9F8k5h8K4qOY5b2F9.mQ8Z0n3r1p4s5t6u7v8w9x0y', 'Prof. Burak Ozturk', '#4A90D9', 'Deniz biyolojisi ve ekoloji profesoru.'),
('selinaksoy', 'selin@bioarchive.com.tr', '$2a$12$LJ3Jx6d4Y5m9F8k5h8K4qOY5b2F9.mQ8Z0n3r1p4s5t6u7v8w9x0y', 'Selin Aksoy', '#E8853D', 'Biyoloji ogrencisi, hucre biyolojisi meraklisi.'),
('canyilmaz', 'can@bioarchive.com.tr', '$2a$12$LJ3Jx6d4Y5m9F8k5h8K4qOY5b2F9.mQ8Z0n3r1p4s5t6u7v8w9x0y', 'Can Yilmaz', '#D94F7A', 'Tip fakultesi ogrencisi.'),
('zeyneparslan', 'zeynep@bioarchive.com.tr', '$2a$12$LJ3Jx6d4Y5m9F8k5h8K4qOY5b2F9.mQ8Z0n3r1p4s5t6u7v8w9x0y', 'Zeynep Arslan', '#3DAE85', 'Ekoloji ve cevre bilimleri arastirmacisi.')
ON CONFLICT (username) DO NOTHING;

-- Ornek paylasimlari
INSERT INTO posts (author_id, title, body, category, tags, likes_count) VALUES
(1, 'CRISPR-Cas9 ile Genom Duzenleme: Son Gelismeler',
 'CRISPR teknolojisindeki son gelismeler, genetik hastaliklarin tedavisinde umut verici sonuclar ortaya koyuyor. Ozellikle orak hucre anemisi ve beta talasemi gibi kan hastaliklarinda klinik deneylerde basarili sonuclar elde edildi. CRISPR-Cas9 sistemi, bakterilerin dogal bagisiklik mekanizmasindan esinlenerek gelistirilmistir ve DNA''nin belirli noktalarinda hassas kesimler yapabilmektedir.',
 'article', '["Genetik", "CRISPR", "Genom"]', 47),

(2, 'Deniz Biyolojisi: Mercan Resifleri ve Iklim Degisikligi',
 'Buyuk Set Resifi''ndeki agartma olaylari son 5 yilda dramatik bir artis gosterdi. Okyanus sicakliklarindaki 1.5°C''lik artis bile mercan ekosistemlerini ciddi sekilde tehdit ediyor. Yeni restorasyon teknikleri ve mercan bahcecilik projeleri umut vaat ediyor. Bilim insanlari, isiya dayanikli mercan turlerinin yetistirilmesi uzerinde calismaktadir.',
 'research', '["Deniz Biyolojisi", "Ekoloji", "Iklim"]', 32),

(3, 'Mitoz ve Mayoz Bolunme Karsilastirmasi',
 'Hucre bolunmesinin iki temel tipi olan mitoz ve mayoz, farkli amaclarla gerceklesir. Mitoz buyume ve onarim icin, mayoz ise ureme hucreleri olusturmak icin gereklidir. Mitoz sonucunda 2 diploid hucre, mayoz sonucunda ise 4 haploid hucre olusur. Crossing-over yalnizca mayoz I''de gerceklesir.',
 'note', '["Hucre Biyolojisi", "Not"]', 18),

(4, 'Protein sentezi asamalarinda kafam karisti',
 'Arkadaslar, transkripsiyon ve translasyon arasindaki farki bir turlu oturtamiyorum. RNA polimeraz ve ribozomun rolu hakkinda yardimci olabilecek var mi? Ozellikle mRNA''nin islenmesi konusu cok karisik geliyor. Intron ve ekson ayrimi nerede gerceklesiyor?',
 'question', '["Molekuler Biyoloji", "Soru"]', 8)
ON CONFLICT DO NOTHING;

-- Ornek yorumlar
INSERT INTO comments (post_id, author_id, content) VALUES
(1, 5, 'Harika bir ozet olmus, tesekkurler! CRISPR-Cas12 hakkinda da bir paylasim yapar misiniz?'),
(1, 3, 'Off-target etkileri konusunda son calismalari da eklemenizi oneririm.'),
(2, 5, 'Akdeniz''deki mercan turleri icin de benzer bir tehdit soz konusu mu?'),
(4, 1, 'Transkripsiyon cekirdekte, translasyon sitoplazmada gerceklesir. Basitce: DNA → mRNA (transkripsiyon), mRNA → Protein (translasyon).'),
(4, 3, 'Khan Academy''nin bu konudaki videolari cok aciklayici, oneririm!')
ON CONFLICT DO NOTHING;

-- Ornek begeniler
INSERT INTO post_likes (post_id, user_id) VALUES
(1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 3), (2, 5),
(3, 1), (3, 2),
(4, 1), (4, 3)
ON CONFLICT DO NOTHING;

-- Ornek flash kart setleri
INSERT INTO flashcard_sets (title, topic, description, is_public, created_by) VALUES
('Genel Biyoloji Temelleri', 'Genel Biyoloji', 'Biyolojinin temel kavramlarini iceren flash kart seti', true, 1),
('Genetik Temelleri', 'Genetik', 'Genetik alaninin temel kavramlari', true, 1)
ON CONFLICT DO NOTHING;

-- Genel Biyoloji kartlari
INSERT INTO flashcards (set_id, front, back, sort_order) VALUES
(1, 'Mitokondri nedir?', 'Hucrenin enerji santrali olarak bilinen, ATP ureten organeldir. Cift zar yapisina sahiptir ve kendi DNA''sina sahiptir.', 0),
(1, 'Osmoz nedir?', 'Suyun, yari gecirgen bir zardan, dusuk cozunur konsantrasyonlu ortamdan yuksek cozunur konsantrasyonlu ortama dogru hareketi.', 1),
(1, 'Enzim nedir?', 'Biyolojik katalizorlerdir. Kimyasal reaksiyonlarin aktivasyon enerjisini dusurerek reaksiyon hizini artirirlar. Cogu protein yapisindadir.', 2),
(1, 'Meioz kac asama icerir?', 'Iki asama icerir: Meioz I (indirgenme bolunmesi) ve Meioz II (esitsel bolunme). Sonucta 4 haploid hucre olusur.', 3),
(1, 'Fotosentezin genel denklemi?', '6CO₂ + 6H₂O + Isik → C₆H₁₂O₆ + 6O₂ (Karbondioksit + Su + Isik → Glikoz + Oksijen)', 4),
(1, 'DNA''nin yapisi?', 'Cift sarmal yapisinda, nukleotidlerden olusur. Her nukleotid: fosforik asit + deoksiriboz seker + azotlu baz (A-T, G-C) icerir.', 5)
ON CONFLICT DO NOTHING;

-- Genetik kartlari
INSERT INTO flashcards (set_id, front, back, sort_order) VALUES
(2, 'Genotip nedir?', 'Bir organizmanin genetik yapisidir. Alel cifleri ile ifade edilir (ornegin Aa, BB).', 0),
(2, 'Fenotip nedir?', 'Bir organizmanin gozlenebilir ozellikleridir. Genotip ve cevre etkilesimi sonucu ortaya cikar.', 1),
(2, 'Dominant alel?', 'Heterozigot durumda bile etkisini gosteren aleldir. Buyuk harf ile gosterilir (A).', 2),
(2, 'Kodominans?', 'Her iki alelin de fenotipte esit sekilde ifade edildigi durumdur. Ornek: AB kan grubu.', 3)
ON CONFLICT DO NOTHING;
