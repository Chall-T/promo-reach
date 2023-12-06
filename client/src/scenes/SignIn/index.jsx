import React, { useState } from "react";
import { Container, Button, Link, Typography, Box, Grid, TextField, useTheme } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import * as yup from "yup";
import { Formik } from "formik";
import { SignInQuery } from "state/api";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const initialValues = {
    email: "",
    password: ""
}

const userSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required").max(50),
    password: yup.string().required("required").min(8),
})


const SignIn = () => {
    const theme = useTheme();

    const [data, setData] = useState()

    SignInQuery(data);
    

    return (
    <Container>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Formik 
                onSubmit={async values =>{
                    setData(values)
                }}
                initialValues={initialValues}
                validationSchema={userSchema}
                sx={{ mt: 3 }}
            >
            {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{mt: "20px"}}>
                            <TextField
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            error={!!touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            sx={{
                                "& .Mui-focused":{
                                    color: `${theme.palette.text.main} !important`
                                }
                                
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{mt: "20px"}}>
                            <TextField
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            error={!!touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="password"
                            sx={{
                                "& .Mui-focused":{
                                    color: `${theme.palette.text.main} !important`
                                }
                                
                            }}
                            />
                        </Grid>
                        
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                        Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs>
                                <Link href="#" variant="body2" sx={{
                                    color: `${theme.palette.text.main} !important`
                                }}>
                                Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link 
                                href="/signUp" 
                                variant="body2"
                                sx={{
                                    color: `${theme.palette.text.main} !important`
                                }}>
                                {"Don't have an account? Sign Up"}
                                
                                </Link>
                            </Grid>
                        
                    </Grid>
                </form>
            )}
            </Formik>
        </Box>
    </Container>
    );
};

export default SignIn;
