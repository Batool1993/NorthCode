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

const ForYou = (props) => (
  <Card {...props}>
    <CardHeader
      subtitle={`${products.length} in total`}
      title="For You"
    />
    <Divider />
    
    
    
  </Card>
);

export default ForYou;
