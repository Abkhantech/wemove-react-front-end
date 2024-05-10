import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import twoPeopleInteracting from "../../assets/images/two_people_interacting.png";

const RediractionMessageModal = ({
  isRedirectMessageModal,
  setIsRedirectMessageModal,
  link,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const handleClose = () => setIsRedirectMessageModal(false);

  const handleButtonClick = () => {
    window.open(link, "_blank");
  };

  return (
    <>
      <Modal
        open={isRedirectMessageModal}
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
          <img src={twoPeopleInteracting} width={120} height={70} alt="" />

          <Typography mt={1} fontSize={14} fontWeight={550} color={"#262626"}>
            You are being redirected to a third-party site. WeMove does not
            profit from this transaction
          </Typography>

          <Box mt={3} display={"flex"} justifyContent={"center"}>
            <Stack>
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
                onClick={handleButtonClick}
              >
                Continue
              </Button>

              <Button
                sx={{
                  width: 180,
                  height: 45,
                  color: "#5859DF",
                  fontSize: 12,
                  fontWeight: 550,
                }}
                onClick={handleClose}
              >
                No, go back
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RediractionMessageModal;
