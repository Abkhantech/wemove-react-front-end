import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import movingTruck from "../../assets/images/moving_truck.svg";
import manPickingBoxes from "../../assets/images/man_picking_boxes.png";
import manPickingBoxes2 from "../../assets/images/Rectangle 100351.png";
import logoCube from '../../assets/logo/Group 15.png'
import logoWeMove from '../../assets/logo/WEMOVE.png'
import manPickingBoxes3 from "../../assets/images/4e0d89.jpg"
import { useState } from "react";
import PickupCarrierRegistrationModal from "../../components/modals/pickupCarrierRegistrationModal";
import DeliveryCarrierRegistrationModal from "../../components/modals/deliveryCarrierRegistrationModal";
import VerifyOtpModal from "../../components/modals/verifyOtpModal";
import BothCarriersModal from "../../components/modals/bothCarrierModal";
import { useDispatch } from "react-redux";
import { registerPickupCarrierWithFiles } from "../../redux/actions/pickup-carrier";
import { unwrapResult } from "@reduxjs/toolkit";
import LocalCarrierRegistrationModal from "../../components/modals/localCarrierRegistrationModal";
import { registerDeliveryCarrierWithFiles } from "../../redux/actions/delivery-carrier";
import { registerLocalCarrierWithFiles } from "../../redux/actions/local-carrier";
import OnBoardingSuccessModal from "../../components/modals/onboardingSuccessModal";
import WeMoveHeader from "../../components/header/weMoveHeader";


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
const StyledFileInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#5A7BFC59",
      borderWidth: "1",
      borderRadius: "8px",
    },
  },
  "& input": {
    color: "#71717A",
    background: "#5A7BFC14",
    borderRadius: "8px",
  },
}));

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const customCard = {
    width: 300,
    background: "#FAFAFA",
    borderRadius: 3,
    border: "1px #0000001A",
    mt: isMobile ? 2 : 0,
    ml: isMobile ? 0 : 2,
    marginX: isMobile ? "auto" : undefined,
  };
  const [
    pickupCarrierRegistrationModalVisible,
    setPickupCarrierRegistrationModalVisible,
  ] = useState(false);
  const [
    deliveryCarrierRegistrationModalVisible,
    setDeliveryCarrierRegistrationModalVisible,
  ] = useState(false);
  const [localCarrierModalVisible, setLocalCarrierModalVisible] =
    useState(false);
  const [localCarrierRegistrationModalVisible, setLocalCarrierRegistrationModalVisible] = useState(false)

  const [isVerifyOtpModal, setIsVerifyOtpModal] = useState(false);
  const [bothCarriersModalVisible, setBothCarriersModalVisible] =
    useState(false);
  const [ownerDriverLicense, setOwnerDriverLicense] = useState<any>(null);

  const dispatch = useDispatch();

  // const convertToFormData = (data: any) => {
  //   const formData = new FormData();

  //   for (const key of Object.keys(data)) {
  //     const value = data[key];

  //     if (value instanceof File) {
  //       // Directly append file objects
  //       formData.append(key, value);
  //     } else if (Array.isArray(value)) {
  //       // Handle arrays - assuming an array of strings or objects
  //       value.forEach((item, index) => {
  //         if (typeof item === "object" && item !== null) {
  //           // Handle nested objects in array
  //           for (const nestedKey of Object.keys(item)) {
  //             formData.append(
  //               `${key}[${index}][${nestedKey}]`,
  //               item[nestedKey]
  //             );
  //           }
  //         } else {
  //           // Handle array of primitives
  //           formData.append(`${key}[]`, item);
  //         }
  //       });
  //     } else if (typeof value === "object" && value !== null) {
  //       // Handle nested objects - assuming no nested files
  //       for (const nestedKey of Object.keys(value)) {
  //         formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
  //       }
  //     } else {
  //       // Append other data types as strings
  //       formData.append(key, value);
  //     }
  //   }

  //   return formData;
  // };
  
  const convertToFormData = (data: any) => {
    const formData = new FormData();
  
    const handleArray = (key: string, array: any[]) => {
      array.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          // Handle nested objects in array
          for (const nestedKey of Object.keys(item)) {
            if (Array.isArray(item[nestedKey])) {
              // Handle nested arrays of objects
              handleArray(`${key}[${index}][${nestedKey}]`, item[nestedKey]);
            } else {
              formData.append(
                `${key}[${index}][${nestedKey}]`,
                item[nestedKey].toString()
              );
            }
          }
        } else {
          // Handle array of primitives
          formData.append(`${key}[]`, item);
        }
      });
    };
  
    for (const key of Object.keys(data)) {
      const value = data[key];
  
      if (value instanceof File) {
        // Directly append file objects
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        // Handle arrays
        handleArray(key, value);
      } else if (typeof value === "object" && value !== null) {
        // Handle nested objects
        for (const nestedKey of Object.keys(value)) {
          formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
        }
      } else {
        // Append other data types as strings
        formData.append(key, value.toString());
      }
    }
    console.log(formData,'>>>>FORM DATA FROM FUNCTION')
    return formData;
  };
  const [onboardingSuccessModalVisible, setOnboardingSuccessModalVisible] = useState(false)
  const [doubleCarrierCreation, setDoubleCarrierCreation] = useState(false)
  const [completeDoubleCreation, setCompleteDoubleCreation] = useState(false)
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleCompleteRegistrationPickupCarrier = (payload: any) => {
    setIsLoading(true);
    const formData = convertToFormData(payload);
    console.log(formData,'--->>>FORM DATA')
    dispatch<any>(registerPickupCarrierWithFiles(formData))
      .then(unwrapResult)
      .then((res: any) => {
        console.log("response", res);
        console.log('out', doubleCarrierCreation)

        if(doubleCarrierCreation===false){
          console.log('in here')
          setIsLoading(false);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setIsVerifyOtpModal(true);
          }, 1500);
          return res;
        }else{
          setCompleteDoubleCreation(true)
        }
        })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleCompleteRegistrationDeliverypCarrier = (payload: any) => {
    setIsLoading(true);
    console.log(typeof payload.both,'-->')
    const formData = convertToFormData(payload);
    dispatch<any>(registerDeliveryCarrierWithFiles(formData))
      .then(unwrapResult)
      .then((res: any) => {
        console.log("response", res);
        if(completeDoubleCreation===true&& doubleCarrierCreation===true){
          setCompleteDoubleCreation(false);
          setDoubleCarrierCreation(false)
        }
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsVerifyOtpModal(true);
        }, 1500);
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleCompleteRegistrationLocalCarrier = (payload: any) => {
    setIsLoading(true);
    const formData = convertToFormData(payload);
    dispatch<any>(registerLocalCarrierWithFiles(formData))
      .then(unwrapResult)
      .then((res: any) => {
        console.log("response", res);
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsVerifyOtpModal(true);
        }, 1500);
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const handleClose = () => {
    setIsLoading(false);
  };
  const handleOpen = () => {
    setIsLoading(true);
  };
  return (
    <>
      {/* <WeMoveHeader/> */}
      <Grid container>
      <Grid item xs={12} sm={10} md={10} p={1}>
      <Stack p={1} alignItems={'center'} direction={'row'}>
        <img src={logoCube} width={50} height={50} alt="" />
              <img src={logoWeMove} width={230} height={35} alt="" />
        </Stack>
      </Grid>
        <Grid item xs={12} sm={10} md={10} p={1} marginX="auto">
          <Typography fontSize={18} fontWeight={700} color={"#262626"}>
            Select Your Carrier Option
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#828185"}>
            Choose one to continue
          </Typography>
          {onboardingSuccessModalVisible&&(
            <OnBoardingSuccessModal
            onboardingSuccessModalVisible={onboardingSuccessModalVisible}
            setOnboardingSuccessModalVisible={setOnboardingSuccessModalVisible}
            />
          )}
          {localCarrierRegistrationModalVisible&&(
            <LocalCarrierRegistrationModal
            isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSuccess={setSuccess}
              success={success}
              setIsVerifyOtpModal={setIsVerifyOtpModal}
              isVerifyOtpModal={isVerifyOtpModal}
              setOnboardingSuccessModalVisible={setOnboardingSuccessModalVisible}
            handleCompleteRegistrationLocalCarrier={handleCompleteRegistrationLocalCarrier}
            localCarrierRegistrationModalVisible={localCarrierRegistrationModalVisible}
            setLocalCarrierRegistrationModalVisible={setLocalCarrierRegistrationModalVisible}

            />
          )}
          {bothCarriersModalVisible && (
            <BothCarriersModal
            setOnboardingSuccessModalVisible={setOnboardingSuccessModalVisible}
            isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSuccess={setSuccess}
              success={success}
              setIsVerifyOtpModal={setIsVerifyOtpModal}
              isVerifyOtpModal={isVerifyOtpModal}
            completeDoubleCreation={completeDoubleCreation}
            setDoubleCarrierCreation={setDoubleCarrierCreation}
            handleCompleteRegistrationPickupCarrier={handleCompleteRegistrationPickupCarrier}
            handleCompleteRegistrationDeliverypCarrier={handleCompleteRegistrationDeliverypCarrier}
              bothCarriersModalVisible={bothCarriersModalVisible}
              setBothCarriersModalVisible={setBothCarriersModalVisible}
            />
          )}
          {pickupCarrierRegistrationModalVisible && (
            <PickupCarrierRegistrationModal
            setOnboardingSuccessModalVisible={setOnboardingSuccessModalVisible}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSuccess={setSuccess}
              success={success}
              setDoubleCarrierCreation={setDoubleCarrierCreation}
              setIsVerifyOtpModal={setIsVerifyOtpModal}
              isVerifyOtpModal={isVerifyOtpModal}
              pickupCarrierRegistrationModalVisible={
                pickupCarrierRegistrationModalVisible
              }
              setPickupCarrierRegistrationModalVisible={
                setPickupCarrierRegistrationModalVisible
              }
              handleCompleteRegistrationPickupCarrier={
                handleCompleteRegistrationPickupCarrier
              }
            />
          )}
          {deliveryCarrierRegistrationModalVisible && (
            <DeliveryCarrierRegistrationModal
            setOnboardingSuccessModalVisible={setOnboardingSuccessModalVisible}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSuccess={setSuccess}
            success={success}
            setIsVerifyOtpModal={setIsVerifyOtpModal}
            isVerifyOtpModal={isVerifyOtpModal}
            handleCompleteRegistrationDeliverypCarrier={handleCompleteRegistrationDeliverypCarrier}
              deliveryCarrierRegistrationModalVisible={
                deliveryCarrierRegistrationModalVisible
              }
              setDeliveryCarrierRegistrationModalVisible={
                setDeliveryCarrierRegistrationModalVisible
              }
            />
          )}
          <Box
            mt={3}
            display={isMobile ? "block" : "flex"}
            justifyContent={"center"}
          >
            <Card sx={customCard}>
              <CardMedia
                sx={{ height: 180 }}
                image={manPickingBoxes2}
                title="Moving Truck"
              />
              <CardContent>
                <Typography fontSize={16} fontWeight={700}>
                  Pickup Carrier
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    setPickupCarrierRegistrationModalVisible(true);
                  }}
                  variant="contained"
                  size="small"
                  sx={continueButton}
                >
                  Continue
                </Button>
              </CardActions>
            </Card>

            <Card sx={customCard}>
              <CardMedia
                sx={{ height: 180 }}
                image={movingTruck}
                title="Moving Truck"
              />
              <CardContent>
                <Typography fontSize={16} fontWeight={700}>
                  Delivery Carrier
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    setDeliveryCarrierRegistrationModalVisible(true);
                  }}
                  variant="contained"
                  size="small"
                  sx={continueButton}
                >
                  Continue
                </Button>
              </CardActions>
            </Card>

            <Card sx={customCard}>
              <CardMedia
                sx={{ height: 180 }}
                image={manPickingBoxes}
                title="Moving Truck"
              />
              <CardContent>
                <Typography fontSize={14} fontWeight={700}>
                  Pickup and Delivery Carrier
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    setBothCarriersModalVisible(true);
                  }}
                  variant="contained"
                  size="small"
                  sx={continueButton}
                >
                  Continue
                </Button>
              </CardActions>
            </Card>
            <Card sx={customCard}>
              <CardMedia
                sx={{ height: 180 }}
                image={manPickingBoxes3}
                title="Moving Truck"
              />
              <CardContent>
                <Typography fontSize={16} fontWeight={700}>
                  Local Carrier
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={()=>{
                  setLocalCarrierRegistrationModalVisible(true)
                }} variant="contained" size="small" sx={continueButton}>
                  Continue
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Stack sx={{marginTop:5, alignItems: isMobile? "flex-start":"center", justifyContent:'center'}}>
            <Typography fontSize={18} fontWeight={700} color={"#262626"}>
            You will need the following information for onboarding:
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
            - Tariff Document in PDF.
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
            - Owner's Drivers License Document in PDF.
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
            - Proof of Insurance Document in PDF.
          </Typography>
          <Stack spacing={1} direction={'row'} alignItems={'center'}>

          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
            - W9 Form in PDF.
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
            Need one?
          </Typography>
          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
          <a
                    href="https://we-move-staging.s3.amazonaws.com/Blank%20W9%20Form.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download here
                  </a>
          </Typography>
          </Stack>
          <Typography fontSize={14} fontWeight={600} color={"#262626"}>
            - Company Registered Name and Address.
          </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Register;
