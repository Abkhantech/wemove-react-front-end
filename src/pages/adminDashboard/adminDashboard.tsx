import { Box, Button, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import logoCube from "../../assets/logo/Group 15.png";
import logoWeMove from "../../assets/logo/WEMOVE.png";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getAllDeliveryCarriers,
  getAllLocalCarriers,
  getAllPickupCarriers,
} from "../../redux/actions/admin";
import LocalCarrierTable from "../../components/tables/localCarrierTable";
import PickupCarrierTable from "../../components/tables/pickupCarrierTable";
import DeliveryCarrierTable from "../../components/tables/deliveryCarrierTable";
import { useNavigate } from "react-router-dom";
import ReApi from "../../components/reapi/reApi";
import MlsDataResults from "../../components/reapi/mls-data-results";
import SkipTraceDataResults from "../../components/reapi/skip-trace-data-results";
import DisplayMoveRequests from "../../components/admin-move-requests/display-move-requests";
import CalculateDistance from "../../components/calculateDistance/calculateDistance";

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
        <Box sx={{ p: 3 }}>
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [localCarriers, setLocalCarriers] = useState<any>([]);
  const [pickupCarriers, setPickupCarriers] = useState<any>([]);
  const [deliveryCarriers, setDeliveryCarriers] = useState<any>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getLocalCarriers();
  }, []);

  const getLocalCarriers = () => {
    dispatch<any>(getAllLocalCarriers())
      .then(unwrapResult)
      .then((res: any) => {
        setLocalCarriers(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getPickupCarriers = () => {
    dispatch<any>(getAllPickupCarriers())
      .then(unwrapResult)
      .then((res: any) => {
        setPickupCarriers(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getDeliveryCarriers = () => {
    dispatch<any>(getAllDeliveryCarriers())
      .then(unwrapResult)
      .then((res: any) => {
        setDeliveryCarriers(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/admin-login");
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box p={1} display={"flex"} justifyContent={"space-between"}>
            <Stack alignItems={"center"} direction={"row"}>
              <img src={logoCube} width={60} height={60} alt="" />
              <img src={logoWeMove} width={240} height={40} alt="" />
            </Stack>
            <Button
              onClick={() => {
                handleLogout();
              }}
              sx={{
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
          </Box>
          <Box mb={1} bgcolor={"#5858E0"}>
            <Typography
              fontWeight={700}
              fontSize={30}
              color={"#FFFFFF"}
              textAlign="center"
            >
              Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  onClick={() => {
                    getLocalCarriers();
                  }}
                  label="Local Carrier"
                  {...a11yProps(0)}
                />
                <Tab
                  onClick={() => {
                    getPickupCarriers();
                  }}
                  label="Pickup Carrier"
                  {...a11yProps(1)}
                />
                <Tab
                  onClick={() => {
                    getDeliveryCarriers();
                  }}
                  label="Delivery Carrier"
                  {...a11yProps(2)}
                />
                {/* <Tab label="Real Estate APIs" {...a11yProps(3)} />
                <Tab label="MLS Data Results" {...a11yProps(4)} />
                <Tab label="Skip Trace Data Results" {...a11yProps(5)} /> */}
                <Tab label="Move Request Dashboard" {...a11yProps(3)} />
                <Tab label="Calculate Distance" {...a11yProps(4)} />


              </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
              <LocalCarrierTable
                localCarriers={localCarriers}
                getLocalCarriers={getLocalCarriers}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <PickupCarrierTable
                pickupCarriers={pickupCarriers}
                getPickupCarriers={getPickupCarriers}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <DeliveryCarrierTable
                deliveryCarriers={deliveryCarriers}
                getDeliveryCarriers={getDeliveryCarriers}
              />
            </CustomTabPanel>
            {/* <CustomTabPanel value={value} index={3}>
              <ReApi />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <MlsDataResults/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <SkipTraceDataResults/>
            </CustomTabPanel> */}
            <CustomTabPanel value={value} index={3}>
              <DisplayMoveRequests/>
              {/* <SkipTraceDataResults/> */}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <CalculateDistance/>
            </CustomTabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminDashboard;
