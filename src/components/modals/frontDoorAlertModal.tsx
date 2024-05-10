import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const FrontDoorAlertModal = ({
  isFrontDoorAlertModalVisible,
  setIsFrontDoorAlertModalVisible,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const handleClose = () => setIsFrontDoorAlertModalVisible(false);

  return (
    <>
      <Modal
        open={isFrontDoorAlertModalVisible}
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
              If your carrier can’t get within 75 feet of your front door
            </Typography>
            <Typography fontSize={12} textAlign={"center"} color={"#6F6C90"}>
              If your carrier can’t get within 75 feet of your front door, then
              it is considered a long carry (truck to door). The first 75 feet
              from truck to door is free. The carrier will assess how much
              additional the fee will be. Our customer support can assist you if
              needed by using Google Earth to view as well. This rate is the
              discretion of the carrier, and the rule of thumb is usually around
              $1 per foot between 76 feet and the door. <br />
              <br />
              Secondly, if you are moving to a major downtown metropolitan area
              or to an area where a truck cannot access for whatever reason, a
              smaller box truck or rental truck may be required for access. If
              this turns out to be the case, be prepared to pay a shuttle fee.
              If a third-party shuttle is required, the rule of thumb is around
              $1 multiplied by the total cubic feet of your move.
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

export default FrontDoorAlertModal;
