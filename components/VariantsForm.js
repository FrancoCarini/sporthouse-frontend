import { Row, Col, Button, Form } from 'react-bootstrap'

const VariantsForm = ({ variant, onDelete, onChange }) => {
  return (
    <Row className="mt-3">
      <Col>
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Color"
          name="color"
          value={variant.color}
          onChange={onChange}
        />
      </Col>
      <Col>
        <Form.Label>Size</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Size"
          name="size"
          value={variant.size}
          onChange={onChange}
        />
      </Col>
      <Col>
        <Form.Label>Stock</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Stock"
          name="stock"
          value={variant.stock}
          onChange={onChange}
        />
      </Col>
      <Col>
        <Button variant='danger' onClick={onDelete} className="mt-4">
          Remove
        </Button>
      </Col>
    </Row>
  )
}

export default VariantsForm