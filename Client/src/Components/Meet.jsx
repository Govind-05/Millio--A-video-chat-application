import { useEffect, useState } from "react"
import "../../public/Styles/meet.css"
import { useNavigate } from "react-router-dom";


export default function Meet() {

    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [isAlone, setIsAlone] = useState(true);
    const[contact,setContact]=useState("")
    const[isLeft,setIsleft]=useState(false);

    useEffect(() => {
        let APP_ID = "a8e256ddb001489582f045c1506079ac";
        let token = null;

        let Cookies = document.cookie.split(";").map(cookie => cookie.split("=")).reduce((accumualtor, [key, value]) => ({ ...accumualtor, [key.trim()]: decodeURIComponent(value) }), {})
        let uid = Cookies.username;
        console.log(uid);

        let client;
        let channel;

        let queryString = window.location.search
        let urlParams = new URLSearchParams(queryString)
        let meetId = urlParams.get('meetId')
        setCode(meetId);

        if (!meetId) {
            window.location = '/';
        }

        let localStream;
        let remoteStream;
        let peerConnection;

        const servers = {
            iceServers: [
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
                }
            ]
        }


        let constraints = {
            video: {
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 480, ideal: 1080, max: 1080 },
            },
            audio: true
        }

        const init = async () => {
            client = await AgoraRTM.createInstance(APP_ID);
            await client.login({ uid, token });

            channel = client.createChannel(meetId);
            await channel.join();

            channel.on('MemberJoined', handleUserJoined);
            channel.on('MemberLeft', handleUserLeft);

            client.on('MessageFromPeer', handleMessageFromPeer);

            localStream = await navigator.mediaDevices.getUserMedia(constraints);
            document.getElementById('user-1').srcObject = localStream;
        }


        const handleUserLeft = (MemberId) => {
            setIsAlone(true)
            document.getElementById('user-2').style.display = 'none'
            document.getElementById('user-1').classList.remove('smallFrame');
        }

        const handleMessageFromPeer = async (message, MemberId) => {

            message = JSON.parse(message.text);

            if (message.type === 'offer') {
                setIsAlone(false)
                setContact(message.username)
                console.log("OFFER FROM", message.username);
                createAnswer(MemberId, message.offer);
            }

            if (message.type === 'answer') {
                setIsAlone(false)
                setContact(message.username)
                console.log("Answer FROM", message.username);
                addAnswer(message.answer);
            }

            if (message.type === 'candidate') {
                if (peerConnection) {
                    peerConnection.addIceCandidate(message.candidate);
                }
            }


        }

        const handleUserJoined = async (MemberId) => {
            setIsAlone(false)
            console.log('A new user joined the channel:', MemberId);
            createOffer(MemberId);
        }


        const createPeerConnection = async (MemberId) => {
            peerConnection = new RTCPeerConnection(servers);

            remoteStream = new MediaStream();
            document.getElementById('user-2').srcObject = remoteStream
            document.getElementById('user-2').style.display = 'block'

            document.getElementById('user-1').classList.add('smallFrame');


            if (!localStream) {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                document.getElementById('user-1').srcObject = localStream
            }

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            })

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                })
            }

            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'candidate', 'candidate': event.candidate }) }, MemberId);
                }
            }
        }

        const createOffer = async (MemberId) => {
            await createPeerConnection(MemberId);

            let offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'offer', 'offer': offer, "username": uid }) }, MemberId);
        }


        const createAnswer = async (MemberId, offer) => {
            await createPeerConnection(MemberId);

            await peerConnection.setRemoteDescription(offer);

            let answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'answer', 'answer': answer, "username": uid }) }, MemberId);
        }


        const addAnswer = async (answer) => {
            if (!peerConnection.currentRemoteDescription) {
                peerConnection.setRemoteDescription(answer)
            }
        }

        const toggleCamera = async () => {
            let videoTrack = localStream.getTracks().find(track => track.kind === 'video');

            if (videoTrack.enabled) {
                videoTrack.enabled = false
                document.getElementById('camera-btn').style.backgroundColor = 'rgb(175, 43, 43)';
            } else {
                videoTrack.enabled = true
                document.getElementById('camera-btn').style.backgroundColor = 'rgb(121, 0, 234, 0.9)';
            }
        }

        const toggleMic = async () => {
            let audioTrack = localStream.getTracks().find(track => track.kind === 'audio');

            if (audioTrack.enabled) {
                audioTrack.enabled = false
                document.getElementById('mic-btn').style.backgroundColor = 'rgb(175, 43, 43)';
            } else {
                audioTrack.enabled = true
                document.getElementById('mic-btn').style.backgroundColor = 'rgb(121, 0, 234, 0.9)';
            }
        }

        window.addEventListener('beforeunload', () => {
            leaveChannel();
        });

        const leaveChannel = async () => {
            await channel.leave();
            await client.logout();
        }


        document.getElementById('camera-btn').addEventListener('click', toggleCamera);
        document.getElementById('mic-btn').addEventListener('click', toggleMic);

            init();
            
    }, [])


    // const handleClick=async()=>{
    //     await leaveChannel();
    //     navigate('/');
    // }

    return (
        <>
            <div id="videos">
                <video className="video-player" id="user-1" autoPlay playsInline></video>
                <video className="video-player" id="user-2" autoPlay playsInline></video>
                {!isAlone && <>
                    <div className="your-name"><span>You</span></div>
                    <div className="your-name contact-name"><span>{contact}</span></div>
                </>}

            </div>
            <div className="code">
                <span>{code}</span>
            </div>

            <div id="controls">

                <div className="control-container" id="camera-btn">
                    <img src="./public/Images/camera.png" />
                </div>

                <div className="control-container" id="mic-btn">
                    <img src="./public/Images/mic.png" />
                </div>

                <a href="/">
                    <div className="control-container" id="leave-btn" >
                        <img src="./public/Images/phone.png" />
                    </div>
                </a>


            </div>
        </>
    )
}