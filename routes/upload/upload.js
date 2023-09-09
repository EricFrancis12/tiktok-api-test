const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const express = require('express');
const router = express.Router();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ffmpegPath = require('ffmpeg-static').path;



router.get('/publish', async (req, res) => {
    const access_token = req.query.access_token;
    console.log(access_token);
    const video_url = 'https://vcube.live/money-1.mp4';

    try {
        const endpoint = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';

        // const headers = {
        //     Authorization: `Bearer ${access_token}`,
        //     'Content-Type': 'application/json'
        // }
        // const requestBody = {
        //     source_info: {
        //         source: 'PULL_FROM_URL',
        //         video_url
        //     }
        // };
        // const resJSON = await axios.post(endpoint, requestBody, { headers });

        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            method: 'POST',
            body: JSON.stringify({
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url
                }
            })
        });
        const resJSON = await response.json();

        console.log('Video added to drafts:', resJSON);

        res.status(200).json({
            success: true,
            message: resJSON
        });
    } catch (err) {
        console.error('Error adding video to drafts:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});





router.get('/drafts', async (req, res) => {
    const access_token = req.query.access_token;
    console.log(access_token);
    const video_url = 'https://vcube.live/money-1.mp4';

    try {
        const endpoint = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/';

        // const headers = {
        //     Authorization: `Bearer ${access_token}`,
        //     'Content-Type': 'application/json'
        // }
        // const requestBody = {
        //     source_info: {
        //         source: 'PULL_FROM_URL',
        //         video_url
        //     }
        // };
        // const resJSON = await axios.post(endpoint, requestBody, { headers });

        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            method: 'POST',
            body: JSON.stringify({
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url
                }
            })
        });
        const resJSON = await response.json();

        console.log('Video added to drafts:', resJSON);

        res.status(200).json({
            success: true,
            message: resJSON
        });
    } catch (err) {
        console.error('Error adding video to drafts:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});





router.get('/drafts/status', async (req, res) => {
    try {
        const endpoint = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';
        const publish_id = req.query.publish_id;
        const access_token = req.query.access_token;

        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            method: 'POST',
            body: JSON.stringify({
                publish_id
            })
        });
        const resJSON = await response.json();
        console.log(resJSON);

        res.status(200).json({
            success: true,
            message: resJSON
        });
    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});





router.get('/drafts/file_upload', async (req, res) => {
    const access_token = req.query.access_token;
    console.log(access_token);

    // const fileSize = getVideoFileSize(path.join(__dirname, '../videos/video.mp4'));
    const fileSize = 18_557_680;
    console.log(fileSize);

    try {
        const endpoint = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/';

        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            method: 'POST',
            body: JSON.stringify({
                source_info: {
                    source: 'FILE_UPLOAD',
                    video_size: fileSize,
                    chunk_size: fileSize,
                    total_chunk_count: 1
                }
            })
        });
        const resJSON = await response.json();
        console.log(resJSON);

        const videoPath = path.join(__dirname, '../videos/video.mp4');
        console.log(videoPath);

        let response2;
        if (resJSON.data.publish_id && resJSON.data.upload_url) {
            const endpoint = resJSON.data.upload_url;
            const fileStream = fs.createReadStream(videoPath);

            response2 = await axios.put(endpoint, fileStream, {
                headers: {
                    'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`,
                    'Content-Type': 'video/mp4',
                }
            });

            console.log(response2);
        }

        res.status(200).json({
            success: true,
            message: {
                resJSON: resJSON,
                response2: response2
            }
        });
    } catch (err) {
        console.error('Error adding video to drafts:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



function getVideoFileSize(filePath) {
    // Run the ffmpeg command to get the video file information
    const result = spawnSync(ffmpegPath, ['-i', filePath]);

    // Check if the command executed successfully
    if (result.error) {
        console.error('Error executing ffmpeg command:', result.error);
        return null;
    }

    // Extract the file size from the command output
    const output = result.stdout.toString();
    const fileSizeMatch = output.match(/(\d+)\s+bytes/);

    if (fileSizeMatch && fileSizeMatch[1]) {
        const fileSizeInBytes = parseInt(fileSizeMatch[1]);
        return fileSizeInBytes;
    }

    return null; // File size not found
}



module.exports = router;
