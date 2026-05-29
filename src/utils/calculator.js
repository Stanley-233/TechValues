import questions from '../data/questions.json';
import ideologies from '../data/ideologies.json';
import tags from '../data/tags.json';

const AXES = ['free_commercial', 'public_proprietary', 'individual_center', 'freedom_security'];

const AXE_LABELS = {
  free_commercial: { left: '免费', right: '商业', color: '#e74c3c' },
  public_proprietary: { left: '公共/开源', right: '专有/闭源', color: '#3498db' },
  individual_center: { left: '个体', right: '中心化', color: '#2ecc71' },
  freedom_security: { left: '自由', right: '安全', color: '#f39c12' }
};

export function calculateResults(answers) {
  const scores = {};
  AXES.forEach(axis => { scores[axis] = 50; });

  const tagScores = {};

  answers.forEach(({ questionId, option }) => {
    const question = questions.questions.find(q => q.id === questionId);
    if (!question) return;

    const multiplier = {
      'strongly_agree': 1.0,
      'agree': 0.5,
      'neutral': 0,
      'disagree': -0.5,
      'strongly_disagree': -1.0
    }[option] || 0;

    AXES.forEach(axis => {
      if (question.effect[axis]) {
        scores[axis] += question.effect[axis] * multiplier * 15;
      }
    });

    if (question.tags && question.tags[option]) {
      question.tags[option].forEach(tagId => {
        tagScores[tagId] = (tagScores[tagId] || 0) + 1;
      });
    }
  });

  AXES.forEach(axis => {
    scores[axis] = Math.max(0, Math.min(100, Math.round(scores[axis])));
  });

  const ideologyMatches = ideologies.ideologies.map(ideology => {
    let distance = 0;
    AXES.forEach(axis => {
      distance += Math.pow(scores[axis] - ideology.stats[axis], 2);
    });
    distance = Math.sqrt(distance);
    const maxDistance = Math.sqrt(4 * 10000);
    const match = Math.round((1 - distance / maxDistance) * 100);
    return { ...ideology, match };
  }).sort((a, b) => b.match - a.match).slice(0, 3);

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
