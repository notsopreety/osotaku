# Contributing to OsOtaku

First off, thank you for considering contributing to OsOtaku! 💜

OsOtaku is a community-driven project, and we welcome contributions of all kinds - whether you're adding episode sources, fixing bugs, or improving documentation.

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Adding Episode Sources](#adding-episode-sources)
- [Code Contributions](#code-contributions)
- [Reporting Issues](#reporting-issues)
- [Pull Request Process](#pull-request-process)

## Ways to Contribute

### 🎬 Add Episode Sources (Most Needed!)
The most impactful way to contribute is by adding streaming sources for anime episodes.

### 💻 Improve the Codebase
Fix bugs, add features, improve performance, or enhance the UI.

### 🐛 Report Issues
Found a bug or broken link? Open an issue with details.

### 📚 Improve Documentation
Help make our docs clearer and more helpful.

## Adding Episode Sources

### Step 1: Find the AniList ID

Every anime has a unique ID on AniList. You can find it in the URL:
- `https://anilist.co/anime/195515/...` → ID is `195515`

### Step 2: Create the JSON File

Create or edit a file at `public/data/{anilistId}.json`:

```json
{
  "episodes": [
    {
      "epId": "ep-1",
      "title": "Episode Title (optional)",
      "description": "Brief description (optional)",
      "thumbnail": "https://cdn.example.com/thumbnail.jpg",
      "duration": 1420,
      "updatedOn": "2026-02-03",
      "sources": [
        {
          "server": "ServerName",
          "type": "embed",
          "audio": "sub",
          "addedBy": "YourAnilistUsername",
          "data": [
            {
              "url": "https://example.com/embed/xxxxx",
              "quality": "auto"
            }
          ]
        }
      ]
    }
  ]
}
```
### Example
```json
{
  "episodes": [
    {
      "epId": "ep-1",
      "title": "The Beginning",
      "description": "The journey starts as the main character discovers a hidden power.",
      "thumbnail": "https://cdn.example.com/thumbnails/ep-1.jpg",
      "duration": 1420,
      "updatedOn": "2026-02-03",
      "sources": [
        {
          "server": "streamsb",
          "type": "embed",
          "audio": "sub",
          "addedBy": "animeAdmin1",
          "data": [
            {
              "url": "https://streamsb.com/e/xxxxx",
              "quality": "auto"
            }
          ]
        },
        {
          "server": "cloudflare",
          "type": "hls",
          "audio": "dub",
          "addedBy": "animeAdmin3",
          "data": [
            {
              "url": "https://cdn.example.com/hls/ep-1/dub/master.m3u8",
              "quality": "auto"
            }
          ]
        }
      ]
    },
    {
      "epId": "ep-2",
      "title": "First Battle",
      "description": "A sudden enemy attack forces an unexpected fight.",
      "thumbnail": "https://cdn.example.com/thumbnails/ep-2.jpg",
      "duration": 1395,
      "updatedOn": "2026-02-03",
      "sources": [
        {
          "server": "vidcloud",
          "type": "embed",
          "audio": "sub",
          "addedBy": "animeAdmin1",
          "data": [
            {
              "url": "https://vidcloud.to/embed/xxxxx",
              "quality": "auto"
            }
          ]
        },
        {
          "server": "aws-hls",
          "type": "hls",
          "audio": "sub",
          "addedBy": "animeAdmin2",
          "data": [
            {
              "url": "https://cdn.example.com/hls/ep-2/sub/master.m3u8",
              "quality": "auto",
              "subtitles": [
                {
                  "languageId": "en",
                  "label": "English",
                  "url": "https://cdn.example.com/subs/ep-2/en.vtt"
                }
              ]
            }
          ]
        },
        {
          "server": "aws-hls",
          "type": "hls",
          "audio": "dub",
          "addedBy": "animeAdmin3",
          "data": [
            {
              "url": "https://cdn.example.com/hls/ep-2/dub/master.m3u8",
              "quality": "auto"
            }
          ]
        }
      ]
    }
  ]
}
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `epId` | ✅ | Unique episode ID (e.g., "ep-1", "ep-2") |
| `title` | ❌ | Episode title |
| `description` | ❌ | Brief episode description |
| `thumbnail` | ❌ | Episode thumbnail URL |
| `duration` | ❌ | Duration in seconds |
| `sources` | ✅ | Array of streaming sources |

### Source Object Fields

| Field | Required | Description |
|-------|----------|-------------|
| `server` | ✅ | Server name (e.g., "vidcloud", "streamsb") |
| `type` | ✅ | "embed" for iframe, "hls" for .m3u8 |
| `audio` | ✅ | "sub" for subbed, "dub" for dubbed |
| `addedBy` | ✅ | Your username (for attribution) |
| `data` | ✅ | Array of quality options |

### Data Object Fields

| Field | Required | Description |
|-------|----------|-------------|
| `url` | ✅ | Streaming URL |
| `quality` | ✅ | Quality label (e.g., "auto", "1080p", "720p") |
| `subtitles` | ❌ | Array of subtitle tracks (HLS only) |

### Subtitle Object Fields (for HLS)

```json
{
  "languageId": "en",
  "label": "English",
  "url": "https://cdn.example.com/subtitles.vtt"
}
```

### Guidelines

✅ **Do:**
- Use reliable, stable streaming sources
- We suggest using embed sources for stable streaming
- Test your links before submitting
- Follow the JSON schema exactly
- Use your actual username for attribution
- Add multiple quality options when available

❌ **Don't:**
- Submit links with excessive ads or popups
- Add malicious or unsafe sources
- Submit broken or expired links
- Add download links (streaming only)

>**Tip:** For embeded players, you can use <a href="https://abyss.to/">Abyss.to</a> video streaming.

## Code Contributions

### Prerequisites

- Node.js 18+
- npm or bun

### Setup

```bash
# Clone your fork
git clone https://github.com/notsopreety/osotaku.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Query** - Data fetching
- **AniList API** - Anime metadata

### Code Style

- Use TypeScript for all new files
- Follow existing code patterns
- Write meaningful commit messages
- Add comments for complex logic

## Reporting Issues

When reporting bugs, please include:

1. **Description** - What happened?
2. **Steps to Reproduce** - How can we recreate it?
3. **Expected Behavior** - What should happen?
4. **Screenshots** - If applicable
5. **Browser/Device** - Your environment

For broken streaming links, include:
- The anime title and AniList ID
- The episode number
- The server name

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes locally
5. **Commit** with a clear message (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### PR Guidelines

- Keep PRs focused on a single change
- Update documentation if needed
- Add tests for new features (when applicable)
- Ensure all checks pass

## Attribution

Contributors who add episode sources are credited via the `addedBy` field, which is displayed on the site. Code contributors are listed in the GitHub contributors page.

## Questions?

- Open a [GitHub Issue](https://github.com/notsopreety/OsOtaku/issues)
- Check the [FAQ](/faq) page

---

Thank you for making OsOtaku better! 💜
