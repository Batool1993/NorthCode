import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getParams } from 'react-router-dom';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { customerApi } from '../../__fakeApi__/customerApi';
import { CustomerEditForm } from '../../components/dashboard/customer';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { propertiesApi } from '../../api/PropertiesApi';
import {useLocation} from 'react-router-dom';

const CustomerEdit = (props) => {
 
  const { settings } = useSettings();
  //let tenant = useLocation();
  //const location = useLocation()

  const [mounted, setMounted] = useState(false);

 let [tenant, setTenant]= useState([]);
  const getTenants = async () => {
    setMounted(true)
    try {
      const data = await propertiesApi.getTenants();
      for(let tenant of data) {
       setTenant(tenant)
        }
      }
     catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getTenants();
  }
 
    
    return (
    

    <>
     
    
      <Helmet>
        
        <title>Dashboard: Edit Tenants | Material Kit Pro</title>
      </Helmet>
     
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
         
        <Container maxWidth={settings.compact ? 'xl' : false}>
       
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                 Edit Tenant Details
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Dashboard
                </Link>
                
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Management
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Tenants
                </Typography>
              </Breadcrumbs>
            </Grid>
            
          </Grid>
          
         
            
          <Box mt={3}>
            
          
          
            <CustomerEditForm tenant={tenant}/>  
           
           
          </Box> 
       
        </Container>
          
 
      </Box>

    </>
    
  );

};

export default CustomerEdit;
