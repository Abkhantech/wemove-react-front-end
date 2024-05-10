import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import movingTruck from "../../assets/images/moving_truck.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import DemoDP from "../../assets/images/demo_dp.png";
import { useState } from "react";
import WeMoveHeader from "../../components/header/weMoveHeader";

const payButton = {
  marginTop: 2,
  height: 50,
  backgroundColor: "#41A652",
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: 550,
  "&:hover": {
    opacity: 0.8,
    backgroundColor: "#41A652",
  },
};

const CarrierInfo = () => {
  const [value, setValue] = useState<number | null>(4);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.only("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <>
      <WeMoveHeader/>
      <Grid container>
        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          <Typography mt={1} fontSize={18} fontWeight={700} color={"#262626"}>
            Carrier has been assigned to you
          </Typography>
          <Box mt={2}>
            <img
              src={movingTruck}
              width={"100%"}
              height={isTablet ? 240 : undefined}
              alt=""
            />
          </Box>
          <Typography mt={2} fontSize={14} fontWeight={600} color={"#262626"}>
            About
          </Typography>
          <Typography mt={1} fontSize={12} fontWeight={400} color={"#667085"}>
            If the delivery driver is unable to get in front of your delivery
            destination, there may be an additional charge for a long carry (75
            feet or more away)
          </Typography>

          <Stack
            mt={2}
            p={1}
            direction={"row"}
            spacing={1}
            sx={{
              background: "#F2F4FF",
              borderRadius: 1,
              width: "fit-content",
            }}
          >
            <FacebookIcon />
            <LinkedInIcon />
            <YouTubeIcon />
            <WhatsAppIcon />
            <InstagramIcon />
            <TwitterIcon />
          </Stack>

          <Stack direction={"row"} spacing={1} mt={2}>
            <Stack
              p={1}
              sx={{
                width: 100,
                background: "#171745",
                borderRadius: 2,
              }}
            >
              <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                DOT Number
              </Typography>
              <Typography fontSize={14} color={"#FFFFFF"}>
                568154
              </Typography>
            </Stack>

            <Stack
              mt={2}
              p={1}
              sx={{
                width: 100,
                background: "#171745",
                borderRadius: 2,
              }}
            >
              <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                MC Number
              </Typography>
              <Typography fontSize={14} color={"#FFFFFF"}>
                568154
              </Typography>
            </Stack>
          </Stack>

          <Typography mt={2} fontSize={14} fontWeight={600} color={"#262626"}>
            Reviews
          </Typography>

          <Box p={1} sx={{ overflowX: "scroll", display: "flex" }}>
            <Stack direction={"row"} spacing={1}>
              <Card sx={{ maxWidth: 220, borderRadius: 3, flexShrink: 0 }}>
                <CardContent>
                  <Typography fontSize={10}>
                    Wemove is very helpfull they help me move my storage unit
                    hassel free
                  </Typography>

                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                    mt={2}
                  >
                    <Box mt={2}>
                      <img src={DemoDP} width={30} height={30} alt="" />
                    </Box>

                    <Stack>
                      <Typography fontSize={12}>Rakesh Kumar</Typography>
                      <Rating
                        name="read-only"
                        value={value}
                        readOnly
                        sx={{ fontSize: 14 }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ maxWidth: 220, borderRadius: 3, flexShrink: 0 }}>
                <CardContent>
                  <Typography fontSize={10}>
                    Wemove is very helpfull they help me move my storage unit
                    hassel free
                  </Typography>

                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                    mt={2}
                  >
                    <Box mt={2}>
                      <img src={DemoDP} width={30} height={30} alt="" />
                    </Box>

                    <Stack>
                      <Typography fontSize={12}>Rakesh Kumar</Typography>
                      <Rating
                        name="read-only"
                        value={value}
                        readOnly
                        sx={{ fontSize: 14 }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ maxWidth: 220, borderRadius: 3, flexShrink: 0 }}>
                <CardContent>
                  <Typography fontSize={10}>
                    Wemove is very helpfull they help me move my storage unit
                    hassel free
                  </Typography>

                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                    mt={2}
                  >
                    <Box mt={2}>
                      <img src={DemoDP} width={30} height={30} alt="" />
                    </Box>

                    <Stack>
                      <Typography fontSize={12}>Rakesh Kumar</Typography>
                      <Rating
                        name="read-only"
                        value={value}
                        readOnly
                        sx={{ fontSize: 14 }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            <Button
              sx={{
                ...payButton,
                width: isMobile ? "100%" : "70%",
              }}
            >
              Pay and book now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CarrierInfo;
