const Download = require('../models/download')


module.exports = app => {
    app.get('/download', async (req, res) => {
        let fileId = req.query.fileId
        let range = req.headers.range
        if(!req.query.fileId){
            res.status(400).json({
                status: 400,
                error: 'invalid request'
            })
        } else {
            Download.d(fileId, range, res)
        }
    })
}