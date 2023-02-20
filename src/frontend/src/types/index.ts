export interface Library {
  id: number;
  name: string;
  dir: string;
  cover: string;
  config: {
    coverCopy: boolean;
    scanRootArchiveFile: boolean;
  };
}

export interface Comic {
  id: number;
  name: string;
  dir: string;
  // publish: string
  // publishTime: string
  cover: string;
  coverPath: string;
  status: number;
  summary: string;
  inReadList: boolean;
  readingStatus: number;
  tags: { id: number; name: string }[];
  tagsData?: string[];
  authors: { id: number; name: string }[];
  authorsData?: string[];
  chapters?: any[];
}

export interface Chapter {
  id: number;
  name: string;
  dir: string;
  type: string;
  comicId: number;
  cover: string;
  coverPath: string;
  summary: string;
  sort: number;
  category: number;
}
