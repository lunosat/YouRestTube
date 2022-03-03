const Audio = require('../models/audio')

module.exports = app => {
    app.get('/audio', async (req, res) => {
        let url = req.query.url
        let apiKey = req.query.apiKey
        let host = req.get('host')
        let protocol = req.get('protocol')
        Audio.audio(url, host, protocol, apiKey, res)
    })
}