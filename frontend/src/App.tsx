import { useEffect, useRef, useState } from 'react';
import { X, Loader2, RotateCcw, Flame, Cpu, Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/LandingPage';
import { AuthModal } from '@/components/AuthModal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { PromptInput } from '@/components/PromptInput';
import { FileUploadZone } from '@/components/FileUploadZone';
import { OutputFormatSelector } from '@/components/OutputFormatSelector';
import { GenerationParams } from '@/components/GenerationParams';
import { ProgressPanel } from '@/components/ProgressPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { OutputModal } from '@/components/OutputModal';
import { Button } from '@/components/ui/button';
import { generateContent, downloadAllFiles } from '@/lib/api';
import { fetchCurrentUser, logoutUser } from '@/lib/authApi';
import { getStoredToken, getStoredUser } from '@/lib/authApi';
import type {
  OutputFormat, GenerationState, ProgressEvent as PEvt, ResultEvent
} from '@/types';
import type { UserProfile } from '@/types/auth';

const INITIAL_STATE: GenerationState = {
  status: 'idle',
  progress: null,
  results: {},
  error: null,
};

type AppView = 'landing' | 'studio' | 'dashboard';

function App() {
  // ─── Authentication State ────────────────────────────────────────────────
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'login'>('login');
  const [activeView, setActiveView] = useState<AppView>('landing');

  // ─── Form State ─────────────────────────────────────────────────────────
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedOutputs, setSelectedOutputs] = useState<OutputFormat[]>([
    'linkedin', 'executive_summary', 'presentation'
  ]);
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState('General');
  const [detailLevel, setDetailLevel] = useState('Standard');

  // ─── Generation State ───────────────────────────────────────────────────
  const [genState, setGenState] = useState<GenerationState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  // ─── Deliverable View & Revision Modal State ────────────────────────────
  const [activeModalOutput, setActiveModalOutput] = useState<OutputFormat | null>(null);
  const [versionHistory, setVersionHistory] = useState<Partial<Record<OutputFormat, ResultEvent[]>>>({});
  const [isRevising, setIsRevising] = useState(false);
  const [revisionError, setRevisionError] = useState<string | null>(null);

  // ─── On Mount: Restore Session ──────────────────────────────────────────
  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
      setActiveView('studio');
      // Silently refresh session data in background
      fetchCurrentUser().then((fresh) => {
        if (fresh) setUser(fresh);
      }).catch(() => {});
    }
    setAuthChecked(true);
  }, []);

  // ─── Auth Handlers ───────────────────────────────────────────────────────
  const handleAuthSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
    setActiveView('studio');
  };

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    setActiveView('landing');
    setGenState(INITIAL_STATE);
  };

  const handleOpenAuth = (mode: 'signin' | 'login' = 'login') => {
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  const handleSwitchView = (view: AppView) => {
    if ((view === 'studio' || view === 'dashboard') && !user) {
      handleOpenAuth('login');
      return;
    }
    setActiveView(view);
  };

  // ─── Generation Handlers ─────────────────────────────────────────────────
  const isGenerating = genState.status === 'generating';
  const canGenerate =
    !isGenerating &&
    selectedOutputs.length > 0 &&
    (prompt.trim().length > 0 || files.length > 0);

  const toggleOutput = (id: OutputFormat) => {
    setSelectedOutputs((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleParamChange = (field: string, value: string) => {
    if (field === 'language') setLanguage(value);
    else if (field === 'tone') setTone(value);
    else if (field === 'target_audience') setTargetAudience(value);
    else if (field === 'detail_level') setDetailLevel(value);
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('outputs', JSON.stringify(selectedOutputs));
    formData.append('language', language);
    formData.append('tone', tone);
    formData.append('target_audience', targetAudience);
    formData.append('detail_level', detailLevel);
    files.forEach((f) => formData.append('files', f));

    const controller = new AbortController();
    abortRef.current = controller;
    setGenState({ status: 'generating', progress: null, results: {}, error: null });

    await generateContent(formData, {
      onProgress: (event: PEvt) => {
        setGenState((prev) => ({ ...prev, progress: event }));
      },
      onResult: (event: ResultEvent) => {
        setGenState((prev) => ({
          ...prev,
          results: { ...prev.results, [event.output_type]: event },
        }));
      },
      onDone: () => {
        setGenState((prev) => ({ ...prev, status: 'complete' }));
      },
      onError: (message: string) => {
        setGenState((prev) => ({ ...prev, status: 'error', error: message }));
      },
    }, controller.signal);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setGenState((prev) => ({ ...prev, status: 'idle' }));
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setGenState(INITIAL_STATE);
  };

  const handleReviseOutput = async (outputType: OutputFormat, revisionPrompt: string) => {
    setIsRevising(true);
    setRevisionError(null);
    const currentResult = genState.results[outputType];
    if (currentResult) {
      setVersionHistory((prev) => ({
        ...prev,
        [outputType]: [...(prev[outputType] || []), currentResult],
      }));
    }
    try {
      const formData = new FormData();
      const contextualPrompt = `[Revision Request for ${outputType.toUpperCase()}]
Original Deliverable Content:
${currentResult?.content ?? ''}

User Feedback & Requested Modifications:
${revisionPrompt}

Original Objective:
${prompt || 'Deliverable refinement'}`;

      formData.append('prompt', contextualPrompt);
      formData.append('outputs', JSON.stringify([outputType]));
      formData.append('language', language);
      formData.append('tone', tone);
      formData.append('target_audience', targetAudience);
      formData.append('detail_level', detailLevel);
      files.forEach((f) => formData.append('files', f));

      await generateContent(formData, {
        onResult: (event: ResultEvent) => {
          if (event.output_type === outputType) {
            setGenState((prev) => ({
              ...prev,
              results: { ...prev.results, [outputType]: event },
            }));
          }
        },
        onError: (errMsg: string) => {
          setRevisionError(errMsg);
        },
      });
    } catch (err: unknown) {
      setRevisionError(err instanceof Error ? err.message : 'Failed to revise deliverable.');
    } finally {
      setIsRevising(false);
    }
  };

  const showResults =
    genState.status === 'complete' || Object.keys(genState.results).length > 0;

  // ─── Show loading skeleton until session is checked ──────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030604]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#00D084] flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-[#00D084]" />
          </div>
          <span className="text-xs text-gray-400 font-serif tracking-wider">Verifying Session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030604] text-gray-100 font-serif">
      {/* ─── UNIFIED NAVBAR (auth-aware, view-aware) ──────────────────── */}
      <Header
        user={user}
        activeView={activeView}
        onOpenAuth={handleOpenAuth}
        onSwitchView={handleSwitchView}
        onSignOut={handleSignOut}
      />

      {/* ─── LANDING PAGE (public, unauthenticated) ────────────────────── */}
      {activeView === 'landing' && (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          isAuthenticated={!!user}
          onEnterStudio={() => setActiveView('studio')}
        />
      )}

      {/* ─── ADMIN / OPERATIONS DASHBOARD ─────────────────────────────── */}
      {activeView === 'dashboard' && user && (
        <AdminDashboard
          user={user}
          onSwitchToStudio={() => setActiveView('studio')}
          onSignOut={handleSignOut}
        />
      )}

      {/* ─── AVYRA GENERATION STUDIO (protected) ──────────────────────── */}
      {activeView === 'studio' && user && (
        <>
          {/* Workspace Header Bar */}
          <div className="border-b border-[#142B1F] bg-[#020503]/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif">
                  Avyra Autonomous Studio
                </h2>
                <p className="text-sm text-gray-400 mt-1 font-serif">
                  Provide your input prompt or source documents below to trigger multi-modal synthesis.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-sm bg-[#00D084]/15 border border-[#00D084]/30 text-[#00D084] font-serif text-xs font-semibold">
                  8 PIPELINES READY
                </span>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* SECTION A: INPUT INGESTION & SYNTHESIS CONTROLS               */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section id="input-workspace" className="border-b border-[#142B1F] bg-[#020503] py-10 font-serif">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#142B1F]">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#00D084]" />
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-serif">
                    1. Input Sources & Autonomous Synthesis Configuration
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  Ready to Ingest
                </span>
              </div>

              {/* Source Content Panel */}
              <div className="p-5 sm:p-6 rounded-md bg-[#040906] border border-[#142B1F] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 font-serif tracking-wide">
                    <span>Source Prompt Context & Document Knowledge Base</span>
                  </label>
                  <span className="text-[10px] font-serif text-[#00D084] px-2 py-0.5 rounded-sm bg-[#00D084]/10 border border-[#00D084]/20">
                    MULTI-MODAL INGESTION
                  </span>
                </div>

                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  disabled={isGenerating}
                />

                <div className="pt-1">
                  <FileUploadZone
                    files={files}
                    onFilesChange={setFiles}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Output Format Selection with Small Checkbox Grid */}
              <div className="p-5 rounded-md bg-[#040906] border border-[#142B1F] space-y-4">
                <OutputFormatSelector
                  selected={selectedOutputs}
                  onToggle={toggleOutput}
                  disabled={isGenerating}
                />
              </div>

              {/* Generation Parameters */}
              <div className="p-5 rounded-md bg-[#040906] border border-[#142B1F] space-y-4">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 font-serif tracking-wide">
                  <Zap className="w-4 h-4 text-[#00D084]" />
                  <span>Autonomous Model Parameters</span>
                </label>
                <GenerationParams
                  language={language}
                  tone={tone}
                  targetAudience={targetAudience}
                  detailLevel={detailLevel}
                  onChange={handleParamChange}
                  disabled={isGenerating}
                />
              </div>

              {/* Execution Controls */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                {isGenerating ? (
                  <>
                    <Button
                      onClick={handleStop}
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2 font-serif rounded-md border-white/20 bg-black/40 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4 text-red-400" />
                      Abort Execution
                    </Button>
                    <Button
                      size="lg"
                      disabled
                      className="flex-1 gap-2.5 font-serif text-sm bg-[#06150D] border border-[#00D084]/40 text-white rounded-md"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-[#00D084]" />
                      Synthesizing Deliverables in Parallel…
                    </Button>
                  </>
                ) : (
                  <>
                    {genState.status !== 'idle' && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        className="gap-2 font-serif text-xs px-5 border-[#142B1F] rounded-md bg-[#040906] text-gray-300"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </Button>
                    )}
                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className="flex-1 py-3.5 px-6 rounded-md bg-[#00D084] hover:bg-[#05E594] text-black font-bold text-sm sm:text-base font-serif tracking-tight transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    >
                      <Zap className="w-4 h-4 text-black fill-black" />
                      Execute Avyra Synthesis
                      {selectedOutputs.length > 0 && (
                        <span className="px-2 py-0.5 rounded-sm bg-black/20 text-xs text-black border border-black/20">
                          {selectedOutputs.length} Format{selectedOutputs.length > 1 ? 's' : ''} Selected
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* SECTION B: DEDICATED DARK GREEN OUTPUT & DELIVERABLE WORKSPACE */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section id="output-workspace" className="py-12 bg-[#020D06] border-b border-[#143D23] font-serif">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#173F25]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#00D084]" />
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-serif">
                    2. Synthesized Deliverables & Live Output Previews
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#00D084] bg-[#00D084]/15 px-2.5 py-1 rounded-sm border border-[#00D084]/30">
                  {showResults ? `${Object.keys(genState.results).length} READY` : isGenerating ? 'PROCESSING' : 'STANDBY'}
                </span>
              </div>

              {/* Standby State */}
              {genState.status === 'idle' && !showResults && (
                <div className="rounded-md border border-[#173F25] bg-[#04140A] p-8 sm:p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-md bg-[#00D084]/20 border border-[#00D084]/40 flex items-center justify-center mx-auto text-[#00D084]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white tracking-wide">
                      Neural Deliverable Grid Awaiting Execution
                    </h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Select your target outputs above and click Execute. Synthesized deliverables will populate here side-by-side with full instant previews, download options, and one-click AI revisions.
                    </p>
                  </div>
                </div>
              )}

              {/* Active Pipeline Progress */}
              {isGenerating && (
                <div className="p-6 rounded-md border border-[#173F25] bg-[#04140A]">
                  <ProgressPanel
                    progress={genState.progress}
                    completedResults={genState.results}
                    selectedOutputs={selectedOutputs}
                  />
                </div>
              )}

              {/* Side-by-Side Results Showcase */}
              {showResults && (
                <div className="space-y-6">
                  <ResultsPanel
                    results={genState.results}
                    onDownloadAll={() => downloadAllFiles(genState.results)}
                    onView={(type) => setActiveModalOutput(type)}
                  />
                </div>
              )}
            </div>
          </section>

          <Footer />
        </>
      )}

      {/* ─── AUTH MODAL ─────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* ─── DELIVERABLE VIEW & REVISION MODAL ──────────────────────────── */}
      <OutputModal
        isOpen={activeModalOutput !== null}
        outputType={activeModalOutput}
        currentResult={activeModalOutput ? genState.results[activeModalOutput] ?? null : null}
        history={activeModalOutput ? versionHistory[activeModalOutput] ?? [] : []}
        isRevising={isRevising}
        revisionError={revisionError}
        onClose={() => {
          setActiveModalOutput(null);
          setRevisionError(null);
        }}
        onRevise={handleReviseOutput}
      />
    </div>
  );
}

export default App;
