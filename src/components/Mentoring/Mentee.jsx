import React, { useState } from 'react';
import { Container, Form, Dropdown, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Mentee = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState('');
  const [freeSession, setFreeSession] = useState('Yes');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Career Guidance',
    'Leadership',
    'Technology',
    'Entrepreneurship',
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const clearAllCategories = () => {
    setSelectedCategory([]);
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://uniedge-prospect-functions.azurewebsites.net/fetchmentordetails',
        {
          AreaOfExpertise: selectedCategory,
          Pricing: 50,
          FreeSession: freeSession,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentor details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='wrapper mt-5 py-5'>
      <Container className='content'>
        <div className='d-flex mb-4'>
          {/* Category Filter */}
          <div className='me-4'>
            <span className='pb-2'>Category</span>
            <Dropdown>
              <Dropdown.Toggle className='w-100' variant='outline-secondary'>
                {selectedCategory.length > 0
                  ? `${selectedCategory.length} selected`
                  : 'Select Categories'}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className='w-100'
                style={{ maxHeight: '400px', overflowY: 'auto' }}
              >
                <Dropdown.Item
                  onClick={clearAllCategories}
                  style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    color: 'red',
                  }}
                >
                  Clear All
                </Dropdown.Item>
                <Dropdown.Divider />
                {categories.map((category) => (
                  <Dropdown.Item
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    active={selectedCategory.includes(category)}
                  >
                    {selectedCategory.includes(category) ? '✓ ' : ''}
                    {category}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Pricing Filter */}
          <div className='me-4'>
            <span className='pb-2'>Pricing</span>
            <Form.Select
              onChange={(e) => setSelectedPricing(e.target.value)}
              value={selectedPricing}
            >
              <option value=''>Select Pricing</option>
              <option value='<50'>&lt;$50</option>
              <option value='50-100'>$50-$100</option>
              <option value='>100'>&gt;$100</option>
            </Form.Select>
          </div>

          {/* Free Session Filter */}
          <div className='me-4'>
            <span className='pb-2'>Free Session</span>
            <Form.Select
              onChange={(e) => setFreeSession(e.target.value)}
              value={freeSession}
            >
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </Form.Select>
          </div>

          {/* Apply Filters Button */}
          <div className='align-self-end'>
            <Button variant='primary' onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Display Mentors */}
        <Row>
          {loading ? (
            <p>Loading...</p>
          ) : mentors.length > 0 ? (
            mentors.map((mentor, index) => (
              <Col md={4} key={index}>
                <Card className='mb-4'>
                  <Card.Body>
                    <h5><strong>{mentor.Name}</strong></h5>
                    <p>{mentor.About || "No description available."}</p>
                    <p>
                      <strong>Skills:</strong> {mentor.Skills.join(', ')}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No mentors found.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Mentee;
