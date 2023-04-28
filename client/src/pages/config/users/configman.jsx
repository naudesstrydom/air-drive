import * as React from 'react';
import IsLoggedIn from '../../../isLoggedIn';
import * as API from '../../../api';
import MainCard from '../../../components/MainCard';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
  FormHelperText,
  Collapse,
  TextField,
  MenuItem,
  
} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import AnimateButton from '../../../components/@extended/AnimateButton';
import RestartModal from './restart';
import { WarningOutlined, PlusCircleOutlined, CopyOutlined, ExclamationCircleOutlined , SyncOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { CosmosInputText, CosmosSelect } from './formShortcuts';


const ConfigManagement = () => {
  const [config, setConfig] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  function refresh() {
    API.config.get().then((res) => {
      setConfig(res.data);
    });
  }

  React.useEffect(() => {
    refresh();
  }, []);

  return <div style={{maxWidth: '1000px', margin: ''}}>
    <IsLoggedIn />
    <Button variant="contained" color="primary" startIcon={<SyncOutlined />} onClick={() => {
        refresh();
    }}>Refresh</Button><br /><br />
    {config && <>
      <RestartModal openModal={openModal} setOpenModal={setOpenModal} />
      <Formik
        initialValues={{
          MongoDB: config.MongoDB,
          LoggingLevel: config.LoggingLevel,

          Hostname: config.HTTPConfig.Hostname,
          GenerateMissingTLSCert: config.HTTPConfig.GenerateMissingTLSCert,
          GenerateMissingAuthCert: config.HTTPConfig.GenerateMissingAuthCert,
          HTTPPort: config.HTTPConfig.HTTPPort,
          HTTPSPort: config.HTTPConfig.HTTPSPort,
          SSLEmail: config.HTTPConfig.SSLEmail,
          HTTPSCertificateMode: config.HTTPConfig.HTTPSCertificateMode,
        }}
        validationSchema={Yup.object().shape({
          Hostname: Yup.string().max(255).required('Hostname is required'),
          MongoDB: Yup.string().max(512),
          LoggingLevel: Yup.string().max(255).required('Logging Level is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            let toSave = {
              ...config,
              MongoDB: values.MongoDB,
              LoggingLevel: values.LoggingLevel,
              HTTPConfig: {
                ...config.HTTPConfig,
                Hostname: values.Hostname,
                GenerateMissingAuthCert: values.GenerateMissingAuthCert,
                HTTPPort: values.HTTPPort,
                HTTPSPort: values.HTTPSPort,
                SSLEmail: values.SSLEmail,
                HTTPSCertificateMode: values.HTTPSCertificateMode,
              }
            }
            
            API.config.set(toSave).then((data) => {
              if (data.status == 'error') {
                setStatus({ success: false });
                if (data.code == 'UL001') {
                  setErrors({ submit: 'Wrong nickname or password. Try again or try resetting your password' });
                } else if (data.status == 'error') {
                  setErrors({ submit: 'Unexpected error. Try again later.' });
                }
                setSubmitting(false);
                return;
              } else {
                setStatus({ success: true });
                setSubmitting(false);
                setOpenModal(true);
              }
            })
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <MainCard title="General">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="info">This page allow you to edit the configuration file. Any Environment Variable overwritting configuration won't appear here.</Alert>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="MongoDB-login">MongoDB connection string. It is advised to use Environment variable to store this securely instead. (Optional)</InputLabel>
                    <OutlinedInput
                      id="MongoDB-login"
                      type="password"
                      value={formik.values.MongoDB}
                      name="MongoDB"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="MongoDB"
                      fullWidth
                      error={Boolean(formik.touched.MongoDB && formik.errors.MongoDB)}
                    />
                    {formik.touched.MongoDB && formik.errors.MongoDB && (
                      <FormHelperText error id="standard-weight-helper-text-MongoDB-login">
                        {formik.errors.MongoDB}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="LoggingLevel-login">Level of logging (Default: INFO)</InputLabel>
                    <TextField
                      className="px-2 my-2"
                      variant="outlined"
                      name="LoggingLevel"
                      id="LoggingLevel"
                      select
                      value={formik.values.LoggingLevel}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.LoggingLevel &&
                        Boolean(formik.errors.LoggingLevel)
                      }
                      helperText={
                        formik.touched.LoggingLevel && formik.errors.LoggingLevel
                      }
                    >
                      <MenuItem key={"DEBUG"} value={"DEBUG"}>
                        DEBUG
                      </MenuItem>
                      <MenuItem key={"INFO"} value={"INFO"}>
                        INFO
                      </MenuItem>
                      <MenuItem key={"WARNING"} value={"WARNING"}>
                        WARNING
                      </MenuItem>
                      <MenuItem key={"ERROR"} value={"ERROR"}>
                        ERROR
                      </MenuItem>
                    </TextField>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>

            <br /><br />

            <MainCard title="HTTP">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="Hostname-login">Hostname: This will be used to restrict access to your Cosmos Server (Default: 0.0.0.0)</InputLabel>
                    <OutlinedInput
                      id="Hostname-login"
                      type="text"
                      value={formik.values.Hostname}
                      name="Hostname"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="Hostname"
                      fullWidth
                      error={Boolean(formik.touched.Hostname && formik.errors.Hostname)}
                    />
                    {formik.touched.Hostname && formik.errors.Hostname && (
                      <FormHelperText error id="standard-weight-helper-text-Hostname-login">
                        {formik.errors.Hostname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="HTTPPort-login">HTTP Port (Default: 80)</InputLabel>
                    <OutlinedInput
                      id="HTTPPort-login"
                      type="text"
                      value={formik.values.HTTPPort}
                      name="HTTPPort"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="HTTPPort"
                      fullWidth
                      error={Boolean(formik.touched.HTTPPort && formik.errors.HTTPPort)}
                    />
                    {formik.touched.HTTPPort && formik.errors.HTTPPort && (
                      <FormHelperText error id="standard-weight-helper-text-HTTPPort-login">
                        {formik.errors.HTTPPort}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="HTTPSPort-login">HTTPS Port (Default: 443)</InputLabel>
                    <OutlinedInput
                      id="HTTPSPort-login"
                      type="text"
                      value={formik.values.HTTPSPort}
                      name="HTTPSPort"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="HTTPSPort"
                      fullWidth
                      error={Boolean(formik.touched.HTTPSPort && formik.errors.HTTPSPort)}
                    />
                    {formik.touched.HTTPSPort && formik.errors.HTTPSPort && (
                      <FormHelperText error id="standard-weight-helper-text-HTTPSPort-login">
                        {formik.errors.HTTPSPort}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                </Grid>
                </MainCard>
                <br /><br />
                <MainCard title="Security Certificates">
                <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="info">For security reasons, It is not possible to remotely change the Private keys of any certificates on your instance. It is advised to manually edit the config file, or better, use Environment Variables to store them.</Alert>
                </Grid>

                <CosmosSelect
                  name="HTTPSCertificateMode"
                  label="HTTPS Certificates"
                  formik={formik}
                  options={[
                    ["LETSENCRYPT", "Automatically generate certificates using Let's Encrypt (Recommended)"],
                    ["SELFSIGNED", "Locally self-sign certificates (unsecure)"],
                    ["PROVIDED", "I have my own certificates"],
                    ["DISABLED", "Do not use HTTPS (very unsecure)"],
                  ]}
                />

                {
                  formik.values.HTTPSCertificateMode === "LETSENCRYPT" && (
                    <CosmosInputText
                      name="SSLEmail"
                      label="Email address for Let's Encrypt"
                      formik={formik}
                    />
                  )
                }

                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Field
                      type="checkbox"
                      name="GenerateMissingAuthCert"
                      as={FormControlLabel}
                      control={<Checkbox size="large" />}
                      label="Generate missing Authentication Certificates automatically (Default: true)"
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <h4>Authentication Public Key</h4>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <pre className='code'>
                      {config.HTTPConfig.AuthPublicKey}
                    </pre>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <h4>Root HTTPS Public Key</h4>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <pre className='code'>
                      {config.HTTPConfig.TLSCert}
                    </pre>
                  </Stack>
                </Grid>

              </Grid>
            </MainCard>

            <br /><br />

            <MainCard>
              {formik.errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{formik.errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </AnimateButton>
              </Grid>
            </MainCard>
          </form>
        )}
      </Formik>
    </>}
  </div>;
}

export default ConfigManagement;