import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import WeMoveHeader from "../../components/header/weMoveHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Card, CardContent } from "@mui/material";
import CarIcon from "../../assets/Icons/car-icon.svg";
import BoxIcon from "../../assets/Icons/box-icon.svg";
import ShieldIcon from "../../assets/Icons/shield-icon.svg";
import { useEffect, useState } from "react";
import RediractionMessageModal from "../../components/modals/rediractionMessageModal";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMoveRequestById } from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";

const MoveSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [moveRequest, setMoveRequest] = useState<any>(null);

  const [link, setLink] = useState("");
  const [isRedirectMessageModal, setIsRedirectMessageModal] = useState(false);

  const handleRediractionModal = (url: any) => {
    setLink(url);
    setIsRedirectMessageModal(true);
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (moveRequestId) {
      fetchMoveRequestById(moveRequestId);
    }
  }, [moveRequestId]);

  return (
    <>
      <WeMoveHeader />
      <Grid container>
        <Grid item xs={12} sm={8} md={5} marginX={"auto"}>
          <Box
            p={4}
            display={"flex"}
            justifyContent={"center"}
            sx={{ background: "#5858E0" }}
          >
            <Stack alignItems={"center"}>
              <CheckCircleIcon
                fontSize="large"
                sx={{ color: "#FFFFFF", width: 120, height: 120 }}
              />
              <Typography
                fontSize={14}
                textAlign={"center"}
                fontWeight={600}
                mt={2}
                color={"#FFFFFF"}
              >
                Your move has been confirmed. We will reach out to you soon.
              </Typography>
              <Typography
                fontSize={14}
                textAlign={"center"}
                fontWeight={400}
                mt={2}
                color={"#FFFFFF"}
              >
                View order summary
              </Typography>
            </Stack>
          </Box>

          <Box p={1}>
            <Typography fontSize={12} fontWeight={400} mt={2} mb={2}>
              Thanks so much for being a trusted WeMove customer. We look
              forward to making your move and transition as seamless as
              possible. Please keep an eye out for moving updates and tips via
              email and SMS. If you need anything along your journey, please
              don’t hesitate to reach out. You will be receiving additional
              information along the way.
            </Typography>

            <Box display={"flex"}>
              <Typography fontSize={14} fontWeight={550} mt={2}>
                CARRIER NAME:
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={550}
                mt={2}
                ml={1}
                color={"#5858E0"}
              >
                WEMOVE CARRIER NETWORK
              </Typography>
            </Box>

            <Box display={"flex"}>
              <Typography fontSize={14} mb={2} fontWeight={550}>
                CONTACT:
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={550}
                ml={1}
                color={"#5858E0"}
              >
                302-353-4106
              </Typography>
            </Box>

            <Divider variant="middle" />

            <Typography fontSize={12} fontWeight={400} mt={2} mb={2}>
              If you will be needing optional auto transport, additional
              insurance, or packing materials, please continue. If you don’t,
              feel free to close this window. You can always log into your
              account from the login page on WeMove. We thank you again for
              being part of the trusted WeMove family. We are here to help in
              every way we can.
            </Typography>
          </Box>

          <Box
            p={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              background: "#5858E0",
              borderRadius: 4,
            }}
          >
            <Stack alignItems={"center"}>
              <Typography
                fontSize={12}
                fontWeight={550}
                mt={2}
                mb={2}
                textAlign={"center"}
                color={"#FFFFFF"}
              >
                Would you like to transport a vehicle, motorcycle, or other?
              </Typography>
              <Button
                onClick={() => {
                  handleRediractionModal("https://www.montway.com/");
                }}
              >
                <Card sx={{ maxWidth: 150, borderRadius: 3, flexShrink: 0 }}>
                  <CardContent>
                    <Stack alignItems={"center"} spacing={1}>
                      <img src={CarIcon} width={80} height={50} alt="" />

                      <Typography fontSize={12} fontWeight={400}>
                        Transport Car
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Button>

              <Typography
                fontSize={12}
                fontWeight={550}
                mt={2}
                mb={2}
                textAlign={"center"}
                color={"#FFFFFF"}
              >
                Will you be needing to purchase any moving supplies from boxes,
                bins, to tape?
              </Typography>
              <Button
                onClick={() => {
                  handleRediractionModal(
                    "https://shareasale.com/r.cfm?b=883129&u=4219278&m=66601&urllink=&afftrack="
                  );
                }}
              >
                <Card sx={{ maxWidth: 150, borderRadius: 3, flexShrink: 0 }}>
                  <CardContent>
                    <Stack alignItems={"center"} spacing={1}>
                      <img src={BoxIcon} width={80} height={50} alt="" />

                      <Typography fontSize={12} fontWeight={400}>
                        Need Boxes?
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Button>

              <Typography
                fontSize={12}
                fontWeight={550}
                mt={2}
                mb={2}
                textAlign={"center"}
                color={"#FFFFFF"}
              >
                Would you like to add additional specialty insurance to your
                move ranging from a single item to full coverage?
              </Typography>
              <Button
                onClick={() => {
                  setIsRedirectMessageModal(true);
                }}
              >
                <Card sx={{ maxWidth: 150, borderRadius: 3, flexShrink: 0 }}>
                  <CardContent>
                    <Stack alignItems={"center"} spacing={1}>
                      <img src={ShieldIcon} width={80} height={50} alt="" />

                      <Typography fontSize={12} fontWeight={400}>
                        Need Insurance?
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Button>
            </Stack>
          </Box>
          <Stack p={3} alignItems="center">
            <Button
              onClick={() => {
                navigate(`/ConsumerDashboard/${moveRequest.user.id}`);
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
        </Grid>
      </Grid>

      {isRedirectMessageModal && (
        <RediractionMessageModal
          isRedirectMessageModal={isRedirectMessageModal}
          setIsRedirectMessageModal={setIsRedirectMessageModal}
          link={link}
        />
      )}
    </>
  );
};

export default MoveSuccess;
