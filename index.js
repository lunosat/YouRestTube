const express = require('express')
const app = express()
const yts = require('yt-search')
const path = require('path')
//const youtubedl = require('youtube-dl-exec')
const fs = require('fs')
const axios = require('axios')
const { json } = require('express/lib/response')
const ytdl = require("discord-ytdl-core");
const db = require('./database/database.json')

const port = 3000

let timeOuts = []; 

async function deleteFile(id){
    try {
        fs.unlinkSync(id)
        //file removed
    } catch(err) {
        console.error(err)
    }
}
app.use(express.static('public'))
//https://www.youtube.com/watch?v=6EEW-9NDM5k

app.get('/', async (req, res) => {
    res.send('Home')
})
app.get('/api/play', async(req, res) => {
    const r = await yts(req.query.q)
    let vurl;
    let response;
    let name;
    const videos = r.videos.slice( 0, 3 )
        videos.forEach(function(v){
        vurl = v.url
        name = v.videoId
        response = {
            title: v.title,
            thumbnail: v.thumbnail,
            description: v.description,
            timestamp: v.timestamp,
            views: v.views,
            author: v.author.name,
            channelUrl: v.author.url,
            originalUrl: v.url,
            download: 'api/download/' + v.videoId + '.mp3'
        }
    })
    let stream = ytdl(vurl, {
        fmt: "mp3",
        opusEncoded: false
    });
    let localFile = `${name}.mp3`
    stream.pipe(down = fs.createWriteStream(localFile)).on('finish', () => {
        res.status(200).json(response)
        let deleteAfter = setTimeout(() => {deleteFile(localFile)}, 60000 * 5)
        db.play.reqs = db.play.reqs + 1
    })
})
app.get('/api/yta', async(req, res) => {
    let error = {
        error: 'invalid url'
    }
    if(!req.query.url.includes('youtu')) return res.status(400).json(error)
    console.log(req.query.url)
    youtubedl(req.query.url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: req.query.url
        })
        .then(async output => {
            //console.log(output)
            const { data } = await axios.get(output.formats[0].url, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'audio/wav'
            }
        });
        console.log(data)
        let fileId = Math.random()
        let localFile = output.title + '.mp3'
        console.log(localFile)
        console.log('Iniciando')
        fs.writeFile(localFile, data, (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              //console.log(fs.readFileSync("books.txt", "utf8"));
            }
        });
        //fs.writeFileSync(localFile, data)
        //console.log(file)
        let response = {
            status: 200,
            download: '',
            fileId: fileId
        }
        res.status(200).json(response)
        let deleteAfter = setTimeout(() => {deleteFile(localFile)}, 60000 * 5)
    })

})
app.get('/api/ytv', async(req, res) => {

})
app.get('/api/yts', async(req, res) => {

})
app.get('/api/download/:file',(req, res) => {
    let key = req.params.file;

    let music = 'audios/' + key

    let stat = fs.statSync(music)
    let range = req.headers.range
    let readStream;

    if(range !== undefined){
        let parts = range.replace(/bytes=/, "").split("-")

        let partial_start = parts[0]
        let partial_end = parts[1]

        if((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)){
            return res.sendStatus(500);
        }

        let start = parseInt(partial_start, 10)
        let end = partial_end ? parseInt(partial_end, 10) : stat.size - 1
        let content_length = (end - start) + 1

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length' : content_length,
            'Content-Range' : "bytes " + start + "-" + end + "/" + stat.size
        })

        readStream = fs.createReadStream(music, {start: start, end: end})
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        })

        readStream = fs.createReadStream(music)
    }
    readStream.pipe(res)
    /*
    let fileLocation = path.join('./audios',file);
    console.log(fileLocation);
    res.download(fileLocation, file);*/
});
app.listen(port, () => {
    console.log('Server started on port: ' + port)
})
