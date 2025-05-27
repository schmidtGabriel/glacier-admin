import { createSlice } from "@reduxjs/toolkit";
import type { UserResource } from "../../resources/UserResource";
import { type RootState } from "../store";

type Session = {
  user?: UserResource;
  isAuthenticated: boolean;
  token?: string;
};

const initialState: Session = {
  isAuthenticated: false,
  user: undefined,
  token: undefined,
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      return { ...state, token: payload.access_token, isAuthenticated: true };
    },
    setSessionUser: (state, { payload }) => {
      return { ...state, user: payload };
    },
    clearSession: () => {
      return initialState;
    },
  },
});

export const { setCredentials, setSessionUser, clearSession } = session.actions;

export default session.reducer;

export const selectSessionUser = ({ session }: RootState) => session.user;
export const selectSessionToken = ({ session }: RootState) => session.token;
export const selectIsAuthenticated = ({ session }: RootState) =>
  session.isAuthenticated;
