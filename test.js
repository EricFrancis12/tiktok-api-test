const path = require('path');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


(async function () {
    const fileSize = 18_557_680;
    const endpoint = 'https://open-upload.us.tiktokapis.com/upload?upload_id=7256864558034569262&upload_token=810ec64d-8f30-ae11-6de8-e02429d19f22';

    const response = await fetch(endpoint, {
        headers: {
            'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`,
            'Content-Type': 'video/mp4'
        },
        method: 'PUT',
        body: path.join(__dirname, './videos/video.mp4')
    });
    console.log(response);

    const resJSON = await response.json();
    console.log(resJSON);
})();
