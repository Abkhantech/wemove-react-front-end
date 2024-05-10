import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMoveRequestById } from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";

const colorBadge = {
  marginTop: 2,
  fontSize: 14,
  fontWeight: 800,
  backgroundColor: "#08123B",
  color: "#FFFFFF",
  width: "80px",
  height: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
};

const VideoGuidelines = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [jwtToken, setJwtToken] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setThisMoveRequestId(thisMoveRequest.canonical_id);
        const token = localStorage.getItem("jwtToken");
        setJwtToken(token || "");
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
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1300);
  }, []);

  // const prodURL = `https://production.wemoveai.com/video-recorder/${thisMoveRequestId}?tokenvalue=${jwtToken}`;
  const stagingURL = `https://staging.wemoveai.com/upload-inventory/${thisMoveRequestId}?tokenvalue=${jwtToken}`;
  // const localURL = `http://localhost:3000/video-recorder/${thisMoveRequestId}?tokenvalue=${jwtToken}`;
  return (
    <>
      <Grid
        container
        sx={{
          padding: isMobile ? 2 : 5,
        }}
      >
        <Grid item xs={12}>
          <Typography fontSize={18} fontWeight={800}>
            Congratulations
          </Typography>

          <Typography fontSize={16}>
            You have made it to the video process. The next steps are super
            easy.
          </Typography>
          <Typography sx={colorBadge}>Step 1</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontSize={16} marginTop={2}>
            Scan QR or click below Permission link on your phone to continue
          </Typography>

          <Typography fontSize={14} marginTop={1} color={"#797979"}>
            If you are on a computer, grab your smart phone, open your camera
            app, and scan your secure QR code below. If you are on your phone
            already, simply click the permission link below.
          </Typography>

          <Box marginTop={2}>
            <QRCode size={120} value={stagingURL} viewBox={`0 0 256 256`} />
          </Box>

          <Typography sx={colorBadge}>Step 2</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontSize={14} marginTop={2}>
            Based on the address provided, please follow the prompts room by
            room. Walk through each room and go a slow to moderately slow speed.{" "}
          </Typography>

          <Typography fontSize={14} marginTop={1} color={"#797979"}>
            You will have the opportunity at the end to ADD or REMOVE any items
            that aren't present.
          </Typography>

          <Typography sx={colorBadge}>Step 3</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontSize={14} marginTop={2}>
            Once the room is complete, simply hit the complete button and follow
            the prompts. If it asks you about a hallway just follow it down
          </Typography>

          <Typography sx={colorBadge}>Step 4</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontSize={14} marginTop={2}>
            Once you have completed the entire walkthrough, you will be
            presented with your price.
          </Typography>

          <Typography sx={colorBadge}>Step 5</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontSize={14} marginTop={2}>
            Choose a carrier based on those that are presented.
          </Typography>

          <Typography sx={colorBadge}>Step 6</Typography>

          <Typography fontSize={16} marginTop={2}>
            And get ready for your move
          </Typography>
        </Grid>

        <Box mt={2} marginLeft={"auto"}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              navigate(
                `/upload-inventory/${thisMoveRequestId}?tokenvalue=${jwtToken}`
              );
            }}
            sx={{
              background: "#5858E0",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            Give permission & Continue
          </Button>
        </Box>
        {isPageLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isPageLoading}
            onClick={() => {
              setIsPageLoading(true);
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Grid>
    </>
  );
};

export default VideoGuidelines;
