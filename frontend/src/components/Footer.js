import React from 'react';
import { Container, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { makeStyles } from '@material-ui/core/styles';
import {RiWhatsappFill, RiFacebookFill ,RiInstagramFill } from 'react-icons/ri';

const useStyles = makeStyles((theme) => ({
  root: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    // '@media (max-width: 600px)': {
    //   paddingBottom: 16 + 56, // + height of BottomNavigation
    // },
  },
  box: {
    ...theme.mixins.customize.flexMixin('space-between', 'center'),
    color: '#929292',
    '@media (max-width: 960px)': {
      textAlign: 'center',
      flexDirection: 'column',
      '& $copyright': {
        padding: '10px 0 0',
      },
    },
  },
  logoWrapper: {
    ...theme.mixins.customize.centerFlex(),
  },
  logo: {
    maxWidth: 140,
  },
  copyright: {
    flexGrow: 1,
    paddingLeft: 100,
  },
  socialGroup: {
    ...theme.mixins.customize.flexMixin('center', 'center'),
  },
  icon: {
    fontSize: 18,
    margin: '0 10px',
    color: '#929292',
    transition: 'transform .3s',
    '&:hover': {
      transform: 'translateY(-1px)',
      color: theme.palette.secondary.main,
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer>
      <Container className={classes.root}>
        <div className={classes.box}>
          <Link to='/' className={classes.logoWrapper}>
            <img src={logo} alt='logo' className={classes.logo} />
          </Link>
          <Typography
            variant='body2'
            component='p'
            className={classes.copyright}
          >
            Copyright &copy; 2021 NVMN Store. All Right Reserved.
          </Typography>
          <div className={classes.socialGroup}>
            <IconButton onClick={() => window.open('https://www.facebook.com/share/1FaCBAjWMs/?mibextid=wwXIfr')} className={classes.icon}>
              <RiFacebookFill />
            </IconButton>
            <IconButton onClick={() => window.open('http://wa.me/919172890754')} className={classes.icon}>
              <RiWhatsappFill />
            </IconButton>
            <IconButton onClick={() => window.open('https://www.instagram.com/nvmn.store?igsh=MTlkdXNjamRnaXA3eg%3D%3D&utm_source=qr')} className={classes.icon}>
              <RiInstagramFill />
            </IconButton>

          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
