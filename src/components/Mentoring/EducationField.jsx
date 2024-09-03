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
const EducationList = ({ educations, setEducations }) => {
  const handleInputChange = (index, field, value) => {
    const updatedEducations = [...educations];
    set(updatedEducations[index], field, value);
    setEducations(updatedEducations);
  };

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      {
        Degree: '',
        FieldOfStudy: '',
        University: '',
        timePeriod: { startDate: '', endDate: '' },
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <Typography variant='h5'>Education</Typography>
      </Grid2>
      {educations?.map((edu, index) => (
        <Grid2 item size={12} key={index}>
          <Card variant='outlined'>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2
                  item
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    label='Degree'
                    fullWidth
                    value={edu.Degree}
                    onChange={(e) =>
                      handleInputChange(index, 'Degree', e.target.value)
                    }
                  />
                </Grid2>
                <Grid2
                  item
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    label='Field of Study'
                    fullWidth
                    value={edu.FieldOfStudy}
                    onChange={(e) =>
                      handleInputChange(index, 'FieldOfStudy', e.target.value)
                    }
                  />
                </Grid2>
                <Grid2
                  item
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    label='School'
                    fullWidth
                    value={edu.University}
                    onChange={(e) =>
                      handleInputChange(index, 'University', e.target.value)
                    }
                  />
                </Grid2>
                <Grid2
                  item
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    label='Start Date'
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    value={edu.timePeriod?.startDate}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'timePeriod.startDate',
                        e.target.value
                      )
                    }
                  />
                </Grid2>
                <Grid2
                  item
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    label='End Date'
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    value={edu.timePeriod?.endDate}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'timePeriod.endDate',
                        e.target.value
                      )
                    }
                  />
                </Grid2>
              </Grid2>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => handleRemoveEducation(index)}
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
          onClick={handleAddEducation}
        >
          Add Education
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default EducationList;
