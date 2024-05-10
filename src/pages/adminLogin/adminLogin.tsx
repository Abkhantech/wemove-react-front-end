import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../redux/actions/admin";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import WeMoveHeader from "../../components/header/weMoveHeader";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password can't be empty";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      const body = formData;

      dispatch<any>(adminLogin(body))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          setLoginError("");
          navigate("/admin-dashboard");
        })
        .catch((err: any) => {
          setIsLoading(false);
          setLoginError(err);
        });
    } else {
      setLoginError("Login failed");
    }
  };

  return (
    <>
    <WeMoveHeader />
    <Grid container>
      <Grid item xs={12} sm={8} md={5} p={2} marginX={"auto"}>
        <Typography
          mt={5}
          fontSize="18px"
          fontWeight={600}
          textAlign={"center"}
        >
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          <FormGroup>
            <FormControl fullWidth>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                fullWidth
                value={formData.email}
                error={Boolean(errors.email)}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  });
                }}
                helperText={errors.email}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                margin="normal"
                fullWidth
                value={formData.password}
                error={Boolean(errors.password)}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });
                }}
                helperText={errors.password}
                required
              />
              <Typography
                display={!loginError ? "none" : undefined}
                mt={2}
                ml={2}
                fontSize={12}
                color={"#d32f2f"}
              >
                {loginError}
              </Typography>
              {isLoading ? (
                <Box marginX={"auto"}>
                  <CircularProgress />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    marginTop: 6,
                    height: 50,
                    backgroundColor: "#5858E0",
                    color: "#FFFFFF",
                    borderColor: "#6552FF",
                    fontSize: 12,
                    fontWeight: 550,
                  }}
                >
                  Submit
                </Button>
              )}
            </FormControl>
          </FormGroup>
        </form>
      </Grid>
    </Grid>
    </>
  );
};

export default AdminLogin;
