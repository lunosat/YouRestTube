const fetchVideoInfo = require('updated-youtube-info');

const getInfo = async (id) => {
    fetchVideoInfo(id).then((info) => {
        console.log(info);
    });
}
getInfo('6EEW-9NDM5k')