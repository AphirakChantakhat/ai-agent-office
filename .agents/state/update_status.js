const fs = require('fs');
const path = require('path');
const { ROLE_MODEL_MATRIX, getModelForRoleTier } = require('../orchestrator/model_router');

const STATE_FILE = path.join(__dirname, 'team_status.json');

function ensureAgentModelFields(state) {
  if (!state || !state.agents) return;
  for (const [roleKey, agent] of Object.entries(state.agents)) {
    const matrix = ROLE_MODEL_MATRIX[roleKey];
    if (!matrix) continue;
    const tier = agent.model_tier || 1;
    const activeModelObj = getModelForRoleTier(roleKey, tier);
    agent.model_tier = tier;
    agent.active_model = activeModelObj.name;
    agent.model_short = activeModelObj.short;
    agent.model_provider = activeModelObj.provider;
    agent.tier1_model = matrix.tier1.name;
    agent.tier2_model = matrix.tier2.name;
    agent.tier3_model = matrix.tier3.name;
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage:');
  console.log('  Role update:   node update_status.js <role_key|all> <working|done|idle> "[dialogue]" [phase_index] "[phase_name]"');
  console.log('  Prompt update: node update_status.js prompt "<prompt_text>" <in_progress|completed|standby> "[summary]"');
  console.log('  Model failover: node update_status.js failover <role_key|all> <1|2|3> "[reason]"');
  process.exit(1);
}

try {
  let state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  ensureAgentModelFields(state);

  // Model Failover Mode
  if (args[0] === 'failover') {
    const [_, targetRole, tierArg, reason] = args;
    const newTier = Math.min(3, Math.max(1, parseInt(tierArg || '2', 10)));
    const timeStr = new Date().toTimeString().split(' ')[0];
    state.recent_logs = state.recent_logs || [];

    const rolesToUpdate = targetRole === 'all' ? Object.keys(state.agents) : [targetRole];
    for (const r of rolesToUpdate) {
      if (!state.agents[r]) continue;
      const prevModel = state.agents[r].active_model;
      const nextModelObj = getModelForRoleTier(r, newTier);
      state.agents[r].model_tier = newTier;
      state.agents[r].active_model = nextModelObj.name;
      state.agents[r].model_short = nextModelObj.short;
      state.agents[r].model_provider = nextModelObj.provider;

      const logMsg = newTier === 1
        ? `[${timeStr}] @${r} [${nextModelObj.short}]: [RESTORED] Restored to Primary Tier 1 model (${nextModelObj.name})`
        : `[${timeStr}] @${r} [${nextModelObj.short} // T${newTier} FALLBACK]: [FAILOVER] Switched from ${prevModel} -> ${nextModelObj.name} (${reason || 'Rate limit protection'})`;
      state.recent_logs.push(logMsg);
    }
    while (state.recent_logs.length > 20) state.recent_logs.shift();

    state.last_updated = new Date().toISOString();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    console.log(`✅ Model failover updated: @${targetRole} -> Tier ${newTier}`);
    process.exit(0);
  }

  // Prompt Tracker Mode
  if (args[0] === 'prompt') {
    const [_, promptText, status, summary] = args;
    const now = new Date().toLocaleTimeString('th-TH');

    state.prompt_tracker = {
      current_prompt: promptText || state.prompt_tracker?.current_prompt || 'ไม่มีคำสั่งค้าง',
      status: status || 'completed', // 'in_progress' | 'completed' | 'standby'
      summary: summary || state.prompt_tracker?.summary || '',
      updated_at: now
    };

    if (status === 'completed') {
      for (const r of Object.keys(state.agents)) {
        if (state.agents[r].status === 'working' || state.agents[r].status === 'active' || state.agents[r].status === 'done') {
          state.agents[r].status = 'done';
          state.agents[r].badge = '✅ COMPLETED';
        }
      }
      state.phase_index = 5;
      state.active_phase = "🎉 ทุกแผนกส่งมอบงานเสร็จสมบูรณ์เรียบร้อย (All 5 Steps Completed)";
    } else if (status === 'standby') {
      for (const r of Object.keys(state.agents)) {
        state.agents[r].status = 'idle';
        state.agents[r].badge = '⚪ Standby';
      }
      state.phase_index = 0;
      state.active_phase = "⚪ Standby • ทุกคนฟุบหลับพักผ่อนบนโต๊ะรอรับงาน";
    }

    state.last_updated = new Date().toISOString();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    console.log(`✅ Prompt status updated: [${status.toUpperCase()}] ${promptText}`);
    process.exit(0);
  }

  // Normal Role Update Mode
  const [roleKey, status, dialogue, phaseIndexArg, phaseNameArg] = args;

  const getBadgeForStatus = (s) => {
    if (s === 'working' || s === 'active') return '🟢 WORKING';
    if (s === 'done' || s === 'completed') return '✅ COMPLETED';
    return '⚪ Standby';
  };

  if (roleKey === 'all') {
    for (const r of Object.keys(state.agents)) {
      state.agents[r].status = status;
      state.agents[r].badge = getBadgeForStatus(status);
      if (dialogue) state.agents[r].dialogue = dialogue;
    }
  } else if (state.agents[roleKey]) {
    state.agents[roleKey].status = status;
    state.agents[roleKey].badge = getBadgeForStatus(status);
    if (dialogue) state.agents[roleKey].dialogue = dialogue;
  }

  if (phaseIndexArg !== undefined) {
    state.phase_index = parseInt(phaseIndexArg, 10);
  }
  if (phaseNameArg !== undefined) {
    state.active_phase = phaseNameArg;
  }

  state.last_updated = new Date().toISOString();

  // Add log with Model Tag
  const timeStr = new Date().toTimeString().split(' ')[0];
  const modelTag = state.agents[roleKey] ? ` [${state.agents[roleKey].model_short}]` : '';
  state.recent_logs = state.recent_logs || [];
  state.recent_logs.push(`[${timeStr}] @${roleKey}${modelTag}: [${status.toUpperCase()}] ${dialogue || 'Updated state'}`);
  if (state.recent_logs.length > 20) state.recent_logs.shift();

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  console.log(`✅ State updated: @${roleKey}${modelTag} is now ${status}`);
} catch (err) {
  console.error('Failed to update state:', err.message);
}
