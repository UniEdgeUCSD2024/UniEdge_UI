import React, { useContext, useEffect, useState } from 'react';

import { Download, SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Grid2,
  LinearProgress,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { capitalize } from 'lodash';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ExperienceList from './ExperienceField';
import EducationList from './EducationField';

const MentorProfile = () => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const { userKeys } = useContext(AuthContext);
  const parameters = useParams();

  const serviceName = capitalize(parameters.service);
  const role = capitalize(parameters.role);

  const loginState = JSON.parse(localStorage.getItem('login_state'));

  const [profile, setProfile] = useState({
    firstName: loginState?.Profile?.FirstName || '',
    lastName: '',
    headline: '',
    about: '',
    skills: '',
    experience: [],
    education: [],
    categories: [], // For Area of Expertise
    pricing: 50, // Default pricing value set to $50
    freeSession: 'Yes', // Default value for Free Session
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleLinkedInUrlChange = (e) => setLinkedInUrl(e.target.value);

  const handleUploadLinkedInProfile = async () => {
    if (!linkedInUrl) return;
    setLoading(true);

    try {
      setError('');
      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/mentorlinkedin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: loginState.Id,
            linkedin_profile_url: linkedInUrl,
          }),
        }
      );

      const data = await response.json();

      if (data.profile) {
        setProfile({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          headline: data.profile.headline || '',
          about: data.profile.about || '',
          skills: data.profile.skills ? data.profile.skills.join(', ') : '',
          experience: (data.profile.experience || []).map((exp) => ({
            Title: exp.title,
            CompanyName: exp.company,
            timePeriod: {
              startDate: exp.timePeriod.startDate,
              endDate: exp.timePeriod.endDate,
            },
            Description: exp.description,
          })),

          education: (data.profile.education || []).map((edu) => ({
            Degree: edu.degreeName,
            FieldOfStudy: edu.fieldOfStudy,
            University: edu.university,
            timePeriod: {
              startDate: edu.timePeriod.startDate,
              endDate: edu.timePeriod.endDate,
            },
          })),
          categories: profile.categories, // Retain selected categories
          pricing: profile.pricing, // Retain current pricing
          freeSession: profile.freeSession, // Retain free session value
        });
      }
    } catch (error) {
      console.error('Error uploading LinkedIn profile:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (e) => {
    setProfile({ ...profile, pricing: e.target.value });
  };

  const handleFreeSessionChange = (e) => {
    setProfile({ ...profile, freeSession: e.target.checked ? 'Yes' : 'No' });
  };

  const [submitting, setSubmitting] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  useEffect(() => {
    // POST  https://uniedge-prospect-functions.azurewebsites.net/fetchprofile HTTP/1.1
    // Content-Type: application/json

    // {
    //     "Id": "1038",
    //     "Email": "testuser101@gmail.com",
    //     "Profile":{
    //         "jobs": {"Seeker": true}
    //     }
    // }

    const loginState = JSON.parse(localStorage.getItem('login_state'));
    const token = localStorage.getItem('token');
    setFetchingProfile(true);
    fetch('https://uniedge-prospect-functions.azurewebsites.net/fetchprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Id: loginState.Id,
        Email: loginState.Email,
        Profile: {
          jobs: { Seeker: true },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) return;
        setProfile((prev) => ({
          ...prev,
          firstName: data.FirstName || '',
          lastName: data.LastName || '',
          headline: data.Headline || '',
          about: data.About || '',
          skills: data.Skills || '',
          experience: data.Experience || [],
          education: data.Education || [],
          categories: data.Categories || [],
          pricing: data.Pricing || 50,
          freeSession: data.FreeSession || 'Yes',
        }));
      })
      .finally(() => {
        setFetchingProfile(false);
      });
  }, [userKeys]);

  const handleSubmitProfile = async () => {
    const {
      firstName,
      lastName,
      headline,
      about,
      skills,
      experience,
      education,
      categories,
      pricing,
      freeSession,
    } = profile;

    if (!firstName || !lastName) {
      alert('Please fill in the first name and last name fields.');
      return;
    }

    setError('');
    setSubmitting(true);
    const loginState = JSON.parse(localStorage.getItem('login_state'));
    const profileDetails = {
      Id: loginState.Id,
      LastName: lastName,
      FirstName: firstName,
      Headline: headline,
      About: about,
      Skills: skills,
      Experience:
        experience.map((exp) => ({
          Title: exp.Title,
          Company: exp.CompanyName,
          StartDate: exp.timePeriod?.startDate || '',
          EndDate: exp.timePeriod?.endDate || '',
          Description: exp.description,
        })) ?? [],
      Education:
        education.map((edu) => ({
          Degree: edu.DegreeName,
          FieldOfStudy: edu.FieldOfStudy,
          University: edu.University,
          StartDate: edu.timePeriod?.startDate || '',
          EndDate: edu.timePeriod?.endDate || '',
        })) ?? [],
      Categories: categories,
      Pricing: pricing,
      FreeSession: freeSession,
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/adduser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Id: loginState.id,
            Service: serviceName,
            Role: role,
            Email: userKeys.email,
            Profile: {},
            Profile_details: profileDetails,
          }),
        }
      );

      const data = await response.json();
      localStorage.setItem('login_state', JSON.stringify(data));
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting profile:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className='py-5 mt-5'>
      {fetchingProfile ? (
        <Stack>
          <Typography variant='h5'>Fetching Profile...</Typography>
          <LinearProgress />
        </Stack>
      ) : (
        <Grid2 container spacing={4}>
          <Grid2 item size={12}>
            {error && <Alert variant='danger'>{error}</Alert>}
            {success && (
              <Alert variant='success'>
                Your profile has been successfully saved.
              </Alert>
            )}
          </Grid2>
          <Grid2
            item
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant='h5'>
                  Import Profile From LinkedIn
                </Typography>
                <Stack direction={'row'}>
                  <TextField
                    value={linkedInUrl}
                    onChange={handleLinkedInUrlChange}
                    fullWidth
                    placeholder='Enter your LinkedIn profile URL'
                    sx={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <LoadingButton
                    variant='contained'
                    onClick={handleUploadLinkedInProfile}
                    disabled={loading}
                    loading={loading}
                    startIcon={<Download />}
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  >
                    Import
                  </LoadingButton>
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography variant='h5'>Profile Information</Typography>

                {/* headline */}
                <TextField
                  label='Headline'
                  value={profile.headline}
                  onChange={(e) =>
                    setProfile({ ...profile, headline: e.target.value })
                  }
                  fullWidth
                />

                {/* about */}
                <TextField
                  label='About'
                  value={profile.about}
                  onChange={(e) =>
                    setProfile({ ...profile, about: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
                />

                <Stack direction={'row'} spacing={1}>
                  <TextField
                    label='First Name'
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    fullWidth
                  />
                  <TextField
                    label='Last Name'
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    fullWidth
                  />
                </Stack>

                <TextField
                  label='Skills'
                  value={profile.skills}
                  onChange={(e) =>
                    setProfile({ ...profile, skills: e.target.value })
                  }
                  fullWidth
                />
              </Stack>

              <ExperienceList
                experiences={profile.experience}
                setExperiences={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    experience: e,
                  }))
                }
              />

              <EducationList
                educations={profile.education}
                setEducations={(e) =>
                  setProfile((prev) => ({ ...prev, education: e }))
                }
              />
            </Stack>
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography>Area of Experise</Typography>
                <Select
                  multiple
                  value={profile.categories}
                  onChange={(e) =>
                    setProfile({ ...profile, categories: e.target.value })
                  }
                  fullWidth
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value='Career Guidance'>Career Guidance</MenuItem>
                  <MenuItem value='Leadership'>Leadership</MenuItem>
                  <MenuItem value='Technology'>Technology</MenuItem>
                  <MenuItem value='Entrepreneurship'>Entrepreneurship</MenuItem>
                  <MenuItem value='Personal Development'>
                    Personal Development
                  </MenuItem>
                </Select>
              </Stack>
              <Stack spacing={1}>
                <Typography>Pricing: ${profile.pricing}</Typography>
                <Slider
                  min={0}
                  max={100}
                  value={profile.pricing}
                  onChange={handlePricingChange}
                />
              </Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.freeSession === 'Yes'}
                    onChange={handleFreeSessionChange}
                    value='Yes'
                  >
                    Yes
                  </Checkbox>
                }
                label='Free Session'
              />
            </Stack>
          </Grid2>{' '}
          <LoadingButton
            variant='contained'
            color='secondary'
            onClick={handleSubmitProfile}
            disabled={submitting || error}
            loading={submitting}
            startIcon={<SaveOutlined />}
          >
            Save Profile
          </LoadingButton>
        </Grid2>
      )}
    </Container>
  );
};

export default MentorProfile;
