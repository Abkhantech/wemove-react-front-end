import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const CaptureInventoryModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [isCaptureInventoryModal, setIsCaptureInventoryModal] = useState(false);
  const handleCaptureInventoryModal = () => setIsCaptureInventoryModal(true);
  const handleClose = () => setIsCaptureInventoryModal(false);

  return (
    <>
      <Button onClick={handleCaptureInventoryModal}>Open modal</Button>
      <Modal
        open={isCaptureInventoryModal}
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
              Please make sure you capture all your inventory
            </Typography>
            <Typography fontSize={10} textAlign={"center"} color={"#6F6C90"}>
              Make sure to document all your inventory. If you can't capture it
              with video, there will be an option to include it before
              submitting the inventory. WeMove was created to ensure that you
              are never charged extra if the inventory you collect matches what
              you have. WeMove guarantees the price we give you. You will also
              have the chance to adjust your inventory by adding or removing
              items manually.
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

export default CaptureInventoryModal;
