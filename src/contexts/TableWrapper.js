// FormContext.js
import React, { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form } from "../react-radfish";
import { computePriceFromQuantitySpecies } from "../utilities";

const TableContext = createContext();

/**
 * Higher-order component providing form state and functionality.
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Function} props.onSubmit - Callback function to handle form submission.
 * @returns {JSX.Element} The JSX element representing the form wrapper.
 */
export const TableWrapper = ({ children, onSubmit }) => {
  const contextValue = {
    tableConfig: {
      caption: "This table uses the fixed prop to force equal width columns",
      head: ["Document title", "1776"],
      rows: [
        ["Declaration of Independence", "1776"],
        ["Bill of Rights", "1791"],
        ["Declaration of Sentiments", "1848"],
        ["Emancipation Proclamation", "1863"],
      ],
    },
  };

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
};

/**
 * Custom hook for accessing the form state from the context. Can be used by a child of FormWrapper
 *
 * @function
 * @returns {Object} Form state and functions.
 * @throws {Error} Throws an error if used outside of a FormWrapper.
 */
export const useTableState = () => {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("useTableState must be used within a TableWrapper");
  }
  return context;
};
