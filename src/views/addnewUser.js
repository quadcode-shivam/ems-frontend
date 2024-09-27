import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Form,
} from 'reactstrap';
import { Typography } from '@mui/material';
import { createMainVendors } from 'api';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function AddNewVendor() {
  const [formData, setFormData] = useState({
    shop_name: '',
    shopkeeper_name: '',
    location: '',
    email: '',
    contact_number: '',
    alternate_number: '',
    description: '',
    service_type: '',
  });

  const [errorList, setErrorList] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorList({ ...errorList, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'shop_name',
      'shopkeeper_name',
      'location',
      'email',
      'contact_number',
      'alternate_number',
      'description',
      'service_type'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required.';
      }
    });

    setErrorList(errors);
    return Object.keys(errors).length === 0; // returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      const response = await createMainVendors(formData);
      Swal.fire({
        title: 'Success!',
        text: response.message,
        icon: 'success',
        confirmButtonText: 'OK'
      }); // Show success message with SweetAlert2
      setFormData({}); // Reset form
    } catch (error) {
      if (error.response) {
        setErrorList(error.response.data.err || {});
      } else {
        console.error('Error submitting the form:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <Card className="m">
        <CardHeader>
          <Typography variant="h4">Add New Vendors</Typography>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="shop_name">
                    Shop Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="shop_name"
                    placeholder="Please Enter Shop Name"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.shop_name}</span>
                </FormGroup>
              </Col>

              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="shopkeeper_name">
                    Shopkeeper Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="shopkeeper_name"
                    placeholder="Please Enter Shopkeeper Name"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.shopkeeper_name}</span>
                </FormGroup>
              </Col>

              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="location">
                    Location <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    placeholder="Please Enter Location"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.location}</span>
                </FormGroup>
              </Col>

              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="email">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Please Enter Email"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.email}</span>
                </FormGroup>
              </Col>

              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="contact_number">Contact Number</Label>
                  <Input
                    type="text"
                    name="contact_number"
                    placeholder="Please Enter Contact Number"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.contact_number}</span>
                </FormGroup>
              </Col>

              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="alternate_number">Alternate Number</Label>
                  <Input
                    type="text"
                    name="alternate_number"
                    placeholder="Please Enter Alternate Number"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.alternate_number}</span>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    placeholder="Please Enter Description"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.description}</span>
                </FormGroup>
              </Col>

              <Col lg="6" className="mb-3">
                <FormGroup>
                  <Label for="service_type">Service Type</Label>
                  <Input
                    type="text"
                    name="service_type"
                    placeholder="Please Enter Service Type"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errorList.service_type}</span>
                </FormGroup>
              </Col>
            </Row>

            <Button type="submit" color="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
