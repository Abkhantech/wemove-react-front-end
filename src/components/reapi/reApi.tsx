import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import Mls from "./mls";
import SkipTrace from "./skipTrace";

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

const ReApi = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container mt={2} mb={2} p={1}>
        <Grid item xs={12} mb={2} justifyContent={"center"}>
          <Typography fontWeight={700} color={"#374145"} textAlign="center">
            Real Estate API
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
                  label="MLS Property Scouting"
                  {...a11yProps(0)}
                />
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
                  label="Skiptrace API"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
          </Grid>

          <CustomTabPanel value={value} index={0}>
            <Mls />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <SkipTrace />
          </CustomTabPanel>
        </Box>
      </Grid>
    </>
  );
};

export default ReApi;
