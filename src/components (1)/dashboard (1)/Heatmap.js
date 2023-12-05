import { v4 as uuid } from 'uuid';
import numeral from 'numeral';
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
import WorldMap from '../../../src/components/dashboard/finance/WorldMap';




const Heatmap = (props) => (
  <Card {...props}>
    <CardHeader

      title="Property Price Heatmap"
    />
    <Divider />
    
    
   
  </Card>
);

export default Heatmap;
