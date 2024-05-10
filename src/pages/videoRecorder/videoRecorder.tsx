import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMoveRequestById } from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";

const mimeTypes = [
  // "video/webm; codecs=vp9",
  // "video/webm; codecs=vp8",
  // "video/webm",
  "video/mp4",
];

const VideoRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const tokenValue = new URLSearchParams(window.location.search).get(
    "tokenvalue"
  );

  const handleUpload = async (file:any) => {
    // const fileInput = document.getElementById('videoFile') as HTMLInputElement;
    // const file = fileInput.files && fileInput.files[0];
    // if (!file) {
    // alert('Please select a video file.');
    // return;
    // }
    const url = 'http://54.226.226.123/upload/video';
    const formData = new FormData();
    formData.append('video', file);
    try {
    const response = await Promise.race([
    axios({
    method: 'post',
    url: url,
    data: formData,
    headers: {
    'Content-Type': 'multipart/form-data',
    },
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 600000)) // Timeout after 10 minutes
    ]);
    console.log(response, '-RESPONSE->>>');
    alert('Video uploaded successfully.');
    } catch (error) {
    console.error('Error uploading video:', error);
    alert('Failed to upload video.');
    }
    };
  const getInventoryFromVideo = async (file: any) => {
    console.log("fileeee======",file)


    var formdata = new FormData();
    formdata.append("video", file, "file.mp4");

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };

    fetch("http://54.226.226.123/upload/video", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    // const url = "http://54.226.226.123/upload/video";
    // const formData = new FormData();
    // formData.append("video", file);
    // console.log(file, "><><");
    // try {
    //   const response = await axios({
    //     method: "post",
    //     url: url,
    //     data: formData,
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   console.log(response.data, "-RESPONSE->>>");
    //   // Handle the response as needed
    // } catch (error) {
    //   console.error(error);
    //   // Handle the error as needed
    // }
  };
  const [durationLimit, setDurationLimit] = useState(5); // 10 seconds
  const [numberofRooms, setNumberOfRooms] = useState(0);
  const navigate = useNavigate();
  const { moveRequestId } = useParams();
  useEffect(() => {
    if (tokenValue) {
      console.log(tokenValue, "---");
      localStorage.setItem("jwtToken", tokenValue);
      console.log("added");
      const thisToken = localStorage.getItem("jwtToken");
      if (thisToken) {
        const urlWithoutToken =
          window.location.pathname +
          window.location.search
            .split("&")
            .filter((param) => !param.includes("tokenvalue"))
            .join("&");
        window.history.replaceState(null, "", urlWithoutToken);
      }
    }
  }, [tokenValue]);
  const [mediaBlobUrls, setMediaBlobUrls] = useState<string[]>([]);
  const [thisBlob, setThisBlob] = useState<any>(null);

  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState<any>(0);
  const [moveRequest, setMoveRequest] = useState<any>(null);
  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (moveRequestId) {
      fetchMoveRequestById(moveRequestId);
    }
  }, [moveRequestId]);
  const [showCamera, setShowCamera] = useState(true);

  useEffect(() => {
    console.log(moveRequest, "------->>>>");
  }, [moveRequest]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "stopped"
  >("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  // let mediaRecorder: MediaRecorder | null = null;
  // let recordedChunks: BlobPart[] = [];
  const [videoBlobs, setVideoBlobs] = useState<any>([]);
  const [finalVideoBlobs, setFinalVideoBlobs] = useState<any>([]);
  const [finalMediaBlobUrls, setFinalMediaBlobUrls] = useState<string[]>([]);

  const startRecording = () => {
    setSelectedIndex(selectedIndex + 1);
    console.log("start recording");

    if (videoRef.current && videoRef.current.srcObject) {
      let options = {};

      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          options = { mimeType };
          console.log(`Using MIME type: ${mimeType}`);
          break;
        }
      }

      options = {
        ...options,
        videoBitsPerSecond: 2500000, // Adjust as needed
        // audioBitsPerSecond: 128000, // Adjust as needed
      };

      mediaRecorderRef.current = new MediaRecorder(
        videoRef.current.srcObject as MediaStream,
        options
      );
      console.log(
        "MediaRecorder initialized, state: ",
        mediaRecorderRef.current.state
      );

      mediaRecorderRef.current.onerror = (event: Event) => {
        console.error("MediaRecorder Error: ", (event as any).error);
      };

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // mediaRecorderRef.current.onstop = () => {
      //   const blob = new Blob(recordedChunksRef.current, {
      //     type: "video/mp4",
      //   });
      //   const url = URL.createObjectURL(blob);
      //   setMediaBlobUrl(url);
      //   setRecordingStatus("stopped");
      //   recordedChunksRef.current = []; // Clear the recorded chunks
      // };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/mp4",
        });
        setVideoBlobs([...videoBlobs, blob])
        const url = URL.createObjectURL(blob);
        setMediaBlobUrls([...mediaBlobUrls, url]);
        setRecordingStatus("stopped");
        recordedChunksRef.current = []; // Clear the recorded chunks
      };

      mediaRecorderRef.current.start();
      console.log(
        "MediaRecorder started, state: ",
        mediaRecorderRef.current.state
      );
      setRecordingStatus("recording");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      if (recordingStatus === "recording") {
        stopRecording();
      }
    }, durationLimit * 1000); // Convert seconds to milliseconds
  }, [recordingStatus]);

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      // mediaRecorderRef.current.onstop = () => {
      //   const blob = new Blob(recordedChunksRef.current, {
      //     type: "video/mp4",
      //   });
      //   const url = URL.createObjectURL(blob);
      //   setMediaBlobUrl(url);
      //   setRecordingStatus("stopped");

      //   // downloadVideo(url); // Call the download function here

      //   recordedChunksRef.current = []; // Clear the recorded chunks
      // };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/mp4",
        });
        setThisBlob(blob);
        setVideoBlobs((prevBlob: any) => [...prevBlob, blob]);
        console.log(typeof blob, "--------");
        const url = URL.createObjectURL(blob);
        setMediaBlobUrl(url)
        setMediaBlobUrls([...mediaBlobUrls, url]);
        setRecordingStatus("stopped");
        recordedChunksRef.current = []; // Clear the recorded chunks
      };
      mediaRecorderRef.current.stop();
    }
    setShowCamera(false);
  };
  useEffect(() => {
    console.log(videoBlobs, ">>>>>");
  }, [videoBlobs]);

  const downloadVideo = (url: any) => {
    if (url) {
      console.log("Downloading video from URL:", url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded-video.mp4"; // You can choose any file name
      document.body.appendChild(a); // Append the anchor to the document
      a.click(); // Trigger a click on the element to open the download dialog
      document.body.removeChild(a); // Remove the anchor from the document
    }
  };

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream; // Set the stream to the video element
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setErrorMessage(
          "Error accessing media devices. Please check permissions."
        );
      }
    };

    getMedia();
  }, []);

  useEffect(() => {
    console.log("mediaRecorder", recordingStatus);
  }, [recordingStatus]);

  const handleConfirm = () => {
    console.log(selectedIndex-1,'---')
    console.log(mediaBlobUrls[selectedIndex-1])
    setFinalVideoBlobs((prevBlobs:any)=> [...prevBlobs, videoBlobs[selectedIndex-1]])
    setFinalMediaBlobUrls((prevUrls)=> [...prevUrls, mediaBlobUrls[selectedIndex-1]])
    setNumberOfRooms(numberofRooms + 1);
    setShowCamera(true);
  }
  const handleRetake = () => {
    setVideoBlobs(videoBlobs.filter((url:any, index:any)=>index!==selectedIndex-1))
    setMediaBlobUrls(mediaBlobUrls.filter((url:any, index:any)=>index!==selectedIndex-1))
    setSelectedIndex(selectedIndex-1)
    setNumberOfRooms(numberofRooms-1)
    setShowCamera(true)
  }
  useEffect(()=>{
    console.log(mediaBlobUrls,'>')
      },[mediaBlobUrls])
  useEffect(()=>{
console.log(finalMediaBlobUrls,'FINAL URLS')
  },[finalMediaBlobUrls])

  useEffect(()=>{
    console.log(videoBlobs,'>>VIDEO BLOBS>>')
      },[videoBlobs])
      useEffect(()=>{
        console.log(finalVideoBlobs,'>>FINAL VIDEO BLOBS>>')
          },[finalVideoBlobs])
  return (
    <>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        // justify="center"
      >
        <Grid item xs={12} md={5}>
          <Typography textAlign={"center"} variant="h6">
            {recordingStatus === "idle"
              ? "Click on the button below to start recording"
              : ""}
          </Typography>
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          {numberofRooms !== moveRequest?.number_of_rooms && (
            <Stack>
              <Box sx={{ border: "2px solid #5858E0" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: "100%" }}
                />
              </Box>

              <Stack
                mt={2}
                justifyContent={"center"}
                alignItems={"center"}
                direction={"row"}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    startRecording();
                  }}
                  disabled={recordingStatus === "recording"}
                >
                  Start Recording
                </Button>
                {/* <Button
              variant="contained"
              color="error"
              onClick={stopRecording}
              style={{ marginLeft: 8 }}
              disabled={recordingStatus !== "recording"}
            >
              Stop Recording
            </Button> */}
                <Button onClick={() => downloadVideo(mediaBlobUrl)}>
                  Download Video
                </Button>
                <Button
                  onClick={() => {
                    if (moveRequest) {
                      // navigate(`/AddressInfo/${moveRequest.id}`);
                      // console.log(mediaBlobUrls)
                      // getInventoryFromVideo(thisBlob);
                      handleUpload(thisBlob)
                    }
                  }}
                >
                  NEXT
                </Button>
              </Stack>
            </Stack>
          )}
          {/* {mediaBlobUrl && (
            <Box>
              <video
                src={mediaBlobUrl || ""}
                controls
                autoPlay
                loop
                style={{ width: "100%" }}
              />
            </Box>
          )} */}
          {!showCamera&&mediaBlobUrls.length!==0&&mediaBlobUrls.map((url: any, index: any) => {
            if(index===selectedIndex-1){

              return (
                <Box key={index}>
                  <video
                    src={url}
                    controls
                    autoPlay
                    loop
                    style={{ width: "100%", border: "2px solid #5858E0" }}
                    />
                  <Typography
                    sx={{ textDecoration: "underline" }}
                    textAlign={"center"}
                    fontWeight={600}
                    >
                    VIDEO FOR ROOM: {index + 1}
                  </Typography>
                </Box>
              );
            }
            
          })}

          {/* {numberofRooms !== 0 && mediaBlobUrls.length === numberofRooms && (
            <Typography textAlign={"center"} fontWeight={600}>
              You have captured video for {numberofRooms} room(s).
            </Typography>
          )} */}
          {!showCamera&&(
            <Stack mt={5} alignItems={'center'} alignSelf={'cetner'}>
            <Typography color={'#667085'} fontWeight={500} textAlign={'center'}>
            CAPTURE NEXT VIDEO?
            </Typography>
            <Stack spacing={2} direction={'row'}>

          <Button onClick={()=>{
            handleConfirm()
          }} sx={{alignSelf:'center'}} variant="contained">
            CONFIRM
          </Button>
          <Button onClick={()=>{
            handleRetake();
          }} sx={{alignSelf:'center'}} variant="contained">
            RETAKE
          </Button>
            </Stack>
          </Stack>
            )}
          {numberofRooms === moveRequest?.number_of_rooms &&
            mediaBlobUrls.length === numberofRooms && (
              <Stack alignItems={'center'} alignSelf={'center'}>

              <Typography textAlign={"center"} fontWeight={600}>
                You have captured video for all rooms. Click NEXT to proceed.
              </Typography>
              <Button variant="contained">NEXT</Button>
              </Stack>
            )}
        </Grid>
      </Grid>
    </>
  );
};

export default VideoRecorder;
