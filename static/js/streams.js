const APP_ID = '5184dff46f5349428b4cec8530acddcb'
const TOKEN = '007eJxTYPh6ct3m905/enZKHRHwz+LmmzT/Q8RL6xmbeCwKKhT/pAorMJgaWpikpKWZmKWZGptYmhhZJJkkpyZbmBobJCanpCQn9StnpzUEMjLYBocwMzJAIIjPwpCbmJnHwAAAd2kfHA=='
const CHANNEL = 'main'

const client = AgoraRTC.creatClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUser = {}


