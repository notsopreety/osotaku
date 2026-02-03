// Episode data types for local JSON files

export interface SubtitleTrack {
  languageId: string;
  label: string;
  url: string;
}

export interface SourceData {
  url: string;
  quality: string;
  subtitles?: SubtitleTrack[];
}

export interface EpisodeSource {
  server: string;
  type: 'hls' | 'embed';
  audio: 'sub' | 'dub';
  addedBy: string;
  data: SourceData[];
}

export interface Episode {
  epId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  isFiller?: boolean;
  sources: EpisodeSource[];
}

export interface EpisodeDataFile {
  episodes: Episode[];
}
