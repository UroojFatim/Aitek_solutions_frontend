import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Chip,
  IconButton,
  Spinner,
  Alert
} from '@material-tailwind/react';
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { getAuditLogs, getAuditStats, setAuditFilters } from '../../../redux/actions/audit.actions';
import { CRUD_OPERATIONS, USER_ROLES_VALUES, TIME_PERIODS } from '../../../constants/audit.constants';
import Table from '../../../shared/components/table/Table';
import AuditLogDetailsModal from './components/AuditLogDetailsModal';

function AdminsAudit() {
  const dispatch = useDispatch();
  const {
    logs,
    stats,
    pagination,
    filters,
    loading,
    error
  } = useSelector((state) => state.audit);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetails, setShowLogDetails] = useState(false);

  useEffect(() => {
    // Load initial data
    dispatch(getAuditLogs({ page: 1, ...filters }));
    dispatch(getAuditStats(filters.days));
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    dispatch(setAuditFilters(localFilters));
    dispatch(getAuditLogs({ page: 1, ...localFilters }));
    dispatch(getAuditStats(localFilters.days));
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      userId: '',
      userRole: '',
      operation: '',
      days: 30
    };
    setLocalFilters(defaultFilters);
    dispatch(setAuditFilters(defaultFilters));
    dispatch(getAuditLogs({ page: 1, ...defaultFilters }));
    dispatch(getAuditStats(defaultFilters.days));
  };

  const handlePageChange = (newPage) => {
    dispatch(getAuditLogs({ page: newPage, ...filters }));
  };

  const refreshData = () => {
    dispatch(getAuditLogs({ page: pagination.page, ...filters }));
    dispatch(getAuditStats(filters.days));
  };

  const formatDate = (dateString) => {
    // Handle both created_at and createdAt formats
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleString() : 'Invalid Date';
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'green';
    if (statusCode >= 400 && statusCode < 500) return 'amber';
    if (statusCode >= 500) return 'red';
    return 'blue-gray';
  };

  const getCrudOperationColor = (operation) => {
    const colors = {
      CREATE: 'green',
      READ: 'blue',
      UPDATE: 'amber',
      DELETE: 'red'
    };
    return colors[operation] || 'blue-gray';
  };

  const handleOpenLogDetails = (log) => {
    setSelectedLog(log);
    setShowLogDetails(!showLogDetails);
  };

  // Table columns configuration for shared Table component
  const columns = [
    {
      header: 'User',
      accessor: 'user',
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
          <Chip
            variant="filled"
            size="sm"
            value={row.user_role}
            className="w-fit mt-1"
          />
        </div>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <Typography variant="small" className="text-xs font-semibold text-light-text dark:text-dark-text">
          {row.action}
        </Typography>
      )
    },
    {
      header: 'Operation',
      accessor: 'crud_operation',
      render: (row) => (
        <Chip
          variant="filled"
          color={getCrudOperationColor(row.crud_operation)}
          size="sm"
          value={row.crud_operation}
          className="w-fit"
        />
      )
    },
    {
      header: 'Endpoint',
      accessor: 'endpoint',
      render: (row) => (
        <div className="flex flex-col">
          <Typography variant="small" className="text-xs font-semibold text-light-text dark:text-dark-text">
            {row.method}
          </Typography>
          <Typography
            variant="small"
            className="text-xs font-normal text-light-muted dark:text-dark-muted truncate max-w-xs"
          >
            {row.endpoint}
          </Typography>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status_code',
      render: (row) => (
        <Chip
          variant="ghost"
          color={getStatusColor(row.status_code)}
          size="sm"
          value={row.status_code}
          className="w-fit"
        />
      )
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => (
        <Typography variant="small" className="text-xs font-normal text-light-muted dark:text-dark-muted">
          {formatDate(row.createdAt || row.created_at)}
        </Typography>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <IconButton
          variant="text"
          size="sm"
          onClick={() => handleOpenLogDetails(row)}
          className="text-light-muted dark:text-dark-muted"
        >
          <EyeIcon className="h-4 w-4" />
        </IconButton>
      )
    }
  ];

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h4" className="mb-1 text-light-text dark:text-dark-text">
            Audit Logs
          </Typography>
          <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted">
            Monitor and track all system activities and user actions
          </Typography>
        </div>
        <div className="flex gap-2">
          <IconButton
            variant="outlined"
            size="sm"
            onClick={refreshData}
            className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
          >
            <ArrowPathIcon className={`h-4 w-4`} />
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

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted">
                  Total Logs
                </Typography>
                <Typography variant="h4" className="text-light-text dark:text-dark-text">
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
                <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted">
                  Active Users
                </Typography>
                <Typography variant="h4" className="text-light-text dark:text-dark-text">
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
                <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted">
                  Most Active Role
                </Typography>
                <Typography variant="h6" className="text-light-text dark:text-dark-text">
                  {stats.roleStats?.[0]?.user_role || 'N/A'}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted">
                  Period
                </Typography>
                <Typography variant="h6" className="text-light-text dark:text-dark-text">
                  {stats.period || `${filters.days} days`}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
          <CardBody className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="User ID"
                value={localFilters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className: "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
              />
              <Select
                label="User Role"
                value={localFilters.userRole}
                onChange={(value) => handleFilterChange('userRole', value)}
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className: "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
                menuProps={{
                  className: "!bg-light-surface dark:!bg-dark-surface",
                }}
              >
                <Option value="">All Roles</Option>
                {USER_ROLES_VALUES.map((role) => (
                  <Option
                    key={role.value}
                    value={role.value}
                    className="text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
                  >
                    {role.label}
                  </Option>
                ))}
              </Select>
              <Select
                label="Operation"
                value={localFilters.operation}
                onChange={(value) => handleFilterChange('operation', value)}
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className: "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
                menuProps={{
                  className: "!bg-light-surface dark:!bg-dark-surface",
                }}
              >
                <Option value="">All Operations</Option>
                {CRUD_OPERATIONS.map((op) => (
                  <Option
                    key={op.value}
                    value={op.value}
                    className="text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
                  >
                    {op.label}
                  </Option>
                ))}
              </Select>
              <Select
                label="Time Period"
                value={localFilters.days.toString()}
                onChange={(value) => handleFilterChange('days', parseInt(value))}
                className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                labelProps={{
                  className: "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                }}
                menuProps={{
                  className: "!bg-light-surface dark:!bg-dark-surface",
                }}
              >
                {TIME_PERIODS.map((period) => (
                  <Option
                    key={period.value}
                    value={period.value}
                    className="text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
                  >
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


      {/* Audit Logs Table */}
      <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-6 !bg-light-surface dark:!bg-dark-surface"
        >
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Audit Logs
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pt-0 !bg-light-surface dark:!bg-dark-surface">
          <Table
            columns={columns}
            rows={logs}
          />
        </CardBody>
      </Card>

      {/* Log Details Modal */}
      <AuditLogDetailsModal
        open={showLogDetails}
        handleOpen={() => setShowLogDetails(!showLogDetails)}
        selectedLog={selectedLog}
      />
    </div>
  );
}

export default AdminsAudit;
