import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const OnBoardingSuccessModal = ({onboardingSuccessModalVisible, setOnboardingSuccessModalVisible}:any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));


  const handleCarrierAlertModal = () => setOnboardingSuccessModalVisible(true);
  const handleClose = () => setOnboardingSuccessModalVisible(true);

  return (
    <>
      <Button onClick={handleCarrierAlertModal}>Open modal</Button>
      <Modal
        open={onboardingSuccessModalVisible}
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
          fontSize="large" sx={{color:"#5858E0", width:70,height: 70}}/>

            <Typography
              fontSize={14}
              textAlign={"center"}
              fontWeight={600}
              color={"#262626"}
            >
              We have received your application to be a carrier on WeMove. Upon review, a WeMove representative will reach out to you with the next steps directly.
            </Typography>
            <Button
            onClick={()=>{
                setOnboardingSuccessModalVisible(false)
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

export default OnBoardingSuccessModal;
