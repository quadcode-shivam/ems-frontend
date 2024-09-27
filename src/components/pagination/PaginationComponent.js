// PaginationComponent.js
import React from "react";
import { Pagination, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const PaginationComponent = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', marginTop: '20px' }}>
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={onPageChange}
        variant="outlined"
        color="primary"
      />
      <FormControl variant="outlined" style={{ minWidth: 100 }}>
        <InputLabel id="items-per-page-label">Items per page</InputLabel>
        <Select
          labelId="items-per-page-label"
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          label="Items per page"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default PaginationComponent;
