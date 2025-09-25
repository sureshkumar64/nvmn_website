import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithMobile } from '../actions/userActions';
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { ReactComponent as LoginImage } from '../assets/images/login-illu.svg';
import logo from '../assets/images/logo.png';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Hidden from '@material-ui/core/Hidden';
import Loader from '../components/Loader';
import Message from '../components/Message';
import InputController from '../components/InputController';
import backgroundImage from '../assets/images/background.jpg';
import { useForm, FormProvider } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';

const theme = createTheme({
  typography: { fontFamily: ['Poppins', 'sans-serif'].join(',') },
});

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.customize.centerFlex(),
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    fontFamily: 'Poppins, sans-serif',
  },
  container: {
    height: '85vh',
    width: '70%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    boxShadow: '0px 0px 25px -18px rgba(0,0,0,0.75)',
    [theme.breakpoints.down('xs')]: { width: '90%' },
  },
  image: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(227,65,85,0.08)',
  },
  content: {
    position: 'relative',
    ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
    padding: '24px 20%',
    height: '100%', 
    [theme.breakpoints.down('xs')]: { padding: '24px 10%' },
  },
  form: { paddingTop: theme.spacing(6) },
  backIcon: { position: 'absolute', top: 5, left: 0 },
  logo: { width: '120px', marginTop: 8 },
}));

const LoginScreen = ({ location, history }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const methods = useForm();
  const { handleSubmit } = methods;

  const dispatch = useDispatch();
  const classes = useStyles();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const { redirect = '/' } = queryString.parse(location.search);

  useEffect(() => {
    if (userInfo) history.push(redirect);
  }, [history, userInfo, redirect]);

  // Correct RecaptchaVerifier usage for Firebase v12+
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      const interval = setInterval(() => {
        const el = document.getElementById('sign-in-button');
        if (el && !window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'sign-in-button',
            { size: 'invisible' }
          );
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [otpSent]);

  const sendOtpHandler = ({ mobile }) => {
    const phoneNumber = '+91' + mobile;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setOtpSent(true);
      })
      .catch((err) => console.error(err));
  };
const verifyOtpHandler = async ({ otp }) => {
  if (!confirmationResult) return;

  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    const idToken = await user.getIdToken();

    // Dispatch loginWithMobile with the idToken
    dispatch(loginWithMobile(idToken));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.root} square>
        <Grid container component={Paper} className={classes.container}>
          <Grid item sm={12} md={6}>
            <Box className={classes.content}>
              <Button
                onClick={() => history.push('/')}
                startIcon={<BiArrowBack />}
                className={classes.backIcon}
              />
              <img src={logo} alt='' className={classes.logo} />
              <FormProvider {...methods}>
                {!otpSent ? (
                  <form className={classes.form} onSubmit={handleSubmit(sendOtpHandler)}>
                    <FormControl fullWidth style={{ marginBottom: 16 }}>
                      <InputController
                        name='mobile'
                        label='Mobile Number'
                        required
                        rules={{
                          pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                        }}
                      />
                    </FormControl>
                    <div id='sign-in-button'></div>
                    <Button type='submit' variant='contained' color='secondary' fullWidth>
                      Send OTP
                    </Button>
                  </form>
                ) : (
                  <form className={classes.form} onSubmit={handleSubmit(verifyOtpHandler)}>
                    <FormControl fullWidth style={{ marginBottom: 16 }}>
                      <InputController
                        name='otp'
                        label='Enter OTP'
                        required
                        rules={{ pattern: { value: /^[0-9]{6}$/, message: 'Enter 6 digit OTP' } }}
                      />
                    </FormControl>
                    <Button type='submit' variant='contained' color='secondary' fullWidth>
                      Verify OTP
                    </Button>
                  </form>
                )}
              </FormProvider>
              {loading && <Loader my={0} />}
              {error && <Message mt={0}>{error}</Message>}
            </Box>
          </Grid>
          <Hidden smDown>
            <Grid item xs={6}>
              <LoginImage className={classes.image} />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default LoginScreen;