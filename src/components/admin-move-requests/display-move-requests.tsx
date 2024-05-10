import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import AddIcon from "@mui/icons-material/Add";
  import usStates from "../utils/USA-states";
  import { City, State } from "country-state-city";
  import { useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { unwrapResult } from "@reduxjs/toolkit";
  import { skipTrace } from "../../redux/actions/reapi";
  import YesNoButtons from "../buttons/yesnoButtons";
import { io } from "socket.io-client";
import { findAllMoveRequestsForAdmin } from "../../redux/actions/admin";
  
  const DisplayMoveRequests = () => {
    const thisUrl = process.env.REACT_APP_API_URL || "";
    const dispatch = useDispatch();
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(5)
    const [allMoveRequests, setAllMoveRequests] = useState<any>([])
    const getAllMoveRequest = () => {
        const body = {
            offset: offset,
            limit: 3
        }
        dispatch<any>(findAllMoveRequestsForAdmin(body))
        .then(unwrapResult)
        .then((moveRequests:any)=>{
            // console.log(moveRequests,'---->>>')
            setAllMoveRequests([...allMoveRequests,...moveRequests])
            setOffset(offset + moveRequests.length)
        })
        .catch((err:any)=>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(allMoveRequests.length===0){
            getAllMoveRequest();
        }
    },[])

    useEffect(()=>{
        console.log(allMoveRequests,'-------->>>>>>>>>>>>>>>>>')
    },[allMoveRequests])

    useEffect(()=>{
        if(offset!==0){
            console.log('executing it')
            getAllMoveRequest();
        }
    },[offset])
    const formatDate = (dateString: any) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
    
        return `${year}-${month}-${day}`;
      };

      const paymentConfirmedDate = (dateString: any) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
    
        // Convert UTC to EST
        const estDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
    
        const estYear = estDate.getFullYear();
        const estMonth = String(estDate.getMonth() + 1).padStart(2, "0");
        const estDay = String(estDate.getDate()).padStart(2, "0");
        const estHours = String(estDate.getHours()).padStart(2, "0");
        const estMinutes = String(estDate.getMinutes()).padStart(2, "0");
    
        return `(EST: ${estYear}-${estMonth}-${estDay} ${estHours}:${estMinutes})`;
    };
    

      const splitAddressCity = (address: string, arg: string) => {
        const parts = address.split(",").map((part: string) => part.trim());
        const zip = parts[parts.length - 1];
        const country = parts.length >= 2 ? parts[parts.length - 2] : undefined;
        const state = parts.length >= 3 ? parts[parts.length - 3] : undefined;
        const city = parts.length >= 4 ? parts[parts.length - 4] : undefined;
    
        if (arg === "city") {
          return city;
        } else if (arg === "state") {
          return state;
        } else if (arg === "zip") {
          return zip;
        } else if (arg === "country") {
          return country;
        }
      };
      const checkFromAddress = (moveReq: any) => {
        if (moveReq?.home_address !== null) {
          return moveReq.home_address;
        }
        if (moveReq?.apartment !== null) {
          return moveReq.apartment?.apt_address;
        }
        if (moveReq?.storage !== null) {
          return moveReq.storage?.address;
        }
        if (moveReq?.combo_home_storage !== null) {
          return moveReq.combo_home_storage?.home_address.toString();
        }
        if (moveReq?.combo_apartment_storage !== null) {
          return moveReq.combo_apartment_storage?.apartment?.apt_address.toString();
        }
        return "---";
      };

      useEffect(() => {
        const socket = io(thisUrl);
    
        socket.on("connect", () => {
          console.log("Connected to WebSocket server");
        });
    
        socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
        });
    
        socket.on("newMoveRequest", (requestData) => {
          console.log(requestData, "-----8788787898767876------------");
          setAllMoveRequests((allReqs:any)=>[...allReqs,requestData])
        });
    
        return () => {
          socket.disconnect();
        };
      }, []);
    
    return (
      <>
        <Grid container>
          <Grid item xs={12}> 
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#5858E0" }}>
            <TableRow>
              <TableCell align="center">MOVE ORDER #</TableCell>
              <TableCell align="center">CONSUMER NAME</TableCell>
              <TableCell align="center">CONSUMER EMAIL</TableCell>
              <TableCell align="center">CONSUMER CONTACT #</TableCell>
              <TableCell align="center">PICKUP DATE</TableCell>
              <TableCell align="center">PICKUP ADDRESS</TableCell>
              <TableCell align="center">PICKUP CITY, STATE</TableCell>
              <TableCell align="center">PICKUP ZIP</TableCell>
              <TableCell align="center">DELIVERY ADDRESS</TableCell>
              <TableCell align="center">DELIVERY CITY, STATE</TableCell>
              <TableCell align="center">DELIVERY ZIP</TableCell>
              <TableCell align="center">APPROXIMATE DISTANCVE</TableCell>
              {/* <TableCell align="center">PACKAGING REQUIRED</TableCell>
              <TableCell align="center">PACKAGING TYPE</TableCell>
              <TableCell align="center">PACKAGING PRICE</TableCell> */}
              <TableCell align="center">TOTAL MOVE PRICE</TableCell>
              <TableCell align="center">DEPOSIT PAID</TableCell>
              <TableCell align="center">BALANCE</TableCell>
              <TableCell align="center">CONFIRMED AT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allMoveRequests.length !== 0 ?
              allMoveRequests.map((move: any) => 
                {
                    if(move.payment_response){

               return (
                <TableRow
                  key={move.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{move.move_order_number}</TableCell>
                  <TableCell align="center">{move.user?.first_name +' '+ move.user?.last_name}</TableCell>
                  <TableCell align="center">{move.user.email}</TableCell>
                  <TableCell align="center">{move.user.phone_number}</TableCell>
                  <TableCell align="center">
                    {formatDate(move.pickup_date_from)+' TO '+ formatDate(move.pickup_date_to)}
                  </TableCell>
                  <TableCell align="center">{checkFromAddress(move)}</TableCell>
                  <TableCell align="center">
                    {splitAddressCity(checkFromAddress(move), 'city')+', '+ splitAddressCity(checkFromAddress(move),'state')}
                  </TableCell>
                  <TableCell align="center">
                   {splitAddressCity(checkFromAddress(move),'zip')}
                  </TableCell>
                  <TableCell align="center">{move.delivery_details?.delivery_addresses[0]?.complete_address}</TableCell>
                  <TableCell align="center">
                    {splitAddressCity(move.delivery_details?.delivery_addresses[0]?.complete_address, 'city')+', '+ splitAddressCity(move.delivery_details?.delivery_addresses[0]?.complete_address,'state')}
                  </TableCell>
                  <TableCell align="center">
                   {splitAddressCity(move.delivery_details?.delivery_addresses[0]?.complete_address, 'zip')}
                  </TableCell>
                  <TableCell align="center">
                   {move.move_distance || ''}{' '}miles
                  </TableCell>
                  <TableCell align="center">
                  ${' '}{Math.round(move.move_payment)}
                  </TableCell>
                  <TableCell align="center">
                  ${' '}{Math.round(move.initial_deposit)}
                  </TableCell>
                  <TableCell align="center">
                   ${' '}{Number(move.move_payment) - Number(move.initial_deposit)}
                  </TableCell>
                  <TableCell align="center">
                   {move.payment_response?.created_at? paymentConfirmedDate(move.payment_response?.created_at): ''}
                  </TableCell>
                </TableRow>
              )
            }
            }):(
                <Stack alignSelf={'center'} alignItems={'center'}>
                </Stack>
              )}
          </TableBody>
        </Table>
      </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  };
  
  export default DisplayMoveRequests;
  