import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Alert, Stack, useMediaQuery, useTheme } from "@mui/material";
import placesApiKey from "../utils/Google-Places-API-Key";
import axios from "axios";
const PLACES_API_KEY = placesApiKey;

const HomeOrTownOnlyModal = ({
  homeOnlyModalVisible,
  setHomeOnlyModalVisible,
  createMoveRequest,
  thisMoveRequest,
  isLoading,
  setIsLoading,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");

  const handleClose = () => setHomeOnlyModalVisible(true);

  const navigateToLocationInfo = async () => {
    if (address !== "") {
      setFormError("");
      await createMoveRequest({
        id: thisMoveRequest.id,
        home_address: address,
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
        open={homeOnlyModalVisible}
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
            height: isMobile ? "90vh" : undefined,
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
              <span style={{ margin: "0 16px" }}>&gt;&gt;</span> home or town
              only
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
              WHAT IS YOUR ADDRESS
            </Typography>
            <Typography mt={1} fontSize={14} color={"#71717A"}>
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

            <Box
              sx={{
                border: "1px solid #5858E030",
                borderRadius: 2,
                p: 3,
                marginTop: 10,
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

export default HomeOrTownOnlyModal;
