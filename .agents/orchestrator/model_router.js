/**
 * Multi-Model Dynamic Orchestrator & 3-Tier Cross-Provider Failover Engine
 * Maps the 6 AI Engineering Roles to the 5 specialized models with zero-downtime failover
 * and automatic `invoke_subagent` Model parameter rewriting via Lifecycle Hooks.
 */

const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '..', 'state', 'team_status.json');

const MODEL_CATALOG = {
  OPUS_5_5: {
    id: 'claude-opus-5.5',
    name: 'Claude opus 5.5',
    short: 'OPUS 5.5',
    provider: 'Anthropic',
    subagentModel: 'inherit', // Uses UI-selected Claude model
    strengths: 'Deep architectural reasoning, ERD & system specification, complex decision making'
  },
  SONNET_5_5: {
    id: 'claude-sonnet-5.5',
    name: 'Claude sonnet 5.5',
    short: 'SONNET 5.5',
    provider: 'Anthropic',
    subagentModel: 'inherit', // Uses UI-selected Claude model
    strengths: 'High-velocity full-stack implementation, SQL, REST APIs, and precision UI components'
  },
  ARGON_4: {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    short: 'ARGON 4',
    provider: 'Google',
    subagentModel: 'pro', // Forces Antigravity subagent to use Gemini 4 Argon (Pro) quota
    strengths: 'Massive context window, cross-repository analysis, security auditing & DevOps pipelines'
  },
  FLASH_3_8: {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    short: 'FLASH 3.8',
    provider: 'Google',
    subagentModel: 'flash', // Forces Antigravity subagent to use Gemini 3.8 Flash quota
    strengths: 'Ultra-low latency, token-efficient automated testing, XML/JSON validation & QA checks'
  },
  GPT_OSS: {
    id: 'gpt-oss',
    name: 'Gpt-oss',
    short: 'GPT-OSS',
    provider: 'Open-Source',
    subagentModel: 'flash_lite', // Forces Antigravity subagent to ultra-lightweight tier when in emergency fallback
    strengths: 'Unrestricted local/CLI automation, background scripts, and rate-limit immune fallback'
  }
};

const ROLE_MODEL_MATRIX = {
  'pm-lead': {
    roleName: 'PM / Tech Lead',
    tier1: MODEL_CATALOG.OPUS_5_5,
    tier2: MODEL_CATALOG.ARGON_4,
    tier3: MODEL_CATALOG.FLASH_3_8
  },
  'architect': {
    roleName: 'System Architect',
    tier1: MODEL_CATALOG.OPUS_5_5,
    tier2: MODEL_CATALOG.ARGON_4,
    tier3: MODEL_CATALOG.GPT_OSS
  },
  'frontend-dev': {
    roleName: 'Frontend Specialist',
    tier1: MODEL_CATALOG.SONNET_5_5,
    tier2: MODEL_CATALOG.ARGON_4,
    tier3: MODEL_CATALOG.FLASH_3_8
  },
  'backend-dev': {
    roleName: 'Backend Specialist',
    tier1: MODEL_CATALOG.SONNET_5_5,
    tier2: MODEL_CATALOG.ARGON_4,
    tier3: MODEL_CATALOG.GPT_OSS
  },
  'qa-tester': {
    roleName: 'QA Tester',
    tier1: MODEL_CATALOG.FLASH_3_8,
    tier2: MODEL_CATALOG.GPT_OSS,
    tier3: MODEL_CATALOG.ARGON_4
  },
  'devops-sec': {
    roleName: 'DevOps & Security',
    tier1: MODEL_CATALOG.ARGON_4,
    tier2: MODEL_CATALOG.FLASH_3_8,
    tier3: MODEL_CATALOG.GPT_OSS
  }
};

/**
 * Detect which of the 6 roles matches a subagent's Role title or Prompt text.
 */
function inferRoleFromSubagent(roleTitle = '', promptText = '', typeName = '') {
  const combined = `${roleTitle} ${promptText} ${typeName}`.toLowerCase();

  if (combined.includes('qa') || combined.includes('test') || combined.includes('verify') || combined.includes('validate') || typeName === 'research') {
    if (combined.includes('security') || combined.includes('devops') || combined.includes('docker')) {
      return 'devops-sec';
    }
    if (combined.includes('architect') || combined.includes('schema') || combined.includes('erd') || combined.includes('service.xlsx')) {
      return 'architect';
    }
    return 'qa-tester';
  }
  if (combined.includes('devops') || combined.includes('security') || combined.includes('audit') || combined.includes('docker') || combined.includes('deploy')) {
    return 'devops-sec';
  }
  if (combined.includes('architect') || combined.includes('design') || combined.includes('erd') || combined.includes('blueprint') || combined.includes('spec')) {
    return 'architect';
  }
  if (combined.includes('frontend') || combined.includes('ui') || combined.includes('css') || combined.includes('dashboard') || combined.includes('vtm')) {
    return 'frontend-dev';
  }
  if (combined.includes('pm') || combined.includes('lead') || combined.includes('standup') || combined.includes('plan')) {
    return 'pm-lead';
  }
  return 'backend-dev';
}

/**
 * Classify a prompt/task description and return the primary responsible role + recommended model.
 */
function routeTask(taskDescription = '') {
  const role = inferRoleFromSubagent('', taskDescription, '');
  return {
    role,
    matrix: ROLE_MODEL_MATRIX[role],
    reason: `Mapped to @${role}`
  };
}

/**
 * Get the active model object for a given role and tier (1, 2, or 3).
 */
function getModelForRoleTier(roleKey, tier = 1) {
  const entry = ROLE_MODEL_MATRIX[roleKey];
  if (!entry) return MODEL_CATALOG.ARGON_4;
  if (tier === 2) return entry.tier2;
  if (tier === 3) return entry.tier3;
  return entry.tier1;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'matrix';

  if (cmd === 'matrix') {
    console.log('=== MULTI-MODEL 3-TIER FAILOVER MATRIX (WITH SUBAGENT ROUTING) ===');
    for (const [role, info] of Object.entries(ROLE_MODEL_MATRIX)) {
      console.log(
        `@${role.padEnd(13)} | T1: ${info.tier1.name.padEnd(17)} (${info.tier1.subagentModel.padEnd(10)}) | T2: ${info.tier2.name.padEnd(17)} (${info.tier2.subagentModel.padEnd(10)}) | T3: ${info.tier3.name} (${info.tier3.subagentModel})`
      );
    }
  } else if (cmd === 'route') {
    const task = args.slice(1).join(' ');
    const res = routeTask(task);
    console.log(JSON.stringify({
      recommended_role: `@${res.role}`,
      tier1_primary: res.matrix.tier1.name,
      tier2_failover: res.matrix.tier2.name,
      tier3_emergency: res.matrix.tier3.name,
      subagent_model_param: res.matrix.tier1.subagentModel
    }, null, 2));
  }
}

module.exports = {
  MODEL_CATALOG,
  ROLE_MODEL_MATRIX,
  inferRoleFromSubagent,
  routeTask,
  getModelForRoleTier
};
