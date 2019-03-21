# nightmare-downloader

[![https://www.singularity-hub.org/static/img/hosted-singularity--hub-%23e32929.svg](https://www.singularity-hub.org/static/img/hosted-singularity--hub-%23e32929.svg)](https://singularity-hub.org/collections/2589)

Use `express.js` to locally host a web page and use `nightmare.js` (e.g., headless Electron) to run it and download files.

## Usage

```
singularity run nightmare-downloader.simg [path-to-serve-from] [path-to-output-to] [url-to-navigate-to] [wait-and-click elements ...]
```

For example,
```
singularity run nightmare-downloader.simg ~/Projects/dishtiny/web $(pwd) "http://localhost:3000/dishtiny.html" "#download_input" "#Animate"
```

## Authorship

`m.more500@gmail.com`
