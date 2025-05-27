// src/components/ProtectedRoute.tsx
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import ReactionDetail from "../pages/Reactions/ReactionDetail";
import ReactionForm from "../pages/Reactions/ReactionForm";
import Reactions from "../pages/Reactions/Reactions";
import Signup from "../pages/Signup";
import UserForm from "../pages/Users/UserForm";
import Users from "../pages/Users/Users";
import ProtectedRoute from "./ProtectedRoute";
import SidebarLayout from "./ui/Sidebar";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Routes>
                <Route
                  path="/users/*"
                  element={
                    <Routes>
                      <Route path="" element={<Users />} />
                      {/* <Route
                            path="detail"
                            element={
                              <ProtectedRoute>
                                <Users />
                              </ProtectedRoute>
                            }
                          /> */}
                      <Route
                        path="new"
                        element={
                          <ProtectedRoute>
                            <UserForm />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="edit"
                        element={
                          <ProtectedRoute>
                            <UserForm />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  }
                />

                <Route
                  path="/reactions/*"
                  element={
                    <Routes>
                      <Route path="" element={<Reactions />} />
                      <Route
                        path="detail"
                        element={
                          <ProtectedRoute>
                            <ReactionDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="new"
                        element={
                          <ProtectedRoute>
                            <ReactionForm />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="edit"
                        element={
                          <ProtectedRoute>
                            <ReactionForm />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  }
                />
              </Routes>
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
