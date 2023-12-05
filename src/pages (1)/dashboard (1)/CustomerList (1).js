import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography, Card,Table,
  TableBody,
  TableCell,
  TableHead,
  Checkbox,
  Divider,
  TextField,
  Input,
  InputAdornment,
  TablePagination,
  TableRow } from '@material-ui/core';
import { customerApi } from '../../__fakeApi__/customerApi';
import { CustomerListTable } from '../../components/dashboard/customer';
import useMounted from '../../hooks/useMounted';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import PlusIcon from '../../icons/Plus';
import UploadIcon from '../../icons/Upload';
import Scrollbar from '../../components/Scrollbar';
import SearchIcon from '../../icons/Search';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import { propertiesApi } from '../../api/PropertiesApi';
import CustomerEdit from './CustomerEdit';
import  {Storage} from "aws-amplify";

const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|rbase'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
];

const CustomerList = (props) => {
  const { ...other } = props;
  const { settings } = useSettings();
  let   [tenants, setTenants] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [mounted, setMounted] = useState(false);
  let [tenant, setTenant] = useState([]);
 

  const getTenants = async () => {
    setMounted(true)
    try {
      const data = await propertiesApi.getTenants();
       for(let tenant of data)  {
        await Storage.get(tenant.avatar, {level: 'public'}).then(res => {
          tenant.avatarUrl = res;
        });
      }
      setTenants(data);
     
    } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getTenants();
  }

  const applyFilters = (tenants, query, filters) => tenants
  .filter((tenant) => {
    let matches = true;

    if (query) {
      const properties = [tenant];
      let containsQuery = false;
      properties.forEach((property) => {
        if (tenant[property].includes(query)) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && tenant[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });


  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

const applyPagination = (tenants, page, limit) => tenants
  .slice(page * limit, page * limit + limit);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (tenants, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = tenants.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}; 


  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(event.target.checked
      ? tenants.map((customer) => customer.id)
      : []);
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const searchItems = (searchValue) => {
    setInputValue(searchValue)
    
  
  if (inputValue !== '') {
        const filteredData = tenants.filter((tenant) => {
        return  Object.values(tenant).join('').toLowerCase().includes(inputValue.toLowerCase());
        }
        )
        setFilteredResults(filteredData)
    }}

  
  

  const filteredCustomers = applyFilters(tenants, query, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, limit);
  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers = selectedCustomers.length > 0
    && selectedCustomers.length < tenants.length;
  const selectedAllCustomers = selectedCustomers.length === tenants.length;
  const isCustomerSelected = selectedCustomers.includes(tenant.id);

   
  return (
    <>
    
      <Helmet>
        <title>Dashboard: Tenants </title>
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
                Tenants
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
                >
              <Button
                color="primary"
                startIcon={<PlusIcon fontSize="small" />}
                sx={{ m: 1 }}
                variant="contained"
                component={RouterLink}
                to="/dashboard/properties/tenant"
              >
                Add Tenant
              </Button>
                </Box>
          
         
          <Box sx={{ mt: 3 }}>
          <Card style={{ width: 1090 }} {...other}>
          <Divider />
         
        <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <SearchIcon fontSize="small" />
        <Box
          sx={{
            flexGrow: 1,
            ml: 3
          }}
        >
 
          <Input
            disableUnderline
            fullWidth
            onChange={(e) => searchItems(e.target.value)}
            placeholder="Search Tenants"
            value={inputValue}
          />       
        </Box>
        
      </Box>
      
       {inputValue.length > 0 ?(
     
        <>
       {/*  <Box
          sx={{
            m: 1,
            width: 260
          }}
        >
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
      </Box> */}
   
    
    
     
        
       
      <Card style={{ border: "none", boxShadow: "none",  width: 1090 }}>  
      <Scrollbar>
      
        
        
       {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
           
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Delete
            </Button>
          
          </Box>
        </Box>
      )} 
                  
            <TableRow>
             <TableCell>
               </TableCell>
               <TableCell>
               </TableCell>
              
               
             <TableCell style={{minWidth: 180}}>
               Name
             </TableCell>
             
             
               
             <TableCell style={{minWidth: 190}}>
               Phone
             </TableCell>
            
                    
             <TableCell style={{minWidth: 200}}>
               Location
             </TableCell>
            
              
             <TableCell style={{minWidth: 20}}>
               Address
             </TableCell>
            
              
             <TableCell align="right" style={{minWidth: 20}}>
             Right to Rent
             </TableCell>
             
             <TableCell  align="left" style={{minWidth: 25}} >
             Reference Check
             </TableCell>
             
             <TableCell align="right" style={{minWidth: 20}} >
               Edit
             </TableCell>
            
           </TableRow>
           </Scrollbar>
           <Scrollbar>
          <Box sx={{ minWidth: 1000 }}>
          <Table>
          
          <TableRow
                    
          key={tenant.id}
          selected={isCustomerSelected}
        >
          <TableCell padding="checkbox">
          {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllCustomers}
              color="primary"
              indeterminate={selectedSomeCustomers}
              onChange={handleSelectAllCustomers}
            />
            <Button
              color="primary"
              sx={{ ml: 5, ml:-1,
                mt:-1  }}
              variant="outlined"
            >
              Delete
            </Button>
          
          </Box>
        </Box>
      )} 
       {filteredResults.map((tenant) => (
         
           <CustomerListTable  tenants={tenants} tenant={tenant} /> 
        ) 
        )} 
      
      </TableCell>
          </TableRow> 
          </Table>
          </Box>
      </Scrollbar> 
       <TablePagination
        component="div"
        count={filteredCustomers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      /> 
    

      </Card>


      </>  
                   
  ):(
    <Card style={{ border: "none", boxShadow: "none",  width: 1090 }}>  
    <Scrollbar>
    
      
      
     {enableBulkActions && (
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            mt: '6px',
            position: 'absolute',
            px: '4px',
            width: '100%',
            zIndex: 2
          }}
        >
         
        
        </Box>
      </Box>
    )} 
                
          <TableRow>
           <TableCell>
             </TableCell>
             <TableCell>
             </TableCell>
            
             
           <TableCell style={{minWidth: 180}}>
             Name
           </TableCell>
           
           
             
           <TableCell style={{minWidth: 190}}>
             Phone
           </TableCell>
          
                  
           <TableCell style={{minWidth: 190}}>
             Location
           </TableCell>
          
            
           <TableCell style={{minWidth: 10}}>
             Address
           </TableCell>
          
             <TableCell></TableCell>
           <TableCell align="right" style={{minWidth: 10}}>
           Right to Rent
           </TableCell>
           
           <TableCell  align="left" style={{minWidth: 10}} >
           Reference Check
           </TableCell>
           
           <TableCell align="right" style={{minWidth: 10}} >
             Edit
           </TableCell>
           <TableCell></TableCell>
         </TableRow>
         </Scrollbar>
         <Scrollbar>
        <Box sx={{ minWidth: 1000 }}>
        <Table>
        
        <TableRow
                  
        key={tenant.id}
        selected={isCustomerSelected}
      >
        <TableCell padding="checkbox">
        {enableBulkActions && (
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            mt: '6px',
            position: 'absolute',
            px: '4px',
            width: '100%',
            zIndex: 2
          }}
        >
          <Checkbox
            checked={selectedAllCustomers}
            color="primary"
            indeterminate={selectedSomeCustomers}
            onChange={handleSelectAllCustomers}
          />
          <Button
            color="primary"
            sx={{ ml: 5, ml:-1,
              mt:-1  }}
            variant="outlined"
          >
            Delete
          </Button>
        
        </Box>
      </Box>
    )} 
        {tenants.map((tenant) => (
          
     
         
         <CustomerListTable  tenants={tenants} tenant={tenant} /> 
       
     
      ))}
     
    </TableCell>
        </TableRow> 
        </Table>
        </Box>
    </Scrollbar> 
     {/* <TablePagination
      component="div"
      count={filteredCustomers.length}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleLimitChange}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[5, 10, 25]}
    />  */}
  

                </Card>
  )}       
          </Card>

          </Box>
          </Grid>
           
           </Grid>
        </Container>
      </Box>
      </>
  
  

)
}
export default CustomerList;
