/*
  Warnings:

  - Added the required column `dir` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'folder',
    "comicId" INTEGER NOT NULL,
    CONSTRAINT "Chapter_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("comicId", "id", "name", "type") SELECT "comicId", "id", "name", "type" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
