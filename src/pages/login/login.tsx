import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { consumerLogin } from "../../redux/actions/consumer";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pickupCarrierLogin } from "../../redux/actions/pickup-carrier";
import { deliveryCarrierLogin } from "../../redux/actions/delivery-carrier";
import { localCarrierLogin } from "../../redux/actions/local-carrier";
import logoCube from "../../assets/logo/Group 15.png";
import logoWeMove from "../../assets/logo/WEMOVE.png";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const isMobileOrTab = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  const validatePhoneNumber = (phoneNumber: any) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handlePhoneNoChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, "");
    const maxLength = 10;

    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }

    setPhoneNo(inputValue);

    if (inputValue.length !== maxLength) {
      setPhoneNoError("Please enter a valid 10-digit phone number");
    } else {
      setPhoneNoError("");
    }
  };
  // const handlePhoneNoChange = (e: any) => {
  //   const newPhoneNumber = e.target.value;
  //   setPhoneNo(newPhoneNumber);
  //   if (!validatePhoneNumber(newPhoneNumber)) {
  //     setPhoneNoError("Please enter a valid 10-digit phone number");
  //   } else {
  //     setPhoneNoError("");
  //   }
  // };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (validatePhoneNumber(phoneNo) && role !== "") {
      setIsPageLoading(true);

      const fullPhoneNo = "+1" + phoneNo;
      const body = {
        phone_number: fullPhoneNo,
      };

      if (role === "consumer") {
        dispatch<any>(consumerLogin(body))
          .then(unwrapResult)
          .then((res: any) => {
            if (res) {
              const user = res;
              setTimeout(() => {
                setIsPageLoading(false);
                navigate("/otpVerificaion", {
                  state: { user: user, role: "consumer" },
                });
              }, 1300);
            }
          })
          .catch((err: any) => {
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
            setPhoneNoError(err);
          });
      } else if (role === "delivery_carrier") {
        dispatch<any>(deliveryCarrierLogin(body))
          .then(unwrapResult)
          .then((res: any) => {
            if (res) {
              const user = res;
              setTimeout(() => {
                setIsPageLoading(false);
                navigate("/otpVerificaion", {
                  state: { user: user, role: "delivery_carrier" },
                });
              }, 1300);
            }
          })
          .catch((err: any) => {
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
            setPhoneNoError(err);
          });
      } else if (role === "pickup_carrier") {
        dispatch<any>(pickupCarrierLogin(body))
          .then(unwrapResult)
          .then((res: any) => {
            if (res) {
              const user = res;
              setTimeout(() => {
                setIsPageLoading(false);
                navigate("/otpVerificaion", {
                  state: { user: user, role: "pickup_carrier" },
                });
              }, 1300);
            }
          })
          .catch((err: any) => {
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
            setPhoneNoError(err);
          });
      } else if (role === "local_carrier") {
        dispatch<any>(localCarrierLogin(body))
          .then(unwrapResult)
          .then((res: any) => {
            if (res) {
              const user = res;
              setTimeout(() => {
                setIsPageLoading(false);
                navigate("/otpVerificaion", {
                  state: { user: user, role: "local_carrier" },
                });
              }, 1300);
            }
          })
          .catch((err: any) => {
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
            setPhoneNoError(err);
          });
      }
    } else {
      setTimeout(() => {
        setIsPageLoading(false);
      }, 1300);
      setPhoneNoError("Please enter a valid 10-digit phone number");
    }
  };

  useEffect(() => {
    setRole("consumer");
    const phoneNumber: any = localStorage.getItem("consumerPhoneNo");
    if (phoneNumber) {
      const formattedPhoneNumber = phoneNumber.replace(/^\+1/, "");
      setPhoneNo(formattedPhoneNumber);
    }
  }, []);

  return (
    <>
      <Grid
        container
        spacing={1}
        p={3}
        height={"101vh"}
        sx={{
          background:
            "linear-gradient(170deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          marginX={"auto"}
          sx={{
            background: "#FFFFFF",
            borderTop: "4px solid #5858E0",
            borderRadius: 4,
          }}
        >
          <Box p={isMobile ? 2 : 5}>
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              direction={"row"}
              mt={3}
            >
              <img src={logoCube} width={30} height={30} alt="" />
              <img src={logoWeMove} width={110} height={18} alt="" />
            </Stack>
            <Typography
              mt={3}
              mb={5}
              fontSize="26px"
              fontWeight={600}
              textAlign={"center"}
            >
              Welcome To Wemove
            </Typography>

            <form onSubmit={handleFormSubmit} autoComplete="off">
              <FormGroup>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Login as
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Login as"
                    onChange={handleSelectChange}
                    required
                  >
                    <MenuItem value={"consumer"}>Consumer</MenuItem>
                    {/* <MenuItem value={"pickup_carrier"}>
                      Pick-up Carrier
                    </MenuItem>
                    <MenuItem value={"delivery_carrier"}>
                      Delivery Carrier
                    </MenuItem>
                    <MenuItem value={"local_carrier"}>Local Carrier</MenuItem> */}
                  </Select>

                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    type="text"
                    value={phoneNo}
                    fullWidth
                    margin="normal"
                    size="small"
                    onChange={handlePhoneNoChange}
                    error={Boolean(phoneNoError)}
                    helperText={phoneNoError}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+1</InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      marginTop: 6,
                      height: 50,
                      backgroundColor: "#5858E0",
                      color: "#FFFFFF",
                      borderColor: "#6552FF",
                      fontSize: 12,
                      fontWeight: 550,
                      width: 150,
                      ml: "auto",
                    }}
                  >
                    Login
                  </Button>
                </FormControl>
              </FormGroup>
            </form>
            {isPageLoading && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isPageLoading}
                onClick={() => {
                  setIsPageLoading(true);
                }}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          p={2}
          marginX={"auto"}
          alignContent={"center"}
          sx={{
            borderRadius: 4,
            display: isMobileOrTab ? "none" : undefined,
          }}
        >
          <Box p={isMobile ? 2 : 5}>
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              direction={"row"}
              mt={3}
            >
              <img src={logoCube} width={100} height={100} alt="" />
              <img src={logoWeMove} width={310} height={60} alt="" />
            </Stack>
            <Typography
              mt={3}
              mb={5}
              fontSize="30px"
              fontWeight={600}
              textAlign={"center"}
              sx={{ letterSpacing: -1, m: 1 }}
            >
              Moving Made Easy
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
