const yts = require('yt-search')
const fs = require('fs')
const ytdl = require("discord-ytdl-core");
const keys = require('../apikey.json')
const Delete = require('../lib/deleteFile')
const NodeID3 = require('node-id3')

class Play {
    play(title, host, protocol, apiKey, res){
        const search = async (s) => {
            const r = await yts(s)
            const videos = r.videos.slice(0, 1)
            let v = videos[0]
            console.log(v)

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
                author: v.author
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
                    const tags = {
                        title: data.title,
                        artist: data.author.name,
                        album: data.author.name,
                        APIC: data.thumbnail,
                        TRCK: "1"
                    }
                    const success = NodeID3.write(tags, path)
                    
                    res.status(200).json(response)
                    try{
                        Delete.audio(path, 5)
                    } catch (err) {
                        console.log(err)
                    }
                    
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