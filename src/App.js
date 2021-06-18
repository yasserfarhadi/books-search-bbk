import { useEffect, useReducer, useCallback } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import Item from "./components/Item/Item";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyle = makeStyles({
  root: {
    padding: "50px 0",
    display: "flex",
    flexDirection: "column",
    width: "500px",
    margin: "0 auto",
  },
  searchBarContainer: {
    width: "100%",
    marginBottom: "50px",
    padding: 0,
  },
});

const initialState = {
  search: "",
  searchData: [],
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_INPUT":
      return { ...state, search: action.payload };
    case "SEARCH_DATA":
      return { ...state, searchData: action.payload };
    case "ERROR":
      return { ...state, error: action.payload };
    default:
      throw new Error("Error");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyle();
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let timer;
    if (!state.search) dispatch({ type: "SEARCH_DATA", payload: [] });
    if (state.search && state.search.length > 3) {
      timer = setTimeout(() => {
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${state.search}&maxResults=5& key=AIzaSyCU6LduB95u-9x1QoLVh--wU6Y0JROhLk4`,
          { signal }
        )
          .then((res) => res.json())
          .then((data) => {
            const newArray = data.items.map((item) => {
              const newTitle = item.volumeInfo.title.replace(
                new RegExp(state.search, "gi"),
                (match) => `<mark>${match}</mark>`
              );
              const newDescrption =
                item.volumeInfo.description &&
                item.volumeInfo.description.replace(
                  new RegExp(state.search, "gi"),
                  (match) => `<mark>${match}</mark>`
                );
              return {
                ...item,
                volumeInfo: {
                  ...item.volumeInfo,
                  title: newTitle,
                  description: newDescrption ? newDescrption : "no description",
                },
              };
            });
            dispatch({ type: "SEARCH_DATA", payload: newArray });
          })
          .catch((err) => {
            dispatch({ type: "ERROR", payload: err.message });
          });
      }, 200);
    }
    return () => {
      if (timer) clearTimeout(timer);
      controller.abort();
    };
  }, [state.search]);
  const handleChange = (e) => {
    const string = e.target.value;
    dispatch({ type: "SEARCH_INPUT", payload: string });
  };
  const handleChangeCallback = useCallback((e) => {
    handleChange(e);
  }, []);
  return (
    <Grid className={classes.root}>
      <Grid className={classes.searchBarContainer}>
        <SearchBar
          className={classes.searchBar}
          onInputChange={handleChangeCallback}
        />
      </Grid>
      <Grid>
        {state.searchData.map((post) => (
          <Item
            key={post.id}
            avatar={
              post.volumeInfo.imageLinks &&
              post.volumeInfo.imageLinks.smallThumbnail
            }
            title={post.volumeInfo.title}
            body={post.volumeInfo.description}
          />
        ))}
      </Grid>
      <Snackbar
        open={!!state.error}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: "ERROR", payload: "" })}
      >
        <MuiAlert severity="error">{state.error}</MuiAlert>
      </Snackbar>
    </Grid>
  );
}

export default App;
