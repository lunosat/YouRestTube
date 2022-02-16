const fs = require('fs')

class Download{
    d(fileId, range, res){
        let file = './downloads/audios/' + fileId + '.mp3' 
        if(!fs.existsSync(file)){
            let response = {
                error: 'File not exist',
                fileId: fileId
            }
            res.status(400).json(response)
            return
        }
        let stat = fs.statSync(file)
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

            readStream = fs.createReadStream(file)
        }
        readStream.pipe(res)
    }
}

module.exports = new Download