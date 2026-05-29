import questions from '../data/questions.json';
import ideologies from '../data/ideologies.json';
import tags from '../data/tags.json';

const AXES = ['free_commercial', 'public_proprietary', 'individual_center', 'freedom_security'];

const AXE_LABELS = {
  free_commercial: { left: '商业', right: '免费', color: '#e74c3c' },
  public_proprietary: { left: '专有/闭源', right: '公共/开源', color: '#3498db' },
  individual_center: { left: '中心化', right: '个体', color: '#2ecc71' },
  freedom_security: { left: '安全', right: '自由', color: '#f39c12' }
};

const OPTION_MULTIPLIER = {
  strongly_agree: 1.0,
  agree: 0.5,
  neutral: 0,
  disagree: -0.5,
  strongly_disagree: -1.0
};

const TAG_WEIGHT = {
  strongly_agree: 2,
  agree: 1,
  neutral: 0,
  disagree: 1,
  strongly_disagree: 2
};

const SCORE_SCALE = 3;

export function calculateResults(answers) {
  const scores = {};
  AXES.forEach(axis => {
    scores[axis] = 50;
  });

  const tagScores = {};

  answers.forEach(({ questionId, option }) => {
    const question = questions.questions.find(q => q.id === questionId);
    if (!question) return;

    const multiplier = OPTION_MULTIPLIER[option] ?? 0;

    AXES.forEach(axis => {
      const effect = question.effect?.[axis];

      if (typeof effect === 'number') {
        scores[axis] += effect * multiplier * SCORE_SCALE;
      }
    });

    const matchedTags = question.tags?.[option];

    if (Array.isArray(matchedTags)) {
      const weight = TAG_WEIGHT[option] ?? 0;

      matchedTags.forEach(tagId => {
        tagScores[tagId] = (tagScores[tagId] || 0) + weight;
      });
    }
  });

  AXES.forEach(axis => {
    scores[axis] = Math.max(0, Math.min(100, Math.round(scores[axis])));
  });

  const ideologyMatches = ideologies.ideologies
    .map(ideology => {
      let distance = 0;

      AXES.forEach(axis => {
        distance += Math.pow(scores[axis] - ideology.stats[axis], 2);
      });

      distance = Math.sqrt(distance);

      const maxDistance = Math.sqrt(AXES.length * 10000);
      const match = Math.round((1 - distance / maxDistance) * 100);

      return { ...ideology, match };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  const topTags = Object.entries(tagScores)
    .map(([id, score]) => {
      const tag = tags.tags.find(t => t.id === id);
      return tag ? { ...tag, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return { scores, ideologyMatches, topTags };
}

export { AXES, AXE_LABELS };
