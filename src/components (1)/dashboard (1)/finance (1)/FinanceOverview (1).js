import numeral from 'numeral';
import Chart from 'react-apexcharts';
import { Box, Grid, Typography, Card } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import TotalPortfolio from '../TotalPortfolio';
import Revenue from '../Revenue';
import TotalProfit from '../TotalProfit';

const ChartLine = () => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#7783DB'],
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };

  const chartSeries = [{ data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30] }];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="line"
    />
  );
};

const data = {
  sales: {
    actualYear: 152996,
    lastYear: 121420
  },
  profit: {
    actualYear: 32100,
    lastYear: 25200
  },
  cost: {
    actualYear: 99700,
    lastYear: 68300
  }
};

const FinanceOverview = (props) => (
  <Card {...props}>
    <Grid container>
      <Grid
        item
        md={4}
        xs={12}
        sx={{
          alignItems: 'center',
          borderRight: (theme) => ({
            md: `1px solid ${theme.palette.divider}`
          }),
          borderBottom: (theme) => ({
            md: 'none',
            xs: `1px solid ${theme.palette.divider}`
          }),
          display: 'flex',
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <TotalPortfolio />
      </Grid>
      <Grid
        item
        md={4}
        xs={12}
        sx={{
          alignItems: 'center',
          borderRight: (theme) => ({
            md: `1px solid ${theme.palette.divider}`
          }),
          borderBottom: (theme) => ({
            xs: `1px solid ${theme.palette.divider}`,
            md: 'none'
          }),
          display: 'flex',
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <Revenue />
      </Grid>
      <Grid
        item
        md={4}
        xs={12}
        sx={{
          alignItems: 'center',
          borderRight: (theme) => ({
            md: `1px solid ${theme.palette.divider}`
          }),
          borderBottom: (theme) => ({
            xs: `1px solid ${theme.palette.divider}`,
            md: 'none'
          }),
          display: 'flex',
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <TotalProfit />
      </Grid>
    </Grid>
  </Card>
);

export default FinanceOverview;
