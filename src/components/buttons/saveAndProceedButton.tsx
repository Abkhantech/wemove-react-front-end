import { Box, Button, useMediaQuery, useTheme } from "@mui/material";

const SaveAndProceedButton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Box  display={"flex"} justifyContent={"center"}>
      <Button
        variant="contained"
        size="large"
        sx={{
          marginTop: 6,
          width: isMobile ? "100%" : "70%",
          height: 50,
          backgroundColor: "#5858E0",
          color: "#FFFFFF",
          borderColor: "#6552FF",
          fontSize: 12,
          fontWeight: 550,
        }}
      >
        Save & Proceed
      </Button>
    </Box>
  );
};

export default SaveAndProceedButton;
