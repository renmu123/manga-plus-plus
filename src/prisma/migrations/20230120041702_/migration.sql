/*
  Warnings:

  - Made the column `libraryId` on table `Comic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN "cover" TEXT;

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
    "libraryId" INTEGER NOT NULL,
    CONSTRAINT "Comic_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comic" ("cover", "id", "isReaded", "libraryId", "name", "path", "publish", "publishTime") SELECT "cover", "id", "isReaded", "libraryId", "name", "path", "publish", "publishTime" FROM "Comic";
DROP TABLE "Comic";
ALTER TABLE "new_Comic" RENAME TO "Comic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
