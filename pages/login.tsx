import {Form, Input} from "semantic-ui-react";

export default function Login() {
  return (
    <Form>
      <Form.Field
        id='form-input-control-error-email'
        control={Input}
        label='Email'
        placeholder='joe@schmoe.com'
        error={{
          content: 'Please enter a valid email address',
          pointing: 'below',
        }}
      />
      <Form.Field>
        <label>Password</label>
        <Input type='password'/>
      </Form.Field>
    </Form>
  );
}
