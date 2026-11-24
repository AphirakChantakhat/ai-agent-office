/**
 * PreInvocation Lifecycle Hook
 * 1. Detects the live `modelName` selected in the Antigravity UI and syncs it to `team_status.json`
 *    so the Virtual Office Dashboard (`http://localhost:3333`) reflects the real active model immediately.
 * 2. Injects a concise ephemeral directive on turn start reminding the primary agent
 *    to delegate multi-role or heavy research/QA/DevOps tasks via `invoke_subagent`.
 */

const fs = require('fs');
const path = require('path');
const { getModelForRoleTier } = require('../model_router');

const STATE_FILE = path.join(__dirname, '..', '..', 'state', 'team_status.json');

function parseUiModelName(rawModel = '') {
  const m = (rawModel || '').toLowerCase();
  if (m.includes('opus')) return { name: 'Claude opus 5.5', short: 'OPUS 5.5', provider: 'Anthropic' };
  if (m.includes('sonnet') || m.includes('claude')) return { name: 'Claude sonnet 5.5', short: 'SONNET 5.5', provider: 'Anthropic' };
  if (m.includes('gpt') || m.includes('oss')) return { name: 'Gpt-oss', short: 'GPT-OSS', provider: 'Open-Source' };
  if (m.includes('flash')) return { name: 'Gemini 3.8 Flash', short: 'FLASH 3.8', provider: 'Google' };
  if (m.includes('argon') || m.includes('pro') || m.includes('gemini')) return { name: 'Gemini 4 Argon', short: 'ARGON 4', provider: 'Google' };
  return null;
}

let inputData = '';
process.stdin.on('data', chunk => { inputData += chunk; });
process.stdin.on('end', () => {
  try {
    const payload = inputData ? JSON.parse(inputData) : {};
    const invocationNum = payload.invocationNum || 1;
    const uiModel = parseUiModelName(payload.modelName);

    let failoverSummary = '';
    if (fs.existsSync(STATE_FILE)) {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      let changed = false;

      if (uiModel) {
        state.session_model = {
          raw: payload.modelName,
          name: uiModel.name,
          short: uiModel.short,
          provider: uiModel.provider,
          updated_at: new Date().toLocaleTimeString('th-TH')
        };
        changed = true;
      }

      const activeFailovers = [];
      for (const [role, agent] of Object.entries(state.agents || {})) {
        const tier = agent.model_tier || 1;
        const m = getModelForRoleTier(role, tier);
        // Ensure agent model fields are always synced
        if (!agent.active_model || !agent.model_short) {
          agent.active_model = m.name;
          agent.model_short = m.short;
          agent.model_provider = m.provider;
          changed = true;
        }
        if (tier > 1) {
          activeFailovers.push(`@${role} -> Tier ${tier} (${m.name} / subagent Model="${m.subagentModel}")`);
        }
      }

      if (changed) {
        state.last_updated = new Date().toISOString();
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
      }

      if (activeFailovers.length > 0) {
        failoverSummary = ` | ACTIVE FAILOVERS: ${activeFailovers.join(', ')}`;
      }
    }

    // Only inject ephemeral instruction on the first invocation of a user turn to save tokens
    if (invocationNum > 1) {
      process.stdout.write(JSON.stringify({}));
      return;
    }

    const directive = `[AUTO-MODEL ROUTER HOOK]: When executing tasks across multiple departments or scanning multiple projects, delegate via invoke_subagent: @qa-tester/research -> Model:"flash" (Gemini 3.8 Flash), @devops-sec/deep-audit -> Model:"pro" (Gemini 4 Argon), @architect/@backend-dev/@frontend-dev -> Model:"inherit" (or failover tier). If any model hits rate/token limits, call 'node .agents/state/update_status.js failover <role> 2' and re-invoke.${failoverSummary}`;

    process.stdout.write(JSON.stringify({
      injectSteps: [
        {
          ephemeralMessage: directive
        }
      ]
    }));
  } catch (err) {
    process.stdout.write(JSON.stringify({}));
  }
});
