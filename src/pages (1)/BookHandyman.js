import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ChevronRightIcon from '../icons/ChevronRight';
import useSettings from '../hooks/useSettings';
import gtm from '../lib/gtm';
import MobileDateTimePicker from '@material-ui/lab/MobileDateTimePicker';
import { Box, Button, Divider, FormControlLabel, Switch, TextField, Container, Grid, Typography, Breadcrumbs, Link} from '@material-ui/core';

const BookHandyman = () => {
  const { settings } = useSettings();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  return (
    <>
      <Helmet>
        <title>Dashboard: Book Engineer | Material Kit Pro</title>
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
                Book Engineer
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
                  Book Engineer
                </Typography>
              </Breadcrumbs>
              <Box
                sx={{
                  mb: -1,
                 
                  mt: 4
                }}
              >
                            <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3
      }}
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          variant="outlined"
        />
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            variant="outlined"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={(
              <Switch
                color="primary"
                name="allDay"
              />
            )}
            label="All day"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <MobileDateTimePicker
            onChange={(newDate) => setStartDate(newDate)}
            label="Start date"
            renderInput={(inputProps) => (
              <TextField
                fullWidth
                variant="outlined"
                {...inputProps}
              />
            )}
            value={startDate}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <MobileDateTimePicker
            onChange={(newDate) => setEndDate(newDate)}
            label="End date"
            renderInput={(inputProps) => (
              <TextField
                fullWidth
                variant="outlined"
                {...inputProps}
              />
            )}
            value={endDate}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="primary"
            variant="text"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            sx={{ ml: 1 }}
            type="submit"
            variant="contained"
          >
            Confirm
          </Button>
        </Box>
      </form>
    </Box>
               
              </Box>
            </Grid>

  );

          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default BookHandyman;
