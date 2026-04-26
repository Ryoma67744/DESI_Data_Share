/* viewer/supabase-client.js
 * Thin fetch-based wrapper around the Supabase RPCs defined in
 * supabase/schema.sql. Exposes a single global `window.SupabaseClient`.
 *
 * The anon key is intentionally embedded in the page; the database has
 * RLS on every table and all access goes through SECURITY DEFINER RPCs
 * that validate a session token issued by `unlock_project`.
 */
(() => {
  'use strict';

  const URL_  = 'https://lwcwkjnffuelnouzrlse.supabase.co';
  const ANON  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3dram5mZnVlbG5vdXpybHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk5MzIsImV4cCI6MjA5Mjc5NTkzMn0.SvDW9JzYmrn4H_HRmpIeeXXVNysbmuC3kETDDaq-fEY';

  const SLUG = (new URLSearchParams(location.search)).get('project') || 'cor_slide_1_10';

  const SS_TOKEN   = `atlas:${SLUG}:token`;
  const SS_ROLE    = `atlas:${SLUG}:role`;
  const SS_EXPIRES = `atlas:${SLUG}:expires`;
  const LS_NAME    = `atlas:displayName`;

  async function rpc(fn, body) {
    const res = await fetch(`${URL_}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        'apikey': ANON,
        'Authorization': `Bearer ${ANON}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });
    let data = null;
    try { data = await res.json(); } catch (_) { /* non-JSON */ }
    if (!res.ok) {
      const msg = (data && (data.message || data.hint)) || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.code   = data && data.code;
      throw err;
    }
    return data;
  }

  function getToken() {
    const t = sessionStorage.getItem(SS_TOKEN);
    const exp = sessionStorage.getItem(SS_EXPIRES);
    if (!t || !exp) return null;
    if (new Date(exp).getTime() <= Date.now()) {
      logout();
      return null;
    }
    return t;
  }

  function getRole()    { return sessionStorage.getItem(SS_ROLE) || null; }
  function isAdmin()    { return getRole() === 'admin'; }
  function getDisplayName() { return localStorage.getItem(LS_NAME) || ''; }
  function setDisplayName(name) {
    const v = (name || '').trim();
    if (v) localStorage.setItem(LS_NAME, v);
    else   localStorage.removeItem(LS_NAME);
  }
  function isAuthenticated() { return !!getToken(); }

  function logout() {
    sessionStorage.removeItem(SS_TOKEN);
    sessionStorage.removeItem(SS_ROLE);
    sessionStorage.removeItem(SS_EXPIRES);
  }

  async function unlock(password) {
    const rows = await rpc('unlock_project', { p_slug: SLUG, p_password: password });
    const row  = Array.isArray(rows) ? rows[0] : rows;
    if (!row || !row.token) throw new Error('unlock_project returned no token');
    sessionStorage.setItem(SS_TOKEN,   row.token);
    sessionStorage.setItem(SS_ROLE,    row.role);
    sessionStorage.setItem(SS_EXPIRES, row.expires_at);
    return row;
  }

  function tokenOrThrow() {
    const t = getToken();
    if (!t) throw new Error('not authenticated');
    return t;
  }

  async function getProjectDoc() {
    return await rpc('get_project_doc', { p_token: tokenOrThrow() });
  }

  // Phase 1: bucket is public read, so we build the URL directly
  // instead of round-tripping through a signing RPC. The path is
  // expected to be relative to the bucket root (e.g.
  // "cor_slide_1_10/sections/0/he.tif"). Returns a Promise so
  // callers using `await` keep working.
  function getSignedUrl(path) {
    if (!path) return Promise.resolve(null);
    const safe = path.split('/').map(encodeURIComponent).join('/');
    return Promise.resolve(`${URL_}/storage/v1/object/public/atlases/${safe}`);
  }

  async function listRois(sectionId) {
    return await rpc('list_rois', { p_token: tokenOrThrow(), p_section_id: sectionId });
  }

  async function createRoi(sectionId, colorKey, polyMsi, createdBy) {
    return await rpc('create_roi', {
      p_token: tokenOrThrow(),
      p_section_id: sectionId,
      p_color_key: colorKey,
      p_poly_msi: polyMsi,
      p_created_by: createdBy || 'anonymous',
    });
  }

  async function updateRoi(id, expectedVersion, colorKey, polyMsi) {
    return await rpc('update_roi', {
      p_token: tokenOrThrow(),
      p_id: id,
      p_expected_version: expectedVersion,
      p_color_key: colorKey,
      p_poly_msi: polyMsi,
    });
  }

  async function deleteRoi(id) {
    return await rpc('delete_roi', { p_token: tokenOrThrow(), p_id: id });
  }

  async function clearAllRois() {
    return await rpc('clear_all_rois', { p_token: tokenOrThrow() });
  }

  window.SupabaseClient = {
    PROJECT_SLUG: SLUG,
    isAuthenticated, getToken, getRole, isAdmin,
    getDisplayName, setDisplayName,
    unlock, logout,
    getProjectDoc, getSignedUrl,
    listRois, createRoi, updateRoi, deleteRoi, clearAllRois,
  };
})();
