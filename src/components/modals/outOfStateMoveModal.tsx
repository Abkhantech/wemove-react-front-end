import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import apartmentImage from "../../assets/images/Apartment-only.svg";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import comboApartmentStorage from "../../assets/images/Combo-Apartment-Storage.svg";
import homeOnly from "../../assets/images/Home-only.svg";
import comboHomeStorage from "../../assets/images/Combo-Home-Storage.svg";
import storageOnly from "../../assets/images/Storage-only.svg";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const typeSelected = {
  width: 190,
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
  border: "1px solid #6552FF",
};

const typeNotSelected = {
  width: 190,
  color: "#5859DF",
};

const OutOfStateMoveModal = ({
  outOfStateMoveModalVisible,
  setOutOfStateMoveModalVisible,
  createMoveRequest,
  thisMoveRequest,
  moveType,
  setMoveType,
  isLoading,
  setIsLoading,
  setIsServiceSelectionModal,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
  // const [availableDate, setAvailableDate] = useState("");
  const [fieldError, setFieldError] = useState("");

  const handleClose = () => setOutOfStateMoveModalVisible(true);
  return (
    <>
      <Modal
        open={outOfStateMoveModalVisible}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "45%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: "80vw", md: "50vw", lg: "55vw" },
            height: isMobile ? "90vh" : "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              backgroundColor: "#08123B",
              width: 150,
              height: 40,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Typography fontSize={14} color={"#FFFFFF"}>
              Out of state move
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
        <Button
                onClick={() => {
                  setMoveType("")
                  setIsServiceSelectionModal(true);
                  setOutOfStateMoveModalVisible(false);
                }}
                sx={{ marginTop: 1, marginLeft: 1 }}
              >
                <ArrowBackIcon sx={{ color: "#5858E0" }} fontSize="large" />
              </Button>
          <Stack sx={{ p: 4 }}>
            <Typography>PERSONAL INFO</Typography>
            <Stack
              justifyContent={"space-between"}
              marginTop={2}
              direction={"row"}
            >
              <Stack alignItems={"flex-start"}>
                <Typography fontSize={12} color={"#71717A"}>
                  Name
                </Typography>
                <Typography fontSize={12}>
                  {thisMoveRequest?.user?.first_name +
                    " " +
                    thisMoveRequest?.user?.last_name}
                </Typography>
              </Stack>
              <Stack alignItems={"flex-start"}>
                <Typography fontSize={12} color={"#71717A"}>
                  Email
                </Typography>
                <Typography fontSize={12}>
                  {thisMoveRequest?.user?.email}
                </Typography>
              </Stack>
              <Stack alignItems={"flex-start"}>
                <Typography fontSize={12} color={"#71717A"}>
                  Phone No.
                </Typography>
                <Typography fontSize={12}>
                  {thisMoveRequest?.user?.phone_number}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* <Stack sx={{ paddingLeft: 4 }}>
            <Typography>OTHER INFO</Typography>
            <Stack marginTop={2} justifyContent={"flex-start"}>
              <Stack spacing={1} alignItems={"flex-start"}>
                <Typography fontSize={12} color={"#71717A"}>
                  FIRST AVAILABLE DATE OF DELIVERY
                </Typography>
                <TextField
                  id="outlined-size-small"
                  size="small"
                  placeholder="Estimate Move Date"
                  type="date"
                  onChange={(e) => {
                    setAvailableDate(e.target.value);
                  }}
                />
              </Stack>
            </Stack>
          </Stack> */}

          <Stack
            sx={{
              p: 4,
              alignItems: isMobile ? "center" : "flex-start",
              overflow: "auto",
            }}
          >
            <Typography>WHAT ARE YOU MOVING ?</Typography>
            <Typography color={"#5858E0"}>
              {moveType && moveType !== "" ? moveType.toUpperCase() : ""}
            </Typography>
            <Stack
              marginTop={2}
              direction={"row"}
              display={"flex"}
              flexWrap={"wrap"}
              padding={1}
              justifyContent={"center"}
            >
              <Button
                onClick={() => setMoveType("apartment-only")}
                sx={
                  moveType === "apartment-only" ? typeSelected : typeNotSelected
                }
              >
                <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                  <img
                    style={{ borderRadius: 15 }}
                    width={180}
                    src={apartmentImage}
                    alt=""
                  />

                  <Typography fontWeight={600} fontSize={12}>
                    Apartment Only
                  </Typography>
                </Stack>
              </Button>

              <Button
                onClick={() => setMoveType("combo-apartment-storage")}
                sx={
                  moveType === "combo-apartment-storage"
                    ? typeSelected
                    : typeNotSelected
                }
              >
                <Stack alignItems={"center"} marginX={0.5} paddingTop={2} marginY={0.5}>
                  <img
                    style={{ borderRadius: 15 }}
                    width={180}
                    src={comboApartmentStorage}
                    alt=""
                  />

                  <Typography fontWeight={600} fontSize={12}>
                    Combo Apartment-Storage
                  </Typography>
                </Stack>
              </Button>

              <Button
                onClick={() => setMoveType("home-only")}
                sx={moveType === "home-only" ? typeSelected : typeNotSelected}
              >
                <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                  <img
                    style={{ borderRadius: 15 }}
                    width={180}
                    src={homeOnly}
                    alt=""
                  />

                  <Typography fontWeight={600} fontSize={12}>
                    Home Only
                  </Typography>
                </Stack>
              </Button>

              <Button
                onClick={() => setMoveType("combo-home-storage")}
                sx={
                  moveType === "combo-home-storage"
                    ? typeSelected
                    : typeNotSelected
                }
              >
                <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                  <img
                    style={{ borderRadius: 15 }}
                    width={180}
                    src={comboHomeStorage}
                    alt=""
                  />

                  <Typography fontWeight={600} fontSize={12}>
                    Combo Home-Storage
                  </Typography>
                </Stack>
              </Button>

              <Button
                onClick={() => setMoveType("storage-only")}
                sx={
                  moveType === "storage-only" ? typeSelected : typeNotSelected
                }
              >
                <Stack alignItems={"center"} marginX={0.5} marginY={0.5}>
                  <img
                    style={{ borderRadius: 15 }}
                    width={180}
                    src={storageOnly}
                    alt=""
                  />

                  <Typography fontWeight={600} fontSize={12}>
                    Storage Only
                  </Typography>
                </Stack>
              </Button>
            </Stack>
          </Stack>

          <Stack p={2} alignItems="flex-end">
            {fieldError && <Alert severity="error">{fieldError}</Alert>}

            <Button
              onClick={() => {
                if (moveType !== "") {
                  createMoveRequest({
                    id: thisMoveRequest.id,
                    // first_available_date_of_delivery:
                    //   availableDate !== "" ? availableDate : null,
                    location_type: moveType,
                    number_of_rooms: Number(numberOfBedrooms),
                  });
                } else {
                  if (moveType === "") {
                    setFieldError("Please select the location type");
                  }
                }
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
              Continue
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default OutOfStateMoveModal;
