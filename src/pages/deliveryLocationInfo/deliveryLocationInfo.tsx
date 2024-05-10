import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMoveRequestById,
  updateMoveRequestById,
} from "../../redux/actions/move-request";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import InfoIcon from "@mui/icons-material/Info";
import FloorAlertModal from "../../components/modals/floorAlertModal";
import ProgressBar from "../../components/progressBar/progressBar";
import NavBar from "../../components/navbar/navBar";
import apartmentImage from "../../assets/images/Apartment-only.svg";
import homeOnly from "../../assets/images/Home-only.svg";
import storageOnly from "../../assets/images/Storage-only.svg";

const notSeelectedButtonStyle = {
  width: 130,
  height: 40,
  color: "#5859DF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const selectedButtonStyle = {
  width: 130,
  height: 40,
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const typeSelected = {
  width: 170,
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
  border: "1px solid #6552FF",
};

const typeNotSelected = {
  width: 170,
  color: "#5859DF",
};

const DeliveryLocationInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [locationType, setLocationType] = useState("");
  const [isStairs, setIsStairs] = useState<any>(null);
  const [isElevator, setIsElevator] = useState<any>(null);
  const [isFloorAlertModal, setIsFloorAlertModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [destinationFloor, setDestinationFloor] = useState<any>(null);

  const [formError, setFormError] = useState("");

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

  const navigateToLastLeft = (moveRequest: any) => {
    if (!moveRequest.delivery_details) {
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    } else {
      if (moveRequest.delivery_details?.delivery_addresses?.length === 0) {
        navigate(`/AddressInfo/${moveRequest.canonical_id}`);
      } else {
        if (
          moveRequest.delivery_details?.delivery_addresses[0]
            .delivery_location_type === null
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
              if (moveRequest.items?.length === 0) {
                navigate(`/itemsInfo/${moveRequest.canonical_id}`);
              } else {
                if (
                  moveRequest.delivery_details?.packagaing_required === null
                ) {
                  navigate(`/packages/${moveRequest.canonical_id}`);
                } else {
                  navigate(`/move-summary/${moveRequest.canonical_id}`);
                }
              }
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchMoveRequestById(moveRequestId);
    setIsFloorAlertModal(true);
  }, []);

  return (
    <>
      <NavBar moveRequestId={moveRequestId} />
      <Grid container>
        {isFloorAlertModal && (
          <FloorAlertModal
            isFloorAlertModal={isFloorAlertModal}
            setIsFloorAlertModal={setIsFloorAlertModal}
          />
        )}
        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          <ProgressBar value={40} />

          <Typography fontSize="16px" fontWeight={700} color={"#262626"} mt={3}>
            Please select your location type!
          </Typography>
          <Stack
            direction={"row"}
            padding={1}
            gap={1}
            justifyContent={"center"}
            display={"flex"}
            flexWrap={"wrap"}
          >
            <Button
              onClick={() => setLocationType("Home")}
              sx={locationType === "Home" ? typeSelected : typeNotSelected}
            >
              <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                <img
                  style={{ borderRadius: 15 }}
                  width={160}
                  src={homeOnly}
                  alt=""
                />

                <Typography fontWeight={600} fontSize={12}>
                  Home
                </Typography>
              </Stack>
            </Button>

            <Button
              onClick={() => setLocationType("Apartment")}
              sx={locationType === "Apartment" ? typeSelected : typeNotSelected}
            >
              <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                <img
                  style={{ borderRadius: 15 }}
                  width={160}
                  src={apartmentImage}
                  alt=""
                />

                <Typography fontWeight={600} fontSize={12}>
                  Apartment
                </Typography>
              </Stack>
            </Button>

            <Button
              onClick={() => setLocationType("Storage")}
              sx={locationType === "Storage" ? typeSelected : typeNotSelected}
            >
              <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                <img
                  style={{ borderRadius: 15 }}
                  width={160}
                  src={storageOnly}
                  alt=""
                />

                <Typography fontWeight={600} fontSize={12}>
                  Storage
                </Typography>
              </Stack>
            </Button>
          </Stack>

          {locationType !== "Home" && locationType !== "" ? (
            <>
              <Stack mt={2} alignItems={"center"} direction={"row"}>
                <Typography
                  alignItems={"center"}
                  mt={2}
                  fontSize="14px"
                  fontWeight={600}
                  color={"#797979"}
                >
                  ARE STAIRS OR AN ELEVATOR NEEDED?
                </Typography>
                <Box
                  sx={{ paddingTop: 2 }}
                  alignItems={"center"}
                  alignSelf={"center"}
                >
                  <Button
                    onClick={() => {
                      setIsFloorAlertModal(true);
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
              <Stack
                direction="row"
                mt={2}
                spacing={2}
                justifyContent={"center"}
              >
                <Button
                  size="large"
                  sx={
                    isElevator === "stairs"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setIsElevator("stairs");
                    setIsStairs(true);
                    setDestinationFloor(null);
                  }}
                >
                  Stairs
                </Button>
                <Button
                  size="large"
                  sx={
                    isElevator === "elevator"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setIsElevator("elevator");
                    setIsStairs(false);
                    setDestinationFloor(null);
                  }}
                >
                  Elevator
                </Button>

                <Button
                  sx={
                    isElevator === "not-applicable"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setIsElevator("not-applicable");
                    setIsStairs(false);
                    setDestinationFloor(0);
                  }}
                >
                  Not Applicable
                </Button>
              </Stack>

              {isElevator !== "not-applicable" && (
                <>
                  <Typography
                    mt={2}
                    fontSize="14px"
                    fontWeight={600}
                    color={"#797979"}
                  >
                    What floor are you on?
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    placeholder={""}
                    value={destinationFloor || ""}
                    size="small"
                    onChange={(event) =>
                      setDestinationFloor(parseInt(event.target.value) || 0)
                    }
                    inputProps={{
                      maxLength: 2,
                      style: {
                        background: "#5A7BFC14",
                        borderRadius: "8px",
                      },
                    }}
                    sx={{
                      marginTop: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#5A7BFC59",
                          borderWidth: "1.43",
                          borderRadius: "8px",
                        },
                      },
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <></>
          )}

          <Box p={3}>
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>
          <Stack direction="row" mt={3} spacing={2} justifyContent={"center"}>
            <Button
              onClick={() => {
                if (locationType !== "") {
                  if (locationType === "Home") {
                    setFormError("");
                    updateThisMoveRequest({
                      delivery_details: {
                        delivery_addresses: [
                          {
                            delivery_location_type: "Home",
                            stiars_present: null,
                            is_elevator_accessible: null,
                            no_of_flights: 0,
                            floor_no: 0,
                          },
                        ],
                      },
                    });
                  } else if (
                    locationType === "Apartment" ||
                    locationType === "Storage"
                  ) {
                    if (isElevator !== null && isStairs !== null) {
                      if (destinationFloor !== null) {
                        setFormError("");
                        updateThisMoveRequest({
                          delivery_details: {
                            delivery_addresses: [
                              {
                                delivery_location_type: locationType,
                                stiars_present: isStairs,
                                is_elevator_accessible:
                                  isElevator === "elevator" ? true : false,
                                no_of_flights: 0,
                                floor_no: destinationFloor,
                              },
                            ],
                          },
                        });
                      } else {
                        setFormError("Please enter floor number.");
                      }
                    } else {
                      setFormError("Please select if Elevator or Stairs would be needed.");
                    }
                  }
                } else {
                  setFormError("Please select a location type.");
                }
              }}
              size="medium"
              sx={{
                width: 130,
                height: 50,
                backgroundColor: "#5858E0 !important",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 550,
                border: "1px solid #6552FF",
              }}
            >
              Save and Proceed
            </Button>
          </Stack>
        </Grid>
      </Grid>

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
    </>
  );
};

export default DeliveryLocationInfo;
