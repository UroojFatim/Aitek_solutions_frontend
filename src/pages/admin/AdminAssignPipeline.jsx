import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllBusinesses,
  getAllPipelines,
  assignPipelineToBusiness,
  getAssignedPipelines,
  deletePipeline,
} from '@/redux/actions/ghl_business.actions';
import { toast } from 'react-hot-toast';
import { Button, Typography } from '@material-tailwind/react';
import { Select } from '@/shared/components/form';
import { Table } from '@/shared/components/table';

const AdminAssignPipeline = () => {
  const dispatch = useDispatch();
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [showAssignments, setShowAssignments] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {
    businesses = [],
    pipelines = [],
    error,
    assignedPipelines = [],
  } = useSelector((state) => state.ghl_business);

  useEffect(() => {
    dispatch(getAllBusinesses());
    dispatch(getAllPipelines());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`${error}`);
    }
  }, [error]);

  const handleAssign = () => {
    if (!selectedBusiness || !selectedPipeline) {
      toast.error('Please select both Business and pipeline.');
      return;
    }

    dispatch(
      assignPipelineToBusiness({
        business_id: selectedBusiness,
        pipeline_id: selectedPipeline,
        callback: () => {
          toast.success('Pipeline successfully assigned to business!');
          setSelectedBusiness('');
          setSelectedPipeline('');


          dispatch(getAssignedPipelines());
        },
      })
    )
      .unwrap()
      .catch(() => {
        toast.error('Failed to assign pipeline.');
      });
  };


  const handleToggleAssignments = () => {
    if (!showAssignments) {
      dispatch(getAssignedPipelines());
    }
    setShowAssignments(!showAssignments);
  }

  const handleDeletePipeline = async (assignedPipelines) => {
    const confirmed = window.confirm(`Are you sure you want to delete the pipeline "${assignedPipelines.business.name}"?`);
    if (!confirmed) return;
    try {
      await dispatch(deletePipeline(assignedPipelines.id));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      dispatch(getAssignedPipelines());
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const transformedRows = assignedPipelines.map((item) => ({
  ...item,
  businessName: item.business?.name,
  businessEmail: item.business?.email,
  pipelineName: item.pipeline?.name,
  assignedAt: item.assigned_at
    ? new Date(item.assigned_at).toLocaleString()
    : "N/A",
}));



const columns = [
  { header: "Business Name", accessor: "businessName" },
  { header: "Email", accessor: "businessEmail" },
  { header: "Pipeline Name", accessor: "pipelineName" },
  { header: "Assigned At", accessor: "assignedAt" },
  {
    header: "Actions",
    render: (row) => (
      <Button
        onClick={() => handleDeletePipeline(row)}
        className="transition px-3 py-1 rounded bg-primary text-white hover:bg-red-700"
      >
        Delete
      </Button>
    ),
  },
];


  return (
   <div className="min-h-screen bg-light-background dark:bg-dark-background py-10 px-4">
  <div className="flex flex-col gap-6 max-w-2xl mx-auto p-6 rounded-2xl shadow-lg bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text border border-light-border dark:border-dark-border">
    <Typography variant="h2" className="text-light-text dark:text-dark-text text-center text-2xl md:text-3xl font-bold">
      Assign Pipeline to Business
    </Typography>

    {/* Business Dropdown */}
    <Select
      name="selectedBusiness"
      label="Select Business"
      value={selectedBusiness}
      options={businesses.map((business) => ({
        value: business?.id,
        label: business?.name
      }))}
      onChange={(val) => setSelectedBusiness(val)}
      className="w-full"
    />

    {/* Pipeline Dropdown */}
    <Select
      name="selectedPipeline"
      label="Select Pipeline"
      value={selectedPipeline}
      options={pipelines.map((pipeline) => ({
        value: pipeline?.id,
        label: pipeline?.name
      }))}
      onChange={(val) => setSelectedPipeline(val)}
      className="w-full"
    />

    {/* Assign Button */}
    <Button
      onClick={handleAssign}
      className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors duration-200 shadow-md"
    >
      Assign Pipeline
    </Button>
  </div>

  <div className="p-6 rounded-2xl shadow-lg bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text border border-light-border dark:border-dark-border mt-6">
    {/* Toggle Assignments Button */}
    <div className="flex items-center justify-between mb-3">
      <Typography variant="h6" className="text-sm font-semibold">Assigned Pipelines</Typography>
      <button
        onClick={handleToggleAssignments}
        className="text-sm px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
      >
        {showAssignments ? 'Hide' : 'Show'}
      </button>
    </div>

    {/* Assignments List */}
    {showAssignments && (
      <div className="mt-3">
        <Table columns={columns} rows={transformedRows} />
      </div>
    )}
  </div>

  {showToast && (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
      Pipeline successfully deleted!
    </div>
  )}
</div>

  );
};

export default AdminAssignPipeline;
