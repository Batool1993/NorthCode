import moment from 'moment';
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Link,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import useMounted from '../../hooks/useMounted';
import { propertiesApi } from '../../api/PropertiesApi';


const DueTasks = (props) => {

  const [tasks, setTasks]= useState([]); 
  const mounted = useMounted();

const getDueTasks = useCallback(async () => {
  try {
    let data  = await propertiesApi.getDueTasks();
    data = data.sort().slice(-5);
    if (mounted.current) {
      setTasks(data);
    }
  } catch (err) {
    console.error(err);
  }
}, [mounted]);


useEffect(() => {
  getDueTasks();
}, [getDueTasks]);

return (
  <Card {...props}>
    <CardHeader title="Tasks" />
    <Divider />
   
      
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Task
              </TableCell>
              <TableCell sortDirection="desc">
                    Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => ( 
                <TableRow
                key={task.id}>
              {task.name  && 
              <>
              <TableCell>
                <Link
                component={RouterLink}
                to="/dashboard/kanban">
                {task.name}
                </Link>
                </TableCell>
                <TableCell>
                {task.createdAt}
                </TableCell>
                </>}
                <>
                {task.status ==0 && <>
                <TableCell> 
                <Link
                component={RouterLink}
                to="/dashboard/kanban">
                  {(() => {
                    if (task.type === 'LANDLORD_EMERGENCY_COVER') 
                      return 'LANDLORD EMERGENCY COVER' + ' is about to expire'; 
                      else if (task.type === 'RENT_PROTECTION_INSURANCE')
                      return 'RENT PROTECTION INSURANCE' + ' is about to expire';
                      else if (task.type === 'BUILDING_INSURANCE')
                      return 'BUILDING INSURANCE' + ' is about to expire';
                      else if (task.type === 'CONTENT_INSURANCE')
                      return 'CONTENT INSURANCE' + ' is about to expire';
                      else
                      return task.type + ' is about to expire';
                      })()}   </Link>
                  </TableCell>
                  <TableCell>
                    {task.createdAt}
                    </TableCell> </> }
                    {task.status ==1 && <>
                    <TableCell>
                    <Link
                    component={RouterLink}
                    to="/dashboard/kanban">
                       {(() => {
                    if (task.type === 'LANDLORD_EMERGENCY_COVER') 
                      return 'LANDLORD EMERGENCY COVER' + ' expired'; 
                      else if (task.type === 'RENT_PROTECTION_INSURANCE')
                      return 'RENT PROTECTION INSURANCE' + ' expired';
                      else if (task.type === 'BUILDING_INSURANCE')
                      return 'BUILDING INSURANCE' + ' expired';
                      else if (task.type === 'CONTENT_INSURANCE')
                      return 'CONTENT INSURANCE' + ' expired';
                      else
                      return task.type + ' expired';
                      })()}  </Link>
                      </TableCell>
                      <TableCell>
                        {task.createdAt}
                        </TableCell> </>
                        }   
                        </>
                        </TableRow>
                        ))}
                        </TableBody>
                        </Table>
                         <Box
                         sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2
                        }}>
                          <Button
                          component={RouterLink}
                          color="primary"
                          endIcon={<ArrowRightIcon />}
                          to = "/dashboard/kanban"
                          size="small"
                          variant="text">
                            View all
                            </Button>
                            </Box>
                            </Card>
                            )
                          };
export default DueTasks;
