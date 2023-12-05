import { useState,useCallback ,useEffect} from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import locations from '../../dashboard/account/locations';
import InputAdornment from "@material-ui/core/InputAdornment";
import { v4 as uuid } from "uuid";
import  {Storage} from "aws-amplify";
import FileDropzoneProp from '../../FileDropzoneProp';
import {propertiesApi} from '../../../api/PropertiesApi';
import { Auth } from 'aws-amplify';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  TextField,
  Typography
} from '@material-ui/core';
import toast from 'react-hot-toast';
//import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import useMounted from '../../../hooks/useMounted';
import { makeStyles } from "@material-ui/core/styles"


const TenancyDetailsForm = (props) => {
 
 
  const {  onBack, onNext, ...other } = props;
  
  const [files, setFiles] = useState([]);
  const [title, setTitle ] = useState (''); 
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState((''));
    const [price, setPrice] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [endDate, setEndDate] = useState((''));
    const [deposit, setDeposit] = useState('');
 const mounted = useMounted();
   const [property, setProperty] = useState([]);
  const [properties, setProperties] = useState([]);
  const [address, setAddress] = useState([]);
  let [tenancy, setTenancy] = useState({});
 

  const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };
  
  const handleRemoveAll = () => {
    setFiles([]);
  };
 const getProperties = useCallback(async () => {
    try {
      const data = await propertiesApi.getProperties();
   

      if (mounted.current) {
        setProperties(data);
       
        
      }
  
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);


  useEffect(() => {
    getProperties();
  }, [getProperties]);


const newProperty = 
    
    properties.map((ten )=> ten.firstAddress)
   



  const uploadFile = (e) => {
    
    const file = files[0];
    const ss = uuid() +"-"+file.name;
    setUploadFileName(ss);
    Storage.put(ss, file).then(res => {
      toast.success('Successfully uploaded');
     })
     .catch(err => {
      toast.error('Unexpected error while uploading, try again', err);
     });  
}

  const propertyAddress = properties.map((property=> property.firstAddress))
  const saveTenancies = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const selectedProperty= properties.filter(property=>property.firstAddress==address);
    if (selectedProperty== undefined){
      toast.error("you must select a property")
    } 
    const newTenancy= {
      "propertyId":selectedProperty && selectedProperty[0]? selectedProperty[0]['id'] : '',
      "Title": title,
      "price" : price,
      "deposit": deposit,
      "property" : address,
      "purchaseDate": purchaseDate,
      "EndDate": endDate,
      "userId": user.username,
      "documentName": uploadFileName,
    
    
    }
    tenancy['id'] = await propertiesApi.saveTenancies(newTenancy);
    
  }

   const useStyles = makeStyles({
    root: {
      height: 'auto',
      maxWidth: 90,
      wordWrap: "break-word",
    },
    actions: 
    {
      verticalAlign: 'middle',
      lineHeight: '30px',
      margin: 'auto',
      paddingRight: '5px',
      verticalAlign: 'middle', 
    }
  });
  const classes = useStyles();  
    
  return (
    <>
    


    <Formik
      initialValues={{
        Property: property,
        Title: title,
        purchaseDate: new Date(),
        price: price,
        images: [],
        endDate: new Date(),
       deposit: deposit,
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          
          Title: Yup.string().required(),
          price: Yup.number().required("Price is a required field"),
          purchaseDate: Yup.date().required("Date is required"),
          images: Yup.array(),
          deposit: Yup.string().required(),
          Property: Yup.array().required().nullable(),
          endDate: Yup.date().required("Date is required"),
          
          
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
      
          saveTenancies(); 
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          {...other}
        >
          <Card sx={{ p: 3 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Tenancy details
            </Typography>



                

            <Autocomplete
                    getOptionLabel={(option) => option}
                    options={propertyAddress}
                    onChange={(e, value) => {
                      if(value === null) {
                        value=" "
                      }
                      setAddress(value)
                    values.Address= value.array
                    }}      
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        label="Property"
                        name="Property"
                        variant="outlined"
                        error={Boolean(touched.Address && errors.Address)}
                        helperText={touched.Address && errors.Address}
                        value={values.Address}
                        onBlur={handleBlur}              
                        {...params}
                      />
                    )}
                  />
                

            <Box sx={{ mt: 2 }}/>
                <TextField
                error={Boolean(touched.title && errors.title)}
                fullWidth
                helperText={touched.title && errors.title}
                label="Title"
                name="Title"
                onBlur={handleBlur}
              
                onChange={(e) => {
                setTitle(e.target.value)
                values.Title = e.target.value
                }}
                variant="outlined"  
                required={true}
                value={values.Title}
              />
       
            
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
              </Box>


            <Box sx={{ mt: 2 }}/>
          
            < TextField
                error={Boolean(touched.price && errors.price)}
                fullWidth
                helperText={touched.price && errors.price}
                label="Price"
                name="Price" 
                type="number"
                onBlur={handleBlur}
                onChange={(e) => {
                  setPrice(e.target.value)
                values.price= e.target.value
                }}
                variant="outlined"
                value={values.price}
                required={true}
                InputProps={{
                  startAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
             
              /> 
  
             <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
              </Box>
          <Box sx={{ mt: 2 }}/>
            < TextField
                error={Boolean(touched.deposit && errors.deposit)}
                fullWidth
                helperText={touched.deposit && errors.deposit}
                label="Deposit"
                name="Deposit" 
                type="number"
                onBlur={handleBlur}
                onChange={(e) => {
                  setDeposit(e.target.value)
                values.deposit= e.target.value
                }}
                variant="outlined"
                value={values.deposit}
                required={true}
                InputProps={{
                  startAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
             
              /> 
             
   
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
              </Box>
       
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
              </Box>
                <Box sx={{ mr: 2 }}>
                <MobileDatePicker
                          label="Start Date"
                          onAccept={date => {
                            setPurchaseDate(date.toLocaleDateString());
                            values.purchaseDate = date;
                            setFieldTouched('=purchaseDate');
                          }}
                          onChange={date => setFieldTouched('=purchaseDate',date)}
                          onClose={() => setFieldTouched('=purchaseDate')}
                          
                     
                          renderInput={(inputProps) => (
                            <TextField
                         
                            
                            variant="outlined"
                            required={true}
                             {...inputProps}
                            
                            />
                          )}
                          
                          name="StartDate"
                          value={values.purchaseDate}
                          
                        />
                      {Boolean(touched.purchaseDate && errors.purchaseDate) && (
                        <FormHelperText error>
                          {errors.purchaseDate} 
                        </FormHelperText>
                     
                      
                    )} 
                  </Box> 
      
                    <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
              </Box>
                    <Box sx={{ mr: 2 }}>
                <MobileDatePicker
                          label="End Date"
                          onAccept={date => {
                            setEndDate(date.toLocaleDateString());
                            values.endDate = date;
                            setFieldTouched('=endDate');
                          }}
                          onChange={date => setFieldTouched('=endDate',date)}
                          onClose={() => setFieldTouched('=endDate')}
                          
                     
                          renderInput={(inputProps) => (
                            <TextField
                         
                            
                            variant="outlined"
                            required={true}
                             {...inputProps}
                            
                            />
                          )}
                          
                          name="EndDate"
                          value={values.endDate}
                          
                        />
                      {Boolean(touched.endDate && errors.endDate) && (
                        <FormHelperText error>
                          {errors.endDate} 
                        </FormHelperText>
                     
                      
                    )} 
                  </Box> 
              
                
            <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Upload Contract" />
                 
                  <CardContent>
                   
                    <FileDropzoneProp
                      accept="image/*,.pdf"
                      files={files}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      onClick={uploadFile}
                     
                      //maxFileSize={5000000}
                     
                    />
 
          
                  </CardContent>
                </Card>
              </Box>
            <Box
              sx={{
                display: 'flex',
                mt: 6
              }}
            > 
              {onBack && (
                <Button
                  color="primary"
                  onClick={onBack}
                  size="large"
                  variant="text"
                >
                  Previous
                </Button>
              )}
     
             <Box sx={{ m: -1 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
                onClick={handleSubmit}
              >
                Save

                
              </Button>
              
              </Box>
                        
             <Box sx={{ ml: 2 ,mt:-1}}>
              <Button
                color="primary"
                
                component={RouterLink}
                variant="contained"
                to="/dashboard/tenancies"
              >
                Cancel

                
              </Button>
              
              </Box>
            </Box>
       
          </Card>
        
        </form>
        
      )}
    </Formik>
    </>
  );
              };    
          
TenancyDetailsForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
 
};

export default TenancyDetailsForm ;
