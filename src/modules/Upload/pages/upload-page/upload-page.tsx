import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';

import styles from './upload-page.module.scss';

import { useUploadMutation } from '../../api/uploadApiSlice';

import DropzoneField from '../../components/dropzone-field/dropzone-field';

import { UploadFormModel } from '../../models';

export function UploadPage() {
  const [upload] = useUploadMutation();

  const {
    register,
    handleSubmit,
    control
  } = useForm();

  const submit = (form: UploadFormModel) => {
    upload(form);
  }

  return (
    <div>
      <Form onSubmit={handleSubmit((form) => submit(form as UploadFormModel))}>
        <DropzoneField name='file' control={control} />

        <Form.Group controlId="title">
          <Form.Label>Video title</Form.Label>
          <Form.Control type="text" {...register('title')} />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Video description</Form.Label>
          <Form.Control as="textarea" type="text" {...register('description')} />
        </Form.Group>

        <input type="submit" className='btn btn-primary' />
      </Form>
    </div>
  )
}

export default UploadPage;
