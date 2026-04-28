// src/pages/dashboard/AdminsAudit/UserAudit.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import {
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import {
  getUserAuditLogs,
  getUserAuditStats,
  setUserAuditFilters,
} from "../../../redux/actions/userAudit.actions";
import {
  USER_AUDIT_CRUD_OPERATIONS,
  USER_AUDIT_TIME_PERIODS,
} from "../../../constants/userAudit.constants";
import Table from "../../../shared/components/table/Table";
import AuditLogDetailsModal from "./components/AuditLogDetailsModal";

function UserAudit() {
  const dispatch = useDispatch();
  const { logs, stats, pagination, filters, error } = useSelector(
    (state) => state.userAudit
  );

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetails, setShowLogDetails] = useState(false);

  useEffect(() => {
    dispatch(getUserAuditLogs({ page: 1, ...filters }));
    dispatch(getUserAuditStats(filters.days));
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    dispatch(setUserAuditFilters(localFilters));
    dispatch(getUserAuditLogs({ page: 1, ...localFilters }));
    dispatch(getUserAuditStats(localFilters.days));
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      userId: "",
      operation: "",
      days: 30,
    };
    setLocalFilters(defaultFilters);
    dispatch(setUserAuditFilters(defaultFilters));
    dispatch(getUserAuditLogs({ page: 1, ...defaultFilters }));
    dispatch(getUserAuditStats(defaultFilters.days));
  };

  const refreshData = () => {
    dispatch(getUserAuditLogs({ page: pagination.page, ...filters }));
    dispatch(getUserAuditStats(filters.days));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleString() : "Invalid Date";
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "green";
    if (statusCode >= 400 && statusCode < 500) return "amber";
    if (statusCode >= 500) return "red";
    return "blue-gray";
  };

  const getCrudOperationColor = (operation) => {
    const colors = {
      CREATE: "green",
      READ: "blue",
      UPDATE: "amber",
      DELETE: "red",
    };
    return colors[operation] || "blue-gray";
  };

  const handleOpenLogDetails = (log) => {
    setSelectedLog(log);
    setShowLogDetails(!showLogDetails);
  };

  const columns = [
    {
      header: "User",
      accessor: "user",
      render: (row) => (
        <div className="flex flex-col">
          <Typography
            variant="small"
            className="font-semibold text-light-text dark:text-dark-text"
          >
            {row.user_name}
          </Typography>
          <Typography
            variant="small"
            className="text-xs font-normal text-light-muted dark:text-dark-muted"
          >
            {row.user_email}
          </Typography>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <Typography
          variant="small"
          className="text-xs font-semibold text-light-text dark:text-dark-text"
        >
          {row.action}
        </Typography>
      ),
    },
    {
      header: "Operation",
      accessor: "crud_operation",
      render: (row) => (
        <span>
          <span className="sr-only">{row.crud_operation}</span>
          <div className="flex">
            <div className="w-fit">
              <div className="inline-block">
                <div className="inline-block">
                  <div className="inline-block">
                    {/* simple Chip mimic */}
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium bg-opacity-10 ${
                        getCrudOperationColor(row.crud_operation) === "green"
                          ? "bg-green-500 text-green-700"
                          : getCrudOperationColor(row.crud_operation) === "blue"
                          ? "bg-blue-500 text-blue-700"
                          : getCrudOperationColor(row.crud_operation) === "amber"
                          ? "bg-amber-500 text-amber-700"
                          : "bg-red-500 text-red-700"
                      }`}
                    >
                      {row.crud_operation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </span>
      ),
    },
    {
      header: "Endpoint",
      accessor: "endpoint",
      render: (row) => (
        <div className="flex flex-col">
          <Typography
            variant="small"
            className="text-xs font-semibold text-light-text dark:text-dark-text"
          >
            {row.method}
          </Typography>
          <Typography
            variant="small"
            className="text-xs font-normal text-light-muted dark:text-dark-muted truncate max-w-xs"
          >
            {row.endpoint}
          </Typography>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status_code",
      render: (row) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium bg-opacity-10 ${
            getStatusColor(row.status_code) === "green"
              ? "bg-green-500 text-green-700"
              : getStatusColor(row.status_code) === "amber"
              ? "bg-amber-500 text-amber-700"
              : getStatusColor(row.status_code) === "red"
              ? "bg-red-500 text-red-700"
              : "bg-slate-500 text-slate-700"
          }`}
        >
          {row.status_code}
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => (
        <Typography
          variant="small"
          className="text-xs font-normal text-light-muted dark:text-dark-muted"
        >
          {formatDate(row.createdAt || row.created_at)}
        </Typography>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <IconButton
          variant="text"
          size="sm"
          onClick={() => handleOpenLogDetails(row)}
          className="text-light-muted dark:text-dark-muted"
        >
          <EyeIcon className="h-4 w-4" />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography
            variant="h4"
            className="mb-1 text-light-text dark:text-dark-text"
          >
            User Audit Logs
          </Typography>
          <Typography
            variant="small"
            className="font-normal text-light-muted dark:text-dark-muted"
          >
            Monitor activity of Users under your business
          </Typography>
        </div>
        <div className="flex gap-2">
          <IconButton
            variant="outlined"
            size="sm"
            onClick={refreshData}
            className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </IconButton>
          <Button
            variant="outlined"
            size="sm"
            className="flex items-center gap-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="small"
                  className="font-normal text-light-muted dark:text-dark-muted"
                >
                  Total Logs
                </Typography>
                <Typography
                  variant="h4"
                  className="text-light-text dark:text-dark-text"
                >
                  {pagination.total || 0}
                </Typography>
              </div>
              <DocumentTextIcon className="h-6 w-6 text-light-muted dark:text-dark-muted" />
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="small"
                  className="font-normal text-light-muted dark:text-dark-muted"
                >
                  Active Users
                </Typography>
                <Typography
                  variant="h4"
                  className="text-light-text dark:text-dark-text"
                >
                  {stats.userStats?.length || 0}
                </Typography>
              </div>
              <EyeIcon className="h-6 w-6 text-light-muted dark:text-dark-muted" />
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="small"
                  className="font-normal text-light-muted dark:text-dark-muted"
                >
                  Top Operation
                </Typography>
                <Typography
                  variant="h6"
                  className="text-light-text dark:text-dark-text"
                >
                  {stats.roleStats?.[0]?.crud_operation || "N/A"}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="small"
                  className="font-normal text-light-muted dark:text-dark-muted"
                >
                  Period
                </Typography>
                <Typography
                  variant="h6"
                  className="text-light-text dark:text-dark-text"
                >
                  {stats.period || `${filters.days} days`}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="User ID"
                value={localFilters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className:
                    "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
              />
              <Select
                label="Operation"
                value={localFilters.operation}
                onChange={(value) => handleFilterChange("operation", value)}
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className:
                    "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
                menuProps={{
                  className: "!bg-light-surface dark:!bg-dark-surface",
                }}
              >
                <Option value="">All Operations</Option>
                {USER_AUDIT_CRUD_OPERATIONS.map((op) => (
                  <Option key={op.value} value={op.value}>
                    {op.label}
                  </Option>
                ))}
              </Select>
              <Select
                label="Time Period"
                value={localFilters.days.toString()}
                onChange={(value) =>
                  handleFilterChange("days", parseInt(value))
                }
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className:
                    "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
                menuProps={{
                  className: "!bg-light-surface dark:!bg-dark-surface",
                }}
              >
                {USER_AUDIT_TIME_PERIODS.map((period) => (
                  <Option key={period.value} value={period.value}>
                    {period.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button size="sm" variant="outlined" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Table */}
      <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-6 !bg-light-surface dark:!bg-dark-surface"
        >
          <Typography
            variant="h5"
            className="text-light-text dark:text-dark-text"
          >
            User Audit Logs
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pt-0 !bg-light-surface dark:!bg-dark-surface">
          <Table columns={columns} rows={logs} />
        </CardBody>
      </Card>

      <AuditLogDetailsModal
        open={showLogDetails}
        handleOpen={() => setShowLogDetails(!showLogDetails)}
        selectedLog={selectedLog}
      />
    </div>
  );
}

export default UserAudit;
