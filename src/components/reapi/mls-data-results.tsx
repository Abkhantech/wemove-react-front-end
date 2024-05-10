import { Alert, Backdrop, Button, Checkbox, CircularProgress, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getMLSRecords, skipTrace } from "../../redux/actions/reapi";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import InfiniteScroll from "react-infinite-scroll-component";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
const MlsDataResults = () => {
  const [offset, setOffset] = useState(0);
  const [mlsRecords, setMlsRecords] = useState<any>([]);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [recordsCount, setRecordsCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const fetchMLSRecords = () => {
    if (!hasMore) return;
const body = {
  offset: offset,
  limit: 10,
};
console.log(body);
dispatch<any>(getMLSRecords(body))
.then(unwrapResult)
.then((records: any) => {
  console.log(records.length,'>>>>>')
      //  setRecordsCount(records.length)
        if (records.length === 0) {
          setHasMore(false);
        } else {
          setMlsRecords([...mlsRecords, ...records]);
          setOffset(offset + records.length);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const jsonToCSV = (jsonArray: any[]): string => {
    const headers = Object.keys(jsonArray[0]).join(",");
    const rows = jsonArray.map((obj) => Object.values(obj).join(","));
    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (csvContent: string, fileName: string): void => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downnloadFile = () => {
    let dataToConvert: any = [];
    {
      mlsRecords.map((record: any) => {
        const newObj = JSON.parse(record.object);
        const customObj = {
          address: `"${newObj.address.address ?? "-"}"`,
          city: newObj.address.city ?? "-",
          state: newObj.address.state ?? "-",
          zip: newObj.address.zip ?? "-",
          squareFeet: newObj?.squareFeet,
          bathrooms: newObj?.bathrooms,
          bedrooms: newObj?.bedrooms,
        };
        dataToConvert.push(customObj);
      });
    }
    const csvData = jsonToCSV(dataToConvert);
    downloadCSV(csvData, "MLS-data.csv");
  };
  const theme = useTheme();
  const [selectedAddresses, setSelectedAddresses] = useState<any>([]);
  const handleCheckBox = (event:any, address:any, id:number) => {
    setSuccessMessage("")
    if(event.target.checked){
        const addressObject = {
          address: address,
          id:id
        }
      setSelectedAddresses((prevAddress:any)=>[...prevAddress,addressObject])
    }else{
      setSelectedAddresses(selectedAddresses.filter((thisAddress:any)=>thisAddress.address!==address))
    }
    setSelectAll(false);
  }

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (event:any) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      const allAddresses = mlsRecords.map((record:any) => {
        const newObj = JSON.parse(record.object);
        const address = newObj.address.address;
        console.log("Address>>>>>>",address)
        return { address: address, id: record.id };
      });
      setSelectedAddresses(allAddresses);
    } else {
      setSelectedAddresses([]);
    }
  };

//   useEffect(()=>{
// console.log(selectedAddresses)
//   },[selectedAddresses])
const returnIncludesObject = (addressPart:any) => {
  return selectedAddresses.some((thisAdd:any) => {
    return thisAdd.address === addressPart;
  });
};
  const turnToObject = (record: any) => {
    const newObj = JSON.parse(record.object);
    // console.log(newObj,'--')
    
    return (
      <Stack>
        {/* <Stack spacing={1} direction={"row"}>
          <Typography fontWeight={600}>Absentee Owner:</Typography>
          <Typography>{newObj.absenteeOwner ? "Yes" : "No"}</Typography>
        </Stack> */}

        {newObj.address && (
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Stack alignItems={'center'} spacing={1} direction={"row"}>
              {/* <Typography fontWeight={600}>Address:</Typography> */}
            
            <Button variant="contained">
              <Typography>{newObj.address.address ?? "N/A"}</Typography>
            </Button>
            {!record.is_searched&&(
            <Stack alignItems={'center'} direction={'row'}>
            <Checkbox
            checked={returnIncludesObject(newObj.address.address)|| selectAll}
            onChange={(event)=>{
              handleCheckBox(event,newObj.address.address.toString(), record.id)
            }}
          />
          <Typography fontWeight={600}>SELECT FOR SKIP-TRACE</Typography>
            </Stack>
            )}
            </Stack>
            {record.is_searched===true?(
              <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <DoneAllIcon sx={{color:"#008000"}} fontSize={'medium'}/>
                <Typography fontWeight={600} color={"#008000"}>SEARCHED</Typography>
              </Stack>
            ):(
              <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <CancelIcon sx={{color:"#FF0000"}} fontSize={'medium'}/>
                <Typography fontWeight={600} color={"#FF0000"}>NOT-SEARCHED</Typography>
              </Stack>
            )}
            {/* <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>City:</Typography>
              <Typography>{newObj.address.city ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>State:</Typography>
              <Typography>{newObj.address.state ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Zip Code:</Typography>
              <Typography>{newObj.address.zip ?? "N/A"}</Typography>
            </Stack> */}
          </Stack>
        )}

        {/* <Typography fontWeight={600}>Property Details</Typography>
        {newObj && (
          <Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Adjustable Rate:</Typography>
              <Typography>{newObj?.adjustableRate ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>
                Air Conditioning Available:
              </Typography>
              <Typography>
                {newObj?.airConditioningAvailable ? "Yes" : "No"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>APN:</Typography>
              <Typography>{newObj?.apn}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>
                Assessed Improvement Value:
              </Typography>
              <Typography>{newObj?.assessedImprovementValue}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Assessed Land Value:</Typography>
              <Typography>{newObj?.assessedLandValue}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Assessed Value:</Typography>
              <Typography>{newObj?.assessedValue}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Assumable:</Typography>
              <Typography>{newObj?.assumable ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Auction:</Typography>
              <Typography>{newObj?.auction ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Auction Date:</Typography>
              <Typography>{newObj?.auctionDate ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Basement:</Typography>
              <Typography>{newObj?.basement ? "Yes" : "No"}</Typography>
            </Stack>

            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Bathrooms:</Typography>
              <Typography>{newObj?.bathrooms}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Bedrooms:</Typography>
              <Typography>{newObj?.bedrooms}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Cash Buyer:</Typography>
              <Typography>{newObj?.cashBuyer ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Company Name:</Typography>
              <Typography>{newObj?.companyName}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Corporate Owned:</Typography>
              <Typography>{newObj?.corporateOwned ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Death:</Typography>
              <Typography>{newObj?.death ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Deck:</Typography>
              <Typography>{newObj?.deck ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Deck Area:</Typography>
              <Typography>
                {newObj?.deckArea !== null ? newObj.deckArea : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Equity:</Typography>
              <Typography>{newObj?.equity ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Equity Percent:</Typography>
              <Typography>{newObj?.equityPercent}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Estimated Equity:</Typography>
              <Typography>{newObj?.estimatedEquity}</Typography>
            </Stack>

            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Estimated Value:</Typography>
              <Typography>{newObj?.estimatedValue}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Flood Zone:</Typography>
              <Typography>{newObj?.floodZone ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>For Sale:</Typography>
              <Typography>{newObj?.forSale ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Foreclosure:</Typography>
              <Typography>{newObj?.foreclosure ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Free Clear:</Typography>
              <Typography>{newObj?.freeClear ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Garage:</Typography>
              <Typography>{newObj?.garage ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>High Equity:</Typography>
              <Typography>{newObj?.highEquity ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>ID:</Typography>
              <Typography>{newObj?.id}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>In-State Absentee Owner:</Typography>
              <Typography>
                {newObj?.inStateAbsenteeOwner ? "Yes" : "No"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Inherited:</Typography>
              <Typography>{newObj?.inherited ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Investor Buyer:</Typography>
              <Typography>{newObj?.investorBuyer ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Judgment:</Typography>
              <Typography>{newObj?.judgment ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Land Use:</Typography>
              <Typography>{newObj?.landUse}</Typography>
            </Stack>

            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Last Mortgage 1 Amount:</Typography>
              <Typography>
                {newObj?.lastMortgage1Amount !== null
                  ? newObj.lastMortgage1Amount
                  : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Last Sale Amount:</Typography>
              <Typography>{newObj?.lastSaleAmount}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Last Update Date:</Typography>
              <Typography>{newObj?.lastUpdateDate}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Latitude:</Typography>
              <Typography>{newObj?.latitude}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Lender Name:</Typography>
              <Typography>{newObj?.lenderName}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Listing Amount:</Typography>
              <Typography>
                {newObj?.listingAmount !== null ? newObj.listingAmount : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Loan Type Code:</Typography>
              <Typography>{newObj?.loanTypeCode}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Longitude:</Typography>
              <Typography>{newObj?.longitude}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Lot Square Feet:</Typography>
              <Typography>{newObj?.lotSquareFeet}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Mail Address:</Typography>
              <Typography>{newObj?.mailAddress?.address}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Maturity Date First:</Typography>
              <Typography>{newObj?.maturityDateFirst}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Median Income:</Typography>
              <Typography>{newObj?.medianIncome}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Active:</Typography>
              <Typography>{newObj?.mlsActive ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Cancelled:</Typography>
              <Typography>{newObj?.mlsCancelled ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Days on Market:</Typography>
              <Typography>{newObj?.mlsDaysOnMarket}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Failed:</Typography>
              <Typography>{newObj?.mlsFailed ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Has Photos:</Typography>
              <Typography>{newObj?.mlsHasPhotos ? "Yes" : "No"}</Typography>
            </Stack>

            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Last Status Date:</Typography>
              <Typography>{newObj?.mlsLastStatusDate}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Listing Date:</Typography>
              <Typography>{newObj?.mlsListingDate}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Listing Price:</Typography>
              <Typography>{newObj?.mlsListingPrice}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Pending:</Typography>
              <Typography>{newObj?.mlsPending ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Sold:</Typography>
              <Typography>{newObj?.mlsSold ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Status:</Typography>
              <Typography>{newObj?.mlsStatus}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>MLS Type:</Typography>
              <Typography>{newObj?.mlsType}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Negative Equity:</Typography>
              <Typography>{newObj?.negativeEquity ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Neighborhood:</Typography>
              <Typography>{newObj?.neighborhood?.name}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Neighborhood ID:</Typography>
              <Typography>{newObj?.neighborhood?.id}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Open Mortgage Balance:</Typography>
              <Typography>{newObj?.openMortgageBalance}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>
                Out of State Absentee Owner:
              </Typography>
              <Typography>
                {newObj?.outOfStateAbsenteeOwner ? "Yes" : "No"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Owner's Last Name:</Typography>
              <Typography>{newObj?.owner1LastName}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Owner Occupied:</Typography>
              <Typography>{newObj?.ownerOccupied ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Patio:</Typography>
              <Typography>{newObj?.patio ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Patio Area:</Typography>
              <Typography>
                {newObj?.patioArea !== null ? newObj.patioArea : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Pool:</Typography>
              <Typography>{newObj?.pool ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Pool Area:</Typography>
              <Typography>
                {newObj?.poolArea !== null ? newObj.poolArea : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Pre-Foreclosure:</Typography>
              <Typography>{newObj?.preForeclosure ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Price Per Square Foot:</Typography>
              <Typography>{newObj?.pricePerSquareFoot}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Prior Sale Amount:</Typography>
              <Typography>
                {newObj?.priorSaleAmount !== null
                  ? newObj.priorSaleAmount
                  : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Private Lender:</Typography>
              <Typography>{newObj?.privateLender ? "Yes" : "No"}</Typography>
            </Stack>

            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Property ID:</Typography>
              <Typography>{newObj?.propertyId}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Property Type:</Typography>
              <Typography>{newObj?.propertyType}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Property Use:</Typography>
              <Typography>{newObj?.propertyUse}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Property Use Code:</Typography>
              <Typography>{newObj?.propertyUseCode}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Rent Amount:</Typography>
              <Typography>
                {newObj?.rentAmount !== null ? newObj.rentAmount : "N/A"}
              </Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>REO:</Typography>
              <Typography>{newObj?.reo ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Rooms Count:</Typography>
              <Typography>{newObj?.roomsCount}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Square Feet:</Typography>
              <Typography>{newObj?.squareFeet}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Stories:</Typography>
              <Typography>{newObj?.stories}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Suggested Rent:</Typography>
              <Typography>{newObj?.suggestedRent}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Total Portfolio Equity:</Typography>
              <Typography>{newObj?.totalPortfolioEquity}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>
                Total Portfolio Mortgage Balance:
              </Typography>
              <Typography>{newObj?.totalPortfolioMortgageBalance}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Total Portfolio Value:</Typography>
              <Typography>{newObj?.totalPortfolioValue}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Total Properties Owned:</Typography>
              <Typography>{newObj?.totalPropertiesOwned}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Units Count:</Typography>
              <Typography>{newObj?.unitsCount}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Vacant:</Typography>
              <Typography>{newObj?.vacant ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Year Built:</Typography>
              <Typography>{newObj?.yearBuilt}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Years Owned:</Typography>
              <Typography>
                {newObj?.yearsOwned !== null ? newObj.yearsOwned : "N/A"}
              </Typography>
            </Stack>
          </Stack>
        )} */}
      </Stack>
    );
  };
  
  useEffect(() => {
    console.log(mlsRecords.length)
    fetchMLSRecords();
  }, [mlsRecords]);
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const separateAddressAttributes = async() => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")
    const addressObjects = await selectedAddresses.map((address:any) => {
      const [addressPart, cityPart, stateZipPart] = address.address.split(',').map((part:any) => part.trim());
      const [state, zip] = stateZipPart.split(' ');
    
      return {
        address: address.address,
        city: cityPart,
        state: state.toUpperCase(),
        zip,
        id: address.id
      };
    });
    // console.log(addressObjects)
    if(addressObjects.length!==0){
      setIsLoading(true)
      addressObjects.map((obj:any)=>{
        console.log(obj)
        dispatch<any>(skipTrace(obj))
        .then(unwrapResult)
        .then((response: any) => {
          // setIsLoading(false);
          console.log("Response:", response);
          // setSuccessMessage("Data fetched successfully. Please switch to Skip Trace Data Results Tab.")
        })
        .catch((err: any) => {
          setIsLoading(false);
          // setFormError("Interal Server Error");
          setErrorMessage("Please refresh and try again.")
          // console.log("API Error:", err);
        });
      })
      setTimeout(()=>{

        setIsLoading(false)
      },2000)
      setSuccessMessage("Data fetched successfully. Please switch to Skip Trace Data Results Tab.")
    }
  }
  return (
    <>
      <Grid container mt={2} mb={2} p={1}>
      {/* {hasMore && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={() => {
                setHasMore(true);
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
          )} */}
        
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={hasMore}
            onClick={()=>{setHasMore(true)}}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
            {isLoading&&(
              <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={()=>{setIsLoading(true)}}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            )}
        <Grid item xs={12} mb={2} justifyContent={"center"}>
          <Typography
            fontSize={20}
            fontWeight={700}
            color={"#000000"}
            textAlign="center"
          >
            {successMessage && (
            <Alert sx={{ mt: 1 }} severity="success">
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert sx={{ mt: 1 }} severity="error">
              {errorMessage}
            </Alert>
          )}
            MLS RESULTS - TOTAL: {mlsRecords.length}
          </Typography>
         
         <Stack spacing={2} mt={2} alignItems={'center'} alignSelf={'center'}>

          <Button variant="contained" onClick={() => downnloadFile()}>Download CSV</Button>
          <Button onClick={()=>{
            separateAddressAttributes()
          }} disabled={selectedAddresses.length===0} variant="contained">Search Selected Addresses for Skip Trace</Button>
         </Stack>
         <Stack alignItems={'center'} direction={'row'}>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
          />
          <Typography fontWeight={600}>SELECT All</Typography>
            </Stack>
          <InfiniteScroll
            dataLength={mlsRecords.length || 0}
            next={fetchMLSRecords}
            hasMore={hasMore}
            loader={hasMore ? <h4>Loading...</h4> : null}
            scrollableTarget="scrollableDiv"
          >
            <div className="d-inline-block">
              {mlsRecords.map((record: any) => {
                return (
                  <Stack
                    sx={{ marginY: 4 }}
                    key={record.id}
                    className="userCard border border-dark rounded-pill mt-3 me-2"
                    onClick={() => {}}
                  >
                   
                    <Typography>{turnToObject(record)}</Typography>
                    <Divider />
                  </Stack>
                );
              })}
            </div>
          </InfiniteScroll>
        </Grid>
      </Grid>
    </>
  );
};

export default MlsDataResults;
