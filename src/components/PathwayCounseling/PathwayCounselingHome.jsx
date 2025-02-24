import { Flag, DirectionsRun, Map, AssignmentTurnedIn, SupportAgent } from '@mui/icons-material';
import { Button, Container, Stack, Typography, Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PathwayHome = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        py: 10, // Padding Y-axis (top and bottom) to the whole container, increased to push content down
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mt: 8, fontSize: '1.8rem' }} // This adds extra margin at the top of the Mentorship heading
            >
              Empowering Your Career Journey
            </Typography>
            <Typography variant="body1">
              UniEdge recognizes the importance of self-discovery and goal-setting in navigating the path to your dream career. Our Pathway
              Counseling program is designed to empower you with the tools and guidance to uncover your true potential and map out a
              personalized plan for success. Whether you're a student exploring options or a professional seeking a change, our interactive
              platform combines AI-powered assessments, career coaching, and tailored recommendations to help you. Take control of your
              career journey with UniEdge's Pathway Counseling. Together, let's unlock your professional future and empower you to thrive in
              the job market.
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}></Grid>

        <Grid item xs={12}>
          <Stack spacing={4} justifyContent="center" py={6}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Our Benefits
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  title: 'Self Identify',
                  description: 'Identify your strengths, interests, and values',
                  icon: <Flag fontSize="large" />, // Icon representing self-assessment and purpose
                  button: (
                    <Button
                      variant="contained"
                      onClick={() => navigate('/pathwaycounseling')}
                      sx={{ mt: 1 }}
                    >
                      Try for Free
                    </Button>
                  ),
                },
                {
                  title: 'Goals',
                  description: 'Set achievable short-term and long-term goals',
                  icon: <DirectionsRun fontSize="large" />, // Icon representing movement towards goals
                },
                {
                  title: 'Career Paths',
                  description: 'Explore diverse career paths aligned with your aspirations',
                  icon: <Map fontSize="large" />, // Icon symbolizing navigation and exploration
                },
                {
                  title: 'Plan',
                  description: 'Develop a personalized action plan to reach your objectives',
                  icon: <AssignmentTurnedIn fontSize="large" />, // Icon for planning and task completion
                },
                {
                  title: 'Coaching',
                  description: 'Access resources and support to bring your vision to life',
                  icon: <SupportAgent fontSize="large" />, // Icon representing guidance and coaching
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.title} textAlign="center">
                  <Stack spacing={1} alignItems="center">
                    {item.icon}
                    <Typography variant="h6" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    {item.button && item.button}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PathwayHome;
