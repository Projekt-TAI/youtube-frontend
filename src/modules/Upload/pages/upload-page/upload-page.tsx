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
    control,
    formState
  } = useForm();

  const submit = (form: UploadFormModel) => {
    upload(form);
  }

  return (
    <div>
      <Form onSubmit={handleSubmit((form) => submit(form as UploadFormModel))} className={styles.form}>
        <DropzoneField name='file' control={control} validation={{ required: true }} multiple={false} placeholderText="Drag 'n' drop, or click to select video file" />

        <Form.Group controlId="title">
          <Form.Label>Video title</Form.Label>
          <Form.Control type="text" {...register('title', { required: true })} />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Video description</Form.Label>
          <Form.Control as="textarea" type="text" {...register('description', { required: true })} className={styles.form__textarea} />
        </Form.Group>

        <button type="submit" disabled={!formState.isValid} className='btn btn-primary'>
          Submit
        </button>
      </Form>
    </div>
  )
}

export default UploadPage;
