import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import placesApiKey from "../utils/Google-Places-API-Key";
import axios from "axios";
const PLACES_API_KEY = placesApiKey;

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 10,
  },
  {
    value: 20,
  },
  {
    value: 30,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
  {
    value: 60,
  },
  {
    value: 70,
  },
  {
    value: 80,
  },
  {
    value: 90,
  },
  {
    value: 100,
    label: "100%",
  },
];

const storageSizeDropDown = [
  {
    label: "5x5x8",
    value: 200,
  },
  {
    label: "5x10x8",
    value: 400,
  },
  {
    label: "5x15x8",
    value: 600,
  },
  {
    label: "10x10x8",
    value: 800,
  },
  {
    label: "10x15x8",
    value: 1200,
  },
  {
    label: "10x20x8",
    value: 1600,
  },
  {
    label: "10x25x8",
    value: 2000,
  },
  {
    label: "10x30x8",
    value: 2400,
  },
  {
    label: "20x20x8",
    value: 3200,
  },
];

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

const HomeStorageCombo = ({
  isHomeStorageComboModal,
  setIsHomeStorageComboModal,
  createMoveRequest,
  thisMoveRequest,
  isLoading,
  setIsLoading,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [homeAddress, setHomeAddress] = useState("");
  const [storageSize, setStorageSize] = useState<any>("");
  const [storageAddress, setStorageAddress] = useState("");
  const [storageZipCode, setStorageZipCode] = useState("");

  const [storageDestinationFloor, setStorageDestinationFloor] = useState("");
  const [isStorageElevator, setIsStorageElevator] = useState("");
  const [storageFilled, setStorageFilled] = useState<any>(70);

  const [formError, setFormError] = useState("");

  const handleHomeStorageCombo = () => setIsHomeStorageComboModal(true);
  const handleClose = () => setIsHomeStorageComboModal(true);

  const valueText = (value: number) => {
    return `${value}%`;
  };

  const handleStorageFilled = (event: any) => {
    setStorageFilled(event.target.value);
  };

  const handleZipCodeChange = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 5;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setStorageZipCode(inputValue);
    event.target.value = inputValue;
  };

  const handleInputNumber = (event: any, setNumber: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 7;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setNumber(inputValue);
    event.target.value = inputValue;
  };

  const navigateToLocationInfo = async () => {
    if (
      homeAddress !== "" &&
      storageSize !== "" &&
      storageFilled !== "" &&
      storageZipCode !== "" &&
      storageAddress !== "" &&
      storageDestinationFloor !== "" &&
      isStorageElevator !== ""
    ) {
      setFormError("");
      await createMoveRequest({
        id: thisMoveRequest.id,
        combo_home_storage: {
          home_address: homeAddress,
          storage: {
            storage_size: Number(storageSize.target.value.value),
            storage_filled: Number(storageFilled),
            zip_code: storageZipCode,
            address: storageAddress,
            floor_no:
              isStorageElevator === "not-applicable"
                ? 0
                : Number(storageDestinationFloor),
            is_elevator_accessible:
              isStorageElevator === "elevator" ? true : false,
            are_stairs_present: isStorageElevator === "stairs" ? true : false,
          },
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
    if (zip) {
      const completeAddress = add.value.description.toString() + ", " + zip;
      setHomeAddress(completeAddress);
    } else {
      const completeAddress = add.value.description.toString();
      setHomeAddress(completeAddress);
    }
  };

  const handleStorageAddress = async (add: any) => {
    const zip = await fetchZipCodeForAddress(add.value.description);
    const completeAddress = add.value.description.toString() + ", " + zip;
    setStorageZipCode(zip);
    setStorageAddress(completeAddress);
  };

  return (
    <>
      <Button onClick={handleHomeStorageCombo}>Open modal</Button>
      <Modal
        open={isHomeStorageComboModal}
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
            width: { xs: "90vw", sm: "80vw", md: "60vw", lg: "60vw" },
            height: isMobile ? "90vh" : "80vh",
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
              Out of state move
              <span style={{ margin: "0 16px" }}>&gt;&gt;</span> Combo-
              Home/storage
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

          <Box sx={{ p: 3 }}>
            <Typography mt={1} fontSize={16} fontWeight={700} color={"#262626"}>
              HOME INFO
            </Typography>

            <Typography
              mt={1}
              fontSize={14}
              fontWeight={700}
              color={"#262626"}
              sx={{ textTransform: "uppercase" }}
            >
              What address are you moving from?
            </Typography>

            <Typography fontSize={14} color={"#71717A"}>
              As we will pull your home info from our realty platform
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

            <Typography mt={2} fontSize={16} fontWeight={600} color={"#262626"}>
              STORAGE INFO
            </Typography>
            <Typography
              mt={1}
              fontSize={14}
              sx={{ textTransform: "uppercase" }}
            >
              What is the size of the storage facility?
            </Typography>
            <Stack
              alignItems={"center"}
              marginTop={1}
              direction={"row"}
              spacing={1}
            >
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="demo-select-small-label">
                  {storageSize !== ""
                    ? storageSize.target.value.label
                    : "Storage Size"}
                </InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={""}
                  label="Storage Size"
                  onChange={(e) => {
                    setStorageSize(e);
                  }}
                  required
                >
                  {storageSizeDropDown.map((size: any) => {
                    return (
                      <MenuItem key={size.value} value={size}>
                        {size.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>

            <Typography mt={2} fontSize={14}>
              HOW FULL IS YOUR STORAGE UNIT?
            </Typography>

            <Typography fontStyle={"italic"} fontSize={12} color={"#262626"}>
              drag to use
            </Typography>
            <Slider
              sx={{ mt: 2, ml: 1, width: isMobile ? 230 : 450 }}
              aria-label="Always visible"
              defaultValue={70}
              getAriaValueText={valueText}
              step={10}
              marks={marks}
              onChange={(val) => {
                handleStorageFilled(val);
              }}
              valueLabelDisplay="on"
            />

            <Typography
              mt={2}
              fontSize={14}
              fontWeight={600}
              sx={{ textTransform: "uppercase" }}
            >
              What is the storage facility address?
            </Typography>
            <Stack
              spacing={1}
              marginTop={2}
              direction={isMobile ? "column" : "row"}
            >
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
                      width: 150,
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
                  onChange: handleStorageAddress,
                  placeholder: "Enter Address",
                }}
              />

              <TextField
                variant="outlined"
                type="text"
                label="Zip Code"
                size="small"
                value={storageZipCode}
                onChange={(e) => {
                  handleZipCodeChange(e);
                }}
                inputProps={{
                  style: {
                    background: "#5A7BFC14",
                    borderRadius: "8px",
                  },
                }}
                sx={{
                  marginTop: 1,
                  width: 220,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#5A7BFC59",
                      borderWidth: "1.43",
                      borderRadius: "8px",
                    },
                  },
                }}
                required
              />
            </Stack>

            <Typography mt={2} fontWeight={400} fontSize={14}>
              ARE STAIRS OR AN ELEVATOR NEEDED?
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
                  setIsStorageElevator("stairs");
                }}
                sx={
                  isStorageElevator === "stairs"
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
              >
                Stairs
              </Button>

              <Button
                sx={
                  isStorageElevator === "elevator"
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
                onClick={() => {
                  setIsStorageElevator("elevator");
                }}
              >
                Elevator
              </Button>

              <Button
                sx={
                  isStorageElevator === "not-applicable"
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
                onClick={() => {
                  setIsStorageElevator("not-applicable");
                }}
              >
                Not Applicable
              </Button>
            </Stack>

            {isStorageElevator !== "not-applicable" && (
              <>
                <Typography
                  fontSize={14}
                  mt={2}
                  fontWeight={400}
                  color={"#262626"}
                >
                  WHAT FLOOR IS YOUR STORAGE ON ?
                </Typography>

                <TextField
                  variant="outlined"
                  value={storageDestinationFloor}
                  size="small"
                  onChange={(event) => {
                    handleInputNumber(event, setStorageDestinationFloor);
                  }}
                  inputProps={{
                    style: {
                      background: "#5A7BFC14",
                      borderRadius: "8px",
                    },
                  }}
                  sx={{
                    marginTop: 1,
                    width: 220,
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

            <Box
              sx={{
                border: "1px solid #5858E030",
                borderRadius: 2,
                p: 3,
                marginTop: 6,
                backgroundColor: "#22965F0F",
              }}
            >
              <Stack spacing={2}>
                <Typography fontWeight={600} fontSize={12}>
                  Why Are We Asking These -
                </Typography>
                <Typography color={"#625E5E"} fontSize={12}>
                  In Order To Give You A Good Experience We Need Proper
                  Information Before Creating A Plan For You. All These
                  Information Are Safe With Us.
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Box p={3}>
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>

          <Stack p={4} alignItems="flex-end">
            <Button
              onClick={() => {
                navigateToLocationInfo();
              }}
              sx={{
                width: 180,
                height: 45,
                backgroundColor: "#5858E0 !important",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 550,
                border: "1px solid #6552FF",
              }}
            >
              Next →
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default HomeStorageCombo;
