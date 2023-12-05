
import { useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNowStrict } from 'date-fns';
import { Box, Button, Container, Divider, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { propertiesApi } from '../../../api/PropertiesApi';

import {
  PropertyActivities,
  PropertyApplicants,
  PropertyApplicationModal,
  PropertyReviews,
  PropertyTenants,
  PropertyCardOverview,
  PropertyCertificates,
  PropertyInsurances,
  PropertyTenanciesOverview,
  PropertyCertificatesNew,
  PropertyDocuments
} from './';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import CalendarIcon from '../../../icons/Calendar';
import CheckIcon from '../../../icons/Check';
import ExclamationIcon from '../../../icons/Exclamation';
import ShareIcon from '../../../icons/Share';
import gtm from '../../../lib/gtm';


const  tenants=[
       { id: '5e887b7602bdbc4dbb234b27',
        avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png',
        name: 'Jie Yan Song'
        } ]
     
const tabs = [
  { label: 'Overview', value: 'Overview' },
  { label: 'Tenants', value: 'Tenants' },
  { label: 'Certificates', value: 'Certificates' },
  { label: 'Insurances', value: 'Insurances' },
  { label: 'Tenancies', value: 'Tenancies' },
  { label: 'Miscellaneous Documents', value: 'Miscellaneous Documents' }
]

const PropertyDetails = (props) => {
  const {  property} = props;
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('Overview');
  let [tenancies, setTenancies] = useState([]);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  let [tenancy, setTenancy] = useState([]);
  const [mounted, setMounted] = useState(false)
  const [tenant, setTenant]= useState([]);
  const [tenants, setTenants]= useState([]);

  const getTenancies = useCallback(async () => {
    try {
      
      const data4 = await propertiesApi.getTenancies(property.id)
      setTenancies(data4)
      

        if (mounted.current) {
        console.log(data4, 'fsd')
        
        
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);
   


  useEffect(() => {
    getTenancies();
  }, [getTenancies]); 


 
  
  const handleApplyModalOpen = () => {
    setIsApplicationOpen(true);
  };

  const handleApplyModalClose = () => {
    setIsApplicationOpen(false);
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!property) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Property | All</title>
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
                {property.title}
              </Typography>

            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
           
          </Box>
          <Divider />
         
          <Box sx={{ mt: 3}}> 
          

            {currentTab === 'Overview'
            && <PropertyCardOverview property={property} tenant={tenant} />}
            
            {currentTab === 'Tenants'
            && <PropertyTenants tenant={tenant} tenancy={tenancy} property={property} /> }
            {currentTab === 'Certificates'
            && <PropertyCertificates property={property}  />}
            {currentTab === 'Insurances'
            && <PropertyInsurances property={property}   />}
              
           {currentTab === 'Tenancies'
            && <PropertyTenanciesOverview property={property}  />}

           {currentTab === 'Miscellaneous Documents'
            && <PropertyDocuments property={property}  />}
           
           
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PropertyDetails;
