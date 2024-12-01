import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { uid } from "uid";
import { onValue, ref, remove, set, update } from "firebase/database";
import moment from "moment";
import { HashLoader } from "react-spinners";
import Box from "@mui/joy/Box";
import { Chip } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import BlockIcon from "@mui/icons-material/Block";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Tooltip } from "@mui/material";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../authContex";
import Checkbox from "@mui/joy/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { extractDateFromString } from "../utils/utils";
import Workspaces from "./Workspaces";
import NewWorkspace from "./NewWorkspace";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [copyTodosArray, setCopyTodosArray] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    priority: "Low",
    done: false,
    dateCreated: "",
    deadline: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortValue, setSortValue] = useState("Priority - High to Low");
  const [inputFieldError, setInputFieldError] = useState(false);
  const { user, isEmailVerified } = useAuth();
  const [filterArray, setFilterArray] = useState([]);
  const [refreshDropDown, setRefreshDropDown] = useState(false);
  const [currentWorkSpaceId, setCurrentWorkSpaceId] = useState(0);
  const [allWorkspaces, setAllWorkSpaces] = useState([]);
  const [allWorkspaceNameArray, setAllWorkspaceNameArray] = useState([]);

  const addTodos = () => {
    const uidd = uid(); //DFASDFSDFA
    set(
      ref(
        db,
        `/${auth.currentUser.uid}/${allWorkspaceNameArray[currentWorkSpaceId]}/${uidd}`
      ),
      {
        todo: { ...newTodo, dateCreated: Date.now() },
        uidd: uidd,
      }
    );
    setNewTodo({
      title: "",
      priority: "Low",
      done: false,
      dateCreated: "",
      deadline: "",
    });
  };

  const updateTodo = (action, todo) => {
    if (action === "updateStatus") {
      update(
        ref(
          db,
          `/${auth.currentUser.uid}/${allWorkspaceNameArray[currentWorkSpaceId]}/${todo?.uidd}`
        ),
        {
          todo: { ...todo.todo, done: !todo?.todo?.done },
          uidd: todo?.uidd,
        }
      );
    } else {
      update(
        ref(
          db,
          `/${auth.currentUser.uid}/${allWorkspaceNameArray[currentWorkSpaceId]}/${tempUidd}`
        ),
        {
          todo: newTodo,
          uidd: tempUidd,
        }
      );
    }
    setIsEditing(false);
    setNewTodo({
      title: "",
      priority: "Low",
      done: false,
    });
  };

  const handleFilterTodos = () => {
    const filteredTodos = todos.filter((item) => {
      if (filterArray?.length !== 0) {
        if (filterArray?.length === 1) {
          if (filterArray[0] === "Done") {
            if (item?.todo?.done === true) {
              return item;
            }
          } else if (
            filterArray[0] === "Blocker" ||
            filterArray[0] === "Low" ||
            filterArray[0] === "High"
          ) {
            if (item?.todo?.priority === filterArray[0]) {
              return item;
            }
          }
        } else if (filterArray?.length === 2) {
          if (filterArray[0] == "Done") {
            if (
              item?.todo?.done === true &&
              item?.todo?.priority === filterArray[1]
            ) {
              return item;
            }
          } else {
            if (
              item?.todo?.priority === filterArray[0] &&
              item?.todo?.done === true
            ) {
              return item;
            }
          }
        }
      } else {
        return item;
      }
    });
    setCopyTodosArray(filteredTodos);
  };

  const deleteTodo = (uidd) => {
    remove(
      ref(
        db,
        `${auth.currentUser.uid}/${allWorkspaceNameArray[currentWorkSpaceId]}/${uidd}`
      )
    );
  };

  const deleteWorkSpace = (workspaceId) => {
    remove(
      ref(db, `${auth.currentUser.uid}/${allWorkspaceNameArray[workspaceId]}`)
    );
  };

  useEffect(() => {
    if (user && isEmailVerified) {
      onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
        setAllWorkSpaces([]);
        setTodos([]);
        const data = snapshot.val();
        if (data !== null) {
          setAllWorkSpaces(data);
          setAllWorkspaceNameArray(Object.keys(data));
        }
        setIsLoading(false);
      });
    }
  }, [isEmailVerified]);

  useEffect(() => {
    if (filterArray?.length > 0) {
      handleFilterTodos();
    } else {
      setCopyTodosArray(todos);
    }
  }, [filterArray, todos]);
  useEffect(() => {
    const allTodoData = Object.values(allWorkspaces).filter(
      (todoObj, index) => {
        return index === currentWorkSpaceId;
      }
    )[0];
    if (allTodoData) {
      setTodos(Object.values(allTodoData));
    } else {
      setTodos([]);
    }
  }, [allWorkspaces, currentWorkSpaceId]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "91vh",
      }}
    >
      <Card variant="soft">
        <CardContent>
          <div
            style={{
              width: "330px",
              padding: "20px",
              border: "1px solid #  ",
              borderRadius: "10px",
              maxHeight: "calc(100vh - 20vh)",
            }}
          >
            <header style={{ marginBottom: "20px", textAlign: "center" }}>
              <p style={{ color: "#666", margin: "5px 0" }}>
                <div
                  className="text-3xl font-bold underline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography level="title-md" color="gray">
                    {allWorkspaceNameArray?.length > 0
                      ? "Manage workspaces efficiently"
                      : "Create your first Workspace"}
                  </Typography>
                  {allWorkspaceNameArray?.length > 0 && (
                    <Workspaces
                      allWorkspaces={allWorkspaceNameArray}
                      onWorkSpaceChange={setCurrentWorkSpaceId}
                      selectedIndex={currentWorkSpaceId}
                      onWorkspaceAddOrDelete={setAllWorkspaceNameArray}
                      onDeleteWorkspace={deleteWorkSpace}
                    />
                  )}

                  <NewWorkspace
                    onWorkspaceAddOrDelete={setAllWorkspaceNameArray}
                    allWorkspaces={allWorkspaceNameArray}
                    setCurrentWorkSpaceId={setCurrentWorkSpaceId}
                    addTodos={addTodos}
                  />
                </div>
              </p>
            </header>

            {/* Add Todo Form */}
            {allWorkspaceNameArray?.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    addTodos();
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <FormControl error={inputFieldError}>
                      <Input
                        value={newTodo.title}
                        type="text"
                        placeholder="Enter a new task"
                        onChange={(e) => {
                          const input = e.target.value;

                          if (input.length > 40) {
                            setInputFieldError(true);
                          } else {
                            setInputFieldError(false);
                          }

                          // Update state only if input length is <= 30
                          if (input.length <= 40) {
                            const date = extractDateFromString(input);
                            setNewTodo({
                              ...newTodo,
                              title: input,
                              deadline: isNaN(Date.parse(date))
                                ? ""
                                : Date.parse(date),
                            });
                          }
                        }}
                        defaultValue="max 30 characters !"
                        endDecorator={
                          isEditing && newTodo.title !== "" ? (
                            <Button
                              color="warning"
                              type="submit"
                              onClick={updateTodo}
                              disabled={newTodo.title === "" || inputFieldError}
                            >
                              Update
                            </Button>
                          ) : (
                            newTodo.title !== "" && (
                              <Button
                                color="success"
                                type="submit"
                                onClick={() => {
                                  addTodos();
                                }}
                                disabled={
                                  newTodo.title === "" || inputFieldError
                                }
                              >
                                Add Todo
                              </Button>
                            )
                          )
                        }
                        sx={{
                          "--Input-radius": "17px",
                          "--Input-gap": "14px",
                          "--Input-placeholderOpacity": 0.4,
                          "--Input-focusedThickness": "1px",
                          "--Input-paddingInline": "14px",
                          "--Input-decoratorChildHeight": "28px",
                        }}
                        onBlur={() => {
                          if (newTodo.title === "") setIsEditing(false);
                        }}
                      />
                      {inputFieldError && (
                        <FormHelperText>
                          <InfoOutlined />
                          max 30 characters !
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                  <div style={{ display: "flex", alignItems: "end" }}>
                    <div style={{ marginRight: "5px" }}>
                      <label htmlFor="select-button" id="select-label">
                        <Typography level="title-sm">Priority</Typography>
                      </label>
                      <Select
                        defaultValue={newTodo?.priority}
                        // size="xl"
                        sx={{ width: 100 }}
                        value={newTodo.priority}
                        onChange={(event, newValue) => {
                          setNewTodo({ ...newTodo, priority: newValue });
                        }}
                      >
                        <Option value="Blocker">Blocker</Option>
                        <Option value="High">High</Option>
                        <Option value="Low">Low</Option>
                      </Select>
                    </div>
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoItem label="">
                          <DatePicker
                            label="Deadline"
                            value={dayjs(
                              newTodo.deadline === ""
                                ? moment(Date.now()).format("YYYY/MM/DD")
                                : moment(newTodo?.deadline).format("YYYY/MM/DD")
                            )}
                            defaultValue={dayjs("2022-04-17")}
                            slotProps={{ textField: { size: "small" } }}
                            sx={{
                              width: "150px",
                              backgroundColor: "#fbfcfe",
                            }}
                            // value={}
                            onChange={(newValue) => {
                              setNewTodo({
                                ...newTodo,
                                deadline: Date.parse(newValue.$d),
                              });
                            }}
                          />
                        </DemoItem>
                      </LocalizationProvider>
                    </div>
                  </div>
                </form>
              </section>
            )}

            {/* Display Todos */}

            {isLoading && allWorkspaceNameArray?.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <HashLoader color="green" size={35} />
              </div>
            ) : (
              allWorkspaceNameArray?.length > 0 && (
                <section>
                  <h2
                    style={{
                      color: "#333",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "5px",
                    }}
                  >
                    <Typography level="title-lg">My Todos</Typography>
                  </h2>

                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        visibility: copyTodosArray?.length == 1 && "hidden",
                      }}
                    >
                      <Select
                        defaultValue="Priority - High to Low"
                        size="sm"
                        sx={{ width: 100 }}
                        value={sortValue}
                        onChange={(event, newValue) => {
                          setSortValue(newValue);
                        }}
                      >
                        <Option value="Priority - High to Low">
                          Priority - High to Low
                        </Option>
                        <Option value="Priority - Low to High">
                          Priority - Low to High
                        </Option>
                        <Option value="Date Created High to Low">
                          Date Created High to Low
                        </Option>
                        <Option value="Date Created Low to High">
                          Date Created Low to High
                        </Option>
                        <Option value="Deadline Near">Deadline Near</Option>
                        <Option value="Deadline Far">Deadline Far </Option>
                      </Select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      {filterArray?.length > 0 && (
                        <Button
                          variant="plain"
                          sx={{ marginRight: "2px" }}
                          onClick={() => {
                            setRefreshDropDown((prev) => !prev);
                            setFilterArray([]);
                          }}
                        >
                          Reset
                        </Button>
                      )}
                      {filterArray?.length >= 0 && (
                        <Select
                          key={refreshDropDown}
                          size="sm"
                          multiple
                          onChange={(event, newValue) =>
                            setFilterArray(newValue)
                          }
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", gap: "0.25rem" }}>
                              {selected.map((selectedOption) => (
                                <Chip
                                  variant="soft"
                                  color="primary"
                                  key={selectedOption.label}
                                >
                                  {selectedOption.label}
                                </Chip>
                              ))}
                            </Box>
                          )}
                          slotProps={{
                            listbox: {
                              sx: {
                                width: "100%",
                              },
                            },
                          }}
                        >
                          <Option value="Done" key={filterArray.length || 0}>
                            Done
                          </Option>
                          {filterArray?.indexOf("Low") === -1 &&
                            filterArray?.indexOf("High") === -1 && (
                              <Option value="Blocker">Blocker</Option>
                            )}
                          {filterArray?.indexOf("Blocker") === -1 &&
                            filterArray?.indexOf("Low") === -1 && (
                              <Option value="High">High</Option>
                            )}
                          {filterArray?.indexOf("Blocker") === -1 &&
                            filterArray?.indexOf("High") === -1 && (
                              <Option value="Low">Low</Option>
                            )}
                        </Select>
                      )}
                    </div>
                  </div>

                  <ul
                    className="scroll-container"
                    style={{
                      listStyleType: "none",
                      padding: "0",
                      margin: "0",
                      overflow: "auto",
                      maxHeight: "calc(100vh - 57vh)",
                    }}
                  >
                    {copyTodosArray?.length > 0 ? (
                      copyTodosArray
                        ?.sort((a, b) =>
                          sortValue === "Priority - High to Low"
                            ? a?.todo?.priority?.localeCompare(b.todo?.priority)
                            : sortValue === "Priority - Low to High"
                              ? b?.todo?.priority?.localeCompare(
                                  a?.todo?.priority
                                )
                              : sortValue === "Date Created High to Low"
                                ? b?.todo?.dateCreated - a?.todo?.dateCreated
                                : sortValue === "Date Created Low to High"
                                  ? a?.todo?.dateCreated - b?.todo?.dateCreated
                                  : sortValue === "Deadline Near"
                                    ? a?.todo?.deadline - b?.todo?.deadline
                                    : b?.todo?.deadline - a?.todo?.deadline
                        )
                        .map((todo) => {
                          return (
                            <Card
                              variant="outlined"
                              style={{ marginBottom: "5px" }}
                              key={todo?.uid}
                            >
                              <CardContent>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography level="title-sm">
                                    {todo?.todo?.title}
                                  </Typography>

                                  {todo?.todo?.priority === "Blocker" && (
                                    <Tooltip
                                      title={
                                        <div>
                                          <div>Blocker</div>
                                          <div>
                                            Created on -{" "}
                                            {moment(
                                              todo?.todo?.dateCreated
                                            ).format("DD/MM/YYYY")}
                                          </div>
                                          <div>
                                            Deadline -{" "}
                                            {todo?.todo?.deadline
                                              ? `${moment(todo?.todo?.deadline).format("DD/MM/YYYY")} -  
                                             ${moment(todo?.todo?.deadline).endOf("day").fromNow()}`
                                              : "N/A"}
                                          </div>
                                        </div>
                                      }
                                    >
                                      <BlockIcon />{" "}
                                    </Tooltip>
                                  )}

                                  {todo?.todo?.priority === "Low" && (
                                    <Tooltip
                                      title={
                                        <div>
                                          <div>Low Priority</div>
                                          <div>
                                            Created on -{" "}
                                            {moment(
                                              todo?.todo?.dateCreated
                                            ).format("DD/MM/YYYY")}
                                          </div>
                                          <div>
                                            Deadline -{" "}
                                            {todo?.todo?.deadline
                                              ? `${moment(todo?.todo?.deadline).format("DD/MM/YYYY")} -  
                                           ${moment(todo?.todo?.deadline).endOf("day").fromNow()}`
                                              : "N/A"}
                                          </div>
                                        </div>
                                      }
                                    >
                                      <LowPriorityIcon />
                                    </Tooltip>
                                  )}

                                  {todo?.todo?.priority === "High" && (
                                    <Tooltip
                                      title={
                                        <div>
                                          <div>High Priority</div>
                                          <div>
                                            Created on -{" "}
                                            {moment(
                                              todo?.todo?.dateCreated
                                            ).format("DD/MM/YYYY")}
                                          </div>
                                          <div>
                                            Deadline -{" "}
                                            {todo?.todo?.deadline
                                              ? `${moment(todo?.todo?.deadline).format("DD/MM/YYYY")} -  
                                           ${moment(todo?.todo?.deadline).endOf("day").fromNow()}`
                                              : "N/A"}
                                          </div>
                                        </div>
                                      }
                                    >
                                      <PriorityHighIcon />
                                    </Tooltip>
                                  )}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Checkbox
                                    label="Done"
                                    size="sm"
                                    key={todo?.uidd}
                                    defaultChecked={todo?.todo?.done}
                                    color={todo?.todo?.done && "success"}
                                    onChange={() => {
                                      updateTodo("updateStatus", todo);
                                    }}
                                  />
                                  <div>
                                    {!isEditing && (
                                      <Button
                                        variant="outlined"
                                        size="sm"
                                        color="warning"
                                        style={{ marginRight: "5px" }}
                                        onClick={() => {
                                          setIsEditing(true);
                                          setNewTodo({
                                            ...newTodo,
                                            title: todo.todo.title,
                                            priority: todo.todo.priority,
                                            done: todo?.todo?.done,
                                            dateCreated:
                                              todo?.todo?.dateCreated,
                                            deadline: todo?.todo?.deadline,
                                          });
                                          setTempUidd(todo.uidd);
                                        }}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                    {!isEditing && (
                                      <Button
                                        size="sm"
                                        color="danger"
                                        onClick={() => {
                                          deleteTodo(todo.uidd);
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                    ) : (
                      <p style={{ color: "#666", textAlign: "center" }}>
                        No todos added yet
                      </p>
                    )}
                  </ul>
                </section>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TodoPage;
