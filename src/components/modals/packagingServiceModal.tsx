import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { updateMoveRequestById } from "../../redux/actions/move-request";
import { getInventoryVolume } from "../../redux/actions/room-details";

const PackagingServiceModal = ({
  isPackaginServiceModal,
  setIsPackaginServiceModal,
  moveRequestId,
  thisMoveRequestId,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setIsPackaginServiceModal(false);

  const handleNavigateToPackages = () => {
    navigate(`/packages/${moveRequestId}`);
  };

  const getCubicFeet = () => {
    const move_request_id = moveRequestId || "";
    dispatch<any>(getInventoryVolume(move_request_id))
      .then(unwrapResult)
      .then((res: any) => {
        navigate(`/move-summary/${moveRequestId}`);
      });
  };

  const updateThisMoveRequest = (body: any) => {
    const params = {
      id: thisMoveRequestId,
      ...body,
    };
    dispatch<any>(updateMoveRequestById(params))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        getCubicFeet();
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <>
      <Modal
        open={isPackaginServiceModal}
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
          <Typography
            mt={1}
            fontSize={18}
            fontWeight={700}
            color={"#262626"}
            lineHeight={1.2}
          >
            Suprise! <br /> We also offer packaging service
          </Typography>
          <Typography mt={1} fontSize={14} color={"#797979"}>
            To make your moving journey easy we also help you in packaging see
            packages
          </Typography>

          <Box mt={3} display={"flex"} justifyContent={"center"}>
            <Stack>
              <Button
                onClick={() => {
                  handleNavigateToPackages();
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
                Explore packages
              </Button>

              <Button
                onClick={() => {
                  updateThisMoveRequest({
                    delivery_details: {
                      packagaing_required: false,
                    },
                  });
                }}
                sx={{
                  width: 180,
                  height: 45,
                  color: "#5859DF",
                  fontSize: 12,
                  fontWeight: 550,
                }}
              >
                Skip & Continue
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PackagingServiceModal;
