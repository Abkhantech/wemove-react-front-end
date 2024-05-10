import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import {
  getMoveRequestById,
  updateMoveRequestById,
} from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import FrontDoorAlertModal from "../../components/modals/frontDoorAlertModal";
import ProgressBar from "../../components/progressBar/progressBar";
import NavBar from "../../components/navbar/navBar";

const baseButtonStyle = {
  width: 130,
  height: 40,
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const selectedButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
};

const notSelectedButtonStyle = {
  ...baseButtonStyle,
  color: "#5859DF",
};

const colorBadge = {
  marginTop: 2,
  fontSize: 10,
  fontWeight: 800,
  backgroundColor: "#08123B",
  color: "#FFFFFF",
  width: "50px",
  height: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "2px",
};

const BUTTON_TITLES = ["UNSURE", "YES", "NO"];

const TruckInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [isFrontDoorAlertModalVisible, setIsFrontDoorAlertModalVisible] =
    useState(false);
  const [shuttleButton, setShuttleButton] = useState("UNSURE");
  const [selectedButton, setSelectedButton] = useState("UNSURE");
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleButtonClick = (value: any) => {
    setSelectedButton(value);
  };

  const handleShuttleButtonClick = (value: any) => {
    setShuttleButton(value);
  };

  const navigateToLastLeft = (moveRequest: any) => {
    console.log(moveRequest.canonical_id);
    navigate(`/itemsInfo/${moveRequest.canonical_id}`);
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setThisMoveRequestId(thisMoveRequest.id);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const updateThisMoveRequest = (body: any) => {
    setIsPageLoading(true);
    const params = {
      id: thisMoveRequestId,
      ...body,
    };
    dispatch<any>(updateMoveRequestById(params))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setTimeout(() => {
          setIsPageLoading(false);
          navigateToLastLeft(thisMoveRequest);
        }, 1300);
      })
      .catch((err: any) => {
        console.log(err);
        setTimeout(() => {
          setIsPageLoading(false);
        }, 1300);
      });
  };

  useEffect(() => {
    fetchMoveRequestById(moveRequestId);
  }, []);

  useEffect(() => {
    if (selectedButton === "NO" || shuttleButton === "NO") {
      setIsFrontDoorAlertModalVisible(true);
    }
  }, [selectedButton, shuttleButton]);

  return (
    <>
      <NavBar moveRequestId={moveRequestId} />
      <Grid container>
        {isFrontDoorAlertModalVisible && (
          <FrontDoorAlertModal
            isFrontDoorAlertModalVisible={isFrontDoorAlertModalVisible}
            setIsFrontDoorAlertModalVisible={setIsFrontDoorAlertModalVisible}
          />
        )}

        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          <ProgressBar value={70} />
          <Stack mt={2} alignItems={"center"} direction={"row"}>
            <Typography mt={2} fontSize={18} fontWeight={700} color={"#262626"}>
              Location Information
            </Typography>
            <Box
              sx={{ paddingTop: 2 }}
              alignItems={"center"}
              alignSelf={"center"}
            >
              <Button
                onClick={() => {
                  setIsFrontDoorAlertModalVisible(true);
                }}
              >
                <InfoIcon
                  sx={{
                    color: "#5859DF",
                    fontSize: 30,
                    "&:hover": {
                      color: "#000000",
                      fontSize: 30,
                    },
                  }}
                />
              </Button>
            </Box>
          </Stack>

          {selectedButton === "UNSURE" && (
            <>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                Additional fee may be applied
                <br /> based on the following
              </Typography>

              <Typography sx={colorBadge}>01</Typography>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                Can we get a large truck in front of your location?
              </Typography>
            </>
          )}

          {selectedButton === "YES" && (
            <>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                Additional fee may be applied
                <br /> based on the following
              </Typography>

              <Typography sx={colorBadge}>01</Typography>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                Can we get a large truck in front of your location?
              </Typography>
            </>
          )}

          {selectedButton === "NO" && (
            <>
              <Typography sx={colorBadge}>01</Typography>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                Since you clicked no
              </Typography>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                If the delivery driver is unable to get in front of your
                delivery destination, there may be an additional charge for a
                long carry (75 feet or more away)
              </Typography>
            </>
          )}

          <Stack direction="row" mt={2} spacing={2} justifyContent={"center"}>
            {BUTTON_TITLES.map((value) => (
              <Button
                key={value}
                size="large"
                sx={
                  selectedButton === value
                    ? selectedButtonStyle
                    : notSelectedButtonStyle
                }
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Stack>

          {/* {shuttleButton === "UNSURE" && (
            <>
              <Typography sx={colorBadge}>02</Typography>
              <Typography mt={2} fontSize={16} color="#667085">
                Does the carrier need to hire a shuttle?
              </Typography>
            </>
          )}

          {shuttleButton === "YES" && (
            <>
              <Typography sx={colorBadge}>02</Typography>
              <Typography mt={2} fontSize={16} color="#667085">
                Does the carrier need to hire a shuttle?
              </Typography>
            </>
          )}

          {shuttleButton === "NO" && (
            <>
              <Typography sx={colorBadge}>02</Typography>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                Since you clicked no
              </Typography>
              <Typography mt={2} fontSize={16} color={"#667085"}>
                If the delivery driver needs to hire a shuttle to get down
                certain roads, access points, etc. there will be an additional
                fee at $1 per cubic foot based on your moving quote cubic
                footage.
              </Typography>
            </>
          )}

          <Stack direction="row" mt={2} spacing={2} justifyContent={"center"}>
            {BUTTON_TITLES.map((value) => (
              <Button
                key={value}
                size="large"
                sx={
                  shuttleButton === value
                    ? selectedButtonStyle
                    : notSelectedButtonStyle
                }
                onClick={() => handleShuttleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Stack> */}

          <Box
            sx={{
              p: 2,
              mt: 5,
              backgroundColor: "#5A7BFC14",
              border: "1.40px solid #5A7BFC59",
              borderRadius: "8px",
            }}
          >
            <Typography fontSize={16} color={"#667085"}>
              <b>Note- </b>these charges will be applied by the carrier and not
              the marketplace
            </Typography>
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            <Button
              onClick={() => {
                updateThisMoveRequest({
                  delivery_details: {
                    open_location:
                      selectedButton === "YES"
                        ? 'YES'
                        : selectedButton === "NO"
                        ? 'NO'
                        : 'NULL',
                    shuttle_required:
                    selectedButton === "YES"
                        ? 'YES'
                        : selectedButton === "NO"
                        ? 'NO'
                        : 'NULL',
                  },
                });
              }}
              variant="contained"
              size="large"
              sx={{
                marginTop: 6,
                width: isMobile ? "100%" : "70%",
                height: 50,
                backgroundColor: "#5858E0",
                color: "#FFFFFF",
                borderColor: "#6552FF",
                fontSize: 12,
                fontWeight: 550,
              }}
            >
              Save & Proceed
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
      </Grid>
    </>
  );
};

export default TruckInfo;
