import * as React from "react";
import {
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Box,
    ListItemIcon
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../store/actions";

export const UserMenu = ({ user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logOutHandler = () => {
        dispatch(logOutUser(navigate));
    };

    return (
        <div>
            <Avatar
                onClick={handleClick}
                sx={{
                    cursor: "pointer",
                    bgcolor: "#3b82f6",
                    width: 36,
                    height: 36,
                    fontWeight: 600
                }}
            >
                {user.username[0].toUpperCase()}
            </Avatar>

            <Menu
                
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                        fontFamily: "var(--font-sans)"
                    },
                }}
            >

                {/* User Info */}
                <Box px={2} py={1.5}>
                    <Typography sx={{ fontFamily: "var(--font-sans)" }} fontWeight={600}>
                        {user.username}
                    </Typography>

                    <Typography sx={{ fontFamily: "var(--font-sans)" }} variant="body2" color="text.secondary">
                        Signed in
                    </Typography>
                </Box>

                <Divider />

                {/* Profile */}
                <MenuItem sx={{ fontFamily: "var(--font-sans)" }} component={Link} to="/profile" onClick={handleClose}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>

                {/* Orders */}
                <MenuItem sx={{ fontFamily: "var(--font-sans)" }} onClick={handleClose}>
                    <ListItemIcon>
                        <ShoppingBagIcon fontSize="small" />
                    </ListItemIcon>
                    Orders
                </MenuItem>

                <Divider />

                {/* Logout */}
                <MenuItem sx={{ fontFamily: "var(--font-sans)" }} onClick={logOutHandler}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>

            </Menu>
        </div>
    );
};