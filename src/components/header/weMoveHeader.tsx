import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

const WeMoveHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <>
      <Grid item xs={12} p={2}>
        <Typography
          fontSize={isMobile ? 18 : 22}
          fontWeight={700}
          letterSpacing={1.3}
          color={"#5859DF"}
        >
          /WEMOVE.ai
        </Typography>
      </Grid>
    </>
  );
};

export default WeMoveHeader;
