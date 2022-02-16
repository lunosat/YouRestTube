const Play = require('../models/play')


module.exports = app => {
    app.get('/play', async (req, res) => {
        let title = req.query.title
        let host = req.get('host')
        let apiKey = req.query.apiKey
        if(!req.query.title || !req.query.apiKey){
            res.status(400).json({
                status: 400,
                error: 'invalid request'
            })
        } else {
            Play.play(title, host, apiKey, res)
        }
    })
}