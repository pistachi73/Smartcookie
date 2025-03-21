import { act } from "@testing-library/react";
import { afterEach } from "vitest";
import * as zustand from "zustand";

// Export all the actual zustand exports
export * from "zustand";

// A variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// Mock implementation of create
const actualCreate = zustand.create;
export const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
}) as typeof zustand.create;

// Mock implementation of createStore
const actualCreateStore = zustand.createStore;
export const createStore = (<T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
}) as typeof zustand.createStore;

// Reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
