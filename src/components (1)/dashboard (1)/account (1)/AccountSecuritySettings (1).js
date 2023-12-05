import { Link as RouterLink } from 'react-router-dom';
import { createContext, useEffect, useReducer, useState } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import wait from '../../../utils/wait';

const AccountSecuritySettings = (props) => {
  const { user } = useAuth();
  
  return (
    <Grid
      container
      spacing={3}
      {...props}
    >
   
      <Grid
        item
        //lg={8}
        //md={6}
        xl={9}
        xs={12}
      >
        <Formik
          enableReinitialize
          initialValues={{
            canHire: user.canHire || false,
            city: user.city || '',
            country: user.country || '',
            email: user.email || '',
            isPublic: user.isPublic || false,
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            submit: null
          }}
          validationSchema={Yup
            .object()
            .shape({
              
            })}
          onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const user = await Auth.currentAuthenticatedUser();
                await Auth.changePassword(user, 
                /* 'Aram123123!',
                'Password123!' */
                values.password,
                values.password2
                  
                );
              
              await wait(200);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              toast.success('Password updated!');
            } catch (err) {
              console.error(err);
              toast.error('Something went wrong!');
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title="Change Password" />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={4}
                  >
                    <Grid
                      item
                      md={4}
                      xs={12}
                    >
                     <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Old Password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        values.password = e.target.value
                        setFieldValue('password', e.target.value)
                        }}
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                
                    </Grid>
                    <Grid
                      item
                      md={4}
                      sm={6}
                      xs={12}
                    >

                  <TextField
                    error={Boolean(touched.password2 && errors.password2)}
                    fullWidth
                    helperText={touched.password2 && errors.password2}
                    label="New Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      values.password2 = e.target.value
                      setFieldValue('password2', e.target.value)
                      }}
                    type="password"
                    value={values.password2}
                    variant="outlined"
                  />
                  </Grid>
                    </Grid>
                    {errors.submit && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>
                          {errors.submit}
                        </FormHelperText>
                      </Box>
                    )}
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 2
                    }}
                  >
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    Change Password
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AccountSecuritySettings;
