import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const MoveConfirmationModal = ({isConformationModal, setIsConformationModal}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const handleClose = () => setIsConformationModal(true);

  return (
    <>
      <Modal
        open={isConformationModal}
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
            <CheckBoxIcon
              fontSize="large"
              sx={{ color: "#41A652", width: 100, height: 100 }}
            />

            <Typography
              fontSize={14}
              textAlign={"center"}
              fontWeight={600}
              color={"#262626"}
            >
              Your move has been confirmed. We will reach out to you soon.
            </Typography>
            <Button
              onClick={() => {
                setIsConformationModal(false);
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

export default MoveConfirmationModal;
