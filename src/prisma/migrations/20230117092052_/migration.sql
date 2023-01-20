-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ComicToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ComicToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Comic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ComicToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComicToTag_AB_unique" ON "_ComicToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ComicToTag_B_index" ON "_ComicToTag"("B");
