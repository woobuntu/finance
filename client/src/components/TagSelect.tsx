import {
  Autocomplete,
  Chip,
  Skeleton,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { TagOption, useGetTags } from "../hooks/useGetTags";
import { isUndefined } from "lodash-es";
import {
  TransactionFormAction,
  TransactionFormState,
} from "../hooks/useTransactionFormReducer";

const filter = createFilterOptions<TagOption>();

export const TagSelect = ({
  transactionFormState,
  transactionFormDispatch,
}: {
  transactionFormState: TransactionFormState;
  transactionFormDispatch: React.Dispatch<TransactionFormAction>;
}) => {
  const { data, isLoading } = useGetTags();

  if (isLoading)
    return (
      <Skeleton
        variant="rectangular"
        width={200}
        height={40}
        animation="wave"
      />
    );

  if (isUndefined(data)) return null;

  return (
    <Autocomplete
      value={transactionFormState.tags}
      onChange={(event, tags) => {
        const convertedTags: TagOption[] = tags.map((tag) => {
          if (typeof tag === "string") {
            return {
              name: tag,
            };
          } else if (tag && tag.inputValue) {
            // Create a new value from the user input
            return {
              name: tag.inputValue,
            };
          } else {
            return tag;
          }
        });
        transactionFormDispatch({
          type: "CHANGE_TAGS",
          tags: convertedTags,
        });
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            name: `Add "${inputValue}"`,
          });
        }
        console.log("after filtered", filtered);

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={data}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      multiple
      freeSolo
      renderInput={(params) => <TextField {...params} label="태그" />}
    />
  );
};
