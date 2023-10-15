import { TextField } from "@mui/material";
import React from "react";
import { ChangeEventHandler } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { isZerosLeading } from "../utils/isZerosLeading";

interface CustomProps {
  onChange: (event: { target: { value: string } }) => void;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        allowLeadingZeros={false}
        allowNegative={false}
        getInputRef={ref}
        isAllowed={(values) => {
          if (isZerosLeading(values.value)) {
            return false;
          }
          return true;
        }}
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        suffix="원"
      />
    );
  }
);

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  isErrored: boolean;
  helperText: string;
}

export const CurrencyInput = (props: CurrencyInputProps) => {
  const { label, value, onChange, isErrored, helperText } = props;

  return (
    <TextField
      required
      error={isErrored}
      helperText={helperText}
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        inputComponent: NumericFormatCustom as any,
      }}
    />
  );
};
