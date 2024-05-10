import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useState } from "react";
import {
  Alert,
  Grid,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

const notSeelectedButtonStyle = {
  width: 130,
  height: 40,
  backgroundColor: "#F2F2F4 !important",
  color: "#262626",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #0000001A",
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
const PLACES_API_KEY = `AIzaSyAk8hBHGztX6M9UX2MdZlRQS3HbdqINzp8`;

const ApartmentOnlyModal = ({
  isApartmenOnlyModal,
  setIsApartmenOnlyModal,
  createMoveRequest,
  thisMoveRequest,
  isLoading,
  setIsLoading,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [destinationFloor, setDestinationFloor] = useState("");
  const [isElevator, setIsElevator] = useState("walkup");
  // const [isElevatorAccess, setIsElevatorAccess] = useState(false);
  // const [elevatorType, setElevatorType] = useState("freight");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");

  const handleClose = () => setIsApartmenOnlyModal(true);

  const handleInputNumber = (event: any, setNumber: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 3;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setNumber(inputValue);
    event.target.value = inputValue;
  };

  const navigateToLocationInfo = async () => {
    if (address !== "") {
      setFormError("");
      await createMoveRequest({
        id: thisMoveRequest.id,
        apartment: {
          floor_no:
            isElevator === "not-applicable" ? 0 : Number(destinationFloor),
          is_elevator_available: isElevator === "elevator" ? true : false,
          is_elevator_accessible: false,
          elevator_type: "regular",
          apt_address: address,
        },
      });
    } else {
      setFormError("Please fill in the required info.");
    }
  };

  const fetchZipCodeForAddress = async (add: string) => {
    const apiKey = "AIzaSyAk8hBHGztX6M9UX2MdZlRQS3HbdqINzp8";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;
      const zipCode = results[0].address_components?.find((component: any) =>
        component.types.includes("postal_code")
      )?.long_name;
      if (zipCode) {
        return zipCode.toString();
      } else {
        return "";
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAddress = async (add: any) => {
    const zip = await fetchZipCodeForAddress(add.value.description);
    const completeAddress = add.value.description.toString() + ", " + zip;
    setAddress(completeAddress);
  };

  return (
    <>
      <Modal
        open={isApartmenOnlyModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: "80vw", md: "70vw", lg: "60vw" },
            height: isMobile ? "90vh" : "90vh",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              backgroundColor: "#08123B",
              width: isMobile ? 200 : 330,
              height: 30,
              p: 1,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Typography fontSize={14} color={"#FFFFFF"}>
              Out of State Move
              <span style={{ margin: "0 16px" }}>&gt;&gt;</span> Apartment Only
            </Typography>
          </Box>

          {isLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={() => {
                setIsLoading(true);
              }}
            >
              <Stack
                spacing={2}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <CircularProgress color="inherit" />
              </Stack>
            </Backdrop>
          )}

          <Grid
            container
            flexDirection={isMobile ? "column-reverse" : undefined}
          >
            <Grid item xs={12} sm={7} p={isMobile ? 3 : 4}>
              <Typography mt={2} fontWeight={600} fontSize={16}>
                WHAT IS YOUR ADDRESS?
              </Typography>

              <GooglePlacesAutocomplete
                apiOptions={{
                  language: "en",
                }}
                minLengthAutocomplete={1}
                apiKey={PLACES_API_KEY}
                debounce={1000}
                selectProps={{
                  styles: {
                    input: (provided) => ({
                      ...provided,
                      color: "#000000",
                      height: "100%",
                      borderRadius: "8px",
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: "#808080",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#808080",
                    }),
                  },
                  onChange: handleAddress,
                  placeholder: "Enter Address",
                }}
              />

              <Typography mt={4} fontWeight={600} fontSize={16}>
                ARE STAIRS OR AN ELEVATOR NEEDED?
              </Typography>

              <Typography
                fontWeight={400}
                fontSize={14}
                sx={{ fontStyle: "italic" }}
              >
                choose one
              </Typography>

              <Stack mt={2} direction="row" spacing={1}>
                <Button
                  onClick={() => {
                    setIsElevator("walkup");
                  }}
                  sx={
                    isElevator === "walkup"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  Walkup
                </Button>

                <Button
                  sx={
                    isElevator === "elevator"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setIsElevator("elevator");
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
                  }}
                >
                  Not Applicable
                </Button>
              </Stack>

              {isElevator !== "not-applicable" && (
                <>
                  <Typography
                    fontSize={16}
                    mt={4}
                    fontWeight={600}
                    color={"#262626"}
                  >
                    WHAT FLOOR ARE YOU ON ?
                  </Typography>

                  <TextField
                    variant="outlined"
                    fullWidth
                    value={destinationFloor}
                    size="small"
                    onChange={(event) => {
                      handleInputNumber(event, setDestinationFloor);
                    }}
                    inputProps={{
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

              {/* <Typography mt={2} fontWeight={600} fontSize={16}>
                DO YOU HAVE ACCESS TO THE ELEVATOR ?
              </Typography>

              <Typography
                fontWeight={400}
                fontSize={14}
                sx={{ fontStyle: "italic" }}
              >
                choose one
              </Typography>

              <Stack mt={1} direction="row" spacing={1}>
                <Button
                  onClick={() => {
                    setIsElevatorAccess(true);
                  }}
                  sx={
                    isElevatorAccess
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  Yes
                </Button>
                <Button
                  sx={
                    !isElevatorAccess
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setIsElevatorAccess(false);
                  }}
                >
                  No
                </Button>
              </Stack>

              <Typography mt={2} fontWeight={600} fontSize={16}>
                ELEVATOR TYPE?
              </Typography>

              <Typography
                fontWeight={400}
                fontSize={14}
                sx={{ fontStyle: "italic" }}
              >
                choose one
              </Typography>

              <Stack mt={1} direction="row" spacing={1}>
                <Button
                  onClick={() => {
                    setElevatorType("freight");
                  }}
                  sx={
                    elevatorType === "freight"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  Freight
                </Button>
                <Button
                  sx={
                    elevatorType === "regular"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setElevatorType("regular");
                  }}
                >
                  Regular
                </Button>
              </Stack> */}
            </Grid>

            <Grid item xs={12} sm={5} p={isMobile ? 2 : 4} mt={2}>
              <Stack
                alignItems={"center"}
                p={3}
                sx={{
                  background: "#22965F0F",
                  borderRadius: "12px",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "40px",
                    background: "#D9D9D9",
                  }}
                />
                <Typography
                  mt={3}
                  fontWeight={600}
                  fontSize={16}
                  textAlign={"center"}
                >
                  Why are we asking these-
                </Typography>
                <Typography
                  mt={1}
                  fontWeight={500}
                  fontSize={14}
                  textAlign={"center"}
                  color={"#625E5E"}
                >
                  In order to give you a good experience we need proper
                  information before creating a plan for you. All these
                  information are safe with us
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Box p={3}>
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>

          <Box mb={3} mr={5} display={"flex"} justifyContent={"end"}>
            <Button
              onClick={() => {
                navigateToLocationInfo();
              }}
              variant="contained"
              sx={{
                width: 200,
                borderColor: "#5858E0",
                bgcolor: "#5858E0",
                color: "#FFFFFF",
              }}
            >
              Next →
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ApartmentOnlyModal;
