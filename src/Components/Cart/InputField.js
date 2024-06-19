import React from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { useField } from "formik";

const InputField = ({ label, handleChange, ...props }) => {
  const [field, meta] = useField(props);

  const handleInputChange = (e) => {
    field.onChange(e);
    if (handleChange) {
      handleChange(e);
    }
  };
  return (
    <>
      <FormGroup>
        <Label for={props.id || props.name}>{label}</Label>
        <Input
          invalid={meta.touched && !!meta.error}
          {...field}
          {...props}
          onChange={handleInputChange}
        />
        <FormFeedback invalid>{meta.error}</FormFeedback>
      </FormGroup>
    </>
  );
};

export default InputField;
