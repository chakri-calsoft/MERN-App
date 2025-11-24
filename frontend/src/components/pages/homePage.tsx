import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, CircularProgress, Paper, TextField } from "@mui/material";
import { getAuthSession } from "../../utils/auth";
import { useMutation } from "@tanstack/react-query";
import getInfo from "../../services/fetchData";
import { useEffect, useState } from "react";
import AddJob from "../actions/addJob";
import EditJob from "../actions/editJob";
import DeleteJob from "../actions/deleteJob";

const HomeComponent: React.FC = () => {
  const [localData, setLocalData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const token = getAuthSession();

  const mutation = useMutation({
    mutationFn: getInfo,
    onSuccess: (response) => {
      if (response.data) {
        setLocalData(response.data);
      }
    },
    onError: (error: any) => {
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    },
  });

  useEffect(() => {
    mutation.mutate(token);
  }, [token]);

  const handleSearchQuery = (event) => {
    setSearchQuery(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 350 },
    { field: "requestedBy", headerName: "Requested By", width: 200 },
    { field: "positions", headerName: "Positions", width: 180 },
    { field: "status", headerName: "Status", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div>
          <EditJob job={params.row} setLocalData={setLocalData} />
          <DeleteJob setLocalData={setLocalData} id={params.row.id} />
        </div>
      ),
    },
  ];

  const rows = localData.map((item) => ({
    id: item.id,
    title: item.title,
    requestedBy: item.createdBy.displayName,
    positions: item.numberOfPositions,
    status: item.status,
  }));

  const filteredRows = localData
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.createdBy.displayName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((item) => ({
      id: item.id,
      title: item.title,
      requestedBy: item.createdBy.displayName,
      positions: item.numberOfPositions,
      status: item.status,
    }));

  const paginationModel = { page: 0, pageSize: 25 };

  return (
    <>
      {token && (
        <div>
          <Paper sx={{ height: "100%", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                placeholder="Search..."
                size="small"
                sx={{ m: "1rem" }}
                value={searchQuery}
                onChange={handleSearchQuery}
              ></TextField>
              <AddJob setLocalData={setLocalData} />
            </div>
            {mutation.isPending ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 300,
                }}
              >
                <CircularProgress sx={{ color: "#fccc55" }} />
              </Box>
            ) : (
              <DataGrid
                rows={searchQuery ? filteredRows : rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[25]}
                checkboxSelection={false}
                sx={{
                  border: 0,
                  px: "1rem",
                  "& .MuiDataGrid-columnHeaders": {
                    fontSize: 20,
                    fontWeight: "bold",
                    pb: "0.3rem",
                  },
                  "& .MuiDataGrid-row": { py: "0.5rem" },
                }}
              />
            )}
          </Paper>
        </div>
      )}
    </>
  );
};

export default HomeComponent;
