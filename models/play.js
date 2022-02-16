const yts = require('yt-search')
const fs = require('fs')
const ytdl = require("discord-ytdl-core");
const keys = require('../apikey.json')
const Delete = require('../src/deleteFile')

class Play {
    play(title, host, apiKey, res){
        const search = async (s) => {
            const r = await yts(s)
            const videos = r.videos.slice(0, 1)
            let v = videos[0]

            let result = {
                type: v.type,
                videoId: v.videoId,
                url: v.url,
                title: v.title,
                description: v.description,
                image: v.image,
                thumbnail: v.thumbnail,
                seconds: v.seconds,
                timestamp: v.timestamp,
                ago: v.ago,
                views: v.views,
            }
            return result
        }
        const save = async () => {
            try{
                const data = await search(title)
                const path = './downloads/audios/' + data.videoId + '.mp3'
                let stream = ytdl(data.url, {
                    fmt: "mp3",
                    opusEncoded: false
                });
                stream.pipe(fs.createWriteStream(path))
                .on('finish', () => {
                    let response = {
                        git: 'https://github.com/AkirahX/Youtube-Rest-API',
                        title: data.title,
                        thumbnail: data.thumbnail,
                        description: data.description,
                        timestamp: data.timestamp,
                        views: data.views,
                        originalUrl: data.url,
                        download: host + '/download?fileId=' + data.videoId
                    }
                    res.status(200).json(response)
                    Delete.audio(path, 5)
                })
            } catch (err) {
                res.status(500).json(JSON.stringify(err))
            }
            
        }
        if(keys.key.includes(apiKey)){
            save()
        } else {
            let response = {
                status: 'error 400',
                error: 'Invalid apiKey'
            }
            res.status(400).json(response)
        }
    }
}

module.exports = new Play