import {
  Box,
  LinearProgress,
  linearProgressClasses,
  styled,
} from "@mui/material";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#5859DF" : "#308fe8",
  },
}));

const ProgressBar = ({ value }: any) => {
  return (
    <>
      <Box sx={{ flexGrow: 1 , height:6 }}>
        <BorderLinearProgress variant="determinate" value={value} />
      </Box>
    </>
  );
};
export default ProgressBar;
