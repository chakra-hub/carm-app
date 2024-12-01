import Avatar from "@mui/joy/Avatar";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import Apps from "@mui/icons-material/Apps";
import Dropdown from "@mui/joy/Dropdown";
import DeleteForever from "@mui/icons-material/DeleteForever";
export default function Workspaces({
  allWorkspaces = [],
  onWorkSpaceChange,
  selectedIndex,
  onWorkspaceAddOrDelete,
  onDeleteWorkspace,
}) {
  const deleteWorkspace = (workspaceId) => {
    const copyAllWorkspaces = [...allWorkspaces];
    copyAllWorkspaces.splice(workspaceId, 1);
    onWorkspaceAddOrDelete(copyAllWorkspaces);
    onDeleteWorkspace(workspaceId);
  };
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral" } }}
        sx={{ borderRadius: 40 }}
      >
        <Apps />
      </MenuButton>
      <Menu
        variant="solid"
        invertedColors
        aria-labelledby="apps-menu-demo"
        sx={{
          "--List-padding": "0.5rem",
          "--ListItemDecorator-size": "3rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridAutoRows: "100px",
          gap: 1,
        }}
      >
        {allWorkspaces?.map((item, index) => {
          return (
            <MenuItem
              orientation="vertical"
              key={item}
              onClick={() => {
                onWorkSpaceChange(index);
              }}
              selected={selectedIndex === index}
              style={{ position: "relative" }}
            >
              <ListItemDecorator>
                <Avatar>{item?.[0]}</Avatar>
              </ListItemDecorator>
              {item}
              <DeleteForever
                size="sm"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "20px",
                  height: "20px",
                }}
                onClick={(e) => {
                  deleteWorkspace(index);
                  e.stopPropagation();
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Dropdown>
  );
}
