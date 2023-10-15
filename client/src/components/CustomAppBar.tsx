import { AppBar, Container, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { CustomDrawer } from "./CustomDrawer";
import { Page } from "../constants";

export const CustomAppBar = ({
  themeMode,
  toggleThemeMode,
  toggleDrawer,
  isDrawerOpen,
  onClickMenu,
}: {
  themeMode: "light" | "dark";
  toggleThemeMode: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  onClickMenu: (page: Page) => void;
}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={toggleThemeMode}
          >
            {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Container>
      </Toolbar>
      <CustomDrawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        onClickMenu={onClickMenu}
      />
    </AppBar>
  );
};
