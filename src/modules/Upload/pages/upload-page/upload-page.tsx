import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Form, ProgressBar } from 'react-bootstrap';

import styles from './upload-page.module.scss';

import { useUploadMutation, useUploadProgressQuery } from '../../api/uploadApiSlice';

import DropzoneField from '../../components/dropzone-field/dropzone-field';

import { UploadFormModel } from '../../models';

export function UploadPage() {
  const acceptFileTypes = useMemo(() => ({
    'video/mp4': ['.mp4']
  }), []);

  const [upload, { isError }] = useUploadMutation();
  const { data: loaded } = useUploadProgressQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitted, isValid }
  } = useForm();

  const submit = (form: UploadFormModel) => {
    upload(form);
  }

  return (
    <div>
      <Form onSubmit={handleSubmit((form) => submit(form as UploadFormModel))} className={styles.form}>
        <DropzoneField
          name='file' 
          control={control} 
          validation={{ required: true }}
          accept={acceptFileTypes}
          multiple={false} 
          placeholderText="Drag 'n' drop, or click to select video file" />

        <Form.Group controlId="title">
          <Form.Label>Video title</Form.Label>
          <Form.Control type="text" {...register('title', { required: true })} />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Video description</Form.Label>
          <Form.Control as="textarea" type="text" {...register('description', { required: true })} className={styles.form__textarea} />
        </Form.Group>

        <button type="submit" disabled={(!isValid || isSubmitted) && !isError} className='btn btn-primary'>
          Submit
        </button>

        {isSubmitted && !isError && 
          <div className={styles.form__progress}>
            <p>Progress:</p>
            <ProgressBar now={loaded} />
          </div>
        }
      </Form>
    </div>
  )
}

export default UploadPage;
