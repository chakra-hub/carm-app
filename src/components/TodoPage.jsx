import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { onValue, ref, remove, set, update } from "firebase/database";
import { HashLoader } from "react-spinners";
import Box from "@mui/joy/Box";
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

const TodoPage = () => {
  const [todos, setTodos] = useState([]); // Placeholder for todos
  const [newTodo, setNewTodo] = useState({
    title: "",
    priority: "Low",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortValue, setSortValue] = useState("Priority - High to Low");
  const [inputFieldError, setInputFieldError] = useState(false);
  const navigate = useNavigate();

  const addTodos = () => {
    const uidd = uid(); //DFASDFSDFA
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: newTodo,
      uidd: uidd,
    });
    setNewTodo({
      title: "",
      priority: "Low",
    });
  };

  const updateTodo = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: newTodo,
      uidd: tempUidd,
    });
    setIsEditing(false);
    setNewTodo({
      title: "",
      priority: "Low",
    });
  };

  const deleteTodo = (uidd) => {
    remove(ref(db, `${auth.currentUser.uid}/${uidd}`));
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else {
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
    });
  }, []);
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
                        
                        if (input.length > 30) {
                          setInputFieldError(true);
                        } else {
                          setInputFieldError(false);
                        }
                        
                        // Update state only if input length is <= 30
                        if (input.length <= 30) {
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
                    {inputFieldError && 
                    <FormHelperText>
                        
                    <InfoOutlined />
                    max 30 characters ! 
                  </FormHelperText>}
                    
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
                {todos?.length>1 && 
                <div style={{ marginBottom: "10px" }}>  
                Sort :{" "}
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
              </div>}
                
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
                  {todos.length > 0 ? (
                    todos
                      .sort((a, b) =>
                        sortValue === "Priority - High to Low"
                          ? a.todo.priority.localeCompare(b.todo.priority)
                          : b.todo.priority.localeCompare(a.todo.priority)
                      )
                      .map((todo, index) => (
                        <Card
                          variant="outlined"
                          style={{ marginBottom: "5px" }}
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
                                {todo.todo.title}
                              </Typography>

                              {todo.todo.priority === "Blocker" && (
                                <Tooltip title="Blocker">
                                  <BlockIcon />{" "}
                                </Tooltip>
                              )}

                              {todo.todo.priority === "Low" && (
                                <Tooltip title="Priority Low">
                                  <LowPriorityIcon />
                                </Tooltip>
                              )}

                              {todo.todo.priority === "High" && (
                                <Tooltip title="Priority High">
                                  <PriorityHighIcon />
                                </Tooltip>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "right",
                              }}
                            >
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
                          </CardContent>
                        </Card>
                      ))
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
