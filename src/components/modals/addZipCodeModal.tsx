import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  InputAdornment,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const AddZipCodeModal = ({
  addZipCodeModal,
  setAddZipCodeModal,
  statePayload,
  setStatePayload,
  infoForState,
  companyPhoneNumber,
  ownerName
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
useEffect(()=>{
  console.log('NEW PAYLOAD --->',statePayload)
},[statePayload])
  const handleZipCodeModal = () => setAddZipCodeModal(true);
  const handleClose = () => setAddZipCodeModal(false);
  const [numberOfFields, setNumberOfFields] = useState(0);
  const handleInputPhoneNumber = (event: any, setPhoneNumber: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 10;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setPhoneNumber(inputValue);
    event.target.value = inputValue;
  };
  const [statePhoneNumber, setStatePhoneNumber] = useState("");
  const [pointOfContactName, setPointOfContactName] = useState("");
  const [zipCodes, setZipCodes] = useState(
    Array.from({ length: numberOfFields }, () => "")
  );
const [zipCodeObjects, setZipCodeObjects] = useState<any>([])
  const handleZipCodeInput = (event: any, index: any) => {
    let inputValue = event.target.value;

    // Truncate input to 5 digits if it exceeds
    if (inputValue.length > 5) {
      inputValue = inputValue.slice(0, 5);
    }
    const newZipCodes = [...zipCodes];
    newZipCodes[index] = inputValue;
    setZipCodes(newZipCodes);
  };
useEffect(()=>{
if(zipCodeObjects.length!==0){

  if (zipCodes.length !== 0) {
    const updatedStatePayload = statePayload.map((stateInfo:any) => {
      if (stateInfo.pickup_service_state === infoForState) {
        let updatedZipCodes;
      
        if (stateInfo.zip_codes.length !== 0) {
          // If zip_codes already has elements, append zipCodeObjects to it
          updatedZipCodes = [...stateInfo.zip_codes, ...zipCodeObjects];
        } else {
          // If zip_codes is empty, use zipCodeObjects as is
          updatedZipCodes = zipCodeObjects;
        }
      
        // Update the zip_codes array for the matching state
        return {
          ...stateInfo,
          point_of_contact_name: pointOfContactName ? pointOfContactName : ownerName,
          point_of_contact_phone_number: statePhoneNumber
            ? statePhoneNumber
            : companyPhoneNumber,
          zip_codes: updatedZipCodes,
        };
      }
      
      return stateInfo;
    });
    console.log('here')
    setStatePayload(updatedStatePayload);
  } else {
    const updatedStatePayload = statePayload.map((stateInfo:any)=>{
      if(stateInfo.pickup_service_state === infoForState){
        return {
          ...stateInfo,
        point_of_contact_name:pointOfContactName? pointOfContactName:ownerName,
        point_of_contact_phone_number: statePhoneNumber? statePhoneNumber: companyPhoneNumber
      }
    }
  })
  setStatePayload(updatedStatePayload);
}
setMessage("Information added successfully.");
    setTimeout(() => {
      setAddZipCodeModal(false);
    }, 1000);
}
},[zipCodeObjects])
  const handleAddZipCode = () => {
    setNumberOfFields(numberOfFields + 1);
    setZipCodes([...zipCodes, ""]);
  };
  const [message, setMessage] = useState("");
  const handlePayLoad = () => {
    if(zipCodes.length!==0){
      zipCodes.map((code:any)=>{
        const thisObject = {
          zip_code:code
        }
        setZipCodeObjects((prevCodes:any)=>[...prevCodes,thisObject])
      })
    }
  };
  return (
    <>
      <Modal
        open={addZipCodeModal}
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
            width: isMobile ? "25vw" : "15vw",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Button onClick={handleAddZipCode}>
              <Stack direction={"row"} alignItems={"center"}>
                <Typography fontSize={10} fontWeight={600} color={"#5858E0"}>
                  Add Zip Code
                </Typography>
                <AddCircleOutlineIcon fontSize="small" />
              </Stack>
            </Button>

            {numberOfFields !== 0 &&
              Array.from({ length: numberOfFields }).map((_, index) => (
                <TextField
                  key={index}
                  value={zipCodes[index]}
                  onInput={(e) => handleZipCodeInput(e, index)}
                  variant="outlined"
                  type="number"
                  label={`Zip Code ${index + 1}`}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 5,
                  }}
                  sx={{ width: 200 }}
                  size="small"
                  required
                />
              ))}
            <TextField
              variant="outlined"
              type="text"
              label="Point of Contact Name"
              sx={{ width: 200 }}
              size="small"
              required
              onChange={(e) => setPointOfContactName(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              onChange={(event) =>
                handleInputPhoneNumber(event, setStatePhoneNumber)
              }
              type="text"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              sx={{ width: 200 }}
              size="small"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+1</InputAdornment>
                ),
              }}
            />
            {message !== "" && (
              <Typography fontSize={12} fontWeight={600} color={"#008000"}>
                {message}
              </Typography>
            )}
            <Button
              onClick={() => {
                handlePayLoad();
                // console.log(statePayload)
              }}
              sx={{
                width: 20,
                height: 40,
                borderRadius: 40,
                backgroundColor: "#5858E0 !important",
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 550,
                border: "1px solid #6552FF",
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddZipCodeModal;
