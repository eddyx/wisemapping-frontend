import React from 'react'
import { StyleDiv } from './styled'

type FormErrorDialogProps = {
  message?: string;
}

const FormErrorDialog = (props: FormErrorDialogProps) => {
  return props.message ? <StyleDiv>{props.message}</StyleDiv > : null;
}
export default FormErrorDialog;

