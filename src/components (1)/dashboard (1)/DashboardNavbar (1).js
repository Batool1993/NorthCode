import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import MenuIcon from '../../icons/Menu';
import AccountPopover from './AccountPopover';
import ContactsPopover from './ContactsPopover';
import ContentSearch from './ContentSearch';
import LanguagePopover from './LanguagePopover';
import Logo from '../Logo';
import NotificationsPopover from './NotificationsPopover';
import  {Storage} from "aws-amplify";
import Amplify, { Auth } from 'aws-amplify';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon,
   PinterestShareButton, PinterestIcon,   WhatsappShareButton,   WhatsappIcon, EmailShareButton, EmailIcon }from  "react-share";
const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  }),
  zIndex: theme.zIndex.drawer + 100
}));


const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;
  const auth = useAuth();
  const { user } = useAuth();


    const title = `${document.title} | Advanced Dontpad`;
    const url = window.location.href;
    const iconSize = 30;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none'
            }
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <RouterLink to="/">
          <Logo
            sx={{
              display: {
                lg: 'inline',
                xs: 'none'
              },
              height: 40,
              width: 40
            }}
          />
        </RouterLink>
        <Box
          sx={{
            flexGrow: 1,
            ml: 1
          }}
        />
          <Box sx={{ ml: 1 }}>
          <FacebookShareButton url={url} quote={title} className="share-button">
          <FacebookIcon size={iconSize} round />
         </FacebookShareButton>
         <TwitterShareButton url={url} title={title} className="share-button">
          <TwitterIcon size={iconSize} round />
         </TwitterShareButton>
         <LinkedinShareButton url={'http://d1b56weiap8dyk.cloudfront.net'} summary={"Glassloft"} className="share-button">
        <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={'http://d1b56weiap8dyk.cloudfront.net'} title={"Glassloft"} className="share-button">
        <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>
        <EmailShareButton url={'http://d1b56weiap8dyk.cloudfront.net'} body={"Glassloft"} className="share-button">
        <EmailIcon size={iconSize} round />
        </EmailShareButton>
      
         </Box >
        <Box sx={{ ml: 1 }}>
          {/* <NotificationsPopover size={iconSize} /> */}
        </Box>
        <Box sx={{ ml: 1 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

DashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func
};

export default DashboardNavbar;
