import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const FinanceSalesRevenue = (props) => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: ['#ffb547', '#7783DB'],
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'solid',
      opacity: 0
    },
    grid: {
      borderColor: theme.palette.divider
    },
    markers: {
      strokeColors: theme.palette.background.paper,
      size: 6
    },
    stroke: {
      curve: 'straight',
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    }
  };

  const chartSeries = [
    {
      name: '22A Eckstein Road',
      data: [450, 453, 465, 458, 460, 468]
    },
    {
      name: 'Flat 6 Lauveine road',
      data: [455, 463, 470, 468, 470, 478]
    },
    {
      name: 'Flat 7 Lauveine road',
      data: [520, 525, 550, 540, 543, 560]
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="Price index" />
      <CardContent>
        <Chart
          height="360"
          options={chartOptions}
          series={chartSeries}
          type="area"
        />
      </CardContent>
    </Card>
  );
};

export default FinanceSalesRevenue;
