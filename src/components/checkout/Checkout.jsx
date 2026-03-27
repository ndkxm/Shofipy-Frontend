import React, { useEffect, useState } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Typography,
    Paper,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Header } from "../shared/Header";
import { AddressInfo } from "./AddressInfo";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../../store/actions";
import { Bounce, toast } from "react-toastify";
import { PaymentMethod } from "./PaymentMethod";

const steps = [
    "Address",
    "Payment Method",
    "Order Summary",
    "Payment",
];

export const CheckOut = () => {
    const [activeStep, setActiveStep] = useState(0);

    const dispatch = useDispatch();

    const { addresses, selectedCheckoutAddress } = useSelector((state) => state.auth);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleNext = () => {
        if(!selectedCheckoutAddress) {
            toast.error("Please select address!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        return;
        }
        else setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <AddressInfo addresses={addresses} />;
            case 1:
                return <PaymentMethod/>;
            case 2:
                return <div>Order Summary</div>;
            case 3:
                return <div>Payment</div>;
            default:
                return null;
        }
    };

    useEffect(() => {
        dispatch(fetchAddresses())
    }, [dispatch])

    return (
        <div>
            <Header />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                    p: { xs: 2, sm: 3 },
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: { xs: 2, sm: 4 },
                        width: "100%",
                        maxWidth: 900,
                    }}
                >
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        align="center"
                        sx={{
                            color: "#1976d2",
                            fontWeight: 600,
                            mb: 4,
                            fontFamily: "Reddit Sans",
                        }}
                    >
                        Checkout Process
                    </Typography>

                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel={!isMobile}
                        orientation={isMobile ? "vertical" : "horizontal"}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ mt: 4 }}>{renderStepContent()}</Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: 2,
                            justifyContent: "space-between",
                            mt: 6,
                            fontFamily: "Reddit Sans",
                        }}
                    >
                        <Button
                            variant="outlined"
                            fullWidth={isMobile}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ fontFamily: "Reddit Sans" }}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth={isMobile}
                            onClick={handleNext}
                            disabled={activeStep === steps.length - 1}
                            sx={{ backgroundColor: "#1976d2", fontFamily: "Reddit Sans" }}
                        >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};