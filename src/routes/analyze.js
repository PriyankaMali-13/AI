const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const analyzeImage = require('../services/visionService');

router.post('/analyze', upload, async (req, res) => {
    const mode = req.body.mode;
    const validModes = ['serious', 'interview', 'roast'];
    if(!req.file){
        return res.status(400).json({message: "Image is required"});
    }
    if (!mode) {
        return res.status(400).json({ message: "Mode is required" });
    }
    if (!validModes.includes(mode)) {
        return res.status(400).json({ message: "Invalid mode. Must be serious, interview or roast" });
    }
    else {
        try {
            const result = await analyzeImage(req.file.buffer, mode);
            return res.json({ result });
        } catch (error) {
            return res.status(500).json({ message: error.message });

        }
    }
});

module.exports = router;