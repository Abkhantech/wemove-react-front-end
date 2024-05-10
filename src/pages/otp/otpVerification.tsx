import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyConsumerOtp } from "../../redux/actions/consumer";
import { unwrapResult } from "@reduxjs/toolkit";
import { verifyDeliveryCarrierOtp } from "../../redux/actions/delivery-carrier";
import { verifyPickupCarrierOtp } from "../../redux/actions/pickup-carrier";
import WeMoveHeader from "../../components/header/weMoveHeader";
import { verifyLocalCarrierOtp } from "../../redux/actions/local-carrier";

const numberOfDigits = 6;

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = location.state || {};

  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const otpBoxReference = useRef<any[]>([]);

  function handleChange(value: any, index: any) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e: any, index: any) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  const varifyOTP = () => {
    setIsPageLoading(true);

    const otpString = otp.join("");

    const body = {
      phone_number:
        role === "consumer" ? user.phone_number : user.owner_phone_number,
      otp: otpString,
    };

    if (role === "consumer") {
      dispatch<any>(verifyConsumerOtp(body))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            const token = localStorage.getItem("jwtToken");
            const userObject = JSON.stringify(user);
            localStorage.setItem("user-object", userObject);
            localStorage.setItem("role", role);
            setTimeout(() => {
              setIsPageLoading(false);
              navigate(`/ConsumerDashboard/${user.id}`);
            }, 1300);
          }
        })
        .catch((err: any) => {
          setOtpError(err);
          setTimeout(() => {
            setIsPageLoading(false);
          }, 1300);
        });
    } else if (role === "delivery_carrier") {
      dispatch<any>(verifyDeliveryCarrierOtp(body))
        .then(unwrapResult)
        .then(async (res: any) => {
          if (res) {
            const token = localStorage.getItem("jwtToken");
            setTimeout(() => {
              setIsPageLoading(false);
              navigate(`/deliveryCarrierDashboard/${user.canonical_id}`);
            }, 1300);
          }
        })
        .catch((err: any) => {
          setOtpError(err);
          setTimeout(() => {
            setIsPageLoading(false);
          }, 1300);
        });
    } else if (role === "pickup_carrier") {
      dispatch<any>(verifyPickupCarrierOtp(body))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            const token = localStorage.getItem("jwtToken");
            setTimeout(() => {
              setIsPageLoading(false);
              navigate(`/pickupCarrierDashboard/${user.canonical_id}`);
            }, 1300);
          }
        })
        .catch((err: any) => {
          setOtpError(err);
          setTimeout(() => {
            setIsPageLoading(false);
          }, 1300);
        });
    } else if (role === "local_carrier") {
      dispatch<any>(verifyLocalCarrierOtp(body))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            const token = localStorage.getItem("jwtToken");
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
          }
        })
        .catch((err: any) => {
          setOtpError(err);
          setTimeout(() => {
            setIsPageLoading(false);
          }, 1300);
        });
    }
  };

  return (
    <>
      <WeMoveHeader />
      <Grid container>
        <Grid item xs={12} sm={8} md={5} mt={2} p={2} marginX={"auto"}>
          <Stack alignItems={"center"}>
            <Typography>OTP Verification</Typography>

            <Typography fontSize={12} mt={2} textAlign="start">
              {role === "consumer" && !user.Email_verified ? (
                <>an OTP has been sent to your Email</>
              ) : (
                <>an OTP has been sent to your phone</>
              )}
            </Typography>
            <Box display="flex" justifyContent="center">
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  type="text"
                  required
                  error={Boolean(otpError)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                  inputRef={(ref) => (otpBoxReference.current[index] = ref)}
                  inputProps={{
                    min: 0,
                    maxLength: 1,
                    style: {
                      background: "#5A7BFC14",
                      borderRadius: "8px",
                    },
                  }}
                  sx={{
                    width: 42,
                    marginLeft: 1,
                    marginTop: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#5A7BFC59",
                        borderWidth: "1.43",
                        borderRadius: "8px",
                      },
                    },
                  }}
                />
              ))}
            </Box>

            <Typography mt={2}>{otpError}</Typography>

            <Button
              variant="contained"
              type="submit"
              onClick={varifyOTP}
              sx={{
                marginTop: 5,
                height: 50,
                width: "50%",
                background: "#5858E0",
                fontSize: 12,
                fontWeight: 550,
              }}
            >
              Verify
            </Button>
          </Stack>
          {isPageLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isPageLoading}
              onClick={() => {
                setIsPageLoading(true);
              }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default OtpVerification;
