import Dropzone, { DropzoneProps } from "react-dropzone";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";

import styles from './dropzone.field.module.scss';

type DropzoneFieldProps = {
  name: string,
  control: Control<FieldValues> | undefined,
  validation?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">
} & DropzoneProps;

const DropzoneField = ({
  name,
  control,
  validation,
  ...rest
}: DropzoneFieldProps) => {
  return (
    <Controller
      rules={validation}
      render={({ field: { onChange } }) => (
        <Dropzone
          onDrop={e => onChange(e)}
          {...rest}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className={styles.dropzone}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          )}
        </Dropzone>
      )}
      name={name}
      control={control}
      defaultValue={[]}
    />
  )
}

export default DropzoneField;