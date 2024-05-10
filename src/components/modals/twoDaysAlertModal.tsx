import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const TwoDaysAlertModal = ({
  isTwoDaysAlertModal,
  setIsTwoDaysAlertModal,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  
  const handleClose = () => setIsTwoDaysAlertModal(false);

  return (
    <>
      <Modal
        open={isTwoDaysAlertModal}
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
              Please put down two pick up days that work or may work
            </Typography>
            <Typography fontSize={12} textAlign={"center"} color={"#6F6C90"}>
              Kindly provide two preferred dates that are convenient for you. If
              you're uncertain, select two dates within the month you anticipate
              moving. Your carrier will reach out to you, and you can change the
              dates for free as long as it's done at least three days before
              your scheduled pick up.
            </Typography>

            <Button
              onClick={() => {
                setIsTwoDaysAlertModal(false);
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

export default TwoDaysAlertModal;
