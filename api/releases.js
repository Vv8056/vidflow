// export default async function handler(req, res) {
//   const token = process.env.GITHUB_TOKEN;

//   if (!token) {
//     return res.status(500).json({ error: "GitHub token missing" });
//   }

//   try {
//     const ghRes = await fetch(
//       "https://api.github.com/repos/Vv8056/vidflow/releases",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/vnd.github+json",
//           "User-Agent": "vercel-app"
//         }
//       }
//     );

//     const data = await ghRes.json();

//     if (!ghRes.ok) {
//       return res.status(ghRes.status).json(data);
//     }

//     res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
//     return res.status(200).json(data);

//   } catch (err) {
//     return res.status(500).json({ error: "Failed to fetch releases" });
//   }
// }


// export default async function handler(req, res) {
//   const token = process.env.GITHUB_TOKEN;

//   if (!token) {
//     return res.status(500).json({ error: "GitHub token missing" });
//   }

//   try {
//     const ghRes = await fetch(
//       "https://api.github.com/repos/Vv8056/vidflow/releases",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/vnd.github+json",
//           "User-Agent": "vercel-app"
//         }
//       }
//     );

//     const data = await ghRes.json();

//     if (!ghRes.ok) {
//       return res.status(ghRes.status).json(data);
//     }

//     // Cache on Vercel Edge
//     res.setHeader(
//       "Cache-Control",
//       "s-maxage=300, stale-while-revalidate=600"
//     );

//     return res.status(200).json(data);

//   } catch (err) {
//     return res.status(500).json({ error: "Failed to fetch releases" });
//   }
// }


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "GitHub token missing" });
  }

  try {
    const ghRes = await fetch(
      "https://api.github.com/repos/Vv8056/vidflow/releases",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "vidflow-vercel"
        }
      }
    );

    const data = await ghRes.json();

    if (!ghRes.ok) {
      return res.status(ghRes.status).json(data);
    }

    // Cache on Vercel edge
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch GitHub releases"
    });
  }
}
