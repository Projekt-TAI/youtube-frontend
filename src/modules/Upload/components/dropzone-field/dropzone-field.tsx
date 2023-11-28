import Dropzone, { DropzoneProps } from "react-dropzone";
import { Control, Controller, FieldValues } from "react-hook-form";

import styles from './dropzone.field.module.scss';

type DropzoneFieldProps = {
  name: string,
  control: Control<FieldValues> | undefined
} & DropzoneProps;

const DropzoneField = ({
  name,
  control,
  ...rest
}: DropzoneFieldProps) => {
  return (
    <Controller
      render={({ field: { onChange } }) => (
        <Dropzone
          onDrop={e => onChange(e)}
          {...rest}
        >
          {({getRootProps, getInputProps}) => (
            <section className={styles.dropzone}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      )}
      name={name}
      control={control}
      defaultValue={null}
    />
  )
}

export default DropzoneField;