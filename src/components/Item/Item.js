import { memo } from 'react'

import DOMPurify from "dompurify";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
  rootItem: {
    width: "100%",
    padding: "0 !important"
  },
  ellipsis: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "14px",
    color: "#636E72"
  },
  avatar: {
    borderRadius: "0% !important",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

function Item({ title, avatar, body }) {
  const createHTML = (html) => ({ __html: DOMPurify.sanitize(html) });
  const classes = useStyle();
  return (
    <Grid container justify={"center"}>
        <ListItem disableGutters className={classes.rootItem}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {avatar ? (
                <img className={classes.img} src={avatar} alt="book" />
              ) : (
                <MenuBookIcon />
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography dangerouslySetInnerHTML={createHTML(title)} />}
            secondary={
              <Typography
                className={classes.ellipsis}
                dangerouslySetInnerHTML={createHTML(body)}
              />
            }
          />
        </ListItem>
    </Grid>
  );
}

export default memo(Item);
