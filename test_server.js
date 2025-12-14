import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Log the request
    console.log(`${req.method} ${req.url}`);

    // 1. Handle Upload Test (POST requests)
    // The speed test sends POST requests to /upload (or similar paths configured in the app)
    // We need to accept the data stream to measure speed, but we don't need to save it.
    if (req.method === 'POST') {
        // Accept the data stream but do nothing with it (blackhole)
        req.on('data', () => {}); 
        req.on('end', () => {
            // Add headers to prevent caching and allow CORS
            res.writeHead(200, {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Connection': 'keep-alive'
            });
            res.end();
        });
        return;
    }

    // 2. Handle Static Files (UI & Download Test)
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    // Remove query parameters for file lookup
    filePath = filePath.split('?')[0];

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.png': contentType = 'image/png'; break;
        case '.xml': contentType = 'application/xml'; break;
        case '.webmanifest': contentType = 'application/manifest+json'; break;
        case '.bin': contentType = 'application/octet-stream'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT'){
                // If a download file is missing (e.g. /downloading/10MB.bin), 
                // we can generate dummy data on the fly to simulate it.
                // This is useful if you don't want to keep large binary files in the repo.
                if (req.url.includes('downloading')) {
                    res.writeHead(200, { 
                        'Content-Type': 'application/octet-stream',
                        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                        'Access-Control-Allow-Origin': '*'
                    });
                    // Send a chunk of dummy data. 
                    // Note: The real app might expect specific sizes, but for basic testing
                    // sending a stream or a fixed buffer often works to trigger the download logic.
                    // Here we send a 1MB buffer.
                    const dummy = Buffer.alloc(1024 * 1024, 'a'); 
                    res.end(dummy);
                } else {
                    res.writeHead(404);
                    res.end('File not found');
                }
            } else {
                res.writeHead(500);
                res.end('Server Error: '+error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n--- OpenSpeedTest Development Server ---`);
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Hit Ctrl+C to stop.\n`);
});
