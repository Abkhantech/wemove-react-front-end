import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const CarrierAlertModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [isCarrierAlertModal, setIsCarrierAlertModal] = useState(false);
  const handleCarrierAlertModal = () => setIsCarrierAlertModal(true);
  const handleClose = () => setIsCarrierAlertModal(false);

  return (
    <>
      <Button onClick={handleCarrierAlertModal}>Open modal</Button>
      <Modal
        open={isCarrierAlertModal}
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
            width: isMobile ? "75vw" : "35vw",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Box>
              <img src={alertIcon} alt="" />
            </Box>

            <Typography
              fontSize={12}
              textAlign={"center"}
              fontWeight={600}
              color={"#262626"}
            >
              You will be provided with the point of contact of your assigned
              carrier
            </Typography>
            <Typography fontSize={10} textAlign={"center"} color={"#6F6C90"}>
              All changes to your move should be communicated to them directly.
              WeMove is available to help at any point throughout your journey.
            </Typography>

            <Button
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

export default CarrierAlertModal;
