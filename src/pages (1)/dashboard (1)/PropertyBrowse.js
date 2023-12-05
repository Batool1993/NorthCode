import { useCallback, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography, Card, Checkbox, Chip, Divider, FormControlLabel, Input } from '@material-ui/core';
import { propertiesApi } from '../../api/PropertiesApi';
import { PropertyBrowseFilter, PropertyBrowseResults,} from '../../components/dashboard/property';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import PropertyCard from '../../components/dashboard/property/PropertyCard';
import SearchIcon from '../../icons/Search';
import TenancyDetailsForm from '../../components/dashboard/property/TenancyDetailsForm'
const PropertyBrowse = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [properties, setProperties] = useState([]);
 
  

  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

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


  return (
    
    <>
      
      <Helmet>
        <title>Dashboard: Property Browse | Material Kit Pro</title>
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
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Properties
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
                  to="/dashboard/properties"
                  variant="subtitle2"
                >
                  Properties
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                > 
                  Browse
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
           

                <Button
                  color="primary"
                  component={RouterLink}
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  to="/dashboard/properties/new"
                  variant="contained"
                >
                  Add Property
                </Button> 

            
            </Grid>
          </Grid>
          <Box sx={{ mt: 1 }}>
            <PropertyBrowseFilter properties={properties} />
          </Box>
          <Box sx={{ mt: 6 }}>
            <PropertyBrowseResults properties={properties}  />
          </Box>
        
        
        </Container>
      </Box>
    </>
  );
};

export default PropertyBrowse;