import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ moveRequestId }: any) => {
  // const moveRequestId = 1
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              /WEMOVE.AI
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/packages/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">Packages</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/itemsInfo/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">Items Info</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/PickupDate/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">Pickup Date</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/AddressInfo/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">Address Info</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/DeliveryLocationInfo/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">
                    Delivery Location Info
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/TruckInfo/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">Truck Info</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/upload-inventory/${moveRequestId}`);
                  }}
                >
                  <Typography textAlign="center">Upload Another Video</Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              /WEMOVE.AI
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/packages/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Packages
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/itemsInfo/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Items Info
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/PickupDate/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Pickup Date
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/AddressInfo/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Address Info
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/DeliveryLocationInfo/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Delivery Location Info
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/TruckInfo/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Truck Info
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/upload-inventory/${moveRequestId}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Upload Video +
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default NavBar;
