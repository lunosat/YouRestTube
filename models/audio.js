const fetchVideoInfo = require('updated-youtube-info');
const fs = require('fs')
const ytdl = require("discord-ytdl-core");
const keys = require('../apikey.json')
const Delete = require('../lib/deleteFile')
const NodeID3 = require('node-id3')

class Audio {
    audio(url, host, protocol, apiKey, res){
        const getInfo = async (id) => {
            const info = await fetchVideoInfo(id)
            let resp = {
                url: info.url,
                title: info.title,
                description: info.description,
                owner: info.owner,
                thumbnail: info.thumbnailUrl,
                duration: info.duration,
                views: info.views,
                genre: info.genre,
                date: info.datePublished
            }
            return resp
        }
        const save = async () => {
            try{
                const videoId = url.includes('watch') ? url.substring(url.indexOf('=') + 1) : url.substring(url.indexOf('be') + 2);
                const data = await getInfo(videoId)
                const path = './downloads/audios/' + videoId + '.mp3'
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
                        duration: data.duration,
                        views: data.views,
                        originalUrl: data.url,
                        owner: data.owner,
                        genre: data.genre,
                        date: data.date,
                        download: host + '/download?fileId=' + data.videoId
                    }
                    const tags = {
                        title: data.title,
                        artist: data.owner,
                        album: data.url,
                        genre: data.genre,
                        date: data.date,
                        APIC: data.thumbnail,
                        TRCK: "1"
                    }
                    const success = NodeID3.write(tags, path)
                        
                    res.status(200).json(response)
                    console.log(response)
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

module.exports = new Audio

