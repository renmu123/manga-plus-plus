-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dir" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Comic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dir" TEXT,
    "publish" TEXT,
    "publishTime" INTEGER,
    "cover" TEXT,
    "isReaded" BOOLEAN NOT NULL DEFAULT false,
    "libraryId" INTEGER NOT NULL,
    CONSTRAINT "Comic_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'folder',
    "comicId" INTEGER NOT NULL,
    "cover" TEXT,
    CONSTRAINT "Chapter_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AuthorToComic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AuthorToComic_A_fkey" FOREIGN KEY ("A") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AuthorToComic_B_fkey" FOREIGN KEY ("B") REFERENCES "Comic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ComicToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ComicToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Comic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ComicToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToComic_AB_unique" ON "_AuthorToComic"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToComic_B_index" ON "_AuthorToComic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ComicToTag_AB_unique" ON "_ComicToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ComicToTag_B_index" ON "_ComicToTag"("B");
