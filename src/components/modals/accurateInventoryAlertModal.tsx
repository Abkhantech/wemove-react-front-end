import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const AccurateInventoryAlertModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [isAccurateInventoryAlertModal, setIsAccurateInventoryAlertModal] =
    useState(false);
  const handleAccurateInventoryAlertModal = () =>
    setIsAccurateInventoryAlertModal(true);
  const handleClose = () => setIsAccurateInventoryAlertModal(false);

  return (
    <>
      <Button onClick={handleAccurateInventoryAlertModal}>Open modal</Button>
      <Modal
        open={isAccurateInventoryAlertModal}
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
              Make sure your inventory collected is accurate
            </Typography>
            <Typography fontSize={10} textAlign={"center"} color={"#6F6C90"}>
              Ensure the accuracy of your inventory. If you need to make
              revisions, it's not a problem. WeMove allows you to easily go back
              and edit your inventory. You will be able to make edits directly
              from your login at any time manually. This puts you in control of
              your move. If the number of items decreases, your final price upon
              delivery will also decrease. Conversely, if the number of items
              increases, so will the price charged by the carrier. This ensures
              transparency and eliminates any surprises during the process.
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

export default AccurateInventoryAlertModal;
