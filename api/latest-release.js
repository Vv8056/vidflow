// /api/latest-release.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // safe env variable
  const GITHUB_API = 'https://api.github.com/repos/dfg/vidflow/releases';

  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    const releases = await response.json();
    const release = releases[0];
    const asset = release.assets.find(a => a.name.endsWith('.apk'));

    if (!asset) throw new Error('APK asset not found');

    res.status(200).json({
      name: release.name,
      version: release.tag_name,
      url: asset.browser_download_url,
      size: asset.size,
      sha: asset.digest?.replace('sha256:', '') || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
