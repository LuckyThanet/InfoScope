import { QueryClient } from "@tanstack/react-query";
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
    mutations: {
      networkMode: "always",
    },
  },
});

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});