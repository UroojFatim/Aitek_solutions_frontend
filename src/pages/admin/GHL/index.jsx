// src/pages/dashboard/GhlPipelines.jsx
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGhlOpportunitiesByPipelineId, fetchGhlPipelines, silentlyFetchGhlOpportunitiesByPipelineId
} from '@/redux/actions/ghl.actions';
import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
} from '@material-tailwind/react';
import GhlOpportunities from './components/GhlOpportunities';
import CreateOpportunityModal from './components/CreateOpportunityModal';

const DEFAULT_LOCATION_ID = '1GUw2okV7aCJ4cJdBU8m';

const GhlPipelines = () => {
  const dispatch = useDispatch();

  const ghlState = useSelector(
    (state) => state?.ghl ?? { pipelines: [], opportunities: [], error: null }
  );
  const pipelines = ghlState?.pipelines ?? ghlState?.list ?? [];
  const opportunities = ghlState?.opportunities ?? [];
  const error = ghlState?.error ?? null;

  const [selectedPipelineId, setSelectedPipelineId] = useState('');
  const [showCreateOpp, setShowCreateOpp] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);


  useEffect(() => {
    dispatch(fetchGhlPipelines(DEFAULT_LOCATION_ID));
  }, [dispatch]);

  useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  // useEffect(() => {
  //   if (selectedPipelineId) {
  //     dispatch(fetchGhlOpportunitiesByPipelineId({
  //       locationId: DEFAULT_LOCATION_ID,
  //       pipelineId: selectedPipelineId
  //     }));
  //   }
  // }, [selectedPipelineId, dispatch]);
  useEffect(() => {
    if (!selectedPipelineId) return;

    const interval = setInterval(() => {
      dispatch(
        silentlyFetchGhlOpportunitiesByPipelineId({
          locationId: DEFAULT_LOCATION_ID,
          pipelineId: selectedPipelineId,
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedPipelineId, dispatch]);

  const selectedPipeline = useMemo(
    () => pipelines.find((p) => p.id === selectedPipelineId) || null,
    [pipelines, selectedPipelineId]
  );

  // group opportunities by pipeline stage id (pipelineStageId or pipelineStageUId)
  const opportunitiesByStage = useMemo(() => {
    if (!selectedPipeline) return {};
    const map = {};
    selectedPipeline.stages?.forEach((s) => (map[s.id] = []));
    opportunities.forEach((opp) => {
      const stageId = opp.pipelineStageId || opp.pipelineStageUId || null;
      if (stageId && map[stageId]) {
        map[stageId].push(opp);
      }
    });
    return map;
  }, [selectedPipeline, opportunities]);

  const handleOpportunityUpdated = () => {
    if (!selectedPipelineId) return;
    dispatch(
      fetchGhlOpportunitiesByPipelineId({
        locationId: DEFAULT_LOCATION_ID,
        pipelineId: selectedPipelineId,
      })
    );
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-light-background dark:bg-dark-background transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography
            variant="h4"
            className="font-semibold text-light-text dark:text-dark-text"
          >
            Active Accounts
          </Typography>
        </div>
      </div>

      {/* Pipeline selector + summary */}
      <Card className="shadow-sm border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface transition-colors">
        <CardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Select
              label="Select pipeline"
              value={selectedPipelineId || ''}
              onChange={(value) => setSelectedPipelineId(value)}
              className="max-w-xs text-light-text dark:text-dark-text"
              labelProps={{
                className:
                  'text-light-muted dark:text-dark-muted peer-focus:text-primary',
              }}
              menuProps={{
                className:
                  'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text',
              }}
            >
              {pipelines.map((pipeline) => (
                <Option
                  key={pipeline.id}
                  value={pipeline.id}
                  className="text-light-text dark:text-dark-text"
                >
                  {pipeline.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <Typography
                variant="small"
                className="text-[10px] font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted"
              >
                Total Pipelines
              </Typography>
              <Typography className="text-lg font-semibold text-light-text dark:text-dark-text">
                {pipelines.length}
              </Typography>
            </div>

            <div>
              <Typography
                variant="small"
                className="text-[10px] font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted"
              >
                Stages in Selected
              </Typography>
              <Typography className="text-lg font-semibold text-light-text dark:text-dark-text">
                {selectedPipeline?.stages?.length || 0}
              </Typography>
            </div>

            <div>
              <Typography
                variant="small"
                className="text-[10px] font-semibold uppercase tracking-wide text-light-muted dark:text-dark-muted"
              >
                Selected Pipeline
              </Typography>
              <Typography className="text-sm font-medium text-light-text dark:text-dark-text truncate max-w-[180px]">
                {selectedPipeline?.name || '-'}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
          {error}
        </div>
      )}

      {/* Pipelines content */}
      {!error && selectedPipeline && (
        <Card className="shadow-sm border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface transition-colors">
          <CardBody>
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <Typography
                  variant="h6"
                  className="text-light-text dark:text-dark-text"
                >
                  {selectedPipeline.name}
                </Typography>
              </div>

              <button
                onClick={() => {
                  setEditingOpportunity(null); // create mode
                  setShowCreateOpp(true);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 ..."
              >
                Add opportunity
              </button>

            </div>

            <GhlOpportunities
              opportunitiesByStage={opportunitiesByStage}
              selectedPipeline={selectedPipeline}
              onOpportunityUpdated={handleOpportunityUpdated}
              onEditOpportunity={(opp) => {
                setEditingOpportunity(opp);    // 👈 put opp in state
                setShowCreateOpp(true);        // open modal in edit mode
              }}
            />
          </CardBody>
        </Card>
      )}

      {!error && !selectedPipeline && (
        <Typography className="text-sm text-light-muted dark:text-dark-muted">
          No pipelines found.
        </Typography>
      )}

      <CreateOpportunityModal
        isOpen={showCreateOpp}
        onClose={() => {
          setShowCreateOpp(false);
          setEditingOpportunity(null);      // 👈 reset edit state
        }}
        onCreated={(opp) => {
          handleOpportunityUpdated();       // still keep this
        }}
        onUpdated={(opp) => {
          handleOpportunityUpdated();       // and this
        }}
        initialOpportunity={editingOpportunity}
        selectedPipelineIdFromParent={selectedPipelineId}   // 👈 NEW
      />

    </div>
  );
};

export default GhlPipelines;
