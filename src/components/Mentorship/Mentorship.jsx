import { People, School, Star } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Mentorship = () => {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position='sticky'>
        <Container>
          <Stack direction={'row'}>
            <Link
              to='/home'
              style={{
                textDecoration: 'none',
                color: 'black',
                // no underline
              }}
            >
              <Typography
                variant='h5'
                fontWeight={'bold'}
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  // no underline
                }}
              >
                UniEdge
              </Typography>
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant='outlined'
              onClick={() => {
                window.localStorage.clear();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </Stack>
        </Container>
      </AppBar>

      <Container
        sx={{
          py: 5,
        }}
      >
        <Grid2 container spacing={4}>
          <Grid2
            item
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Stack spacing={2}>
              <Typography variant='h4' fontWeight={'bold'}>
                Mentorship
              </Typography>
              <Typography variant='body1'>
                Hey ,We know that the right guidance can be a game-changer in your personal and professional growth. Whether you're on the lookout for a mentor to help you climb the career ladder or eager to share your wisdom and shape the future of others, we've got your back. Explore tailored mentoring, gain insights from seasoned mentors, and connect with a community of like-minded individuals.
              </Typography>

              <Stack direction={'row'} spacing={1}>
                <Button
                  variant='contained'
                  onClick={() => {
                    navigate(`/mentorship/mentor/profile`);
                  }}
                >
                  Mentor
                </Button>
                <Button variant='contained'>Mentee</Button>
              </Stack>
            </Stack>
          </Grid2>

          <Grid2
            item
            size={{
              xs: 12,
              md: 6,
            }}
          ></Grid2>

          <Grid2 item size={{ xs: 12 }}>
            <Stack spacing={4} justifyContent={'center'} py={6}>
              <Typography variant='h4' fontWeight={'bold'} textAlign={'center'}>
                Our Benefits
              </Typography>

              <Stack
                direction={'row'}
                spacing={2}
                justifyContent={'space-around'}
              >
                {[
                  {
                    title: 'Mentoring',
                    description: 'Personalized guidance',
                    icon: <School fontSize='large' />,
                  },
                  {
                    title: 'Mentee Programs',
                    description: 'Learn from experts',
                    icon: <People fontSize='large' />,
                  },
                  {
                    title: 'Skill Enhancement',
                    description: 'Boost your skills',
                    icon: <Star fontSize='large' />,
                  },
                ].map((item) => (
                  <Stack key={item.title} spacing={1} alignItems={'center'}>
                    {item.icon}
                    <Typography variant='h6' fontWeight={'bold'}>
                      {item.title}
                    </Typography>
                    <Typography variant='body2'>{item.description}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
};

export default Mentorship;
