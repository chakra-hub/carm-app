import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { onValue, ref, remove, set, update } from "firebase/database";
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
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Stack from "@mui/joy/Stack";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../authContex";
import Checkbox from "@mui/joy/Checkbox";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [copyTodosArray, setCopyTodosArray] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    priority: "Low",
    done: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortValue, setSortValue] = useState("Priority - High to Low");
  const [inputFieldError, setInputFieldError] = useState(false);
  const { user, isEmailVerified } = useAuth();
  const [filterArray, setFilterArray] = useState([]);

  const addTodos = () => {
    const uidd = uid(); //DFASDFSDFA
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: newTodo,
      uidd: uidd,
    });
    setNewTodo({
      title: "",
      priority: "Low",
      done: false,
    });
  };

  const updateTodo = (action, todo) => {
    if (action === "updateStatus") {
      update(ref(db, `/${auth.currentUser.uid}/${todo?.uidd}`), {
        todo: { ...todo.todo, done: !todo?.todo?.done },
        uidd: todo?.uidd,
      });
    } else {
      update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
        todo: newTodo,
        uidd: tempUidd,
      });
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
    remove(ref(db, `${auth.currentUser.uid}/${uidd}`));
  };

  useEffect(() => {
    if (user && isEmailVerified) {
      onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
        setTodos([]);
        const data = snapshot.val();
        if (data !== null) {
          Object.values(data).map((todo) => {
            setTodos((prevArray) => [...prevArray, todo]);
          });
        }
        setIsLoading(false);
      });
    }
  }, [isEmailVerified]);

  useEffect(() => {
    if (filterArray?.length > 0) {
      handleFilterTodos();
    }else{
      setCopyTodosArray(todos);
    }
  }, [filterArray,todos]);

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
                <div className="text-3xl font-bold underline">
                  <Typography level="title-md" color="gray">
                    Manage tasks efficiently
                  </Typography>
                </div>
              </p>
            </header>

            {/* Add Todo Form */}
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
                          setNewTodo({ ...newTodo, title: input });
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
                              onClick={addTodos}
                              disabled={newTodo.title === "" || inputFieldError}
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
                <div>
                  <Typography level="title-sm">Priority</Typography>
                  <Select
                    defaultValue={newTodo?.priority}
                    size="sm"
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
              </form>
            </section>

            {/* Display Todos */}

            {isLoading ? (
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
                  <div style={{visibility:copyTodosArray.length == 1 && 'hidden'}}>
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
                    </Select>
                  </div>

                  <div>
                    <Select
                      size="sm"
                      multiple
                      onChange={(event, newValue) => setFilterArray(newValue)}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", gap: "0.25rem" }}>
                          {selected.map((selectedOption) => (
                            <Chip variant="soft" color="primary">
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
                      <Option value="Done">Done</Option>
                     {filterArray?.indexOf('Low') === -1 && filterArray?.indexOf('High') === -1 && <Option value="Blocker">Blocker</Option>}
                     {filterArray?.indexOf('Blocker') === -1 && filterArray?.indexOf('Low') === -1 && <Option value="High">High</Option>}  
                     {filterArray?.indexOf('Blocker') === -1 && filterArray?.indexOf('High') === -1 && <Option value="Low">Low</Option>}
                    </Select>
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
                          : b?.todo?.priority?.localeCompare(a?.todo?.priority)
                      )
                      .map((todo, index) => {
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
                                  <Tooltip title="Blocker">
                                    <BlockIcon />{" "}
                                  </Tooltip>
                                )}

                                {todo?.todo?.priority === "Low" && (
                                  <Tooltip title="Priority Low">
                                    <LowPriorityIcon />
                                  </Tooltip>
                                )}

                                {todo?.todo?.priority === "High" && (
                                  <Tooltip title="Priority High">
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
            )}
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TodoPage;
