/*
  Warnings:

  - You are about to drop the column `authorId` on the `Comic` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dir" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AuthorToComic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AuthorToComic_A_fkey" FOREIGN KEY ("A") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AuthorToComic_B_fkey" FOREIGN KEY ("B") REFERENCES "Comic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "publish" TEXT,
    "path" TEXT,
    "publishTime" INTEGER,
    "cover" TEXT,
    "isReaded" BOOLEAN NOT NULL DEFAULT false,
    "libraryId" INTEGER,
    CONSTRAINT "Comic_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comic" ("cover", "id", "isReaded", "name", "path", "publish", "publishTime") SELECT "cover", "id", "isReaded", "name", "path", "publish", "publishTime" FROM "Comic";
DROP TABLE "Comic";
ALTER TABLE "new_Comic" RENAME TO "Comic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToComic_AB_unique" ON "_AuthorToComic"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToComic_B_index" ON "_AuthorToComic"("B");
