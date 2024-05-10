import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import logoCube from '../../assets/logo/Group 15.png'
import logoWeMove from '../../assets/logo/WEMOVE.png'
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getConsumerById,
  updateConsumerById,
} from "../../redux/actions/consumer";
import { unwrapResult } from "@reduxjs/toolkit";
import { createThieMoveRequest, getAllMoveRequestsByConsumerID } from "../../redux/actions/move-request";
import OutOfStateMoveModal from "../../components/modals/outOfStateMoveModal";
import ServiceSelectionModal from "../../components/modals/serviceSelectionModal";
import ApartmentOnlyModal from "../../components/modals/apartmentOnlyModal";
import ComboApartmentStorageModal from "../../components/modals/comboApartmentStorageModal";
import HomeStorageCombo from "../../components/modals/homeStorageCombo";
import HomeOrTownOnlyModal from "../../components/modals/homeOrTownOnlyModal";
import StorageOnlyModal from "../../components/modals/storageOnlyModal";

const ConsumerDashboard = () => {
  const [value, setValue] = useState(0);
  const { consumerId } = useParams();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const dispatch = useDispatch();
  const [consumer, setConsumer] = useState<any>();
  const [outOfStateMoveModalVisible, setOutOfStateMoveModalVisible] = useState(false)

  const fetchThisConsumer = () => {
    dispatch<any>(getConsumerById(Number(consumerId)))
      .then(unwrapResult)
      .then((consumer: any) => {
        setConsumer(consumer);
        setUpdateFirstName(consumer?.first_name);
        setUpdateLastName(consumer?.last_name);
        setUpdateEmail(consumer?.email);
        setUpdatePhoneNumber(consumer?.phone_number);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const updateThisConsumer = (body: any) => {
    const params = {
      consumerId: Number(consumerId),
      ...body,
    };
    dispatch<any>(updateConsumerById(params))
      .then(unwrapResult)
      .then((updatedConsumer: any) => {
        console.log(updatedConsumer, "<<<<<<<<");
        setConsumer(updatedConsumer);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const [allMoveRequests, setAllMoveRequests] = useState<any>([]);

  const fetchAllMoveReuqests = () => {
    dispatch<any>(getAllMoveRequestsByConsumerID(Number(consumerId)))
      .then(unwrapResult)
      .then((moveRequests: any) => {
        setAllMoveRequests(moveRequests);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    fetchThisConsumer();
    fetchAllMoveReuqests();
    setTimeout(() => {
      setIsLoading(false);
    }, 1300);
  }, []);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState("");
  const handleOpen = () => setShowEditProfileModal(true);
  const handleClose = () => setShowEditProfileModal(false);
  const [pendingMoveRequests, setPendingMoveRequests] = useState(false);
  const [completedMoveRequests, setCompletedMoveRequests] = useState(false);
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "6px solid #5858E0",
    boxShadow: 24,
    p: 4,
  };
  const navigate = useNavigate();

  const navigateToLastLeft = (moveRequest: any) => {
    console.log(moveRequest.canonical_id);
    if (!moveRequest.delivery_details) {
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    } else {
      if (moveRequest.delivery_details?.delivery_addresses?.length === 0) {
        console.log("navigate to address screen");
        navigate(`/AddressInfo/${moveRequest.canonical_id}`);
      } else {
        if (
          moveRequest.delivery_details?.delivery_addresses[0].stiars_present ===
            null ||
          moveRequest.delivery_details?.delivery_addresses[0]
            .is_elevator_accessible === null
        ) {
          navigate(`/DeliveryLocationInfo/${moveRequest.canonical_id}`);
        } else {
          if (moveRequest.delivery_details?.packagaing_required === null) {
            console.log("navigating to packages screen");
            navigate(`/packages/${moveRequest.canonical_id}`);
          } else {
            if (
              moveRequest.pickup_date_from === null &&
              moveRequest.pickup_date_to === null
            ) {
              console.log("navigating to Date range screen");
              navigate(`/PickupDate/${moveRequest.canonical_id}`);
            } else {
              if (moveRequest.delivery_details.open_location === null) {
                console.log("navigating to Truck Info screen");
                navigate(`/TruckInfo/${moveRequest.canonical_id}`);
              } else {
                if (moveRequest.items?.length === 0) {
                  console.log(moveRequest.items.length, "LENGTHHHH");
                  console.log("navigating to Inventory screen");
                  navigate(`/itemsInfo/${moveRequest.canonical_id}`);
                }
              }
            }
          }
        }
      }
    }
  };

  const calculateTotalCubicFeet = (thisMove:any) => {
    let total = 0;
    if(thisMove.items?.length!==0){
      thisMove.items.map((item:any)=>{
       total += item.item_width*item.item_height*item.item_length
      })
    }
    return total;
  }
  const [moveType, setMoveType] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [isApartmenOnlyModal, setIsApartmenOnlyModal] = useState(false);
  const [comboApartmentStorageModalVisible, setComboApartmentStorageModalVisible] = useState(false)
  const [isHomeStorageComboModal, setIsHomeStorageComboModal] = useState(false);
  const [homeOnlyModalVisible, setHomeOnlyModalVisible] = useState(false)
  const [storageOnlyModalVisible, setStorageOnlyModalVisible] = useState(false);
  const createMoveRequest = (body: any) => {
    setIsLoading(true)
    const params = {
      consumerId: consumer.id,
      body: body,
    };
    console.log(params);
    dispatch<any>(createThieMoveRequest(params))
      .then(unwrapResult)
      .then((res: any) => {
        setThisMoveRequest(res);
        setIsLoading(false)
        console.log(res, "created new");
        if(isServiceSelectionModal===true){
          setOutOfStateMoveModalVisible(true);
          setIsServiceSelectionModal(false)
        }else{
          if(outOfStateMoveModalVisible===true &&moveType==='apartment-only'){
            setOutOfStateMoveModalVisible(false)
            setIsApartmenOnlyModal(true)
          }
          else{   
            if(outOfStateMoveModalVisible===true && moveType === 'combo-apartment-storage'){
              setOutOfStateMoveModalVisible(false)
              setComboApartmentStorageModalVisible(true);
            }
            else{
              if(outOfStateMoveModalVisible===true && moveType === 'combo-home-storage'){
                setOutOfStateMoveModalVisible(false)
                setIsHomeStorageComboModal(true)
              }else{
                if(outOfStateMoveModalVisible===true && moveType === 'home-only'){
                  setOutOfStateMoveModalVisible(false)
                  setHomeOnlyModalVisible(true)
                }else{
                  if(outOfStateMoveModalVisible===true && moveType === 'storage-only'){
                    setOutOfStateMoveModalVisible(false);
                    setStorageOnlyModalVisible(true);
                  }else{
                    if(res.location_type==='storage-only'){
                      navigate(`/addressInfo/${thisMoveRequest.canonical_id}`)
                    }else{
                      console.log('navigating')
                      navigate(`/video-guidelines/${thisMoveRequest.canonical_id}`);
                    }
                  }
                }
              }
            }
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false)
        console.log(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user-object');
    localStorage.removeItem('role');
    navigate('/Login')
  }

  const checkFromAddress = (moveReq:any) => {
    if(moveReq.home_address!==null){
      return moveReq.home_address;
    }
    if(moveReq.apartment!==null){
      return moveReq.apartment?.apt_address;
    }
    if(moveReq.storage!==null){
      return moveReq.storage?.address;
    }
    if(moveReq.combo_home_storage!==null){
      return moveReq.combo_home_storage?.home_address.toString() +'/'+ moveReq.combo_home_storage.storage?.address.toString();
    }
    if(moveReq.combo_apartment_storage!==null){
      return moveReq.combo_apartment_storage?.apartment?.apt_address.toString() + '/' + moveReq.combo_apartment_storage?.storage?.address.toString();
    }
  }
  const [isServiceSelectionModal, setIsServiceSelectionModal] = useState(false);
  
  const [thisMoveRequest, setThisMoveRequest] = useState<any>(null);

  return (
    <>
      {/* <Grid container mt={2} mb={2} p={1}> */}
      {/* <Grid item xs={6} mb={2} justifyContent={"flex-start"}> */}

      <Modal
        open={showEditProfileModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{ fontWeight: 600, mb: "15px" }}
            variant="h5"
            component="h2"
          >
            Edit Profile
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      First Name
    </Typography> */}
          <Stack spacing={2}>
            <TextField
              label="First Name"
              variant="outlined"
              value={updateFirstName}
              fullWidth
              margin="normal"
              required
              onChange={(e) => setUpdateFirstName(e.target.value)}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={updateLastName}
              fullWidth
              margin="normal"
              required
              onChange={(e) => setUpdateLastName(e.target.value)}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={updateEmail}
              fullWidth
              margin="normal"
              required
              onChange={(e) => setUpdateEmail(e.target.value)}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              type="number"
              // value={updatePhoneNumber? updatePhoneNumber:consumer?.phone_number.toString()}
              fullWidth
              margin="normal"
              required
              onChange={(e) => setUpdatePhoneNumber(e.target.value)}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+1</InputAdornment>
                ),
              }}
            />
            <Button
              onClick={() => {
                updateThisConsumer({
                  email: updateEmail,
                  first_name: updateFirstName,
                  last_name: updateLastName,
                  phone_number: `+1${updatePhoneNumber}`,
                });
                handleClose();
              }}
              sx={{
                alignSelf: "center",
                width: "50%",
                borderColor: "#5858E0",
                bgcolor: "#5858E0",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#5858E0",
                },
              }}
              variant="outlined"
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Modal>
      {isServiceSelectionModal&&(
        <ServiceSelectionModal
        isServiceSelectionModal={isServiceSelectionModal}
        setIsServiceSelectionModal={setIsServiceSelectionModal}
        createMoveRequest={createMoveRequest}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        />
      )}
      {outOfStateMoveModalVisible && (
        <OutOfStateMoveModal
          outOfStateMoveModalVisible={outOfStateMoveModalVisible}
          setOutOfStateMoveModalVisible={setOutOfStateMoveModalVisible}
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          moveType={moveType}
          setMoveType={setMoveType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {isApartmenOnlyModal&&(
        <ApartmentOnlyModal
        isApartmenOnlyModal={isApartmenOnlyModal}
        setIsApartmenOnlyModal={setIsApartmenOnlyModal}
        createMoveRequest={createMoveRequest}
        thisMoveRequest={thisMoveRequest}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        />
      )}
      {comboApartmentStorageModalVisible&&(
        <ComboApartmentStorageModal
        comboApartmentStorageModalVisible={comboApartmentStorageModalVisible}
        setComboApartmentStorageModalVisible={setComboApartmentStorageModalVisible}
        createMoveRequest={createMoveRequest}
        thisMoveRequest={thisMoveRequest}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        />
      )}
      {isHomeStorageComboModal&&(
        <HomeStorageCombo
        isHomeStorageComboModal={isHomeStorageComboModal}
        setIsHomeStorageComboModal={setIsHomeStorageComboModal}
        createMoveRequest={createMoveRequest}
        thisMoveRequest={thisMoveRequest}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        />
      )}
      {homeOnlyModalVisible&&(
        <HomeOrTownOnlyModal
        homeOnlyModalVisible={homeOnlyModalVisible}
        setHomeOnlyModalVisible={setHomeOnlyModalVisible}
        createMoveRequest={createMoveRequest}
        thisMoveRequest={thisMoveRequest}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        />
      )}
      {storageOnlyModalVisible&&(
        <StorageOnlyModal
        storageOnlyModalVisible={storageOnlyModalVisible}
        setStorageOnlyModalVisible={setStorageOnlyModalVisible}
        createMoveRequest={createMoveRequest}
        thisMoveRequest={thisMoveRequest}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        />
      )}
       
      <Stack marginY={'1%'} direction={'row'} justifyContent={'space-between'}>
        <Stack alignItems={'center'} direction={'row'}>
        <img src={logoCube} width={60} height={60} alt="" />
              <img src={logoWeMove} width={240} height={40} alt="" />
        </Stack>
        <Button
              onClick={() => {
                handleLogout();
              }}
              sx={{
                marginX:1,
                alignSelf: "center",
                width: "10%",
                borderColor: "#5858E0",
                bgcolor: "#5858E0",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#5858E0",
                },
              }}
              variant="outlined"
            >
              LOGOUT
            </Button>
        
      </Stack>
      <Box mb={1} bgcolor={"#5858E0"}>
        <Typography
          fontWeight={700}
          fontSize={30}
          color={"#FFFFFF"}
          textAlign="center"
        >
          Consumer Dashboard
        </Typography>
      </Box>
      {/* </Grid> */}

      <Grid container p={1}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2} justifyContent={"flex-start"}>
            <Box display={"flex"} marginBottom={2}>
              <Button
                onClick={() => {
                  handleOpen();
                }}
                sx={{
                  borderColor: "#5858E0",
                  bgcolor: "#5858E0",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#FFFFFF",
                    color: "#5858E0",
                  },
                }}
                variant="outlined"
              >
                Edit Profile
              </Button>
            </Box>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Avatar
                alt=""
                src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/avatar-icon.png"
              />
              <Typography fontWeight={700} fontSize={14} color={"#374145"}>
                {consumer?.first_name ? consumer.first_name : ""}{" "}
                {consumer?.last_name ? consumer.last_name : ""}
              </Typography>
            </Stack>
            <Box marginX={8} display={"flex"}>
              <Typography fontWeight={700} fontSize={14} color={"#374145"}>
                Emai: {consumer?.email ? consumer.email : ""}
              </Typography>
            </Box>
            <Box display={"flex"}>
              <Typography fontWeight={700} fontSize={14} color={"#374145"}>
                Phone: {consumer?.phone_number ? consumer.phone_number : ""}
              </Typography>
            </Box>
          </Stack>
          
        </Grid>
      </Grid>
        <Stack
            display={"flex"}
            justifyContent={"center"}
            direction={'row'}
            spacing={2}
            alignItems={'center'}
            marginBottom={2}
            marginX={1}
          >
            <Typography fontWeight={500} fontSize={16}>ARE YOU READY TO MAKE A MOVE? LET'S GO!</Typography>
            <Button
              onClick={() => {
                setIsServiceSelectionModal(true)
              }}
              sx={{
                borderColor: "#5858E0",
                bgcolor: "#5858E0",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#5858E0",
                },
              }}
              variant="outlined"
            >
              Start a new Move
            </Button>
          </Stack>
      <Divider />
      <Grid mt={2} item xs={12} md={6}>
        <Stack>
          

          {!pendingMoveRequests && !completedMoveRequests && (
            <Typography
              sx={{ textDecoration: "underline" }}
              fontWeight={"600"}
              fontSize={20}
              alignSelf={"center"}
            >
              MOVE REQUESTS
            </Typography>
          )}

<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{backgroundColor:'#5858E0'}}>
          <TableRow>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Move Order #</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>From Address</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>To Address</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Pick-up Date</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>FADD</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Total cubic-feet</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Total Payment</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Total Deposit Paid</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Balance Due</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Carrier Name</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Carrier Phone</TableCell>
            <TableCell align="center" sx={{fontWeight:"600",fontSize:12}}>Info Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allMoveRequests.map((thisRequest:any)=>
            (
              <TableRow
              key={thisRequest.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{fontWeight:"600"}} align="center">
                {thisRequest.move_order_number}
              </TableCell>
              <TableCell align="center">{checkFromAddress(thisRequest)}</TableCell>
              <TableCell align="center">{thisRequest.delivery_details?.delivery_addresses?.length? thisRequest.delivery_details.delivery_addresses[0].complete_address:'NaN'}</TableCell>
              <TableCell align="center">{thisRequest.pickup_date_from ? (
    new Date(thisRequest.pickup_date_from).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  ) : (
    'NaN'
  )} - {thisRequest.pickup_date_to ? (
    new Date(thisRequest.pickup_date_to).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  ) : (
    'NaN'
  )}</TableCell>
              <TableCell align="center">{thisRequest.first_available_date_of_delivery ? (
    new Date(thisRequest.first_available_date_of_delivery).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  ) : (
    'NaN'
  )}</TableCell>
              <TableCell align="center">{thisRequest.total_cubic_feet? thisRequest.total_cubic_feet:'NaN'}</TableCell>
              <TableCell align="center">{thisRequest.move_payment? thisRequest.move_payment:'NaN'}</TableCell>
              <TableCell align="center">30%</TableCell>
              <TableCell align="center">70%</TableCell>
              <TableCell align="center">{thisRequest.pickup_carrier? thisRequest.pickup_carrier?.company_name:'Not Assigned'}</TableCell>
              <TableCell align="center">{thisRequest.pickup_carrier? thisRequest.pickup_carrier?.owner_phone_number:'-'}</TableCell>
              <TableCell sx={{fontWeight:"600",fontSize:12}}>
              {(

                thisRequest.delivery_details === null ||
                thisRequest.delivery_details?.delivery_addresses?.length === 0 ||
                thisRequest.delivery_details?.packagaing_required===null ||
                thisRequest.pickup_date_from === null ||
                thisRequest.pickup_date_to === null ||
                thisRequest.delivery_details?.open_location === null ||
                thisRequest.items?.length === 0
                )?
                (
              <Button
              onClick={() => {
                navigateToLastLeft(thisRequest);
              }}
              sx={{
                borderColor: "#5858E0",
                bgcolor: completedMoveRequests ? "#FFFFFF" : "#5858E0",
                color: completedMoveRequests ? "#5858E0" : "#FFFFFF",
                fontSize:10,
                "&:hover": {
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontSize:10
                },
              }}
              variant="outlined"
            >
              Complete Move
            </Button>
                ):(
                  <Typography fontSize={12}>
                    Completed
                  </Typography>
                )
              }
            
            </TableCell>
            </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
                  </Stack>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => {
            setIsLoading(true);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      </Grid>
    </>
  );
};

export default ConsumerDashboard;
