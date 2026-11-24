/**
 * PostToolUse Lifecycle Hook for `invoke_subagent`
 * Automatically detects rate-limit / quota / token errors from a subagent call
 * and promotes that department to its next Failover Tier (T1 -> T2 -> T3) in team_status.json.
 */

const fs = require('fs');
const path = require('path');
const { inferRoleFromSubagent, getModelForRoleTier } = require('../model_router');

const STATE_FILE = path.join(__dirname, '..', '..', 'state', 'team_status.json');

let inputData = '';
process.stdin.on('data', chunk => { inputData += chunk; });
process.stdin.on('end', () => {
  try {
    const payload = inputData ? JSON.parse(inputData) : {};
    const toolCall = payload.toolCall || {};
    const args = toolCall.args || {};
    const errorText = (payload.error || '').toLowerCase();

    if (errorText && fs.existsSync(STATE_FILE)) {
      const roleKey = inferRoleFromSubagent(args.Role || '', args.Prompt || '', args.TypeName || '');
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));

      if (state.agents && state.agents[roleKey]) {
        const prevTier = state.agents[roleKey].model_tier || 1;
        const nextTier = Math.min(3, prevTier + 1);
        const prevModel = getModelForRoleTier(roleKey, prevTier);
        const nextModel = getModelForRoleTier(roleKey, nextTier);

        state.agents[roleKey].model_tier = nextTier;
        state.agents[roleKey].active_model = nextModel.name;
        state.agents[roleKey].model_short = nextModel.short;
        state.agents[roleKey].model_provider = nextModel.provider;

        const timeStr = new Date().toTimeString().split(' ')[0];
        state.recent_logs = state.recent_logs || [];
        state.recent_logs.push(
          `[${timeStr}] @${roleKey} [${nextModel.short} // T${nextTier} FALLBACK]: [AUTO-FAILOVER] Switched ${prevModel.name} -> ${nextModel.name} due to error: ${payload.error.slice(0, 80)}`
        );
        while (state.recent_logs.length > 20) state.recent_logs.shift();
        state.last_updated = new Date().toISOString();

        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
      }
    }
  } catch (err) {
    // Ignore errors in post hook
  }
  process.stdout.write(JSON.stringify({}));
});
