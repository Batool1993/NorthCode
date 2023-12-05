import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Autocomplete, Button, Card, Grid, Switch, TextField, Typography,FormControlLabel, CardActions, Checkbox } from '@material-ui/core';
import wait from '../../../utils/wait';
import { propertiesApi } from '../../../api/PropertiesApi';
import { update } from 'lodash-es';

const CustomerEditForm = (props) => {
  const { tenant , ...other } = props;
  let [righttorent, setRighttorent ] = useState (false); 
  let [refrenceCheck, setRefrenceCheck ] = useState (false);
  const [location, setLocation ] = useState (''); 
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('');
  const [phone, setPhone]= useState('');
  const [email, setEmail] = useState('');
  const [properties, setProperties] = useState([]);
  const [address, setAddress] = useState ('');
  const getProperties = async () => {
    try {
      const data = await propertiesApi.getProperties()
     
        setProperties(data);
        setMounted(true)
      
    } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getProperties();
  }
  
  
  
  const handleRightCheck = (event) => {
    setRighttorent(event.target.checked);
  };  
  const handleRefCheck = (event) => {
    setRefrenceCheck(event.target.checked);
  };  

  const updateTenant = async () => {
    
    const selectedProperty= properties.filter(property=>property.firstAddress==address);
    if (selectedProperty== undefined){
      toast.error("you must select an address")
    } 
   
    const tenant= {
      "id" : '0788c381-fd5a-4ad4-9032-e3c868f8fb4b', 
      "name": 'name', 
      "tenancyId": '870a613a-60bc-48f2-b21a-bb5ffa21849a',
      "propertyId":'2c82421e-473e-4eae-b584-2d33ce08c63f',
      "location" : location,
      "phone": phone,
      "email": email,
      "address": address,
      "righttorent": righttorent,
      "refrenceCheck": refrenceCheck,
    
    }
    return await propertiesApi.updateTenants(tenant);
   
  } 

                      
const propertyLocation = properties.map((property)=> property.location)
 const propertyAddress = properties.map((property=> property.firstAddress))

  return (
    
    <Formik
      initialValues={{
        address1: tenant.address,
       
        country: tenant.country || '',
        email: tenant.email || '',
        name: tenant.name || '',
        phone: tenant.phone || '',
        righttorent: tenant.righttorent || '',
        refrenceCheck : tenant.refrenceCheck || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          address1: Yup.string().max(255),
          righttorent:Yup.string().max(255),
          country: Yup.string().max(255),
          email: Yup
            .string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
            refrenceCheck: Yup.string().max(255),
          name: Yup
            .string()
            .max(255)
            .required('Name is required'),
          phone: Yup.string().max(15),
          state: Yup.string().max(255)
        })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
          updateTenant();
          // NOTE: Make API request
          await wait(500);
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Tenant updated!');
        } catch (err) {
          console.error(err);
          toast.error('Something went wrong!');
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form
          onSubmit={handleSubmit}
          {...other}
        >
          <Card>
            <Box sx={{ p: 3 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                
                 <Autocomplete
                
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
                    label="Address"
                    name="Address"
                    variant="outlined"
                    error={Boolean(touched.Address && errors.Address)}
                    
                    helperText={touched.Address && errors.Address}
                    
                    value={values.Address}
                    onBlur={handleBlur}              
                    {...params}
                   
                  />
                  
                )}
              />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                <Autocomplete
               
                options={propertyLocation}
                onChange={(e, value) => {
                  if(value === null) {
                    value=" "
                   }
                  setLocation(value)
                values.location= value.array
                }}      
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    label="Location"
                    name="Location"
                    variant="outlined"
                    error={Boolean(touched.location && errors.location)}
                    
                    helperText={touched.location && errors.location}
                    
                    value={values.location}
                    onBlur={handleBlur}              
                    {...params}
                   
                  />
                  
                )}
              />
              </Grid>
              <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    helperText={touched.phone && errors.phone}
                    label="Phone number"
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    variant="outlined"
                  />
                </Grid>


                <Grid
                  item
                  md={6}
                  xs={12}
                >
                <CardActions >
                  <FormControlLabel
                
                    control={<Checkbox  checked={righttorent}
                    onChange={handleRightCheck}  />}
                    label={(
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        Right to Rent
                      </Typography>
                    )}
                    />

                    <FormControlLabel
                    sx={{}}
                    control={<Checkbox checked={refrenceCheck} onChange={handleRefCheck} />}
                    label={(
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        Reference Check
                      </Typography>
                    )}
                    />
                  </CardActions>
                  </Grid>
                </Grid>
              <Box sx={{ mt: 7 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Update Tenant
                </Button>
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
   
  );
};


export default CustomerEditForm;
