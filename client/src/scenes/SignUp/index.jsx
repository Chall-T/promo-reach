import React from "react";
import { Container, Button, Link, Typography, Box, Grid, TextField, Checkbox, FormControlLabel, useTheme } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import * as yup from "yup";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { api } from "state/api";
const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false
}

const userSchema = yup.object().shape({
    firstName: yup.string().required("required").min(2),
    lastName: yup.string().required("required").min(2),
    email: yup.string().email("invalid email").required("required").max(50),
    password: yup.string().required("required").min(8),
    terms: yup.bool().oneOf([true], 'Accept Terms & Conditions is required')
})

const SignUp = () => {
    // const [validation, setValidation] = React.useState();
    // setValidation(userSchema)
    
    const triedEmails = []
    const theme = useTheme();
    const dispatch = useDispatch();
    const handleFormSubmit = (values) => {
        const result = dispatch(api.endpoints.signUp.initiate(values))
            .unwrap()
            .then((payload) => {
                console.log('fulfilled', payload)
                window.location.href = "/Dashboard";
            })
            .catch((error) => {
                if (error.data.email){
                    triedEmails.push(values.email);
                    console.log(error.data.email)
                    userSchema.email = yup.string().email("invalid email").notOneOf(triedEmails, error.data.email).required("required").max(50)
                }
                console.error('rejected', error, values.email)
            })
    }
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
                Sign up
            </Typography>
            <Formik 
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
                sx={{ mt: 3 }}
            >
            {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            error={!!touched.firstName && !!errors.firstName}
                            helperText={touched.firstName && errors.firstName}
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            sx={{
                                "& .Mui-focused":{
                                    color: `${theme.palette.text.main} !important`
                                }
                                
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            error={!!touched.lastName && !!errors.lastName}
                            helperText={touched.lastName && errors.lastName}
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            sx={{
                                "& .Mui-focused":{
                                    color: `${theme.palette.text.main} !important`
                                }
                                
                            }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                            autoComplete="email"
                            sx={{
                                "& .Mui-focused":{
                                    color: `${theme.palette.text.main} !important`
                                }
                                
                            }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                            autoComplete="new-password"
                            sx={{
                                "& .Mui-focused":{
                                    color: `${theme.palette.text.main} !important`
                                }
                                
                            }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox 
                                checked={values.terms} 
                                color="secondary" 
                                required
                                name="terms"
                                id="terms"
                                />}
                            label="I accept the Terms & Conditions."
                            
                            color="secondary" 
                            onChange={handleChange}
                            />
                        </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                        Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link 
                            href="/signIn" 
                            variant="body2"
                            sx={{
                                color: `${theme.palette.text.main} !important`
                            }}>
                            Already have an account? Sign in
                            
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

export default SignUp;
