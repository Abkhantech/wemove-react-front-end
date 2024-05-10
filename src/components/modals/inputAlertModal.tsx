import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const InputAlertModal = ({ isInputAlertModal, setIsInputAlertModal }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const handleClose = () => setIsInputAlertModal(false);

  return (
    <>
      <Modal
        open={isInputAlertModal}
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
              Inventory confirmation
            </Typography>
            <Typography fontSize={12} textAlign={"center"} color={"#6F6C90"}>
              Based on what you have input so far, are you confident if you were
              to move today that you have included all your inventory? If you
              suspect you overlooked certain items, please revisit your quote,
              and make the necessary adjustments. You can manually add or remove
              items in your dashboard. It is important not to overlook your
              garage, attic, and patio if they are relevant to your inventory.
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

export default InputAlertModal;
