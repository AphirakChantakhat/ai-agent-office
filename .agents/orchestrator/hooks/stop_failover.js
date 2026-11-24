/**
 * Stop Lifecycle Hook
 * Detects if the agent loop terminated abnormally due to ERROR (Rate Limit / 429 / Quota)
 * or MAX_TOKEN_BUDGET_EXCEEDED, automatically promotes active departments to Tier 2/3 Failover,
 * and instructs the agent to continue by delegating to the fallback subagent model (`pro` / `flash`).
 */

const fs = require('fs');
const path = require('path');
const { getModelForRoleTier } = require('../model_router');

const STATE_FILE = path.join(__dirname, '..', '..', 'state', 'team_status.json');

let inputData = '';
process.stdin.on('data', chunk => { inputData += chunk; });
process.stdin.on('end', () => {
  try {
    const payload = inputData ? JSON.parse(inputData) : {};
    const reason = payload.terminationReason || '';
    const errText = (payload.error || '').toLowerCase();
    const execNum = payload.executionNum || 1;

    const isLimitOrError =
      reason === 'MAX_TOKEN_BUDGET_EXCEEDED' ||
      (reason === 'ERROR' && (
        errText.includes('limit') ||
        errText.includes('quota') ||
        errText.includes('429') ||
        errText.includes('exhausted') ||
        errText.includes('token') ||
        errText.includes('overloaded') ||
        errText.includes('capacity')
      ));

    if (isLimitOrError && execNum <= 2 && fs.existsSync(STATE_FILE)) {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      const switchedRoles = [];
      const timeStr = new Date().toTimeString().split(' ')[0];

      for (const [roleKey, agent] of Object.entries(state.agents || {})) {
        if (agent.status === 'working' || agent.status === 'active') {
          const prevTier = agent.model_tier || 1;
          const nextTier = Math.min(3, prevTier + 1);
          const nextModel = getModelForRoleTier(roleKey, nextTier);
          agent.model_tier = nextTier;
          agent.active_model = nextModel.name;
          agent.model_short = nextModel.short;
          agent.model_provider = nextModel.provider;
          switchedRoles.push(`@${roleKey} -> ${nextModel.name} (Model="${nextModel.subagentModel}")`);
        }
      }

      if (switchedRoles.length > 0) {
        state.recent_logs = state.recent_logs || [];
        state.recent_logs.push(`[${timeStr}] @all [AUTO-FAILOVER]: Token/Rate limit detected (${reason}). Promoted active roles: ${switchedRoles.join(', ')}`);
        while (state.recent_logs.length > 20) state.recent_logs.shift();
        state.last_updated = new Date().toISOString();
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');

        process.stdout.write(JSON.stringify({
          decision: 'continue',
          reason: `[ZERO-DOWNTIME AUTO-FAILOVER]: Rate/Token limit detected (${reason}). Active roles have been switched to fallback tiers (${switchedRoles.join(', ')}). Delegate the remaining work via invoke_subagent immediately.`
        }));
        return;
      }
    }
  } catch (e) {
    // Allow normal stop on hook error
  }

  process.stdout.write(JSON.stringify({ decision: 'allow' }));
});
