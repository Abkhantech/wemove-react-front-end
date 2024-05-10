import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";
import warningIcon from "../../assets/images/image 412.svg"

const InfoLostAlertModal = ({
  infoLostAlertModalVisible,
  setInfoLostAlertModalVisible,
  setAnyModal,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const handleClose = () => setInfoLostAlertModalVisible(true);

  return (
    <>
      <Modal
        open={infoLostAlertModalVisible}
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
              <img width={60} src={warningIcon} alt="" />
            </Box>

            <Typography
              fontSize={14}
              textAlign={"center"}
              fontWeight={600}
              color={"#5858E0"}
            >
              If you choose to leave, any information you have entered in the
              form will be lost.
            </Typography>
            <Stack spacing={4} direction={"row"} alignItems={"center"}>
              <Button
                onClick={() => {
                  setAnyModal(false);
                  setInfoLostAlertModalVisible(false);
                }}
                sx={{
                  width: 120,
                  height: 45,
                  backgroundColor: "#5858E0 !important",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 550,
                  border: "1px solid #6552FF",
                }}
              >
                I understand
              </Button>
              <Button
                onClick={() => {
                  setInfoLostAlertModalVisible(false);
                }}
                sx={{
                  width: 120,
                  height: 45,
                  backgroundColor: "#5858E0 !important",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 550,
                  border: "1px solid #6552FF",
                }}
              >
                Don't Leave
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default InfoLostAlertModal;
