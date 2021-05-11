<div align="center">
	<h1>File Share</h1>
	<p>A simple private file sharing server</p>
</div>

# Features 
- Only you the one who can upload
- Everyone can see your files by sharing the Files URL
- Lightweight, And minimalist
- File Manager (With Editor!)

# Installation
```bash
git clone https://github.com/Yonle/FileShare
cd FileShare
npm install
```

# Configuration
Rename `.env.example` as `.env`, And fill these Fields:

- `USERNAME` (Required): Your username to upload credentials (Not your UN*X Username)
- `PASSWORD` (Required): Your password to upload credentials (Not your UN*X Password)

- `UPLOAD_DIRECTORY`: A upload directory path (Default: `$TMPDIR` / `.files`)

# Running
```bash
npm start
```

# Credit
The modified File Manager can found [here](https://github.com/Yonle/Nodejs-Filemanager). The original source of File Manager can also found [here](https://github.com/Hoodgail/Nodejs-Filemanager)

# Community
- [Discord](https://dsc.gg/yonle)
- [Telegram](https://t.me/yonlecoder)
