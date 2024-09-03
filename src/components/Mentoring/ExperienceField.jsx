import { AddOutlined, Remove } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { set } from 'lodash';

const ExperienceList = ({ experiences, setExperiences }) => {
  const handleInputChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    set(updatedExperiences[index], field, value);
    setExperiences(updatedExperiences);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        Title: '',
        Company: '',
        Description: '',
        timePeriod: { startDate: '', endDate: '' },
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <Typography variant='h5'>Experience</Typography>
      </Grid2>
      {experiences?.map((exp, index) => (
        <Grid2 item size={12} key={index}>
          <Card variant='outlined'>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item size={12}>
                  <TextField
                    label='Title'
                    fullWidth
                    value={exp.Title}
                    onChange={(e) =>
                      handleInputChange(index, 'Title', e.target.value)
                    }
                  />
                </Grid2>
                <Grid2 item size={12}>
                  <TextField
                    label='Company'
                    fullWidth
                    value={exp.Company}
                    onChange={(e) =>
                      handleInputChange(index, 'Company', e.target.value)
                    }
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    label='Start Date'
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    value={exp.timePeriod?.startDate}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'timePeriod.startDate',
                        e.target.value
                      )
                    }
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    label='End Date'
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    value={exp.timePeriod?.endDate}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'timePeriod.endDate',
                        e.target.value
                      )
                    }
                  />
                </Grid2>
                <Grid2 item size={12}>
                  <TextField
                    label='Description'
                    fullWidth
                    multiline
                    rows={4}
                    value={exp.description}
                    onChange={(e) =>
                      handleInputChange(index, 'description', e.target.value)
                    }
                  />
                </Grid2>
              </Grid2>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => handleRemoveExperience(index)}
                startIcon={<Remove />}
                variant='text'
                color='error'
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        </Grid2>
      ))}
      <Grid2 item size={12}>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddOutlined />}
          onClick={handleAddExperience}
        >
          Add Experience
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default ExperienceList;
