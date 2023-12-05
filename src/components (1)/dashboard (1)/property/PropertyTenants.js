import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import getInitials from '../../../utils/getInitials';
import { propertiesApi} from '../../../api/PropertiesApi';
import { useState } from 'react';
import  {Storage} from "aws-amplify";

const PropertyTenants = (props) => {
  const {tenant, tenancy, property,  ...other } = props;
  const [tenants, setTenants] = useState([]);
  const [mounted, setMounted]= useState(false); 

  const getTenants = async () => {
    setMounted(true)
    try {
      const data = await propertiesApi.getTenantsOverview(property.id);
      for(let tenant of data)  {
        await Storage.get(tenant.avatar, {level: 'public'}).then(res => {
          tenant.avatarUrl = res;
        });
      }
      setTenants(data)
    } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getTenants();
  }

  
  return (
    <Card {...other}>
         
      <CardHeader
        sx={{ pb: 0 }}
        title="Tenants"
        titleTypographyProps={{ variant: 'overline' }}
      />
      <CardContent sx={{ pt: 0 }}>
        <List>
          {tenants && tenants.map((tenant) => (
         
            <ListItem
              disableGutters
              key={tenant.id}
            >
              <ListItemAvatar>
                <Avatar src={tenant.avatarUrl}>
                  {getInitials(tenant.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={(
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    {tenant.name}
                   
                  </Typography>
                )}
                secondary={(
                  <List color="textSecondary" >
                    <ListItem>
                      email : {tenant.email}
                    </ListItem>
                    <ListItem>
                     phone:  +44 {tenant.phone}
                    </ListItem>
                   
                  </List>
                )}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

PropertyTenants.propTypes = {
 // tenants: PropTypes.array.isRequired
};

export default PropertyTenants;
