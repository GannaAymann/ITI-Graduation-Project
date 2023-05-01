import React from 'react';
import '../../../components/AllCourses/allCourses.css';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { NavLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Pagination from '@mui/material/Pagination';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from 'axios';
import { Button, Grid, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { setUserData } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const StudentProfile = ({ userData }) => {
  let [t, i18n] = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState('');
  const dispatch = useDispatch();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [updateData, setUpdateData] = useState({ ...userData });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      await axios.all(
        userData.courses.map(async (course) => {
          const courseData = await axios.get(`/course/${course}`);

          setCourses((prev) => [...prev, courseData.data]);
        })
      );
    };
    getCourses();
  }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'vqsktgr7');
    setUploading(true);
    axios
      .post('https://api.cloudinary.com/v1_1/dsra1ldsf/image/upload', formData)
      .then((res) => {
        setUploading(false);
        // //console.log(res.data);
        setUploaded(res.data.public_id);
        setUpdateData((prev) => {
          return { ...prev, image: res.data.secure_url };
        });
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const excludeProps = ['updatedAt'];
    const object2 = Object.keys(userData)
      .filter((key) => !excludeProps.includes(key))
      .reduce((obj, key) => {
        obj[key] = userData[key];
        return obj;
      }, {});
    console.log(object2);
    try {
      const { data } = await axios.patch('/student/' + userData._id, {
        email: updateData.email,
        firstName: updateData.firstName,
        image: updateData.image,
        lastName: updateData.lastName,
        levelOfExperience: updateData.levelOfExperience,
        phone: updateData.phone,
      });

      dispatch(setUserData(data));
      setShowUpdateProfile(false);
      toast.success('Successfully updated');
    } catch (error) {
      toast.error('Error in updating');
    }
  };
  return (
    <div>
      <ToastContainer />
      <div>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            ></Typography>

            <Box
              sx={{
                mx: 'auto',
                width: 250,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ mx: 'auto', width: 150 }}>
                <Stack direction='row' spacing={1} align='center'>
                  {userData.image ? (
                    <Avatar
                      src={userData.image}
                      sx={{ width: 150, height: 150, mx: 'auto' }}
                    />
                  ) : (
                    <Avatar
                      src='/broken-image.jpg'
                      sx={{ width: 80, height: 80, mx: 'auto' }}
                    />
                  )}
                </Stack>
              </Box>
              <Typography
                variant='h5'
                component='div'
                align='center'
                sx={{ mb: 1.5, mt: 1.5 }}
              >
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography
                sx={{ mb: 1.5, mt: 1 }}
                color='text.secondary'
                align='center'
              >
                <Chip label={t(`${userData.role}`)} />
              </Typography>
              <Typography
                sx={{ mb: 1.5 }}
                color='text.secondary'
                align='center'
              >
                <Chip
                  label={userData.email}
                  variant='outlined'
                  align='center'
                />
              </Typography>
              <Typography variant='body2' align='center'>
                {t("We hope you enjoy your courses")}
              </Typography>
              <Stack
                direction='row'
                sx={{ mt: 1.5, mx: 7.2, width: 150 }}
                align='center'
              >
                <Chip
                  label={t("Courses Enrolled")}
                  color='primary'
                  variant='outlined'
                  align='center'
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Stack
          direction='row'
          sx={{ mt: 1.5, mx: 7.2, width: 250 }}
          align='center'
        >
          <Button
            variant='outlined'
            fullWidth
            onClick={() => setShowUpdateProfile(!showUpdateProfile)}
            sx={{ width: 'max-content', wordBreak: 'keep-all' }}
          >
            {t("Update Profile")}
          </Button>
        </Stack>
        <Grid
          component='form'
          onSubmit={handleSubmit}
          sx={{
            display: `${showUpdateProfile ? 'block' : 'none'}`,
          }}
        >
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom textAlign='center'>
              {t("Update Your Profile Picture")}
            </Typography>
            <Grid display='flex' justifyContent='center' alignItems='center'>
              <Stack direction='row' alignItems='center' spacing={2}>
                <Button
                  variant='contained'
                  component='label'
                  disabled={uploading || uploaded.length > 0}
                  sx={{
                    backgroundColor:
                      uploading || uploaded.length > 0 ? 'gray' : '#3f51b5',
                    color: uploading || uploaded.length > 0 ? 'red' : 'white',
                  }}
                >
                  {/* {uploading  && t("Uploading...")} */}
                  {/* {uploaded.length > 0 ? "Uploaded ✔": "Upload"} */}
                  {/* {uploaded.length > 0 ? {t("Uploaded ✔")}: {t("Upload")}} */}
                  
                    {uploaded.length > 0 && t("Uploaded ✔")}
                    
                    {uploaded.length <= 0 && t("Upload")}
                    
 
                    
                  
                  <input
                    hidden
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                    type='file'
                  />
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <TextField
            margin='normal'
            required
            fullWidth
            id='firstName'
            value={updateData.firstName}
            onChange={(e) => {
              setUpdateData((prev) => {
                return { ...prev, firstName: e.target.value };
              });
            }}
            label={t("First Name")}
            name='firstName'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='lastName'
            value={updateData.lastName}
            onChange={(e) => {
              setUpdateData((prev) => {
                return { ...prev, lastName: e.target.value };
              });
            }}
            label={t("Last Name")}
            name='lastName'
            autoFocus
          />

          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            value={updateData.email}
            onChange={(e) => {
              setUpdateData((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
            label={t("Email Address")}
            name='email'
            autoComplete='email'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='phone'
            value={updateData.phone}
            onChange={(e) => {
              setUpdateData((prev) => {
                return { ...prev, phone: e.target.value };
              });
            }}
            label={t("Phone Number")}
            name='phone'
            autoComplete='phone'
            autoFocus
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            style={{ backgroundColor: '#3f51b5' }}
            sx={{ mt: 3, mb: 2 }}
          >
            {t("Update")}
          </Button>
        </Grid>

      </div>
    </div>
  );
};

export default StudentProfile;
