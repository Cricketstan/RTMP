const NodeMediaServer = require("node-media-server");
const express = require("express");

const app = express();

// Web UI root message
app.get("/", (req, res) => {
  res.send("RTMP Server Running on Render ✓");
});

// Express must bind to Render PORT for health checks
app.listen(process.env.PORT || 3000, () => {
  console.log("HTTP Health Check server active");
});

// RTMP + HLS configuration
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*",
    api: true
  },
  trans: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=4:hls_list_size=4:hls_flags=delete_segments]"
      }
    ]
  }
};

new NodeMediaServer(config).run();
