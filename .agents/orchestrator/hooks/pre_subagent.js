/**
 * PreToolUse Lifecycle Hook for `invoke_subagent`
 * 1. Detects which of the 6 departments is being invoked.
 * 2. Reads current failover tier (T1, T2, T3) from team_status.json.
 * 3. Automatically overwrites `Model` in `invoke_subagent` args (`inherit`, `pro`, `flash`, `flash_lite`)
 *    so each department consumes its dedicated AI model quota (and automatically switches on rate limit).
 * 4. Synchronizes the live Virtual Office Dashboard room status immediately.
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

    const roleKey = inferRoleFromSubagent(args.Role || '', args.Prompt || '', args.TypeName || '');
    let currentTier = 1;

    if (fs.existsSync(STATE_FILE)) {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      if (state.agents && state.agents[roleKey]) {
        currentTier = state.agents[roleKey].model_tier || 1;
      }

      const targetModelObj = getModelForRoleTier(roleKey, currentTier);

      // Update Live Virtual Office status for this role
      if (state.agents && state.agents[roleKey]) {
        state.agents[roleKey].status = 'working';
        state.agents[roleKey].badge = '🟢 WORKING';
        state.agents[roleKey].active_model = targetModelObj.name;
        state.agents[roleKey].model_short = targetModelObj.short;
        state.agents[roleKey].dialogue = (args.Role ? `[Subagent: ${args.Role}] ` : '') + (args.Prompt || '').slice(0, 90);
      }

      const timeStr = new Date().toTimeString().split(' ')[0];
      const tierBadge = currentTier > 1 ? `${targetModelObj.short} // T${currentTier} FALLBACK` : targetModelObj.short;
      state.recent_logs = state.recent_logs || [];
      state.recent_logs.push(`[${timeStr}] @${roleKey} [${tierBadge}]: [SUBAGENT] Dispatched (${targetModelObj.subagentModel}) -> ${args.Role || args.TypeName}`);
      while (state.recent_logs.length > 20) state.recent_logs.shift();
      state.last_updated = new Date().toISOString();

      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');

      // Overwrite the Model argument of invoke_subagent to enforce the role's model/tier
      const enforcedSubagentModel = targetModelObj.subagentModel;
      if (args.Model !== enforcedSubagentModel) {
        process.stdout.write(JSON.stringify({
          decision: 'allow',
          overwrite: {
            Model: enforcedSubagentModel
          }
        }));
        return;
      }
    }

    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  } catch (err) {
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  }
});
