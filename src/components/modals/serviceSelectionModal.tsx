import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import movingTruck from "../../assets/images/moving_truck.svg";
import manPickingBoxes from "../../assets/images/man_picking_boxes.png";
import manPickingBoxes2 from "../../assets/images/Rectangle 100351.png";

const continueButton = {
  width: 130,
  height: 46,
  fontSize: 12,
  fontWeight: 550,
  backgroundColor: "#FDFCFD !important",
  color: "#5858E0",
  border: "1px solid #6552FF",
  borderRadius: 20,
  marginLeft: 2,
  marginBottom: 1,
  "&:hover": {
    backgroundColor: "#5858E0 !important",
    color: "#FDFCFD",
  },
};

const yellowBox = {
  position: "absolute",
  top: 10,
  right: 0,
  bgcolor: "#E29400",
  p: 1,
  borderTopLeftRadius: "20px",
  borderBottomLeftRadius: "20px",
};

const ServiceSelectionModal = ({
  isServiceSelectionModal,
  setIsServiceSelectionModal,
  createMoveRequest,
  isLoading,
  setIsLoading,
  thisMoveRequest
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const customCard = {
    width: { xs: "60vw", sm: 300, md: 300 },
    background: "#FAFAFA",
    borderRadius: 3,
    border: "1px #0000001A",
    mt: isMobile ? 2 : 0,
    ml: isMobile ? 0 : 2,
    marginX: isMobile ? "auto" : undefined,
  };

  const handleClose = () => setIsServiceSelectionModal(false);

  return (
    <>
      <Modal
        open={isServiceSelectionModal}
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
            width: { xs: "75vw", sm: "80vw", md: "75vw", lg: "55vw" },
            height: isMobile ? "85vh" : undefined,
            bgcolor: "background.paper",
            borderRadius: "8psx",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          {isLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={() => {
                setIsLoading(true);
              }}
            >
              <Stack
                spacing={2}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <CircularProgress color="inherit" />
              </Stack>
            </Backdrop>
          )}
          <Typography fontSize={18} fontWeight={700} color={"#262626"}>
            Pick the service you want
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#828185"}>
            Choose one to continue
          </Typography>
          <Box
            mt={3}
            pb={5}
            display={isMobile ? "block" : "flex"}
            justifyContent={"center"}
          >
            <Card sx={customCard}>
              <Box sx={{ position: "relative" }}>
                <CardMedia sx={{ height: 180 }} image={manPickingBoxes2} />
                {/* <Box sx={yellowBox}>
                  <Typography fontSize={14} fontWeight={700} color={"#FFFFFF"}>
                    Less than 100 miles
                  </Typography>
                </Box> */}
              </Box>
              <CardContent>
                <Typography fontSize={16} fontWeight={700}>
                  In-State Move
                </Typography>
                {/* <Typography fontSize={14} fontWeight={500}>
                  Local Move
                </Typography> */}
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    if(thisMoveRequest!==null){
                      console.log('updating old one')
                      createMoveRequest({
                    id: thisMoveRequest.id,
                    move_type: "In-State Move",
                      })
                    }else{
                      createMoveRequest({
                        move_type: "In-State Move",
                      });
                    }
                  }}
                  variant="contained"
                  size="small"
                  sx={continueButton}
                >
                  Continue
                </Button>
              </CardActions>
            </Card>

            {/* <Card sx={customCard}>
              <Box sx={{ position: "relative" }}>
                <CardMedia sx={{ height: 180 }} image={manPickingBoxes} />
                <Box sx={yellowBox}>
                  <Typography fontSize={14} fontWeight={700} color={"#FFFFFF"}>
                    More than 100 miles
                  </Typography>
                </Box>
              </Box>
              <CardContent>
                <Typography fontSize={16} fontWeight={700}>
                  In-State Move
                </Typography>
                <Typography fontSize={14} fontWeight={500}>
                  Long Distance
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    createMoveRequest({
                      move_type: "Out-of-State Move",
                    });
                  }}
                  variant="contained"
                  size="small"
                  sx={continueButton}
                >
                  Continue
                </Button>
              </CardActions>
            </Card> */}

            <Card sx={customCard}>
              <Box sx={{ position: "relative" }}>
                <CardMedia sx={{ height: 180 }} image={movingTruck} />
                {/* <Box sx={yellowBox}>
                  <Typography fontSize={14} fontWeight={700} color={"#FFFFFF"}>
                    Interstate Moving
                  </Typography>
                </Box> */}
              </Box>
              <CardContent>
                <Typography fontSize={16} fontWeight={700}>
                  Out-of-State Move
                </Typography>
                {/* <Typography fontSize={14} fontWeight={500}>
                  Long Distance
                </Typography> */}
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    if(thisMoveRequest!==null){
                      console.log('updating old one')
                      createMoveRequest({
                    id: thisMoveRequest.id,
                    move_type: "Out-of-State Move",
                      })
                    }else{
                      createMoveRequest({
                        move_type: "Out-of-State Move",
                      });
                    }
                  }}
                  variant="contained"
                  size="small"
                  sx={continueButton}
                >
                  Continue
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ServiceSelectionModal;
