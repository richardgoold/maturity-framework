import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export function useAdminData() {
  const { user, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [firms, setFirms] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [appConfig, setAppConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ââ Load all data ââââââââââââââââââââââââââââââââââââââââ
  const loadAll = useCallback(async () => {
    if (!user || !isAdmin) return;
    setLoading(true);
    setError(null);

    try {
      // Fetch all in parallel
      const [usersRes, firmsRes, assessmentsRes, contactsRes, auditRes, configRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('firms').select('*').order('created_at', { ascending: false }),
        supabase.from('assessments').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('app_config').select('*'),
      ]);

      if (usersRes.error) throw usersRes.error;
      if (firmsRes.error) throw firmsRes.error;
      if (assessmentsRes.error) throw assessmentsRes.error;
      if (contactsRes.error) throw contactsRes.error;
      // audit_log and app_config might not exist yet â graceful fallback

      // Show all users, firms, and assessments in admin views
      // Filter out demo firms and assessments (is_demo = true in DB)
      setUsers(usersRes.data || []);
      setFirms((firmsRes.data || []).filter(f => !f.is_demo));
      setAssessments((assessmentsRes.data || []).filter(a => !a.is_demo));
      setContacts(contactsRes.data || []);
      setAuditLog(auditRes.data || []);

      // Convert app_config rows to key-value object
      const config = {};
      (configRes.data || []).forEach(row => {
        config[row.key] = row.value;
      });
      setAppConfig(config);
    } catch (err) {
      console.error('Admin data load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ââ User management ââââââââââââââââââââââââââââââââââââââ
  const updateUserProfile = useCallback(async (userId, changes) => {
    const { error: err } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', userId);
    if (err) throw err;

    // Update local state
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...changes } : u));
    return true;
  }, []);

  const rejectUser = useCallback(async (userId) => {
    // Set approved to false and add a rejected status in details
    const { error: err } = await supabase
      .from('profiles')
      .update({ approved: false })
      .eq('id', userId);
    if (err) throw err;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved: false } : u));
    return true;

  }, []);

  const deleteUser = useCallback(async (userId) => {
    const { data, error: err } = await supabase.rpc('delete_user_completely', {
      target_user_id: userId
    });
    if (err) throw err;
    setUsers(prev => prev.filter(u => u.id !== userId));
    setFirms(prev => prev.filter(f => f.user_id !== userId));
    setAssessments(prev => prev.filter(a => {
      const firm = firms.find(f => f.id === a.firm_id);
      return !firm || firm.user_id !== userId;
    }));
    return true;
  }, [firms]);

  // ââ Assessment management ââââââââââââââââââââââââââââââââ
  const updateAssessmentRatings = useCallback(async (assessmentId, ratings) => {
    const { error: err } = await supabase
      .from('assessments')
      .update({ ratings })
      .eq('id', assessmentId);
    if (err) throw err;

    // Update local state
    setAssessments(prev => prev.map(a => a.id === assessmentId ? { ...a, ratings } : a));
    return true;
  }, []);

  // ââ Contact management âââââââââââââââââââââââââââââââââââ
  const markContactRead = useCallback(async (contactId) => {
    const { error: err } = await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', contactId);
    if (err) throw err;

    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, read: true } : c));
    return true;
  }, []);

  const markContactUnread = useCallback(async (contactId) => {
    const { error: err } = await supabase
      .from('contact_submissions')
      .update({ read: false })
      .eq('id', contactId);
    if (err) throw err;

    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, read: false } : c));
    return true;
  }, []);

  const deleteContact = useCallback(async (contactId) => {
    const { error: err } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', contactId);
    if (err) throw err;

    setContacts(prev => prev.filter(c => c.id !== contactId));
    return true;
  }, []);

  // ââ App config management ââââââââââââââââââââââââââââââââ
  const updateAppConfig = useCallback(async (key, value) => {
    // Try update first, then insert if no rows affected
    const { error: updateErr, count } = await supabase
      .from('app_config')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (updateErr) {
      // Try insert (upsert)
      const { error: insertErr } = await supabase
        .from('app_config')
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (insertErr) throw insertErr;
    }

    setAppConfig(prev => ({ ...prev, [key]: value }));
    return true;
  }, []);

  // ââ Audit logging ââââââââââââââââââââââââââââââââââââââââ
  const logAudit = useCallback(async ({ action, targetUserId, targetResource, targetResourceId, details }) => {
    if (!user) return;

    const entry = {
      admin_id: user.id,
      action,
      target_user_id: targetUserId || null,
      target_resource: targetResource || null,
      target_resource_id: targetResourceId || null,
      details: details || null,
    };

    const { data, error: err } = await supabase
      .from('audit_log')
      .insert(entry)
      .select()
      .single();

    if (err) {
      console.error('Audit log error:', err);
      return; // Don't throw â audit failure shouldn't block the action
    }

    // Prepend to local audit log
    if (data) {
      setAuditLog(prev => [data, ...prev]);
    }
  }, [user]);

  // ââ Computed helpers âââââââââââââââââââââââââââââââââââââ
  const getUserFirms = useCallback((userId) => {
    return firms.filter(f => f.user_id === userId);
  }, [firms]);

  const getUserAssessments = useCallback((userId) => {
    return assessments.filter(a => a.user_id === userId);
  }, [assessments]);

  const getFirmAssessments = useCallback((firmId) => {
    return assessments.filter(a => a.firm_id === firmId);
  }, [assessments]);

  const getAssessmentFirm = useCallback((assessment) => {
    return firms.find(f => f.id === assessment.firm_id);
  }, [firms]);

  const getAssessmentOwner = useCallback((assessment) => {
    return users.find(u => u.id === assessment.user_id);
  }, [users]);

  const getFirmOwner = useCallback((firm) => {
    return users.find(u => u.id === firm.user_id);
  }, [users]);

  const getContactUser = useCallback((contact) => {
    if (!contact.user_id) return null;
    return users.find(u => u.id === contact.user_id);
  }, [users]);

  // ââ Stats ââââââââââââââââââââââââââââââââââââââââââââââââ
  const stats = {
    totalUsers: users.length,
    freeUsers: users.filter(u => u.tier === 'free').length,
    premiumUsers: users.filter(u => u.tier === 'premium').length,
    pendingApprovals: users.filter(u => !u.approved).length,
    totalFirms: firms.length,
    totalAssessments: assessments.length,
    unreadContacts: contacts.filter(c => !c.read).length,
    totalContacts: contacts.length,
  };

  // ââ Update last_active_at for admin ââââââââââââââââââââââ
  useEffect(() => {
    if (user && isAdmin) {
      supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', user.id)
        .then(() => {});
    }
  }, [user, isAdmin]);

  return {
    // Data
    users,
    firms,
    assessments,
    contacts,
    auditLog,
    appConfig,
    stats,
    loading,
    error,

    // Actions
    updateUserProfile,
    rejectUser,
    deleteUser,
    updateAssessmentRatings,
    markContactRead,
    markContactUnread,
    deleteContact,
    updateAppConfig,
    logAudit,
    reload: loadAll,

    // Helpers
    getUserFirms,
    getUserAssessments,
    getFirmAssessments,
    getAssessmentFirm,
    getAssessmentOwner,
    getFirmOwner,
    getContactUser,
  };
}
