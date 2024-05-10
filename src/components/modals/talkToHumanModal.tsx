import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import twoPeopleInteracting from "../../assets/images/two_people_interacting.png";

const TalkToHumanModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [isTalkToHumanModal, setIsTalkToHumanModal] = useState(false);
  const handleTalkToHuman = () => setIsTalkToHumanModal(true);
  const handleClose = () => setIsTalkToHumanModal(false);

  return (
    <>
      <Button onClick={handleTalkToHuman}>Open modal</Button>
      <Modal
        open={isTalkToHumanModal}
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

          <Typography mt={1} fontSize={18} fontWeight={700} color={"#262626"}>
            Talk to a human !
          </Typography>
          <Typography mt={1} fontSize={14} color={"#797979"}>
            To make your moving journey easy we will help you in each stage.
            Let's talk.
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
              >
                Talk to us
              </Button>

              <Button
                sx={{
                  width: 180,
                  height: 45,
                  color: "#5859DF",
                  fontSize: 12,
                  fontWeight: 550,
                }}
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

export default TalkToHumanModal;
