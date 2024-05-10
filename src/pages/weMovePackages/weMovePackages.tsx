import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import CustomizePackage from "../../components/weMovePackages/customizePackage";
import FullPackage from "../../components/weMovePackages/fullPackage";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMoveRequestById,
  updateMoveRequestById,
} from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import NavBar from "../../components/navbar/navBar";
import { getInventoryVolume } from "../../redux/actions/room-details";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box marginTop={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const WeMovePackages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [moveRequest, setMoveRequest] = useState<any>(null);
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [value, setValue] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [inventoryVolume, setInventoryVolume] = useState(0.0);

  const navigateToLastLeft = (moveRequest: any) => {
    if (!moveRequest.delivery_details) {
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    } else {
      if (moveRequest.delivery_details?.delivery_addresses?.length === 0) {
        navigate(`/AddressInfo/${moveRequest.canonical_id}`);
      } else {
        if (
          moveRequest.delivery_details?.delivery_addresses[0].delivery_location_type === null
        ) {
          navigate(`/DeliveryLocationInfo/${moveRequest.canonical_id}`);
        } else {
          if (moveRequest.delivery_details?.packagaing_required === null) {
            navigate(`/packages/${moveRequest.canonical_id}`);
          } else {
            if (
              moveRequest.pickup_date_from === null &&
              moveRequest.pickup_date_to === null
            ) {
              navigate(`/PickupDate/${moveRequest.canonical_id}`);
            } else {
              if (moveRequest.delivery_details.open_location === null) {
                navigate(`/TruckInfo/${moveRequest.canonical_id}`);
              } else {
                if (moveRequest.items?.length === 0) {
                  navigate(`/itemsInfo/${moveRequest.canonical_id}`);
                } else {
                  navigate(`/move-summary/${moveRequest.canonical_id}`);
                }
              }
            }
          }
        }
      }
    }
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setThisMoveRequestId(thisMoveRequest.id);
        setMoveRequest(thisMoveRequest);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const updateThisMoveRequest = (body: any) => {
    setIsPageLoading(true);
    const params = {
      id: thisMoveRequestId,
      ...body,
    };
    dispatch<any>(updateMoveRequestById(params))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
        setTimeout(() => {
          setIsPageLoading(false);
          navigateToLastLeft(thisMoveRequest);
        }, 1300);
      })
      .catch((err: any) => {
        console.log(err);
        setTimeout(() => {
          setIsPageLoading(false);
        }, 1300);
      });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getCubicFeet = () => {
    const move_request_id = moveRequestId || "";
    dispatch<any>(getInventoryVolume(move_request_id))
      .then(unwrapResult)
      .then((res: any) => {
        setInventoryVolume(res.total_cubic_feet);
      });
  };

  useEffect(() => {
    fetchMoveRequestById(moveRequestId);
    if (inventoryVolume === 0.0) {
      getCubicFeet();
    }
  }, []);

  return (
    <>
      <NavBar moveRequestId={moveRequestId} />
      <Grid container mt={2} mb={2} p={1}>
        <Grid item xs={12} mb={2} justifyContent={"center"}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            lineHeight={1.2}
            color={"#374145"}
            textAlign="center"
          >
            Two package to cover all your need accordingly
          </Typography>
        </Grid>
        <Box sx={{ width: "100%" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                border: 1,
                borderColor: "#0000001A",
                borderRadius: "25px",
                width: "fit-content",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
                TabIndicatorProps={{
                  style: {
                    display: "none",
                  },
                }}
              >
                <Tab
                  sx={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#5858E0",
                    borderColor: "#0000001A",
                    borderRadius: "25px",
                    "&.Mui-selected": {
                      backgroundColor: "#5858E0",
                      color: "#FFFFFF",
                    },
                  }}
                  label="Full package"
                  {...a11yProps(0)}
                />
                {/* <Tab
                  sx={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#5858E0",
                    borderColor: "#0000001A",
                    borderRadius: "25px",
                    "&.Mui-selected": {
                      backgroundColor: "#5858E0",
                      color: "#FFFFFF",
                    },
                  }}
                  label="Customize Package"
                  {...a11yProps(1)}
                /> */}
              </Tabs>
            </Box>
          </Grid>

          <CustomTabPanel value={value} index={0}>
            <FullPackage
              updateThisMoveRequest={updateThisMoveRequest}
              totalCubicFeet={inventoryVolume}
              moveRequest={moveRequest}
            />
          </CustomTabPanel>

          {/* <CustomTabPanel value={value} index={1}>
            <CustomizePackage
              totalCubicFeet={inventoryVolume}
              updateThisMoveRequest={updateThisMoveRequest}
            />
          </CustomTabPanel> */}
        </Box>

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
    </>
  );
};

export default WeMovePackages;
