const NodeMediaServer = require("node-media-server");
const express = require("express");

const app = express();

// Railway health check HTTP server
app.get("/", (req, res) => {
  res.send("RTMP Server Running on Railway ✓");
});

// Bind express on Railway's dynamic port
app.listen(process.env.PORT || 3000, () => {
  console.log("Health check server started");
});

// RTMP + HLS configuration
const config = {
  rtmp: {
    port: process.env.RTMP_PORT || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: process.env.HLS_PORT || 8000,
    mediaroot: "./media",
    allow_origin: "*"
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
