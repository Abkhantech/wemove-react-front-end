import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMoveRequestById } from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import WeMoveHeader from "../../components/header/weMoveHeader";
import Backdrop from "@mui/material/Backdrop";
import AddIcon from "@mui/icons-material/Add";
import * as AWS from "aws-sdk";
import { fetchInventoryFromVideo } from "../../redux/actions/room-details";

const awsS3Bucket: string = process.env.REACT_APP_AWS_S3_BUCKET || "";
const awsAccessKey = process.env.REACT_APP_AWS_S3_ACCESS_KEY;
const awsSecretKey = process.env.REACT_APP_AWS_S3_KEY_SECRET;

const s3 = new AWS.S3({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});

const inventoryArray = [
  {
    object_type_name: "chair",
    predicted_dimensions: [5.88, 6.2257, 3.5],
    count: 3,
  },
  {
    object_type_name: "frame",
    predicted_dimensions: [0.25, 2.0, 0.05],
    count: 2,
  },
  {
    object_type_name: "carpet",
    predicted_dimensions: [6.0, 8.0, 2.0],
    count: 1,
  },
  {
    object_type_name: "lamp",
    predicted_dimensions: [0.8474, 1.9967, 1.1997],
    count: 1,
  },
  {
    object_type_name: "sofa",
    predicted_dimensions: [5.97477064201835, 6.0848, 4.847],
    count: 3,
  },
  {
    object_type_name: "cushion",
    predicted_dimensions: [
      2.579524421411253, 2.022740462127213, 2.648165217409983,
    ],
    count: 1,
  },
  {
    object_type_name: "table",
    predicted_dimensions: [6.5848, 8.5, 2.415829695],
    count: 1,
  },
];

const UploadInventory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [moveRequest, setMoveRequest] = useState<any>(null);
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [totalVideos, setTotalVideos] = useState<any>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [vidCount, setVidCount] = useState(0);
  const [videoTitlesArray, setVideoTItlesArray] = useState([""]);

  const [nextState, setNextState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const tokenValue = new URLSearchParams(window.location.search).get(
    "tokenvalue"
  );

  const uploadFile = async (file: any, fileName: any) => {
    const formData = new FormData();
    formData.append("file", file);
    return await s3_upload(formData, fileName, file.name);
  };

  const s3_upload = async (
    formData: any,
    fileName: any,
    originalName: string
  ) => {
    // const contentType = getContentType(originalName);
    const uploadParams = {
      Bucket: awsS3Bucket,
      Key: fileName,
      Body: formData.get("file"),
      ContentType: "video/mp4",
    };
    return new Promise((resolve, reject) => {
      s3.upload(uploadParams, (err: any, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  const getContentType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "mov":
        return "video/quicktime";
      case "mp4":
        return "video/mp4";
      // Add more cases for other video types if needed
      default:
        return "video/mp4"; // Default content type for unknown extensions
    }
  };

  const retrieveFormDataAndSaveToS3 = async (
    file: any,
    fileName: string,
    videoTitle: string
  ) => {
    setIsLoading(true);
    setLoadingMessage(`Uploading Video...`);

    const responseObject: any = await uploadFile(file, fileName);
    setLoadingMessage(`Fetching inventory...`);

    if (responseObject.Location) {
      const body = {
        moveRequestId: thisMoveRequestId,
        video_url: responseObject.Location,
        title: videoTitle,
      };

      dispatch<any>(fetchInventoryFromVideo(body))
        .then(unwrapResult)
        .then((res: any) => {
          setVideoCount((videoCounter) => videoCounter + 1);
        })
        .catch((err: any) => {
          console.log(err);
          setIsLoading(false);
          setLoadingMessage("");
        });
    }
  };

  const handleTitleChange = (title: string, index: any) => {
    const newTitles = [...videoTitlesArray];
    newTitles[index] = title;
    setVideoTItlesArray(newTitles);
  };

  const handleAddMore = () => {
    const allFilled = totalVideos.every((video: any) => video.name);
    if (allFilled) {
      setTotalVideos([...totalVideos, {}]);
    } else {
      console.warn("Please fill all previous video fields before adding more.");
    }
  };

  const handleFileChange = (event: any, index: any) => {
    setNextState(false)
    const newSelectedFiles = [...totalVideos];
    let count = index + 1;
    newSelectedFiles[index] = event.target.files[0];
    setTotalVideos(newSelectedFiles);
  };

  const countTotalVideos = () => {
    totalVideos.map((video: any) => {
      if (video.type) {
        setVidCount((count) => count + 1);
      }
    });
  };

  const handleUploadVideos = () => {
    totalVideos.map((video: any, index: any) => {
      if (video.type) {
        setNextState(true);
        let count = index + 1;
        retrieveFormDataAndSaveToS3(
          video,
          "room-videos/" +
            moveRequest.canonical_id.toString() +
            `/video-index${count.toString()}x`,
          videoTitlesArray[index]
        );
      }
    });
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
        setThisMoveRequestId(thisMoveRequest.id);
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

  useEffect(() => {
    if (tokenValue) {
      localStorage.setItem("jwtToken", tokenValue);
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
  const navigateToLastLeft = (moveRequest: any) => {
    if (!moveRequest.delivery_details) {
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    } else {
      if (moveRequest.delivery_details?.delivery_addresses?.length === 0) {
        navigate(`/AddressInfo/${moveRequest.canonical_id}`);
      } else {
        if (
          moveRequest.delivery_details?.delivery_addresses[0].stiars_present ===
            null ||
          moveRequest.delivery_details?.delivery_addresses[0]
            .is_elevator_accessible === null
        ) {
          navigate(`/DeliveryLocationInfo/${moveRequest.canonical_id}`);
        } else {
          if (
            moveRequest.pickup_date_from === null &&
            moveRequest.pickup_date_to === null
          ) {
            navigate(`/PickupDate/${moveRequest.canonical_id}`);
          } else {
            if (moveRequest.delivery_details.open_location === null) {
              navigate(`/TruckInfo/${moveRequest.canonical_id}`);
            } else {
              navigate(`/itemsInfo/${moveRequest.canonical_id}`); 
          }
         }
        }
      }
    }
  };

  useEffect(() => {
    if (videoCount === vidCount && videoCount !== 0 && moveRequest?.roomDetails?.length===0) {
      setIsLoading(false);
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    }else{
      if(videoCount === vidCount && videoCount !== 0&& moveRequest?.roomDetails?.length!==0){
      navigateToLastLeft(moveRequest)
      // navigate(`/itemsInfo/${moveRequest.canonical_id}`)
      }
    }
  }, [videoCount]);

  return (
    <>
      <WeMoveHeader />
      <Grid container p={1}>
        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          {isLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={() => {
                setIsLoading(true);
              }}
            >
              <Box sx={{ width: "50%" }}>
                <LinearProgress />
                <Typography
                  fontSize={16}
                  fontWeight={500}
                  textAlign="center"
                  mt={1}
                >
                  {loadingMessage ? loadingMessage : ""}
                </Typography>
              </Box>
            </Backdrop>
          )}

          <Typography
            fontSize={18}
            fontWeight={700}
            lineHeight={1.2}
            textAlign="center"
          >
            Upload Videos
          </Typography>

          {totalVideos.length > 0 &&
            totalVideos.map((stop: any, index: any) => (
              <Stack
                key={index}
                alignItems={"center"}
                direction={"row"}
                mt={3}
                justifyContent={"space-between"}
              >
                <Typography fontSize={14}>Video {index + 1}</Typography>
                <input
                  accept="video/*"
                  capture="environment"
                  id={`video-upload-${index}`}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(event) => handleFileChange(event, index)}
                />

                <TextField
                  variant="outlined"
                  type="text"
                  label="Room Name"
                  sx={{ width: 180 }}
                  size="small"
                  value={videoTitlesArray[index] || ""}
                  onChange={(e) => {
                    handleTitleChange(e.target.value, index);
                  }}
                />

                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <label htmlFor={`video-upload-${index}`}>
                    <Button variant="contained" component="span">
                      Select Video
                    </Button>
                  </label>

                  <Typography fontSize={14}>
                    {totalVideos[index]
                      ? totalVideos[index].name
                      : "No video selected"}
                  </Typography>
                </Stack>
              </Stack>
            ))}

          <Stack mt={3} alignItems={"center"} spacing={1}>
            {totalVideos.length === 0 && (
              <Typography>
                No video fields yet. Click "Add" to begin.
              </Typography>
            )}

            <Button
              size="medium"
              onClick={handleAddMore}
              sx={{
                width: 90,
                color: "#5858E0",
                border: "1px solid #5858E0",
                whiteSpace: "nowrap",
                fontSize: 12,
              }}
            >
              <Stack alignItems="center">
                <AddIcon fontSize="small" />
                Add Field
              </Stack>
            </Button>
          </Stack>

          <Stack spacing={2} mt={2} justifyContent={"center"}>
            {!nextState && (
              <Button
                variant="contained"
                onClick={() => {
                  countTotalVideos();
                  handleUploadVideos();
                }}
              >
                Confirm
              </Button>
            )}
            {nextState && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/AddressInfo/${moveRequest.canonical_id}`);
                }}
              >
                Next
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default UploadInventory;
