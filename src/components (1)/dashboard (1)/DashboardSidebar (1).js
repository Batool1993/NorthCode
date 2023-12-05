import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Divider, Drawer, Link, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReceiptIcon from '@material-ui/icons/Receipt';
import useAuth from '../../hooks/useAuth';
import BriefcaseIcon from '../../icons/Briefcase';
import CalendarIcon from '../../icons/Calendar';
import ChartPieIcon from '../../icons/ChartPie';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import ChatAltIcon from '../../icons/ChatAlt';
import ClipboardListIcon from '../../icons/ClipboardList';
import FolderOpenIcon from '../../icons/FolderOpen';
import MailIcon from '../../icons/Mail';
import HomeIcon from '../../icons/Home';
import ShareIcon from '../../icons/Share';
import ShoppingBagIcon from '../../icons/ShoppingBag';
import ShoppingCartIcon from '../../icons/ShoppingCart';
import UserIcon from '../../icons/User';
import UsersIcon from '../../icons/Users';
import EngineeringIcon from '@material-ui/icons/Engineering';
import Handyman from '@material-ui/icons/Handyman';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import  {Storage} from "aws-amplify";
import moment from "moment";
import FolderSharedOutlinedIcon from '@material-ui/icons/FolderSharedOutlined';
import ArticleOutlinedIcon from '@material-ui/icons/AcUnitOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import RequestQuoteOutlinedIcon from '@material-ui/icons/RequestQuoteOutlined';
import Amplify, { Auth } from 'aws-amplify';

const sections = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <ChartSquareBarIcon fontSize="small" />
      },
      {
        title: 'Properties',
        path: '/dashboard/properties/list',
        icon: <HomeIcon fontSize="small" />
      },
      {
        title: 'Finance',
        path: '/dashboard/finance',
        icon: <ShoppingBagIcon fontSize="small" />
      },
/*       {
        title: 'Bank Transactions',
        path: '/dashboard/invoices',
        icon: <RequestQuoteOutlinedIcon fontSize="small" />
      }, */
    /*   {
        title: 'Analytics',
        path: '/dashboard/analytics',
        icon: <ChartPieIcon fontSize="small" />
      }, */
      /* {
        title: 'Account',
        path: '/dashboard/account',
        icon: <UserIcon fontSize="small" />
      }, */
       {
        title: 'Tasks',
        path: '/dashboard/kanban',
        icon: <ListAltOutlinedIcon fontSize="small" />
      },
    ]
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Tenants',
        path: '/dashboard/tenants',
        icon: <UsersIcon fontSize="small" />
      },
      {
        title: 'Tenancies',
        path: '/dashboard/tenancies',
        icon: <FolderSharedOutlinedIcon fontSize="small" />
      },
      /* {
        title: 'Book Engineer',
        path: '/dashboard/bookanengineer',
        icon: <EngineeringIcon fontSize="small" />
      },
      {
        title: 'Book Handyman',
        path: '/dashboard/bookhandyman',
        icon: <Handyman fontSize="small" />
      },
      {
        title: 'Book Certificate',
        path: '/dashboard/bookcertificate',
        icon: <ReceiptIcon  fontSize="small" />
      },
      {
        title: 'Insurace Quotes',
        path: '/dashboard/insurancequotes',
        icon: <ReceiptIcon  fontSize="small" />
      } */
    ]
  },
 /*  {
    title: 'Platforms',
    items: [
      {
        title: 'Social',
        path: '/dashboard/social',
        icon: <ShareIcon fontSize="small" />,
        children: [
          {
            title: 'Profile',
            path: '/dashboard/social/profile'
          },
          {
            title: 'Feed',
            path: '/dashboard/social/feed'
          }
        ]
      }
    ]
  }, */
  /* {
    title: 'Apps',
    items: [
     
      {
        title: 'Mail',
        path: '/dashboard/mail',
        icon: <MailIcon fontSize="small" />
      },
      {
        title: 'Chat',
        path: '/dashboard/chat',
        icon: <ChatAltIcon fontSize="small" />
      },
      {
        title: 'Calendar',
        path: '/dashboard/calendar',
        icon: <CalendarIcon fontSize="small" />
      }
    ]
  } */
];

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const current = moment().format("DD-MM-YYYY")
  const [avatar, setAvatar] = useState('');


  useEffect(() => {
    Auth.currentAuthenticatedUser().then(user =>  {
      if (user.attributes.picture){
      getAvatar(user.attributes.picture)
     }
    });
    if (openMobile && onMobileClose) {
      
      onMobileClose();
    }
  }, [location.pathname]);

  const getAvatar = async (avatarName) => {
    const user = await Auth.currentAuthenticatedUser();
    await Storage.get(avatarName,{
    level: 'public'}).then(avatar => {
      setAvatar(avatar); 
    }
    )
  }; 

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex'
            },
            justifyContent: 'center',
            p: 2
          }}
        >
          <RouterLink to="/">
            <Logo
              sx={{
                height: 40,
                width: 40
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <RouterLink to="/dashboard/account">
              <Avatar
                src={avatar}
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {user.name}
              </Typography>
              <Typography fontSize={'small'} color={'textPrimary'}>
              {current}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
        <Divider />
       {/*  <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            Need Help?
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Check our docs
          </Typography>
          <Button
            color="primary"
            component={RouterLink}
            fullWidth
            sx={{ mt: 2 }}
            to="/docs"
            variant="contained"
          >
            Documentation
          </Button>
        </Box> */}
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280
        }
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;
