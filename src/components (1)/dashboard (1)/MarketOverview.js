import { v4 as uuid } from 'uuid';
import numeral from 'numeral';
import { MarketOverview } from "react-ts-tradingview-widgets";
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const products = [
  {
    id: uuid(),
    name: '----',
    
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: '----',
    
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: '----',
    
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: '----',
    
    updatedAt: moment().subtract(2, 'hours')
  },

];

const MarketOvervieww = (props) => (



  <Card {...props}>
    <CardHeader
      
      title="Market Overview"
    />
    <Divider />
    {/* <MarketOverview colorTheme="light" height={620} showFloatingTooltip></MarketOverview> */}
    
  </Card>
);

export default MarketOvervieww;
