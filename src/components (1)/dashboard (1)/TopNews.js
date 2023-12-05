import { v4 as uuid } from 'uuid';
import numeral from 'numeral';
import moment from 'moment';
import {
  Box,
  Button,
  TableHead,
  TableBody, 
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  Table, 
  Link,
  TableCell, 
  TableRow, 
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { propertiesApi } from '../../api/PropertiesApi';
import { useState, useCallback, useEffect } from 'react';
import useMounted from '../../hooks/useMounted';
import { navItem } from 'aws-amplify';

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

const TopNews = (props) => {
  const [news, setNews]= useState(''); 
  const mounted = useMounted();

  const getNews = useCallback(async () => {
    try {
      let data  = await propertiesApi.getNews();
      // data = data.slice(-5)
      console.log(data, 'hi')
      if (mounted.current) {
        setNews(data);
      }
    } catch (err) {
      console.error(err, 'error');
    }
  }, [mounted]);
  
  
  useEffect(() => {
    getNews();
  }, [getNews]);

  return ( 
  <Card {...props}>
    <CardHeader
      title="Top News"
    />
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            Source
          </TableCell>
          <TableCell>
           Title
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
{/*   {news.map((item) => ( 
        <TableRow >
          <TableCell>
            {item.source.name}
          </TableCell>
          <TableCell>
          <a target="_blank" href={item.url}>
          {item.title}
          </a>
          </TableCell>
            </TableRow>
              ))}  */}
                </TableBody>
                </Table>
                <Divider />
                  </Card>
                  )}; 

export default TopNews;
