import {Form, Input, Button} from "semantic-ui-react";

export default function Register() {
  return (
    <Form>
      <Form.Field
        id='form-input-control-error-email'
        control={Input}
        label='Email'
        placeholder='test@gmail.com'
        error={{
          content: 'Please enter a valid email address',
          pointing: 'below',
        }}
      />
      <Form.Field>
        <label>Username</label>
        <input placeholder='Username' />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <Input type='password'/>
      </Form.Field>
      <Form.Field>
        <label>Confirmed Password</label>
        <Input type='password'/>
      </Form.Field>
      <Button>Submit</Button>
    </Form>
  );
}
