import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";

const PriceGuaranteeModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [isPriceGuaranteeModal, setIsPriceGuaranteeModal] = useState(false);
  const handlePriceGuaranteeModal = () => setIsPriceGuaranteeModal(true);
  const handleClose = () => setIsPriceGuaranteeModal(false);

  return (
    <>
      <Button onClick={handlePriceGuaranteeModal}>Open modal</Button>
      <Modal
        open={isPriceGuaranteeModal}
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
              Your price is guaranteed so long as your inventory matches
            </Typography>
            <Typography fontSize={10} textAlign={"center"} color={"#6F6C90"}>
              Rest assured, WeMove guarantees that your agreed-up price will not
              change if your inventory remains the same. You can cancel your
              pick up and receive a full refund up to 24 hours before your
              scheduled time. It's important to note that half of the remaining
              balance will be due to the carrier upon pick up and the other half
              will be paid before unloading any inventory at the delivery
              location. Your carrier accepts credit cards, debit cards, Zelle,
              cash, or postal money orders. At the time of delivery, your carry
              will accept payment via postal money orders, cash, or Zelle.
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

export default PriceGuaranteeModal;
