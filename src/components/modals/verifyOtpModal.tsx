import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import {
  CircularProgress,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import alertIcon from "../../assets/Icons/alert_icon.png";
import verifyIcon from "../../assets/Icons/verifyOtpIcon.svg";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { resendOtpForPickupCarrier, verifyPickupCarrierOtp } from "../../redux/actions/pickup-carrier";
import { resendOtpForDeliveryCarrier, verifyDeliveryCarrierOtp } from "../../redux/actions/delivery-carrier";
import { useNavigate } from "react-router-dom";
import { resendOtpForLocalCarrier, verifyLocalCarrierOtp } from "../../redux/actions/local-carrier";
import OnBoardingSuccessModal from "./onboardingSuccessModal";
const VerifyOtpModal = ({
  isVerifyOtpModal,
  setIsVerifyOtpModal,
  carrierPhoneNumber,
  role,
  setParentModal,
  setOnboardingSuccessModalVisible
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const handleInputAlertModal = () => setIsVerifyOtpModal(true);
  const handleClose = () => {
    setIsVerifyOtpModal(true);
  }
  const otpBoxReference = useRef<any[]>([]);
  const numberOfDigits = 6;
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const sendVerificationCodeToDeliveryCarrier = () => {
    const body = {
      phoneNumber: carrierPhoneNumber
    }
    dispatch<any>(resendOtpForDeliveryCarrier(body))
    .then(unwrapResult)
    .then((res:any)=>{
      setShowOtpSuccess(true);
      setTimeout(() => {
        setShowOtpSuccess(false)
      }, 1500);
    }).catch((err:any)=>{
      console.log(err)
    })
  }
  const sendVerificationCodeToPickupCarrier = () => {
    const body = {
      phoneNumber: carrierPhoneNumber
    }
    dispatch<any>(resendOtpForPickupCarrier(body))
    .then(unwrapResult)
    .then((res:any)=>{
      setShowOtpSuccess(true);
      setTimeout(() => {
        setShowOtpSuccess(false)
      }, 1500);
    }).catch((err:any)=>{
      console.log(err)
    })
  }
  const sendVerificationCodeToLocalCarrier = () => {
    const body = {
      phoneNumber: carrierPhoneNumber
    }
    dispatch<any>(resendOtpForLocalCarrier(body))
    .then(unwrapResult)
    .then((res:any)=>{
      setShowOtpSuccess(true);
      setTimeout(() => {
        setShowOtpSuccess(false)
      }, 1500);
    }).catch((err:any)=>{
      console.log(err)
    })
  }

  const handleResendCode = () => {
    if(role==='local'){
      sendVerificationCodeToLocalCarrier();
    }
    if(role==="delivery"){
      sendVerificationCodeToDeliveryCarrier();
    }
    if(role==="pickup"){
      sendVerificationCodeToPickupCarrier();
    }
    setIsButtonDisabled(true);
    setTimer(30); 
  };
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
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("")
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const verifyThisCarrier = () => {
    setIsLoading(true);
    const otpString = otp.join("");
    if(otpString.length!==6){
      setErrorMessage("Please enter complete verification code")
    }else{

    console.log(carrierPhoneNumber)
    const body = {
      phone_number: carrierPhoneNumber,
      otp: otpString,
    };
    if (role === "pickup") {
      dispatch<any>(verifyPickupCarrierOtp(body))
        .then(unwrapResult)
        .then((res: any) => {
          if (res === true) {
            const token = localStorage.getItem("jwtToken");
            setSuccess(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
            setTimeout(() => {
              setSuccess(false);
              setParentModal(false);
              setOnboardingSuccessModalVisible(true)
              setIsVerifyOtpModal(false);
            }, 3000);
          }
        })
        .catch((err: any) => {
          setOtpError(err);
          setIsLoading(false);
          setTimeout(() => {
            setOtpError("");
          }, 2500);
        });
    }
    if (role === "delivery") {
        console.log('in delivery')
      dispatch<any>(verifyDeliveryCarrierOtp(body))
        .then(unwrapResult)
        .then(async (res: any) => {
          if (res === true) {
            const token = localStorage.getItem("jwtToken");
            setSuccess(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
            setTimeout(() => {
              setSuccess(false);
              setParentModal(false);
              setOnboardingSuccessModalVisible(true)
              setIsVerifyOtpModal(false);
            }, 3000);
          }
        })
        .catch((err: any) => {
          setOtpError(err);
          setIsLoading(false);
          setTimeout(() => {
            setOtpError("");
          }, 2500);
        });
    }
    if (role === "local") {
      console.log('in local')
    dispatch<any>(verifyLocalCarrierOtp(body))
      .then(unwrapResult)
      .then(async (res: any) => {
        if (res === true) {
          const token = localStorage.getItem("jwtToken");
          setSuccess(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          setTimeout(() => {
            setSuccess(false);
            setParentModal(false);
            setOnboardingSuccessModalVisible(true)
            setIsVerifyOtpModal(false);
          }, 3000);
        }
      })
      .catch((err: any) => {
        setOtpError(err);
        setIsLoading(false);
        setTimeout(() => {
          setOtpError("");
        }, 2500);
      });
  }
}
  };
  useEffect(()=>{
    if(errorMessage!==""){
      setTimeout(()=>{
        setErrorMessage("")
      },2500)
    }
  },[errorMessage])
  const [timer, setTimer] = useState(30); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showOtpSuccess, setShowOtpSuccess] = useState(false)
  useEffect(() => {
    let countdown:any;

    const startTimer = () => {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(countdown);
            setIsButtonDisabled(false); // Enable the button when the timer reaches zero
          }
          return prevTimer - 1;
        });
      }, 1000);
    };

    if (isButtonDisabled) {
      // Start the timer when isButtonDisabled is true
      startTimer();
    }

    return () => {
      // Cleanup: clear the interval when the component unmounts
      clearInterval(countdown);
    };
  }, [isButtonDisabled]);
  return (
    <>
      <Modal
        open={isVerifyOtpModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: '80vw', md: '50vw', lg: '35vw' },
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3,
        }}
        >
          {isLoading && (
            <Stack alignItems={"center"} alignSelf={"center"}>
              <CircularProgress />
            </Stack>
          )}
          {showOtpSuccess&&(
            <Alert severity="success">verification code sent successfully!</Alert>
          )}
          {success && (
            <Alert severity="success">Email verified successfully!</Alert>
          )}
            {errorMessage!==""&&(
              <Typography textAlign={'center'} fontWeight={600} fontSize={18} color={'#5858E0'}>
              {errorMessage}
          </Typography>
            )}
          <Stack alignSelf={"center"} alignItems={"center"}>
            <img width={200} src={verifyIcon} alt="" />
            <Typography
              textAlign={"center"}
              fontSize={22}
              fontWeight={600}
              color={"#5858E0"}
            >
              Please wait. You will receive a verification code on your email soon.
            </Typography>
          </Stack>
          <Box mb={2} display="flex" justifyContent="center">
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
          <Stack alignItems={'center'}>
      <Typography fontWeight={600} fontSize={12}>
        Did not receive the code? {isButtonDisabled? '00:'+timer: ""} 
      </Typography>
      <Button onClick={handleResendCode} disabled={isButtonDisabled} sx={{ alignItems: 'center', alignSelf: 'center' }}>
        <Typography fontWeight={600} fontSize={12}>
          Resend code
        </Typography>
      </Button>
    </Stack>
          {otpError !== "" && (
            <Typography
              alignSelf={"center"}
              textAlign={"center"}
              fontSize={20}
              fontWeight={600}
              color={"#FF0000"}
            >
              {otpError.toUpperCase()}
            </Typography>
          )}
          <Stack spacing={2} alignItems="center">
            <Button
              onClick={() => {
                verifyThisCarrier();
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
              Verify
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default VerifyOtpModal;
