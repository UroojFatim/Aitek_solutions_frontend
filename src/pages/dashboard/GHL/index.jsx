// src/pages/dashboard/GhlUserPipelines.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGhlOpportunitiesByPipelineId,
  fetchGhlPipelines,
  silentlyFetchGhlOpportunitiesByPipelineId
} from "@/redux/actions/ghl.actions";
import { getBusinessPipelinesByBusinessId } from "@/redux/actions/ghl_business.actions";
import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import GhlOpportunities from "./components/GhlOpportunities";
import CreateOpportunityModal from "./components/CreateOpportunityModal";
import { NoSymbolIcon } from "@heroicons/react/24/solid";

const DEFAULT_LOCATION_ID = "1GUw2okV7aCJ4cJdBU8m";

const GhlUserPipelines = () => {
  const dispatch = useDispatch();

  // ---- Business & auth state ----
  const { businessDetails } = useSelector((state) => state.business);
  const authUser = useSelector((state) => state.auth?.user);

  const {
    businessPipelines = { pipelines: [] },
    error: businessPipelinesError,
  } = useSelector(
    (state) =>
      state.ghl_business ?? {
        businessPipelines: { pipelines: [] },
        error: null,
      }
  );

  const isUserAssignedToBusiness = businessDetails?.users?.some(
    (user) => user.id === authUser?.id
  );

  // ---- GHL state ----
  const ghlState = useSelector(
    (state) => state?.ghl ?? { pipelines: [], opportunities: [], error: null }
  );
  const pipelines = ghlState?.pipelines ?? ghlState?.list ?? [];
  const opportunities = ghlState?.opportunities ?? [];
  const ghlError = ghlState?.error ?? null;

  const [selectedPipelineId, setSelectedPipelineId] = useState("");
  const [showCreateOpp, setShowCreateOpp] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // ---- Allowed business pipeline IDs ----
  const businessPipelineIds = useMemo(
    () =>
      businessPipelines?.pipelines?.map((p) => p.ghl_pipeline_id) ?? [],
    [businessPipelines]
  );

  // ---- Fetch business pipelines for this business ----
  useEffect(() => {
    const businessId = businessDetails?.id;
    if (businessId) {
      dispatch(getBusinessPipelinesByBusinessId(businessId));
    }
  }, [businessDetails?.id, dispatch]);

  // ---- Fetch all GHL pipelines for the location ----
  useEffect(() => {
    dispatch(fetchGhlPipelines(DEFAULT_LOCATION_ID));
  }, [dispatch]);

  // ---- Filter GHL pipelines by business mapping ----
  const filteredPipelines = useMemo(() => {
    if (!businessPipelineIds.length) return [];
    return pipelines.filter((p) => businessPipelineIds.includes(p.id));
  }, [pipelines, businessPipelineIds]);

  const hasPipelines = filteredPipelines.length > 0;

  // ---- Fetch opportunities when selected pipeline changes ----
  // useEffect(() => {
  //   if (selectedPipelineId) {
  //     dispatch(
  //       fetchGhlOpportunitiesByPipelineId({
  //         locationId: DEFAULT_LOCATION_ID,
  //         pipelineId: selectedPipelineId,
  //       })
  //     );
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
    () =>
      filteredPipelines.find((p) => p.id === selectedPipelineId) || null,
    [filteredPipelines, selectedPipelineId]
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

  const error = ghlError || businessPipelinesError;

  return (
    <div className="min-h-screen p-6 space-y-6 bg-light-background dark:bg-dark-background transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography
          variant="h4"
          className="font-semibold text-light-text dark:text-dark-text"
        >
          Active Accounts
        </Typography>
      </div>

      {/* Info: user not assigned to this business */}
      {!isUserAssignedToBusiness && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-200">
          You are not assigned to this business. Pipelines may be restricted.
        </div>
      )}

      {/* Pipeline selector + summary */}
      {!error && hasPipelines && (
        <Card className="shadow-sm border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface transition-colors">
          <CardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <Select
                label="Select pipeline"
                value={selectedPipelineId || ""}
                onChange={(value) => setSelectedPipelineId(value)}
                className="max-w-xs text-light-text dark:text-dark-text"
                labelProps={{
                  className:
                    "text-light-muted dark:text-dark-muted peer-focus:text-primary",
                }}
                menuProps={{
                  className:
                    "bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text",
                }}
              >
                {filteredPipelines.map((pipeline) => (
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
                  Business Pipelines
                </Typography>
                <Typography className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {filteredPipelines.length}
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
                  {selectedPipeline?.name || "-"}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      )}


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

      {/* When there ARE pipelines but none is selected */}
      {!error && hasPipelines && !selectedPipeline && (
        <div className="flex flex-col items-center justify-center p-8 mt-12 dark:bg-dark-surface bg-light-surface border-2 dark:border-dark-border rounded-xl ">
          <NoSymbolIcon className="w-16 h-16 text-gray-400 mb-4" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
            Select an Account
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
            Please choose an account from the dropdown above to view its details.
          </Typography>
          <Typography className="text-sm text-light-muted dark:text-dark-muted text-center mt-1">
            These are your connected lead accounts. Once selected, related opportunities will be displayed here.
          </Typography>
        </div>
      )}

      {/* When there are NO pipelines at all */}
      {!error && !hasPipelines && (
        <div className="flex flex-col items-center justify-center p-8 mt-12 dark:bg-dark-surface bg-light-surface border-2 dark:border-dark-border rounded-xl ">
          <NoSymbolIcon className="w-16 h-16 text-gray-400 mb-4" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
            There are no leads to display yet.
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
            Your lead feed will appear here as soon as new inquiries come in. If you have any questions, please contact your account manager.
          </Typography>
        </div>
      )}

      <CreateOpportunityModal
        isOpen={showCreateOpp}
        onClose={() => {
          setShowCreateOpp(false);
          setEditingOpportunity(null);      // 👈 reset edit state
        }}
        onCreated={(opp) => {
          console.log("Created opportunity", opp);
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

export default GhlUserPipelines;
