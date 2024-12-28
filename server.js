const express = require('express');
const ytSearch = require('yt-search');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to search YouTube videos
app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const results = await ytSearch(query);
        const videos = results.videos.slice(0, 10).map(video => ({
            title: video.title,
            url: video.url,
            duration: video.timestamp,
            views: video.views,
            uploaded: video.ago
        }));

        res.json({ videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while searching for videos' });
    }
});

// Default route to serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
