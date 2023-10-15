import { Autocomplete, TextField } from "@mui/material";
import { AccountOption } from "../hooks/useGetAccountOptions";

export const AccountSelect = (props: {
  label: string;
  value: AccountOption | null;
  options: AccountOption[];
  onChange: (event: any, newValue: AccountOption | null) => void;
  error: boolean;
  helperText: string;
}) => {
  const { value, onChange, error, helperText, options } = props;

  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      options={options}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => option.rootParentAccountName}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          fullWidth
          error={error}
          helperText={helperText}
          label={props.label}
          placeholder="계정과목을 선택해주세요."
        />
      )}
    />
  );
};
