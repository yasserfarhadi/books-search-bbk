import { memo } from 'react'
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
  textFleld: {
    margin: "0 !important",
  },
});

function SearchBar({ onInputChange }) {
  const classes = useStyle();
  return (
    <TextField
      className={classes.textFleld}
      id="standard-full-width"
      label="Search for Books"
      placeholder="Search for title or description"
      fullWidth
      onChange={onInputChange}
    />
  );
}

export default memo(SearchBar);
