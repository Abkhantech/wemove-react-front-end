import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const FloorAlertModal = ({ isFloorAlertModal, setIsFloorAlertModal }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const handleClose = () => setIsFloorAlertModal(false);

  return (
    <>
      <Modal
        open={isFloorAlertModal}
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
              fontSize={14}
              textAlign={"center"}
              fontWeight={600}
              color={"#262626"}
            >
              If you are moving to a location that is on a third floor or higher
            </Typography>
            <Typography fontSize={12} textAlign={"center"} color={"#6F6C90"}>
              If the carrier needs to use stairs or an elevator, there will be a
              fee. The elevator fee is $75 and should be reserved with your
              building if necessary. The first flight of stairs is free, but any
              flights beyond the second story will incur a $75 fee per flight.
              If you fail to mention this or are unsure, the carrier may
              increase the price upon pick up or delivery.
            </Typography>

            <Button
              onClick={handleClose}
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

export default FloorAlertModal;
