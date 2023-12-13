import {useState, Fragment} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme, Box } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarProvider  } from 'notistack';
import { createCompany } from 'features/companies/companySlice';
import { useDispatch, useSelector } from "react-redux";
import logger from 'helpers/logger';

const companyCreationSchema = yup.object().shape({
    companyName: yup.string().required("required").min(4),
})
const initialValues = {
    companyName: "",
}

const CompanyCreateForm = ({openCompanyCreateForm, setOpenCompanyCreateForm}) => {
    const theme = useTheme();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const dispatch = useDispatch();
    
    const initialCompany = useSelector((state) => state.company.data.companies);
    const [company, setCompany] = useState(initialCompany);
    const handleClose = () => {
        setFormSubmitted(false)
        setOpenCompanyCreateForm(false)
    };

    return (
    <Fragment>
        <SnackbarProvider />
        <Formik 
            onSubmit={async values =>{
                setFormSubmitted(true)
                dispatch(createCompany(values.companyName)).unwrap()
                logger.debug(company)
                company.map((company) =>{
                    logger.debug(company)
                })
                // if (company.name !== values.companyName){
                //     logger.debug(company.name)
                //     dispatch(createCompany(values.companyName)).unwrap().then((payload) => {
                //         if(payload.status === 'fulfilled'){
                //             enqueueSnackbar(`Company ${values.companyName} succesfully created!`, {variant: 'success'});
                //             setCompany(payload.data)
                //         }else{
                //             enqueueSnackbar(`Something went wrong :(`, {variant: 'error'});
                //         }
                    
                //     });
                // }else{
                //     enqueueSnackbar(`This company was just created`);
                // }
                setFormSubmitted(false)
                setOpenCompanyCreateForm(false)
                
                
            }}
            initialValues={initialValues}
            validationSchema={companyCreationSchema}
            sx={{ mt: 3 }}
        >
        {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
            <form onSubmit={handleSubmit}>
            <Dialog open={openCompanyCreateForm} onClose={handleClose} sx={{width:"100%"}}>
                <DialogTitle>Create new company</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{width:"100%"}}>
                        Enter your company here to create a new store
                    </DialogContentText>
                    <TextField
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.companyName}
                        error={!!touched.companyName && !!errors.companyName}
                        helperText={touched.companyName && errors.companyName}
                        margin="dense"
                        id="companyName"
                        label="Company name"
                        type="text"
                        name="companyName"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Box width="60px"><Button onClick={handleClose} sx={{color: theme.palette.secondary[300]}}>Cancel</Button></Box>
                    {formSubmitted? <Box sx={{ display: 'flex', width:"60px", justifyItems: "right"}}> <CircularProgress sx={{color: theme.palette.secondary[500]}} /> </Box> :<Box width="60px"><Button onClick={handleSubmit} sx={{color: theme.palette.secondary[300]}}>Create</Button></Box>}
                    {/* <Button onClick={handleSubmit} sx={{color: theme.palette.secondary[300]}}>Create</Button> */}
                </DialogActions>
            </Dialog>
            </form>
            )}
        </Formik>
    </Fragment>
  );
}
export default CompanyCreateForm;