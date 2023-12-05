import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { format, getTime } from "date-fns";
import numeral from "numeral";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Autocomplete,
  Box,
  Card,
  CardHeader,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Link,
  Table,
  TableBody,
  Popover,
  TableCell,
  TableHead,
  TablePagination,
  FormHelperText,
  TextField,

  Switch,
  Select,
  MenuItem,
  ListItemIcon,
   ListItemText, 
  Menu,
  TableRow,
  Typography,
} from "@material-ui/core";

import ArrowRightIcon from "../../../icons/ArrowRight";
import PencilAltIcon from "../../../icons/PencilAlt";
import Label from "../../Label";
import MoreMenu from "../../MoreMenu";
import Scrollbar from "../../Scrollbar";
import {propertiesApi} from '../../../api/PropertiesApi';
import { makeStyles } from "@material-ui/core/styles"
import PropertyTenants from "./PropertyTenants";
import PropertyCard from './PropertyCard';

const applyPagination = (tenancies, page, limit) =>
  tenancies.slice(page * limit, page * limit + limit);

const PropertyTenanciesOverview = (props) => {
  const {  property, ...other } = props;
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
 
  const [limit, setLimit] = useState(5);
  const [mounted, setMounted] = useState(false)
  let [tenancies, setTenancies] = useState([]);
  let [status, setStatus] = useState('');
  const current = new Date();
  const date1 = new Date();

  const date = `${current.getMonth()+1}/${current.getDate()}/${current.getFullYear()}`;
  
  const getTenancies = async () => {
    try {
      const data4 = await propertiesApi.getTenancies(property.id)
     
        setTenancies(data4);
        setMounted(true)
      
    } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getTenancies();
  }
  

  const useStyles = makeStyles({
    font:
    {
      fontSize: '11.5px',
    },
  });
  const classes = useStyles();  
 
  const getStatusLabel = (certificateStatus) => {
    
    const map = {
      expired: {
        color: "error",
        text: "Expired",
      },
      valid: {
        color: "success",
        text: "Valid",
      },
      pending: {
        color: "warning",
        text: "About the Expire",
      }
    };
  
    const { text, color } = map[certificateStatus];

    return (
      <Label color={color}>
        {text}
      </Label>
    );
  }

  return (

    <>
     
     
      <Card {...other}>
       
        <Divider />
      


         
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.font}>Start Date</TableCell>
                  <TableCell className={classes.font}>End Date</TableCell>
                  <TableCell className={classes.font}>Price</TableCell>
                  <TableCell className={classes.font}>Status</TableCell>
                  <TableCell className={classes.font}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { tenancies.map((tenancy) => ( 
                
                    <TableRow >
                  
                      <TableCell>
                        <Typography className={classes.font} variant="body2">
                          
                          {tenancy.purchaseDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography  className={classes.font} variant="body2">
                          {tenancy.EndDate}
                       
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography  className={classes.font} variant="body2">
                          {tenancy.price}
                        </Typography>
                      </TableCell>
                      <TableCell className={classes.font}>
                    
                   
                          {Date.parse(tenancy.EndDate) < Date.parse(current) ? tenancy.status = getStatusLabel('expired') : tenancy.status = getStatusLabel('valid')}
                         
                     
                            
                   

                      
                      </TableCell>
                      <TableCell >
                        <Button 
                          component={RouterLink}
                          to="/dashboard/tenancies"
                        >
                          Edit 
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
       
     
          
      </Card>
    </>
  );           
};
            


PropertyTenanciesOverview.propTypes = {
  //tenancies: PropTypes.array.isRequired,
};

export default PropertyTenanciesOverview;
