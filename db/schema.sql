CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_members (
  id INTEGER PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(150) NOT NULL,
  org VARCHAR(150) DEFAULT '',
  photo VARCHAR(255) DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  file VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS instagram_posts (
  id INTEGER PRIMARY KEY,
  ig_id VARCHAR(64) UNIQUE,
  permalink VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  caption TEXT,
  media_type VARCHAR(20) NOT NULL DEFAULT 'image',
  posted_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY,
  ip VARCHAR(45) NOT NULL,
  username VARCHAR(100) NOT NULL DEFAULT '',
  attempted_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts (ip, attempted_at);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  body_html TEXT NOT NULL,
  cover_image VARCHAR(255) DEFAULT '',
  published_at DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS region_coordinators (
  id INTEGER PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  name VARCHAR(150) NOT NULL,
  photo VARCHAR(255) DEFAULT '',
  certificate VARCHAR(255) DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS representatives (
  plate VARCHAR(2) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(150) NOT NULL DEFAULT 'İl Başkanı',
  photo VARCHAR(255) DEFAULT '',
  certificate VARCHAR(255) DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS representative_members (
  id INTEGER PRIMARY KEY,
  plate VARCHAR(2) NOT NULL REFERENCES representatives (plate) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES representative_members (id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(150) NOT NULL DEFAULT '',
  photo VARCHAR(255) DEFAULT '',
  certificate VARCHAR(255) DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_representative_members_plate ON representative_members (plate);
CREATE INDEX IF NOT EXISTS idx_representative_members_parent ON representative_members (parent_id);

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value TEXT
);

CREATE SEQUENCE IF NOT EXISTS admin_users_id_seq;
CREATE SEQUENCE IF NOT EXISTS board_members_id_seq;
CREATE SEQUENCE IF NOT EXISTS documents_id_seq;
CREATE SEQUENCE IF NOT EXISTS instagram_posts_id_seq;
CREATE SEQUENCE IF NOT EXISTS login_attempts_id_seq;
CREATE SEQUENCE IF NOT EXISTS news_id_seq;
CREATE SEQUENCE IF NOT EXISTS region_coordinators_id_seq;
CREATE SEQUENCE IF NOT EXISTS representative_members_id_seq;

ALTER TABLE admin_users ALTER COLUMN id SET DEFAULT nextval('admin_users_id_seq');
ALTER TABLE board_members ALTER COLUMN id SET DEFAULT nextval('board_members_id_seq');
ALTER TABLE documents ALTER COLUMN id SET DEFAULT nextval('documents_id_seq');
ALTER TABLE instagram_posts ALTER COLUMN id SET DEFAULT nextval('instagram_posts_id_seq');
ALTER TABLE login_attempts ALTER COLUMN id SET DEFAULT nextval('login_attempts_id_seq');
ALTER TABLE news ALTER COLUMN id SET DEFAULT nextval('news_id_seq');
ALTER TABLE region_coordinators ALTER COLUMN id SET DEFAULT nextval('region_coordinators_id_seq');
ALTER TABLE representative_members ALTER COLUMN id SET DEFAULT nextval('representative_members_id_seq');

ALTER SEQUENCE admin_users_id_seq OWNED BY admin_users.id;
ALTER SEQUENCE board_members_id_seq OWNED BY board_members.id;
ALTER SEQUENCE documents_id_seq OWNED BY documents.id;
ALTER SEQUENCE instagram_posts_id_seq OWNED BY instagram_posts.id;
ALTER SEQUENCE login_attempts_id_seq OWNED BY login_attempts.id;
ALTER SEQUENCE news_id_seq OWNED BY news.id;
ALTER SEQUENCE region_coordinators_id_seq OWNED BY region_coordinators.id;
ALTER SEQUENCE representative_members_id_seq OWNED BY representative_members.id;
