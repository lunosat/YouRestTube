

# Youtube Rest API

This project has the sole objective of deepening my knowledge in Rest API's with NodeJs, I am not responsible for its misuse.


## Dependencies

* ffmpeg
* Python 3
* NodeJs (16.0.x +)
* Npm
* Git

## Installing and starting


```
//Clone 
git clone https://github.com/AkirahX/Youtube-Rest-API

//Enter
cd Youtube-Rest-API

//Install
npm install

//Start
node .
```

## Endpoints

Note: The apiKey is "todo" until her system is done.

### Play

Function: Search and return info with download link for the audio on .mp3 format.

Endpoint: `/play`

Syntax: `/play?title=Title of video on youtube&apiKey=apiKey`

<details>
  <summary>Exemple with Axios</summary>
  
  ```js
const axios = require('axios')

let title = 'Akon - Lonely'
let apiKey = 'todo'

try{
    axios.get(`localhost:3000/play?title=${title}&apiKey=${apiKey}`).then(res => {
        console.log(res.data)
    })
} catch (err){
    console.log(err)
}
  ```
  
  Response: 
  
  ```json
  {
    "git":"https://github.com/AkirahX/Youtube-Rest-API",
    "title":"Akon - Lonely (Official Music Video)",
    "thumbnail":"https://i.ytimg.com/vi/6EEW-9NDM5k/hq720.jpg",
    "description":"#Akon #Lonely #Remastered Music video by Akon performing Lonely. (C) 2005 SRC Records, Inc., Universal Records, A Division ...",
    "timestamp":"4:24",
    "views":756927873,
    "originalUrl":"https://youtube.com/watch?v=6EEW-9NDM5k",
    "download":"localhost:3000/download/6EEW-9NDM5k.mp3"
   }
  ```
</details>



## TODO

- [ ] Database
- [ ] Create ApiKey system
- [ ] Download
- [ ] Create route `/search`
- [ ] Create route `/audio`
- [ ] Create route `/video`
- [ ] Create route `/setApiKey`
- [ ] Create route `/deleteApiKey`
- [ ] More?



