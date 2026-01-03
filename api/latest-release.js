// /api/latest-release.js

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // safe env variable
  const GITHUB_API = 'https://api.github.com/repos/Vv8056/vidflow/releases';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not set in environment variables' });
  }

  try {
    // Use native fetch (Node 18+ / Vercel Node 20)
    const response = await fetch(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${errText}`);
    }

    const releases = await response.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      return res.status(404).json({ error: 'No releases found' });
    }

    const release = releases[0];
    const asset = release.assets.find(a => a.name.endsWith('.apk'));

    if (!asset) {
      return res.status(404).json({ error: 'No APK asset found in latest release' });
    }

    res.status(200).json({
      name: release.name || release.tag_name,
      version: release.tag_name,
      url: asset.browser_download_url,
      size: asset.size,
      sha: null // GitHub REST API doesn't provide SHA by default
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
