CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT NOT NULL, date TEXT NOT NULL, place TEXT, org TEXT);
CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT, date TEXT);
-- Seed (run once):
-- INSERT INTO events VALUES ('e1','Club Fair','2026-09-22','Covered Court','All clubs'),('e2','Robotics Open Build','2026-09-23','Lab 3','Robotics Team'),('e3','Debate Tryouts','2026-09-25','Room 112','Debate Society'),('e4','Riverside Clean-up','2026-09-27','School Gate','Eco Warriors');
