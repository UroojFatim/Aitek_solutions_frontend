import React, { useEffect, useState } from 'react';
import { getPipelines, getOpportunitiesByPipeline } from '@/services/ghl.service';
import { Select } from 'react-day-picker';
import { NoSymbolIcon } from '@heroicons/react/24/solid';
import { Typography } from '@material-tailwind/react';
import Table from '@/shared/components/table/Table';
import Spinner from '@/shared/components/spinner/spinner';
import toast from 'react-hot-toast';

const OpportunitiesList = () => {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [stages, setStages] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [uniqueSources, setUniqueSources] = useState([]);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const pipelinesData = await getPipelines();
        setPipelines(pipelinesData);
      } catch (error) {
        toast.error('Failed to fetch pipelines. Please try again later.');
      }
    };

    fetchPipelines();
  }, []);

  const fetchAllOpportunities = async (pipelineId) => {
    let allOpportunities = [];
    let lastOpportunity = null;
    let totalExpected = Infinity;

    while (allOpportunities.length < totalExpected) {
      const params = { limit: 100 };
      if (lastOpportunity) {
        params.startAfterId = lastOpportunity.id;
        params.startAfter = new Date(lastOpportunity.updatedAt).getTime();
      }

      const response = await getOpportunitiesByPipeline(pipelineId, params);
      const fetched = response.opportunities;

      if (!fetched.length) break;

      allOpportunities = [...allOpportunities, ...fetched];
      totalExpected = response.meta?.total || allOpportunities.length;
      lastOpportunity = fetched[fetched.length - 1];

      if (fetched.length < limit) break;
    }

    return allOpportunities;
  };

  //get data on every 3 seconds
  useEffect(() => {
    if (!selectedPipeline) return;

    const interval = setInterval(() => {
      fetchAllOpportunities(selectedPipeline).then((data) => {
        setOpportunities(data);
      });
    }, 3000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [selectedPipeline]);


  const handlePipelineChange = async (e) => {
    const pipelineId = e.target.value;
    setSelectedPipeline(pipelineId);
    setLoading(true);

    const selected = pipelines.find(p => p.id === pipelineId);
    if (selected) {
      setStages(selected.stages.filter(stage => stage.name !== "Migrated Contacts"));

      try {
        const allOpportunities = await fetchAllOpportunities(pipelineId);
        setOpportunities(allOpportunities);

        const sources = [...new Set(allOpportunities.map(o => o.source).filter(Boolean))];
        setUniqueSources(sources);
        setSelectedSource('');
      } catch (error) {
        toast.error('Unable to load opportunities for this pipeline.');
      }
    }

    setLoading(false);
  };

  const filteredOpportunities = selectedSource
    ? opportunities.filter(o => o.source === selectedSource)
    : opportunities;

  const groupedOpportunities = stages.map(stage => {
    const stageOpps = filteredOpportunities.filter(opp => opp.pipelineStageId === stage.id);
    const totalValue = stageOpps.reduce((sum, opp) => sum + (parseFloat(opp.monetaryValue || 0)), 0);

    return {
      ...stage,
      opportunities: stageOpps,
      totalValue,
      totalCount: stageOpps.length
    };
  });

  // Helpers (put near the top of OpportunitiesList.jsx)
  const Pill = ({ children }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      {children}
    </span>
  );

  const getField = (op, key) => op?.contact?.[key] ?? op?.[key] ?? null;

  const getTags = (op) => {
    const fromContact = op?.contact?.tags;
    const topLevel = op?.tags;
    const tags = Array.isArray(fromContact) ? fromContact : (Array.isArray(topLevel) ? topLevel : []);
    // Normalize: support string tags or object tags with { name }
    return tags.map(t => (typeof t === "string" ? t : (t?.name ?? "tag")));
  };

  const tableColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', render: (row) => getField(row, 'email') || 'N/A' },

    // NEW: Phone column
    {
      header: 'Phone',
      render: (row) => {
        const phone = getField(row, 'phone');
        return phone ? (
          <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
            {phone}
          </a>
        ) : 'N/A';
      },
    },

    // NEW: Tags column
    {
      header: 'Tags',
      render: (row) => {
        const tags = getTags(row);
        return tags.length ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((t, idx) => <Pill key={idx}>{t}</Pill>)}
          </div>
        ) : <span className="text-gray-400">No tags</span>;
      },
    },

    { header: 'Status', accessor: 'status' },

    // FIX: Use monetaryValue from your payload (not row.amount)
    {
      header: 'Amount',
      render: (row) => `$${parseFloat(row.monetaryValue || 0).toFixed(2)}`,
    },

    { header: 'Created', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—' },
    { header: 'Updated', render: (row) => row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '—' },
  ];

  return (
    <div className="p-3 lg:p-6 bg-light-background dark:bg-dark-background min-h-screen text-light-text dark:text-dark-text">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Active Accounts</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
        {/* Client Select */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="font-medium mb-1 text-sm sm:text-base">Select Client</label>
          <div className="relative w-full sm:w-60">
            <Select
              value={selectedPipeline || ""}
              onChange={handlePipelineChange}
              className="p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-text dark:text-dark-text w-full appearance-none"
            >
              <option value="" >Select Client</option>
              {pipelines.map((pipeline) => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
            </Select>
            {/* Custom arrow for consistent look */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </span>
          </div>
        </div>

        {/* Source Filter */}
        {uniqueSources.length > 0 && (
          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-medium mb-1 text-sm sm:text-base">Filter by Marketing Source</label>
            <div className="relative w-full sm:w-60">
              <Select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="p-2 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border w-full appearance-none"
              >
                <option value="">All Sources</option>
                {uniqueSources.map((source, index) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </Select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                ▼
              </span>
            </div>
          </div>
        )}
      </div>


      {/* Content */}
      {!selectedPipeline ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 mt-10 sm:mt-12 text-center">
          <NoSymbolIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-lg sm:text-xl">
            Select a GHL Account
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted mt-2 text-sm sm:text-base">
            Please choose an account from the dropdown above to view its pipeline and opportunities data.
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-xs sm:text-sm mt-1">
            These are your connected GoHighLevel accounts. Once selected, related opportunities will be displayed here.
          </Typography>
        </div>
      ) : loading ? (
        <Spinner />
      ) : (
        groupedOpportunities.map((stage) => (
          <div
            key={stage.id}
            className="mb-6 sm:mb-8 border border-light-border dark:border-dark-border rounded-lg p-4 sm:p-6 bg-light-surface dark:bg-dark-surface shadow overflow-x-hidden"
          >
            <h2 className="text-lg sm:text-xl font-semibold">{stage.name}</h2>
            <p className="text-light-muted dark:text-dark-muted mb-3 sm:mb-4 text-sm sm:text-base">
              {stage.totalCount} Opportunities — ${stage.totalValue.toFixed(2)}
            </p>

            {stage.opportunities.length > 0 ? (

              <Table columns={tableColumns} rows={stage.opportunities} />
            ) : (
              <p className="text-sm text-light-muted dark:text-dark-muted mt-2">
                No opportunities in this phase.
              </p>
            )}
          </div>
        ))
      )}
    </div>

  );
};

export default OpportunitiesList;
