import React, { useEffect, useRef, useState } from "react";
import Janus from "../../utils/janus.js";
import { useDispatch } from "react-redux";
import styles from "./RtcRoom.module.scss";
import { ToggleVideoButton } from "./ToggleVideoButton.jsx";
import { ToggleAudioButton } from "./ToggleAudioButton.jsx";
import VideoView from "./VideoView"; // Video 컴포넌트 import

import { fetchExitRtcRoomId } from "../../services/rtcApi.js";

const JanusWebRTC = ({ roomCode, username, isNew }) => {
  const dispatch = useDispatch();
  const [isStarted, setIsStarted] = useState(false);
  // const [username, setUsername] = useState("");
  const [title, setTitle] = useState("내 화면");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [count, setCount] = useState(false);

  const mainVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null); // 상대방 비디오를 위한 ref
  const mainVideoTitleRef = useRef(null); // 제목을 위한 ref 추가

  const janusRef = useRef(null);
  const storePluginRef = useRef(null);
  const mystreamRef = useRef(null);

  const opaqueId = "videoroom-test-" + Janus.randomString(12);
  const roomId = roomCode;
  const pin = null;
  const serverUrl = "https://janus.jsflux.co.kr/janus";

  useEffect(() => {
    console.log("roomId : ", roomId);
    console.log("username : ", username);

    // if (!isStarted) return;

    Janus.init({
      debug: "all",
      callback: function () {
        if (!Janus.isWebrtcSupported()) {
          Janus.log("No WebRTC support...");
          return;
        }

        janusRef.current = new Janus({
          server: serverUrl,
          success: function () {
            janusRef.current.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle) {
                storePluginRef.current = pluginHandle;
                console.log(isNew);

                if (isNew) {
                  let createRoom = {
                    request: "create",
                    room: roomId,
                    permanent: false,
                    record: false,
                    publishers: 2,
                    bitrate: 128000,
                    fir_freq: 10,
                    ptype: "publisher",
                    description: `create room : ${roomCode} , ${username}`,
                    is_private: false,
                  };

                  pluginHandle.send({ message: createRoom });
                }

                let register = pin
                  ? {
                      request: "join",
                      room: roomId,
                      ptype: "publisher",
                      display: username,
                      pin: pin,
                    }
                  : {
                      request: "join",
                      room: roomId,
                      ptype: "publisher",
                      display: username,
                    };

                console.log("register : ", register);

                pluginHandle.send({ message: register });
              },
              error: function (error) {
                Janus.error("Error attaching plugin...", error);
              },
              onmessage: function (msg, jsep) {
                console.log("msg : ", msg);

                let event = msg["videoroom"];
                if (event === "joined") {
                  dispatch({
                    type: "JOIN_ROOM",
                    payload: {
                      room: msg["room"],
                      publisherId: msg["id"],
                      display: username,
                      publisherPvtId: msg["private_id"],
                    },
                  });
                  publishOwnFeed(true);

                  if (msg["publishers"].length > 0) {
                    console.log("1");

                    let publisher = msg["publishers"][0]; // 첫 번째 사람만 받음 (1:1이므로)
                    newRemoteFeed(publisher.id, publisher.display);
                  }
                } else if (event === "event" && msg["publishers"]) {
                  let publisher = msg["publishers"][0]; // 첫 번째 사람만 받음
                  newRemoteFeed(publisher.id, publisher.display);
                }  else if (event === "unpublished") {
                  remoteVideoRef.current.srcObject = null; // 상대방이 나갔을 때 비디오 제거
                }

                if (jsep) {
                  storePluginRef.current.handleRemoteJsep({ jsep: jsep });
                }
              },
              onlocalstream: function (stream) {
                mystreamRef.current = stream;
                if (localVideoRef.current) {
                  localVideoRef.current.srcObject = stream;
                }

                if (mainVideoRef.current) {
                  mainVideoRef.current.srcObject = stream;
                }
              },
              oncleanup: function () {
                mystream = null;
              },
            });
          },
          error: function (error) {
            Janus.error(error);
          },
          destroyed: function () {
            // 마지막으로 나갈 때 db에 방 갱신
            if (remoteVideoRef.current === null) {
              const fetchData = async () => {
                try {
                  const data = await fetchExitRtcRoomId(roomId);
                  console.log("data : ", data);
                } catch (error) {
                  console.error("Error fetching RTC room ID:", error);
                }
              };
              fetchData();
              Janus.log("Janus Destroyed!");
            }
          },
        });
      },
    });

    return () => {
      if (janusRef.current) {
        janusRef.current.destroy();
      }
    };
  }, [roomCode]);

  const publishOwnFeed = (start) => {
    if (start) {
      let constraints = { audio: true, video: true };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          mystreamRef.current = stream;

          console.log("publish storePlugin", storePluginRef.current);

          storePluginRef.current.createOffer({
            stream: stream,
            success: function (jsep) {
              let body = {
                request: "configure",
                room: roomId,
                audio: true,
                video: true,
              };
              storePluginRef.current.send({ message: body, jsep: jsep });
            },
            error: function (error) {
              Janus.error("WebRTC error:", error);
            },
          });
        })
        .catch((error) => {
          Janus.error("Error getting user media:", error);
        });
    }
  };

  const newRemoteFeed = (id, display) => {
    janusRef.current.attach({
      plugin: "janus.plugin.videoroom",
      opaqueId: opaqueId,
      success: function (pluginHandle) {
        let remoteFeed = pluginHandle;

        let subscribe = {
          request: "join",
          room: roomId,
          ptype: "subscriber",
          feed: id,
        };

        remoteFeed.send({ message: subscribe });

        remoteFeed.onmessage = function (msg, jsep) {
          if (jsep) {
            remoteFeed.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false },
              success: function (jsep) {
                let body = { request: "start", room: roomId };
                remoteFeed.send({ message: body, jsep: jsep });
              },
              error: function (error) {
                Janus.error("WebRTC error:", error);
              },
            });
          }
        };

        remoteFeed.onremotestream = function (stream) {
          if (remoteVideoRef.current) {
            console.log(
              "상대방 비디오 트랙 수신 → 상대오디오/비디오 상태변경!"
            );
            remoteVideoRef.current.srcObject = stream;
          }
        };

        remoteFeed.oncleanup = function () {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        };
      },
    });
  };

  const videoClick = (videoRef) => {
    setTitle("상대화면");
    if (videoRef.current && mainVideoRef.current) {
      mainVideoRef.current.srcObject = videoRef.current.srcObject;
    }
  };

  const myVideoClick = (videoRef) => {
    setTitle("내화면");
    if (videoRef.current && mainVideoRef.current) {
      mainVideoRef.current.srcObject = videoRef.current.srcObject;
    }
  };

  const toggleVideoHandler = () => {
    console.log("isVideoMuted", storePluginRef.current.isVideoMuted());
    if (!storePluginRef.current) {
      console.error("storePlugin is not initialized yet.");
      return;
    }

    if (storePluginRef.current.isVideoMuted()) {
      console.log("비디오를 켭니다");
      setIsVideoMuted(false);
      storePluginRef.current.unmuteVideo(); // 비디오 켜기
    } else {
      console.log("비디오를 끕니다");
      setIsVideoMuted(true);
      storePluginRef.current.muteVideo(); // 비디오 끄기
    }
  };

  const toggleAudioHandler = () => {
    console.log("isAudioMuted", storePluginRef.current.isAudioMuted());
    if (!storePluginRef.current) {
      console.error("storePlugin is not initialized yet.");
      return;
    }

    if (storePluginRef.current.isAudioMuted()) {
      console.log("오디오를 켭니다");
      setIsAudioMuted(false);
      storePluginRef.current.unmuteAudio(); // 오디오 켜기
    } else {
      console.log("오디오를 끕니다");
      setIsAudioMuted(true);
      storePluginRef.current.muteAudio(); // 오디오 끄기
    }
  };

  return (
    <div>
      {
        <div className={styles.videoContainer}>
          {/*<h3>{title}</h3>*/}
          <div className={styles.mediaContainer}>
            <ToggleVideoButton
              isVideoMuted={isVideoMuted}
              onClick={toggleVideoHandler}
            />
            <ToggleAudioButton
              isAudioMuted={isAudioMuted}
              onClick={toggleAudioHandler}
            />
          </div>
          <VideoView
            ref={mainVideoRef}
            videoType="main"
            isMuted={true}
            className={styles.mainVideo}
          />
          <div className={styles.smallVideoContainer}>
            <VideoView
              ref={localVideoRef}
              videoType="local"
              isMuted={true}
              className={styles.smallVideo}
              onClick={() => myVideoClick(localVideoRef)}
            />
            <VideoView
              ref={remoteVideoRef}
              videoType="remote"
              isMuted={false}
              className={styles.smallVideo}
              onClick={() => videoClick(remoteVideoRef)}
            />
          </div>
          <p>작은화면을 누르면 큰 화면에 크게 보실 수 있어요.</p>
        </div>
      }
    </div>
  );
};

export default JanusWebRTC;
