import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

// Demo account user ID - demo firms are always visible to all users (read-only)
const DEMO_USER_ID = '45b175ff-37c1-4b75-a78e-fba01680dff2';

/**
 * useSupabaseData — replaces the localStorage layer in App.jsx.
 * Returns the same state shape: { firms: [...], assessments: {...} }
 * Plus CRUD functions that sync to Supabase.
 */
export function useSupabaseData() {
  const { user } = useAuth();
  const [state, setState] = useState({ firms: [], assessments: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceTimers = useRef({});

  // Load all firms and assessments for the current user
  const loadData = useCallback(async () => {
    if (!user) {
      setState({ firms: [], assessments: {} });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch firms
      const { data: firmsData, error: firmsError } = await supabase
        .from('firms')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.eq.${DEMO_USER_ID}`)
        .order('created_at', { ascending: false });

      if (firmsError) throw firmsError;

      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.eq.${DEMO_USER_ID}`)
        .order('created_at', { ascending: false });

      if (assessmentsError) throw assessmentsError;

      // Convert to the app's expected format
      const firms = firmsData.map(f => ({
        id: f.id,
        name: f.name,
        sector: f.sector,
        createdAt: f.created_at,
        isDemo: f.user_id === DEMO_USER_ID,
      }));

      const assessments = {};
      assessmentsData.forEach(a => {
        assessments[a.id] = {
          id: a.id,
          firmId: a.firm_id,
          createdAt: a.created_at,
          ratings: a.ratings || {},
          benchmarkProfile: a.benchmark_profile,
        };
      });

      setState({ firms, assessments });
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── CRUD Operations ──

  const createFirm = useCallback(async (firm) => {
    if (!user) return;

    const newFirm = {
      id: firm.id || crypto.randomUUID(),
      user_id: user.id,
      name: firm.name,
      sector: firm.sector,
    };

    // Optimistic update
    setState(s => ({
      ...s,
      firms: [...s.firms, { id: newFirm.id, name: newFirm.name, sector: newFirm.sector, createdAt: new Date().toISOString() }],
    }));

    const { error } = await supabase.from('firms').insert(newFirm);
    if (error) {
      console.error('Error creating firm:', error);
      // Rollback on error
      setState(s => ({ ...s, firms: s.firms.filter(f => f.id !== newFirm.id) }));
    }

    return newFirm.id;
  }, [user]);

  const deleteFirm = useCallback(async (id) => {
    if (!user) return;

    // Store for undo
    const firm = state.firms.find(f => f.id === id);
    const firmAssessments = {};
    Object.entries(state.assessments).forEach(([k, a]) => {
      if (a.firmId === id) firmAssessments[k] = a;
    });

    // Optimistic update
    setState(s => {
      const assessments = { ...s.assessments };
      Object.keys(assessments).forEach(k => { if (assessments[k].firmId === id) delete assessments[k]; });
      return { firms: s.firms.filter(f => f.id !== id), assessments };
    });

    // Supabase cascade deletes assessments via FK
    const { error } = await supabase.from('firms').delete().eq('id', id);
    if (error) {
      console.error('Error deleting firm:', error);
      // Rollback
      setState(s => ({
        firms: [...s.firms, firm],
        assessments: { ...s.assessments, ...firmAssessments },
      }));
    }

    return { firm, assessments: firmAssessments };
  }, [user, state]);

  const restoreFirm = useCallback(async (firm, assessments) => {
    if (!user || !firm) return;

    // Restore firm
    await supabase.from('firms').insert({
      id: firm.id,
      user_id: user.id,
      name: firm.name,
      sector: firm.sector,
    });

    // Restore assessments
    for (const [key, a] of Object.entries(assessments || {})) {
      await supabase.from('assessments').insert({
        id: a.id,
        firm_id: a.firmId,
        user_id: user.id,
        ratings: a.ratings,
        benchmark_profile: a.benchmarkProfile || 'Professional Services',
      });
    }

    // Optimistic update
    setState(s => ({
      firms: [...s.firms, firm],
      assessments: { ...s.assessments, ...assessments },
    }));
  }, [user]);

  const createAssessment = useCallback(async (firmId, templateRatings = {}) => {
    if (!user) return;

    const id = crypto.randomUUID();
    const ratings = {};
    Object.entries(templateRatings).forEach(([metricId, level]) => {
      ratings[metricId] = { level, updatedAt: new Date().toISOString() };
    });

    const newAssessment = {
      id,
      firm_id: firmId,
      user_id: user.id,
      ratings,
      benchmark_profile: 'Professional Services',
    };

    // Optimistic update
    setState(s => ({
      ...s,
      assessments: {
        ...s.assessments,
        [id]: { id, firmId, createdAt: new Date().toISOString(), ratings },
      },
    }));

    const { error } = await supabase.from('assessments').insert(newAssessment);
    if (error) {
      console.error('Error creating assessment:', error);
      setState(s => {
        const assessments = { ...s.assessments };
        delete assessments[id];
        return { ...s, assessments };
      });
    }

    return id;
  }, [user]);

  const deleteAssessment = useCallback(async (assessmentId) => {
    if (!user) return;

    const assessment = state.assessments[assessmentId];

    // Optimistic update
    setState(s => {
      const assessments = { ...s.assessments };
      delete assessments[assessmentId];
      return { ...s, assessments };
    });

    const { error } = await supabase.from('assessments').delete().eq('id', assessmentId);
    if (error) {
      console.error('Error deleting assessment:', error);
      // Rollback
      if (assessment) {
        setState(s => ({ ...s, assessments: { ...s.assessments, [assessmentId]: assessment } }));
      }
    }

    return assessment;
  }, [user, state]);

  const restoreAssessment = useCallback(async (assessment) => {
    if (!user || !assessment) return;

    await supabase.from('assessments').insert({
      id: assessment.id,
      firm_id: assessment.firmId,
      user_id: user.id,
      ratings: assessment.ratings,
      benchmark_profile: assessment.benchmarkProfile || 'Professional Services',
    });

    setState(s => ({
      ...s,
      assessments: { ...s.assessments, [assessment.id]: assessment },
    }));
  }, [user]);

  // Debounced update for ratings (saves to Supabase after 1s of inactivity)
  const updateRatings = useCallback((assessmentId, updater) => {
    setState(s => {
      const a = s.assessments[assessmentId];
      if (!a) return s;
      const newRatings = typeof updater === 'function' ? updater(a.ratings) : updater;
      return {
        ...s,
        assessments: {
          ...s.assessments,
          [assessmentId]: { ...a, ratings: newRatings },
        },
      };
    });

    // Debounce the Supabase write
    if (debounceTimers.current[assessmentId]) {
      clearTimeout(debounceTimers.current[assessmentId]);
    }
    debounceTimers.current[assessmentId] = setTimeout(async () => {
      // Get latest state
      const currentState = await new Promise(resolve => {
        setState(s => { resolve(s); return s; });
      });
      const assessment = currentState.assessments[assessmentId];
      if (!assessment) return;

      // Use JSONB merge to prevent overwriting metrics added outside the app
      // This merges the app's ratings INTO the existing ratings (existing keys preserved if not in update)
      const { error } = await supabase.rpc('merge_ratings', {
        p_assessment_id: assessmentId,
        p_new_ratings: assessment.ratings,
      });

      if (error) {
        console.error('Error saving ratings:', error);
        // Fallback to direct update if RPC not available
        if (error.message?.includes('function') || error.code === '42883') {
          const { error: fallbackError } = await supabase
            .from('assessments')
            .update({ ratings: assessment.ratings })
            .eq('id', assessmentId);
          if (fallbackError) {
            console.error('Fallback save also failed:', fallbackError);
          }
        }
      }
    }, 1000);
  }, [user, state]);

  return {
    state,
    setState, // for compatibility with existing App.jsx patterns
    loading,
    error,
    createFirm,
    deleteFirm,
    restoreFirm,
    createAssessment,
    deleteAssessment,
    restoreAssessment,
    updateRatings,
    reload: loadData,
  };
}
