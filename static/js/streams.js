const APP_ID = '5184dff46f5349428b4cec8530acddcb'
const TOKEN = '0065184dff46f5349428b4cec8530acddcbIADvANz6+B6/izv+GbAsp7ktM8JIeP6bBTGSPOBL1pecyGTNKL+TUlORIgArKoIAX1hvZgQAAQBfWG9mAgBfWG9mAwBfWG9mBABfWG9m+B6/izv+GbAsp7ktM8JIeP6bBTGSPOBL1pecyGTNKL+TUlORIgArKoIAX1hvZgQAAQBfWG9mAgBfWG9mAwBfWG9mBABfWG9m/enZKHRHwz+LmmzT/Q8RL6xmbeCwKKhT/pAorMJgaWpikpKWZmKWZGptYmhhZJJkkpyZbmBobJCanpCQn9StnpzUEMjLYBocwMzJAIIjPwpCbmJnHwAAAd2kfHA=='
const CHANNEL = 'main'

const client = AgoraRTC.creatClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUser = {}     //stores the user joined

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    UID = await client.join(APP_ID, TOKEN, CHANNEL, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div  class="video-container" id="user-container-${UID}">
                     <div class="video-player" id="user-${UID}"></div>
                     <div class="username-wrapper"><span class="user-name">${UID}</span></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play('user-${UID}')

    await client.publish([localTracks[0], localTracks[1]])  //other user can also see audio and video tracks
        
}

let handleUserJoined = async (user, mediaType) => {
    remoteUser[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById('user-container-${user.id}')
        if(player != null){ //user is already in the stream
            player.remove()
        }

        player = `<div  class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div>
                        <div class="username-wrapper"><span class="user-name">${user.id}</span></div>
                    </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play('user-${user.uid}')
    }

    if(mediaType == 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) =>{
    delete remoteUser[user.uid]
    document.getElementById('user-container-${user.uid}').remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(i=0;i<localTracks.length;i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/','_self')
}

let toggleCamera = async(e) =>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else {
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}
let toggleMic = async(e) =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else {
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click',toggleMic)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)