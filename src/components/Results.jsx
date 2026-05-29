import { AXES, AXE_LABELS } from '../utils/calculator';

export default function Results({ results, onRestart }) {
  const { scores, ideologyMatches, topTags } = results;

  const getShareUrl = () => {
    const params = new URLSearchParams();
    params.set('a', AXES.map(axis => scores[axis]).join(','));
    if (topTags.length > 0) {
      params.set('t', topTags.map(t => t.id).join(','));
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    const top3 = ideologyMatches.map(i => `${i.name}(${i.match}%)`).join('、');
    const tags = topTags.slice(0, 3).map(t => t.emoji + t.name).join(' ');
    return `我的科技理念测试结果：\n${top3}\n\n标签：${tags}\n\n来测测你的：`;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    const text = getShareText() + '\n' + url;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TechValues 测试结果', text, url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板！');
    }
  };

  return (
    <main className="results">
      <h2 className="results-title">你的科技理念测试结果</h2>

      <section className="results-section">
        <h3>四维立场</h3>
        <div className="axes-detail">
          {AXES.map(axis => (
            <div key={axis} className="axis-bar">
              <span className="axis-label">{AXE_LABELS[axis].left}</span>
              <div className="axis-track">
                <div
                  className="axis-fill"
                  style={{
                    width: `${scores[axis]}%`,
                    backgroundColor: AXE_LABELS[axis].color
                  }}
                />
              </div>
              <span className="axis-label">{AXE_LABELS[axis].right}</span>
              <span className="axis-value">{scores[axis]}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="results-section">
        <h3>最匹配的意识形态</h3>
        <div className="ideology-cards">
          {ideologyMatches.map((ideology, i) => (
            <div key={ideology.id} className={`ideology-card rank-${i + 1}`}>
              <div className="rank-badge">#{i + 1}</div>
              <h4>{ideology.name}</h4>
              <p className="ideology-desc">{ideology.desc}</p>
              <div className="match-score">
                <div className="match-bar">
                  <div className="match-fill" style={{ width: `${ideology.match}%` }} />
                </div>
                <span>{ideology.match}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {topTags.length > 0 && (
        <section className="results-section">
          <h3>你的次级标签</h3>
          <div className="tags-container">
            {topTags.map(tag => (
              <span key={tag.id} className="tag-badge" title={tag.desc}>
                <span className="tag-emoji">{tag.emoji}</span>
                <span className="tag-name">{tag.name}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="results-actions">
        <button className="btn-share" onClick={handleShare}>
          分享结果
        </button>
        <button className="btn-restart" onClick={onRestart}>
          重新测试
        </button>
      </div>
    </main>
  );
}
