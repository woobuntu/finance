import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PAGES, Page } from "../constants";
import TodayIcon from "@mui/icons-material/Today";
import BookIcon from "@mui/icons-material/Book";
import UpdateIcon from "@mui/icons-material/Update";
import PaidIcon from "@mui/icons-material/Paid";

function MenuIcon(props: { page: Page }) {
  switch (props.page) {
    case PAGES.CALENDAR:
      return <TodayIcon />;
    case PAGES.ACCOUNTS:
      return <BookIcon />;
    case PAGES.TRANSACTIONS:
      return <UpdateIcon />;
    case PAGES.INCOME_STATEMENT:
      return <PaidIcon />;
  }
}

export const CustomDrawer = ({
  open,
  onClose,
  onClickMenu,
}: {
  open: boolean;
  onClose: () => void;
  onClickMenu: (page: Page) => void;
}) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 250,
        }}
        role="presentation"
      >
        <List>
          {Object.values(PAGES).map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => onClickMenu(text)}>
                <ListItemIcon>
                  <MenuIcon page={text} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
