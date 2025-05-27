interface Image {
  id: string;
  url: string;
}
interface Video {
  id: string;
  url: string;
}

export interface Upload {
  id: string;
  images: Image[];
  videos: Video[];
}
