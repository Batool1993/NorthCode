import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Container,
  Typography,
  Pagination,
  Card,
  Checkbox,
  TableCell,
  Table,
  Grid,
  Breadcrumbs,
  InputAdornment,
  Link,
  TableRow
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import PlusIcon from '../icons/Plus';
import TenancyListResults from '../components/dashboard/property/TenancyListResults';
import TenancyListToolbar from '../components/dashboard/property/TenancyListToolbar';
import useMounted from '../hooks/useMounted';
import UploadIcon from '../icons/Upload';
import useSettings from '../hooks/useSettings';
import gtm from '../lib/gtm';
import { propertiesApi } from '../api/PropertiesApi';
import SearchIcon from '../icons/Search';
import ChevronRightIcon from '../icons/ChevronRight';
import DownloadIcon from '../icons/Download';

 const sortOptions = [
  {
    label: 'Newest first',
    value: 'createdAt|desc'
  },
  {
    label: 'Oldest first',
    value: 'createdAt|asc'
  }
];
const Tenancies = () => {
 const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });
    const [filteredResults1, setFilteredResults1] = useState([]);
  const { settings } = useSettings();
  const mounted = useMounted();
    const [query, setQuery] = useState('');
  const [Tenancies, setTenancies] = useState([]);
const [inputValue, setInputValue] = useState('');
 const [sort, setSort] = useState(sortOptions[0].value);
  const [filteredResults, setFilteredResults] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

  const getTenancies = useCallback(async () => {
    try {
      const data  = await propertiesApi.lisTenancies()
;

      if (mounted.current) {
        setTenancies(data);
  
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

 
  useEffect(() => {
    getTenancies();
  }, [getTenancies]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };
const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (customers, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};
   const searchItems = (searchValue) => {
        setInputValue(searchValue)
      
if (inputValue !== '') {
            const filteredData = Tenancies.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(inputValue.toLowerCase())
            })
            
            setFilteredResults(filteredData)

        }}
         const handleSorthange = (event) => {
    setSort(event.target.value);
  };

const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(event.target.checked
      ? Tenancies.map((tenancy) => tenancy.id)
      : []);
  };

  const applyFilters = (customers, query, filters) => customers
  .filter((customer) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (customer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && customer[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });

const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerId));
    }
  };
  const applyPagination = (customers, page, limit) => customers
  .slice(page * limit, page * limit + limit);
    const filteredCustomers = applyFilters(Tenancies, query, filters);

    const sortedCustomers = applySort(filteredCustomers, sort);

  const enableBulkActions = selectedCustomers.length > 0;
  const selectedAllCustomers = selectedCustomers.length === Tenancies.length;
  const selectedSomeCustomers = selectedCustomers.length > 0
    && selectedCustomers.length < Tenancies.length;
      const paginatedCustomers = applyPagination(sortedCustomers, page, limit);

  return (
    <>
   <Helmet>
        <title>Dashboard: Tenancies | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          
         
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
                Tenancies
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
                  Tenancies
                </Typography>
              </Breadcrumbs>
              <Box
                sx={{
                  mb: 3,
                  mx: 3,
                  mt: 1
                }}
              >
                
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
            
              </Box>
            </Grid>
          </Grid>
         
        </Container>
      </Box>

  

    
     <Card sx={{ml:3.5,width:1050,py:-9,}}>  
    
     
        <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          minWidth: 500,
          p: 2,
          
          flexWrap: 'wrap',
        }}
      >
       
        
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            onChange={(e) => searchItems(e.target.value)}
            placeholder="Search Tenancies"
            vvalue={inputValue}
            variant="outlined"
          />
        </Box>
{/*  <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 200
          }}
        >
          <TextField
            fullWidth
            label="Sort By"
            name="sort"
            onChange={handleSorthange}
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
        <Box
          sx={{
            ml: 41,
       
          }}
        >
       
       <Button
        color="primary"
        component={RouterLink}
        startIcon={<PlusIcon fontSize="small" />}
        variant="contained"
        to="/dashboard/properties/tenancy"
      >
        Add Tenancy
      </Button>
      </Box>
      </Box>
       
    
    <Box
      sx={{
        backgroundColor: 'background.default',
        
        display: 'flex',
        justifyContent: 'flex-end',
        minHeight: '100%',
        py: 3
      }}
    >
    <Card sx={{ml:0,mt:-2,width:1050,}}>  
    
 
         
         
        
      
     
      <TableCell>
      <Box
        sx={{
          
          mt: 2,
        }}
      >
        <Grid 
          alignItems="right"
          container
          justifyContent="space-between"
          spacing={1}
          
        >
        
          <Grid item
          
          >
            {enableBulkActions && (
       <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              ml:-1,
          mt:-1 ,
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            
          </Box>
        </Box>
      )}

      
<Typography >
{/* <Checkbox
 sx={{
          ml:-1,
          mt:-1 ,
        }}
      checked={selectedAllCustomers}
                    color="primary"
                    indeterminate={selectedSomeCustomers}
                    onChange={handleSelectAllCustomers}/> */}
</Typography>

           <Typography color="primary" variant="body2" sx={{
          px:5.9,
          mt:-4 ,
          ml:-1,
          mt:-1 ,
        }}> 
              Start Date:
           
            </Typography>

             <Typography color="primary" variant="body2"sx={{
          px:28,
          mt:-2.5 ,
        }}>
              End date:
            </Typography>

                <Typography color="primary" variant="body2"sx={{
          px:50,
          mt:-2.5 ,
        }}>
              Title:
            </Typography>
            <Typography color="primary" variant="body2"sx={{
          px:67,
          mt:-2.5 ,
        }}>
              Price:
            </Typography>
            

             <Typography color="primary" variant="body2"sx={{
          px:88,
          mt:-2.5 ,
        }}>
              Deposit:
            </Typography>
              <Typography color="primary" variant="body2"sx={{
          px:105,
          mt:-2.5 ,
        }}>
              Contract:
            </Typography>
            <Typography color="primary" variant="body2"sx={{
          px:120,
          mt:-2.5 ,
        }}>
             Details
            </Typography>
          </Grid>
  <Grid item>

           
             </Grid>
             
          
            
             
          </Grid>

              </Box>
              </TableCell>
              {inputValue.length >0?(
              <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          
        }}
      >
      
        
         
        <Box  sx={{
            
            justifyContent: 'right',
            pt: 3
          }} >
       
        {filteredResults.map((tenancy) => (
        <Box sx={{ pt: 2 }}  key={tenancy.id}>    
          <TenancyListResults tenancy={tenancy}  />        
        </Box> ))}
        
        <Box
          sx={{
            
            justifyContent: 'right',
            pt: 3
          }}
        >
          {/* <Pagination color="primary" count={3} size="small" /> */}
        </Box>
       
         </Box>
         </Box>
              ):(

   <Box
        sx={{
          alignItems: 'center',
        
          
        }}
      >
      
        
         
        <Box  sx={{
            
            justifyContent: 'right',
            pt: 3
          }} >
       
        {Tenancies.map((tenancy) => (
        <Box sx={{ pt: 2 }}  key={tenancy.id}>        
          <TenancyListResults tenancy={tenancy}  />        
        </Box> ))}
        
        <Box
          sx={{
            
            justifyContent: 'right',
            pt: 3
          }}
        >
          {/* <Pagination color="primary" count={3} size="small" /> */}
        </Box>
       
         </Box>
         </Box>




              )} 
       
   
      </Card>
    </Box>
  </Card>
  </>
  
  );
};

export default Tenancies;
